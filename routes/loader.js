const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('mtg', ['cards']);
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Request = require('request');

// Loader Page -- GET
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('loader/load');
});

// Loader Page -- POST
router.post('/', ensureAuthenticated, function(req, res) {
    const url = 'https://api.magicthegathering.io/v1/cards?multiverseid=430829'
    Request.get(url, (error, response, body) => {
        if (error) {
            throw error;
        }

        const newCard = JSON.parse(body);

        db.cards.insert(newCard, (err, doc) => {
            if (err) {
                res.send(err);
            }
            else {
                console.log('Added a card!');

                // Success message
                req.flash('success', 'You have added a card to the DB.');

                // Redirecter after register.
                res.location('/');
                res.redirect('/');
            }
        });
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('well done, squire');
        return next();
    }

    res.redirect('/users/login');
}

module.exports = router;
