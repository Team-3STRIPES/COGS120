var http = require('http'),
    express = require('express'),
    path = require('path');

const PORT = process.env.PORT || 1500

var app = express();

app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+"/public/views", 'index.html'));
})
.listen(PORT, () => console.log(`Listening on ${ PORT }`))

