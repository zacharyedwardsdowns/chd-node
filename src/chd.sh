#!/usr/bin/env bash

command="$1"
name="$2"
directory="$3"

dir="$(dirname -- "${BASH_SOURCE[0]}")"

if [ -z "$directory" ] || [ "$directory" == "." ]; then
  directory=$(readlink --canonicalize "$PWD")
fi

if [ "$command" == "list" ] || [ "$command" == "add" ] || [ "$command" == "delete" ]; then
  node "$dir/chd-node.js" "$command" "$name" "$directory"
else
  # Run using .exe if Windows.
  if [ "$OSTYPE" == "msys" ]; then
    result=$(node.exe "$dir/chd-node.js" "$command")
  else
    result=$(node "$dir/chd-node.js" "$command")
  fi
  if [ -d "$result" ]; then
    cd "$result"
  else
    echo "$result"
  fi
fi
