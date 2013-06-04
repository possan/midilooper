//
//
// 

var SeqTrack = function(opts) {
	var _song = opts.song || null;
	var _midiout = opts.sendMidi || null;
	return {
		currentPattern : 0,
		currentStep : 0,
		cuedPattern : -1,
		cuedNote: null,
		step : function() {
		}
	};
};



var Envelope = function() {
	this.channel = 0;
	this.control = 0;
	this.attacktime = 0.1;
	this.sustaintime = 0.1;
	this.releasetime = 1.0;
	this.state = 0;

	this.startValue = 0;
	this.targetValue = 0;

	this.stepTimer = 0;
	this.stepTime = 0;

	this.value = 0;
	this.lastvalue = 0;
	this.minvalue = 0;
	this.maxvalue = 127;
	this.starttime = (new Date()).getTime()
}

Envelope.prototype.setup = function(def) {
	console.log('setup envelope', def);
	if (def.channel) this.channel = def.channel;
	if (def.control) this.control = def.control;
	if (def.attack) this.attacktime = def.attack;
	if (def.release) this.releasetime = def.release;
	if (def.sustain) this.sustaintime = def.sustain;
	if (def.minvalue) this.minvalue = def.minvalue;
	if (def.maxvalue) this.maxvalue = def.maxvalue;
}

Envelope.prototype.start = function() {
	if (this.state == 0) {
		// idle
		this.state = 1;
		this.stepTime = this.attacktime;
		this.stepTimer = 0;
		this.startValue = this.minvalue;
		this.targetValue = this.maxvalue;
	} else if (this.state == 1) {
		// attacking, do nothing.
		this.startValue = this.maxvalue;
		this.targetValue = this.maxvalue;
	} else if (this.state == 2) {
		// sustaining, keep sustaining...
		this.stepTime = this.sustaintime;
		this.stepTimer = 0;
		this.startValue = this.maxvalue;
		this.targetValue = this.maxvalue;
	} else if (this.state == 3) {
		// releasing, go back to attack again.
		this.state = 1;
		this.stepTime = this.attacktime;
		this.stepTimer = 0;
		this.startValue = this.value;
		this.targetValue = this.maxvalue;
	}
}

Envelope.prototype.step = function(dt) {
	this.stepTimer += dt;
	if (this.state != 0 && this.stepTimer >= this.stepTime) {
		// console.log('steptimer done.', this.stepTimer, this.stepTime);
		if (this.state == 1) {
			// attack done, go to sustain
			this.state = 2;
			this.stepTime = this.sustaintime;
			this.stepTimer = 0;
			this.startValue = this.maxvalue;
			this.targetValue = this.maxvalue;
		} else if (this.state == 2) {
			// sustain done, go to release
			this.state = 3;
			this.stepTime = this.releasetime;
			this.stepTimer = 0;
			this.startValue = this.maxvalue;
			this.targetValue = this.minvalue;
		} else if (this.state == 3) {
			// release done. go to idle.
			this.state = 0;
			this.startValue = this.minvalue;
			this.targetValue = this.minvalue;
		}
	}
	if (this.state == 0) {
		// idle
		this.value = this.startValue;
	} else if (this.state == 1) {
		// attacking, interpolate up
		var nt = Math.max(0, Math.min(1, this.stepTimer / this.stepTime));
		var invt = 1 - nt;
		this.value = Math.round(this.startValue * invt + this.targetValue * nt);
	} else if (this.state == 2) {
		// sustaining, keep value 
		this.value = this.targetValue;
	} else if (this.state == 3) {
		// releasing, interpolate down
		var nt = Math.max(0, Math.min(1, this.stepTimer / this.stepTime));
		var invt = 1 - nt;
		this.value = Math.round(this.startValue * invt + this.targetValue * nt);
	}
	this.running = (this.state != 0);
}



