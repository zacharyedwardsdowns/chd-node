param([string]$command, [string]$name, [string]$directory)

[string[]] $commands = @('add', 'list', 'delete', 'uninstall', 'windows', 'help', 'rename')
[string] $result = ""

[int32] $index = "$PSScriptRoot".LastIndexOf("\")
[int32] $remove = "$PSScriptRoot".Length - "$PSScriptRoot".LastIndexOf("\")
[string] $chdDir = "$PSScriptRoot".Remove($index, $remove);
[string] $chd = "$chdDir\chd-node.js"

if ( $directory -eq "") {
  $directory = $PWD
}
else {
  $directory = Resolve-Path $directory
}

if ( $commands -contains $command ) {
  if ( $name -eq "" ) {
    node.exe "$chd" "$command"
  }
  elseif ( $directory -eq "" ) {
    node.exe "$chd" "$command" "$name"
  }
  else {
    node.exe "$chd" "$command" "$name" "$directory"
  }
}
else {
  if ( $command -eq "" ) {
    node.exe "$chd"
  }
  else {
    $result = @(node.exe "$chd" "$command")
    if (Test-Path $result) {
      Set-Location $result 
    }
    else {
      node.exe "$chd" "$command"
    }
  }
}