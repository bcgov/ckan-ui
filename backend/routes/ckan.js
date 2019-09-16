let express = require('express');
let router = express.Router();
let request = require('request');
let auth = require('../modules/auth');
const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

router.get('/classic', function(req, res, next){
    let config = require('config');
    let url = config.get('classicUi');

    return res.json({url: url});
});

/* GET search ckan datasets. */
router.get('/search', auth.removeExpired, function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/package_search?";
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
      };
  }

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode !== 200){
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
router.get('/dataset', auth.removeExpired, function(req, res, next) {

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
     };
  }

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode !== 200){
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

router.put('/dataset', auth.removeExpired, function(req, res, next) {
    let config = require('config');
    let url = config.get('ckan');

    const reqUrl = url + "/api/3/action/package_update";

    if (!req.user){
        return res.json({error: "Not logged in"});
    }

    console.log("CREATING PACKAGE", req.body);

    request({ method: 'POST', uri: reqUrl, json: req.body, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
        if (err) {
            console.log(err);
            res.json({ error: err });
            return;
        }
        if (apiRes.statusCode !== 200) {
            console.log("Body Status? ", apiRes.statusCode);
        }

        try {
            let json = typeof(body) === 'string' ? JSON.parse(body) : body;
            res.json(json);
        } catch (ex) {
            console.error("Error reading json from ckan", ex);
            res.json({ error: ex, body: body });
        }
    });

});

router.post('/dataset', auth.removeExpired, function(req, res, next) {
    let config = require('config');
    let url = config.get('ckan');

    const reqUrl = url + "/api/3/action/package_create";

    if (!req.user){
        return res.json({error: "Not logged in"});
    }

    console.log("CREATING PACKAGE", req.body);

    request({ method: 'POST', uri: reqUrl, json: req.body, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
        if (err) {
            console.log(err);
            res.json({ error: err });
            return;
        }
        if (apiRes.statusCode !== 200) {
            console.log("Body Status? ", apiRes.statusCode);
            //console.log("Body ", body);
        }

        try {
            let json = typeof(body) === 'string' ? JSON.parse(body) : body;
            res.json(json);
        } catch (ex) {
            console.error("Error reading json from ckan", ex);
            res.json({ error: ex, body: body });
        }
    });

});

/* GET one dataset. */
router.get('/facets', auth.removeExpired, function(req, res, next) {

  facets = {
      sectors:{
            name: "Sectors",
            icon: "business",
            facets: [
                {
                    sector: 'Sectors'
                },
            ]
      },
      dataTypes:{
          name: "Data Types",
          icon: "folder",
          facets: [
            {
                type: 'Dataset types'
            },
            {
                res_format: 'Format'
            }
          ]
      },
    //   organizations:{
    //       name: "Organizations",
    //       icon: "supervised_user_circle",
    //       facets: [
    //         {
    //             organization: 'Organizations'
    //         }
    //       ],
    //   },
        permissions:{
            name: "Permissions",
            icon: "vpn_lock",
            facets: [
                {
                    download_audience: 'Download permission'
                },
                {
                    license_id: 'License'
                },
                {
                    edc_state: 'States' // normally only if admin, but what the hell
                }
            ],
            information: {
                "Public Datasets": "Catalogue records with data that can be viewed and accessed by anyone.",
                "Restricted Datasets": "Catalogue records with data that has restrictions on what may be viewed or downloaded. Access depends on permissions granted to your log-in",
                banner: "Log in with a Government IDIR or BCEID to view more datasets"
            }
      },
  };

  res.json(facets);

});

/* GET organization. */
router.get('/organization', function(req, res, next) {

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
      };
  }

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode !== 200){
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

/* GET organizations. */
router.get('/organizations', function(req, res, next) {

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
    };
  }else{
    console.log("no user");
  }

  cache.get(orgCacheKey, function(err, value){
      if ( (!err) && (value !== undefined) ){
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
        if (apiRes.statusCode !== 200){
          console.log("Body Status? ", apiRes.statusCode);
        }

        try {
          let json = JSON.parse(body);
          console.log(body);
          orgList = {};
          topLevelOrgs = [];
          subOrgs = [];
          for (let i=0; i<json.result.length; i++) {
              let org = json.result[i];
            if (org.child_of.length === 0) {
              topLevelOrgs.push(org);
              if (typeof(orgList[org.title.trim()]) === "undefined"){
                 orgList[org.title.trim()] = {id: org.id, name: org.name, title: org.title, children: []};
              }else{
                  orgList[org.title.trim()].id = org.id;
                  orgList[org.title.trim()].name = org.name;
                  orgList[org.title.trim()].title = org.title;
              }
            } else {
              subOrgs.push(org);
              for (let j=0; j<org.child_of.length; j++){
                  let parentOrg = org.child_of[j];
                  let orgItem = {title: org.title.trim(), name: org.name, id: org.id};
                  if (typeof(orgList[parentOrg.title.trim()]) === "undefined") {
                      orgList[parentOrg.title.trim()] = {};
                      orgList[parentOrg.title.trim()].children = [orgItem];
                  }else if (typeof(orgList[parentOrg.title.trim()].children) === "undefined") {
                      orgList[parentOrg.title.trim()].children = [orgItem];
                  }else{
                      orgList[parentOrg.title.trim()].children.push(orgItem);
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

/* GET user activity. */
router.get('/activity', auth.removeExpired, function(req, res, next) {
    let config = require('config');
    let url = config.get('ckan');

    let reqUrl = url + "/api/3/action/dashboard_activity_list";

    if (!req.user){
        return res.json({error: "Not logged in"});
    }

    let authObj = {
        'auth': {
          'bearer': req.user.jwt
        }
    };

    request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
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

/* GET user activity. */
router.get('/user/:userId', auth.removeExpired, function(req, res, next) {
    let config = require('config');
    let url = config.get('ckan');

    let reqUrl = url + "/api/3/action/user_show?id="+req.params.userId+"&include_datasets=True";

    if (!req.user){
        return res.json({error: "Not logged in"});
    }

    let authObj = {
        'auth': {
          'bearer': req.user.jwt
        }
    };

    request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
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
router.get('/tagList', auth.removeExpired, function(req, res, next) {

    let config = require('config');
    let url = config.get('ckan');

    let reqUrl = url + "/api/3/action/tag_list";
    authObj = {};

    request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
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
router.get('/vocabList', auth.removeExpired, function(req, res, next) {

    let config = require('config');
    let url = config.get('ckan');

    let reqUrl = url + "/api/3/action/vocabulary_list";

    if (!req.user){
        return res.json({error: "Not logged in"});
    }

    let authObj = {
        'auth': {
          'bearer': req.user.jwt
        }
    };

    request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
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
router.get('/licenseList', auth.removeExpired, function(req, res, next) {

    let config = require('config');
    let url = config.get('ckan');

    let reqUrl = url + "/api/3/action/license_list";

    // if (!req.user){
    //     return res.json({error: "Not logged in"});
    // }

    let authObj = {
        // 'auth': {
        //   'bearer': req.user.jwt
        // }
    };

    request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
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

/* GET ckan groups */
router.get('/groups', auth.removeExpired, function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/group_list?all_fields=true";
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
      };
  }

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode !== 200){
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

/* GET ckan group */
router.get('/group/:id', auth.removeExpired, function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/group_show?id="+req.params.id+"&include_datasets=true";

  let authObj = {};

  if (req.user){
      authObj = {
          'auth': {
              'bearer': req.user.jwt
          }
      };
  }

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode !== 200){
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

/* GET ckan about */
router.get('/about', auth.removeExpired, function(req, res, next) {

  let config = require('config');
  let url = config.get('ckan');

  let keys = Object.keys(req.query);
  let reqUrl = url + "/api/3/action/config_option_show?key=ckan.site_about";

  let authObj = {};

  if (req.user){
      authObj = {
          'auth': {
              'bearer': req.user.jwt
          }
      };
  }

  request(reqUrl, authObj, function(err, apiRes, body){
    if (err) {
      console.log(err);
      res.json({error: err});
      return;
    }
    if (apiRes.statusCode !== 200){
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


/* GET ckan schema -- requires scheming */
router.get('/datasetSchema', auth.removeExpired, function(req, res, next) {

    let config = require('config');
    let url = config.get('ckan');
  
    let type = "edc_dataset";
    if (typeof(req.query.type) !== "undefined"){
        type = req.query.type;
    }
    
    let reqUrl = url + "/api/3/action/scheming_dataset_schema_show?type="+type;
  
    let authObj = {};
  
    if (req.user){
        authObj = {
            'auth': {
                'bearer': req.user.jwt
            }
        };
    }
  
    request(reqUrl, authObj, function(err, apiRes, body){
      if (err) {
        console.log(err);
        res.json({error: err});
        return;
      }
      if (apiRes.statusCode !== 200){
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

/* GET ckan schema -- requires scheming */
router.get('/', auth.removeExpired, function(req, res, next) {

    let config = require('config');
    let url = config.get('ckan');
  
    if (!req.query.url){
        return res.json({error: "uri encoded component query parameter url is required"}).status(400);
    }
    
    let reqUrl = url + decodeURIComponent(req.query.url);
  
    let authObj = {};
  
    if (req.user){
        authObj = {
            'auth': {
                'bearer': req.user.jwt
            }
        };
    }
  
    request(reqUrl, authObj, function(err, apiRes, body){
      if (err) {
        console.log(err);
        res.json({error: err});
        return;
      }
      if (apiRes.statusCode !== 200){
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

/* GET ckan schema -- requires scheming */
router.get('/licenses', auth.removeExpired, function(req, res, next) {

    let config = require('config');
    let url = config.get('ckan');

    
    let reqUrl = url + '/api/3/action/license_list'
  
    let authObj = {};
  
    if (req.user){
        authObj = {
            'auth': {
                'bearer': req.user.jwt
            }
        };
    }
  
    request(reqUrl, authObj, function(err, apiRes, body){
      if (err) {
        console.log(err);
        res.json({error: err});
        return;
      }
      if (apiRes.statusCode !== 200){
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
  

module.exports = router;
