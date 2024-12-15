+++
title = "djazz"
weight = 10
+++

# INLETS

### 1 &emsp; _signal_
###### Audio In 1 
_signal_ Audio signal is sent to djazz_audio_in

### 2 &emsp; _signal_
###### Audio In 2
_signal_ Audio signal is sent to djazz_audio_in

### 3 &emsp; _list_
###### Midi In
_list_ (int pitch, int velocity, int channel) sent to djazz_midi_in

### 4 &emsp; _bang_
###### Triggers next beat
_bang_ All active tracks MIDI and audio tracks will play their data located at the current beat in tempo when a bang is received. Any armed recording tracks will record any input during this beat in tempo. 

### 5 &emsp; _list_
###### Asynchronous input (such as that sent from pattr objects)
_list_ (symbol argument-name anything argument-value) See the section on [pattrs]()

### 6 &emsp; _symbol_
###### Loads records needed for playback
_symbol_ The name of a Max dict that has been loaded with a JSON file. These are either song files or score files.

### 7 &emsp; _int_/_list_
###### Messages to the pattrstorage objects
_This_ is only used to send the "clientwindow" message to the pattrstorage object, which is useful for debugging.

# OUTLETS

### 0 &emsp;  _type_
###### digest
description

### 1 &emsp;  _type_
###### digest
description

# ATTRIBUTES

### attribute_1 &emsp _type_ &emsp; 
###### digest
definition

### attribute_2 &emsp _type_ &emsp;  (get)
###### digest
definition

### attribute_1 &emsp _type_ &emsp;  (set)
###### digest
definition

### attribute_1 &emsp _type_ &emsp;  (get/set)
###### digest
definition

# MESSAGES

### _message1_
###### digest
description

### _message2_
###### digest
description

# SEE ALSO
[another-abstraction-1](/path/to/abstraction1)
[another-abstraction-2](/path/to/abstraction2)
