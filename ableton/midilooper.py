#
# 16x16 sound trigger midi mapping for Ableton 9
#
# MIDI Channel 0 = first track
# MIDI Channel 1 = second track
# ...
#
# Key 36 = first row
# Key 37 = second row
# ...
#

from __future__ import with_statement
import Live
from _Framework.InputControlElement import *
from _Framework.ControlSurface import ControlSurface # Central base class for scripts based on the new Framework
from _Framework.TransportComponent import TransportComponent # Class encapsulating all functions in Live's transport section
from _Framework.ButtonElement import ButtonElement # Class representing a button a the controller
from _Framework.MixerComponent import MixerComponent
from _Framework.SessionComponent import SessionComponent

class midilooper(ControlSurface):
    
    def __init__(self, c_instance):
        ControlSurface.__init__(self, c_instance)
        self._instance = c_instance
        with self.component_guard():
            self.session = SessionComponent(16, 16)
            for track in range(16):
                for row in range(16):
                    scene = self.session.scene(row)
                    slot = scene.clip_slot(track)
                    button = ButtonElement(True, MIDI_NOTE_TYPE, track, 36+row)
                    slot.set_launch_button(button)

