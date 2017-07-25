var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var utf8 = require('utf8');
var  server = app.listen(3141, function () {
    console.log("Express server has started on port 3141")
})
app.use(bodyParser.json());
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: require('./password').password,
    database: 'dormitory'
});

connection.connect(function (err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
    else {
        console.log('mysql connected');
    }
});

app.all('/', function (req, res) {
    console.log(req.path);
    res.send("Hello World!");

});

app.all('/login', function (req, res) {
    console.log(req.path);
    var id = req.body.id;
    var pw = req.body.password;
    res.header("Content-Type", "application/json; charset=utf-8");
    var query = connection.query('select * from teacher_data join permission_data on permission_data.permission_type = teacher_data.permission_type where teacher_data.id = ' + mysql.escape(id) + ' and teacher_data.password = ' + mysql.escape(pw), function (err, rows) {

        if (err) {
            throw err;
        }

        var json = null;
        res.json(rows[0]);

    });
});