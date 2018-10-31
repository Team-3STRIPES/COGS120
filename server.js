var http = require('http'),
    express = require('express'),
    path = require('path');

const PORT = process.env.PORT || 5000

var app = express();

app.use(express.static(__dirname + '/public/'));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/index.html'));
})

app.get('/index.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/index.html'));
})

app.get('/login.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/login.html'));
})

app.get('/signup.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/signup.html'));
})

app.get('/timer.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/timer.html'));
})

app.get('/home.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/home.html'));
})

app.get('/shop.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/shop.html'));
})

app.get('/profile.html', function(req, res){
  res.sendFile(path.join(__dirname+"/public/", 'views/profile.html'));
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))