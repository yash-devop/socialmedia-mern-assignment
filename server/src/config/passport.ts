import { config } from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/UserModel';
import { BACKEND_URL } from './constants';
config({
  path: ".env"
})
console.log(' process.env.GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID!);
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
  },
  async(accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : "",
        profilePicture: profile.photos ? profile.photos[0].value : '',
      });
      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      done(error, undefined);
    }
  }
));

// Serialize user to save to session
passport.serializeUser((user:any, done) => {
  console.log('user in serialize',user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);  // Attach the full user object to `req.user`
  } catch (error) {
    done(error);
  }
});