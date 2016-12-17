var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var express = require('express');
var router = express.Router();
var models = require('../models/index.js');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.PROJECT_URL+"/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    models.User.findOrCreate({
      where: {
        twitterId: profile.id
      },
      defaults: {
        twitterId: profile.id,
        twitterDisplayName: profile.displayName
      }
    }).spread(function(user, created) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  }
));

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/auth/twitter',
                                     failureFlash: true,
                                     successFlash: 'Welcome!' }));

router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
