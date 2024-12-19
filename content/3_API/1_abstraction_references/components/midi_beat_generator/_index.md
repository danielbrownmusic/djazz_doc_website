+++

title = "MIDI Beat Generator"
weight = 100
+++

## MIDI Beat Generator

{{<mermaid align="left">}}
flowchart TB;
subgraph MidiBeatGenerator
direction TB
		MidiBeatGeneratorIn(( ))
		BeatReader[Beat Reader]
		Looper[Beat Number Looper]
		BeatReader[MIDI Beat Reader]
		MidiBeatGeneratorOut((( )))
		MidiBeatGeneratorIn --> BeatGenerator --> Looper --> BeatReader --> MidiBeatGeneratorOut
end
{{< /mermaid >}}