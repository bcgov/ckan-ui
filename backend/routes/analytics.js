let express = require('express');
let router = express.Router();
let auth = require('../modules/auth');
let snowplow = require('snowplow-tracker');
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

    const emitter = snowplow.emitter;
    const tracker = snowplow.tracker;

    const snowConfig = config.get('snowplow');

    const e = emitter(
        snowConfig.collector, // Collector endpoint
        snowConfig.protocol, // Optionally specify a method - http is the default
        snowConfig.port, // Optionally specify a port
        "GET", // Method - defaults to GET
        1,
        function (error, body, response) { // Callback called for each request
            if (error) {
                console.log("Request to Scala Stream Collector failed!");
                }
            },
        { maxSockets: 6 } // Node.js agentOptions object to tune performance
    );

    let t = tracker([e], snowConfig.appId);

    if ((req.user) && (req.user.id)){
        t.setUserId(req.user.id);
    }



    t.trackPageView(req.query.pageUrl, req.query.pageTitle, req.query.referrer, null);

    res.json({"ok": "ok"});
});

router.post('/', auth.removeExpired, function(req, res){

    const emitter = snowplow.emitter;
    const tracker = snowplow.tracker;

    const snowConfig = config.get('snowplow');

    const e = emitter(
        snowConfig.collector, // Collector endpoint
        snowConfig.protocol, // Optionally specify a method - http is the default
        snowConfig.port, // Optionally specify a port
        "POST", // Method - defaults to GET
        1,
        function (error, body, response) { // Callback called for each request
            if (error) {
                console.log("Request to Scala Stream Collector failed!");
                }
            },
        { maxSockets: 6 } // Node.js agentOptions object to tune performance
    );

    let t = tracker([e], snowConfig.appId);

    if ((req.user) && (req.user.id)){
        t.setUserId(req.user.id);
    }

    t.trackPageView(req.query.pageUrl, req.query.pageTitle, req.query.referrer, null);

    res.json({"ok": "ok"});
});

module.exports = router
