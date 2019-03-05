let auth = {};
let atob = require('atob');
let refresh = require('passport-oauth2-refresh')


auth.isTokenExpired = function(token){
    let currDate = new Date();

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let jwtObj = JSON.parse(atob(base64));
    let exp = new Date(0);
    exp.setUTCSeconds(jwtObj.exp);



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

auth.removeExpired = function(req, res, next){
    if ( (typeof(req.user) !== "undefined") && (typeof(req.user.jwt) !== "undefined") ){
        if (auth.isTokenExpired(req.user.jwt)){
            if ( (typeof(req.user) !== "undefined") && (typeof(req.user.refreshToken) !== "undefined") ){
                if (auth.isRenewable(req.user.refreshToken)){
                    refresh.requestNewAccessToken('oidc', req.user.refreshToken, function(refreshErr, accessToken, refreshToken){
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
        }
    }
}

module.exports = auth