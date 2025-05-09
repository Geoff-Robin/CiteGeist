const passport = require('passport');
const {createUserByGoogleOAuth,getUserByGoogleId} = require('../Users/controller')
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config()


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, async(accessToken, refreshToken, profile, done) => {
    let user = await getUserByGoogleId(profile.id);
    if(!user){
        user = await createUserByGoogleOAuth(profile);
    }
    return done(null, user);
}));
