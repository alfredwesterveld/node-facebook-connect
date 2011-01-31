//const fbId = ""; #x
//const fbSecret = ""; #y
//const fbCallbackAddress= "http://localhost:4000/auth/facebook";
/*
app.configure(function(){
  app.use(express.cookieDecoder());
  app.use(express.logger());
  //app.use(connect.session({ store: new RedisStore({ maxAge: 10080000 }) }));
  app.use(express.session());
  app.use(auth( [
    auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
  ]) );
});

app.get('/', function(req, res, params) {
    if( !req.isAuthenticated() ) {
        res.send('<html>                                              \n\
          <head>                                             \n\
            <title>connect Auth -- Not Authenticated</title> \n\
            <script src="http://static.ak.fbcdn.net/connect/en_US/core.js"></script> \n\
          </head><body>                                             \n\
            <div id="wrapper">                               \n\
              <h1>Not authenticated</h1>                     \n\
              <div class="fb_button" id="fb-login" style="float:left; background-position: left -188px">          \n\
                <a href="/auth/facebook" class="fb_button_medium">        \n\
                  <span id="fb_login_text" class="fb_button_text"> \n\
                    Connect with Facebook                    \n\
                  </span>                                    \n\
                </a>                                         \n\
              </div></body></html>');
    } else {
         res.send( JSON.stringify( req.getAuthDetails()) );
    }
});

*/
var FacebookConnect = function(app, facebook, onAuthentication) {
    // Method to handle a sign-in with a specified method type, and a url to go back to ...
    if (!facebook.id || !facebook.secret || !fb.callback) {
        throw "facebook object literal error";
    }
    
    if (!typeof onAuthentication == 'function') {
        throw 'onAuthentication error';
    }
    
    app.use(auth( [
        auth.Facebook({appId : facebook.id, appSecret: facebook.secret, scope: "email", callback: facebook.callback})
    ]) );
    app.get('/auth/facebook', function(req,res) {
      req.authenticate(['facebook'], function(error, authenticated) { 
         onAuthentication(req);
       });
    });
    
    app.get('/auth/logout', function(req, res, params) {
        req.logout();
        res.writeHead(303, { 'Location': "/" });
        res.end('');
    });
}

FacebookConnect.prototype.dada = function() {
}

module.exports.create = function(app, facebook, onAuthentication) {
    return new FacebookConnect(app, facebook, onAuthentication);
}
