var express = require('express');
var app = express();
/**
 * Usage
 * node app.js -u http://example.com -p 8888
 */
var phantom = require('phantom');
var argv = require('argv');

argv.option([
    {
        name: 'port',
        short: 'p',
        type: 'int'
    },
    {
        name: 'url',
        short: 'u',
        type: 'string'
    },
]);

var argvObj = argv.run();
var port = argvObj.options.port;
var url = argvObj.options.url;

app.get('/', function (req, res) {
    var sitepage = null;
    var phInstance = null;
    
    phantom.create()
        .then(instance => {
            phInstance = instance;
            return instance.createPage();
        })
        .then(page => {
            sitepage = page;
            return page.open(url);
        })
        .then(status => {
            return sitepage.property('content');
        })
        .then(content => {
            res.send(content);
            sitepage.close();
            phInstance.exit();
        })
        .catch(error => {
            console.log(error);
            phInstance.exit();
        });
});

app.listen(port, function () {
    console.log('server start listen port is ' + port);
});
