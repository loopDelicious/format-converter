// postman
var expect = require('expect.js'),
    Swagger2Postman = require('./convert.js'),
    fs = require('fs'),
    path = require('path');

function handleConversion() {

    // convert your Swagger 2.0 files
    var samples = fs.readdirSync(path.join(__dirname, 'test/data'));
    samples.map(function (sample) {
        var samplePath = path.join(__dirname, 'test/data', sample);
        var swagger = require(samplePath),
            converter = new Swagger2Postman(), // initialize the class
            convertResult = converter.convert(swagger);

        // check the result of the conversion
        expect(convertResult.status).to.be('passed');

        var outputFilename = './pm2-' + sample; // path of the file to output
        fs.writeFileSync(outputFilename, JSON.stringify(convertResult.collection, null, 4)); // write to the file system
        console.log('Saved to ' + outputFilename);

    });
}

handleConversion();
