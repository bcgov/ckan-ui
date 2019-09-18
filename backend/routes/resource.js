let express = require('express');
let router = express.Router();
let request = require('request');
let auth = require('../modules/auth');

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

    try {
        let json = JSON.parse(body);

        let resourceUrl = json.result.url;

        //TODO: TEMP
        //tempOverride
        resourceUrl = resourceUrl.replace("http://localhost:5000", "https://catalogue.data.gov.bc.ca");
        resourceUrl = resourceUrl.replace("http://127.0.0.1:5000", "https://catalogue.data.gov.bc.ca");

        let responseData = "";
        let responseObj = {};
        responseObj.metadata = json && json.result ? json.result : {};

        request(resourceUrl, authObj, function(err, apiRes, body){
            let csvFormats = [
                'application/octet-stream',
                'text/plain; charset=UTF-8',
                'text/plain; charset=UTF-16',
                'text/plain; charset=UTF-32',
            ];

            let xlsFormats = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];

            responseObj['content-type'] = apiRes.headers['content-type'];
            responseObj['content-length'] = apiRes.headers['content-length'];
            responseObj.status = apiRes.headers.statusCode;
            responseObj.origUrl = resourceUrl;

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
                }catch(ex){
                    responseObj.type = "404";
                    responseObj.type = "error";    
                }
            }else if (apiRes.headers.statusCode === 404){
                responseObj.type = "404";
            }

            responseObj.raw_data = body;
            res.json(responseObj);
            return;
    });

        // request(resourceUrl, authObj, function(err2, apiRes2, body2){
        //     let request = this;
        //     if (err2) {
        //       console.log(err2);
        //       res.json({error: err2});
        //       return;
        //     }
        //     if (apiRes2.statusCode != 200){
        //         console.log("Body Status? ", apiRes2.statusCode);
        //     }
        //
        //     res.json(responseObj);
        //
        // }).on('data', function(data){
        //     responseData += data;
        // });


    }catch(ex){
        console.error("Error reading json from ckan", ex);
        res.json({error: ex});
    }
  });

});

module.exports = router;
