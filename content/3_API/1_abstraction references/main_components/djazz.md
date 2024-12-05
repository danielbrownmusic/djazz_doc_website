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