exports.Sequencer = function(opts) {

	var _ppqn = opts.ppqn || 96;
	var _song = opts.song || null;
	var _midiout = opts.sendMidi || null;
	var _step = -1;
	var _tracks = [];

	for ( var j = 0; j < 16; j++)
		_tracks.push(new SeqTrack({
			sendMidi : _midiout
		}));

	for ( var j = 0; j < 16; j++) {
		// var firstpat = _song.getTrack(j).getNextEnabledPattern(-1);
		_tracks[j].currentPattern = -1;
		_tracks[j].currentStep = -1;
	}

	_midiout([ 0xFA ]);

	_sendCC = function(chan, control, val) {
		console.log('sending CC ' + control + ' = '+val+' on channel '+chan);
		_midiout([ 0xB0 + chan, control, val ]);
	};

	var _runningnotes = [];
	var _runningenvelopes = [];

	return {

		player : null,

		getSong : function() {
			return _song;
		},

		removeOldNotes : function() {
			for ( var j = _runningnotes.length - 1; j >= 0; j--) {
				if (_runningnotes[j].timer > 0)
					_runningnotes[j].timer--;
				if (_runningnotes[j].timer <= 0) {
					// console.log('stopping note '+_runningnotes[j].note+' on
					// channel '+_runningnotes[j].chan);
					_midiout([ 0x80 + _runningnotes[j].chan,
							_runningnotes[j].note, 0 ]);
					_runningnotes.splice(j, 1);
				}
			}
		},
		
		queueNote : function(chan, note, vel, stepsdur) {
			console.log('starting note '+note+' (velocity: ' + vel +', gate time: ' + stepsdur+') on channel '+chan);
			_midiout([ 0x90 + chan, note, vel ]);
			_runningnotes.push({
				chan : chan,
				note : note,
				timer : Math.ceil(stepsdur * _ppqn)
			});
		},

		getPlayingGlobalStep : function() {
			return _step / _ppqn;
		},

		getCuedPattern : function(track) {
			if (track < 0 || track > 15)
				return -1;
			var trk = _tracks[track];
			return trk.cuedPattern;
		},

		cuePattern : function(track, pattern) {
			if (track < 0 || track > 15)
				return -1;
			var trk = _tracks[track];
			trk.cuedPattern = pattern;
		},

		cueNote: function(track, note, velocity, validsteps) {
			if (track < 0 || track > 15)
				return;
			console.log('cue note ' + note + ' on track ' + track);
			var trk = _tracks[track];
			var cn = {
				note: note,
				velocity: velocity,
				steps: []
			};
			for(var i=0; i<validsteps.length; i++)
				cn.steps.push(parseInt(validsteps[i], 10));
			console.log('cn', cn);
			trk.cuedNote = cn;
		},

		getPlayingPatternStep : function(track) {
			if (track < 0 || track > 15)
				return -1;
			var trk = _tracks[track];
			return trk.currentStep - 1;
		},

		getPlayingPattern : function(track) {
			if (track < 0 || track > 15)
				return -1;
			var trk = _tracks[track];
			return trk.currentPattern;
		},

		queueEvents : function(trackindex, patindex, patstep) {
			// console.log('queueEvents', trackindex, patindex, patstep);

			var strk = _song.getTrack(trackindex);
			if (strk == null)
				return;
			if (strk.gate < 1)
				return;
			var spat = strk.getPattern(patindex);
			if (spat == null)
				return;
			var strk2 = _tracks[trackindex];

			if (strk2.cuedNote) {
				if (strk2.cuedNote.steps.indexOf(patstep % 16) != -1) {
					console.log('consumed cued note', strk2.cuedNote);
					this.queueNote(strk.channel, strk2.cuedNote.note, strk2.cuedNote.velocity, 64);
					strk2.cuedNote = null;
				}
			} 

			var sstp = spat.getStep(patstep);
			if (sstp == null)
				return;
			var snot = sstp.getNotes();
			var scc = sstp.getCC();
			if (snot) {
				for ( var k = 0; k < snot.length; k++) {
					if (snot[k].v > 0) {
						this.queueNote(strk.channel, snot[k].n, snot[k].v, strk.gate / 16);
					}
				}
			}
			if (scc) {
				for ( var k = 0; k < scc.length; k++) {
					_sendCC(strk.channel, scc[k].c, scc[k].v);
				}
			}
		},

		_innerStep : function(firstbeat, resync) {
			// console.log('_innerStep', firstbeat, resync);
			for ( var j = 0; j < 16; j++) {
				var trk = _tracks[j];
				var strk = _song.getTrack(j);

				var nextpat = false;
				if (trk.currentPattern != -1) {
					var p = strk.getPattern(trk.currentPattern);
					if (resync)
						trk.currentStep = p.start;
					if (trk.currentStep > p.end)
						nextpat = true;
				} else {
					// ingen nuvarande pattern, ska vi starta en?
					// starta patterns görs endast på första 4/4-takten
					if (firstbeat)
						nextpat = true;
				}

				if (nextpat) {
					if (trk.cuedPattern != -1) {
						trk.currentPattern = trk.cuedPattern;
						trk.cuedPattern = -1;
					} else {
						trk.currentPattern = strk
								.getNextEnabledPattern(trk.currentPattern);
					}
					// console.log('changed to next
					// pattern',trk.currentPattern,'on track',j);
					if (trk.currentPattern != -1) {
						p = strk.getPattern(trk.currentPattern);
						trk.currentStep = p.start;
					}
				}

				// console.log('trk '+trk.currentPattern+'.'+trk.currentStep+' '+strk.enabled);
				if (trk.currentPattern >= 0 && trk.currentStep >= 0
						&& strk.enabled)
					this.queueEvents(j, trk.currentPattern, trk.currentStep);
				trk.currentStep++;
			}
		},

		triggerEnvelope: function(opts) {
			console.log('trigger envelope', opts);
			var found = -1;
			for(var i=0; i<_runningenvelopes.length; i++) {
				var re = _runningenvelopes[i];
				if (re.channel == opts.channel && re.control == opts.control) {
					found = i;
				}
			}
			if (found != -1) {
				var re = _runningenvelopes[found];
				re.setup(opts);
				if (opts.trigger) {
					re.start();
				}
			} else {
				var re = new Envelope();
				re.setup(opts);
				if (opts.trigger) {
					re.start();
				}
				_runningenvelopes.push(re);
			}
		},

		getRunningEnvelopes: function() {
			var data = [];
			for(var i=0; i<_runningenvelopes.length; i++) {
				var re = _runningenvelopes[i];
				if (re.running) {
					data.push({
						channel: re.channel,
						control: re.control,
						state: re.state,
						value: re.value
					})
				}
			}			
			return data;
		},

		step : function(arg) {

			if( arg.ppqn )
				_ppqn = arg.ppqn;
			
			if (arg.player) {
				var oldbpm = arg.player.getBPM();
				if (_song.bpm != oldbpm) {
					arg.player.setBPM(_song.bpm);
					// send bpm change. 
				}
			}

			for(var i=0; i<_runningenvelopes.length; i++) {
				var re = _runningenvelopes[i];
				re.step(arg.deltaTime);
				if (re.value != re.lastvalue) {
					_sendCC(re.channel, re.control, re.value);
					re.lastvalue = re.value;
				}
			}
			
			this.removeOldNotes();
			var shufflestep = Math.floor( _ppqn * _song.shuffle / 100.0 );
			if( shufflestep < 0 ) 
				shufflestep = 0;
			if( shufflestep > _ppqn-2 ) 
				shufflestep = _ppqn-2; 
			var ppqnstep = _step % _ppqn;

			var stp = Math.floor(arg.step / arg.ppqn);
			shufflestep = Math.floor( shufflestep * (stp % 2) );
		
			// console.log( stp, _ppqn, ppqnstep );

			if (_step % 8 == 0) {
				// console.log('beatmessage');
				_midiout([ 0xF8 ]);
			}

			if (ppqnstep == shufflestep) {
				// console.log('step at ppqn '+ppqnstep+'/'+_ppqn);
				// time to step everything forward
				var rsp = stp % 16;
				var rsp2 = stp % 128;
				// se till att pattern är rätt
				this._innerStep(rsp == 0, rsp2 == 0);
			}

			_step++;
		}
	};
};
