var httpmodule = require('http');
var restify = require('restify');
var songmodule = require('./song');
var sequencermodule = require('./sequencer');
var playermodule = require('./player');
var servicemodule = require('./service');
var livesetmodule = require('./liveset');

//
// Set up MIDI
//

console.log('Setting up MIDI...');

var midi = require('midi');
var midioutput = new midi.output();
console.log('port count:', midioutput.getPortCount());
for (var k=0; k<midioutput.getPortCount(); k++)
	console.log('port #'+k+':', midioutput.getPortName(k));
midioutput.openPort(0);
console.log('Using first.');

//
// Set up song and sequencer
//

console.log('Setting up Song...');

var song = new songmodule.Song();

console.log('Setting up Sequencer...');

var seq = new sequencermodule.Sequencer( { 
	ppqn: 48,
	song: song,
	sendMidi: function(arg) { 
		midioutput.sendMessage(arg);
	}
} );

//
// Set up the lievset
//

var liveset = new livesetmodule.Liveset();
liveset.song = song;
liveset.reset();

liveset.filename = 'default';
if (process.argv.length > 2) {
	liveset.filename = process.argv[2];
}

liveset.load();
liveset.start();

//
// Load song and set up autosave
//

//
// Set up sequence player
// 

seq.player = playermodule.Player( {
	ppqn: 48,
	callback: function( arg ) { 
		seq.step( arg );
	}
} );

console.log('starting playback.');
seq.player.startTimer();

//
// Start API
//

var service = new servicemodule.Service();
service.port = 8832;
service.seq = seq;
service.song = song;
service.liveset = liveset;
service.start();
