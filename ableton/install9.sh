#!/bin/sh
# Install in ableton 9	
ls -la       /Applications/Ableton\ Live\ 9\ Suite.app/Contents/App-Resources/MIDI\ Remote\ Scripts/MIDILOOPER
rm -rf       /Applications/Ableton\ Live\ 9\ Suite.app/Contents/App-Resources/MIDI\ Remote\ Scripts/MIDILOOPER
cp -R $PWD   /Applications/Ableton\ Live\ 9\ Suite.app/Contents/App-Resources/MIDI\ Remote\ Scripts/MIDILOOPER
ls -la       /Applications/Ableton\ Live\ 9\ Suite.app/Contents/App-Resources/MIDI\ Remote\ Scripts/MIDILOOPER