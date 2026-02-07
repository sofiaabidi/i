import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

export const configurePassport = () => {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || (profile.name?.givenName + ' ' + profile.name?.familyName) || 'User';

        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          // Create new user if they don't exist
          user = new User({
            name,
            email,
            googleId: profile.id,
            provider: 'google',
            avatar: profile.photos?.[0]?.value,
          });
          await user.save();
        } else {
          // Update existing user with Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            user.provider = 'google';
            if (!user.avatar) {
              user.avatar = profile.photos?.[0]?.value;
            }
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        console.error('Google OAuth error:', err);
        return done(err, null);
      }
    }
  ));

  // GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5001/api/auth/github/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // GitHub profile structure: profile._json contains the full profile
          // profile.emails might be an array or might need to be fetched separately
          const email = profile.emails?.[0]?.value || 
                       profile._json?.email || 
                       `${profile.username}@users.noreply.github.com`;
          const name = profile.displayName || 
                      profile._json?.name || 
                      profile.username || 
                      'User';
          const avatar = profile._json?.avatar_url || profile.photos?.[0]?.value;

          let user = await User.findOne({
            $or: [{ githubId: profile.id.toString() }, { email }],
          });

          if (!user) {
            // Create new user if they don't exist
            user = new User({
              name,
              email,
              githubId: profile.id.toString(),
              provider: 'github',
              avatar,
            });
            await user.save();
          } else {
            // Update existing user with GitHub ID if not set
            if (!user.githubId) {
              user.githubId = profile.id.toString();
              user.provider = 'github';
              if (!user.avatar && avatar) {
                user.avatar = avatar;
              }
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          console.error('GitHub OAuth error:', err);
          return done(err, null);
        }
      }
    ));
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};