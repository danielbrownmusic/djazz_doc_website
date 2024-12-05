+++
title = "The Factor Oracle Player"
weight = 20
+++


7. The “factor oracle player” which takes labels one by one, which can be of any form (but in the current program, it's a dictionary with two entries: the chord root and the chord label), and uses a factor oracle to produce a beat that matches the label. It works in the same way as the LISP version: you define the maximum continuity and it tries to match it. When the maximum continuity is reached, it takes a suffix link and searches for a matching label. If no matching label is found, it chooses a random state:

patchers/factor_oracle_player/factor_oracle_player.maxpat


8. The implementation of the factorial oracle player is almost complete. As for writing new improvised antescofo partitions from old ones, the unfinished patch is here:

patchers/improvise_antescofo/djazz.improvise_antescofo.maxpat

When the “NEW” button is pressed, it reads the current antescofo partition from memory (converting it into a Max dict object) (this is done with Javascript), then runs the factor oracle player to generate a different succession of rhythms for each requested channel, mapping these rhythms to different (unused) channels, and combining everything again into a Max dict. 
 The content of the original channels is not modified, as you requested; only the new content of the new channels is added. 

What is NOT done is to write the new Max dict into an antescofo partition. This has to be done in Javascript, as the note times have to be sorted and the new delta times calculated, which would be difficult to do in Max. It won't take long to finish, I just haven't done it yet; I can do it next Monday. 

9. The factor oracle player works the same way for audio improvisers, but it doesn't write any scores (so no Javascript here): it simply sends data to supervp objects to play from the audio buffer (recorded or loaded):

patchers/improvise_oracles/djazz_audio_oracle_players.maxpat

