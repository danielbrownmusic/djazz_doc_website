var relearn_search_index = [
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Manual",
    "uri": "/djazz_doc_website/1_manual.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tutorials",
    "uri": "/djazz_doc_website/2_tutorials.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "API",
    "uri": "/djazz_doc_website/3_api.html"
  },
  {
    "breadcrumb": "API \u003e externals",
    "content": " Antescofo is used in two places: Master control, to calculate the tempo (SCORE NAME) MIDI beat reader, to sequence and send out midi notes in the proper tempo and rhythm (SCORE NAME) ",
    "description": " Antescofo is used in two places: Master control, to calculate the tempo (SCORE NAME) MIDI beat reader, to sequence and send out midi notes in the proper tempo and rhythm (SCORE NAME) ",
    "tags": [],
    "title": "antescofo",
    "uri": "/djazz_doc_website/3_api/2_externals/antescofo.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Audio Beat Generator",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/audio_beat_generator.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "La plus grande étape a été de terminer l’objet factor oracle qui est généralisé pour différents types de données, et l’objet factor_oracle_player pour improviser avec lui.\nLe patch de l’oracle factor est ici : patchers/data_structures/factor_oracle/factor_oracle.maxpat\nPour utiliser différentes fonctions de comparaison, vous devez écrire un patch Max qui effectue la comparaison des étiquettes. Ensuite, vous pouvez changer la fonction de comparaison dans le patch factor oracle en lui passant le message “comparaison” et le nom du patch de comparaison. Jusqu’à présent, j’ai écrit deux patchs de comparaison : patchers/data_structures/factor_oracle/compare/fo.compare.equal_chords.maxpat\npatchers/data_structures/factor_oracle/compare/fo.compare.equal_chords_in_3_semitone_range.maxpat\nLes deux fonctionnent, mais je n’ai pas encore intégré la seconde - c’est-à-dire qu’elle trouve un rythme avec un accord dans une plage de 3 demi-tons (vers le haut ou vers le bas), mais après l’avoir fait, le programme ne préforme pas encore le changement de hauteur sur la sortie MIDI ou audio.",
    "description": "La plus grande étape a été de terminer l’objet factor oracle qui est généralisé pour différents types de données, et l’objet factor_oracle_player pour improviser avec lui.",
    "tags": [],
    "title": "Description of the Factor Oracle",
    "uri": "/djazz_doc_website/3_api/6_improvisation/1_factor_oracle.html"
  },
  {
    "breadcrumb": "API \u003e Notes on databases in Max",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Dicts in Max and javascript",
    "uri": "/djazz_doc_website/3_api/8_notes_on_rewriting_djazz/max_dictionaris_in_js_and_max.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/main_components/djazz.html"
  },
  {
    "breadcrumb": "API \u003e Going further",
    "content": " Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs. The resulting configurations can then be saved and reloaded.\nThere are two data structures for saving objects: dictionaries and arrays, because some objects occur as ordered sets [midi tracks, effects], while others don’t (players, although they could).\nOrdered sets are placed in arrays using javascript. This way they can be addressed using their indices in the array, and array operations can be used to keep track and change them.\nIn javascript you can make arrays of objects. To delete them, you have to both remove them from the patcher and remove them from the array or you will get undefined stuff.\nThe midi out bank is an example of a hierarchy of objects containing arrays. The bank contains tracks, and the tracks contain (among other things) midi effects. Tracks can be created and deleted, and so can effects. [SLIDE: tree] In addition, there are effects that apply to groups of tracks.\nBANK TRACK GROUP TRACK EFFECT_LIST EFFECT\nTo make this structure:\nEach object in the hierarchy contains a javascript object with the variable name « components, » which is responsible for creating, deleting, and dispatching messages to, and gathering data from the hierarchy objects it contains.\nEach « component » object contains an array of objects. [SLIDE]\nWhen objects are created, they are also placed in the array.\nThe code in each of these component objects is similar, and they could be abstracted into classes (prototypes) that components are derived from, if this method seems important enough to do that.\nThe bank can be saved as a dictionary.\nDictionary entries can be dictionaries and arrays, and array entries can be dictionaries and arrays. The midi bank dictionary contains arrays which contain dictionaries which contain arrays. Arbitrary nesting of dictionaries and arrays is possible. Access and modification becomes complicated, which I’ll talk about in section 4.\nTo save a midi bank layout:\nJavascript objects can declare attributes: values that can be accessed like normal max objects. Attributes can be dictionaries. Attribute values can also have custom getters and setters, which means that the attribute value does not have be something actually stored. A getter can dynamically construct it when it is invoked, and a setter can do something other than save the given value.\nThe midi bank thus has an attribute « bank_dict » that, when queried, builds a dictionary from its components’ data. It writes an array of its tracks, calling each of its tracks to give it the required data for its given array index. It calls each track by requesting a dict attribute from the track representing its components. The track builds a dict in the same way, calling its effect components. This process continues until a recursively-built dictionary is completed, then the midi bank passes it to the caller which writes it as a json file.\nTo reload the midi bank, the opposite occurs: the attribute value setter builds the track list by creating each track and then sending it the corresponding track dict so that it can build itself.\nThe actual dict values are at no time saved.\n[EXAMPLE]\nThis can be applied to the entire architecture of a session, including all the players. It will be once we’ve worked out what all the players will be and how they will be arranged.\nBecause of the hierarchical arrangement of dictionaries, the midi bank can have its own set of presets that can be loaded and saved inside the preset of an entire session.\nTo load an entire session including the pattr presets, the architecture dictionary has to be loaded first, and then the preset file.\nBoth the model and the view contain these component objects. Communication between the view and model is in the rightmost wire. Building from these dicts in the model and the view treat the dict like a model, and the model and view become its views.\nCommunication between the control and model during construction must be handled carefully and I’m interested in how to do it better. Originally I thought it would be great to include the dict attributes in the pattr system. Then they could be controlled in the same way that the rest of the parameters are controlled. The problem is this. [SLIDE] Javascript operates on a different (low-priority) thread than Max objects. When it calls Max to creat an object (new default), it passes control to this thread and continues to the next javascript command—we don’t know when the max command will finish in relation to the javascript. As components in the view hierarchy are built, we can’t assume that their analogs in the model are built at the same time. Thus messages cannot be passed from one to the other. Thus we cannot count on the pattr system working when the hierarchies are constructed. It has to use a different system.\nCreating effects: to create a midi effect, several easy standards must be met: MIDI notes follow a given value (list of numbers) MIDI comes in the left inlet and out the left inlet A control/view and a model patch Communication btw control and model occur via pattr, so pattrs with the same name (possibly hierarchic) must exist in both patches Control and model patchers must be put in appropriately named subfolders of a folder titled by the effect name.\nIf you do this, the effect will show up in the effect list. This gives an easy, max-less way for developers to add their own effects.",
    "description": "Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs.",
    "tags": [],
    "title": "Dynamic Object Creation and Destruction",
    "uri": "/djazz_doc_website/3_api/7_going_further/dynamic_object_creation_and_destruction.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Index of important abstractions",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "Djazz needs no special installation. Download the djazz folder here. Open Max. Select Options from the menu bar at the top of the screen.\nSelect File Preferences from the dropdown menu that appears.\nIn the File Preferences window that appears, select “choose path.”\nIn the file browser menu that appears, select the “djazz” folder you have just downloaded. Djazz uses externals that are included in the Djazz folder. Thye do not require extra installation.",
    "description": "Djazz needs no special installation. Download the djazz folder here. Open Max.",
    "tags": [],
    "title": "Installation",
    "uri": "/djazz_doc_website/1_manual/1_installation.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Description of Components in Model:\nMaster Control Master Clock - outputs a beat number when it receives a bang - increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped. - keeps track of tempo if tempo is manually input and fluctuates. This uses antescofo. - reads from song dict to get label - sends tempo, beat, and chord label, immediately in succession and in that order, to midi and audio generators. This order is important, so that the generators can calculate the correct information to play at the beginning of each beat.",
    "description": "Description of Components in Model:\nMaster Control Master Clock - outputs a beat number when it receives a bang - increments its beat number with each output, but also keeps track of position in a song form and adjusts the beat in accordance if looped.",
    "tags": [],
    "title": "main components",
    "uri": "/djazz_doc_website/3_api/4_architecture/component_descriptions/master_control.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Main Components",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/main_components.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Tools",
    "content": "",
    "description": "",
    "tags": [],
    "title": "make song file",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/tools/make_song_file.html"
  },
  {
    "breadcrumb": "Manual \u003e Tools",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Making a Song File",
    "uri": "/djazz_doc_website/1_manual/6_tools/make_song_file.html"
  },
  {
    "breadcrumb": "API \u003e Notes on databases in Max",
    "content": "Dicts, like colls, are persistent and global, so use them only as read-only. Don’t use them as variables to pass around or for keeping track of state. Pattrs basically do this anyway so just use them to keep track of state snapshots.\nYou can’t put max objects in a dictionary. But you can put them in a javascript array. Max patchers basically are dictionaries, though, for objects in them with scripting names (varnames). They must both use hash tables to access their contents.",
    "description": "Dicts, like colls, are persistent and global, so use them only as read-only.",
    "tags": [],
    "title": "Notes on dicts",
    "uri": "/djazz_doc_website/3_api/8_notes_on_rewriting_djazz/thoughts_on_dicts.html"
  },
  {
    "breadcrumb": "API \u003e External controls and views",
    "content": "Attaching External Devices Parameters Parameter Listeners External devices with views as well as controls Launchpads Mapping editors Dictionary readers and writers in javascript\n3. Parameters and Listeners\nThe view/control exposes the variables that can be changed by the user. It also exposes the ways in which these controls can be changed: as bools, ints, floats, bounded, etc.\nTo attach a device or remote controller to the system, we can use the parameter system, which is independent from the pattr system but whose functionality overlaps with it in a useful way.\nEach pattr can be saved as a parameter. In addition, each control surface object can be saved as a parameter. When objects containing parameters are created (like midi tracks), new parameters are created.\nTwo javascript objects then allow for device connection. The ParameterInfoProvider lists all the parameters, and alerts us when parameters are added or removed.\nA javascript object contains a parameterInfoProvider and an array of ParameterListeners. Each time a parameter is added, a parameter listener is created for it.\nThis javascript object centralises parameter communication. When a parameter is changed, it sends out its name and value. It receives values too. Essentially it’s a replica of the pattrstorage object. Why use it? Because the parameters are mapped to our control surface, not the model. We can take into account the control object logic; several buttons that change the same pattr can be saved as different parameters. Then we have more than one typed interface to the variable: we can control it as a toggle, or an int. For instance, the loop variable can be controlled by buttons with a launchpad, and by the number box with the ring. All you need to do is expose the desired control type and set is as a parameter. Again, the underlying model is unaffected.\nParameter listener and maxobjlisteners are hard to deal with because you can’t delete them.",
    "description": "Attaching External Devices Parameters Parameter Listeners External devices with views as well as controls Launchpads Mapping editors Dictionary readers and writers in javascript",
    "tags": [],
    "title": "Parameters",
    "uri": "/djazz_doc_website/3_api/5_external_controls_and_views/1_parameters.html"
  },
  {
    "breadcrumb": "Tutorials",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Playing a MIDI Score",
    "uri": "/djazz_doc_website/2_tutorials/1_play_midi_score.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Audio Record",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/audio_record.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.\nDjazz plays music in two ways: by selecting sections from scores, and by calculating improvisations using the factor oracle algorithm which is modified with pattern-matching methods. The input to the factor oracle come from scores and real-time input, either audio or MIDI, and is output as audio or MIDI. It is (being) written in Max with the factor-oracle and pattern-matching computation in Python. It uses Antescofo to generate notes both from scores and generated as improvisations in tempo. Djazz improvises on songs using template files, which are lists of beats representing positions in the songs. No other information is encoded in these templates: chord changes and notes are in different files: the scores used by Antescofo, and the databases used by the factor oracle. The song templates just let Antescofo and the factor oracle know which beat we’re on at a given time. For songs whose formal structure includes verses or sections, this larger structure is also included in the template. It can also improvise over a “free” structure by using a trivial template, just a short list of beats that loops. Djazz is played by inputting a tap—manually, from a built-in metronome, or from another application. The tap triggers a beat, which triggers notes to be output from the factor oracle or the score, which triggers note data to be output from antescofo, which triggers sound to be output by the audio or midi outputs. [SLIDE] You can see this control flow. The tap comes in on the left and comes out as sound from the midi bank on the right. The intermediate translations from tap to beat occur in the objects along the way. The architecture: several players which can be of different types (all the possible types to be determined). Each functions independently but there is a master control for synchronising timing and for broadcasting global commands. The control flow is represented functionally thus [SLIDE], where the “p’s” are vectors of parameters that change the way each translation is done. The control flow of these p’s are what I’m going to talk about. ",
    "description": "Because Djazz is beat-based, most objects are built to receive and process information at recurring instances.",
    "tags": [],
    "title": "control flow",
    "uri": "/djazz_doc_website/3_api/4_architecture/control_flow.html"
  },
  {
    "breadcrumb": "API \u003e External controls and views",
    "content": "Dictionaries in Javascript and pure Max Gotchas\nDictionary readers and writers Dictionaries are used in different ways, for representing songs, architecture, and as another example for the launchpad, to keep track of how buttons are mapped to parameters and how parameters are mapped to lights. For this, several different types of dictionaries were required:\nDICTS AND ARRAYS\none containing device-specific data mapping lights to midi and control values, (« DEVICE »)\none containing the actual mappings the user creates, (« MAP »)\nOne for the the system to read to map launchpad input to parameters, (« CTRL »)\nAnd one for the system to read mapping parameters to lights. (« VIEW »)\nThe structure for each of these dicts can be done in different ways. Some criteria exist:\nThe user-created dict must be easy to create, either by editing the text or with a max object\nThe program-read dicts must be efficient, easily read by the program.\nThese two criteria are different and ask for different structures. Also, there is not a given good structure for any of these dicts, and we might want to change them later. We might even have to, as new launchpads, and new devices, use different formats.\nSo there’s not a general method for structuring these dicts. But we want something general so that we don’t have to rewrite a new patch and dict-accessors for each new launchpad.\nTo solve this, we create dict-readers and dict-writes, two types of javascript objects. Each one exports a set of methods that access data or modify data. The implementation of the methods are hidden to the user. Each one is specific to the context it acts in. The exported methods have the same names, but the implementation is different depending on the structure of the dict it reads or writes to. Thus, we can use a single javascript object to read the desired dictionaries and then translate them into the format the system needs. Each reader and writer is imported into the module using a require statement. If we change or add a new dict format, we write a new reader—which only involves rewriting the implementation of the exported methods—and replace it in the appropriate require field. These can also be jsarguments. This way, we have translators: objects that take a reader and a writer.",
    "description": "Dictionaries in Javascript and pure Max Gotchas\nDictionary readers and writers Dictionaries are used in different ways, for representing songs, architecture, and as another example for the launchpad, to keep track of how buttons are mapped to parameters and how parameters are mapped to lights.",
    "tags": [],
    "title": "Dicts",
    "uri": "/djazz_doc_website/3_api/5_external_controls_and_views/2_dicts.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "externals",
    "uri": "/djazz_doc_website/3_api/2_externals.html"
  },
  {
    "breadcrumb": "API \u003e Going further",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Factor Oracle Labeling",
    "uri": "/djazz_doc_website/3_api/7_going_further/factor_oracle_creation.html"
  },
  {
    "breadcrumb": "Manual",
    "content": " 1. SONG LOADING Open a new song 2. BEAT INPUT Manual Metronome From another machine 3. GLOBAL AUDIO CONTROLS Audio In (Microphone) Audio Out (Speakers) 4. SONG GRID Chapter select Bar Select Loop Chapter Button Relation of Grid to beat input 5. PLAYBACK DATA VIEW Beats in song Beats in section (chapter) Section is looped Current beat Current beat label 6. MIDI UI SELECTOR 7. AUDIO UI SELECTOR ",
    "description": "1. SONG LOADING Open a new song 2. BEAT INPUT Manual Metronome From another machine 3.",
    "tags": [],
    "title": "Main Window",
    "uri": "/djazz_doc_website/1_manual/2_main_window.html"
  },
  {
    "breadcrumb": "Manual \u003e Tools",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Making a Score File",
    "uri": "/djazz_doc_website/1_manual/6_tools/make_score_file.html"
  },
  {
    "breadcrumb": "API \u003e externals",
    "content": "",
    "description": "",
    "tags": [],
    "title": "midifile",
    "uri": "/djazz_doc_website/3_api/2_externals/midifile.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Other Components",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components.html"
  },
  {
    "breadcrumb": "Tutorials",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Recording and playing back audio",
    "uri": "/djazz_doc_website/2_tutorials/2_record_audio.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": " Le “factor oracle player” qui prend les étiquettes une par une, qui peuvent être de n’importe quelle forme (mais dans le programme actuel, c’est un dictionnaire avec deux entrées : la racine de l’accord et l’étiquette de l’accord), et utilise un factor oracle pour produire un battement qui correspond à l’étiquette. Il fonctionne de la même manière que la version LISP : vous définissez la continuité maximale et il tente de s’y adapter. Lorsque la continuité maximale est atteinte, il prend un lien de suffixe et recherche une étiquette correspondante. Si aucune étiquette correspondante n’est trouvée, il choisit un état aléatoire : patchers/factor_oracle_player/factor_oracle_player.maxpat\nL’implémentation du lecteur d’oracle factoriel est presque terminée. En ce qui concerne l’écriture de nouvelles partitions d’antescofo improvisées à partir d’anciennes partitions, le patch inachevé est ici : patchers/improvise_antescofo/djazz.improvise_antescofo.maxpat\nLorsque le bouton “NEW” est pressé, il lit la partition antescofo actuelle dans la mémoire (en la convertissant en un objet Max dict) (ceci est fait avec Javascript), puis exécute le lecteur factor oracle pour générer une succession différente de rythmes pour chaque canal demandé, en mappant ces rythmes à différents canaux (non utilisés), et en combinant le tout à nouveau dans un Max dict. Le contenu des canaux d’origine n’est pas modifié, comme vous l’avez demandé ; seul le nouveau contenu des nouveaux canaux est ajouté.\nCe qui n’est PAS fait, c’est d’écrire le nouveau Max dict dans une partition antescofo. Cela doit être fait en Javascript, car le temps de passage des notes doit être trié et les nouveaux temps delta calculés, ce qui serait difficile à faire dans Max. Cela ne prendra pas beaucoup de temps à terminer, je ne l’ai simplement pas fait ; je peux le faire lundi prochain.\nLe factor oracle player fonctionne de la même manière pour les improvisateurs audio, mais il n’écrit aucune partition (donc pas de Javascript ici) : il envoie simplement des données aux objets supervp pour qu’ils jouent à partir du tampon audio (enregistré ou chargé) : patchers/improvise_oracles/djazz_audio_oracle_players.maxpat\nCe patch est encore buggy en termes d’interface/implémentation et je dois passer mardi prochain à le debugger.",
    "description": "Le “factor oracle player” qui prend les étiquettes une par une, qui peuvent être de n’importe quelle forme (mais dans le programme actuel, c’est un dictionnaire avec deux entrées : la racine de l’accord et l’étiquette de l’accord), et utilise un factor oracle pour produire un battement qui correspond à l’étiquette.",
    "tags": [],
    "title": "The Factor Oracle Player",
    "uri": "/djazz_doc_website/3_api/6_improvisation/2_factor_oracle_player.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Beat Clock",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/beat_clock.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz view",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/main_components/djazz_view.html"
  },
  {
    "breadcrumb": "API",
    "content": "File formats used json song file score/track files for MIDI audio: wav and json\nFolders for consolidating files that go together Saving and loading folders (gotchas)\nJson files are imported into dictionaries",
    "description": "File formats used json song file score/track files for MIDI audio: wav and json",
    "tags": [],
    "title": "File formats used",
    "uri": "/djazz_doc_website/3_api/3_file_formats_used.html"
  },
  {
    "breadcrumb": "API \u003e Going further",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Listeners and Real-time Analyzers",
    "uri": "/djazz_doc_website/3_api/7_going_further/listeners-and-analyzers.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "MIDI In View When clicked and illuminated, the record button arms the buffer for recording. It does not start recording until the first beat that advances the grid.\nScores View Score Player/Loader Window Score Loader Pitch Transposition Changes the pitch of the MIDI output Octave Transposition Changes the octave of the MIDI output Speed Changes the speed of the MIDI output Loop Loops the previous n beats of the MIDI output “Jam” (Improvise) “Jam” Button Turns the improviser on. When this is on, the MIDI track(s) is/are not played back straight, but beats are chosen based on the harmony and the next two controls, continuity and potch range:\nContinuity This determines the length in beats that sections of the score will be played back in sequence. Once this many beats has been played in sequence, the improviser will jump to a new section of the score. The maximum coninuity is 255 beats. When the “MAX” button is on, this will be the continuity–i.e., the score will be played back without improvising, i.e. jumping around through it (given that the score is \u003c 255 beats long. If you’re using this with a score that’s longer than 255 beats and you just want to play the score straight, there’s no reason to be even using the improviser.)\nThe improviser tries to match beats that have the same harmony as the current beat. By adjusting the pitch range, it will look for beats with a similar chord type but with roots above or below the current chord root. A pitch range of n will look for chords between (and including) n semitones below and n semitones above the current chord root. Set to zero, it will match the chord root exactly. Beats with different roots will be transposed to the proper harmony.",
    "description": "MIDI In View When clicked and illuminated, the record button arms the buffer for recording.",
    "tags": [],
    "title": "MIDI Window",
    "uri": "/djazz_doc_website/1_manual/3_midi_window.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "1. Architecture Model/Control/View Control/View MVC:\nDjazz uses the Model-View-Control design pattern.\nThe model consists of the objects that do the processing. At the top level, there are various players and the master control just described.\nThe model is controlled entirely by passing named parameters (not what Max calls “parameters”—I’ll talk about these in a later section) in the message format . These parameters are received in the leftmost inlet. The rightmost inlet is for changes in architecture: adding and subtracting components, which I’ll talk about later.\nThe control is also the view, since they’re graphical controls, so I’ll refer the bpatcher containing the combined control and view as the view.",
    "description": "1. Architecture Model/Control/View Control/View MVC:\nDjazz uses the Model-View-Control design pattern.",
    "tags": [],
    "title": "Overview of MVVCC (Model-View-View Controller-View) Architecture",
    "uri": "/djazz_doc_website/3_api/4_architecture/overview_of_mvcvc.html"
  },
  {
    "breadcrumb": "Tutorials",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Recording and playing back MIDI",
    "uri": "/djazz_doc_website/2_tutorials/3_record_midi.html"
  },
  {
    "breadcrumb": "API \u003e externals",
    "content": " SuperVP is used to play audio beats ",
    "description": " SuperVP is used to play audio beats ",
    "tags": [],
    "title": "supervp",
    "uri": "/djazz_doc_website/3_api/2_externals/supervp.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Syncopation",
    "uri": "/djazz_doc_website/3_api/6_improvisation/3_syncopation.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tools",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/tools.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Analyzer",
    "uri": "/djazz_doc_website/3_api/6_improvisation/analyzer.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "7. AUDIO UI Audio Live Input – see MIDI Live Input Recording – see MIDI Live Input Saving a file – see MIDI Live Input Loading a file – see MIDI Live Input Note: to save and load an audio file, you actually save and load a folder. Just name the folder in the dialog window, and the folder will be created and appropriately named files (.wav and .json) will be saved in the folder. For loading, choose the folder from the dialog. Audio Track Playback \u0026 Improvising – see Midi Track Looping sections/Repetitions – see MIDI Live Input Audio Input Volume dial and reset click Mute Audio Out Audio Out Track Volume dial and reset click Solo Mute Volume meter Il y a un patch pour extraire les données de la grille des partitions audio textuelles comme celles que vous avez envoyées vers le nouveau format : patchers/data_file_makers/text_score_to_audio_grid_data.maxpat",
    "description": "7. AUDIO UI Audio Live Input – see MIDI Live Input Recording – see MIDI Live Input Saving a file – see MIDI Live Input Loading a file – see MIDI Live Input Note: to save and load an audio file, you actually save and load a folder.",
    "tags": [],
    "title": "Audio Window",
    "uri": "/djazz_doc_website/1_manual/4_audio_window.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Beat Generator",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/beat_generator.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz view control",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/main_components/djazz_view_control.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Improvisation with the Factor Oracle",
    "uri": "/djazz_doc_website/3_api/6_improvisation.html"
  },
  {
    "breadcrumb": "API \u003e System Architecture",
    "content": "Pattr translation in control and view control\nInterface - not much to say. Just graphical controls. Sends and receives pattrs to and from control. Infinite loop is avoided via pattrstorage output mode set to 5.\nThe CONTROL PATTRS and DATA PATTRS (dicts) are saved. On loading, the data pattrs must be fully loaded first; their priorities are set to 1. The control pattrs are independent so their priorities are all 0.\nEvery parameter is stored in a pattr object.\nAs an example, here is a midi player object, which contains, among other components, a beat clock. The beat clock itself contains several components. Here we see one of them, « loop_section » and the pattr objects it contains. [SLIDE]\nThe pattrhub object invokes them, so a message “step 2” will set the step pattr object in beat_clock to 2.\nPattrs act hierarchically. The beat clock is named “beat_clock” [SLIDE], so the step variable can be invoked by sending the beat clock the message “beat_clock::step 2.” This double-colon format continues as the pattr object is nested in deeper levels of a hierarchy.\nThe control consists of bpatchers. No bpatchers are in the model. These handle all the user interface logic like buttons and file selection. To change a parameter in the model, a pattr object must exist in the view with the same name as the corresponding one in the model. These names don’t conflict because they are in different sub patchers.\nA pattrstorage object in the control keeps track of pattern changes. When the outputmode attribute is non-zero, it will send the names and values of changed parameters out its outlet. Hence, to communicate parameter changes to the model, the pattrstorage output is sent out the control and into a pattrthub object at the top level of the model, which then broadcasts the changes to the proper places.\nNote: with this method, the interior pattrhub objects end up not being used at all, but it’s still good to leave them in so that these objects can be reused and are not dependent on being called this way.\nThe hierarchical nature of the model, though, means that the parameter names sent from the control must have the same hierarchical structure as those in the model. Thus to control the “midi_player_1::beat_clock::loop_length” parameter, there must be a control bpatcher called “midi_player_1” that contains a bpatcher “beat_clock” that contains a pattr “loop_length.”\nFor smaller systems, this could be a good method: the control and the model are parallel hierarchies. There are three problems with this method, though. The separation of model and control is supposed to give you the freedom to design the control without worrying about how things are being processed inside the model.\nThe control architecture is completely linked to the model architecture, which becomes very constraining, especially as the control logic in a complicated system probably does not reflect the way things are processed.\nYou don’t necessarily want to control all the pattrs in the model. Some you might find unnecessary. This is not a big problem, but there is another related one:\nSome pattrs in the model are not actually independent of each other at runtime. Objects were created independently, but their functions in the system are dependent on each other or other objects\nIt’s useful to design objects by thinking of their function independently of other objects, even though in the system they will not be independent.\nFor example:\nThere is an object that outputs a given number of bangs at a given tempo: it has two pattrs, “tempo” and “count”: the number of bangs to output.\nThere is another object that changes the system tempo.\nThe tempo object can be used to adjust the tempo by itself. But it is also used to control a parameter called “speed.” Speed makes the musical output play twice as fast (double time), or in triplets, etc. Changing the speed to two means both doubling the tempo and setting the number of bangs to two.\nThus the mapping from control pattrs to model pattrs is not one-to-one. We can imagine more complicated networks of dependencies among model parameters that we don’t want to reflect in the control.\nIt’s useful to design these two objects separately because they can then be tested and maybe reused later. We end up with a model that is “feature-rich,” and the job is now to decide which features we want to use, and how they will be reflected in the control.\nNote: In terms of domain-driven design, it’s important not to spend too much time building objects that do lots of things that we may not ultimately care about using. We’re not building a library, we’re building an application. On the other hand, building separate small objects that handle specific independent functions is a useful way to make building blocks for our application. So there’s a trade-off: designing for the application with an eye for the kind of independent and reusable objects that will make up a library.\nTo address these three problems, Djazz uses the following method:\nFor each important object that is made up of smaller components containing pattrs, like the “midi player,” there is a parameter bank. [SLIDE] This bank consists only of the surface pattrs that the control will call.\nThe midi player and the parameter bank are wrapped in a larger object, and parameters from the bank are passed to the midi player through a translator object.\nThis translator handles the three problems above. It translates the surface parameters to their corresponding hierarchically named pattrs, which is very easy. In this object, too, are placed the objects that translate control variables into dependent model variables, like f(speed)—\u003e[bang_count, tempo]. Finally, unused variables simply aren’t called. But to be absolutely sure that uncalled variables don’t give us trouble, by storing state that have forgotten about, or by accidentally being called, due to sharing names accidentally with a control variable, we can turn off their visibility to the pattrstorage system, which means they can never be called. There is a javascript object I wrote which will turn off all the pattrs in an object. The first argument tells it what the visibility is, the second weather to recursively change the visibility in sub patchers. [EXAMPLE]\nNow, in the control bpatcher, there is a similar parameter bank. Now the architectures of the control and the model are separate, and we are free to design the control as we want. As long as our controls send a message to the parameter bank with the right name, it will be sent to the model. [SLIDE] Now we can set up the controls as we like, and all the control logic—button operation, etc.—is completely independent of anything that happens in the model, and vice versa. Because the pattrstorage object is inside the view, the namespace “view” is not included in parameter names.\nThe model outputs midi and audio, but it also outputs pattrs to any view that wants to receive them. It does this the same way as the control: a pattrstorage object is at the top level of the model patcher, and when a pattr value is updated, it outputs the pattr name and value. There are two types of pattrs that the model outputs: those that are specifically for a view, and the parameters that were sent from the control. [SLIDE] Because the control is the view, this flow of pattrs becomes a loop. [SLIDE] The control/view pattrstorage sends values to the model’s pattrhub, and the model pattrstorage send values to the control/view’s pattrhub\nTo avoid an infinite loop, we make use the pattrstorage’s outputmode attribute.\nIn the model, the output mode is 2: any changed values are sent out. But in the view, the output mode is 6: values that are changed by objects in the pattr system are not sent out. That is, only values that are changed by user interaction are sent out. Thus the values received by pattrhub are set but not passed on. The loop is broken. [SLIDE]\nThe control flow is clear All of the state is centralised in the parameter banks The state can be read in in real time by the client windows (easy to debug) The state can be saved as preset files and reloaded.",
    "description": "Pattr translation in control and view control\nInterface - not much to say.",
    "tags": [],
    "title": "Pattr usage",
    "uri": "/djazz_doc_website/3_api/4_architecture/pattr_usage.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "System Architecture",
    "uri": "/djazz_doc_website/3_api/4_architecture.html"
  },
  {
    "breadcrumb": "Manual",
    "content": "INPUT/OUTPUT DEVICES Connect/disconnect a device Presets for Launchpads Grid View Parameter controls The preset editor window Create a preset Select Midi Input Select parameter Select color Edit a preset Save a preset Load a preset Devices tested Launchpad Mini Launchpad Pro MK3 ",
    "description": "INPUT/OUTPUT DEVICES Connect/disconnect a device Presets for Launchpads Grid View Parameter controls The preset editor window Create a preset Select Midi Input Select parameter Select color Edit a preset Save a preset Load a preset Devices tested Launchpad Mini Launchpad Pro MK3 ",
    "tags": [],
    "title": "External Controllers",
    "uri": "/djazz_doc_website/1_manual/5_external-controllers.html"
  },
  {
    "breadcrumb": "API",
    "content": "",
    "description": "",
    "tags": [],
    "title": "External controls and views",
    "uri": "/djazz_doc_website/3_api/5_external_controls_and_views.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Factor Oracle",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/factor_oracle.html"
  },
  {
    "breadcrumb": "API \u003e Improvisation with the Factor Oracle",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Listener",
    "uri": "/djazz_doc_website/3_api/6_improvisation/listener.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Factor Oracle Player",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/factor_oracle_player.html"
  },
  {
    "breadcrumb": "Manual",
    "content": " Il existe également une structure de données pour les “données de la grille”, afin de faciliter le chargement, l’enregistrement et la recherche de rythmes : patchers/data_structures/grid_data/grid_data.maxpat\nLes données de la grille sont sauvegardées dans les fichiers .json des chansons que j’utilise depuis le début. Il existe un patch pour créer les données de la grille à la main, que je vous ai montré précédemment : patchers/data_file_makers/djazz_make_grid.maxpat\nIl existe également un correctif qui permet de couper et de coller les listes lisp des données de la grille à partir des fichiers “GridData.lisp”, ce qui les convertira en dictionnaire, les ajoutera au fichier de chansons associé et réenregistrera le fichier : patchers/data_file_makers/djazz_lisp_grid_to_dict.maxpat\nPour l’instant, j’ai ajouté les données de la grille à quelques chansons pour les tester : “AllINeed”, “AllOfMe” et “AutumnLeaves”.",
    "description": "Il existe également une structure de données pour les “données de la grille”, afin de faciliter le chargement, l’enregistrement et la recherche de rythmes : patchers/data_structures/grid_data/grid_data.",
    "tags": [],
    "title": "Tools",
    "uri": "/djazz_doc_website/1_manual/6_tools.html"
  },
  {
    "breadcrumb": "API",
    "content": " Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs. The resulting configurations can then be saved and reloaded.\nThere are two data structures for saving objects: dictionaries and arrays, because some objects occur as ordered sets [midi tracks, effects], while others don’t (players, although they could).\nOrdered sets are placed in arrays using javascript. This way they can be addressed using their indices in the array, and array operations can be used to keep track and change them.\nIn javascript you can make arrays of objects. To delete them, you have to both remove them from the patcher and remove them from the array or you will get undefined stuff.\nThe midi out bank is an example of a hierarchy of objects containing arrays. The bank contains tracks, and the tracks contain (among other things) midi effects. Tracks can be created and deleted, and so can effects. [SLIDE: tree] In addition, there are effects that apply to groups of tracks.\nBANK TRACK GROUP TRACK EFFECT_LIST EFFECT\nTo make this structure:\nEach object in the hierarchy contains a javascript object with the variable name « components, » which is responsible for creating, deleting, and dispatching messages to, and gathering data from the hierarchy objects it contains.\nEach « component » object contains an array of objects. [SLIDE]\nWhen objects are created, they are also placed in the array.\nThe code in each of these component objects is similar, and they could be abstracted into classes (prototypes) that components are derived from, if this method seems important enough to do that.\nThe bank can be saved as a dictionary.\nDictionary entries can be dictionaries and arrays, and array entries can be dictionaries and arrays. The midi bank dictionary contains arrays which contain dictionaries which contain arrays. Arbitrary nesting of dictionaries and arrays is possible. Access and modification becomes complicated, which I’ll talk about in section 4.\nTo save a midi bank layout:\nJavascript objects can declare attributes: values that can be accessed like normal max objects. Attributes can be dictionaries. Attribute values can also have custom getters and setters, which means that the attribute value does not have be something actually stored. A getter can dynamically construct it when it is invoked, and a setter can do something other than save the given value.\nThe midi bank thus has an attribute « bank_dict » that, when queried, builds a dictionary from its components’ data. It writes an array of its tracks, calling each of its tracks to give it the required data for its given array index. It calls each track by requesting a dict attribute from the track representing its components. The track builds a dict in the same way, calling its effect components. This process continues until a recursively-built dictionary is completed, then the midi bank passes it to the caller which writes it as a json file.\nTo reload the midi bank, the opposite occurs: the attribute value setter builds the track list by creating each track and then sending it the corresponding track dict so that it can build itself.\nThe actual dict values are at no time saved.\n[EXAMPLE]\nThis can be applied to the entire architecture of a session, including all the players. It will be once we’ve worked out what all the players will be and how they will be arranged.\nBecause of the hierarchical arrangement of dictionaries, the midi bank can have its own set of presets that can be loaded and saved inside the preset of an entire session.\nTo load an entire session including the pattr presets, the architecture dictionary has to be loaded first, and then the preset file.\nBoth the model and the view contain these component objects. Communication between the view and model is in the rightmost wire. Building from these dicts in the model and the view treat the dict like a model, and the model and view become its views.\nCommunication between the control and model during construction must be handled carefully and I’m interested in how to do it better. Originally I thought it would be great to include the dict attributes in the pattr system. Then they could be controlled in the same way that the rest of the parameters are controlled. The problem is this. [SLIDE] Javascript operates on a different (low-priority) thread than Max objects. When it calls Max to creat an object (new default), it passes control to this thread and continues to the next javascript command—we don’t know when the max command will finish in relation to the javascript. As components in the view hierarchy are built, we can’t assume that their analogs in the model are built at the same time. Thus messages cannot be passed from one to the other. Thus we cannot count on the pattr system working when the hierarchies are constructed. It has to use a different system.\nCreating effects: to create a midi effect, several easy standards must be met: MIDI notes follow a given value (list of numbers) MIDI comes in the left inlet and out the left inlet A control/view and a model patch Communication btw control and model occur via pattr, so pattrs with the same name (possibly hierarchic) must exist in both patches Control and model patchers must be put in appropriately named subfolders of a folder titled by the effect name.\nIf you do this, the effect will show up in the effect list. This gives an easy, max-less way for developers to add their own effects.",
    "description": "Dynamic creation and destruction of objects: arrays and dicts Hierarchies Saving and reloading architecture Objects in djazz can be created and destroyed, so you can set up variable numbers of different types of players, and different midi and audio outputs.",
    "tags": [],
    "title": "Going further",
    "uri": "/djazz_doc_website/3_api/7_going_further.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Improviser",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/improviser.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Listener",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/listener.html"
  },
  {
    "breadcrumb": "API",
    "content": "The goals in rewriting Djazz are as follows.\n•\tprepare the software for distribution as a standalone •\tdesign an architecture that is extensible: ⁃\tChanges can be made in one area without creating bugs in other areas (dependence and modularity) ⁃\tnew functionality can be added without changing the existing code base ⁃\tnew functionality is easy to integrate. There are methods (not quite an SDK) for adding functionality. Some methods are more in-depth than others; some only require putting new max patches in properly named and organised folders. •\tdebugging is easy ",
    "description": "The goals in rewriting Djazz are as follows.\n•\tprepare the software for distribution as a standalone •\tdesign an architecture that is extensible: ⁃\tChanges can be made in one area without creating bugs in other areas (dependence and modularity) ⁃\tnew functionality can be added without changing the existing code base ⁃\tnew functionality is easy to integrate.",
    "tags": [],
    "title": "Notes on databases in Max",
    "uri": "/djazz_doc_website/3_api/8_notes_on_rewriting_djazz.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Master Control",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/master_control.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "MIDI Beat Generator",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/midi_beat_generator.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "MIDI Record",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/midi_record.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Main Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "djazz control",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/main_components/djazz_control.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Score Loader",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/score_loader.html"
  },
  {
    "breadcrumb": "API \u003e Index of important abstractions \u003e Other Components",
    "content": "",
    "description": "",
    "tags": [],
    "title": "UDP Send to VJazz",
    "uri": "/djazz_doc_website/3_api/1_abstraction-references/components/to_vjazz.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/djazz_doc_website/categories.html"
  },
  {
    "breadcrumb": "",
    "content": " Djazz est un programme développé depuis 2009 par Marc Chemillier en collaboration avec Gérard Assayag, Jérôme Nika, Mikhail Malt, Jean-Louis Giavitto, Georges Bloch, et Daniel Brown.\nIl s’agit d’un programme de musique générative qui improvise en utilisant du matériel provenant de partitions préenregistrées ou de contributions humaines live.\nNé de l’improvisation jazz, il a été étendu à la world music et à l’électro, et utilise une structure de données connue sous le nom Factor Oracle pour calculer, beat par beat, le matériel à jouer.\nMotivation Djazz était conçu pour s’adapter à différents styles musicaux. L’un des grands enjeux de sa réécriture est de lui donner une conception suffisamment modulaire pour pouvoir modifier facilement le style musical ainsi que l’algorithme de calcul des improvisations.\nFeatures Installation \u0026 Usage Djazz needs no special installation. Download the djazz folder here.\nLicense Djazz is licensed under which License?.\nCredits ",
    "description": "Software for musical co-creativity.",
    "tags": [],
    "title": "Djazz",
    "uri": "/djazz_doc_website/index.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/djazz_doc_website/tags.html"
  }
]
