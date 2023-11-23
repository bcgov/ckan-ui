var addRoutes = function(router){
    let request = require('request');
    let auth = require('../../modules/auth');
    const NodeCache = require( "node-cache" );
    const cache = new NodeCache( { stdTTL: 0, checkperiod: 0 } );
    const orgCacheKey = 'orgDict';

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
        
        let orgTTL = 86400;
    
        //let keys = Object.keys(req.query);
        let reqUrl =
            url +
            "/api/3/action/organization_or_group_list_related?is_organization=true";
    
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

        let noCache = (typeof(req.query) !== "undefined") ? true : false;
        noCache = (noCache && typeof(req.query.nocache) !== "undefined") ? true : false;
        noCache = (noCache && (req.query.nocache === "true")) ? true : false;
        noCache = true; //TODO: Delete this line later
    
        cache.get(orgCacheKey, function(err, value){
            if ( !noCache ){
                if ( (!err) && (value !== undefined) ){
                    res.json(value);
                    return;
                }
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
                    let orgList = {};
                    let topLevelOrgs = [];
                    let subOrgs = [];
                    if (json.result) {
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


    router.post('/organization', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/organization_create";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

        //CKAN requires the group type be set to group or it will not create correctly
        req.body['type'] = "organization";

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
                cache.del(orgCacheKey);
                let json = typeof(body) === 'string' ? JSON.parse(body) : body;
                res.json(json);
            } catch (ex) {
                console.error("Error reading json from ckan", ex);
                res.json({ error: ex, body: body });
            }
        });

    });

    router.put('/organization/:id', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/organization_update";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }
        

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
                cache.del(orgCacheKey);
                res.json(json);
            } catch (ex) {
                console.error("Error reading json from ckan", ex);
                res.json({ error: ex, body: body });
            }
        });

    });

    router.delete('/organization/:groupId', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/organization_delete";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

        if (!req.params.groupId){
            return res.json({error: "No Group ID specified"});
        }

        console.log("DELETING organization", req.params.groupId);

        request({ method: 'POST', uri: reqUrl, json: {id: req.params.groupId}, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
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
                cache.del(orgCacheKey);
                res.json(json);
            } catch (ex) {
                console.error("Error reading json from ckan", ex);
                res.json({ error: ex, body: body });
            }
        });
    });

    router.post('/organizationMember', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/organization_member_create";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

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
                let json = JSON.parse(body);
                res.json(json);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                res.json({error: ex});
            }
        });

    });

    router.post('/organizationMemberDelete', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/organization_member_delete";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

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
                let json = JSON.parse(body);
                res.json(json);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                res.json({error: ex});
            }
        });

    });

    return router;
};

module.exports = addRoutes;