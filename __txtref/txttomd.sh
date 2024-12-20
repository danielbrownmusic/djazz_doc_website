#!/bin/bash

name=$(echo "$1" | sed -E "s/(.*)\..*$/\1/")
mdfile="$name.md"

# TITLE
echo "+++\ntitle = \"$name\"\nweight = \2\n+++" > $mdfile

cat $1 |
gsed -E 's/^([0-9]+)/### \1 \&emsp; /' |
gsed -E '/MESSAGES/,/SEE ALSO/ { //! { /(^-|^$)/! { s/_/\\_/; s/.*/_&_/ }}}' |
gsed -E 's/^-//' |
gsed -E 's/(INLETS|OUTLETS|MESSAGES|SEE ALSO)/##### \1/' |
gsed -E 's/\b(bang|int|float|list|anything)\b/_\1_/g' > $mdfile


# # n_messages=`grep -En '^MESSAGES' | cut -d: -f1`
# # n_seealso=`grep -En '^SEE ALSO' | cut -d: -f1`

# # page=""

# # for i in `seq $((n_messages + 1)) $((n_seealso + 1))`
# # do
# #     new_page=`sed -n 'i s/^\/(.+\/)*([^ ]+)/\1/p'`
# #     if [[ $new_page ]]
# #     then page=$new_page
# #     fi
    
# # echo boo
# # fi
# # done


# # cat $1 | gsed -En '/MESSAGES/,/SEE ALSO/    {
# #     s/MESSAGES/### &  /p
# #     /^(\/|\-|\()/! s/(^[^ ]+)(.*)/[\1]()\2  /p
# #     /^(\/|\-|\()/ s/.*/&  /p


# # }'

# # cat $1 | gsed -En '/^SEE ALSO/,$ { s/^SEE ALSO/# SEE ALSO/p;
# #                                     /# SEE ALSO/! s/(^[^ ]+) +([^ ]+)/[\1](\2)/p
# #                                     }'