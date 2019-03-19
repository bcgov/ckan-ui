let passport = require('passport');

let express = require('express');
let router = express.Router();
let auth = require('../modules/auth');

router.use('/login', passport.authenticate('oidc'), function(req, res, next){
    next();
})

router.use('/callback', passport.authenticate('oidc'), function(req, res, next){
    let config = require('config');
    res.redirect(config.get('frontend'))
});

router.use('/logout', function(req, res, next){
    req.logout();
    let config = require('config');
    res.redirect(config.get('frontend'));
});

router.use('/token', auth.removeExpired, function(req, res){
    if (req.user) {
        res.json(req.user);
    }else{
        res.json({error: "Not logged in"});
    }
});

module.exports = router