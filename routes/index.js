const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('mtg', ['users', 'cards']);

router.get('/', ensureAuthenticated, function(req, res) {
	res.render('index');
});

// Deck Builder Page -- Get
router.get('/deck-builder', ensureAuthenticated, function(req, res) {
	res.render('deck-builder');
});

// Deck Builder -- POST
router.post('/deck-builder', ensureAuthenticated, function(req, res) {
	console.log(req.user);

	const card = {
		name: 'Gorgon of Filth',
	}

	const cards = [card];

	// @todo: need to define what's in a deck object - type? etc.
	const newDeck = {
		type: 'standard',
		cards: cards,
	};

	db.users.update(
		{ _id: req.user._id },
		{ $push: {
			decks: newDeck
		}}
	);


	// db.users.decks.insert(newDeck, (err, doc) => {
	// 	if (err) {
	// 		res.send(err);
	// 	}
	// 	else {
	// 		console.log('Deck added...');
	// 		// Success message
	// 		req.flash('success', 'You created a new deck.');
	//
	// 		// Redirecter after register.
	// 		res.location('/deck-builder');
	// 		res.redirect('/deck-builder');
	// 	}
	// });

	// Redirecter after register.
	res.location('/deck-builder');
	res.redirect('/deck-builder');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('went through routes/index.js');
        return next();
    }

    res.redirect('/users/login');
}

module.exports = router;
