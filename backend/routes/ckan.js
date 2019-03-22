let express = require('express');
let router = express.Router();
let request = require('request');
let auth = require('../modules/auth');
const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

/* GET search ckan datasets. */
router.get('/search', auth.removeExpired, function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/package_search?"
  for (let i=0; i<keys.length; i++){
    reqUrl += keys[i] + "=" + req.query[keys[i]] + "&";
  }
  //if we added any we need to truncate them
  reqUrl = (keys.length > 0) ? reqUrl.substring(0, reqUrl.length-1) : reqUrl;

  let authObj = {};

  if (req.user){
      authObj = {
          'auth': {
              'bearer': req.user.jwt
          }
      }
  }

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
        res.json(json);
    }catch(ex){
        console.error("Error reading json from ckan", ex);
        res.json({error: ex});
    }
  });

});

/* GET one dataset. */
router.get('/getDataset', auth.removeExpired, function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/package_show";

  if (typeof(req.query.id) === "undefined"){
      res.json({error: "query parameter id is required"});
      return;
  }

  reqUrl += "?id="+req.query.id;

  let authObj = {};

  if (req.user){
     authObj = {
          'auth': {
              'bearer': req.user.jwt
          }
     }
  }

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
        res.json(json);
    }catch(ex){
        console.error("Error reading json from ckan", ex);
        res.json({error: ex});
    }
  });

});

/* GET one dataset. */
router.get('/getFacets', auth.removeExpired, function(req, res, next) {

  facets = {
      license_id: 'License',
      sector: 'Sectors',
      type: 'Dataset types',
      res_format: 'Format',
      organization: 'Organizations',
      download_audience: 'Download permission',
      edc_state: 'States' // normally only if admin, but what the hell
  }

  res.json(facets)

});

/* GET one dataset. */
router.get('/getOrganization', function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/organization_show";

  if (typeof(req.query.id) === "undefined"){
      res.json({error: "query parameter id is required"});
      return;
  }

  reqUrl += "?id="+req.query.id;

  let authObj = {};

  if (req.user) {
      authObj = {
          'auth': {
              'bearer': req.user.jwt
          }
      }
  }

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
        res.json(json);
    }catch(ex){
        console.error("Error reading json from ckan", ex);
        res.json({error: ex});
    }
  });

});

/* GET one dataset. */
router.get('/getOrganizations', function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');
  let orgCacheKey = 'orgDict';
  let orgTTL = 86400;

  //let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/organization_list_related?all_fields=True";

  let authObj = {};

  if (req.user){
    authObj = {
      'headers': {
        'Authorization': req.user.jwt
        }
    }
  }else{
    console.log("no user");
  }

  cache.get(orgCacheKey, function(err, value){
      if ( (!err) && (value !== undefined) ){
          console.log("CACHED VAL", value);
          res.json(value);
          return;
      }
      //if here there either was an error or it wasn't defined hit the api
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
          orgList = {}
          topLevelOrgs = []
          subOrgs = [];
          for (let i=0; i<json.result.length; i++) {
              let org = json.result[i];
            if (org.child_of.length == 0) {
              topLevelOrgs.push(org);
              if (typeof(orgList[org.title.trim()]) === "undefined"){
                 orgList[org.title.trim()] = {id: org.id, title: org.title, children: []};
              }else{
                  orgList[org.title.trim()]['id'] = org.id;
                  orgList[org.title.trim()]['title'] = org.title;
              }
            } else {
              subOrgs.push(org);
              for (let j=0; j<org.child_of.length; j++){
                  let parentOrg = org.child_of[j];
                  let orgItem = {title: org.title.trim(), id: org.id}
                  if (typeof(orgList[parentOrg.title.trim()]) === "undefined") {
                      orgList[parentOrg.title.trim()] = {}
                      orgList[parentOrg.title.trim()]['children'] = [orgItem]
                  }else if (typeof(orgList[parentOrg.title.trim()]['children']) === "undefined") {
                      orgList[parentOrg.title.trim()]['children'] = [orgItem]
                  }else{
                      orgList[parentOrg.title.trim()]['children'].push(orgItem)
                  }
              }
            }
          }

          let rv = {
              orgs: topLevelOrgs,
              suborgs: subOrgs,
              orgList: orgList
          };

          cache.set(orgCacheKey, rv, orgTTL);
          res.json(rv);
        }catch(ex){
          console.error("Error reading json from ckan", ex);
          res.json({error: ex});
        }
      });
  });



});

module.exports = router;
