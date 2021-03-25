var addRoutes = function(router){
    let request = require('request');
    let auth = require('../../modules/auth');

    /* GET User Orgs */
    router.get('/userOrganizations', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let authObj = {};

        if (req.user){
        authObj = {
            'headers': {
            'Authorization': req.user.jwt
            }
        };
        }else{
            console.log("no user");
            res.json({results: [], error: "No user"});
            return;
        }

        let reqUrl = url + "/api/3/action/organization_list_for_user?id="+req.user._json.preferred_username;

        request(reqUrl, authObj, function(err, apiRes, body){
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
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
    router.get('/activity/:userId', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        if (typeof(req.params.userId) === 'undefined'){
            res.status(500);
            return res.json({error: "User ID is required"});
        }

        let reqUrl = url + "/api/3/action/user_activity_list?id=" + req.params.userId;

        let authObj = {}

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

    /* GET user info. */
    router.get('/user/:userId', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/user_show?id="+req.params.userId+"&include_datasets=True";

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
};

module.exports = addRoutes;