//
//
// 


exports.Step = function(){
	
	var _notes = [];
	var _cc = [];
	
	return {
		
		getNotes: function() {
			return _notes;
		},
		
		getCC: function() {
			return _cc;
		},
		
		clearStep: function() {
			_notes = [];
			_cc = [];
		},
		
		clearNote: function(n) {
			this.setNote(n,0);
		},
		
		getNote: function(n) {
			for(var j=0; j<_notes.length; j++)
				if( _notes[j].n == n )
					return _notes[j];
			return null;
		},
		
		isEmpty: function() {
			return _notes.length == 0 && _cc.length == 0;
		},

		setControl: function(c, v) {
			var idx = -1;
			for(var j=0; j<_cc.length; j++)
				if( _cc[j].c == c )
					idx = j;

			if( idx == -1 ) {
				console.log('adding cc');
				_cc.push( { c: c, v: v } );
			}
			else {
				console.log('updating cc #'+idx);
				_cc[idx].v = v;
			}
		},

		setNote: function(n, v) {
			var idx = -1;
			for(var j=0; j<_notes.length; j++)
				if( _notes[j].n == n )
					idx = j;

			if( idx == -1 ) {
				console.log('adding note');
				_notes.push( { n: n, v: v } );
			}
			else {
				console.log('updating note #'+idx);
				_notes[idx].v = v;
			}
		},
		
		addNote: function(n,v) {
			this.setNote(n,v);
		},
		
		addControl: function(c,v) {
			this.setControl(c,v);
		},
		
		parseJson: function( json ) {
			this.clearStep();
			if( typeof(json.notes) != 'undefined' ) {
				for( var j=0; j<json.notes.length; j++ ) {
					_notes.push( json.notes[j] );
				}
			}
			if( typeof(json.cc) != 'undefined' ) {
				for( var j=0; j<json.cc.length; j++ ) {
					_cc.push( json.cc[j] );
				}
			}
		},
	
		toJson: function() {
			var json = {};
			if( _notes.length > 0 )
				json.notes = [];
			for( var j=0; j<_notes.length; j++ ){
				json.notes.push(_notes[j]);
			}
			if( _cc.length > 0 )
				json.cc = [];
			for( var j=0; j<_cc.length; j++ ){
				json.cc.push(_cc[j]);
			}
			return json;
		}
	};
};

exports.Pattern = function() {
	
	var _steps = [];
	for( var s=0; s<16; s++ )
		_steps.push( new exports.Step() );
	
	return {
		
		start: 0,
		end: 15,
		enabled: true,
		
		reset: function() {
			this.start = 0;
			this.end = 15;
			// this.enabled = true;
			_steps = [];
			for( var s=0; s<16; s++ )
				_steps.push( new exports.Step() );
		},
		
		getStep: function(s){
			if( s < 0 || s >= 16 )
				return null;
			return _steps[s];
		},
		
		clearSteps: function() {
			for( var j=0; j<16; j++ )
				_steps[j].clearStep();
		},
		
		isEmpty: function(){
			if( this.start != 0 || this.end != 15 )
				return false;
			if( this.enabled == false )
				return false;
			for( var j=0; j<16; j++ )
				if( !_steps[j].isEmpty() )
				 	return false;
			return true;
		},
		
		parseJson: function(json) {
			// this.reset();
			if( typeof(json.enabled) != 'undefined' )
				this.enabled = (json.enabled == 'true' || json.enabled == true);
			if( typeof(json.start) != 'undefined' )
				this.start = parseInt(json.start, 10);
			if( typeof(json.end) != 'undefined' )
				this.end = parseInt(json.end, 10);
			if( typeof(json.steps) != 'undefined' )
				for( var j=0; j<json.steps.length; j++ ) {
					var js = json.steps[j];
					_steps[ js.step ].parseJson( js );
				}
		},
	
		toJson: function() {
			var json = { 
				enabled: this.enabled,
				start: this.start,
				end: this.end
			};
			// if( !this.isEmpty() ){
			json.steps = [];
			for( var j=0; j<16; j++ ){
				if( _steps[j].isEmpty() )
					continue;
				var data = _steps[ j ].toJson();
				data.step = j;
				json.steps.push( data );
			}
			// }
			return json;
		}
		
	};
};

