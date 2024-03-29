const request = require('request');
const auth = require('../../modules/auth');

function addRoutes(router) {
    proxyCkanApiRequest("/whoami", "/api/3/action/whoami");
    proxyCkanApiRequest("/activity", "/api/3/action/dashboard_activity_list");
    proxyCkanApiRequest("/userOrganizations", (req) => "/api/3/action/organization_list_for_user?id="+encodeURIComponent(req.user._json.idir_username.toLowerCase() + '@idir'));
    proxyCkanApiRequest(
        "/activity/:userId",
        (req) => "/api/3/action/user_activity_list?id=" + encodeURIComponent(req.params.userId)
    );
    proxyCkanApiRequest('/user/:userId', (req) => `/api/3/action/user_show?id=${encodeURIComponent(req.params.userId)}&include_datasets=True`);
    proxyCkanApiRequest('/userAutocomplete/:q', (req) => "/api/3/action/user_autocomplete?q="+encodeURIComponent(req.params.q));

    function proxyCkanApiRequest(endpoint, upstreamPath, ...middlewares) {
        router.get(endpoint, auth.removeExpired, ...middlewares, (req, res, next) => {

            let config = require('config');
            let url = config.get('ckan');

            let authObj = {};

            if (req.user) {
                authObj = {
                    'headers': {
                        'Authorization': req.user.jwt
                    }
                };
            }

            let reqUrl;

            if (typeof upstreamPath === "function") {
                reqUrl = url + upstreamPath(req);
            } else {
                reqUrl = url + upstreamPath;
            }

            request(reqUrl, authObj, function(err, apiRes, body) {
                if (err) {
                    console.log(err);
                    res.json({error: err});
                    return;
                }

                try {
                    let json = JSON.parse(body);
                    res.json(json);
                } catch(ex){
                    console.error("Error reading json from ckan", ex);
                    res.json({error: ex});
                }
            });

        });
    }

    return router;
}

module.exports = addRoutes;