var restify = require('restify');

Service = function() {
	this.port = 8832;
	this.seq = null;
	this.song = null;
}

Service.prototype.addSongRoutes = function(server) {
	var _this = this;

	server.get('/song', function(req, res, next) {
		var data = _this.song.toJson();
		res.send(data);
	});

	server.post('/song', function(req, res, next) {
		_this.song.parseJson(req.params);
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.del('/song', function(req, res, next) {
		console.log('TODO: clear song');
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/song/load', function(req, res, next) {
		console.log('TODO: support loading songs');
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/song/save', function(req, res, next) {
		console.log('TODO: support saving songs');
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});
}

Service.prototype.addPlayerRoutes = function(server) {
	var _this = this;

	server.get('/player', function(req, res, next) {
		var tracks = [];
		for(var t=0; t<16; t++) {
			var ptrk = {
				track: t,
				cued: _this.seq.getCuedPattern(t),
				pattern: _this.seq.getPlayingPattern(t),
				step: _this.seq.getPlayingPatternStep(t)
			}
			tracks.push(ptrk);
		}
		res.send({
			globaltick: _this.seq.getPlayingGlobalStep(),
			tracks: tracks
		});
	});

	server.get('/player/track/:track', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		res.send({
			track: track,
			cued: _this.seq.getCuedPattern(track),
			pattern: _this.seq.getPlayingPattern(track),
			step: _this.seq.getPlayingPatternStep(track)
		});
	});

	server.get('/player/track/:track/cue', function(req, res, next) {
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/player/track/:track/cue', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		// var strk = _this.song.getTrack(track);
		if (req.params.value) {
			var pat = parseInt(req.params.value, 10);
			_this.seq.cuePattern(track, pat);
		}
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/player/track/:track/note', function(req, res, next) {
		console.log('TODO: Support previewing note events');
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/player/track/:track/event', function(req, res, next) {
		console.log('TODO: Support previewing raw midi events');
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});
}

Service.prototype.addSongTrackPatternRoutes = function(server) {
	var _this = this;

	// edit patterns

	server.get('/song/track/:track/pattern/:pattern', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var strk = _this.song.getTrack(track);
		var pat = parseInt(req.params.pattern, 10);
		var spat = strk.getPattern(pat);
		var data = spat.toJson();
		data.track = track;
		data.pattern = pat;
		res.send(data);
	});

	server.post('/song/track/:track/pattern/:pattern', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var strk = _this.song.getTrack(track);
		var pat = parseInt(req.params.pattern, 10);
		var spat = strk.getPattern(pat);
		spat.parseJson(req.params);
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.del('/song/track/:track/pattern/:pattern', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var strk = _this.song.getTrack(track);
		var pat = parseInt(req.params.pattern, 10);
		var spat = strk.getPattern(pat);
		spat.reset();
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	// cue tracks

	server.post('/song/track/:track/pattern/:pattern/cue', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var pat = parseInt(req.params.pattern, 10);
		_this.seq.cuePattern(track, pat);
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	// steps

	server.get('/song/track/:track/pattern/:pattern/step/:step', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var pat = parseInt(req.params.pattern, 10);
		var step = parseInt(req.params.step, 10);
		var strk = _this.song.getTrack(track);
		var spat = strk.getPattern(pat);
		var sstep = spat.getStep(step);
		var data = sstep.toJson();
		data.pattern = pat;
		data.track = track;
		data.step = step;
		res.send(data);
	});

	server.del('/song/track/:track/pattern/:pattern/step/:step', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var pat = parseInt(req.params.pattern, 10);
		var step = parseInt(req.params.step, 10);
		var strk = _this.song.getTrack(track);
		var spat = strk.getPattern(pat);
		var sstep = spat.getStep(step);
		sstep.clearStep();
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/song/track/:track/pattern/:pattern/step/:step', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var pat = parseInt(req.params.pattern, 10);
		var step = parseInt(req.params.step, 10);
		var strk = _this.song.getTrack(track);
		var spat = strk.getPattern(pat);
		var sstep = spat.getStep(step);
		if (req.params.note) {
			sstep.addNote(parseInt(req.params.note, 10), parseInt(req.params.velocity || '127', 10));
		}
		if (req.params.control && req.params.value) {
			sstep.addController(parseInt(req.params.control, 10), parseInt(req.params.value, 10));
		}
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});
}

Service.prototype.addSongTrackRoutes = function(server) {
	var _this = this;

	// edit tracks

	server.get('/song/track/:track', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		var strk = _this.song.getTrack(track);
		var data = strk.toJson();
		data.track = track;
		res.send(data);
	});

	server.post('/song/track/:track', function(req, res, next) {
		console.log('Update track properties', req.params);
		var track = parseInt(req.params.track, 10);
		var strk = _this.song.getTrack(track);
		strk.parseJson(req.params);
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.del('/song/track/:track', function(req, res, next) {
		console.log('TODO: Support deleting on a track.');
		var track = parseInt(req.params.track, 10);
		var strk = _this.song.getTrack(track);
		// strk.parseJson(req.params);
		res.setHeader('content-type', 'text/plain');
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
