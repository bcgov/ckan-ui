let express = require ('express');
let router = express.Router();
let axios = require('axios');
let auth = require('../modules/auth');
const config = require('config');
const { response } = require('../app');
const redis = require('redis');
let redisClient = null;
if (config.redisHost && config.redisPort) {
    const clientConnectConfig = {
        host: config.redisHost,
        port: config.redisPort
    };
    if (config.redisPassword) clientConnectConfig.password = config.redisPassword;

    redisClient = redis.createClient(clientConnectConfig);
}

function genSiteMap(user, res, xml){
    let url = config.get('ckan');
    const reqUrl = url + "/sitemap." + ((xml) ? 'xml' : 'html'); 
    let options = {
        url: reqUrl,
        method: "GET",
        withCredentials: true,
        timeout: 20000
    };

    if ( (user) && (user.jwt) ){
        options.headers = {
            'Authorization': 'Bearer ' + user.jwt
        };
    }

    if (redisClient) {
        try {
            redisClient.get(xml ? 'sitemapxml' : 'sitemaphtml', (err, data) => {
                if (err) {
                    console.error(err);
                    throw err;
                }

                if (data) {
                    res.status(200).send(JSON.parse(data));
                } else {
                    let resp = axios(options).then( (response) => {
                        redisClient.setex(xml ? 'sitemapxml' : 'sitemaphtml', 60*60*24, JSON.stringify(response.data));
                        res.status(200).send(response.data);
                    });
                }
            });
        } catch (err) {
            res.status(500).send({ error: err.message});
        }
    } else {
        let resp = axios(options).then( (response) => {
            res.status(200).send(response.data);
        });
    }
}

router.get('/sitemap.html', auth.removeExpired, async function(req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8')
    genSiteMap(req.user, res, false)
});

router.get('/sitemap.xml', auth.removeExpired, async function(req, res, next) {
    res.setHeader('content-type', 'text/xml; charset=utf-8')
    genSiteMap(req.user, res, true)
});

router.get('/robots.txt', auth.removeExpired, function(req, res, next) {

    let r = "User-agent: *\n";

    if ( process.env.DEPLOYMENT_ENV !== 'PROD' ){
        r += "Disallow: /\n";
    }

    r += "Disallow: /api/\n";
    r += "Disallow: /client-api/\n";
    r += "Disallow: /dataset/activity\n";
    r += "Disallow: /dataset/*/history\n";
    r += "Disallow: /dataset/rate/\n";
    r += "Disallow: /group/\n";
    r += "Disallow: /organization/\n";
    r += "Disallow: /revision/\n";
    r += "Disallow: /tag/\n";
    r += "Disallow: /user/\n";
    r += "\n";

    if ( process.env.DEPLOYMENT_ENV !== 'PROD' ){
        r += "User-agent: AdsBot-Google\n";
        r += "User-agent: AdsBot-Google-Mobile\n";
        r += "Disallow: /\n";
        r += "\n";
    }

    r += "User-agent: *\n";
    r += "Crawl-Delay: 10\n";

    res.setHeader('content-type', 'text/plain; charset=UTF-8');
    res.end(r);
});

module.exports = router;