var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

app.use('/', express.static('web'));

server.listen(8080);
