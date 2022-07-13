let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let config = require('config');
let session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
let passport = require('passport');
let OidcStrategy = require('passport-openidconnect').Strategy;
//let history = require('connect-history-api-fallback');

let solrRouter = require('./routes/solr');
let ckanRouter = require('./routes/ckan/ckan');
let powRouter = require('./routes/pow');
let authRouter = require('./routes/auth');
let resourceRouter = require('./routes/resource');
let analyticsRouter = require('./routes/analytics');

let seoRouter = require('./routes/seo');

let app = express();

app.use(logger('dev'));
app.use(express.json({limit: '10Gb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

const sessionSettings = {
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: false
  }
}

// use redis for sessions if configured
if (config.redisHost && config.redisPort) {
  const clientConnectConfig = {
      host: config.redisHost,
      port: config.redisPort
  };
  if (config.redisPassword) clientConnectConfig.password = config.redisPassword;

  const redisClient = redis.createClient(clientConnectConfig);

  sessionSettings.store = new RedisStore({ client: redisClient })
}

app.use(session(sessionSettings));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

var strategy = new OidcStrategy(config.get('oidc'), function(issuer, sub, profile, accessToken, refreshToken, done){
  profile.jwt = accessToken;
  profile.refreshToken = refreshToken;
  profile.groups = [];

  let sep = config.get('authGroupSeperator');
  let sysAdminGroup = config.get('sysAdminGroup');
  let sysAdminGroupField = config.has('sysAdminGroupField') ? config.get('sysAdminGroupField') : 'groups';

  profile.sysAdmin = false;
  profile.isAdmin = false;
  profile.isEditor = false;
  profile.userPermissions = {};

  if ((typeof(profile._json) !== "undefined") && (typeof(profile._json[sysAdminGroupField]) !== "undefined")){
    profile.groups = profile._json[sysAdminGroupField];
    for (let i=0; i<profile._json[sysAdminGroupField].length; i++){
      let g = profile.groups[i];
      let og = profile.groups[i];
      if (g.substring(0,1) === sep){
          g = g.substring(1);
      }

      if (g.toLowerCase() === sysAdminGroup.toLowerCase()){
        profile.sysAdmin = true;
        if (profile.groups.indexOf(og) === -1){
          profile.groups.push(og);
        }
      }
    }
  }

  // for (let i=0; i<profile.groups.length; i++){
  //   let g = profile.groups[i];
  //   if (g.substring(0,1) === sep){
  //       g = g.substring(1);
  //   }

  //   // if (g.toLowerCase() == sysAdminGroup.toLowerCase()){
  //   //     profile.sysAdmin = true;
  //   // }

  //   let parts = g.split(sep);

  //   if (parts.length >= 2){
  //       let c = parts[parts.length-1];
  //       if (c === "admin"){
  //         profile.isAdmin = true;
  //       }else if (c === "editor"){
  //         profile.isEditor = true;
  //       }
  //       g = parts[parts.length-2];
  //       profile.userPermissions[g] = c;
  //   }
  // }

  if ( (typeof(accessToken) === "undefined") || (accessToken === null) || (typeof(refreshToken) === "undefined") || (refreshToken === null) ){
    return done("No access token", null);
  }
  return done(null, profile);
});


// set up passport
passport.use('oidc', strategy);

app.use('/client-api/version', function(req, res){
  var hash = (process.env.GITHASH) ? process.env.GITHASH : "";
  var pjson = require('./package.json');
  var v = pjson.version;

  if (parseFloat(v)<2.0){
    v += "b"
  }

  var version = v
  
  if (hash !== ""){
      version += "-"+hash
  }

  let config = require('config');
  let url = config.get('ckan');

  let reqUrl = url + "/api/3/action/status_show";
  let request = require('request');

  const NodeCache = require( "node-cache" );
  const cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
  const cacheKey = 'ckanVersion';

  let ckanV = cache.get(cacheKey);

  if (ckanV !== undefined){
    return res.json({
      v: v,
      hash: hash,
      version: version,
      ckanV: ckanV,
      name: 'ckan-ui'
    });
  }
  request(reqUrl, {}, function(err, apiRes, body){
    
    try{
      body = JSON.parse(body);
      ckanV = "?"
    }catch(ex){
      ckanV = "?"
    }
    ckanV = (body && body.result && body.result.ckan_version) ? body.result.ckan_version : "?";
    console.log(ckanV);
    if (ckanV !== "?"){
      cache.set(cacheKey, ckanV);
    }

    return res.json({
      v: v,
      hash: hash,
      version: version,
      ckanV: ckanV,
      name: 'ckan-ui'
    });      
  });
})

app.use('/client-api/solr', solrRouter);
app.use('/client-api/resource', resourceRouter);
app.use('/client-api/ckan', ckanRouter);
app.use('/client-api/pow', powRouter);
app.use('/client-api/an', analyticsRouter);
app.use('/client-api', authRouter);
app.use('/status', function(req, res){
  res.json({"status": "OK"}).status(200);
});

app.use('/', seoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  res.end("<html><head><title>404</title></head><body>404</body></html>");

  // const fs = require('fs');
  // fs.readFile('dist/index.html', 'utf-8', (err, content) => {
  //   if (err) {
  //     console.log('We cannot open "index.htm" file.');
  //     return next();
  //   }

  //   res.writeHead(200, {
  //     'Content-Type': 'text/html; charset=utf-8'
  //   });

  //   res.end(content);
  // });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err; //req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err);
  res.json({error: 'error'});
});

module.exports = app;
