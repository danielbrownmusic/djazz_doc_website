+++
title = "Making a Score File"
weight = 20
+++

Score files contain preloaded notes, formatted so that Djazz can play them and use them to improvise.
Djazz comes preloaded with many score files of jazz standards and songs from Madagascar. You can also 
convert your own MIDI files into Djazz scores with the _make_score_file_ Max patcher, located in the _tools_ folder.

1. Load a song file
 If you haven't yet made a song file for this song, make one using the [make_song_file]() tool.

2. Load a click track
    A click track is needed to divide the notes in the MIDI tracks into the proper beats.
    A click track must 
    
    be a MIDI file
    contain a single MIDI event at the beginning of each beat

    MIDI events must be at pitch C1

    They must be the same length (in beats) as the MIDI tracks with the notes

    They must be exported at the same tempo as the notes.






HOW TO MAKE A NEW SONG FILE FOR DJAZZ.

A song file is not a score file. It does not contain any notes to play. It contains the navigation information in the song: chapters, bars, beats chord labels, and tempo, in order to make the grid and send the master clock and factor oracle the appropriate data.

Here is how to make one. There are seven (7) steps listed below.

1. Open the patcher “djazz.make_song_file.maxpat” from the folder “patchers/data_conversion_tools” in the current djazz folder.

2. In the appropriate fields, put in the song name, beat count, tempo, time signature, and the starting bars for each chapter. This data is exactly the same, and in the same order, as the data listed for the songs in the old Djazz version, EXCEPT FOR ONE DIFFERENCE: don’t use quotation marks when you put in the start bars. Only put in the list of numbers (and don’t use commas).

3. Put the grid data in the “grid data” box. Put it in (or copy and paste it) in LISP-style notation, where each entry is a list:  ( chord-root   chord-type-symbol   number-of-measures  )
Do not use outer parentheses for the whole list of lists.
Do not include any comments or semi-colons.
Spacing and indentation is not important.

￼


4. Press the “save” button.

5. Save the song file in the folder of the same song name that contains the subfolders “new” and “new2.” The file name and the song folder name should be exactly the same.

￼

6. That’s all. If the folder you put the new song file in has scores in its “new” and “new2” subfolders, this song can now be played as usual by Djazz.

7. Press the “clear” button to clear the data.