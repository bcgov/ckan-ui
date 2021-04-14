let express = require('express');
let router = express.Router();
let request = require('request');
let auth = require('../modules/auth');
let stringify = require('json-stringify-safe')
/* GET one resource. */
router.get('/:id', auth.removeExpired, function(req, res, next) {
  let config = require('config');

  let url = config.get('ckan');

  let authObj = {};

  if (req.user){
      authObj = {
          'auth': {
              'bearer': req.user.jwt
          }
      };
  }

  let reqUrl = url + "/api/3/action/resource_show?id="+req.params.id;

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode != 200){
        console.log("Body Status? ", apiRes.statusCode);
    }

    let json = {};

    try {
        json = JSON.parse(body);
    }catch(ex){
        console.error("Error reading json from ckan", ex);
        res.json({error: ex});
    }

    let responseObj = json.result;
    try{

        let resourceUrl = responseObj.url;

        responseObj.metadata = responseObj ? responseObj : {};

        //only use auth object for object stored in ckan
        if ((req.user) && (resourceUrl.indexOf(url) === 0)){
            authObj = {
                'auth': {
                    'bearer': req.user.jwt
                }
            };
        }else{
            authObj = {};
        }

        request(resourceUrl, authObj, async function(err, apiRes, body){
            var getResourceSchema = async function(resource, headers, data) {
                const Schema = require('jsontableschema').Schema;
                var infer = require('jsontableschema').infer;

                let s = null;
                if (resource && resource.json_table_schema){
                    s = resource.json_table_schema;
                    try{
                        let model = await new Schema(s);
                        return model;
                    }catch(e){
                        console.error(e);
                    }
                    return {};

                } else if (headers.length>0 && data.length>0){
                    let options = {
                        rowLimit: 2,
                    };
                    s = await infer(headers, data, options);
                    return s;
                }
            }
            let csvFormats = [
                'application/octet-stream',
                'text/plain; charset=UTF-8',
                'text/plain; charset=UTF-16',
                'text/plain; charset=UTF-32',
                'text/csv'
            ];

            let xlsFormats = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];

            if(apiRes!=undefined) {
                responseObj['content-type'] = apiRes.headers['content-type'];
                responseObj['content-length'] = apiRes.headers['content-length'];
                responseObj.status = apiRes.headers.statusCode;
                responseObj.origUrl = resourceUrl;



                responseObj.schema = null
                responseObj.hasSchema = false;
                responseObj.schemaError = null
                responseObj.type = "unknown"

                if (xlsFormats.indexOf(apiRes.headers['content-type']) !== -1) {
                    responseObj.type = "xls";
                }else if (csvFormats.indexOf(apiRes.headers['content-type']) !== -1) {
                    let XLSX = require('xlsx');
                    try{
                        let workbook = XLSX.read(body, {type: "string", WTF: true});
                        let sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                        responseObj.workbook = sheetJson;
                        let headerKeys = Object.keys(sheetJson[0]);
                        let headers = [];
                        for (let i=0; i<headerKeys.length; i++){
                            headers.push({text: headerKeys[i], value: headerKeys[i]});
                        }
                        responseObj.headers = headers;
                        responseObj.type = "csv";
                        responseObj.data = body
                        if(!responseObj.json_table_schema) {
                            try {

                                let s = await getResourceSchema(null, responseObj.headers, responseObj.data);
                                responseObj.schema = JSON.parse(JSON.stringify(s));
                                responseObj.schemaInferred = false
                                responseObj.hasSchema = typeof(responseObj.schema) !== "undefined" && Object.keys(responseObj.schema).length > 0;
                                // responseObj.hasSchema = false;
                                // responseObj.metadata = apiRes.metadata
                            } catch (e) {
                                responseObj.schema = null
                                responseObj.schemaInferred = false
                                responseObj.schemaError = e[0];
                                // responseObj.metadata = apiRes.metadata
                            }
                        }
                    }catch(ex){
                        responseObj.type = "404";
                        responseObj.type = "error";
                    }
                } else if (apiRes.headers.statusCode === 404 || apiRes.headers.statusCode === 500 || apiRes.headers.statusCode === 401 || apiRes.headers.statusCode === 403){
                    responseObj.type = "404";
                } else if (apiRes.headers['content-type'] === "application/pdf"){
                    responseObj.type = "pdf"
                    responseObj.url = resourceUrl
                    var btoa = require('btoa');
                    responseObj.raw_data = btoa(unescape(encodeURIComponent(body)))
                } else {
                    if(!body) {
                        responseObj.hasSchema = false
                    }
                }
            }

            if((responseObj.schema===null) && responseObj.json_table_schema && (Object.keys(responseObj.json_table_schema).length > 0) ) {
                try{
                    let s = await getResourceSchema(responseObj, [], []);
                    console.log("INFERRED", s);
                    responseObj.schema = JSON.parse(JSON.stringify(s));
                    responseObj.schemaInferred = false;
                    console.log("INFERRED", s);
                    responseObj.hasSchema = responseObj.schema !== null && Object.keys(responseObj.schema).length > 0;
                }catch(e){
                    responseObj.schema = null;
                    responseObj.schemaError = e[0];
                    responseObj.schemaInferred = false;
                    responseObj.hasSchema = false;
                }
            }
            responseObj.raw_data = body;
            if (err){
                responseObj.type="error";
                responseObj.error = err;
            }
            var stringObject = stringify(responseObj);
            var returnObj = JSON.parse(stringObject);
            res.json(returnObj);
            return;
    });

    }catch(ex){
        console.error("Error reading resource", ex);
        res.json({resource: json.result, error: ex});
    }
  });

});

