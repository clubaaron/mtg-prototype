const express = require('express');
const mtg = require('mtgsdk');

const app = express();

app.get('/', function (req, res) {
	mtg.card.where({ name: 'Nicol Bolas, God-Pharaoh'})
	.then(result => {
	    res.send(result);
	});
 //  	res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
