let express = require('express');
let router = express.Router();
let request = require('request');
let auth = require('../modules/auth');
// let cacheService = require('../services/cache-service');

let orgs = require('../config/orgs');
let suborgs = require('../config/suborgs');

// const ttl = 60 * 60 * 12;
// const cache = new cacheService(ttl);

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
          'headers': {
            'Authorization': req.user.jwt
          }
      }
  }else{
      console.log("no user");
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
          'headers': {
              'Authorization': req.user.jwt
          }
      }
  }else{
      console.log("no user");
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

  if (req.user){
      authObj = {
          'headers': {
              'Authorization': req.user.jwt
          }
      }
  }else{
      console.log("no user");
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

  let keys = Object.keys(req.query);
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

  res.json({
    'orgs': orgs.organizations,
    'suborgs': suborgs.organizations
  });

  // cache.get('orgDict', request(reqUrl, authObj, function(err, apiRes, body){
  //   if (err) {
  //     console.log(err);
  //     res.json({error: err});
  //     return;
  //   }
  //   if (apiRes.statusCode != 200){
  //     console.log("Body Status? ", apiRes.statusCode);
  //   }

  //   try {
  //     let json = JSON.parse(body);
  //     topLevelOrgs = []
  //     subOrgs = [];
  //     for (org in json.result) {
  //       if (org.child_of.length == 0) {
  //         topLevelOrgs.push(org);
  //       } else {
  //         subOrgs.push(org);
  //       }
  //     }
      
  //     return json;
  //   }catch(ex){
  //     console.error("Error reading json from ckan", ex);
  //     return {error: ex};
  //   }
  // })).then((result) => {
  //   res.json = result;
  // });

});

module.exports = router;
