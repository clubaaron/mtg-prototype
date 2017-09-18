const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('mtg', ['users']);
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req, res) {
	res.render('users');
});

// Login Page -- GET
router.get('/login', function(req, res) {
	res.render('login');
});

// Register Page -- GET
router.get('/register', function(req, res) {
	res.render('register');
});

// Register -- POST
router.post('/register', function(req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const password2 = req.body.password2;

	// Validation.
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('firstName', 'First Name field is required').notEmpty();
	req.checkBody('lastName', 'Last Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Please use valid email address').isEmail();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(password);

	const errors = req.validationErrors();

	if (errors) {
		console.log('Form has errors...');
		res.render('register', {
			errors: errors,
			username: username,
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password
		});
	}
	else {
		const newUser = {
			username: username,
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password
		}

		// Encrypt the password.
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newUser.password, salt, function(err, hash) {
				newUser.password = hash;

				db.users.insert(newUser, function(err, doc) {
					if (err) {
						res.send(err);
					}
					else {
						console.log('User Added...');

						// Success message
						req.flash('success', 'You are registered and can log in');

						// Redirecter after register.
						res.location('/');
						res.redirect('/');
					}
				});
			});
		});
	}
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	db.users.findOne({ _id: mongojs.ObjectId(id) }, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		db.users.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}

			bcrypt.compare(password, user.password, function(err, isMatch) {
				if (err) {
					return done(err);
				}

				if (isMatch) {
					return done(null, user);
				}
				else {
					return done(null, false, { message: 'Incorrect password' });
				}
			})
		});
	}
));

// Login -- POST
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username or Password' }),
	function(req, res) {
	   console.log('Auth Successful');
	   res.redirect('/');
   }
);

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});

module.exports = router;
