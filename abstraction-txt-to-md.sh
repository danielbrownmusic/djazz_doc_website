#!/bin/bash

# title
cat $1 | sed -En '1 s/(.+) +([0-9]+)/+++\ntitle = "\1"\nweight = \2\n+++/p; q'

# digest and description
cat $1 | sed -En '3 s/(.+)/######\1/p;q'
cat $1 | sed -En '4 s/(.+)/######\1/p;q'


cat $1 | gsed -En '/INLETS/,/OUTLETS/    {  
                                            s/INLETS/\n# INLETS/p; 
                                            /^[0-9]+/ {   
                                                s/(^[0-9]+)/\n### \1 \&emsp; /; 
                                                s/([^ ]+)([^#0-9;]) /_\1\2_\//g 
                                                p;
                                                n;
                                                s/.*/###### &/;p } 
                                            
                                            /int|float|list|anything|symbol/ {
                                                s/(^[^ ]+)/**\1**:/p
                                            }
                                        }'


cat $1 | gsed -En '/OUTLETS/,/ATTRIBUTES/    {  
                                            s/^OUTLETS/\n# OUTLETS/p; 
                                            /^[0-9]+/ { 
                                               s/(^[0-9]+)/### \1 \&emsp; /; 
                                                s/([^ ]+)$/_\1_/p;
                                                n;
                                                s/.*/\n###### &/;p }
                                            }'

cat $1 | gsed -En '/ATTRIBUTES/,/MESSAGES/    {  
                                            s/^ATTRIBUTES/\n# ATTRIBUTES/p; 
                                            /^ *$/ {
                                                p
                                                n
                                                {s/(^[^ ]+)/### \1 \&emsp; /
                                                s/; +([^ ]+)/ _\1_ \&emsp; /
                                                s/g s$/(get\/set)/
                                                s/s$/(set)/
                                                s/g$/(get)/ 
                                                p
                                                n
                                                s/.*/###### &/p
                                                n
                                                p
                                                }
                                                    }
                                                }'


cat $1 | gsed -En '/MESSAGES/,/SEE ALSO/    {  
                                            s/^MESSAGES/\n# MESSAGES/p; 
                                            /^ *$/ {
                                                p
                                                n
                                                {   s/(^[^ ]+)/### _\1_/
                                                    p
                                                    n
                                                    s/.*/###### &/p
                                                    n
                                                    p
                                                    }
                                                    }
                                                }'
# 
#                                             
# s/;([^ ]+)/_\1_ \&emsp; /
#  }
