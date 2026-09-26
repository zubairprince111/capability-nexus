Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\src' -Recurse -File |
  ForEach-Object { '{0}' -f $_.FullName.Replace('F:\AI5k v0.1\figma-vision\capability-nexus\frontend\','') }
