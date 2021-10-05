var addRoutes = function(router){
    const NodeCache = require( "node-cache" );
    const cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
    const usageCacheKey = 'usage'
    let request = require('request');
    let auth = require('../../modules/auth');

    router.get('/classic', function(req, res, next){
        let config = require('config');
        let url = config.get('classicUi');

        return res.json({url: url});
    });

    router.get('/rss', function(req, res, next){
        let config = require('config');
        
        let url = config.get('ckan');

        let reqUrl = url + "/feeds/recent.rss";
        let authObj = {};

        request(reqUrl, authObj, function(err, apiRes, body){
            let oldUrl = config.get('classicUi');
            let newUrl = config.get('frontend');
            if (body){
                let b = body.replace(oldUrl, newUrl);
                b = b.replace("/feeds/recent.rss", "/client-api/ckan/rss");
                return res.end(b);
            }return res.end('Sorry there was an error getting the rss feed: ', err)
        });

        
    });

    router.get('/usage', function(req, res, next){
        let config = require('config');
        
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/site-usage";
        let authObj = {};

        let cacheKey = usageCacheKey;

        if (typeof(req.query) !== "undefined"){
            let addedToUrl = false;
            if (req.query.start_year){
                addedToUrl = true;
                reqUrl += "?start_year=" + req.query.start_year
                cacheKey += "/sy" + req.query.start_year
            }

            if (req.query.start_month){
                reqUrl += (addedToUrl) ? "&" : "?";
                addedToUrl = true;
                reqUrl += "start_month=" + req.query.start_month
                cacheKey += "/sm" + req.query.start_month
            }

            if (req.query.end_year){
                reqUrl += (addedToUrl) ? "&" : "?";
                addedToUrl = true;
                reqUrl += "end_year=" + req.query.end_year
                cacheKey += "/ey" + req.query.end_year
                
            }

            if (req.query.end_month){
                reqUrl += (addedToUrl) ? "&" : "?";
                addedToUrl = true;
                reqUrl += "end_month=" + req.query.end_month
                cacheKey += "/em" + req.query.end_month
            }

            if (req.query.count){
                reqUrl += (addedToUrl) ? "&" : "?";
                addedToUrl = true;
                reqUrl += "count=" + req.query.count
                cacheKey += "/c" + req.query.count
            }

            if ( (req.query.publisher) && (req.query.publisher !== "All") ){
                reqUrl += (addedToUrl) ? "&" : "?";
                reqUrl += "publisher=" + req.query.publisher
                cacheKey += "/p" + req.query.publisher
            }
        }

        let cached = cache.get(cacheKey);
        if (typeof(cached) !== "undefined"){
            return res.json(cached);
        }

        console.log("usage REQ URL", reqUrl)

        request(reqUrl, authObj, function(err, apiRes, body){
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
            }
            if (apiRes.statusCode !== 200){
                console.log("Body Status? ", apiRes.statusCode);
            }
        
            try {
                let json = JSON.parse(body);
                cache.set(cacheKey, json);
                return res.json(json);
                
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                return res.json({error: ex});
            }
        });
    });

    router.get('/publishers', function(req, res, next){
        let config = require('config');
        
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/publishers";
        let authObj = {};

        request(reqUrl, authObj, function(err, apiRes, body){
            if (err) {
                res.json({error: err});
                return;
            }
        
            try {
                let json = JSON.parse(body);
                return res.json(json);
                
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                return res.json({error: ex});
            }
        })
    })

    //intend for this to be querying a ckan plugin for popular search terms eventually
    router.get('/landingTerms', function(req, res, next){
        let config = require('config');
        let terms = config.get('landingTerms');

        return res.json({terms: terms});
    });



    /* GET facets. */
    router.get('/facets', auth.removeExpired, function(req, res, next) {

    const facets = {
        // sectors:{
        //         name: "Sectors",
        //         icon: "business",
        //         facets: [
        //             {
        //                 sector: 'Sectors'
        //             },
        //         ]
        // },
        // dataTypes:{
        //     name: "Data Types",
        //     icon: "folder",
        //     facets: [
        //         {
        //             type: 'Dataset types'
        //         },
        //         {
        //             res_format: 'Format'
        //         }
        //     ]
        // },
        // organizations:{
        //     name: "Organizations",
        //     icon: "supervised_user_circle",
        //     facets: [
        //     {
        //         organization: 'Organizations'
        //     }
        //     ],
        // },
        // permissions:{
        //     name: " Download Permissions",
        //     icon: "vpn_lock",
        //     facets: [
        //         {
        //             download_audience: 'Download permission'
        //         },
        //         {
        //             license_id: 'License'
        //         },
        //         {
        //             edc_state: 'States' // normally only if admin, but what the hell
        //         }
        //     ],
        //     information: {
        //         "Public Datasets": "Catalogue records with data that can be viewed and accessed by anyone.",
        //         "Restricted Datasets": "Catalogue records with data that has restrictions on what may be viewed or downloaded. Access depends on permissions granted to your log-in",
        //         banner: "Log in with a Government IDIR or BCEID to view more datasets"
        //     }
        // },

        licenses:{
            name: "Licenses",
            icon: "",
            facets: [
                {
                    license_id: 'License'
                },
            ]
        },
        dataTypes:{
            name: "Data Types",
            icon: "",
            facets: [
                {
                    res_format: 'Format'
                }
            ]
        },
        permissions:{
            name: "Download Permissions",
            icon: "",
            facets: [
                {
                    download_audience: 'Download permission'
                },
            ]
        },
        states:{
            name: "Record Status",
            icon: "",
            facets: [
                {
                    publish_state: 'State'
                },
            ]
        },
        groups:{
            name: "Groups",
            icon: "supervised_user_circle",
            facets: [
            {
                groups: 'Groups'
            }
            ],
        },
        organizations:{
            name: "Organizations",
            icon: "supervised_user_circle",
            facets: [
            {
                organization: 'Organizations'
            }
            ],
        },

    };

    res.json(facets);

    });






    /* GET tags. */
    router.get('/tagList', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/tag_list";
        let authObj = {};

        request(reqUrl, authObj, function(err, apiRes, body){
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
            }
            if (apiRes.statusCode !== 200){
                console.log("Body Status? ", apiRes.statusCode);
            }

            try {
                let json = JSON.parse(body);
                res.json(json);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                res.json({error: ex});
            }
        });

    });

    /* GET one dataset. */
    router.get('/vocabList', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/vocabulary_list";

        if (!req.user){
            return res.json({error: "Not logged in"});
        }

        let authObj = {
            'auth': {
            'bearer': req.user.jwt
            }
        };

        request(reqUrl, authObj, function(err, apiRes, body){
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
            }
            if (apiRes.statusCode !== 200){
                console.log("Body Status? ", apiRes.statusCode);
            }

            try {
                let json = JSON.parse(body);
                let vocabs = {};
                for (let i = 0; i < json.result.length; i++) {
                    let tags = json.result[i].tags;
                    let name = json.result[i].name;
                    vocabs[name] = [];
                    for (let j = 0; j < tags.length; j++) {
                        vocabs[name].push(tags[j].name);
                    }
                }
                json.vocabs = vocabs;
                res.json(json);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                res.json({error: ex});
            }
        });
    });

    /* GET one dataset. */
    router.get('/licenseList', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        let reqUrl = url + "/api/3/action/license_list";

        // if (!req.user){
        //     return res.json({error: "Not logged in"});
        // }

        let authObj = {
            // 'auth': {
            //   'bearer': req.user.jwt
            // }
        };

        request(reqUrl, authObj, function(err, apiRes, body){
            if (err) {
                console.log(err);
                res.json({error: err});
                return;
            }
            if (apiRes.statusCode !== 200){
                console.log("Body Status? ", apiRes.statusCode);
            }

            try {
                let json = JSON.parse(body);
                res.json(json);
            }catch(ex){
                console.error("Error reading json from ckan", ex);
                res.json({error: ex});
            }
        });
    });



    /* GET ckan about */
    router.get('/about', auth.removeExpired, function(req, res, next) {

        let config = require('config');

        if (config.has("aboutPageUrl")) {
            res.json({
                "url": config.get("aboutPageUrl")
            });
        } else {
            res.status(500)
               .json({ "error": "aboutPageUrl must be provided in config" });
        }
    });




    /* GET ? */
    router.get('/', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');

        if (!req.query.url){
            return res.json({error: "uri encoded component query parameter url is required"}).status(400);
        }

        let reqUrl = url + decodeURIComponent(req.query.url);

        let authObj = {};

        if (req.user){
            authObj = {
                'auth': {
                    'bearer': req.user.jwt
                }
            };
        }

        request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
            console.log("Body Status? ", apiRes.statusCode);
        }

        try {
            let json = JSON.parse(body);
            res.json(json);
        }catch(ex){
            console.error("Error reading json from ckan", ex);
            res.json({error: ex});
        }
        });

    });

    /* GET licenses */
    router.get('/licenses', auth.removeExpired, function(req, res, next) {

        let config = require('config');
        let url = config.get('ckan');


        let reqUrl = url + '/api/3/action/license_list';

        let authObj = {};

        if (req.user){
            authObj = {
                'auth': {
                    'bearer': req.user.jwt
                }
            };
        }

        request(reqUrl, authObj, function(err, apiRes, body){
        if (err) {
            console.log(err);
            res.json({error: err});
            return;
        }
        if (apiRes.statusCode !== 200){
            console.log("Body Status? ", apiRes.statusCode);
        }

        try {
            let json = JSON.parse(body);
            res.json(json);
        }catch(ex){
            console.error("Error reading json from ckan", ex);
            res.json({error: ex});
        }
        });

    });
    return router;
};

module.exports = addRoutes;
