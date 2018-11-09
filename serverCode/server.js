//required dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var routes = require('./api/routes/routes');

// Access control
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("header sent!");
    next();
});

//start Express server on defined port
app.listen(port);

//log to console to let us know it's working
console.log('API server started on: ' + port);

//call function defined in routes.js module
routes(app);

