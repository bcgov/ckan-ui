let express = require ('express');
let router = express.Router();
let axios = require('axios');
let auth = require('../modules/auth');
const dotenv = require('dotenv');
const config = require('config');
const { response } = require('../app');

dotenv.config();

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

    let resp = axios(options).then( (response) => {
        res.end(response.data);
    });
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