router.get('/preview/:resourceUrl', auth.removeExpired, function(req, res, next){
    let config = require('config');
    let url = config.get('ckan');

    let resourceUrl = req.params.resourceUrl

    let authObj = {};

    //only use auth object for object stored in ckan
    if ((req.user) && (resourceUrl.indexOf(url) === 0)){
        authObj = {
            'auth': {
                'bearer': req.user.jwt
            }
        };
    }
    
    let responseObj = {}

    request(resourceUrl, authObj, async function(err, apiRes, body){
        var getResourceSchema = async function(resource, headers, data) {
            const Schema = require('jsontableschema').Schema;
            var infer = require('jsontableschema').infer;

            let s = null;
            if (resource && resource.json_table_schema){
                s = resource.json_table_schema;
                try{
                    let model = await new Schema(s);
                    return model;
                }catch(e){
                    console.error(e);
                }
                return {};

            } else if (headers.length>0 && data.length>0){
                let options = {
                    rowLimit: 2,
                };
                s = await infer(headers, data, options);
                return s;
            }
        }
        let csvFormats = [
            'application/octet-stream',
            'text/plain; charset=UTF-8',
            'text/plain; charset=UTF-16',
            'text/plain; charset=UTF-32',
            'text/csv'
        ];

        let xlsFormats = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if(apiRes!=undefined) {
            responseObj['content-type'] = apiRes.headers['content-type'];
            responseObj['content-length'] = apiRes.headers['content-length'];
            responseObj.status = apiRes.headers.statusCode;
            responseObj.origUrl = resourceUrl;



            responseObj.schema = null
            responseObj.hasSchema = false;
            responseObj.schemaError = null
            responseObj.type = "unknown"

            if (xlsFormats.indexOf(apiRes.headers['content-type']) !== -1) {
                responseObj.type = "xls";
            }else if (csvFormats.indexOf(apiRes.headers['content-type']) !== -1) {
                let XLSX = require('xlsx');
                try{
                    let workbook = XLSX.read(body, {type: "string", WTF: true});
                    let sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                    responseObj.workbook = sheetJson;
                    let headerKeys = Object.keys(sheetJson[0]);
                    let headers = [];
                    for (let i=0; i<headerKeys.length; i++){
                        headers.push({text: headerKeys[i], value: headerKeys[i]});
                    }
                    responseObj.headers = headers;
                    responseObj.type = "csv";
                    responseObj.data = body
                    if(!responseObj.json_table_schema) {
                        try {

                            let s = await getResourceSchema(null, responseObj.headers, responseObj.data);
                            responseObj.schema = JSON.parse(JSON.stringify(s));
                            responseObj.schemaInferred = false
                            responseObj.hasSchema = typeof(responseObj.schema) !== "undefined" && Object.keys(responseObj.schema).length > 0;
                            // responseObj.hasSchema = false;
                            // responseObj.metadata = apiRes.metadata
                        } catch (e) {
                            responseObj.schema = null
                            responseObj.schemaInferred = false
                            responseObj.schemaError = e[0];
                            // responseObj.metadata = apiRes.metadata
                        }
                    }
                }catch(ex){
                    responseObj.type = "404";
                    responseObj.type = "error";
                }
            } else if (apiRes.headers.statusCode === 404 || apiRes.headers.statusCode === 500 || apiRes.headers.statusCode === 401 || apiRes.headers.statusCode === 403){
                responseObj.type = "404";
            } else if (apiRes.headers['content-type'] === "application/pdf"){
                responseObj.type = "pdf"
                responseObj.url = resourceUrl
                var btoa = require('btoa');
                responseObj.raw_data = btoa(unescape(encodeURIComponent(body)))
            } else {
                if(!body) {
                    responseObj.hasSchema = false
                }
            }
        }

        if((responseObj.schema===null) && responseObj.json_table_schema && (Object.keys(responseObj.json_table_schema).length > 0) ) {
            try{
                let s = await getResourceSchema(responseObj, [], []);
                responseObj.schema = JSON.parse(JSON.stringify(s));
                responseObj.schemaInferred = false;
                responseObj.hasSchema = responseObj.schema !== null && Object.keys(responseObj.schema).length > 0;
            }catch(e){
                responseObj.schema = null;
                responseObj.schemaError = e[0];
                responseObj.schemaInferred = false;
                responseObj.hasSchema = false;
            }
        }
        responseObj.raw_data = body;
        if (err){
            responseObj.type="error";
            responseObj.error = err;
        }
        var stringObject = stringify(responseObj);
        var returnObj = JSON.parse(stringObject);
        res.json(returnObj);
        return;
    });

});

module.exports = router;
