var expect = require('expect.js'),
    Swagger2Postman = require('../convert.js'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    config = require('../config.json');

// convert your Swagger 2.0 files to Postman 1.0
function handleConversion() {

    var samples = fs.readdirSync(path.join('../test/data'));

    samples.map(function (sample) {

        // to access swagger files located in separate directory
        var samplePath = path.join('../test/data', sample);

        // initialize class, and convert swagger to postman
        var swagger = require(samplePath),
            converter = new Swagger2Postman(),
            convertResult = converter.convert(swagger);

        // check the result of the conversion
        expect(convertResult.status).to.be('passed');

        // create a new directory for your converted files if none exist
        var dir = '../test/converted';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // write to the file system
        var outputFilename = '../test/converted/' + sample.split('.')[0] + '-converted.json';
        fs.writeFileSync(outputFilename, JSON.stringify(convertResult.collection, null, 4));
        console.log('Saved to ' + outputFilename);

    });
}

// update Postman collections using the Postman API
function updateCollections() {

    // set an environment variable to store your sensitive info
    // an example of how to set up and read environment variables in Node: https://nodejs.org/api/process.html#process_process_env
    var postmanAPIKey = process.env.postmanKey;

    var collections = fs.readdirSync(path.join(__dirname, 'test/converted'));

    collections.map(function (collection) {

        // to access converted files in a separate directory
        var collectionPath = path.join(__dirname, 'test/converted', collection);

        var collectionFileName = collection.split('.')[0];

        var collection_uid = config.collection
            .filter(function(coll) {
            return coll.to == collectionFileName;
            })
            .map(function(coll) {
                return coll.collection_uid;
            });

        fs.readFile(collectionPath, 'utf8', function(err, data) {
            if (err) throw new Error(err);

            var putOptions = {
                method: 'PUT',
                url: `https://api.getpostman.com/collections/` + collection_uid[0],
                headers: {
                    'Postman-Token': '4122abb3-6098-6906-e172-49334961f595',
                    'Cache-Control': 'no-cache',
                    'X-Api-Key': postmanAPIKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                json: true
            };

            request(putOptions, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
            });

        });
    });
}

// collection to update
// var collection_uid = '25fce390-37e7-9656-3533-32acbd8ed340';

handleConversion();
// updateCollections();