var connect = require('connect');
var rest = require('connect-rest');
var bodyParser = require('body-parser');
var requestCl = require("request");
var serveStatic = require('serve-static');
var git  = require('gift');
var send  = require('send');
var yaml = require('yamljs');

var fs = require('fs');
var url = require('url');
var sys = require('sys');
var exec = require('child_process').exec;
var repoFolder = "/tmp/repos/";
//var execSync = require('exec-sync');

var port = Number(process.env.PORT || 9000);
var server = connect()
    .use( bodyParser.urlencoded( { extended: true } ) )
    .use( bodyParser.json() );

var options = {
    context: '/api',
    logger:{ file: 'mochaTest.log', level: 'warn' },
    discoverPath: 'discover',
    protoPath: 'proto'
};

server.use( rest.rester( options ) );

function puts(error, stdout, stderr) { sys.puts(stdout) }

rest.get('/content/pdf/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	var data = fs.createReadStream('test/data/book.pdf');
	callback(null, data, { errorCode: 404, headers: { 'Content-Disposition': 'attachment; filename="book.pdf'  } });
}, { contentType:'application/pdf' } );

rest.get('/content/epub/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo;
	var data = fs.createReadStream('/ebooks/book.epub');
	callback(null, data, { errorCode: 404, headers: { 'Content-Disposition': 'attachment; filename="book.epub'  } });
}, { contentType:'application/epub'} );

rest.get('/content/mobi/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo;
	var data = fs.createReadStream('/ebooks/book.mobi');
	callback(null, data, { errorCode: 404, headers: { 'Content-Disposition': 'attachment; filename="book.mobi"'  } });
}, { contentType:'application/mobi' } );

rest.get('/content/html/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	var data = fs.createReadStream('/ebooks/book.html');
	callback(null, data, {errorCode: 404});
}, { contentType:'text/html' } );

server.use(function static(req, res, next) {
	//todo url validation match start url dont't care what follows after some slashes
	if (req.url.match(/^\/api\/.+\/html\/(.+)\/(.+)\/(.+)\/(.+)/)) {
		var parts = url.parse(req.url, true).pathname.split('/');
		var file = repoFolder + parts[4] + "/" + parts[5] + '/html/' + parts.splice(6, parts.length).join('/')
		console.log(file);
		var stream = send(req, file, {});
		stream.pipe(res);
	} else {
		next();
	}
});
server.listen(port);
