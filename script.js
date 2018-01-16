var expect = require('expect.js'),
    Swagger2Postman = require('./convert.js'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    config = require('./config.json');

// convert your Swagger 2.0 files to Postman 1.0
function handleConversion() {

    var samples = fs.readdirSync(path.join(__dirname, 'test/data'));

    samples.map(function (sample) {

        // to access swagger files located in separate directory
        var samplePath = path.join(__dirname, 'test/data', sample);

        // initialize class, and convert swagger to postman
        var swagger = require(samplePath),
            converter = new Swagger2Postman(),
            convertResult = converter.convert(swagger);

        // check the result of the conversion
        expect(convertResult.status).to.be('passed');

        // create a new directory for your converted files if none exist
        var dir = './test/converted';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // write to the file system
        var outputFilename = './test/converted/pm2-' + sample;
        fs.writeFileSync(outputFilename, JSON.stringify(convertResult.collection, null, 4));
        console.log('Saved to ' + outputFilename);

    });
}

// handleConversion();

// update Postman collections using the Postman API
function updateCollections() {

    // set an environment variable to store your sensitive info
    var postmanAPIKey = process.env.postmanKey;

    var collections = fs.readdirSync(path.join(__dirname, 'test/converted'));

    collections.map(function (collection) {

        // to access converted files in a separate directory
        var collectionPath = path.join(__dirname, 'test/converted', collection);

        var collectionFileName = collection.split('.')[0];
        console.log(collectionFileName);

        var collection_uid = config.collection
            .filter(function(coll) {
            return coll.to == collectionFileName;
            })
            .map(function(coll) {
                return coll.collection_uid;
            });

        // var putOptions = {
        //     method: 'PUT',
        //     url: `https://api.getpostman.com/collections/` + collection_uid,
        //     headers: {
        //         'Postman-Token': 'b49bbebf-434c-2559-d0a7-7e7b0a2af45e',
        //         'Cache-Control': 'no-cache',
        //         'X-Api-Key': postmanAPIKey,
        //         'Content-Type': 'application/json'
        //     },
        //     body: collectionPath, // TODO: pull from a new folder for updated swagger files
        //     json: true
        // };
        //
        // request(putOptions, function (error, response, body) {
        //     if (error) throw new Error(error);
        //     console.log(body);
        //     //    TODO: programmatically get collection id's from swagger files
        // });

    });

}

// collection to update
var collection_uid = '25fce390-37e7-9656-3533-32acbd8ed340';

updateCollections();