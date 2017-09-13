const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const mtg = require('mtgsdk');
const Request = require('request');

const app = express();

const PORT = 3000;

// Set view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	Request.get('https://api.magicthegathering.io/v1/sets', (error, response, body) => {
		if (error) {
			throw error;
		}

		const data = JSON.parse(body);

		for (elem in response.headers) {
			console.log('ahem ' + elem + ' : ' + response.headers[elem]);
		}

		console.log(response.headers['link']);

		res.render('index', {
			title: 'MTG Set List',
			sets: data.sets,
			link: response.headers['link'],
		});
	});
});
//
// app.get('/sets', function (req, res) {
// 	mtg.set.where()
// 	.then(sets => {
// 		res.render('set-index', {
// 			title: 'Set Index',
// 			sets: sets
// 		});
// 	});
// });

app.get('/set/:setCode', function (req, res) {
	mtg.card.where({ set: req.params.setCode, page: 1 })
	.then(cards => {
	    res.render('set', {
			title: cards[0].setName,
			cards: cards
		});
	});
});

app.get('/card/:cardID', function (req, res) {
	mtg.card.find(req.params.cardID)
	.then(result => {
	    res.render('card-detail', {
			title: result.card.name,
			card: result.card
		});
	});
});

app.get('/exampleCard', function (req, res) {
	mtg.card.where({ name: 'Nicol Bolas, God-Pharaoh'})
	.then(card => {
	    res.send(card);
	});
});

app.get('/exampleSet', function (req, res) {
	mtg.set.find('AER')
	.then(set => {
	    res.send(set);
	});
});

app.listen(PORT);
console.log('server started on port %s', PORT);
