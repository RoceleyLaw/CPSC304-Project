//required dependencies
var express = require('express');
var app = express();
var mysql = require('mysql');
var port = process.env.PORT || 3001;
var con=require('./dbconnection'); //reference of dbconnection.js
 
var Task={
 
getAllTasks:function(callback){
 
return db.query("Select * from task",callback);
 
},
 getTaskById:function(id,callback){
 
return db.query("select * from task where Id=?",[id],callback);
 },
 addTask:function(Task,callback){
 return db.query("Insert into task values(?,?,?)",[Task.Id,Task.Title,Task.Status],callback);
 },
 deleteTask:function(id,callback){
  return db.query("delete from task where Id=?",[id],callback);
 },
 updateTask:function(id,Task,callback){
  return db.query("update task set Title=?,Status=? where Id=?",[Task.Title,Task.Status,id],callback);
 }
 
};
 module.exports=Task;


//define a route, usually this would be a bunch of routes imported from another file
app.route('/').get(function (req, res, next) {
    res.send('Welcome to the Kushy API');
});

// TODO: add routes to express app
// EX: var routes = require('./api/routes/routes');
// routes(app);


//start Express server on defined port
app.listen(port);

//log to console to let us know it's working
console.log('API server started on: ' + port);

//connect to the locally hosted mysql db
//NOTES: if not able to connect to your local db 
//Possible issue 1: authentication or protocol error
//Solution 1: run this SQL command on your db instance
//   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password' 
// var con = module.exports = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password"
//   });
 
// con.connect(function(err) {
//     if (err) throw err;
//       con.query("SELECT * FROM persons.persons", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//       });
//   }); 
  
con.query("SELECT * FROM persons.persons", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});
