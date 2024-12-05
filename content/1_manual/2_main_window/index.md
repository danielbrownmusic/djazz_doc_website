+++
title = "Main Window"
weight = 20
+++

![pic1](images/main_window_numbered.png)


## 1. MIDI/AUDIO INTERFACE SELECTOR
![pic1](images/MIDI_view_button.png)

Clicking on the button labeled "MIDI" or "Audio" will open the MIDI or Audio interface window, respectively. You can also use the key commands "m" to open/close the MIDI window or "a" to open/close the audio window.

## 2. BEAT INPUT

### Input Selector

Djazz plays a beat each time it receives a message (a "tap," or "click"), if it is engaged (how to engage Djazz will be explaind below). When not engaged, it will not play when a beat message is received. When this is the case, you can click on measures or chapters ("cells" of the grid) in the song grid without triggering playback. Once engaged, djazz will begin playing on the next beat after a cell has been clicked on.

The cells of the grid change color depending on whether Djazz is engaged and whether a cell is currently playing or not. The colors represent the following:

Light gray: not the current measure/chapter of the song
Dark gray: the current measure measure/chapter of the song, but Djazz is not engaged
Blue: the current measure measure/chapter of the song, but not playing
Orange: the current measure measure/chapter of the song, and playing


 There are three ways to send Djazz a beat message; you select one from the dropdown menu: "manual," "metronome," or "remote."  Selecting from the dropdown menu will change the controls on the left side of this box. When one option is selected, the other two are not responsive.

### Metronome
![pic1](images/metronome_button_and_tempo.png)

1. The button marked with a triangle turns the metronome on and off. When you turn this button on and then select a grid cell, the metronome will trigger a new beat each time it clicks, beginning with the beat represented by the grid cell. No beat will be triggered until a grid cell has been selected.
2. The number selector sets the metronome tempo. This is automatically set when a new song is loaded, but you can change it.
3. This flashes each time the metronome sends a beat.

### Manual
![pic1](images/manual_bang_and_tempo.png)
1. The triangle button engages Djazz.
2. Clicking on the circle button sends Djazz a beat message. You can also press the space bar to send a manual click.

### Remote
![pic1](images/metronome_button_and_tempo.png)
This will send a beat message to Djazz every time a MIDI note on message is received (i.e., with a non-zero velocity) on any channel.
1. The dropdown menu selects the MIDI input port for the click.
2. The triangle button engages Djazz.
3. This flashes each time a beat is received.


### Click sound selector
The right-hand side of the window lets you change the sound and output port of the click.
1. Changes the pitch of the click. The number indicates the MIDI value of the pitch.
2. The channel of the click.
3. The volume of the click
4. Mutes/unmutes the click
5. The output port of the click.

## 3. Song selector
![pic1](images/1_song_file_selector.png)

To load a song grid, select a song using one of these controls. Songs are loaded by selecting _folders_, not individual files. Each folder contains various files pertaining to the song like scores and JSON metadata files.

1. Drag and drop a song folder here.
2. Browse for a song folder. To select a song, click on its folder.
3. Clear the current song.
4. Select a preloaded song from the dropdown menu.

## 4. SONG GRID
When a song is loaded, its grid will appear. 
### Chapter Select
![pic1](images/chapter_grid.png)
At the top are listed the "chapters" of the song--different sections like verses, choruses, and bridges. Clicking on a chapter will take you to the first measure of the chapter. If Djazz is engaged, it will start playing from here when the next beat is received.
### Bar Select
![pic1](images/bar_grid.png)
When a chapter is selected, the bars in the chapter are shown below it. Each bar contains the number of beats given by the song's time signature. Clicking on a bar will take you to the first beat in the bar. If Djazz is engaged, it will start playing from here when the next beat is received.

### Rewind-to-beginning Button
![pic1](images/bar_grid.png)
Click to go to the beginning (first bar of first chapter) of the song.
When the "lock" button next to the rewind button is on, Djazz will rewind to the beginning of the song every time it is disengaged (i.e., when the metronome is turned off, or when the engage button is unselected in manual or remote beat input.)

### Loop-Chapter/Song Button
![pic1](images/loop_chapter_button.png)
When selected, Djazz will loop the current chapter or the whole song, depending on the choice selected to the right of the button. That is, it will start from the beginning immediately when the end of the current chapter or song is reached


## 3. GLOBAL AUDIO CONTROLS
### Audio On
Clicking on either the microphone-icon button or the loudspeaker-icon button will turn the audio on.
### Audio In Level (Microphone)
![pic1](images/audio_in_ctrl.png)
Controls the level of the audio input. The button labeled "M" below the microphone-icon button mutes audio input.
### Audio Record Level
![pic1](images/audio_in_ctrl.png)
Controls the recorded volume level of the audio input.

### Audio Out (Speakers)
![pic1](images/audio_out_ctrl.png)
Controls the level of the global audio output. The button labeled "M" below the loudspeaker-icon button mutes audio output.

## 5. PLAYBACK DATA VIEW
![pic1](images/main_window_data_view.png)
### Beats in song
When a song is loaded, this shows the first and last beat of the song.
### Section is looped

### Beats in section (chapter)
When a song is loaded, this shows the first and last beat of the current chapter.

# Tempo
This shows the current playback tempo. When the metronome is playing, this will be the same as (sometimes fluctuating extremely slightly from) the metronome tempo. When a manual tap 

### Current beat
### Current beat label

## LOADING AND SAVING
#### Open a new song
#### Open a saved song
#### Save a song
#### Make Djazz song files
##### Djazz file
##### Score files

## TAP INPUT
### Manual
expects the starting tempo
### Metronome
### From another machine
