var addRoutes = function(router){
    let request = require('request');
    let auth = require('../../modules/auth');

    router.delete('/resource/:resourceId', auth.removeExpired, function(req, res, next) {
        let config = require('config');
        let url = config.get('ckan');

        const reqUrl = url + "/api/3/action/resource_delete";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

        if (!req.params.resourceId){
            return res.json({error: "No Dataset ID specified"});
        }

        console.log("DELETING RESOURCE", req.params.resourceId);

        request({ method: 'POST', uri: reqUrl, json: {id: req.params.resourceId}, auth: { 'bearer': req.user.jwt } }, function(err, apiRes, body) {
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
}

module.exports = addRoutes;