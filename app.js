var httpmodule = require('http');
var fs = require('fs');
var restify = require('restify');
var songmodule = require('./song');
var sequencermodule = require('./sequencer');
var playermodule = require('./player');
var servicemodule = require('./service');

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
// Load song and set up autosave
//

console.log('loading last saved song.');

doSave = function() {
	// console.log('Auto-saving song...');
	var json = song.toJson();
	var str = JSON.stringify(json,null,'\t');
	fs.writeFile('lastsong.json', str, function (err) {
	  if (err) throw err;
	  console.log('Auto-saved song.');
	});
};

var loaded = false;
fs.readFile('lastsong.json', function (err,json) {
	loaded = true;
	if (typeof(json) != 'undefined'){
		try {
			var data = JSON.parse(json);
			if( data ){
				console.log('loaded song',data);
				song.parseJson(data);
			}
		} catch(e){
			
		}
		doSave();
	}
});

setInterval( function() { doSave(); }, 10000 );

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
service.start();
