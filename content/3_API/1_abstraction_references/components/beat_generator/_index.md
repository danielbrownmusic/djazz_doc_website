+++

title = "Beat Generator"
weight = 40
+++


## Beat Generator

{{<mermaid align="left">}}
flowchart TB;
subgraph BeatGenerator[Beat Generator]
direction TB
	BeatGeneratorIn(( ))
	BeatGeneratorSwitch{ }
	subgraph ScorePlayer[Score Player]
	direction TB
		ScorePlayerSwitch[switch]
		MasterClockFollower[Master Clock\nFollower]
		ScorePlayerOut[out]
		subgraph InternalClockFollower[Internal Clock Follower]
		direction TB
			InternalClockFollowerSpeed[Speed Control]
			BeatClock[Beat Clock]
			InternalClockFollowerSpeed --> BeatClock
		end
		ScorePlayerSwitch --> MasterClockFollower
		ScorePlayerSwitch --> InternalClockFollower
	MasterClockFollower --> ScorePlayerOut
	InternalClockFollower --> ScorePlayerOut
	end
	subgraph Improviser[Improviser]
	direction TB
		ImproviserSpeed[Speed Control]
		FOP[Factor Oracle Player]
		ImproviserSpeed --> FOP
	end

	BeatGeneratorOut((( )))

	BeatGeneratorIn		--> BeatGeneratorSwitch
	BeatGeneratorSwitch --> ScorePlayer
	BeatGeneratorSwitch --> Improviser
	ScorePlayer 		--> BeatGeneratorOut
	Improviser 			--> BeatGeneratorOut
end
	
{{< /mermaid >}}