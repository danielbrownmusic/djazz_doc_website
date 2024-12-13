var relearn_search_index = [
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Manual",
    "uri": "/1_manual.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tutorials",
    "uri": "/2_tutorials.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "API",
    "uri": "/3_api.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "Input is passed to patchers two ways: synchronously and asynchronously, depending on the type of input data. Synchoronous data consists of the beat number, the current tempo (since this can fluctuate), and any data to be used by the analyzer. This data is passed serially through patch cords which send data serially.\nThe generator uses the beat number when improvise mode is not on; it uses this to play the next beat or a different beat if one has been selected by the user. In improvise mode, the beat number is not considered. The label produced by the analyzer is used, as described above.\nAsynchoronous data is anything changed by the user using the GUI. A lot of this data is well known to audio interface users: track volume, MIDI and audio effects like pitch transposition, for instance. The factor oracle player has two asynchronous controls: max-continuity and pitch-transposition.\ngraph TB; A[Master Clock] B[Audio] C[MIDI] A--\u003e|tempo, beat number, label| B A--\u003e|tempo, beat number, label| C flowchart TB; gIn(( )) g1[Generator 1] g2[Generator 2] g3[Generator 3] g4[Generator 4] g5[Generator 5] mbPlayer[MIDI Beat Player] t1[MIDI\\nTrack 1] t2[MIDI\\nTrack 2] t3[MIDI\\nTrack 3] t4[MIDI\\nTrack 4] t5[MIDI\\nTrack 5] gOut((( ))) gIn --\u003e g1 --\u003e mbPlayer gIn --\u003e g2 --\u003e mbPlayer gIn --\u003e g3 --\u003e mbPlayer gIn --\u003e g4 --\u003e mbPlayer gIn --\u003e g5 --\u003e mbPlayer mbPlayer --\u003e t1 --\u003e gOut mbPlayer --\u003e t2 --\u003e gOut mbPlayer --\u003e t3 --\u003e gOut mbPlayer --\u003e t4 --\u003e gOut mbPlayer --\u003e t5 --\u003e gOut MIDI Generator flowchart TB; subgraph MidiBeatGenerator direction TB MidiBeatGeneratorIn(( )) BeatReader[Beat Reader] Looper[Beat Number Looper] BeatReader[MIDI Beat Reader] MidiBeatGeneratorOut((( ))) MidiBeatGeneratorIn --\u003e BeatGenerator --\u003e Looper --\u003e BeatReader --\u003e MidiBeatGeneratorOut end Beat Generator flowchart TB; subgraph BeatGenerator[Beat Generator] direction TB BeatGeneratorIn(( )) BeatGeneratorSwitch{ } subgraph ScorePlayer[Score Player] direction TB ScorePlayerSwitch[switch] MasterClockFollower[Master Clock\\nFollower] ScorePlayerOut[out] subgraph InternalClockFollower[Internal Clock Follower] direction TB InternalClockFollowerSpeed[Speed Control] BeatClock[Beat Clock] InternalClockFollowerSpeed --\u003e BeatClock end ScorePlayerSwitch --\u003e MasterClockFollower ScorePlayerSwitch --\u003e InternalClockFollower MasterClockFollower --\u003e ScorePlayerOut InternalClockFollower --\u003e ScorePlayerOut end subgraph Improviser[Improviser] direction TB ImproviserSpeed[Speed Control] FOP[Factor Oracle Player] ImproviserSpeed --\u003e FOP end BeatGeneratorOut((( ))) BeatGeneratorIn\t--\u003e BeatGeneratorSwitch BeatGeneratorSwitch --\u003e ScorePlayer BeatGeneratorSwitch --\u003e Improviser ScorePlayer --\u003e BeatGeneratorOut Improviser --\u003e BeatGeneratorOut end The beat generator can play in two modes: score player and improviser. Each of these also contain two modes: play at the tempo given by the tap, or play at a different speed: double speed, quadruple speed, half speed, and one and a half speed. This speed change is controlled by an object–the “Speed Control” that, when messages are passed to the generator, modifies the timing of their distribution to the generator’s internal objects. Even though both the score player and the improviser use the Speed Control, the result is different, because the Score Player receives beat number messages and the Improviser receives beat label messages.\nThe Score Player contains two subpatchers, a “Master Clock Follower” and an “Internal Clock Follower.” In Score Player mode, if the Speed Control is active, beat numbers are sent to the Internal Clock Follower, which outputs beat numbers at a different tempo than the input tap. The musical result is an interesting version of “playing out:” beats are played at a different rate, meaning their internal harmony, given by each beat’s chord label, no longer aligns with that of the other tracks:\nMaster Clock Input: Am7 D7 Gmaj7 Cmaj7 Internal Clock Follower Output: Am7 D7 Gmaj7 Cmaj7 Am7 D7 Gmaj7 Cmaj7 The Internal Clock Follower contains its own Beat Clock object. It is passed the same asynchronous messages as the Master Beat Clock, concerning the song beat data like the end beat, the current section beats, and whether the current chapter is being looped. If the Speed Control is inactive, the beat number messages given by the Master Beat Clock are simply passed through.\nIn the Improviser, it is the beat label messages are passed. Beat labels are passed in at the master tempo. When a label is received, it is saved in a message object and a bang is sent to the Speed Control. If active, the speed control at its modified tempo, which trigger the saved label to be passed to the factor oracle player. The result is that the factor oracle player outputs beats that conform to the harmony of the given beat, even though they are at a different tempo:\nMaster Clock Input: Am7 D7 Gmaj7 Cmaj7 Improviser Output: Am7 Am7 D7 D7 Gmaj7 Gmaj7 Cmaj7 Cmaj7 The Improviser The factor oracle (“factor_oracle.maxpat”) The factor oracle player creates the improvisation. As its name suggests, it contains and makes use of the “factor_oracle” Max abstraction.\nThe analyzer uses the same set of symbols as the factor oracle. It is used both offline, to create a file of labeled beats for a song, and online, to convert the data at the beginning of each beat into a symbol to be passed to the factor oracle player. This symbol is then used as the query to the factor oracle to produce the next beat.\nThe analyzer Definition:\nA beat is a collection of notes that occurs between two timepoints. These timepoints are considered to occur at regular intervals. Thus a piece of music that has a pulse can be considered a sequence of beats.\nAt each new beat, calculate a new beat’s worth of music to play. The calculation consists of finding a beat in the database that is the “best match” (or at least a “good match”) based on the data that exists at the beginning of the new beat.\nThis data can be based on any of the following:\nThe location in the song/musical piece. For example, “the A minor 7 chord that occurs at the beginning of measure 13.” A good match is a beat from the database that occurs over the same chord. This could be the same beat as in the original piece, or it could be a different beat that has the same chord, which is more interesting. This creates correct adherence to musical form, if such form exists in the piece.\nWhat we just played in the last beat. For example, an ascending scale in the previous beat could look for a melody that starts on the next note in the scale in the next beat. This creates continuity.\nWhat other listeners have played. This creates responsiveness.\nIn the current usage of Djazz, this match is based only on option 1: the chord symbol that occurs on the given beat. Matching is done by comparing labels. Each beat has a label which reflects the data described above. It is a string of symbols. The nature of this string is determined by the user. In the current usage of Djazz, this string represents the chord symbol, which consists of the chord root and its quality, separated by an underline. Chord roots are numbered from zero to eleven, with zero representing C; thus, C# (or Db) is 1, D is 2, etc. For example, “0_maj7” represents a C major seventh chord.\nA match can be made by exact comparison, or by “fuzzy” methods. In the current usage of Djazz, a chord represents a match if the quality is the same, but the root can be a small distance away from the desired one. The melody is then transposed to match the correct root.\nOffline analysis currently consists of adding the chord labels to each beat. The user inputs this using a graphical tool that takes chord information and stores it in a list of beats; that is, no analysis is done save for copying the “chord chart” into a data file. This data file, which also contains other data like the song tempo, time signature, section starting and ending beats, and song title, is loaded into Djazz when a song is played.\nOnline analysis, as a result, is just a case of reading the chord label from the dictionary when a beat number is generated. This is in fact done by the master clock: it sends out the tempo, chord label, beat number, in immediate succession each time a tap is input.\nThe methods here are general, and the current usage of Djazz can be changed to admit other types of music. This would involve using an extant system, devising a new one, or modifying an extant one to label beats. Optionally defining the definition of a match, if it is not defined as exact.\nThe following criteria must be met: The online analyzer uses the same set of labels as the offline analyzer, if an offline analyzer is used.\nAlso, the architecture is modular, which means that other methods of improvisation are possible. That means that another object can replace the factor oracle player within “improviser” as long as it adheres to the following criteria:\nIt receives a label at the beginning of each beat It produces a beat number, in response to the label, that represents the next beat to play. Djazz supplies a software framework for empirical inquiry into the suitability of a particular data encoding for music: ascertaining the “correctness” of an analysis via listening to the resulting synthesis.",
    "description": "Input is passed to patchers two ways: synchronously and asynchronously, depending on the type of input data.",
    "tags": [],
    "title": "General Description",
    "uri": "/3_api/5_improvisation/0_general_description.html"
  },
  {
    "breadcrumb": "API \u003e externals",
    "content": " Antescofo is used in two places: Master control, to calculate the tempo (SCORE NAME) MIDI beat reader, to sequence and send out midi notes in the proper tempo and rhythm (SCORE NAME) ",
    "description": " Antescofo is used in two places: Master control, to calculate the tempo (SCORE NAME) MIDI beat reader, to sequence and send out midi notes in the proper tempo and rhythm (SCORE NAME) ",
    "tags": [],
    "title": "antescofo",
    "uri": "/3_api/2_externals/antescofo.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Audio Beat Generator",
    "uri": "/3_api/1_abstraction-references/components/audio_beat_generator.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": " The oracle factor patch is here: patchers/data_structures/factor_oracle/factor_oracle.maxpat\nTo use different comparison functions, you need to write a Max patch that performs the label comparison. Then you can change the comparison function in the oracle factor patch by passing it the “comparison” message and the name of the comparison patch. So far, I’ve written two comparison patches: ",
    "description": "The oracle factor patch is here: patchers/data_structures/factor_oracle/factor_oracle.maxpat\nTo use different comparison functions, you need to write a Max patch that performs the label comparison.",
    "tags": [],
    "title": "Description of the Factor Oracle",
    "uri": "/3_api/5_improvisation/1_factor_oracle.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "The biggest step was to complete the factor oracle object, which is generalized for different data types, and the factor_oracle_player object for improvising with it.\nThe oracle factor patch is here: patchers/data_structures/factor_oracle/factor_oracle.maxpat\nTo use different comparison functions, you need to write a Max patch that performs the label comparison. Then you can change the comparison function in the oracle factor patch by passing it the “comparison” message and the name of the comparison patch. So far, I’ve written two comparison patches: patchers/data_structures/factor_oracle/compare/fo.compare.equal_chords.maxpat\npatchers/data_structures/factor_oracle/compare/fo.compare.equal_chords_in_3_semitone_range.maxpat\nBoth work, but I haven’t yet integrated the second - i.e. it finds a rhythm with a chord in a range of 3 semitones (up or down), but after doing so, the program still doesn’t preform the pitch change on the MIDI or audio output.",
    "description": "The biggest step was to complete the factor oracle object, which is generalized for different data types, and the factor_oracle_player object for improvising with it.",
    "tags": [],
    "title": "Description of the Factor Oracle",
    "uri": "/3_api/5_improvisation/_d_improv/_d_1_factor_oracle.html"
  },
  {
    "breadcrumb": "API \u003e Notes on databases in Max",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Dicts in Max and javascript",
    "uri": "/3_api/8_notes_on_rewriting_djazz/max_dictionaris_in_js_and_max.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": " flowchart TB; AudioIn1((Audio\\nIn L)) AudioIn2((Audio\\nIn R)) MidiIn((MIDI In)) TapIn((Tap\\nIn)) PattrIn((Pattr\\nIn)) DataIn((File\\nData\\nIn)) PresetIn((Presets In)) Master[Master Control] Audio[Djazz Audio] Midi[Djazz MIDI] PattrStorage[PattrStorage] click Master \"./../components/master_control.html\" \"Master Control\" click Audio \"audio.html\" \"Master Control\" click Midi \"midi.html\" \"Master Control\" AudioOut1(((Audio\\nOut 1L))) AudioOut2(((Audio\\nOut 1R))) AudioOut3(((Audio\\nOut 2L))) AudioOut4(((Audio\\nOut 2R))) AudioOut5(((Audio\\nOut 3L))) AudioOut6(((Audio\\nOut 3R))) MidiOut(((MIDI Out))) PattrOut(((Pattr Out))) AudioIn1---\u003eAudio AudioIn2---\u003eAudio TapIn--\u003eMaster PattrIn--\u003eMaster PattrIn--\u003eAudio PattrIn--\u003eMidi DataIn--\u003eAudio DataIn--\u003eMidi DataIn--\u003eMaster Master--\u003eAudio Master--\u003eMidi MidiIn--\u003eMidi Audio--\u003eAudioOut1 Audio--\u003eAudioOut2 Audio--\u003eAudioOut3 Audio--\u003eAudioOut4 Audio--\u003eAudioOut5 Audio--\u003eAudioOut6 Midi--\u003eMidiOut PresetIn--\u003ePattrStorage PattrStorage--\u003ePattrOut ",
    "description": "flowchart TB; AudioIn1((Audio\\nIn L)) AudioIn2((Audio\\nIn R)) MidiIn((MIDI In)) TapIn((Tap\\nIn)) PattrIn((Pattr\\nIn)) DataIn((File\\nData\\nIn)) PresetIn((Presets In)) Master[Master Control] Audio[Djazz Audio] Midi[Djazz MIDI] PattrStorage[PattrStorage] click Master \".",
    "tags": [],
    "title": "djazz",
    "uri": "/3_api/1_abstraction-references/main_components/djazz.html"
  },
  {
    "breadcrumb": "API \u003e Going further",
    "content": " Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs. The resulting configurations can then be saved and reloaded.\nThere are two data structures for saving objects: dictionaries and arrays, because some objects occur as ordered sets [midi tracks, effects], while others don’t (players, although they could).\nOrdered sets are placed in arrays using javascript. This way they can be addressed using their indices in the array, and array operations can be used to keep track and change them.\nIn javascript you can make arrays of objects. To delete them, you have to both remove them from the patcher and remove them from the array or you will get undefined stuff.\nThe midi out bank is an example of a hierarchy of objects containing arrays. The bank contains tracks, and the tracks contain (among other things) midi effects. Tracks can be created and deleted, and so can effects. [SLIDE: tree] In addition, there are effects that apply to groups of tracks.\nBANK TRACK GROUP TRACK EFFECT_LIST EFFECT\nTo make this structure:\nEach object in the hierarchy contains a javascript object with the variable name « components, » which is responsible for creating, deleting, and dispatching messages to, and gathering data from the hierarchy objects it contains.\nEach « component » object contains an array of objects. [SLIDE]\nWhen objects are created, they are also placed in the array.\nThe code in each of these component objects is similar, and they could be abstracted into classes (prototypes) that components are derived from, if this method seems important enough to do that.\nThe bank can be saved as a dictionary.\nDictionary entries can be dictionaries and arrays, and array entries can be dictionaries and arrays. The midi bank dictionary contains arrays which contain dictionaries which contain arrays. Arbitrary nesting of dictionaries and arrays is possible. Access and modification becomes complicated, which I’ll talk about in section 4.\nTo save a midi bank layout:\nJavascript objects can declare attributes: values that can be accessed like normal max objects. Attributes can be dictionaries. Attribute values can also have custom getters and setters, which means that the attribute value does not have be something actually stored. A getter can dynamically construct it when it is invoked, and a setter can do something other than save the given value.\nThe midi bank thus has an attribute « bank_dict » that, when queried, builds a dictionary from its components’ data. It writes an array of its tracks, calling each of its tracks to give it the required data for its given array index. It calls each track by requesting a dict attribute from the track representing its components. The track builds a dict in the same way, calling its effect components. This process continues until a recursively-built dictionary is completed, then the midi bank passes it to the caller which writes it as a json file.\nTo reload the midi bank, the opposite occurs: the attribute value setter builds the track list by creating each track and then sending it the corresponding track dict so that it can build itself.\nThe actual dict values are at no time saved.\n[EXAMPLE]\nThis can be applied to the entire architecture of a session, including all the players. It will be once we’ve worked out what all the players will be and how they will be arranged.\nBecause of the hierarchical arrangement of dictionaries, the midi bank can have its own set of presets that can be loaded and saved inside the preset of an entire session.\nTo load an entire session including the pattr presets, the architecture dictionary has to be loaded first, and then the preset file.\nBoth the model and the view contain these component objects. Communication between the view and model is in the rightmost wire. Building from these dicts in the model and the view treat the dict like a model, and the model and view become its views.\nCommunication between the control and model during construction must be handled carefully and I’m interested in how to do it better. Originally I thought it would be great to include the dict attributes in the pattr system. Then they could be controlled in the same way that the rest of the parameters are controlled. The problem is this. [SLIDE] Javascript operates on a different (low-priority) thread than Max objects. When it calls Max to creat an object (new default), it passes control to this thread and continues to the next javascript command—we don’t know when the max command will finish in relation to the javascript. As components in the view hierarchy are built, we can’t assume that their analogs in the model are built at the same time. Thus messages cannot be passed from one to the other. Thus we cannot count on the pattr system working when the hierarchies are constructed. It has to use a different system.\nCreating effects: to create a midi effect, several easy standards must be met: MIDI notes follow a given value (list of numbers) MIDI comes in the left inlet and out the left inlet A control/view and a model patch Communication btw control and model occur via pattr, so pattrs with the same name (possibly hierarchic) must exist in both patches Control and model patchers must be put in appropriately named subfolders of a folder titled by the effect name.\nIf you do this, the effect will show up in the effect list. This gives an easy, max-less way for developers to add their own effects.",
    "description": "Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs.",
    "tags": [],
    "title": "Dynamic Object Creation and Destruction",
    "uri": "/3_api/7_going_further/dynamic_object_creation_and_destruction.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Index of important abstractions",
    "uri": "/3_api/1_abstraction-references.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "Djazz needs no special installation. Download the djazz folder here. Open Max. Select Options from the menu bar at the top of the screen.\nSelect File Preferences from the dropdown menu that appears.\nIn the File Preferences window that appears, select “choose path.”\nIn the file browser menu that appears, select the “djazz” folder you have just downloaded. Djazz uses externals that are included in the Djazz folder. Thye do not require extra installation.",
    "description": "Djazz needs no special installation. Download the djazz folder here. Open Max.",
    "tags": [],
    "title": "Installation",
    "uri": "/1_manual/1_installation.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Description of Components in Model:\nMaster Control Master Clock - outputs a beat number when it receives a bang - increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped. - keeps track of tempo if tempo is manually input and fluctuates. This uses antescofo. - reads from song dict to get label - sends tempo, beat, and chord label, immediately in succession and in that order, to midi and audio generators. This order is important, so that the generators can calculate the correct information to play at the beginning of each beat.",
    "description": "Description of Components in Model:\nMaster Control Master Clock - outputs a beat number when it receives a bang - increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped.",
    "tags": [],
    "title": "main components",
    "uri": "/3_api/6_architecture/component_descriptions/master_control.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Main Components",
    "uri": "/3_api/1_abstraction-references/main_components.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Tools",
    "content": "",
    "description": "",
    "tags": [],
    "title": "make song file",
    "uri": "/3_api/1_abstraction-references/tools/make_song_file.html"
  },
  {
    "breadcrumb": "Manual \u003e Tools",
    "content": "Djazz uses a song file to play a song, whether you are plaing back scores or using live MIDI or audio. Where a score file contains the notes in each beat of the song, a song file contains all the metadata for each beat: its label, its position in the song, and what chapter of the song it is in. Djazz uses labels that represent chords. In this way, a song file is like a chord chart.\nTo create a song file for a new song you want to play with Djazz, the make_song_file Max patcher is provided for you in the tools folder.\nSONG NAME Enter the name of the given song; this will be displayed when the song file is loaded, and will also appear in the song dropdown menu if it is placed in the djazz_user/scores/ folder\nBEATS Enter here the total number of beats in the song.\nTEMPO Enter the song tempo. This tempo will be loaded into Djazz’s metronome when the song is loaded, and is also the tempo that will be expected if manual tap entry is performed\nTIME SIGNATURE Enter the number of beats per measure, i.e. the top number in the time signature. The duration of the beats, i.e. the bottom number in the time signature (4 for quarter note, 8 for eighth note, etc.) does not matter; do not include it.\nCHAPTER START BARS If the song is divided into chapters, enter here the bar (i.e. measure) numbers at which the chapters begin. For instance, if a song contains four chapters of 16, 16, 32, and 64 bars, in that order, the chapter start bars will be 1, 17, 33, and 65. Enter these numbers without commas\nPutting all this together, here’s what you would enter for a song in 4/4 time, with chapters of duration as above: 16, 16, 32, and 32 bars. The number of beats is the total number of bars multiplied by the time signature; in this case (16 + 16 + 32 + 64) * 4 = 128 * 4 = 516\nBEAT LABELS Beat labels are input in a text-based format. They can be entered directly into the tool’s window, or cut and pasted from a text editor.\nA chord label has two parts, the root and the quality. The way of entering labels is as follows:\n(\u003c chord root \u003e \u003c chord quality \u003e \u003c number of consecutive beats \u003e)\n\u003c chord root \u003e can be the symbol C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, or B.\n\u003c chord quality \u003e can be any symbol that does not contain an underscore (\"_\") or a semicolon(\";\").\nThe improvisation algorithm functions in part by matching these symbols with the symbols on the beats in score files, so if you want it to work correctly, keep the format of these symbols the same. For instance, the preloaded songs in Djazz use the following symbols:\nmaj7, min7, 7, dim7, maj6, min6\nBut you can define any symbols you want:\ndom7#9b9#11, maj6add9, min6withanextraweirdnoteatthetop, etc.\n\u003c number of consecutive beats \u003e is how many beats this particular label is repeated.\nSo for instance, the chord sequence\nAmaj7 Amaj7 Dmin7 Amaj7\nAmaj7 Dmin7 E7 Amaj7\nwould be entered as\nIt could also be entered as\nif this is easier to read.\nIndentation and carriage returns are ignored by the tool.\nHOW TO MAKE A NEW SONG FILE FOR DJAZZ.\nA song file is not a score file. It does not contain any notes to play. It contains the navigation information in the song: chapters, bars, beats chord labels, and tempo, in order to make the grid and send the master clock and factor oracle the appropriate data.\nHere is how to make one. There are seven (7) steps listed below.\nOpen the patcher “djazz.make_song_file.maxpat” from the folder “patchers/data_conversion_tools” in the current djazz folder.\nIn the appropriate fields, put in the song name, beat count, tempo, time signature, and the starting bars for each chapter. This data is exactly the same, and in the same order, as the data listed for the songs in the old Djazz version, EXCEPT FOR ONE DIFFERENCE: don’t use quotation marks when you put in the start bars. Only put in the list of numbers (and don’t use commas).\nPut the grid data in the “grid data” box. Put it in (or copy and paste it) in LISP-style notation, where each entry is a list: ( chord-root chord-type-symbol number-of-measures ) Do not use outer parentheses for the whole list of lists. Do not include any comments or semi-colons. Spacing and indentation is not important.\nPress the “save” button.\nSave the song file in the folder of the same song name that contains the subfolders “new” and “new2.” The file name and the song folder name should be exactly the same.\n￼\nThat’s all. If the folder you put the new song file in has scores in its “new” and “new2” subfolders, this song can now be played as usual by Djazz.\nPress the “clear” button to clear the data.",
    "description": "Djazz uses a song file to play a song, whether you are plaing back scores or using live MIDI or audio.",
    "tags": [],
    "title": "Making a Song File",
    "uri": "/1_manual/6_tools/make_song_file.html"
  },
  {
    "breadcrumb": "API \u003e Notes on databases in Max",
    "content": "Dicts, like colls, are persistent and global, so use them only as read-only. Don’t use them as variables to pass around or for keeping track of state. Pattrs basically do this anyway so just use them to keep track of state snapshots.\nYou can’t put max objects in a dictionary. But you can put them in a javascript array. Max patchers basically are dictionaries, though, for objects in them with scripting names (varnames). They must both use hash tables to access their contents.",
    "description": "Dicts, like colls, are persistent and global, so use them only as read-only.",
    "tags": [],
    "title": "Notes on dicts",
    "uri": "/3_api/8_notes_on_rewriting_djazz/thoughts_on_dicts.html"
  },
  {
    "breadcrumb": "API \u003e External controls and views",
    "content": "Attaching External Devices Parameters Parameter Listeners External devices with views as well as controls Launchpads Mapping editors Dictionary readers and writers in javascript\n3. Parameters and Listeners\nThe view/control exposes the variables that can be changed by the user. It also exposes the ways in which these controls can be changed: as bools, ints, floats, bounded, etc.\nTo attach a device or remote controller to the system, we can use the parameter system, which is independent from the pattr system but whose functionality overlaps with it in a useful way.\nEach pattr can be saved as a parameter. In addition, each control surface object can be saved as a parameter. When objects containing parameters are created (like midi tracks), new parameters are created.\nTwo javascript objects then allow for device connection. The ParameterInfoProvider lists all the parameters, and alerts us when parameters are added or removed.\nA javascript object contains a parameterInfoProvider and an array of ParameterListeners. Each time a parameter is added, a parameter listener is created for it.\nThis javascript object centralises parameter communication. When a parameter is changed, it sends out its name and value. It receives values too. Essentially it’s a replica of the pattrstorage object. Why use it? Because the parameters are mapped to our control surface, not the model. We can take into account the control object logic; several buttons that change the same pattr can be saved as different parameters. Then we have more than one typed interface to the variable: we can control it as a toggle, or an int. For instance, the loop variable can be controlled by buttons with a launchpad, and by the number box with the ring. All you need to do is expose the desired control type and set is as a parameter. Again, the underlying model is unaffected.\nParameter listener and maxobjlisteners are hard to deal with because you can’t delete them.",
    "description": "Attaching External Devices Parameters Parameter Listeners External devices with views as well as controls Launchpads Mapping editors Dictionary readers and writers in javascript",
    "tags": [],
    "title": "Parameters",
    "uri": "/3_api/4_external_controls_and_views/1_parameters.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Audio Record",
    "uri": "/3_api/1_abstraction-references/components/audio_record.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.\nDjazz plays music in two ways: by selecting sections from scores, and by calculating improvisations using the factor oracle algorithm. The factor oracle algorithm can be modified with pattern-matching methods. The input to the factor oracle come from scores and real-time input, either audio or MIDI, and is output as audio or MIDI. It uses Antescofo to generate notes both from scores and generated as improvisations in tempo.\nDjazz improvises on songs using template files, which are lists of beats with labels representing positions in the songs. Notes are in different files: scores and audio tags in the databases used by the factor oracle.\nThe song templates pass the label to the factor oracle know given time. For songs whose formal structure includes verses or sections, this larger structure is also included in the template. It can also improvise over a “free” structure by using a trivial template, just a short list of beats that loops.\nDjazz is played by inputting a tap—manually, from a built-in metronome, or from another application. The tap triggers a beat, which triggers notes to be output from the factor oracle or the score, which triggers note data to be output from antescofo, which triggers sound to be output by the audio or midi outputs. [SLIDE]\nYou can see this control flow. The tap comes in on the left and comes out as sound from the midi bank on the right. The intermediate translations from tap to beat occur in the objects along the way. The architecture: several players which function independently. There is a master control for synchronising timing and for broadcasting global commands.",
    "description": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.",
    "tags": [],
    "title": "control flow",
    "uri": "/3_api/6_architecture/_d/_d_control_flow.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.\nDjazz plays music in two ways: by selecting sections from scores, and by calculating improvisations using the factor oracle algorithm. The factor oracle algorithm can be modified with pattern-matching methods. The input to the factor oracle come from scores and real-time input, either audio or MIDI, and is output as audio or MIDI. It uses Antescofo to generate notes both from scores and generated as improvisations in tempo.\nDjazz improvises on songs using template files, which are lists of beats with labels representing positions in the songs. Notes are in different files: scores and audio tags in the databases used by the factor oracle.\nThe song templates pass the label to the factor oracle know given time. For songs whose formal structure includes verses or sections, this larger structure is also included in the template. It can also improvise over a “free” structure by using a trivial template, just a short list of beats that loops.\nDjazz is played by inputting a tap—manually, from a built-in metronome, or from another application. The tap triggers a beat, which triggers notes to be output from the factor oracle or the score, which triggers note data to be output from antescofo, which triggers sound to be output by the audio or midi outputs. [SLIDE]\nYou can see this control flow. The tap comes in on the left and comes out as sound from the midi bank on the right. The intermediate translations from tap to beat occur in the objects along the way. The architecture: several players which function independently. There is a master control for synchronising timing and for broadcasting global commands.",
    "description": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.",
    "tags": [],
    "title": "control flow",
    "uri": "/3_api/6_architecture/control_flow.html"
  },
  {
    "breadcrumb": "API \u003e External controls and views",
    "content": " Dictionary readers and writers Dictionaries are used in different ways, for representing songs, architecture, and as another example for the launchpad, to keep track of how buttons are mapped to parameters and how parameters are mapped to lights. For this, several different types of dictionaries were required:\nDICTS AND ARRAYS\nTwo device-specific dicts One mapping dict Two runtime parameter dicts Launchpads have both view and control capabilities; that is, they can send input to Djazz (control) as well as show output (view).\nThe two device-specific dicts are imported from JSON files; thus are two device-specific files:\nthe device file the grid file These must be written in order to connect a new device with view and control capabilities, like a Launchpad, to Djazz.\nThe device file contains device-specific data:\nthe device name (used for routing messages in Djazz) any metadata about the device itself the number of midi controls the number of cc controls the MIDI/CC codes for each color. Colors are represented by two variables, their hue (the name of the color itself) and their value (bright or dim). the MIDI/CC codes for each button’s illumination behavior. For the Launchpad Pro MK3, buttons can glow statically, they can flash, or they can pulse. For the Launchpad Pro MK3, the data file is this:\n{ \"device\" : \"Launchpad Mini\" , \"manual\" : \"https://leemans.ch/latex/doc_launchpad-programmers-reference.pdf\" , \"midi_count\" : 120 , \"cc_count\" : 0 , \"colors\" : { \"none\" : { \"bright\" : 0 , \"dim\" : 0 } , \"red\" : { \"dim\" : 1 , \"bright\" : 3 } , \"orange\" : { \"dim\" : 17 , \"bright\" : 51 } , \"yellow\" : { \"dim\" : 41 , \"bright\" : 51 } , \"green\" : { \"dim\" : 16 , \"bright\" : 48 } , \"brown\" : { \"dim\" : 38 , \"bright\" : 35 } } , \"behaviors\" : { \"static\" : 12 , \"flashing\" : 8 } }The grid file describes the way a song grid can be represented on the Launchpad. It contains the following information:\nthe device name\nthe cell numbers that represent song chapters. These are listed in order of the chapters they represent. In the following code example, then, “cc 89” represents chapter 1, “cc 79” represents chapter 2, etc.\nthe colors that represent the state of a chapter in the grid. A grid cell (chapter or bar) is in one of the following states:\nplaying: the cell is currently being played waiting: the cell has been selected to be played, and will start playing as soon as the next beat occurs off: neither waiting or playing unused: the song does not contain the chapter or bar associated with this cell The cell numbers that represent song bars (listed in order like chapter numbers)\nthe colors that represent the state of a bar in the grid (same as chapter states).\noptional metadata about the device, such as the links to manufacturer’s information\nFor the Launchpad Pro MK3, the grid file is this:\n{ \"device\" : \"Launchpad Pro MK3\" , \"manual\" : \"https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/LPP3_prog_ref_guide_200415.pdf\" , \"grid\" : { \"chapter\" : { \"cells\" : [ \"cc 89\", \"cc 79\", \"cc 69\", \"cc 59\", \"cc 49\", \"cc 39\", \"cc 29\", \"cc 19\" ] , \"colors\" : { \"unused\" : \"none\", \"off\" : \"green dim static\", \"waiting\" : \"green dim static\", \"playing\" : \"green bright static\" } } , \"bar\" : { \"cells\" : [ \"midi 81\", \"midi 82\", \"midi 83\", \"midi 84\", \"midi 85\", \"midi 86\", \"midi 87\", \"midi 88\", \"midi 71\", \"midi 72\", \"midi 73\", \"midi 74\", \"midi 75\", \"midi 76\", \"midi 77\", \"midi 78\", \"midi 61\", \"midi 62\", \"midi 63\", \"midi 64\", \"midi 65\", \"midi 66\", \"midi 67\", \"midi 68\", \"midi 51\", \"midi 52\", \"midi 53\", \"midi 54\", \"midi 55\", \"midi 56\", \"midi 57\", \"midi 58\" ] , \"colors\" : { \"unused\" : \"none\", \"off\" : \"brown dim static\", \"waiting\" : \"red dim static\", \"playing\" : \"red bright static\" } } } }A mapping file is a file that the user creates, using the editing tool in Djazz, that contains the mappings between the Launchpad cells and the parameters she wants to control. It also imports into it the grid.\nOne for the the system to read to map launchpad input to parameters, (« CTRL »)\nAnd one for the system to read mapping parameters to lights. (« VIEW »)\nA device-specific color code file\nThe color-code file is imported into the database accessor files that are common to Launchpads.\nThe database accessor files exist to translate between the formats of the various dicts.\nThe structure for each of these dicts can be done in different ways. Some criteria exist:\nThe user-created dict must be easy to create, either by editing the text or with a max object\nThe program-read dicts must be efficient, easily read by the program.\nThese two criteria are different and ask for different structures. Also, there is not a given good structure for any of these dicts, and we might want to change them later. We might even have to, as new launchpads, and new devices, use different formats.\nSo there’s not a general method for structuring these dicts. But we want something general so that we don’t have to rewrite a new patch and dict-accessors for each new launchpad.\nTo solve this, we create dict-readers and dict-writers, two types of javascript objects. Each one exports a set of methods that access data or modify data. The implementation of the methods are hidden to the user. Each one is specific to the context it acts in. The exported methods have the same names, but the implementation is different depending on the structure of the dict it reads or writes to. Thus, we can use a single javascript object to read the desired dictionaries and then translate them into the format the system needs. Each reader and writer is imported into the module using a require statement. If we change or add a new dict format, we write a new reader—which only involves rewriting the implementation of the exported methods—and replace it in the appropriate require field. These can also be jsarguments. This way, we have translators: objects that take a reader and a writer.\nDictionaries in Javascript and pure Max Gotchas",
    "description": "Dictionary readers and writers Dictionaries are used in different ways, for representing songs, architecture, and as another example for the launchpad, to keep track of how buttons are mapped to parameters and how parameters are mapped to lights.",
    "tags": [],
    "title": "Dicts",
    "uri": "/3_api/4_external_controls_and_views/2_dicts.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "externals",
    "uri": "/3_api/2_externals.html"
  },
  {
    "breadcrumb": "API \u003e Going further",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Factor Oracle Labeling",
    "uri": "/3_api/7_going_further/factor_oracle_creation.html"
  },
  {
    "breadcrumb": "Manual",
    "content": " 1. MIDI/AUDIO INTERFACE SELECTOR Clicking on the button labeled “MIDI” or “Audio” will open the MIDI or Audio interface window, respectively. You can also use the key commands “m” to open/close the MIDI window or “a” to open/close the audio window.\n2. BEAT INPUT Input Selector Djazz plays a beat each time it receives a message (a “tap,” or “click”), if it is engaged (how to engage Djazz will be explaind below). When not engaged, it will not play when a beat message is received. When this is the case, you can click on measures or chapters (“cells” of the grid) in the song grid without triggering playback. Once engaged, djazz will begin playing on the next beat after a cell has been clicked on.\nThe cells of the grid change color depending on whether Djazz is engaged and whether a cell is currently playing or not. The colors represent the following:\nLight gray: not the current measure/chapter of the song Dark gray: the current measure measure/chapter of the song, but Djazz is not engaged Blue: the current measure measure/chapter of the song, but not playing Orange: the current measure measure/chapter of the song, and playing\nThere are three ways to send Djazz a beat message; you select one from the dropdown menu: “manual,” “metronome,” or “remote.” Selecting from the dropdown menu will change the controls on the left side of this box. When one option is selected, the other two are not responsive.\nMetronome The button marked with a triangle turns the metronome on and off. When you turn this button on and then select a grid cell, the metronome will trigger a new beat each time it clicks, beginning with the beat represented by the grid cell. No beat will be triggered until a grid cell has been selected. The number selector sets the metronome tempo. This is automatically set when a new song is loaded, but you can change it. This flashes each time the metronome sends a beat. Manual The triangle button engages Djazz. Clicking on the circle button sends Djazz a beat message. You can also press the space bar to send a manual click. Remote This will send a beat message to Djazz every time a MIDI note on message is received (i.e., with a non-zero velocity) on any channel.\nThe dropdown menu selects the MIDI input port for the click. The triangle button engages Djazz. This flashes each time a beat is received. Click sound selector The right-hand side of the window lets you change the sound and output port of the click.\nChanges the pitch of the click. The number indicates the MIDI value of the pitch. The channel of the click. The volume of the click Mutes/unmutes the click The output port of the click. 3. Song selector To load a song grid, select a song using one of these controls. Songs are loaded by selecting folders, not individual files. Each folder contains various files pertaining to the song like scores and JSON metadata files.\nDrag and drop a song folder here. Browse for a song folder. To select a song, click on its folder. Clear the current song. Select a preloaded song from the dropdown menu. 4. SONG GRID When a song is loaded, its grid will appear.\nChapter Select At the top are listed the “chapters” of the song–different sections like verses, choruses, and bridges. Clicking on a chapter will take you to the first measure of the chapter. If Djazz is engaged, it will start playing from here when the next beat is received.\nBar Select When a chapter is selected, the bars in the chapter are shown below it. Each bar contains the number of beats given by the song’s time signature. Clicking on a bar will take you to the first beat in the bar. If Djazz is engaged, it will start playing from here when the next beat is received.\nRewind-to-beginning Button Click to go to the beginning (first bar of first chapter) of the song. When the “lock” button next to the rewind button is on, Djazz will rewind to the beginning of the song every time it is disengaged (i.e., when the metronome is turned off, or when the engage button is unselected in manual or remote beat input.)\nLoop-Chapter/Song Button When selected, Djazz will loop the current chapter or the whole song, depending on the choice selected to the right of the button. That is, it will start from the beginning immediately when the end of the current chapter or song is reached\n3. GLOBAL AUDIO CONTROLS Audio On Clicking on either the microphone-icon button or the loudspeaker-icon button will turn the audio on.\nAudio In Level (Microphone) Controls the level of the audio input. The button labeled “M” below the microphone-icon button mutes audio input.\nAudio Record Level Controls the recorded volume level of the audio input.\nAudio Out (Speakers) Controls the level of the global audio output. The button labeled “M” below the loudspeaker-icon button mutes audio output.\n5. PLAYBACK DATA VIEW Beats in song When a song is loaded, this shows the first and last beat of the song.\nSection is looped Beats in section (chapter) When a song is loaded, this shows the first and last beat of the current chapter.\nTempo This shows the current playback tempo. When the metronome is playing, this will be the same as (sometimes fluctuating extremely slightly from) the metronome tempo. When a manual tap\nCurrent beat Current beat label LOADING AND SAVING Open a new song Open a saved song Save a song Make Djazz song files Djazz file Score files TAP INPUT Manual expects the starting tempo\nMetronome From another machine ",
    "description": "1. MIDI/AUDIO INTERFACE SELECTOR Clicking on the button labeled “MIDI” or “Audio” will open the MIDI or Audio interface window, respectively.",
    "tags": [],
    "title": "Main Window",
    "uri": "/1_manual/2_main_window.html"
  },
  {
    "breadcrumb": "Manual \u003e Tools",
    "content": "Score files contain preloaded notes, formatted so that Djazz can play them and use them to improvise. Djazz comes preloaded with many score files of jazz standards and songs from Madagascar. You can also convert your own MIDI files into Djazz scores with the make_score_file Max patcher, located in the tools folder.\nLoad a song file If you haven’t yet made a song file for this song, make one using the make_song_file tool. Import the song file by pressing the LOAD button. If the file is loaded properly, the light on the left side will illuminate.\nLoad a click track A click track is needed to divide the notes in the MIDI tracks into the proper beats. A click track must be imported from a MIDI file in which eat beat is designated by a single MIDI event at pitch C1 and non-zero velocity The click track be exported at the same tempo as the notes. click track image\nImport the MIDI file by pressing the “IMPORT MIDI” button and selecting the file from the dialog that opens. Once imported, you can save this file to a JSON format using the “SAVE JSON” button. If the click track file is loaded properly, the light on the left side will illuminate.\nIf both the song file and click track have loaded successfully, the regions for loading MIDI tracks will be activated. You can load either a single MIDI track, or multiple tracks at once. If you import multiple tracks, the resulting JSON file will represent a Djazz score, which you will need to put into a folder in order to play it in Djazz (see below).\nOnce you have imported, either in the single or multiple MIDI track format, save your import by pressing the SAVE button. The resulting file will be a JSON file.\nTo play a single MIDI track, see these instructions.\nTo play multiple MIDI tracks, you need to put your saved file in an appropriately named folder.\nMAKING SCORE FOLDERS\nMultiple MIDI tracks saved together are called a score in Djazz. Score files need to be organized in a certain way for Djazz to read them.\nScore Folder Song File New Score x Score y … New2 Score w Score z …",
    "description": "Score files contain preloaded notes, formatted so that Djazz can play them and use them to improvise.",
    "tags": [],
    "title": "Making a Score File",
    "uri": "/1_manual/6_tools/make_score_file.html"
  },
  {
    "breadcrumb": "API \u003e externals",
    "content": "",
    "description": "",
    "tags": [],
    "title": "midifile",
    "uri": "/3_api/2_externals/midifile.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Other Components",
    "uri": "/3_api/1_abstraction-references/components.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "patchers/factor_oracle_player/factor_oracle_player.maxpat\nThe “factor oracle player” which takes labels one by one, which can be of any form (but in the current program, it’s a dictionary with two entries: the chord root and the chord label), and uses a factor oracle to produce a beat that matches the label. It takes two parameters: max-continuity and pitch-transposition. When the maximum continuity is reached, it takes a suffix link and searches for a matching label. If no matching label is found, it chooses a random state.\nWhen the “NEW” button is pressed, it reads the current antescofo partition from memory (converting it into a Max dict object), then runs the factor oracle player to generate a different succession of rhythms for each requested channel, mapping these rhythms to different (unused) channels, and combining everything again into a Max dict.\nThe factor oracle player works the same way for audio improvisers, but it doesn’t write any scores. It sends data to supervp objects to play from the audio buffer (recorded or loaded):\npatchers/improvise_oracles/djazz_audio_oracle_players.maxpat",
    "description": "patchers/factor_oracle_player/factor_oracle_player.maxpat\nThe “factor oracle player” which takes labels one by one, which can be of any form (but in the current program, it’s a dictionary with two entries: the chord root and the chord label), and uses a factor oracle to produce a beat that matches the label.",
    "tags": [],
    "title": "The Factor Oracle Player",
    "uri": "/3_api/5_improvisation/2_factor_oracle_player.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": " The “factor oracle player” which takes labels one by one, which can be of any form (but in the current program, it’s a dictionary with two entries: the chord root and the chord label), and uses a factor oracle to produce a beat that matches the label. It works in the same way as the LISP version: you define the maximum continuity and it tries to match it. When the maximum continuity is reached, it takes a suffix link and searches for a matching label. If no matching label is found, it chooses a random state: patchers/factor_oracle_player/factor_oracle_player.maxpat\nThe implementation of the factorial oracle player is almost complete. As for writing new improvised antescofo partitions from old ones, the unfinished patch is here: patchers/improvise_antescofo/djazz.improvise_antescofo.maxpat\nWhen the “NEW” button is pressed, it reads the current antescofo partition from memory (converting it into a Max dict object) (this is done with Javascript), then runs the factor oracle player to generate a different succession of rhythms for each requested channel, mapping these rhythms to different (unused) channels, and combining everything again into a Max dict. The content of the original channels is not modified, as you requested; only the new content of the new channels is added.\nWhat is NOT done is to write the new Max dict into an antescofo partition. This has to be done in Javascript, as the note times have to be sorted and the new delta times calculated, which would be difficult to do in Max. It won’t take long to finish, I just haven’t done it yet; I can do it next Monday.\nThe factor oracle player works the same way for audio improvisers, but it doesn’t write any scores (so no Javascript here): it simply sends data to supervp objects to play from the audio buffer (recorded or loaded): patchers/improvise_oracles/djazz_audio_oracle_players.maxpat",
    "description": "The “factor oracle player” which takes labels one by one, which can be of any form (but in the current program, it’s a dictionary with two entries: the chord root and the chord label), and uses a factor oracle to produce a beat that matches the label.",
    "tags": [],
    "title": "The Factor Oracle Player",
    "uri": "/3_api/5_improvisation/_d_improv/_d_2_factor_oracle_player.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Beat Clock",
    "uri": "/3_api/1_abstraction-references/components/beat_clock.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz view",
    "uri": "/3_api/1_abstraction-references/main_components/djazz_view.html"
  },
  {
    "breadcrumb": "API",
    "content": "File formats used json song file score/track files for MIDI audio: wav and json\nFolders for consolidating files that go together Saving and loading folders (gotchas)\nJson files are imported into dictionaries",
    "description": "File formats used json song file score/track files for MIDI audio: wav and json",
    "tags": [],
    "title": "File formats used",
    "uri": "/3_api/3_file_formats_used.html"
  },
  {
    "breadcrumb": "API \u003e Going further",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Listeners and Real-time Analyzers",
    "uri": "/3_api/7_going_further/listeners-and-analyzers.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "MIDI In View When clicked and illuminated, the record button arms the buffer for recording. It does not start recording until the first beat that advances the grid.\nRecording MIDI Sending MIDI output to another machine Scores View Score Player/Loader Window Score Loader Pitch Transposition Changes the pitch of the MIDI output Octave Transposition Changes the octave of the MIDI output Speed Changes the speed of the MIDI output Loop Loops the previous n beats of the MIDI output “Jam” (Improvise) “Jam” Button Turns the improviser on. When this is on, the MIDI track(s) is/are not played back straight, but beats are chosen based on the harmony and the next two controls, continuity and potch range:\nContinuity This determines the length in beats that sections of the score will be played back in sequence. Once this many beats has been played in sequence, the improviser will jump to a new section of the score. The maximum coninuity is 255 beats. When the “MAX” button is on, this will be the continuity–i.e., the score will be played back without improvising, i.e. jumping around through it (given that the score is \u003c 255 beats long. If you’re using this with a score that’s longer than 255 beats and you just want to play the score straight, there’s no reason to be even using the improviser.)\nThe improviser tries to match beats that have the same harmony as the current beat. By adjusting the pitch range, it will look for beats with a similar chord type but with roots above or below the current chord root. A pitch range of n will look for chords between (and including) n semitones below and n semitones above the current chord root. Set to zero, it will match the chord root exactly. Beats with different roots will be transposed to the proper harmony.\nMIDI Out Solo Button When illuminated, this will “solo” the MIDI track. If a single track is soloed, it is the only track that you will hear. If several MIDI tracks are soloed, only these tracks will be audible. If no tracks are soloed, all the tracks will be audible.\nActive Button If not illuminated, the MIDI track will not be audible, and its volume in the volume meter will be gray. When illuminated, the MIDI track will be audible.\nVolume Dial Changes the volume of the MIDI track. If you click just above the dial, the dial will reset to its default value of 80.\nVolume Meter Shows the level of the MIDI output. When a track is inactive, this will be grey. When active, the output will be green, orange, and red, depending on the volume level.\nChannel Select Allows the user to change the MIDI channel of track. Options are 1 through 16.\nPort Select Allows the user to select the output port of the MIDI track. These are usually Max’s internal MIDI playback (which will be called something like “DAC synth”), and outputs to other applications (called “from Max 1” and “from Max 2”).\nGlobal Port Select This changes the output port of all the MIDI channels.",
    "description": "MIDI In View When clicked and illuminated, the record button arms the buffer for recording.",
    "tags": [],
    "title": "MIDI Window",
    "uri": "/1_manual/3_midi_window.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "1. Architecture Model/Control/View Control/View MVC:\nDjazz uses the Model-View-Control design pattern.\nThe model consists of the objects that do the processing. At the top level, there are various players and the master control described in the previous section.\nThe model is controlled entirely by passing named pattrs in the message format . These parameters are received in the leftmost inlet.\nThe control is\nThe view is",
    "description": "1. Architecture Model/Control/View Control/View MVC:\nDjazz uses the Model-View-Control design pattern.",
    "tags": [],
    "title": "Overview of MVVCC (Model-View-View Controller-View) Architecture",
    "uri": "/3_api/6_architecture/_d/_d_overview_of_mvcvc.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "1. Architecture Model/Control/View Control/View MVC:\nDjazz uses the Model-View-Control design pattern.\nThe model consists of the objects that do the processing. At the top level, there are various players and the master control described in the previous section.\nThe model is controlled entirely by passing named pattrs in the message format . These parameters are received in the leftmost inlet.\nThe control is\nThe view is",
    "description": "1. Architecture Model/Control/View Control/View MVC:\nDjazz uses the Model-View-Control design pattern.",
    "tags": [],
    "title": "Overview of MVVCC (Model-View-View Controller-View) Architecture",
    "uri": "/3_api/6_architecture/overview_of_mvcv.html"
  },
  {
    "breadcrumb": "API \u003e externals",
    "content": " SuperVP is used to play audio beats ",
    "description": " SuperVP is used to play audio beats ",
    "tags": [],
    "title": "supervp",
    "uri": "/3_api/2_externals/supervp.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Syncopation",
    "uri": "/3_api/5_improvisation/_d_improv/_d_3_syncopation.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tools",
    "uri": "/3_api/1_abstraction-references/tools.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Analyzer",
    "uri": "/3_api/5_improvisation/_d_improv/_d_4_analyzer.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "7. AUDIO UI Audio Live Input – see MIDI Live Input Recording – see MIDI Live Input Saving a file – see MIDI Live Input Loading a file – see MIDI Live Input Note: to save and load an audio file, you actually save and load a folder. Just name the folder in the dialog window, and the folder will be created and appropriately named files (.wav and .json) will be saved in the folder. For loading, choose the folder from the dialog. Audio Track Playback \u0026 Improvising – see Midi Track Looping sections/Repetitions – see MIDI Live Input Audio Input Volume dial and reset click Mute Audio Out Audio Out Track Volume dial and reset click Solo Mute Volume meter Il y a un patch pour extraire les données de la grille des partitions audio textuelles comme celles que vous avez envoyées vers le nouveau format : patchers/data_file_makers/text_score_to_audio_grid_data.maxpat",
    "description": "7. AUDIO UI Audio Live Input – see MIDI Live Input Recording – see MIDI Live Input Saving a file – see MIDI Live Input Loading a file – see MIDI Live Input Note: to save and load an audio file, you actually save and load a folder.",
    "tags": [],
    "title": "Audio Window",
    "uri": "/1_manual/4_audio_window.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Beat Generator",
    "uri": "/3_api/1_abstraction-references/components/beat_generator.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz view control",
    "uri": "/3_api/1_abstraction-references/main_components/djazz_view_control.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "External controls and views",
    "uri": "/3_api/4_external_controls_and_views.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Pattr translation in control and view control\nInterface - not much to say. Just graphical controls. Sends and receives pattrs to and from control. Infinite loop is avoided via pattrstorage output mode set to 5.\nThe CONTROL PATTRS and DATA PATTRS (dicts) are saved. On loading, the data pattrs must be fully loaded first; their priorities are set to 1. The control pattrs are independent so their priorities are all 0.\nEvery parameter is stored in a pattr object.\nAs an example, here is a midi player object, which contains, among other components, a beat clock. The beat clock itself contains several components. Here we see one of them, « loop_section » and the pattr objects it contains. [SLIDE]\nThe pattrhub object invokes them, so a message “step 2” will set the step pattr object in beat_clock to 2.\nPattrs act hierarchically. The beat clock is named “beat_clock” [SLIDE], so the step variable can be invoked by sending the beat clock the message “beat_clock::step 2.” This double-colon format continues as the pattr object is nested in deeper levels of a hierarchy.\nThe control consists of bpatchers. No bpatchers are in the model. These handle all the user interface logic like buttons and file selection. To change a parameter in the model, a pattr object must exist in the view with the same name as the corresponding one in the model. These names don’t conflict because they are in different sub patchers.\nA pattrstorage object in the control keeps track of pattern changes. When the outputmode attribute is non-zero, it will send the names and values of changed parameters out its outlet. Hence, to communicate parameter changes to the model, the pattrstorage output is sent out the control and into a pattrthub object at the top level of the model, which then broadcasts the changes to the proper places.\nNote: with this method, the interior pattrhub objects end up not being used at all, but it’s still good to leave them in so that these objects can be reused and are not dependent on being called this way.\nThe hierarchical nature of the model, though, means that the parameter names sent from the control must have the same hierarchical structure as those in the model. Thus to control the “midi_player_1::beat_clock::loop_length” parameter, there must be a control bpatcher called “midi_player_1” that contains a bpatcher “beat_clock” that contains a pattr “loop_length.”\nFor smaller systems, this could be a good method: the control and the model are parallel hierarchies. There are three problems with this method, though. The separation of model and control is supposed to give you the freedom to design the control without worrying about how things are being processed inside the model.\nThe control architecture is completely linked to the model architecture, which becomes very constraining, especially as the control logic in a complicated system probably does not reflect the way things are processed.\nYou don’t necessarily want to control all the pattrs in the model. Some you might find unnecessary. This is not a big problem, but there is another related one:\nSome pattrs in the model are not actually independent of each other at runtime. Objects were created independently, but their functions in the system are dependent on each other or other objects\nIt’s useful to design objects by thinking of their function independently of other objects, even though in the system they will not be independent.\nFor example:\nThere is an object that outputs a given number of bangs at a given tempo: it has two pattrs, “tempo” and “count”: the number of bangs to output.\nThere is another object that changes the system tempo.\nThe tempo object can be used to adjust the tempo by itself. But it is also used to control a parameter called “speed.” Speed makes the musical output play twice as fast (double time), or in triplets, etc. Changing the speed to two means both doubling the tempo and setting the number of bangs to two.\nThus the mapping from control pattrs to model pattrs is not one-to-one. We can imagine more complicated networks of dependencies among model parameters that we don’t want to reflect in the control.\nIt’s useful to design these two objects separately because they can then be tested and maybe reused later. We end up with a model that is “feature-rich,” and the job is now to decide which features we want to use, and how they will be reflected in the control.\nNote: In terms of domain-driven design, it’s important not to spend too much time building objects that do lots of things that we may not ultimately care about using. We’re not building a library, we’re building an application. On the other hand, building separate small objects that handle specific independent functions is a useful way to make building blocks for our application. So there’s a trade-off: designing for the application with an eye for the kind of independent and reusable objects that will make up a library.\nTo address these three problems, Djazz uses the following method:\nFor each important object that is made up of smaller components containing pattrs, like the “midi player,” there is a parameter bank. [SLIDE] This bank consists only of the surface pattrs that the control will call.\nThe midi player and the parameter bank are wrapped in a larger object, and parameters from the bank are passed to the midi player through a translator object.\nThis translator handles the three problems above. It translates the surface parameters to their corresponding hierarchically named pattrs, which is very easy. In this object, too, are placed the objects that translate control variables into dependent model variables, like f(speed)—\u003e[bang_count, tempo]. Finally, unused variables simply aren’t called. But to be absolutely sure that uncalled variables don’t give us trouble, by storing state that have forgotten about, or by accidentally being called, due to sharing names accidentally with a control variable, we can turn off their visibility to the pattrstorage system, which means they can never be called. There is a javascript object I wrote which will turn off all the pattrs in an object. The first argument tells it what the visibility is, the second weather to recursively change the visibility in sub patchers. [EXAMPLE]\nNow, in the control bpatcher, there is a similar parameter bank. Now the architectures of the control and the model are separate, and we are free to design the control as we want. As long as our controls send a message to the parameter bank with the right name, it will be sent to the model. [SLIDE] Now we can set up the controls as we like, and all the control logic—button operation, etc.—is completely independent of anything that happens in the model, and vice versa. Because the pattrstorage object is inside the view, the namespace “view” is not included in parameter names.\nThe model outputs midi and audio, but it also outputs pattrs to any view that wants to receive them. It does this the same way as the control: a pattrstorage object is at the top level of the model patcher, and when a pattr value is updated, it outputs the pattr name and value. There are two types of pattrs that the model outputs: those that are specifically for a view, and the parameters that were sent from the control. [SLIDE] Because the control is the view, this flow of pattrs becomes a loop. [SLIDE] The control/view pattrstorage sends values to the model’s pattrhub, and the model pattrstorage send values to the control/view’s pattrhub\nTo avoid an infinite loop, we make use the pattrstorage’s outputmode attribute.\nIn the model, the output mode is 2: any changed values are sent out. But in the view, the output mode is 6: values that are changed by objects in the pattr system are not sent out. That is, only values that are changed by user interaction are sent out. Thus the values received by pattrhub are set but not passed on. The loop is broken. [SLIDE]\nThe control flow is clear All of the state is centralised in the parameter banks The state can be read in in real time by the client windows (easy to debug) The state can be saved as preset files and reloaded.",
    "description": "Pattr translation in control and view control\nInterface - not much to say.",
    "tags": [],
    "title": "Pattr usage",
    "uri": "/3_api/6_architecture/_d/_d_pattr_usage.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Pattr translation in control and view control\nInterface - not much to say. Just graphical controls. Sends and receives pattrs to and from control. Infinite loop is avoided via pattrstorage output mode set to 5.\nThe CONTROL PATTRS and DATA PATTRS (dicts) are saved. On loading, the data pattrs must be fully loaded first; their priorities are set to 1. The control pattrs are independent so their priorities are all 0.\nEvery parameter is stored in a pattr object.\nAs an example, here is a midi player object, which contains, among other components, a beat clock. The beat clock itself contains several components. Here we see one of them, « loop_section » and the pattr objects it contains. [SLIDE]\nThe pattrhub object invokes them, so a message “step 2” will set the step pattr object in beat_clock to 2.\nPattrs act hierarchically. The beat clock is named “beat_clock” [SLIDE], so the step variable can be invoked by sending the beat clock the message “beat_clock::step 2.” This double-colon format continues as the pattr object is nested in deeper levels of a hierarchy.\nThe control consists of bpatchers. No bpatchers are in the model. These handle all the user interface logic like buttons and file selection. To change a parameter in the model, a pattr object must exist in the view with the same name as the corresponding one in the model. These names don’t conflict because they are in different sub patchers.\nA pattrstorage object in the control keeps track of pattern changes. When the outputmode attribute is non-zero, it will send the names and values of changed parameters out its outlet. Hence, to communicate parameter changes to the model, the pattrstorage output is sent out the control and into a pattrthub object at the top level of the model, which then broadcasts the changes to the proper places.\nNote: with this method, the interior pattrhub objects end up not being used at all, but it’s still good to leave them in so that these objects can be reused and are not dependent on being called this way.\nThe hierarchical nature of the model, though, means that the parameter names sent from the control must have the same hierarchical structure as those in the model. Thus to control the “midi_player_1::beat_clock::loop_length” parameter, there must be a control bpatcher called “midi_player_1” that contains a bpatcher “beat_clock” that contains a pattr “loop_length.”\nFor smaller systems, this could be a good method: the control and the model are parallel hierarchies. There are three problems with this method, though. The separation of model and control is supposed to give you the freedom to design the control without worrying about how things are being processed inside the model.\nThe control architecture is completely linked to the model architecture, which becomes very constraining, especially as the control logic in a complicated system probably does not reflect the way things are processed.\nYou don’t necessarily want to control all the pattrs in the model. Some you might find unnecessary. This is not a big problem, but there is another related one:\nSome pattrs in the model are not actually independent of each other at runtime. Objects were created independently, but their functions in the system are dependent on each other or other objects\nIt’s useful to design objects by thinking of their function independently of other objects, even though in the system they will not be independent.\nFor example:\nThere is an object that outputs a given number of bangs at a given tempo: it has two pattrs, “tempo” and “count”: the number of bangs to output.\nThere is another object that changes the system tempo.\nThe tempo object can be used to adjust the tempo by itself. But it is also used to control a parameter called “speed.” Speed makes the musical output play twice as fast (double time), or in triplets, etc. Changing the speed to two means both doubling the tempo and setting the number of bangs to two.\nThus the mapping from control pattrs to model pattrs is not one-to-one. We can imagine more complicated networks of dependencies among model parameters that we don’t want to reflect in the control.\nIt’s useful to design these two objects separately because they can then be tested and maybe reused later. We end up with a model that is “feature-rich,” and the job is now to decide which features we want to use, and how they will be reflected in the control.\nNote: In terms of domain-driven design, it’s important not to spend too much time building objects that do lots of things that we may not ultimately care about using. We’re not building a library, we’re building an application. On the other hand, building separate small objects that handle specific independent functions is a useful way to make building blocks for our application. So there’s a trade-off: designing for the application with an eye for the kind of independent and reusable objects that will make up a library.\nTo address these three problems, Djazz uses the following method:\nFor each important object that is made up of smaller components containing pattrs, like the “midi player,” there is a parameter bank. [SLIDE] This bank consists only of the surface pattrs that the control will call.\nThe midi player and the parameter bank are wrapped in a larger object, and parameters from the bank are passed to the midi player through a translator object.\nThis translator handles the three problems above. It translates the surface parameters to their corresponding hierarchically named pattrs, which is very easy. In this object, too, are placed the objects that translate control variables into dependent model variables, like f(speed)—\u003e[bang_count, tempo]. Finally, unused variables simply aren’t called. But to be absolutely sure that uncalled variables don’t give us trouble, by storing state that have forgotten about, or by accidentally being called, due to sharing names accidentally with a control variable, we can turn off their visibility to the pattrstorage system, which means they can never be called. There is a javascript object I wrote which will turn off all the pattrs in an object. The first argument tells it what the visibility is, the second weather to recursively change the visibility in sub patchers. [EXAMPLE]\nNow, in the control bpatcher, there is a similar parameter bank. Now the architectures of the control and the model are separate, and we are free to design the control as we want. As long as our controls send a message to the parameter bank with the right name, it will be sent to the model. [SLIDE] Now we can set up the controls as we like, and all the control logic—button operation, etc.—is completely independent of anything that happens in the model, and vice versa. Because the pattrstorage object is inside the view, the namespace “view” is not included in parameter names.\nThe model outputs midi and audio, but it also outputs pattrs to any view that wants to receive them. It does this the same way as the control: a pattrstorage object is at the top level of the model patcher, and when a pattr value is updated, it outputs the pattr name and value. There are two types of pattrs that the model outputs: those that are specifically for a view, and the parameters that were sent from the control. [SLIDE] Because the control is the view, this flow of pattrs becomes a loop. [SLIDE] The control/view pattrstorage sends values to the model’s pattrhub, and the model pattrstorage send values to the control/view’s pattrhub\nTo avoid an infinite loop, we make use the pattrstorage’s outputmode attribute.\nIn the model, the output mode is 2: any changed values are sent out. But in the view, the output mode is 6: values that are changed by objects in the pattr system are not sent out. That is, only values that are changed by user interaction are sent out. Thus the values received by pattrhub are set but not passed on. The loop is broken. [SLIDE]\nThe control flow is clear All of the state is centralised in the parameter banks The state can be read in in real time by the client windows (easy to debug) The state can be saved as preset files and reloaded.",
    "description": "Pattr translation in control and view control\nInterface - not much to say.",
    "tags": [],
    "title": "Pattr usage",
    "uri": "/3_api/6_architecture/pattr_usage.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "INPUT/OUTPUT DEVICES Connect/disconnect a device Presets for Launchpads Grid View Parameter controls The preset editor window Create a preset Select Midi Input Select parameter Select color Edit a preset Save a preset Load a preset Devices tested Launchpad Mini Launchpad Pro MK3 INPUT/OUTPUT DEVICES Connect/disconnect a device Make a new preset Controller presets View presets Save a preset Load a preset Devices Launchpad Pro MK3 Make a new preset Controller presets View presets Chapters and bars ",
    "description": "INPUT/OUTPUT DEVICES Connect/disconnect a device Presets for Launchpads Grid View Parameter controls The preset editor window Create a preset Select Midi Input Select parameter Select color Edit a preset Save a preset Load a preset Devices tested Launchpad Mini Launchpad Pro MK3 INPUT/OUTPUT DEVICES Connect/disconnect a device Make a new preset Controller presets View presets Save a preset Load a preset Devices Launchpad Pro MK3 Make a new preset Controller presets View presets Chapters and bars ",
    "tags": [],
    "title": "External Controllers",
    "uri": "/1_manual/5_external-controllers.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Factor Oracle",
    "uri": "/3_api/1_abstraction-references/components/factor_oracle.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Improvisation with the Factor Oracle",
    "uri": "/3_api/5_improvisation.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Listener",
    "uri": "/3_api/5_improvisation/_d_improv/_d_5_listener.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "booboo",
    "description": "booboo",
    "tags": [],
    "title": "The Analyzer",
    "uri": "/3_api/5_improvisation/3_analyzer.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Factor Oracle Player",
    "uri": "/3_api/1_abstraction-references/components/factor_oracle_player.html"
  },
  {
    "breadcrumb": "API",
    "content": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.",
    "description": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.",
    "tags": [],
    "title": "System Architecture",
    "uri": "/3_api/6_architecture.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "Djazz comes with many preloaded songs, but you can also load your own songs to play and improvise on. To do this, you need to make two files: a song file and a score file. This section contains instructions on the two included tools that let you create these files.",
    "description": "Djazz comes with many preloaded songs, but you can also load your own songs to play and improvise on.",
    "tags": [],
    "title": "Tools",
    "uri": "/1_manual/6_tools.html"
  },
  {
    "breadcrumb": "API",
    "content": " Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs. The resulting configurations can then be saved and reloaded.\nThere are two data structures for saving objects: dictionaries and arrays, because some objects occur as ordered sets [midi tracks, effects], while others don’t (players, although they could).\nOrdered sets are placed in arrays using javascript. This way they can be addressed using their indices in the array, and array operations can be used to keep track and change them.\nIn javascript you can make arrays of objects. To delete them, you have to both remove them from the patcher and remove them from the array or you will get undefined stuff.\nThe midi out bank is an example of a hierarchy of objects containing arrays. The bank contains tracks, and the tracks contain (among other things) midi effects. Tracks can be created and deleted, and so can effects. [SLIDE: tree] In addition, there are effects that apply to groups of tracks.\nBANK TRACK GROUP TRACK EFFECT_LIST EFFECT\nTo make this structure:\nEach object in the hierarchy contains a javascript object with the variable name « components, » which is responsible for creating, deleting, and dispatching messages to, and gathering data from the hierarchy objects it contains.\nEach « component » object contains an array of objects. [SLIDE]\nWhen objects are created, they are also placed in the array.\nThe code in each of these component objects is similar, and they could be abstracted into classes (prototypes) that components are derived from, if this method seems important enough to do that.\nThe bank can be saved as a dictionary.\nDictionary entries can be dictionaries and arrays, and array entries can be dictionaries and arrays. The midi bank dictionary contains arrays which contain dictionaries which contain arrays. Arbitrary nesting of dictionaries and arrays is possible. Access and modification becomes complicated, which I’ll talk about in section 4.\nTo save a midi bank layout:\nJavascript objects can declare attributes: values that can be accessed like normal max objects. Attributes can be dictionaries. Attribute values can also have custom getters and setters, which means that the attribute value does not have be something actually stored. A getter can dynamically construct it when it is invoked, and a setter can do something other than save the given value.\nThe midi bank thus has an attribute « bank_dict » that, when queried, builds a dictionary from its components’ data. It writes an array of its tracks, calling each of its tracks to give it the required data for its given array index. It calls each track by requesting a dict attribute from the track representing its components. The track builds a dict in the same way, calling its effect components. This process continues until a recursively-built dictionary is completed, then the midi bank passes it to the caller which writes it as a json file.\nTo reload the midi bank, the opposite occurs: the attribute value setter builds the track list by creating each track and then sending it the corresponding track dict so that it can build itself.\nThe actual dict values are at no time saved.\n[EXAMPLE]\nThis can be applied to the entire architecture of a session, including all the players. It will be once we’ve worked out what all the players will be and how they will be arranged.\nBecause of the hierarchical arrangement of dictionaries, the midi bank can have its own set of presets that can be loaded and saved inside the preset of an entire session.\nTo load an entire session including the pattr presets, the architecture dictionary has to be loaded first, and then the preset file.\nBoth the model and the view contain these component objects. Communication between the view and model is in the rightmost wire. Building from these dicts in the model and the view treat the dict like a model, and the model and view become its views.\nCommunication between the control and model during construction must be handled carefully and I’m interested in how to do it better. Originally I thought it would be great to include the dict attributes in the pattr system. Then they could be controlled in the same way that the rest of the parameters are controlled. The problem is this. [SLIDE] Javascript operates on a different (low-priority) thread than Max objects. When it calls Max to creat an object (new default), it passes control to this thread and continues to the next javascript command—we don’t know when the max command will finish in relation to the javascript. As components in the view hierarchy are built, we can’t assume that their analogs in the model are built at the same time. Thus messages cannot be passed from one to the other. Thus we cannot count on the pattr system working when the hierarchies are constructed. It has to use a different system.\nCreating effects: to create a midi effect, several easy standards must be met: MIDI notes follow a given value (list of numbers) MIDI comes in the left inlet and out the left inlet A control/view and a model patch Communication btw control and model occur via pattr, so pattrs with the same name (possibly hierarchic) must exist in both patches Control and model patchers must be put in appropriately named subfolders of a folder titled by the effect name.\nIf you do this, the effect will show up in the effect list. This gives an easy, max-less way for developers to add their own effects.",
    "description": "Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs.",
    "tags": [],
    "title": "Going further",
    "uri": "/3_api/7_going_further.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Improviser",
    "uri": "/3_api/1_abstraction-references/components/improviser.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "AllINeed, 64 164 4 \" 1\"; AllOfMe, 160 135 4 \" 1 33\"; Allthethingsyouare, 144 180 4 \" 1 33\"; AutumnleavesDoMin, 192 182 4 \" 1 33\"; BandeOrgueZay, 40 140 4 \" 1\"; BesameMucho, 160 110 4 \" 1 33\"; BluesFamaj, 48 120 4 \" 1\"; Boomerang, 236 58 4 \" 1 4 36 44\"; CamelBluesTernaire8, 32 103 4 \" 1\"; CamelSahelien, 96 103 4 \" 1\"; Capharnaum, 128 131 4 \" 1\"; Caravan, 256 220 4 \" 1 33\"; Carlos, 32 80 4 \" 1\"; Cerebral, 608 125 4 \" 1 9 33 49 73 105 121\"; CheektoCheek, 532 184 4 \" 1 6 38 62 78 102\"; CheektoCheekDjin, 224 184 4 \" 1 33\"; Cheerleader, 208 118 4 \" 1 9 13 21\"; ChegadeSaudade, 300 135 4 \" 1 9 41 71\"; Dang, 64 105 4 \" 1\"; Embona, 532 150 4 \" 1 24 56 86 118\"; Equilibrium, 56 118 4 \" 1 3\"; Espion, 752 129 4 \" 1 17 49 61 93 125 157\"; EtrangeJournee, 144 125 4 \" 1 13\"; EveryBreath, 400 103 4 \" 1 11 35 45 69\"; Fahatsia, 128 149 4 \" 1\"; Formidable, 324 135 4 \" 1 5 37 39 71\"; Free1, 4 100 4 \" 1\"; Free4, 16 100 4 \" 1\"; Free8, 32 100 4 \" 1\"; Free16, 64 200 4 \" 1\"; Free24, 96 200 4 \" 1\"; Free32, 128 200 4 \" 1\"; FreedomJazzDance, 32 105 4 \" 1\"; Guerre, 240 119 2 \" 1 27 48 65 97\"; Handfulofkeys, 344 240 4 \" 1 9 41 50\"; HandfulofkeysTheme1, 160 240 4 \" 1 9 41\"; Happy, 192 160 4 \" 1 17 33\"; Helmut, 128 130 4 \" 1\"; Hoany, 190 133 1 \" 1 22 40 66 96 119 151 159\"; Ifarakely, 444 102 4 \" 1 33 65 81 88\"; Jabeau, 48 120 3; JakeFine, 32 83 4 \" 1\"; JustAGigolo, 272 124 4 \" 1 5 37\"; JustTheWay, 64 130 4 \" 1 11\"; KillerJoe, 128 135 4 \" 1\"; Kissamile, 32 170 4 \" 1\"; L-O-V-E, 504 157 4 \" 1 5 37 69 101\"; LaJavanaise, 72 110 3 \" 1\"; Lasa, 672 120 4 \" 1 33 53 78 95 103 112 144\"; Liana, 748 120 4 \" 1 27 56 67 92 124 156\"; LianaIntro16, 64 270 4 \" 1\"; LoveYourself, 160 100 4 \" 1 33\"; Lullaby, 536 129 4 \" 1 11 43 75 79 95\"; MakingFlippy, 64 130 4 \" 1\"; Malaky, 346 145 2 \" 1 19 43 75 99 119 144\"; Mezerg, 128 132 4 \" 1\"; MieuxQue, 608 126 4 \" 1 9 33 57 81 97 121\"; Nightintunisia, 320 170 4 \" 1 17 49 65\"; Padam, 618 181 3 \" 1 24 46 76 95 117 149 175\"; PasAVendre, 616 134 4 \" 1 9 25 43 75 91 123\"; PasJalouse, 608 139 4 \" 1 17 33 49 65 81 89 121\"; PasPeur, 592 120 4 \" 1 5 33 61 89 117\"; Perfect, 190 46 2 \" 1 5 32 58 64\"; Perhaps, 304 103 4 \" 1 5 37 53\"; Rasputin, 148 123 4 \" 1 29\"; Rasputincourt, 116 123 4 \" 1\"; SatinDoll, 144 125 4 \" 1 5\"; Save, 406 144 2 \" 1 5 37 69 101 120 148 180\"; SoWhat, 128 135 4 \" 1\"; Spain, 220 240 4 \" 1 11 19 32\"; StarWazzz, 32 135 4 \" 1\"; Summertime, 64 180 4 \" 1\"; TakeFive, 200 170 5 \" 1 33\"; TheseBoots, 624 164 4 \" 1 32 63 94 102 125\"; Tsofyrano, 672 178 4 \" 1 17 45 61 93 105 137\"; Walk, 504 102 4 \" 1 9 23 45 59 73 97 111\"; Williason, 56 140 4 \" 1\"; WizKhalifa, 32 194 4 \" 1\"; Zay, 420 140 4 \" 1 21 34 66 80\";",
    "description": "AllINeed, 64 164 4 \" 1\"; AllOfMe, 160 135 4 \" 1 33\"; Allthethingsyouare, 144 180 4 \" 1 33\"; AutumnleavesDoMin, 192 182 4 \" 1 33\"; BandeOrgueZay, 40 140 4 \" 1\"; BesameMucho, 160 110 4 \" 1 33\"; BluesFamaj, 48 120 4 \" 1\"; Boomerang, 236 58 4 \" 1 4 36 44\"; CamelBluesTernaire8, 32 103 4 \" 1\"; CamelSahelien, 96 103 4 \" 1\"; Capharnaum, 128 131 4 \" 1\"; Caravan, 256 220 4 \" 1 33\"; Carlos, 32 80 4 \" 1\"; Cerebral, 608 125 4 \" 1 9 33 49 73 105 121\"; CheektoCheek, 532 184 4 \" 1 6 38 62 78 102\"; CheektoCheekDjin, 224 184 4 \" 1 33\"; Cheerleader, 208 118 4 \" 1 9 13 21\"; ChegadeSaudade, 300 135 4 \" 1 9 41 71\"; Dang, 64 105 4 \" 1\"; Embona, 532 150 4 \" 1 24 56 86 118\"; Equilibrium, 56 118 4 \" 1 3\"; Espion, 752 129 4 \" 1 17 49 61 93 125 157\"; EtrangeJournee, 144 125 4 \" 1 13\"; EveryBreath, 400 103 4 \" 1 11 35 45 69\"; Fahatsia, 128 149 4 \" 1\"; Formidable, 324 135 4 \" 1 5 37 39 71\"; Free1, 4 100 4 \" 1\"; Free4, 16 100 4 \" 1\"; Free8, 32 100 4 \" 1\"; Free16, 64 200 4 \" 1\"; Free24, 96 200 4 \" 1\"; Free32, 128 200 4 \" 1\"; FreedomJazzDance, 32 105 4 \" 1\"; Guerre, 240 119 2 \" 1 27 48 65 97\"; Handfulofkeys, 344 240 4 \" 1 9 41 50\"; HandfulofkeysTheme1, 160 240 4 \" 1 9 41\"; Happy, 192 160 4 \" 1 17 33\"; Helmut, 128 130 4 \" 1\"; Hoany, 190 133 1 \" 1 22 40 66 96 119 151 159\"; Ifarakely, 444 102 4 \" 1 33 65 81 88\"; Jabeau, 48 120 3; JakeFine, 32 83 4 \" 1\"; JustAGigolo, 272 124 4 \" 1 5 37\"; JustTheWay, 64 130 4 \" 1 11\"; KillerJoe, 128 135 4 \" 1\"; Kissamile, 32 170 4 \" 1\"; L-O-V-E, 504 157 4 \" 1 5 37 69 101\"; LaJavanaise, 72 110 3 \" 1\"; Lasa, 672 120 4 \" 1 33 53 78 95 103 112 144\"; Liana, 748 120 4 \" 1 27 56 67 92 124 156\"; LianaIntro16, 64 270 4 \" 1\"; LoveYourself, 160 100 4 \" 1 33\"; Lullaby, 536 129 4 \" 1 11 43 75 79 95\"; MakingFlippy, 64 130 4 \" 1\"; Malaky, 346 145 2 \" 1 19 43 75 99 119 144\"; Mezerg, 128 132 4 \" 1\"; MieuxQue, 608 126 4 \" 1 9 33 57 81 97 121\"; Nightintunisia, 320 170 4 \" 1 17 49 65\"; Padam, 618 181 3 \" 1 24 46 76 95 117 149 175\"; PasAVendre, 616 134 4 \" 1 9 25 43 75 91 123\"; PasJalouse, 608 139 4 \" 1 17 33 49 65 81 89 121\"; PasPeur, 592 120 4 \" 1 5 33 61 89 117\"; Perfect, 190 46 2 \" 1 5 32 58 64\"; Perhaps, 304 103 4 \" 1 5 37 53\"; Rasputin, 148 123 4 \" 1 29\"; Rasputincourt, 116 123 4 \" 1\"; SatinDoll, 144 125 4 \" 1 5\"; Save, 406 144 2 \" 1 5 37 69 101 120 148 180\"; SoWhat, 128 135 4 \" 1\"; Spain, 220 240 4 \" 1 11 19 32\"; StarWazzz, 32 135 4 \" 1\"; Summertime, 64 180 4 \" 1\"; TakeFive, 200 170 5 \" 1 33\"; TheseBoots, 624 164 4 \" 1 32 63 94 102 125\"; Tsofyrano, 672 178 4 \" 1 17 45 61 93 105 137\"; Walk, 504 102 4 \" 1 9 23 45 59 73 97 111\"; Williason, 56 140 4 \" 1\"; WizKhalifa, 32 194 4 \" 1\"; Zay, 420 140 4 \" 1 21 34 66 80\";",
    "tags": [],
    "title": "Preloaded Songs",
    "uri": "/1_manual/7_preloaded_resources.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Listener",
    "uri": "/3_api/1_abstraction-references/components/listener.html"
  },
  {
    "breadcrumb": "API",
    "content": "The goals in rewriting Djazz are as follows.\n•\tprepare the software for distribution as a standalone •\tdesign an architecture that is extensible: ⁃\tChanges can be made in one area without creating bugs in other areas (dependence and modularity) ⁃\tnew functionality can be added without changing the existing code base ⁃\tnew functionality is easy to integrate. There are methods (not quite an SDK) for adding functionality. Some methods are more in-depth than others; some only require putting new max patches in properly named and organised folders. •\tdebugging is easy ",
    "description": "The goals in rewriting Djazz are as follows.\n•\tprepare the software for distribution as a standalone •\tdesign an architecture that is extensible: ⁃\tChanges can be made in one area without creating bugs in other areas (dependence and modularity) ⁃\tnew functionality can be added without changing the existing code base ⁃\tnew functionality is easy to integrate.",
    "tags": [],
    "title": "Notes on databases in Max",
    "uri": "/3_api/8_notes_on_rewriting_djazz.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": " flowchart TB; TapIn(( Bang In)) PattrIn(( Pattr In )) SongDataIn((Song Data\\nIn)) GetTempo[Get Tempo] Clock[Beat Clock] GetLabel[Get Label] Out((( ))) TapIn-- bang --\u003eGetTempo PattrIn -- initial tempo --\u003e GetTempo PattrIn -- start beat,\\nend beat,\\nloop-section beats,\\nloop section active --\u003e GetTempo GetTempo-- bang --\u003eClock GetTempo-- Tempo --\u003eOut Clock-- beat number --\u003eGetLabel Clock-- Beat Number --\u003eOut GetLabel-- Label --\u003eOut SongDataIn-- Song Data ----\u003e GetLabel Master Control Master Clock - outputs a beat number when it receives a bang - increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped. - keeps track of tempo if tempo is manually input and fluctuates. This uses antescofo. - reads from song dict to get label - sends tempo, beat, and chord label, immediately in succession and in that order, to midi and audio generators. This order is important, so that the generators can calculate the correct information to play at the beginning of each beat.",
    "description": "flowchart TB; TapIn(( Bang In)) PattrIn(( Pattr In )) SongDataIn((Song Data\\nIn)) GetTempo[Get Tempo] Clock[Beat Clock] GetLabel[Get Label] Out((( ))) TapIn-- bang --\u003eGetTempo PattrIn -- initial tempo --\u003e GetTempo PattrIn -- start beat,\\nend beat,\\nloop-section beats,\\nloop section active --\u003e GetTempo GetTempo-- bang --\u003eClock GetTempo-- Tempo --\u003eOut Clock-- beat number --\u003eGetLabel Clock-- Beat Number --\u003eOut GetLabel-- Label --\u003eOut SongDataIn-- Song Data ----\u003e GetLabel Master Control Master Clock - outputs a beat number when it receives a bang - increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped.",
    "tags": [],
    "title": "Master Control",
    "uri": "/3_api/1_abstraction-references/components/master_control.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "MIDI Beat Generator",
    "uri": "/3_api/1_abstraction-references/components/midi_beat_generator.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "MIDI Record",
    "uri": "/3_api/1_abstraction-references/components/midi_record.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz control",
    "uri": "/3_api/1_abstraction-references/main_components/djazz_control.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Score Loader",
    "uri": "/3_api/1_abstraction-references/components/score_loader.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "UDP Send to VJazz",
    "uri": "/3_api/1_abstraction-references/components/to_vjazz.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/categories.html"
  },
  {
    "breadcrumb": "",
    "content": " Djazz est un programme développé depuis 2009 par Marc Chemillier en collaboration avec Gérard Assayag, Jérôme Nika, Mikhail Malt, Jean-Louis Giavitto, Georges Bloch, et Daniel Brown.\nIl s’agit d’un programme de musique générative qui improvise en utilisant du matériel provenant de partitions préenregistrées ou de contributions humaines live.\nNé de l’improvisation jazz, il a été étendu à la world music et à l’électro, et utilise une structure de données connue sous le nom Factor Oracle pour calculer, beat par beat, le matériel à jouer.\nMotivation Djazz était conçu pour s’adapter à différents styles musicaux. L’un des grands enjeux de sa réécriture est de lui donner une conception suffisamment modulaire pour pouvoir modifier facilement le style musical ainsi que l’algorithme de calcul des improvisations.\nFeatures Installation \u0026 Usage Djazz needs no special installation. Download the djazz folder here.\nLicense Djazz is licensed under which License?.\nCredits ",
    "description": "Software for musical co-creativity.",
    "tags": [],
    "title": "Djazz",
    "uri": "/index.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/tags.html"
  }
]
