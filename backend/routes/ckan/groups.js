var addRoutes = function(router){

    let request = require('request');
    let auth = require('../../modules/auth');

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

    router.post('/group', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/group_create";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

        //CKAN requires the group type be set to group or it will not create correctly
        req.body['type'] = "group";

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

    router.put('/group/:id', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/group_update";

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
                res.json(json);
            } catch (ex) {
                console.error("Error reading json from ckan", ex);
                res.json({ error: ex, body: body });
            }
        });

    });

    router.delete('/group/:groupId', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/group_delete";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

        if (!req.params.groupId){
            return res.json({error: "No Group ID specified"});
        }

        console.log("DELETING Group", req.params.groupId);

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
                res.json(json);
            } catch (ex) {
                console.error("Error reading json from ckan", ex);
                res.json({ error: ex, body: body });
            }
        });
    });

    /* GET ckan group */
    router.get('/group_activity/:id', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let keys = Object.keys(req.query);
        let reqUrl = url + "/api/3/action/group_activity_list?id="+req.params.id;

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

    /* GET ckan group membership */
    router.get('/members/:id', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/member_list?object_type=user&id="+req.params.id;

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

    /* GET ckan if user is following */
    router.get('/group/:id/following', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/am_following_group?id=" + req.params.id;

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

    /* DELETE ckan group membership */
    router.delete('/members/:id', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/member_delete";

        let authObj = {};

        if (req.user){
            authObj = {
                'auth': {
                    'bearer': req.user.jwt
                }
            };
        }

        request({ method: 'POST', uri: reqUrl, json: req.body, authObj }, function(err, apiRes, body) {
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

    /* POST ckan follow group */
    router.post('/group/:id/follow', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/follow_group";

        // TODO: CKAN Requires api key instead of normal auth here...
        if (!req.body.api_key){
            res.json({error: "API Key required"});
        }

        let headers = {
            'Authorization': req.body.api_key
        };

        let body = {
            id: req.params.id
        };

        request({ method: 'POST', uri: reqUrl, json: body, headers: headers }, function(err, apiRes, body) {
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
            }
            if (apiRes.statusCode !== 200){
                console.log("Body Status? ", apiRes.statusCode);
            }

            try {
                //let json = JSON.parse(body);
                res.json(body);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                res.json({error: ex});
            }
        });

    });

    /* DELETE ckan unfollow group */
    router.delete('/group/:id/unfollow', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/unfollow_group";

        // TODO: CKAN Requires api key instead of normal auth here...
        if (!req.body.api_key){
            return res.json({error: "API Key required"});
        }

        let headers = {
            'Authorization': req.body.api_key
        };

        let body = {
            id: req.params.id
        };

        request({ method: 'POST', uri: reqUrl, json: body, headers: headers }, function(err, apiRes, body) {
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
            }
            if (apiRes.statusCode !== 200){
                console.log("Body Status? ", apiRes.statusCode);
            }

            try {
                //let json = JSON.parse(body);
                return res.json(body);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                return res.json({error: ex});
            }
        });

    });

    /* GET ckan groups */
    router.get('/userGroups', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let keys = Object.keys(req.query);
        let reqUrl =
            url +
            "/api/3/action/organization_or_group_list_related?is_organization=false";
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


    return router;
}

module.exports = addRoutes;
