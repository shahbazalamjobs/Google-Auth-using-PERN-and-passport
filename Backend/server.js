const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./passport');
const pool = require('./db');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('API working');
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

app.get('/protected', isAuthenticated, (req, res) => {
    console.log(req)
    res.send('This is a protected route.');
});

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});
