var expect = require('expect.js'),
    Swagger2Postman = require('./convert.js'),
    fs = require('fs'),
    path = require('path');

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

        // write to the file system
        var outputFilename = './pm2-' + sample;
        fs.writeFileSync(outputFilename, JSON.stringify(convertResult.collection, null, 4));
        console.log('Saved to ' + outputFilename);

    });
}

handleConversion();
