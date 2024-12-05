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
