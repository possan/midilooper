Restful MIDI Looper
===================

A helper for music/beat based interactive installations, driving synthesizers and drummachines


Basics
------

The looped song contains of 16 tracks, each track consists of 16 patterns, every pattern has 16 steps.

Tracks can be muted, soloed, patterns can be queued.


Usage
-----

`node app.js`


REST API
--------

Quick introduction to the functionality of the API


### File operations:

#### Load another song by filename:

	curl -X POST -d value=othersong.json http://localhost:8832/song/load
	ok

#### Save current song:

	curl -X POST http://localhost:8832/song/save
	ok


### Song information:

#### Get the information about the current song:

	curl -X POST http://localhost:8832/song
	{...}

#### Get beats per minute:

	curl http://localhost:8832/song/bpm
	{"value":120}

#### Update beats per minute:

	curl -X POST -d value=125 http://localhost:8832/song/bpm
	ok

#### Get shuffle amount:

	curl http://localhost:8832/song/shuffle
	{"value":0}

#### Update shuffle amount:

	curl -X POST -d value=50 http://localhost:8832/song/shuffle
	ok



(developing...)
