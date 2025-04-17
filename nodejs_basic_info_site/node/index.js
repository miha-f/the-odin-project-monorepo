const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {

    let filename = "";

    switch (req.url) {
        case "/": filename = "index.html"; break;
        case "/about": filename = "about.html"; break;
        case "/contact-me": filename = "contact-me.html"; break;
        default: filename = "404.html"; break;
    }

    fs.readFile(filename, function(err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });

}).listen(8080);
