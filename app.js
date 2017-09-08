const express = require('express');
const mtg = require('mtgsdk');

const app = express();

app.get('/', function (req, res) {
	mtg.card.find(3)
	.then(result => {
	    res.send(result); // "Aether Revolt"
	});
 //  	res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
