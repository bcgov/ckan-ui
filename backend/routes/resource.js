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
      }
  }

  let reqUrl = url + "/api/3/action/resource_show?id="+req.params.id

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

        //tempOverride
        resourceUrl = resourceUrl.replace("http://localhost:5000", "https://catalogue.data.gov.bc.ca")
        resourceUrl = resourceUrl.replace("http://127.0.0.1:5000", "https://catalogue.data.gov.bc.ca")

        let responseData = ""
        let responseObj = {}

        request.get(resourceUrl, authObj).on('data', function(data){
            responseData += data;
            if (responseData.length >= 10000){
                this.abort();
            }
        }).on('end', function(){

            let xlsFormats = ['application/octet-stream', 'text/plain; charset=UTF-8', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

            responseObj['content-type'] = this.response.headers['content-type']
            responseObj['content-length'] = this.response.headers['content-length']
            responseObj['status'] = this.response.headers['status'];

            if (xlsFormats.indexOf(responseObj['content-type']) !== -1) {
                let XLSX = require('xlsx');
                let workbook = XLSX.read(responseData, {type: "string"});
                let sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                responseObj['workbook'] = sheetJson;
                let headerKeys = Object.keys(sheetJson[0])
                let headers = []
                for (let i=0; i<headerKeys.length; i++){
                    headers.push({text: headerKeys[i], value: headerKeys[i]});
                }
                responseObj['headers'] = headers
            }

            responseObj['raw_data'] = responseData;
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
