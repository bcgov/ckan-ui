var addRoutes = function(router){
    let request = require('request');
    const NodeCache = require( "node-cache" );
    const cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

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
                    orgList: orgList,
                    success: true
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
    return router;
};

module.exports = addRoutes;