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
# MIDI CC 20 = first track volume
# MIDI CC 21 = second track volume
# ...
#
# MIDI CC 40 = send1 track volume
# MIDI CC 41 = send2 track volume
#

from __future__ import with_statement
import Live
from _Framework.InputControlElement import *
from _Framework.ControlSurface import ControlSurface # Central base class for scripts based on the new Framework
from _Framework.TransportComponent import TransportComponent # Class encapsulating all functions in Live's transport section
from _Framework.ButtonElement import ButtonElement # Class representing a button a the controller
from _Framework.MixerComponent import MixerComponent
from _Framework.SessionComponent import SessionComponent
from _Framework.EncoderElement import EncoderElement
from _Framework.SliderElement import SliderElement

NUM_TRACKS = 10
NUM_ROWS = 16
NUM_RETURNS = 2

class midilooper(ControlSurface):

    def __init__(self, c_instance):
        ControlSurface.__init__(self, c_instance)
        with self.component_guard():
            self._instance = c_instance
            self._has_slider_section = True
            self.log_message("Midilooper initializing...")
            # register_sender(self)
            self._session = SessionComponent(NUM_TRACKS, NUM_ROWS)
            self._session.name = 'Session_Control'
            self._mixer = MixerComponent(NUM_TRACKS, NUM_RETURNS)
            for track in range(NUM_TRACKS):
                strip = self._mixer.channel_strip(track)
                strip.name = 'Channel_Strip_' + str(track)
                # encoder = EncoderElement(MIDI_CC_TYPE, 0, 20 + track, Live.MidiMap.MapMode.absolute)
                control = SliderElement(MIDI_CC_TYPE, 0, 20+track)
                control.name = str(track) + '_Volume_Control'
                strip.set_volume_control(control)
            for track in range(NUM_RETURNS):
                strip = self._mixer.return_strip(track)
                control = SliderElement(MIDI_CC_TYPE, 0, 40+track)
                control.name = str(track) + '_Return_Control'
                strip.set_volume_control(control)
            strip = self._mixer.master_strip()
            strip.name = 'Master_Channel_Strip'
            control = SliderElement(MIDI_CC_TYPE, 0, 50)
            control.name = 'Master_Volume_Control'
            strip.set_volume_control(control)
            self._session.set_offsets(0, 0);
            self._session.set_mixer(self._mixer)
            for row in range(NUM_ROWS):
                scene = self._session.scene(row)
                for track in range(NUM_TRACKS):
                    slot = scene.clip_slot(track)
                    button = ButtonElement(True, MIDI_NOTE_TYPE, track, 36+row)
                    slot.set_launch_button(button)
            self.set_highlighting_session_component(self._session)
            self.request_rebuild_midi_map()
            self.log_message("Midilooper initialized.")

    def disconnect(self):
        ControlSurface.disconnect(self)

