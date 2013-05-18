var restify = require('restify');

Service = function() {
	this.port = 8832;
	this.seq = null;
	this.song = null;
}

Service.prototype.addSongRoutes = function(server) {
	var _this = this;

	server.get('/song', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/load', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/save', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/song/clear', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	// song bpm

	server.get('/song/bpm', function(req, res, next) {
	  res.send({value:_this.song.bpm});
	});

	server.post('/song/bpm', function(req, res, next) {
	  if (req.params.bpm)
		  _this.song.bpm = req.params.bpm;
	  if (req.params.value)
		  _this.song.bpm = req.params.value;
	  res.setHeader('content-type', 'text/plain');
	  res.send('ok');
	});

	server.get('/song/shuffle', function(req, res, next) {
	  res.send({value:_this.song.shuffle});
	});

	server.post('/song/shuffle', function(req, res, next) {
	  if (req.params.shuffle)
		  _this.song.shuffle = req.params.shuffle;
	  if (req.params.value)
		  _this.song.shuffle = req.params.value;
	  res.setHeader('content-type', 'text/plain');
	  res.send('ok');
	});

}

Service.prototype.addPlayerRoutes = function(server) {
	var _this = this;

	server.get('/player', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  var bpm = _this.player.getBPM()
	  res.send({ bpm: bpm, success: true });
	});

	server.post('/player', function(req, res, next) {
	  res.send('{\"success\":true}');
	});

	server.get('/player/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.get('/player/track/:track/cue', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{\"success\":true}');
	});

	server.post('/player/track/:track/cue', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.post('/player/track/:track/note', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.post('/player/track/:track/event', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});
}

Service.prototype.addSongTrackPatternRoutes = function(server) {
	var _this = this;

	// edit patterns

	server.get('/song/track/:track/pattern/:pattern', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{}');
	});

	server.post('/song/track/:track/pattern/:pattern', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.post('/song/track/:track/pattern/:pattern/clear', function(req, res, next) {
	  res.send('ok');
	});

	// steps

	server.get('/song/track/:track/pattern/:pattern/step/:step', function(req, res, next) {
	  res.send('{}');
	});

	server.post('/song/track/:track/pattern/:pattern/step/:step', function(req, res, next) {
	  res.send('ok');
	});

	// pattern properties

	server.get('/song/track/:track/pattern/:pattern/start', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('0');
	});

	server.post('/song/track/:track/pattern/:pattern/start', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.get('/song/track/:track/pattern/:pattern/end', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('15');
	});

	server.post('/song/track/:track/pattern/:pattern/end', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.get('/song/track/:track/pattern/:pattern/enabled', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('true');
	});

	server.post('/song/track/:track/pattern/:pattern/enabled', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});
}

Service.prototype.addSongTrackRoutes = function(server) {
	var _this = this;

	// edit tracks

	server.get('/song/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{}');
	});

	server.post('/song/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.post('/song/track/:track/clear', function(req, res, next) {
	  res.send('ok');
	});

	// edit track properties

	server.get('/song/track/:track/channel', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{}');
	});

	server.post('/song/track/:track/channel', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.get('/song/track/:track/enable', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('false');
	});

	server.post('/song/track/:track/enable', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.get('/song/track/:track/advance', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('true');
	});

	server.post('/song/track/:track/advance', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.get('/song/track/:track/gate', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('4');
	});

	server.post('/song/track/:track/gate', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	// edit tracks

	server.get('/song/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('{}');
	});

	server.post('/song/track/:track', function(req, res, next) {
	  // res.send('hello ' + req.params.name);
	  res.send('ok');
	});

	server.post('/song/track/:track/clear', function(req, res, next) {
	  res.send('ok');
	});

}

Service.prototype.addMiscRoutes = function(server) {
	var _this = this;

	server.get('/', function(req, res, next) {
		res.setHeader('content-type', 'text/plain');
		res.send('midilooper server; see http://github.com/possan/midilooper');
	});
}

Service.prototype.start = function() {
	var server = restify.createServer();
	server.use(restify.queryParser());
	server.use(restify.bodyParser());
	server.use(restify.CORS());
	this.addMiscRoutes(server);
	this.addPlayerRoutes(server);
	this.addSongRoutes(server);
	this.addSongTrackRoutes(server);
	this.addSongTrackPatternRoutes(server);
	server.listen(this.port, function() {
	  console.log('%s listening at %s', server.name, server.url);
	});
}

exports.Service = Service;
