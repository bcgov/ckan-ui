let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let config = require('config');
let session = require('express-session');
let passport = require('passport');
let OidcStrategy = require('passport-openidconnect').Strategy;

let solrRouter = require('./routes/solr');
let ckanRouter = require('./routes/ckan');
let authRouter = require('./routes/auth');
let resourceRouter = require('./routes/resource');
let analyticsRouter = require('./routes/analytics');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));


app.use(session({
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: false
  }
}));
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
  profile.refreshToken = refreshToken


  if ( (typeof(accessToken) === "undefined") || (accessToken === null) || (typeof(refreshToken) === "undefined") || (refreshToken === null) ){
    return done("No access token", null);
  }
  return done(null, profile);
});


// set up passport
passport.use('oidc', strategy);

app.use('/api/solr', solrRouter);
app.use('/api/resource', resourceRouter);
app.use('/api/ckan', ckanRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: 'error'});
});

module.exports = app;
