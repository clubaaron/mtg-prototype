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
	db.cards.find(function(err, cards) {
		if (err) {
			return done(err);
		}

		for (let i = 0; i < cards.length; i++) {
			cards[i].classes = 'list-group-item ';
			console.log(cards[i].colors[0]);

			if (cards[i].colors.length > 1) {
				for (let j = 0; j < cards[i].colors.length; j++) {
					if (j < 1) {
						cards[i].classes += ' multi-color-' + cards[i].colors[j].toLowerCase();
					}
					else {
						cards[i].classes += '-' + cards[i].colors[j].toLowerCase();
					}
				}
			}
			else {
				if (cards[i].colors[0] === 'White') {
					cards[i].classes += ' list-group-item-light';
				}
				else if (cards[i].colors[0] === 'Black') {
					cards[i].classes += ' list-group-item-dark';
				}
				else if (cards[i].colors[0] === 'Blue') {
					cards[i].classes += ' list-group-item-primary';
				}
				else if (cards[i].colors[0] === 'Green') {
					cards[i].classes += ' list-group-item-success';
				}
				else if (cards[i].colors[0] === 'Red') {
					cards[i].classes += ' list-group-item-danger';
				}
			}
		}

		res.render('loader/load', { cards: cards });
	});
});

// Loader Page -- POST
router.post('/', ensureAuthenticated, function(req, res) {

	const cardName = req.body.cardName;
	const url = 'https://api.magicthegathering.io/v1/cards?name=' + encodeURIComponent(cardName);
    Request.get(url, (error, response, body) => {
        if (error) {
            throw error;
        }

        const newCard = JSON.parse(body).cards[0];

		/**
		 * @TODO: NEED TO MAKE SURE CARD IS NOT ALREADY STORED.
		 */
        db.cards.insert(newCard, (err, doc) => {
            if (err) {
                res.send(err);
            }
            else {
                console.log('Added a card!');

                // Success message
                req.flash('success', 'You have added a card to the DB.');

                // Redirecter after register.
				res.location('/loader');
				res.redirect('/loader');
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
