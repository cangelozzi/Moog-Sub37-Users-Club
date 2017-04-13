// 1.add modules
var express = require('express');
var path = require('path');
var cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/loginapp');
mongoose.connect('mongodb://camillo:1234@ds135690.mlab.com:35690/loginapp');
var db = mongoose.connection;
var dataFile = require('./data/data.json');
var io = require('socket.io')();


// 2.create routes
var routes = require('./routes/index');
var users = require('./routes/users');
//var events = require('./routes/events');

// 3.initialize app
var app = express();

// go to mock data
app.locals.allEvents = dataFile.events;

// create a variable and send the data to the whole app
app.set('appData', dataFile);

// 4.setup View Engine
// setup a folder called "views" to handle our views
app.set('views', path.join(__dirname, 'views'));
// setup "handlebars" as our view engine
// and default layout file to be called "layout"
app.engine('handlebars', exphbs({
  defaultLayout: 'layout'
}));
// set the view engine using handlebars and ejs
app.set('view engine', 'handlebars');
//app.set('view engine', 'ejs');

// 5.setup BodyParser as Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// 6.setup "Public" folder as our static folder
app.use(express.static(path.join(__dirname, 'public')));

// 7.setup Express Session Middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// 8.setup Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// 9.setup Express Validator Middleware (from their github page)
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// 10.setup Connect Flash
app.use(flash());
// global variables for our Flash method
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // set by Passport
  res.locals.user = req.user || null;
  next();
});

// 11.middleware for routes files
app.use('/', routes);
app.use('/users', users);

app.use(require('./routes/sub'));
app.use(require('./routes/feedback'));
app.use(require('./routes/feedbackAPI'));
app.use(require('./routes/chat'));
app.use(require('./routes/soundbasic'));
app.use(require('./routes/soundclips'));


// 12.Set Port @ 3000
app.set('port', (process.env.PORT || 3000));

var server = app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});

// attach socket to the server
io.attach(server);

var userConnected = 0;
// connect Socket
io.on('connection', function(socket) {

  // for TEST with Mocha/Chai purposes ONLY
  socket.on('connection name',function(user){
    io.sockets.emit('new user', user.name + " has joined.");
  })
 // ---------------------------------------------------------


  console.log('Socket.IO - Welcome! - User Connected')
   userConnected++
   console.log('connections: ' + userConnected)

   // "postMessage" detect the message
  socket.on('postMessage', function(data){
    io.emit('updateMessage', data);
  });

  socket.on('disconnect', function() {
    console.log('Socket.IO - Goodbye! - User Disconnected')
    userConnected--
    io.emit('user disconnected');
    console.log('connections: ' + userConnected)
  })
});

exports.app = app;
