Restful MIDI Looper
===================

A helper for music/beat based interactive installations, driving synthesizers and drummachines


Basics
------

The looped song contains of 16 tracks, each track consists of 16 patterns, every pattern has 16 steps.

Tracks can be muted, soloed, patterns can be queued.

Songs are stored in the `songs/` folder

The service runs on port `8832`


Usage
-----

`node app.js {default songname}`


REST API
--------

Quick introduction to the functionality of the API


### File operations:

#### Load another song by filename:

	curl -X POST -d filename=othersong.json http://localhost:8832/song/load
	ok

#### Save current song:

	curl -X POST http://localhost:8832/song/save
	ok

#### Reset the current song:

	curl -X DELETE http://localhost:8832/song
	ok


### Song basics:

#### Get the information about the current song:

	curl -X POST http://localhost:8832/song
	{...}

#### Update beats per minute:

	curl -X POST -d bpm=125 http://localhost:8832/song
	ok

#### Update shuffle amount:

	curl -X POST -d shuffle=0 http://localhost:8832/song
	ok


### Pattern basics:

#### Getting information about a pattern

	curl http://localhost:8832/song/track/0/pattern/0
	{...}

#### Enabling a pattern

	curl -X POST -d enabled=true http://localhost:8832/song/track/0/pattern/1
	{...}

#### Changing the looping points for a pattern

	curl -X POST -d start=3 -d end=7 http://localhost:8832/song/track/0/pattern/0
	ok

#### Resetting notes on a step

	curl -X DELETE http://localhost:8832/song/track/0/pattern/0/step/0
	ok

#### Adding notes to a step

	curl -X POST -d note=36 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/0
	ok

#### Adding CC values to a step

	curl -X POST -d control=77 -d value=0 http://localhost:8832/song/track/0/pattern/0/step/0
	ok


### Combined examples

Make sure you have something hooked up that receives midi events so you can actually hear the audio.


#### Setting up a basic beat

Reset the song

	curl -X DELETE http://localhost:8832/song

Set the tempo (and swing/shuffle)

	curl -X POST -d bpm=110 http://localhost:8832/song
	curl -X POST -d shuffle=20 http://localhost:8832/song

Set up first track to send the drums on the default midi drum channel (10)

	curl -X POST -d channel=9 http://localhost:8832/song/track/0

Reset the pattern and enable it

	curl -X DELETE http://localhost:8832/song/track/0/pattern/0
	curl -X POST -d enable=true http://localhost:8832/song/track/0/pattern/0

Add some drums

	# kick
	curl -X POST -d note=36 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/0
	curl -X POST -d note=36 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/4
	curl -X POST -d note=36 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/8
	curl -X POST -d note=36 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/12

	# snare
	curl -X POST -d note=41 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/4
	curl -X POST -d note=41 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/12
	curl -X POST -d note=41 -d velocity=127 http://localhost:8832/song/track/0/pattern/0/step/15

	# hats
	curl -X POST -d note=38 -d velocity=100 http://localhost:8832/song/track/0/pattern/0/step/2
	curl -X POST -d note=39 -d velocity=110 http://localhost:8832/song/track/0/pattern/0/step/5
	curl -X POST -d note=38 -d velocity=80 http://localhost:8832/song/track/0/pattern/0/step/6
	curl -X POST -d note=38 -d velocity=90 http://localhost:8832/song/track/0/pattern/0/step/7
	curl -X POST -d note=38 -d velocity=80 http://localhost:8832/song/track/0/pattern/0/step/10
	curl -X POST -d note=39 -d velocity=90 http://localhost:8832/song/track/0/pattern/0/step/11
	curl -X POST -d note=38 -d velocity=100 http://localhost:8832/song/track/0/pattern/0/step/14

And display the pattern

	curl http://localhost:8832/song/track/0

Set up and enable the second track

	curl -X POST -d channel=0 http://localhost:8832/song/track/1
	curl -X POST -d enable=true http://localhost:8832/song/track/1

Reset the pattern and enable it

	curl -X DELETE http://localhost:8832/song/track/1/pattern/0
	curl -X POST -d enable=true -d start=0 -d end=8 http://localhost:8832/song/track/1/pattern/0

Add a bassline loop

	curl -X POST -d note=36 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/0
	curl -X POST -d note=48 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/2
	curl -X POST -d note=36 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/3
	curl -X POST -d note=72 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/4
	curl -X POST -d note=48 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/5
	curl -X POST -d note=36 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/6
	curl -X POST -d note=48 -d velocity=100 http://localhost:8832/song/track/1/pattern/0/step/8

Send some CC's too (not interpolated, just events quantized to the steps)

	curl -X POST -d control=70 -d value=10 http://localhost:8832/song/track/1/pattern/0/step/0
	curl -X POST -d control=70 -d value=30 http://localhost:8832/song/track/1/pattern/0/step/1
	curl -X POST -d control=70 -d value=20 http://localhost:8832/song/track/1/pattern/0/step/2
	curl -X POST -d control=70 -d value=10 http://localhost:8832/song/track/1/pattern/0/step/3
	curl -X POST -d control=70 -d value=15 http://localhost:8832/song/track/1/pattern/0/step/4
	curl -X POST -d control=70 -d value=30 http://localhost:8832/song/track/1/pattern/0/step/5
	curl -X POST -d control=70 -d value=40 http://localhost:8832/song/track/1/pattern/0/step/6
	curl -X POST -d control=70 -d value=20 http://localhost:8832/song/track/1/pattern/0/step/7
	curl -X POST -d control=70 -d value=10 http://localhost:8832/song/track/1/pattern/0/step/8

That's it!

