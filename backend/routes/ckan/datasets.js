const { format } = require('morgan');

var addRoutes = function(router){
    let request = require('request');
    let auth = require('../../modules/auth');

    function formatDatasetBody(body){
        let convertBack = false;
        if (body.dates){
            if (typeof(body.dates) === "string"){
                convertBack = true;
                body.dates = JSON.parse(body.dates);
            }
            
            // for (let i=0; i<body.dates.length; i++){
            //     if (body.dates[i].type.toLowerCase() === "published"){
            //         body.record_publish_date = body.dates[i].date;
            //     }else if (body.dates[i].type.toLowerCase() === "created"){
            //         body.record_create_date = body.dates[i].date;
            //     }else if (body.dates[i].type.toLowerCase() === "archived"){
            //         body.record_archive_date = body.dates[i].date;
            //     }else if (body.dates[i].type.toLowerCase() === "modified"){
            //         body.record_last_modified = body.dates[i].date;
            //     }
            // }
            if (convertBack){
                body.dates = JSON.stringify(body.dates);
            }
        }
        return body;
    }


    /* GET search ckan datasets. */
    router.get('/search', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');
    
        let keys = Object.keys(req.query);

        let reqUrl = url + "/api/3/action/package_search?";
        for (let i=0; i<keys.length; i++){
            let val = req.query[keys[i]];

            if (keys[i] === "q") {

                // lowercase mixed case words so they're not
                // tokenized by case variation, e.g. treat
                // OneTwo as a single token, "onetwo", instead of
                // "one" and "two". This improves search relevence for
                // some organization names
                
                // TODO: This is a workaround which should be addressed at the Solr level.
                // When it is addressed at that level, remove this code.
                
                val = val.split(/\s+/).map(w => {
                    if (/[a-z]/.test(w) && /[A-Z]/.test(w)) {
                        return w.toLowerCase();
                    } else {
                        return w;
                    }
                }).join(" ");
            }

            reqUrl += encodeURIComponent(keys[i]) + "=" + encodeURIComponent(val) + "&";
        }
        //if we added any we need to truncate them
        reqUrl = (keys.length > 0) ? reqUrl.substring(0, reqUrl.length-1) : reqUrl;

        console.log(reqUrl)
    
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
                console.log("Body Status? ", apiRes.statusCode, body);
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
    
        reqUrl += "?id="+encodeURIComponent(req.query.id);
    
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
                return res.json(json);
                
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                return res.json({error: ex});
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

        let postBody = formatDatasetBody(req.body);
    
        request({ method: 'POST', uri: reqUrl, json: postBody, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
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

        let postBody = formatDatasetBody(req.body);
    
        request({ method: 'POST', uri: reqUrl, json: postBody, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
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
    
    router.delete('/dataset/:datasetId', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');
    
        const reqUrl = url + "/api/3/action/package_delete";
    
        if (!req.user){
            return res.json({error: "Not logged in"});
        }
    
        if (!req.params.datasetId){
            return res.json({error: "No Dataset ID specified"});
        }
    
        //note that it won't show as deleted until solr reruns
        console.log("DELETING PACKAGE", req.params.datasetId);
    
        request({ method: 'POST', uri: reqUrl, json: {id: req.params.datasetId}, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
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

    return router;
};

module.exports = addRoutes;
