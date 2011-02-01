var express= require('express');
var auth= require('connect-auth');

var FacebookConnect = function(app, SETTINGS, onAuthentication) {
    if(!SETTINGS.ID) {
        throw Error('facebook object literal is missing id');
    }
    if(!SETTINGS.SECRET) {
        throw Error('facebook object literal is missing secret');
    }
    if(!SETTINGS.CALLBACK) {
        throw Error('facebook object literal is missing callback');
    }
    this.SETTINGS = SETTINGS;
    
    // Method to handle a sign-in with a specified method type, and a url to go back to ...
    var CALLBACK = SETTINGS.CALLBACK.replace(/\/$/, ''); // remove trailing slash.
    
    app.use(auth( [
        auth.Facebook({
            appId : SETTINGS.ID,
            appSecret: SETTINGS.SECRET,
            callback: CALLBACK + '/auth/facebook',
            scope: 'email'})
    ]) );
    
    app.get('/auth/facebook', function(req,res) {
        req.authenticate(['facebook'], function(error, authenticated) {
            onAuthentication(req, res, authenticated);
        });
    });
    
    app.get('/auth/logout', function(req, res, params) {
        req.logout();
        res.writeHead(303, { 'Location': "/" });
        res.end('');
    });
};

/**
 * @See http://developers.facebook.com/docs/reference/plugins/login
 */
FacebookConnect.prototype.renderSimpleFacebookRedirector = function(res) {
    return '<div id="fb-root"></div>\n' +
    '<script src="http://connect.facebook.net/en_US/all.js"></script>\n' +
    '<script>\n' +
        'FB.init({\n' +
            'appId:"' + this.SETTINGS.ID + '", \n' +
            'cookie:true, \n' +
            'status:true, xfbml:true \n' +
        '});\n' +
    '</script>\n' +
    '<a href=\"/auth/facebook\">\n' +
        '<fb:login-button>Login with Facebook</fb:login-button>\n' +
    '</a>';
};

module.exports.create = function(app, SETTINGS, onAuthentication) {
    if (!SETTINGS) {
        throw Error("Facebook object literal missing");
    }
    if (!onAuthentication) {
        throw Error("`onAuthentication` callback missing");
    }
    return new FacebookConnect(app, SETTINGS, onAuthentication);
};
