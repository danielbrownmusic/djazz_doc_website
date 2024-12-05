+++
title = "Dicts"
weight = 20
+++


Dictionaries in Javascript and pure Max
	Gotchas



4. Dictionary readers and writers

Dictionaries are used in different ways, for representing songs, architecture, and as another example for the launchpad, to keep track of how buttons are mapped to parameters and how parameters are mapped to lights. For this, several different types of dictionaries were required: 

DICTS AND ARRAYS


one containing device-specific data mapping lights to midi and control values, (« DEVICE »)

one containing the actual mappings the user creates, (« MAP »)

One for the the system to read to map launchpad input to parameters, (« CTRL »)

 And one for the system to read mapping parameters to lights. (« VIEW »)


 The structure for each of these dicts can be done in different ways. Some criteria exist:

 The user-created dict must be easy to create, either by editing the text or with a max object

The program-read dicts must be efficient, easily read by the program.

These two criteria are different and ask for different structures. Also, there is not a given good structure for any of these dicts, and we might want to change them later. We might even have to, as new launchpads, and new devices, use different formats.

 So there’s not a general method for structuring these dicts. But we want something general so that we don’t have to rewrite a new patch and dict-accessors for each new launchpad.

 To solve this, we create dict-readers and dict-writes, two types of javascript objects. Each one exports a set of methods that access data or modify data. The implementation of the methods are hidden to the user.
Each one is specific to the context it acts in. The exported methods have the same names, but the implementation is different depending on the structure of the dict it reads or writes to.
Thus, we can use a single javascript object to read the desired dictionaries and then translate them into the format the system needs.
Each reader and writer is imported into the module using a require statement.
If we change or add a new dict format, we write a new reader—which only involves rewriting the implementation of the exported methods—and replace it in the appropriate require field. These can also be jsarguments.
This way, we have translators: objects that take a reader and a writer.