let express = require('express');
let router = express.Router();
let auth = require('../modules/auth');
let snowplow = require('@snowplow/node-tracker');
let config = require('config');

router .get('/ga', auth.removeExpired, function(req, res){
    if (!config.has('ga')){
        res.json({"notOk": "Not Configured"});
        return;
    }

    if ( (!config.has('ga.enabled')) || (!config.get('ga.enabled')) ){
        res.json({"notOk": "Not Enabled"});
        return;
    }

    if ( (!config.has('ga.id')) || (!config.get('ga.id')) ){
        res.json({"notOk": "Not Configured Properly"});
        return;
    }

    res.json({'id': config.get('ga.id')});

})

router.get('/', auth.removeExpired, function(req, res){

    if (!config.has('snowplow')){
        res.json({"notOk": "Not Configured"});
        return;
    }

    if ( (!config.has('snowplow.enabled')) || (!config.get('snowplow.enabled')) ){
        res.json({"notOk": "Not Enabled"});
        return;
    }

    const gotEmitter = snowplow.gotEmitter;
    const tracker = snowplow.tracker;

    const snowConfig = config.get('snowplow');

    const e = gotEmitter(
        snowConfig.collector, // Collector endpoint
        snowConfig.protocol, // Optionally specify a method - http is the default
        snowConfig.port, // Optionally specify a port
        "GET", // Method - defaults to GET
        1
    );

    let t = tracker([e], 'namespace', snowConfig.appId, false);

    if ((req.user) && (req.user.id)){
        t.setUserId(req.user.id);
    }

    t.track(snowplow.buildPageView(req.query.pageUrl, req.query.pageTitle, req.query.referrer));

    res.json({"ok": "ok"});
});

router.post('/', auth.removeExpired, function(req, res){

    if (!config.has('snowplow')){
        res.json({"notOk": "Not Configured"});
        return;
    }

    if ( (!config.has('snowplow.enabled')) || (!config.get('snowplow.enabled')) ){
        res.json({"notOk": "Not Enabled"});
        return;
    }

    const gotEmitter = snowplow.gotEmitter;
    const tracker = snowplow.tracker;

    const snowConfig = config.get('snowplow');

    const e = gotEmitter(
        snowConfig.collector, // Collector endpoint
        snowConfig.protocol, // Optionally specify a method - http is the default
        snowConfig.port, // Optionally specify a port
        "POST", // Method - defaults to GET
        1
    );

    let t = tracker([e], 'namespace', snowConfig.appId, false);

    if ((req.user) && (req.user.id)){
        t.setUserId(req.user.id);
    }

    t.track(snowplow.buildPageView(req.query.pageUrl, req.query.pageTitle, req.query.referrer));

    res.json({"ok": "ok"});
});

module.exports = router
