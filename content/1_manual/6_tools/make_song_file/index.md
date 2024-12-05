+++
title = "Making a Song File"
weight = 10
+++

Djazz uses a _song file_ to play a song, whether you are plaing back scores or using live MIDI or audio. Where a _score file_ contains the notes in each beat of the song, a _song file_ contains all the metadata for each beat: its label, its position in the song, and what chapter of the song it is in.
Djazz uses labels that represent chords. In this way, a _song file_ is like a chord chart.

To create a _song file_ for a new song you want to play with Djazz, the __make_song_file__ Max patcher is provided for you in the _tools_ folder.

![make-song-file-tool](images/make-song-file-tool.png)

### SONG NAME
Enter the name of the given song; this will be displayed when the song file is loaded, and will also appear in the song dropdown menu if it is placed in the _djazz_user/scores/_ folder

### BEATS
Enter here the total number of beats in the song.

### TEMPO
Enter the song tempo. This tempo will be loaded into Djazz's metronome when the song is loaded, and is also the tempo that will be expected if [manual tap entry is performed](1_manual/1_installation/index.md)

### TIME SIGNATURE
Enter the number of beats per measure, i.e. the top number in the time signature. The duration of the beats, i.e. the bottom number in the time signature (4 for quarter note, 8 for eighth note, etc.) does not matter; do not include it.

### CHAPTER START BARS
If the song is divided into chapters, enter here the bar (i.e. measure) numbers at which the chapters begin.
For instance, if a song contains four chapters of 16, 16, 32, and 64 bars, in that order, the chapter start bars will be 1, 17, 33, and 65. Enter these numbers without commas

Putting all this together, here's what you would enter for a song in 4/4 time, with chapters of duration as above: 16, 16, 32, and 32 bars. The number of beats is the total number of bars multiplied by the time signature; in this case (16 + 16 + 32 + 64) * 4 = 128 * 4 = 516

![make-song-file-tool-example](images/beats-tempo-timesig-chapterstartbars.png)

### BEAT LABELS

Beat labels are input in a text-based format. They can be entered directly into the tool's window, or cut and pasted from a text editor.

A chord label has two parts, the _root_ and the _quality_. The way of entering labels is as follows:

&emsp; (\< _chord root_ \> &emsp; \< _chord quality_ \> &emsp; \< _number of consecutive beats_ \>)

\< _chord root_ \> can be the symbol C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, or B.

\< _chord quality_ \> can be any symbol that does not contain an underscore ("_") or a semicolon(";").  

The improvisation algorithm
functions in part by matching these symbols with the symbols on the beats in score files, so if you want it to work correctly, keep the format of these symbols the same. For instance, the preloaded songs in Djazz use the following symbols:

&emsp; _maj7, min7, 7, dim7, maj6, min6_

But you can define any symbols you want:

&emsp; _dom7#9b9#11, maj6add9, min6withanextraweirdnoteatthetop_, etc.

\< _number of consecutive beats_ \> is how many beats this particular label is repeated.

So for instance, the chord sequence  

&emsp; Amaj7 &ensp; Amaj7 &ensp; Dmin7 &ensp; Amaj7  
&emsp; Amaj7 &ensp; Dmin7 &ensp; E7 &emsp; &nbsp; &nbsp; Amaj7

would be entered as

![chord-labels-1](images/make-song-file-tool-beat-labels-example-1.png)

It could also be entered as

![chord-labels-2](images/make-song-file-tool-beat-labels-example-2.png)

if this is easier to read.  
Indentation and carriage returns are ignored by the tool.

