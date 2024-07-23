+++
title = "The Factor Oracle Player"
weight = 20
+++


7. Le "factor oracle player" qui prend les étiquettes une par une, qui peuvent être de n'importe quelle forme (mais dans le programme actuel, c'est un dictionnaire avec deux entrées : la racine de l'accord et l'étiquette de l'accord), et utilise un factor oracle pour produire un battement qui correspond à l'étiquette. Il fonctionne de la même manière que la version LISP : vous définissez la continuité maximale et il tente de s'y adapter. Lorsque la continuité maximale est atteinte, il prend un lien de suffixe et recherche une étiquette correspondante. Si aucune étiquette correspondante n'est trouvée, il choisit un état aléatoire :

patchers/factor_oracle_player/factor_oracle_player.maxpat


8. L'implémentation du lecteur d'oracle factoriel est presque terminée. En ce qui concerne l'écriture de nouvelles partitions d'antescofo improvisées à partir d'anciennes partitions, le patch inachevé est ici :

patchers/improvise_antescofo/djazz.improvise_antescofo.maxpat

Lorsque le bouton "NEW" est pressé, il lit la partition antescofo actuelle dans la mémoire (en la convertissant en un objet Max dict) (ceci est fait avec Javascript), puis exécute le lecteur factor oracle pour générer une succession différente de rythmes pour chaque canal demandé, en mappant ces rythmes à différents canaux (non utilisés), et en combinant le tout à nouveau dans un Max dict. 
 Le contenu des canaux d'origine n'est pas modifié, comme vous l'avez demandé ; seul le nouveau contenu des nouveaux canaux est ajouté. 

Ce qui n'est PAS fait, c'est d'écrire le nouveau Max dict dans une partition antescofo. Cela doit être fait en Javascript, car le temps de passage des notes doit être trié et les nouveaux temps delta calculés, ce qui serait difficile à faire dans Max. Cela ne prendra pas beaucoup de temps à terminer, je ne l'ai simplement pas fait ; je peux le faire lundi prochain. 

9. Le factor oracle player fonctionne de la même manière pour les improvisateurs audio, mais il n'écrit aucune partition (donc pas de Javascript ici) : il envoie simplement des données aux objets supervp pour qu'ils jouent à partir du tampon audio (enregistré ou chargé) :

patchers/improvise_oracles/djazz_audio_oracle_players.maxpat

Ce patch est encore buggy en termes d'interface/implémentation et je dois passer mardi prochain à le debugger.