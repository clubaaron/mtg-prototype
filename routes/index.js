const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('mtg', ['users', 'cards']);

router.get('/', ensureAuthenticated, function(req, res) {
	db.cards.find(function(err, doc) {
		if (err) {
			return done(err);
		}

		let hasCards = false;

		if (doc.length > 0) {
			hasCards = true;
		}

		res.render('index', { hasCards: hasCards });
	})
});

// Deck Builder Page -- Get
router.get('/deck-builder', ensureAuthenticated, function(req, res) {
	res.render('deck-builder');
});

// Deck Builder -- POST
router.post('/deck-builder', ensureAuthenticated, function(req, res) {

	db.cards.findOne({ multiverseid: 430829}, function(err, card) {
		// @todo: need to define what's in a deck object - type? etc.
		const newDeck = {
			type: 'standard',
			cards: [cards],
		};

		db.users.update(
			{ _id: req.user._id },
			{ $push: {
				decks: newDeck
			}},
			function(err, doc) {
				if (err) {
					res.send(err);
				}
				else {
					// Redirecter after register.
					res.location('/');
					res.redirect('/');
				}
			}
		);
	});
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('went through routes/index.js');
        return next();
    }

    res.redirect('/users/login');
}

module.exports = router;
