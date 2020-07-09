var express = require('express');
var app = express();

app.use('/signup', require('./signUp.js'))
app.use('/', require('./login.js'))
app.use('/board', require('./board.js'))
app.use('/api', require('./api.js'))

module.exports = app;