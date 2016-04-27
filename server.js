var http = require('http');
var fs = require('fs');
express = require('express');

app = new express();

var PORT = 8000;

app.use(express.static('public'));

app.get('/', function(req, res) {
    homepage = fs.readFileSync("index.html");
    res.end(homepage);
});

app.listen(PORT);

console.log("server is listening on 8000");