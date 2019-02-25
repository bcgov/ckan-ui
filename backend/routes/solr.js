let express = require('express');
let router = express.Router();
let request = require('request');

/* GET solr listing. */
router.get('/select', function(req, res, next) {

  let config = require('config');
  let url = config.get('solr');
  let core = config.get('solrCore');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/" + core + "/query" + ((keys.length > 0) ? "?" : "");
  for (let i=0; i<keys.length; i++){
    reqUrl += keys[i] + "=" + req.query[keys[i]] + "&";
  }

  //if we added any we need to truncate them
  reqUrl = (keys.length > 0) ? reqUrl.substring(0, reqUrl.length-1) : reqUrl;

  request(reqUrl, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode != 200){
        console.log("Body Status? ", apiRes.statusCode);
    }

    try {
        var json = JSON.parse(body);
        res.json(json);
    }catch(ex){
        console.error("Error reading json from solr", ex);
        res.json({error: ex});
    }
  });

});

module.exports = router;
