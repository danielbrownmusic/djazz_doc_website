+++

title = "component template "
weight = 1000
+++


{{<mermaid align="left">}}
flowchart TB;

Abstraction1((Abstraction\n1))
Abstraction2[Abstraction\n2]
Abstraction3(((Abstraction\n3)))

click Abstraction1 "./../components/abstraction2.html" "Abstraction2"
click Abstraction2 "abstraction1.html" "Abstraction1"


Abstraction1--->Abstraction2
Abstraction1--->Abstraction3
Abstraction2--->Abstraction3

{{< /mermaid >}}

###### Digest
Description

# INLETS

### 0 &emsp; _type1/type2/type3_
###### digest
**type1**: description
**type2**: description
**type3**: description

### 1 &emsp; _type1/type2/type3_
###### digest
**type1**: description
**type2**: description
**type3**: description

# OUTLETS

### 0 &emsp; _type_
###### digest
description

### 1 &emsp; _type_
###### digest
description

# ATTRIBUTES

### attribute_1 &emsp; _type_  &emsp; (set/get) 
###### digest
definition

### attribute_2 &emsp; _type_  &emsp; (set/get) 
###### digest
definition

# MESSAGES
### _message1_  
###### Left inlet: 0 turns off, anything else turns on. Default is on.  
  

# SEE ALSO
[another abstraction](/path/to/abstraction)
      