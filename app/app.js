
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes'),
  http = require('http');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

//https://instagram.com/oauth/authorize/?client_id=3e380aed579d4751a85b6157a298da6e&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fphotos&response_type=token
// <script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'></script>

app.get('/photos', function(req, res, next) {
	console.dir(req.url);
	var accessToken = req.url.match( /(.*)(=)(.*)/ )[3];
	res.send('access token: '+accessToken);
});

app.get('/google', function(req, res, next) {
	curl({host:'www.google.com', method:'GET'}, function(data) {
		console.log("****************");
		res.send(data);
	});
});

function curl(options, callback) {
	var req = http.request(options),
		accum = [];
	req.on('response', function(googleres) {
		googleres.on('data', function(chunk) {
		console.log(chunk.toString());
			accum.push(chunk.toString());
		});
		googleres.on('end', function() {
			callback(accum.join(''));
		});
	});
	req.end();
}

// app.get('/google', function(req, res, next) {
// 			console.dir('enter');
// 	var greq = http.request({host:'google.com',method:'GET'}),
// 		accum = [];
// 	greq.on('response', function(gres) {
// 		gres.on('data', function(data) {
// 			console.dir(data.toString());
// 			// res.write(data.toString());
// 			accum.push(data.toString());
// 		});
// 		gres.on('end', function() {
// 			console.dir('close');
// 			// res.close();
// 			res.send(accum.join(''));
// 		});
// 	});
// 			console.dir('exit');
// });

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
