const passport = require('passport');
const User = require('../models/user');

const CLIENT_GOOGLE_KEY = process.env.CLIENT_GOOGLE_KEY;
const CLIENT_GOOGLE_SECRET_KEY = process.env.CLIENT_GOOGLE_SECRET_KEY;

const CLIENT_FACEBOOK_KEY = process.env.CLIENT_FACEBOOK_KEY;
const CLIENT_FACEBOOK_SECRET_KEY = process.env.CLIENT_FACEBOOK_SECRET_KEY;



var GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
    'google',
    new GoogleStrategy({
            clientID: CLIENT_GOOGLE_KEY,
            clientSecret: CLIENT_GOOGLE_SECRET_KEY,
            callbackURL: "/user/auth/google/callback",
            passReqToCallback: true
        },
        function(request, accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOne({ emailAddress: profile.email }, function(err, user) {
                if (user) {
                    return done(null, user);
                } else {
                    // new User({
                    //         emailAddress: profile.email,
                    //         name: profile.family_name + " " + profile.given_name,
                    //         urlAvatar: profile.picture
                    //     }).save()
                    //     .then(newUser => {
                    //         return done(null, newUser);
                    //     })
                    //     .catch(err => {
                    //         return done(err, null);
                    //     })
                    return done(err, null);
                }
            });
        }
    ));


passport.use(
    'facebook', new FacebookStrategy({
            clientID: CLIENT_FACEBOOK_KEY,
            clientSecret: CLIENT_FACEBOOK_SECRET_KEY,
            callbackURL: '/user/auth/facebook/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOne({ facebookId: profile.facebookId }, function(err, user) {
                console.log(profile);
                if (user) {
                    return done(null, user);
                } else {
                    return done(err, null);
                }
            });
        }))


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(user => {
        done(null, user);
    });
});

module.exports = passport;