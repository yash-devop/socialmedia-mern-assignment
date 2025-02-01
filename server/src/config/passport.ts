import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:4000/api/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // You can store the profile data in a database here (e.g., MongoDB)
    return done(null, profile); // Pass user profile to the session
  }
));

// Serialize user to save to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});