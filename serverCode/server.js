//required dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var routes = require('./api/routes/routes');

//start Express server on defined port
app.listen(port);

//log to console to let us know it's working
console.log('API server started on: ' + port);

//call function defined in routes.js module
routes(app);
