#!/bin/sh

if [ -z ${THREESSERVER+x} ]; then
  echo "\$THREESSERVER is unset"
  exit
fi

if [ -z ${THREESSECRET+x} ]; then
  echo "\$THREESSECRET is unset"
  exit
fi

MAGIC=`curl -fsSL $THREESSERVER 2>&1 | head -c2`
if [ $MAGIC != "3s" ]; then
  echo "$THREESSERVER is not a 3s server"
  exit
fi

TEMP=`mktemp -t 3s`
screencapture -s $TEMP
curl -fsSL -XPOST -H"Authorization: Basic $THREESSECRET" -F"file=@$TEMP" \
  $THREESSERVER | pbcopy
echo `pbpaste`
rm $TEMP
