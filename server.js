var http = require('http');
var fs = require('fs');

var PORT = 8000;

server = http.createServer(function(req, res) {
    if (req.url == '/') {
        homepage = fs.readFileSync("index.html");
        res.end(homepage);
    }
    if (req.url == '/client.js') {
        js = fs.readFileSync('client.js');
        res.end(js);
    }
    if (req.url == '/nodes.js') {
        js = fs.readFileSync('nodes.js');
        res.end(js);
    }
}).listen(PORT);

console.log("server is listening on 8000");