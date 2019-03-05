let auth = {};
let atob = require('atob');


auth.isTokenExpired = function(token){
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
            console.log("token expired");
            delete req.user;
        }
    }
    next()
}

module.exports = auth