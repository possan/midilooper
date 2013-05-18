var restify = require('restify');

Service = function() {
	this.port = 8832;
	this.seq = null;
	this.song = null;
}

Service.prototype.addSongRoutes = function(server) {
	var _this = this;

	server.post('/song/load', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/save', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/clear', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

}

Service.prototype.addPlayerRoutes = function(server) {
	var _this = this;

	server.get('/player/bpm', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/bpm', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player/shuffle', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/shuffle', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player/track/:track', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player/track/:track/cue', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/track/:track/cue', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/track/:track/note', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player/track/:track/mute', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/track/:track/mute', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player/track/:track/solo', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/track/:track/solo', function(req, res, next) {
	  res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});
}

Service.prototype.addSongTrackRoutes = function(server) {
	var _this = this;

	// edit patterns

	server.get('/song/track/:track/pattern/:pattern', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/track/:track/pattern/:pattern', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/track/:track/pattern/:pattern/clear', function(req, res, next) {
	  res.send('{\"success\":true}');
	});

	// edit tracks

	server.get('/song/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/track/:track/clear', function(req, res, next) {
	  res.send('{\"success\":true}');
	});

	// edit track midi channel

	server.get('/song/track/:track/channel', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/track/:track/channel', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});
}

Service.prototype.addMiscRoutes = function(server) {
	var _this = this;

	server.get('/', function(req, res, next) {
	  res.send('midilooper server; see http://github.com/possan/midilooper');
	});
}

Service.prototype.start = function() {
	var server = restify.createServer();
	this.addMiscRoutes(server);
	this.addPlayerRoutes(server);
	this.addSongRoutes(server);
	this.addSongTrackRoutes(server);
	server.listen(this.port, function() {
	  console.log('%s listening at %s', server.name, server.url);
	});
}

exports.Service = Service;