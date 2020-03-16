'use strict'

module.exports = function(context){

    const db =  context.db.db('restifydb');
    //console.log(db)//context.db;
    const server = context.server;
    const collection = db.collection('todos');

    server.post('/todos', (request, response, next) => {
        
        // extract data from body and add timestamps
        const data = Object.assign({}, request.body, {
            created: new Date(),
            updated: new Date()
        });

        //insert data to collection
        collection.insertOne(data)
        .then(doc => response.send(200))
        .catch(err => response.send(500));

        next();
    });

    server.get('/todos', (request, response, next) => { 
        let limit = parseInt(request.query.limit, 10) || 10, 
        skip = parseInt(request.query.skip, 10) || 0,
        query = request.query || {};

        // remove skip and limit from query to avoid false querying
        delete query.skip
        delete query.limit

        // find todos and convert to array (with optional query, skip and limit)
        collection.find(query).skip(skip).limit(limit).toArray()
            .then(docs => response.send(200, docs))
            .catch(err => response.send(500, err));

        next();
    });

    server.put('/todos/:id', (req, res, next) => {

        // extract data from body and add timestamps
        const data = Object.assign({}, req.body, {
            updated: new Date()
        })

        // build out findOneAndUpdate variables to keep things organized
        let query = { _id: req.params.id },
            body  = { $set: data },
            opts  = {
                returnOriginal: false,
                upsert: true
            }

        // find and update document based on passed in id (via route)
        collection.findOneAndUpdate(query, body, opts)
            .then(doc => res.send(204))
            .catch(err => res.send(500, err))

        next()

    })

    server.del('/todos/:id', (req, res, next) => {

        // remove one document based on passed in id (via route)
        collection.findOneAndDelete({ _id: req.params.id })
            .then(doc => res.send(204))
            .catch(err => res.send(500, err))

        next()

    })
}