exports.SongTrack = function( index, channel, type ) {
	
	var _patterns = [];
	for( var s=0; s<16; s++ )
		_patterns.push( new exports.Pattern() );
	
	return {
		
		position: 0,
		enabled: true,
		advance: false,
		cue: -1, 
		track: index,
		channel: channel,
		gate: 4,
		type: type,

		reset: function() {
			this.position = 0;
			this.position = 0;
			this.enabled = true;
			this.advance = false;
			this.cue = -1;
			this.track = index;
			this.channel = channel;
			this.gate = 4;
			this.type = type;
			for(var i=0; i<16; i++) {
				this.getPattern(i).reset();
			}
		},
		
		getPattern: function(s){
			if( s < 0 || s >= 16 )
				return null;
			return _patterns[s];
		},
		
		getNextEnabledPattern: function(lastpattern) {
			for( var j=0; j<16; j++ )
				if( _patterns[j].enabled && j > lastpattern )
					return j;
			for( var j=0; j<16; j++ )
				if( _patterns[j].enabled )
					return j;
			return -1;
		},
		
		parseJson: function(json) {
			if( typeof(json.enabled) != 'undefined' )
				this.enabled = (json.enabled == 'true' || json.enabled == true);
			if( typeof(json.position) != 'undefined' )
				this.position = parseInt(json.position, 10);
			if( typeof(json.gate) != 'undefined' )
				this.gate = parseInt(json.gate, 10);
			if( typeof(json.channel) != 'undefined' )
				this.channel = parseInt(json.channel, 10);
			if( typeof(json.type) != 'undefined' )
				this.type = json.type;
			if( typeof(json.patterns) != 'undefined' )
				for( var j=0; j<json.patterns.length; j++ ) {
					var js = json.patterns[j];
					_patterns[ js.pattern ].parseJson( js );
				}	
		},
	
		toJson: function() {
			var json = { 
				patterns: [],
				enabled: this.enabled,
				position: this.position,
				channel: this.channel,
				type: this.type,
				gate: this.gate
			};
			for( var j=0; j<16; j++ ){
				if( _patterns[j].isEmpty() ) {			
					var data = { pattern: j };
					json.patterns.push( data );
				} else {		
					var data = _patterns[ j ].toJson();
					data.pattern = j;
					json.patterns.push( data );
				}
			}
			return json;
		}
	};
};

exports.Song = function() {

	var _tracks = [];
	for( var j=0; j<16; j++ ){
		_tracks[j] = new exports.SongTrack( j, j, j>=10?"synth":"drum" );
		for( var k=0; k<16; k++ ){
			_tracks[j].getPattern(k).enabled = (k==0);
		}
	}

	function _reset() {

	}
	
	return {
		
		bpm: 140,
		shuffle: 5,

		reset: function() {
			this.bpm = 140;
			this.shuffle = 5;
			for(var i=0; i<16; i++)
				this.getTrack(i).reset();
		},
		
		getTrack: function(n){
			if( n < 0 || n >= 16 )
				return null;
			return _tracks[ n ];
		},
	
		parseJson: function(json) {
			if( typeof(json.bpm) != 'undefined' )
				this.bpm = parseInt(json.bpm, 10);
			
			if( typeof(json.shuffle) != 'undefined' )
				this.shuffle = parseInt(json.shuffle, 10);
			
			if( typeof(json.tracks) != 'undefined' )
				for( var j=0; j<json.tracks.length; j++ ){
					_tracks[ json.tracks[j].track ].parseJson( json.tracks[j] );
				}
		},
	
		toJson: function() {
			var json = { bpm: this.bpm, shuffle: this.shuffle, tracks: [] };
			for( var j=0; j<16; j++ ) {
				var data = _tracks[ j ].toJson();
				data.track = j;
				json.tracks.push( data );
			}
			return json;
		}
	}; 
	
};
 