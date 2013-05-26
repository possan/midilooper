var restify = require('restify');

Service = function() {
	this.port = 8832;
	this.seq = null;
	this.song = null;
	this.liveset = null;
}

Service.prototype.addSongRoutes = function(server) {
	var _this = this;

	server.get('/song', function(req, res, next) {
		var data = _this.song.toJson();
		data.filename = _this.liveset.filename;
		res.send(data);
	});

	server.post('/song', function(req, res, next) {
		_this.song.parseJson(req.params);
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.del('/song', function(req, res, next) {
		_this.liveset.reset();
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/song/load', function(req, res, next) {
		if (req.params.filename) {
			_this.liveset.filename = req.params.filename;
		}
		_this.liveset.load();
		res.setHeader('content-type', 'text/plain');
		res.send('ok');
	});

	server.post('/song/save', function(req, res, next) {
		if (req.params.filename) {
			_this.liveset.filename = req.params.filename;
		}
		_this.liveset.save();
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

	server.post('/player/track/:track/cue', function(req, res, next) {
		var track = parseInt(req.params.track, 10);
		if (req.params.value) {
			var pat = parseInt(req.params.value, 10);
			if (pat) {
				_this.seq.cuePattern(track, pat);
			}
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
			sstep.addControl(parseInt(req.params.control, 10), parseInt(req.params.value, 10));
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

Service.prototype.addEnvelopeRoutes = function(server) {
	var _this = this;

	// edit tracks

	server.get('/envelopes', function(req, res, next) {
		var data = _this.seq.getRunningEnvelopes();
		res.send(data);
	});

	server.post('/envelopes', function(req, res, next) {
		console.log('Update track properties', req.params);

		var fireargs = {
			channel: 0,
			control: 0
		};

		if (req.params.channel)
			fireargs.channel = parseInt(req.params.channel, 10);

		if (req.params.control)
			fireargs.control = parseInt(req.params.control, 10);

		if (req.params.attack)
			fireargs.attack = parseFloat(req.params.attack);

		if (req.params.sustain)
			fireargs.sustain = parseFloat(req.params.sustain);
		
		if (req.params.release)
			fireargs.release = parseFloat(req.params.release);
		
		if (req.params.minvalue)
			fireargs.minvalue = parseInt(req.params.minvalue, 10);
		
		if (req.params.maxvalue)
			fireargs.maxvalue = parseInt(req.params.maxvalue, 10);

		_this.seq.triggerEnvelope(fireargs);

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
	this.addEnvelopeRoutes(server);
	server.listen(this.port, function() {
		console.log('%s listening at %s', server.name, server.url);
	});
}

exports.Service = Service;
