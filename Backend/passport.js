const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
    let user = res.rows[0];

    if (!user) {
      const newUser = await pool.query(
        'INSERT INTO users (google_id, email) VALUES ($1, $2) RETURNING *',
        [profile.id, profile.emails[0].value]
      );
      user = newUser.rows[0];
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err);
  }
});
