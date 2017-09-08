const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mtg = require('mtgsdk');

const app = express();

// Set view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
	mtg.card.where({ name: 'Nicol Bolas, God-Pharaoh'})
	.then(cards => {
		// res.send(cards[0].name);
	    res.render('index', { card: cards[0] });
	});
 //  	res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
