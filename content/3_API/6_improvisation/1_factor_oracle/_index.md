+++
title = "Description of the Factor Oracle"
weight = 10
+++


La plus grande étape a été de terminer l'objet factor oracle qui est généralisé pour différents types de données, et l'objet factor_oracle_player pour improviser avec lui.

1. Le patch de l'oracle factor est ici :

patchers/data_structures/factor_oracle/factor_oracle.maxpat

2. Pour utiliser différentes fonctions de comparaison, vous devez écrire un patch Max qui effectue la comparaison des étiquettes. Ensuite, vous pouvez changer la fonction de comparaison dans le patch factor oracle en lui passant le message "comparaison" et le nom du patch de comparaison. Jusqu'à présent, j'ai écrit deux patchs de comparaison :

patchers/data_structures/factor_oracle/compare/fo.compare.equal_chords.maxpat

patchers/data_structures/factor_oracle/compare/fo.compare.equal_chords_in_3_semitone_range.maxpat

Les deux fonctionnent, mais je n'ai pas encore intégré la seconde - c'est-à-dire qu'elle trouve un rythme avec un accord dans une plage de 3 demi-tons (vers le haut ou vers le bas), mais après l'avoir fait, le programme ne préforme pas encore le changement de hauteur sur la sortie MIDI ou audio.
