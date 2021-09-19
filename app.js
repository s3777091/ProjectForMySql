var express = require('express');
const expressLayouts = require("express-ejs-layouts");
var path = require('path');
const compression = require('compression');

var favicon = require('serve-favicon');
var morgan = require('morgan');

// authentication modules
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csrf = require('csrf');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
// import library

var app = express();

// setting view for user
app.set('views', path.join(__dirname, 'views'));
//run file ejs config
app.set('view engine', 'ejs');
app.use(expressLayouts);
//make html look better while render
app.locals.pretty = true;



// set up express application
    // setting favicon icon
app.use(favicon(path.join(__dirname, 'public', '/img/ico/favicon.ico')));
    //  consoloe log req
app.use(morgan('dev'));
    // csrf config
var csrfProtection = csrf({ cookie: true });
    // run html form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
    // cookies acception
app.use(cookieParser());
    // static directory
app.use(express.static(path.join(__dirname, 'public')));
    // setting secret
app.use(session({ secret: 'dathuynh', saveUninitialized: true, resave: true }));
    // pass passport for configuration
require('./config/passport')(passport);
    // init passport
app.use(passport.initialize());
    // use passport to longin session
app.use(passport.session());
    // this one use to connect with flash
app.use(flash());

app.use(compression({
    level: 1,
    filter: (req, res) => {
        if (req.header['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    },
}))


//import router file from router dictory
var routes = require('./routes/routes');
var users = require('./routes/users')(app, passport);
var products = require('./routes/cart');
var checkout = require('./routes/checkout');
var admin = require('./routes/admin');
var profile = require('./routes/profile');

//link of router
app.use('/', routes);
app.use('/cart', products);
app.use('/checkout', checkout);
app.use('/admin', admin);
app.use('/usr', profile);

// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});


// catch 404 and forward to error handler then render the page 404
app.use(function (req, res, next) {
    res.status(404).render('404');
});

// error status
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
