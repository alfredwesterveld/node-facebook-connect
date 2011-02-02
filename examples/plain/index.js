module.exports.create = function() {
    /* Modify these to your required configuration.
     */
    var PORT = 8888;
    var HOST = 'localhost';
    var KEY = 'some-key'; // Used to encrypt your cookie.
    var SECRET = 'your sEcret'; // Used to encrypt your cookie.
    // Your facebook settings should also be configured.
    var SETTINGS = require('./../facebook-settings');

    // See http://expressjs.com for more information.
    var express = require('express');
    app = module.exports = express.createServer();
    app.configure(function(){
        app.use(express.cookieDecoder()); // Library requires cookies.
        app.use(express.session({ key: KEY, secret: SECRET})); // Library requires session.
        app.use(express.bodyDecoder()); // Libray does not need this, but very usefull in my opinion.
        app.use(express.logger()); // Library does not need this, but might be helpfull for debugging.
    });

    /**
     * Callback on Facebook Authentication.
     */
    var onAuthentication = function(req, res, authenticated) {
        if(authenticated) {
            // We are authenticated. Do with the data as you please.
            res.send("<html><p>Hello Facebook user:" + JSON.stringify( req.getAuthDetails() ) + ".</p></html>");
        } else {
            // Authentication failed. I think you might should show something more usefull.
            res.send("<html><h1>Facebook authentication failed :( </h1></html>");
        }
    };
    var facebookConnect = require('facebook-connect').create(app, SETTINGS, onAuthentication);

    /**
     * Route Middleware that requires Facebook authentication.
     * @see http://expressjs.com/guide.html#Route-Middleware for more information
     */
    var facebookConnectMiddleware = function(req, res, next) {
        if( !req.isAuthenticated() ) {
            /* Shows a form to redirect user to Facebook Connect. 
             * If you want to have a different view/layout you should modify this.
             */
           res.send(
    '<html>\n' +
        '<head>\n' +
            '<title>connect Auth -- Not Authenticated</title>\n' +
        '</head>\n' +
        '<body>\n' +
            '<div id="wrapper">\n' +
            '<h1>Not authenticated</h1>\n' +
                facebookConnect.renderSimpleFacebookRedirector() + 
            '</div>\n' +
        '</body>\n' +
    '</html>');
        } else {
           res.send( JSON.stringify( req.getAuthDetails()) );
        }
        next();
    };

    /**
     * Requires facebook authentication. Requires this via facebookConnectMiddleware.
     */
    app.get('/', facebookConnectMiddleware, function(req, res) {
    });
   
    app.listen(PORT, HOST);
};
