'use strict';
//export by default
var task=require('../controllers/taskController');
module.exports = function (app) {
    //get all persons at route baseURL/allpersons 
    app.route('/allpersons')
        .get(function (req, res, next) {
            task.getAllPersons(function(err, result){
                if (err){
                    res.json(err);
                } else {
                    res.json(result);
                }
            });
        });
    
    // TODO: add routes
    app.route('/').get(function (req, res, next) {
        res.send('Welcome to the our API');
    });
}