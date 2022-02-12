#!/usr/bin/env bash

dir="$(dirname -- "${BASH_SOURCE[0]}")"

if [ "$1" == "list" ] || [ "$1" == "add" ] || [ "$1" == "delete" ]; then
  node "$dir/chd-node.js" "$1" "$2" "$3"
else
  # Run using .exe if Windows.
  if [ "$OSTYPE" == "msys" ]; then
    result=$(node.exe "$dir/chd-node.js" "$1")
  else
    result=$(node "$dir/chd-node.js" "$1")
  fi
  if [ -d "$result" ]; then
    cd "$result"
  else
    echo "$result"
  fi
fi
