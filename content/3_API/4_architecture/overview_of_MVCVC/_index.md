+++
title = "Overview of MVVCC (Model-View-View Controller-View) Architecture"
weight = 30
+++

	1. Architecture
		Model/Control/View Control/View




MVC:

Djazz uses the Model-View-Control design pattern.

The model consists of the objects that do the processing. At the top level, there are various players and the master control just described.

The model is controlled entirely by passing named parameters (not what Max calls “parameters”—I’ll talk about these in a later section) in the message format <variable-name> <variable-value>. These parameters are received in the leftmost inlet. The rightmost inlet is for changes in architecture: adding and subtracting components, which I’ll talk about later.

The control is also the view, since they’re graphical controls, so I’ll refer the bpatcher containing the combined control and view as the view.