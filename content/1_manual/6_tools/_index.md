+++
title = "Tools"
weight = 60
+++


3. Il existe également une structure de données pour les "données de la grille", afin de faciliter le chargement, l'enregistrement et la recherche de rythmes :

patchers/data_structures/grid_data/grid_data.maxpat

4. Les données de la grille sont sauvegardées dans les fichiers .json des chansons que j'utilise depuis le début. Il existe un patch pour créer les données de la grille à la main, que je vous ai montré précédemment :

patchers/data_file_makers/djazz_make_grid.maxpat

5. Il existe également un correctif qui permet de couper et de coller les listes lisp des données de la grille à partir des fichiers "GridData.lisp", ce qui les convertira en dictionnaire, les ajoutera au fichier de chansons associé et réenregistrera le fichier : 

patchers/data_file_makers/djazz_lisp_grid_to_dict.maxpat

Pour l'instant, j'ai ajouté les données de la grille à quelques chansons pour les tester : "AllINeed", "AllOfMe" et "AutumnLeaves".