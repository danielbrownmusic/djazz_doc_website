+++
title = "control flow"
weight = 20
+++

Because Djazz is beat-based, most objects are built to receive and process information at recurring instances. 


	Djazz plays music in two ways: by selecting sections from scores, and by calculating improvisations using the factor oracle algorithm which is modified with pattern-matching methods. The input to the factor oracle come from scores and real-time input, either audio or MIDI, and is output as audio or MIDI. It is (being) written in Max with the factor-oracle and pattern-matching computation in Python. It uses Antescofo to generate notes both from scores and generated as improvisations in tempo.

	Djazz improvises on songs using template files, which are lists of beats representing positions in the songs.  No other information is encoded in these templates: chord changes and notes are in different files: the scores used by Antescofo, and the databases used by the factor oracle. The song templates just let Antescofo and the factor oracle know which beat we’re on at a given time.  For songs whose formal structure includes verses or sections, this larger structure is also included in the template. It can also improvise over a “free” structure by using a trivial template, just a short list of beats that loops.

	Djazz is played by inputting a tap—manually, from a built-in metronome, or from another application. The tap triggers a beat, which triggers notes to be output from the factor oracle or the score, which triggers note data to be output from antescofo, which triggers sound to be output by the audio or midi outputs. [SLIDE]

	You can see this control flow. The tap comes in on the left and comes out as sound from the midi bank on the right. The intermediate translations from tap to beat occur in the objects along the way.
	The architecture: several players which can be of different types (all the possible types to be determined). Each functions independently but there is a master control for synchronising timing and for broadcasting global commands.
	The control flow is represented functionally thus [SLIDE], where the “p’s” are vectors of parameters that change the way each translation is done. The control flow of these p’s are what I’m going to talk about.

