var express = require('express');
var bodyParser = require('body-parser');
var path    = require('path');
var sassMiddleware = require('node-sass-middleware');
var app = module.exports = express();
var fs = require('fs');


app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())


app.use(sassMiddleware({
     src: __dirname + '/sass', 
     dest: __dirname + '/public/stylesheets',
     prefix:  '/stylesheets',
     debug: true,         
 })
);   

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  fs.readFile("index.html",function(err,contents){
    console.log("ASjzdcj");
    if(!err){
        res.end(contents);
    } else {
        console.dir(err);
    };
});
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
});
