#!/bin/bash

cat $1 | sed -En '1 s/(.+) +([0-9]+)/+++\ntitle = "\1"\nweight = \2\n+++/p; q'

cat $1 | sed -En '3 s/(.+)/######\1/p;q'
cat $1 | sed -En '4 s/(.+)/######\1/p;q'


cat $1 | gsed -En '/INLETS/,/OUTLETS/    {  
                                            s/INLETS/\n# INLETS/p; 
                                            /^[0-9]+/ {   
                                                s/ /_\/_/g;
                                                s/(^[0-9]+)_\//\n### \1 \&emsp; /
                                                s/$/_/p;
                                                n;
                                                s/.*/###### &/p
                                            }
                                            /# INLETS|OUTLETS/! s/(^[^# ]+)/_\1_/p
                                        }'

cat $1 | gsed -En '/OUTLETS/,/ATTRIBUTES/    {  
                                            s/^OUTLETS/\n# OUTLETS/p; 
                                            /^[0-9]+/ { 
                                               s/(^[0-9]+)/\n### \1 \&emsp; /; 
                                                s/([^ ]+)$/_\1_/p;
                                                n;
                                                s/.*/###### &/p 
                                                n
                                                p}
                                            }'

# cat $1 | gsed -En '/ATTRIBUTES/,/MESSAGES/  {  
#                                             s/^(ATTRIBUTES|MESSAGES)/\n# \1/p; 
#                                             /(^ *$|ATTRIBUTES|MESSAGES)/! {s/(^[^ ]+)/\n### \1 \&emsp; /
#                                                         s/; +([^ ]+)/ _\1_ \&emsp; /
#                                                         s/g s$/(get\/set)/
#                                                         s/s$/(set)/
#                                                         s/g$/(get)/ 
#                                                         p
#                                                         n
#                                                         s/.*/###### &/p
#                                                         n
#                                                         p
#                                                         }
#                                                 }'

cat $1 | gsed -En 's/ATTRIBUTES/### &  \nNone  \n/p'


# cat $1 | gsed -En '/MESSAGES/,/SEE ALSO/    {  
#                                             /^ *$/ {
#                                                 p
#                                                 n
#                                                 {   /SEE ALSO/! { s/(^[^ ]+)/### _\1_/
#                                                     p
#                                                     n
#                                                     s/.*/###### &/p
#                                                     n
#                                                     p
#                                                     }
#                                                     }
#                                                     }
#                                                 }'


n_messages=`grep -En '^MESSAGES' | cut -d: -f1`
n_seealso=`grep -En '^SEE ALSO' | cut -d: -f1`

page=""

for i in `seq $((n_messages + 1)) $((n_seealso + 1))`
do
    new_page=`sed -n 'i s/^\/(.+\/)*([^ ]+)/\1/p'`
    if [[ $new_page ]]
    then page=$new_page
    fi
    
echo boo
fi
done


cat $1 | gsed -En '/MESSAGES/,/SEE ALSO/    {
    s/MESSAGES/### &  /p
    /^(\/|\-|\()/! s/(^[^ ]+)(.*)/[\1]()\2  /p
    /^(\/|\-|\()/ s/.*/&  /p


}'

cat $1 | gsed -En '/^SEE ALSO/,$ { s/^SEE ALSO/# SEE ALSO/p;
                                    /# SEE ALSO/! s/(^[^ ]+) +([^ ]+)/[\1](\2)/p
                                    }'