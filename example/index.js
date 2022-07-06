const { Radiator } = require('../lib')
const config = require('./example.config.json')
const express = require('express');
const session = require('express-session');
require('dotenv').config()

const passport = require('passport');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const app = express();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const CALLBACK_URL ='http://localhost:3000/authorized'
const PORT=3000
let userInfo = {}

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( function(id, done) {
  done(null, id);
});

passport.deserializeUser( function(id, done) {
  done(null, id);
});

passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, email, cb) {
    userInfo.idToken = profile.id_token
    userInfo.accessToken = accessToken
    userInfo.refreshToken = refreshToken
    return cb(null, userInfo);
  }
));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/google/auth',
  passport.authenticate('google', {
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/analytics.readonly'],
      accessType: 'offline',
      prompt: 'consent',
  })
);

app.get('/authorized',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const {
      authConfig,
      analyticsConfig,
      slackConfig,
      lighthouseConfig,
      quora,
      firestoreId,
      redditConfig,
      pageAnalyticsConfig,
    } = config

    Object.assign(authConfig, userInfo)

    const radiator = new Radiator(authConfig)
    // radiator.useAnalytics(analyticsConfig)
    radiator.useSlack(slackConfig)
    // radiator.useRedditCountPosts(redditConfig)
    // radiator.useQuoraService(quora, firestoreId)
    // radiator.useNewPagesInSite(lighthouseConfig, firestoreId)
    // radiator.useRedditCountPosts()
    radiator.usePageAnalytics(pageAnalyticsConfig, firestoreId)
    radiator.run()

    res.redirect('/');
  }
);

app.listen(PORT, () => {
  console.log('Server is running on Port ' + PORT)
  const url = `http://localhost:${PORT}`
  require('child_process')
      .exec((process.platform
          .replace('darwin','')
          .replace(/win32|linux/,'xdg-') + 'open ' + url));
})
