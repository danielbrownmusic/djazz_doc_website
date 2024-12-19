+++
title = "djazz MIDI"
weight = 20
+++

{{<mermaid align="left">}}
flowchart TB;
gIn(( ))
g1[Generator 1]
g2[Generator 2]
g3[Generator 3]
g4[Generator 4]
g5[Generator 5]

mbPlayer[MIDI Beat Player]

t1[MIDI\nTrack 1]
t2[MIDI\nTrack 2]
t3[MIDI\nTrack 3]
t4[MIDI\nTrack 4]
t5[MIDI\nTrack 5]

gOut((( )))

gIn --> g1 --> mbPlayer
gIn --> g2 --> mbPlayer
gIn --> g3 --> mbPlayer
gIn --> g4 --> mbPlayer
gIn --> g5 --> mbPlayer

mbPlayer --> t1 --> gOut
mbPlayer --> t2 --> gOut
mbPlayer --> t3 --> gOut
mbPlayer --> t4 --> gOut
mbPlayer --> t5 --> gOut

{{< /mermaid >}}