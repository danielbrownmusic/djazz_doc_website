#!/bin/bash

name=$(echo "$1" | sed -E "s/(.*)\..*$/\1/")
maxreffile="$name.maxref.xml"

# TITLE

head -n3 djazz-maxref-header.xml > $maxreffile

echo "<c74object name=\"$name\" module=\"max\" category=\"djazz\">" >> $maxreffile
 
gsed -En '1i <digest>
p
1a <\/digest>
q' $1 >> $maxreffile

head -n10 djazz-maxref-header.xml | tail -n5 >> $maxreffile

echo '<description>' >> $maxreffile
gsed -En '3,/INLETS/ { /INLETS/!p}' $1 >> $maxreffile

gsed -En '/INLETS/,$ p' $1 |
gsed -E 's/INLETS/<\/description>\n&/' |
gsed -E '/INLETS/,/OUTLETS/ { //!  { /^[0-9]/ { s/^([0-9]+) (.+)/\t<inlet id="\1" type="\2">/; 
a \\t <digest>
n
s/^-//
a \\t <\/digest>
a \\t <description>
n
s/^-//
a \\t <\/description>
}}}' |

gsed -E '/OUTLETS/,/MESSAGES/ { //!  { /^[0-9]/ { s/^([0-9]+) (.+)/ <outlet id="\1" type="\2">/; 
a   <digest>
n
s/^-//
a   <\/digest>
a   <description>
n
s/^-//
a   <\/description>
}}}' |
gsed -E '/MESSAGES/,/SEE ALSO/ { //!  { /^($|^-)/! { s/(.+)/<method name="\1">/;
a <digest>
n
s/^-//
a <\/digest>
a <description>
n
s/^-//
a <\/description>
a <\/method>
}}}' |
gsed -E '/SEE ALSO/,$ { //! { s/(.*)/<seealso name="\1"\/>/ }}' |
gsed -E 's/INLETS/<inletlist>/' |
gsed -E 's/OUTLETS/<\/inletlist>\n\n<outletlist>/' |
gsed -E 's/MESSAGES/<\/outletlist>\n\n<methodlist>/' |
gsed -E 's/SEE ALSO/<\/methodlist>\n\n<seealsolist>/' |
gsed -E '$a <\/seealsolist>' >> $maxreffile
# |
# gsed -E '/MESSAGES/,/SEE ALSO/ { //! { /(^-|^$)/! { s/_/\\_/; s/.*/_&_/ }}}' |
# gsed -E 's/^-//' |
# gsed -E 's/(INLETS|OUTLETS|MESSAGES|SEE ALSO)/##### \1/' |
# gsed -E 's/\b(bang|int|float|list|anything)\b/_\1_/g' 
