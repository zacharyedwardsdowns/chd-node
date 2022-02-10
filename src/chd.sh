commands=('list', 'add', 'delete')

if [[ " ${commands[*]} " =~ " $1 " ]]; then
  node chd.js $1 $2 $3
else
  result=$(node.exe chd.js $1)
  if [ -d "$result" ]; then
    cd "$result"
  else
    echo "$result"
  fi
fi
