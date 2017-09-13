'use strict'

const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
const ejs = require('ejs');
const mtg = require('mtgsdk');

const server = new Hapi.Server();

server.connection({
    host: '127.0.0.1',
    port: 3000
});

// REgister vision for our views.
server.register(Vision, (err) => {
    server.views({
        engines: {
            ejs: ejs
        },
        relativeTo: __dirname,
        path: './views',
    });
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        Request.get('https://api.magicthegathering.io/v1/sets', function(error, response, body) {
            if (error) {
                throw error;
            }

            const data = JSON.parse(body);

            reply.view('index', {
                title: 'Testes!',
                sets: data.sets
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/set/{setId}',
    handler: function (request, reply) {
        Request.get('https://api.magicthegathering.io/v1/cards?set=' + request.params.setId, function(error, response, body) {
            if (error) {
                throw error;
            }

            const data = JSON.parse(body);

            reply.view('set', {
                title: 'Hola!',
                cards: data.cards
            });
        });
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
