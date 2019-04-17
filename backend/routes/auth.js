let passport = require('passport');

let express = require('express');
let router = express.Router();
let auth = require('../modules/auth');

router.use('/login', function(req, res, next){
    req.session.r = req.query.r;
    res.redirect('/api/log');
    next();
});

router.use('/log', passport.authenticate('oidc'), function(req, res, next){
    next();
});

router.use('/callback', passport.authenticate('oidc'), function(req, res, next){
    let config = require('config');
    res.redirect(config.get('frontend')+req.session.r)
});

router.use('/logout', function(req, res, next){
    req.logout();
    let config = require('config');
    res.redirect(config.get('frontend'));
});

router.use('/token', auth.removeExpired, function(req, res){
    if (req.user && req.user.jwt && req.user.refreshToken) {
        res.json(req.user);
    }else{
        res.json({error: "Not logged in"});
    }
});

module.exports = router