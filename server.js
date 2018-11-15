var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    pg = require('pg'),
    promise = require('es6-promise').Promise,
    validator = require('email-validator'),
    nodemailer = require('nodemailer');

const PORT = process.env.PORT || 1500

var app = express();

var pool = new pg.Pool()
//db connection
/*const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
}*/
const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'threestripes',
  database: 'threestripesdb',
  password: 'Get2plat',
}

//local connection (do not push)
var pool = new pg.Pool(dbConfig)

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname+'/public/views'));
app.use(express.static(__dirname+'/public/styles'));
app.use(express.static(__dirname+'/public/scripts'));
app.use(express.static(__dirname+'/public/media'));


//Mail options
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'focus.threestripes@gmail.com',
    pass: 'Ad1daspants'
  }
});

//var server_email = process.env.EMAIL
var server_email = 'focus.threestripes@gmail.com';

/*var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});*/

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

app.get('/settings', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/settings.html'));
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
    console.log(input_user)
    console.log(input_password)
    var queries = []
    var qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\' and confirm_email=\'true\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\' and confirm_email=\'false\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    promise.all(queries).then(data => {
      console.log(data)
      if (data[1] == 0) {
        console.log("Username not found")
        res.send({'check':1})
      } else if (data[1] == 1 && data[2] == 0) {
        console.log("Password incorrect")
        res.send({'check':2})
      } else if (data[3] == 1) {
        console.log("Email not confirmed")
        res.send({'check':3})
      } else {
        console.log("Successful Login")
        res.send({'check':0})
      }
    /*var qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
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
    })*/
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
    var queries = []
    var qstring = 'SELECT name FROM users WHERE username=\''+input_user+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    qstring = 'SELECT name FROM users WHERE email=\''+input_email+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rowCount))
    promise.all(queries).then(data => {
      if (data[0] == 1) {
        console.log("Username taken")
        res.send({'check':0})
      } else if (data[1] == 1) {
        console.log("Email taken")
        res.send({'check':1})
      } else if (!validator.validate(input_email)) {
        console.log("Invalid Email")
        res.send({'check':2})
      } else {
        var mailOptions = {
          from: server_email,
          to: input_email,
          subject: 'Focus: Email Confirmation',
          html: '<!DOCTYPE html> \
                <html lang="en-US"> \
                <head> \
                  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> \
                </head> \
                <body> \
                  <h2>Thank you for signing up with Focus!</h2> \
                  <p>Your account has been created.</p> \
                </body> \
                <script> \
                  function loginUser() { \
                    console.log("here i am ") \
                    $.ajax({url : "threestripes.herokuapp.com/confirm", \
                    type: "POST", \
                    data : {input_user:'+input_user+', input_password:'+input_password+', input_email:'+input_email+'}, \
                    success: function(data, textStatus, jqXHR){} \
                    error: function (jqXHR, textStatus, errorThrown){}}); \
                  } \
                </script> \
                </html>'
        }
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        dbclient.query('INSERT INTO users (name, username, email, password, confirm_email, points, curr_theme) VALUES \
          (\''+input_name+'\',\''+input_user+'\',\''+input_email+'\',\''+input_password+'\', \'true\', 200, \'default\');').then(result => {
            console.log("Successful signup")
            res.send({'check':3})
          })
          .catch(e => {
            console.log('error :(')
            console.error(e.stack)
        })
      }
    })
  })
})

/*app.post('/confirm', function(req, res) {
  pool.connect((err, dbclient, done) => {
    dbclient.query('UPDATE users SET confirm_email = \'true\' WHERE username=\''+input_user+'\'and password=\''+input_password+'\';').then(result => {
      console.log("Successful signup")
      })
      .catch(e => {
        console.log('error :(')
        console.error(e.stack)
    })
  })
})*/

app.post('/addpts', function(req, res) {
  pool.connect((err, dbclient, done) => {
    var input_pts = req.body.pts;
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    var queries = []
    qstring = 'SELECT points FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rows[0]))
    promise.all(queries).then(data => {
      var newPts = (parseInt(data[0].points) + parseInt(input_pts));
      dbclient.query('UPDATE users SET points = \''+newPts.toString()+'\' WHERE username=\''+input_user+'\'and password=\''+input_password+'\';').then(result => {
          res.send({'check':newPts})
        })
        .catch(e => {
          console.log('error :(')
          console.error(e.stack)
      }).then(() => {
         dbclient.end()
      })
    })
  })
})

