//
//
//

var fs = require('fs');

Liveset = function() {
	this.filename = 'default';
	this.song = null;
}

Liveset.prototype.getPath = function(isautosave) {
	var fn = 'songs/'+this.filename;
	if (isautosave)
		fn += '.autosave';
	return fn;
}

Liveset.prototype.save = function(isautosave) {
	var path = this.getPath(isautosave || false);
	console.log('Saving song: '+path);
	var json = this.song.toJson();
	var str = JSON.stringify(json, null, '\t');
	fs.writeFile(path, str, function (err) {
		if (err) throw err;
		console.log('Saved.');
	});
	this.queueAutosave();
}

Liveset.prototype.load = function() {
	var _this = this;
	var path = this.getPath(false);
	// var aspath = this.getPath(true);
	console.log('Loading '+path);
	fs.readFile(path, function(err, json) {
		if (err)
			console.error('Load failed', err);
		if (typeof(json) != 'undefined'){
			try {
				var data = JSON.parse(json);
				if (data) {
					_this.song.parseJson(data);
					_this.queueAutosave();
				}
			} catch(e) {
				console.error('Load failed', e);
			}
		}
	});
}

Liveset.prototype.reset = function() {
	this.song.reset();
}

Liveset.prototype.queueAutosave = function() {
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = null;
	}
	this.timer = setTimeout( this.save.bind(this, true), 15000 );
}

Liveset.prototype.start = function() {
}

exports.Liveset = Liveset;
