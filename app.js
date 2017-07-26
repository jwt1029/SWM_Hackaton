var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var utf8 = require('utf8');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: require('./password').password,
    database: 'hackathon'
});

var  server = app.listen(3141, function () {
    console.log("Express server has started on port 3141");
    require('./modules/account.js').init(app, connection);
    require('./modules/recruit').init(app, connection);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
