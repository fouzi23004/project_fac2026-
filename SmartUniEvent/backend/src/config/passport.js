const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || '@etudiant-fst.utm.tn';

        // Check if email ends with allowed domain
        if (!email.endsWith(allowedDomain)) {
          return done(null, false, {
            message: `Only emails ending with ${allowedDomain} are allowed`,
          });
        }

        // Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
          // User exists, return user
          return done(null, existingUser.rows[0]);
        }

        // Create new user
        const firstName = profile.name.givenName || '';
        const lastName = profile.name.familyName || '';
        const userId = uuidv4();

        const newUser = await db.query(
          `INSERT INTO users (id, first_name, last_name, email, oauth_provider, oauth_id, is_verified, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [userId, firstName, lastName, email, 'google', profile.id, true, 'student']
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
