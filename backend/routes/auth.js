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
    res.redirect(config.get('frontend')+req.session.r);
});

router.use('/logout', function(req, res, next){
    var redirectTo = req.query.r || config.get('frontend');
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