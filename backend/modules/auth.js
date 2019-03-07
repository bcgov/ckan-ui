let auth = {};
let atob = require('atob');
let request = require('request')


auth.isTokenExpired = function(token){
    return true;
    let currDate = new Date();

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let jwtObj = JSON.parse(atob(base64));
    let exp = new Date(0);
    exp.setUTCSeconds(jwtObj.exp);

    console.log("TOKEN EXPIRES AT", exp);


    return (currDate > exp);
}

auth.isRenewable = function(token){
    let currDate = new Date();

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let jwtObj = JSON.parse(atob(base64));
    let exp = new Date(0);
    exp.setUTCSeconds(jwtObj.exp);



    return (currDate > exp);
}


auth.renew = function(token, cb){
    let config = require('config');

    let refresh = config.get('oidc.tokenURL')
    let scope = config.get('oidc.scope')
    let authObj = {
        auth: {
            bearer: token
        },
        headers: {
            accept: "application/json",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            grant_type: "refresh_token",
            scope: scope,
            refresh_token: token

        }
    }

    request(refresh, authObj, function(err, apiRes, body){
        let at = null;
        let rt = null;

        if (err){
            cb(err, at, rt);
            return;
        }

        try {
            let json = JSON.parse(body);

            if (typeof(json.access_token) !== "undefined"){
                at = json.access_token
            }

            if (typeof(json.refresh_token) !== "undefined"){
                rt = json.refresh_token
            }

        }catch(ex){
            cb(err, at, rt);
            return;
        }

        cb(err, at, rt);

    });
}

auth.removeExpired = function(req, res, next){
    if ( (typeof(req.user) !== "undefined") && (typeof(req.user.jwt) !== "undefined") ){
        if (auth.isTokenExpired(req.user.jwt)){
            if ( (typeof(req.user) !== "undefined") && (typeof(req.user.refreshToken) !== "undefined") ){
                if (auth.isRenewable(req.user.refreshToken)){
                    auth.renew(req.user.refreshToken, function(refreshErr, accessToken, refreshToken){
                        if (refreshErr){
                            console.err("refresh token error", refreshErr);
                            next();
                            return;

                        }
                        req.user.jwt = accessToken;
                        req.user.refreshToken =  refreshToken;
                        next();
                    });
                } else {
                    delete req.user;
                    next();
                }
            } else {
                delete req.user;
                next();
            }
        } else {
            next()
        }
    } else {
        next()
    }
}

module.exports = auth