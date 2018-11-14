var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    pg = require('pg'),
    promise = require('es6-promise').Promise;

const PORT = process.env.PORT || 1500

var app = express();

var pool = new pg.Pool()
//db connection 
/*const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
}*/


//local connection (do not push)
var pool = new pg.Pool(dbConfig)

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname+'/public/views'));
app.use(express.static(__dirname+'/public/styles'));
app.use(express.static(__dirname+'/public/scripts'));
app.use(express.static(__dirname+'/public/media'));


//GET REQUESTS
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/index.html'));
})

app.get('/index', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/index.html'));
})

app.get('/login', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/login.html'));
})

app.get('/signup', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/signup.html'));
})

app.get('/timer', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/timer.html'));
})

app.get('/home', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/home.html'));
})

app.get('/shop', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/shop.html'));
})

app.get('/profile', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/profile.html'));
})


//POST REQUESTS
app.post('/history', function(req, res) {
  pool.connect((err, dbclient, done) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var user = req.body.user;
    if (user == '') {
      return console.log('user name not passed in');
    }
    var qstring = 'SELECT username, purchase_hist, study_hist FROM users WHERE username=\''+user+'\';';
    dbclient.query(qstring)
      .then(result => res.send({'history':result.rows}))
      .catch(e => console.error(e.stack))
      .then(() => {
        dbclient.end()
    })
  })
})

app.post('/olduser', function(req, res) {
  pool.connect((err, dbclient, done) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    if (input_user == '' || input_password == '') {
      return console.log('input name not passed in');
    }
    var qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    dbclient.query(qstring)
      .then(result => {
          if (result.rowCount == 0) {
            dbclient.query('SELECT name FROM users WHERE username=\''+input_user+'\';').then(result => {
              if (result.rowCount == 0) {
                console.log("Unsuccessful login")
                res.send({'check':0})
              } else {
                console.log("Wrong password")
                res.send({'check':1})
              }
            })
            .catch(e => console.error(e.stack))
            //console.log("Unsuccessful login")
            //res.send({'check':false})
          } else {
            console.log("Successful login")
            res.send({'check':2})
          }
      })
      .catch(e => console.error(e.stack))
      .then(() => {
        dbclient.end()
    })
  })
})


app.post('/newuser', function(req, res) {
  pool.connect((err, dbclient, done) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var input_name = req.body.input_name;
    var input_user = req.body.input_user;
    var input_email = req.body.input_email;
    var input_password = req.body.input_password;
    if (input_name == '' || input_user == '' || input_email == '' || input_password == '') {
      return console.log('input name not passed in');
    }

    var qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\';'
    var queries = []
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    qstring = 'SELECT name FROM users WHERE email=\''+input_email+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    promise.all(queries).then(data => {
      var sum = 0
      for (var i = 0; i < data.length; i++) {
        sum+=data[i];
      }
      if (sum == 0) {
        dbclient.query('INSERT INTO users (name, username, email, password) VALUES \
          (\''+input_name+'\',\''+input_user+'\',\''+input_email+'\',\''+input_password+'\');').then(result => {
            console.log("Successful signup")
            res.send({'check':2})
          })
          .catch(e => {
            console.log('error :(')
            console.error(e.stack)
          })
      } else if (data[0] == 1) {
        console.log("Username taken")
        res.send({'check':0})
      } else {
        console.log("Email taken")
        res.send({'check':1})
      }
    })


   /* var qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\';'
    dbclient.query(qstring)
      .then(result => {
        if (result.rowCount == 0) {
          dbclient.query('SELECT name FROM users WHERE email=\''+input_email+'\';').then(result=> {
            if (result.rowCount==0) {
              console.log('here!')
              dbclient.query('INSERT INTO users (name, username, email, password) VALUES \
              (\''+input_name+'\',\''+input_user+'\',\''+input_email+'\',\''+input_password+'\');').then(result => {
                console.log("Successful signup")
                res.send({'check':2})
              })
              .catch(e => {
                console.log('error :(')
                console.error(e.stack)
              })
            } else {
              console.log("Email taken")
              res.send({'check':1})
            }
          })
        } else {
          console.log("Username taken")
          res.send({'check':0})
        }
      })
      .catch(e => {
        console.error(e.stack)
      })
      .then(() => {
        dbclient.end()
    }) */
  })
})


//server
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))