app.post('/ptscheck', function(req, res) {
  pool.connect((err, dbclient, done) => {
    var input_pts = req.body.pts;
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    var input_theme = req.body.theme;
    if (input_pts == '' || input_user == '' || input_theme == '' || input_password == '') {
      return console.log('input name not passed in');
    }
    var queries = []
    var qstring = 'SELECT points FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rows[0]))
    qstring = 'SELECT owned_themes FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rows[0]))
    promise.all(queries).then(data => {
      var newPts = (parseInt(data[0].points) + parseInt(input_pts));
      var themes = data[1].owned_themes;
      var theme_string = 'false';
      for (var i = 0; i < themes.length; i++) {
        if (themes[i] === input_theme) {
          theme_string = 'true';
        }
      }
      res.send({'points':newPts, 'theme':theme_string})
    })
    .catch(e => {
      console.error(e.stack)
    })
    .then(() => dbclient.end())
  })
})

app.post('/buyTheme', function(req, res) {
  pool.connect((err, dbclient, done) => {
    var input_pts = req.body.pts;
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    var input_theme = req.body.theme;
    if (input_pts == '' || input_user == '' || input_theme == '' || input_password == '') {
      return console.log('input name not passed in');
    }
    var queries = []
    var qstring = 'SELECT points FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rows[0]))
    qstring = 'SELECT owned_themes FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    queries.push(dbclient.query(qstring).then(result => result.rows[0]))
    promise.all(queries).then(data => {
      var newPts = (parseInt(data[0].points) + parseInt(input_pts));
      var themes = data[1].owned_themes;
      themes.push(input_theme);
      console.log(themes)
      var theme_string = "{"
      for (var i = 0; i < themes.length-1; i++) {
        theme_string = theme_string + themes[i]+', ';
      }
      theme_string = theme_string + themes[themes.length-1] + "}"
      console.log(theme_string)
      dbclient.query('UPDATE users SET points=\''+newPts+'\', owned_themes=\''+theme_string+'\' WHERE username=\''+input_user+'\'and password=\''+input_password+'\';').then(result => {
        console.log("Successful theme update")
        res.send({'check':'true'})
      })
      .catch(e => {
        console.log('error :(')
        console.error(e.stack)
      })
    })
    .catch(e => {
      console.error(e.stack)
    })
    .then(() => dbclient.end())
  })
})

app.post('/currTheme', function(req, res) {
  pool.connect((err, dbclient, done) => {
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    var input_theme = req.body.input_theme;
    dbclient.query('UPDATE users SET curr_theme =\''+input_theme+'\' WHERE username=\''+input_user+'\'and password=\''+input_password+'\';').then(result => {
        res.send({'check':'true'})
      })
      .catch(e => {
        console.log('error :(')
        console.error(e.stack)
    })
  })
})

app.post('/currTheme', function(req, res) {
  pool.connect((err, dbclient, done) => {
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    var input_theme = req.body.input_theme;
    dbclient.query('UPDATE users SET curr_theme =\''+input_theme+'\' WHERE username=\''+input_user+'\'and password=\''+input_password+'\';').then(result => {
        res.send({'check':'true'})
      })
      .catch(e => {
        console.log('error :(')
        console.error(e.stack)
    })
  })
})

app.post('/ready', function(req, res) {
  pool.connect((err, dbclient, done) => {
    var input_user = req.body.input_user;
    var input_password = req.body.input_password;
    var qstring = 'SELECT name, points, curr_theme, email FROM users WHERE username=\''+input_user+'\'and password=\''+input_password+'\';'
    dbclient.query(qstring).then(result => {
        var results = result.rows[0]
        var name = results.name;
        var points = results.points;
        var curr_theme = results.curr_theme;
        var email = results.email;
        res.send({
          'name':name,
          'points':points,
          'theme':curr_theme,
          'email': email,
        })
      })
      .catch(e => {
        console.log('error :(')
        console.error(e.stack)
    })
  })
})


//addhistory
//gethistory

/*else {
        dbclient.query('UPDATE users SET confirm_email = \'true\' WHERE username=\''+input_user+'\'and password=\''+input_password+'\';').then(result => {
            console.log("Successful signup")
            res.send({'check':2})
          })
          .catch(e => {
            console.log('error :(')
            console.error(e.stack)
        })
      }*/

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


//server
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
