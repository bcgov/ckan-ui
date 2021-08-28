let passport = require('passport');

let express = require('express');
let router = express.Router();
let auth = require('../modules/auth');
let config = require('config');

router.use('/login', function(req, res, next){
    req.session.r = req.query.r;
    return res.redirect('/api/log');
});

router.use("/groupSeperator", function(req,res,next){
    return res.json({"seperator": config.get('authGroupSeperator')});
});

router.use("/sysAdminGroup", function(req,res,next){
    return res.json({"group": config.get('sysAdminGroup')});
});

router.use('/log', passport.authenticate('oidc'), function(req, res, next){
    next();
});

router.use('/callback', passport.authenticate('oidc'), function(req, res, next){

    let redirectTo = config.get('frontend')+req.session.r;
    let find = "loggedOut=true"
    let firstIndex = redirectTo.indexOf(find);
    if (firstIndex >= 0){
        let secondIndex = firstIndex + find.length;
        if (redirectTo.length > secondIndex){
            secondIndex += 1;
        }else{
            firstIndex -= 1;
        }
        let r = redirectTo.substring(0, firstIndex)
        r += redirectTo.substring(secondIndex);
        redirectTo = r;
    }

    res.redirect(redirectTo);
});

router.use('/logout', function(req, res, next){
    req.session.destroy();

    var redirectTo = config.get('frontend') + req.query.r;
    redirectTo += redirectTo.indexOf("?") >= 0 ? "&" : "?";
    redirectTo += "loggedOut=true";

    if (config.has('oidc.logout')) {
        let oidcLogoutURL = new URL(config.get("oidc.logout"));
        oidcLogoutURL.searchParams.set("client_id", config.get("oidc.clientID"));
        oidcLogoutURL.searchParams.set("redirect_uri", redirectTo);
        redirectTo = oidcLogoutURL.toString();
    }

    req.logout();
    res.redirect(redirectTo);
});

router.use('/token', auth.removeExpired, function(req, res){
    if (req.user && req.user.jwt && req.user.refreshToken) {
        res.json(req.user);
    }else{
        res.json({error: "Not logged in"});
    }
});

module.exports = router;