+++

title = "Master Control"
weight = 90
+++

{{<mermaid align="left">}}
flowchart TB;
TapIn(( Bang In))
PattrIn(( Pattr In ))
SongDataIn((Song Data\nIn))


GetTempo[Get Tempo]
Clock[Beat Clock]
GetLabel[Get Label]
Out((( )))

TapIn-- bang -->GetTempo
PattrIn -- initial tempo --> GetTempo
PattrIn -- start beat,\nend beat,\nloop-section beats,\nloop section active --> GetTempo


GetTempo-- bang -->Clock
GetTempo-- Tempo -->Out
Clock-- beat number -->GetLabel
Clock-- Beat Number -->Out
GetLabel-- Label -->Out

SongDataIn-- Song Data ----> GetLabel

{{< /mermaid >}}

Master Control
	Master Clock
	- outputs a beat number when it receives a bang
	- increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped.
	- keeps track of tempo if tempo is manually input and fluctuates. This uses antescofo.
	- reads from song dict to get label
	- sends tempo, beat, and chord label, immediately in succession and in that order, to midi and audio generators. This order is important,  so that the generators can calculate the correct information to play at the beginning of each beat.  