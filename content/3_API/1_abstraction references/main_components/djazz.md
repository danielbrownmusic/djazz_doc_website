+++

title = "djazz"
weight = 10
+++


{{<mermaid align="left">}}
flowchart TB;

AudioIn1((Audio\nIn L))
AudioIn2((Audio\nIn R))
MidiIn((MIDI In))
TapIn((Tap\nIn))
PattrIn((Pattr\nIn))
DataIn((File\nData\nIn))
PresetIn((Presets In))

Master[Master Control]
Audio[Djazz Audio]
Midi[Djazz MIDI]
PattrStorage[PattrStorage]

click Master "./../components/master_control.html" "Master Control"
click Audio "audio.html" "Master Control"
click Midi "midi.html" "Master Control"


AudioOut1(((Audio\nOut 1L)))
AudioOut2(((Audio\nOut 1R)))
AudioOut3(((Audio\nOut 2L)))
AudioOut4(((Audio\nOut 2R)))
AudioOut5(((Audio\nOut 3L)))
AudioOut6(((Audio\nOut 3R)))
MidiOut(((MIDI Out)))
PattrOut(((Pattr Out)))


AudioIn1--->Audio
AudioIn2--->Audio

TapIn-->Master

PattrIn-->Master
PattrIn-->Audio
PattrIn-->Midi

DataIn-->Audio
DataIn-->Midi
DataIn-->Master

Master-->Audio
Master-->Midi

MidiIn-->Midi

Audio-->AudioOut1
Audio-->AudioOut2
Audio-->AudioOut3
Audio-->AudioOut4
Audio-->AudioOut5
Audio-->AudioOut6

Midi-->MidiOut

PresetIn-->PattrStorage
PattrStorage-->PattrOut

{{< /mermaid >}}


### Stochastic LFO with Kuramoto-model coupling.
<!-- Brief Description -->

###### Outputs a sine-squared amplitude envelope with several settable stochastic parameters.  
When different instances of this object are "coupled" by connecting their right inlets and outlets,
    their *coupling_strength* can be changed, causing their LFOs to synchronize or alternate.

# INLETS

### 0:   int/signal/message  
**signal**: audio (mono) signal to be amplitude modulated.  
**int**: zero turns off, anything else turns on.  
**message**: see messages reference.  
<!-- Full Description  -->
<!-- INLET -->

### 1: signal
###### Connect other cicadas to this inlet.
When the right outlet of another cicada is connected to this inlet, this cicada "listens" to the other one.  
Change this cicada's *coupling_strength* attribute to change how the other cicada's behavior affects this one.

# OUTLETS

### 0 &emsp; signal
###### The amplitude-modulated signal.   
If there is an input signal, this will output the amplitude-modulated signal. 
If no input signal and [chirp_on_signal]() is zero, this will output the amplitude envelope.
If no input signal and [chirp_on_signal]() is non-zero, this will not output.  

### 1 &emsp;  bang
###### _bang_  when amplitude envelope is zero</digest>
<!-- Brief Description -->

<!-- OUTLETS -->

# ATTRIBUTES

### amplitude_randomness  &emsp; _float_  &emsp; (set) 
###### Range: 0 to 1
At 0 all chirps will have peak value 1.0. Increase to randomize peak values. Follows a normal (Gaussian) distribution. Default is zero.

### chirp_length_mean _float_ (set)
###### In milliseconds. Follows a normal (Gaussian) distribution. Default is 300 ms.

# MESSAGES
### _int_  
###### Left inlet: 0 turns off, anything else turns on. Default is on.  
  

# SEE ALSO
[_cicada_chorus_control_]()
      