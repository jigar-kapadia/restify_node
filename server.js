'use strict'
//Dependencies
const restify = require('restify');
const config = require('./config');
const mongoClient = require('mongodb').MongoClient;
const routes = require('./route');
//Initialize Server
const server = restify.createServer({
    name: config.name,
    version: config.version
});

//Bundled Plugins
server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());

// Lift server, connect to DB, Require Route file
server.listen(config.port, () => {
    mongoClient.connect('', (err, db) => {
       
        if (err) {
            console.log('An error occurred while attempting to connect to MongoDB', err)
            process.exit(1)
        }

        console.log(
            '%s v%s ready to accept connections on port %s in %s environment.',
            server.name,
            config.version,
            config.port,
            config.env
        )
        routes({ db, server });
    })
})