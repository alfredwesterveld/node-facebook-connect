var PORT = 8888;
var HOST = 'localhost';

var express = require('express');
var app = module.exports = express.createServer();

var onAuthentication = function(req, res, openid_result) {
    console.log(openid_result);
    res.send("" + openid_result.identifier);
}

var baseURL = 'http://localhost:8888'; // base URL to map to your host
var fb-settings = require('./settings');
require('facebook-connect').create(app, facebook, onAuthentication);


/**
 * this route uses googlelogin Route Middleware.
 */
app.get('/', googlelogin, function(req, res) {
});

if (!module.parent) {
    app.listen(PORT, HOST);
}
