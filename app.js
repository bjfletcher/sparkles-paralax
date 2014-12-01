var express = require('express');
var app = express();
 
var hbs = require('hbs');
 
 
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static('public'));
app.use(express.static('bower_components'));
 
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/dec_3rd', function(req, res) {
    res.render('dec_3rd');
});


app.listen(3000);