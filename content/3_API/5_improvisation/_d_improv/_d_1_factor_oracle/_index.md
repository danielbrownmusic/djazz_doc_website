+++
title = "Description of the Factor Oracle"
weight = 10
+++


The biggest step was to complete the factor oracle object, which is generalized for different data types, and the factor_oracle_player object for improvising with it.

1. The oracle factor patch is here:

patchers/data_structures/factor_oracle/factor_oracle.maxpat

2. To use different comparison functions, you need to write a Max patch that performs the label comparison. Then you can change the comparison function in the oracle factor patch by passing it the “comparison” message and the name of the comparison patch. So far, I've written two comparison patches:

patchers/data_structures/factor_oracle/compare/fo.compare.equal_chords.maxpat

patchers/data_structures/factor_oracle/compare/fo.compare.equal_chords_in_3_semitone_range.maxpat

Both work, but I haven't yet integrated the second - i.e. it finds a rhythm with a chord in a range of 3 semitones (up or down), but after doing so, the program still doesn't preform the pitch change on the MIDI or audio output.
