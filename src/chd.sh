#!/usr/bin/env bash
export FORCE_COLOR="1"

result=""
command="$1"
name="$2"
directory="$3"

chd="$(dirname -- "${BASH_SOURCE[0]}")/chd-node.js"

if [ -z "$directory" ] || [ "$directory" == "." ]; then
  directory=$(readlink --canonicalize "$PWD")
fi

if [ "$command" == "list" ] || [ "$command" == "add" ] || [ "$command" == "delete" ]; then
  if [ -z "$name" ]; then
    node "$chd" "$command"
  elif [ -z "$directory" ]; then
    node "$chd" "$command" "$name"
  else
    node "$chd" "$command" "$name" "$directory"
  fi
else

  # Run using .exe if Windows.
  if [ "$OSTYPE" == "msys" ] && [ ! -z "$command" ]; then
    result=$(node.exe "$chd" "$command")
  else
    if [ -z "$command" ]; then
      node "$chd"
    else
      result=$(node "$chd" "$command")
    fi
  fi
  if [ -d "$result" ]; then
    cd "$result"
  else
    echo "$result"
  fi
fi
