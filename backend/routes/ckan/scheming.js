var addRoutes = function(router){
    let request = require('request');
    let auth = require('../../modules/auth');

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


    /* GET ckan group schema -- requires scheming */
    router.get('/groupSchema', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let type = "group";

        let reqUrl = url + "/api/3/action/scheming_group_schema_show?type="+type;

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

    /* GET ckan org schema -- requires scheming */
    router.get('/orgSchema', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let type = "organization";

        let reqUrl = url + "/api/3/action/scheming_organization_schema_show?type="+type;

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