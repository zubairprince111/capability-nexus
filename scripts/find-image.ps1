Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus' -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match '\.(png|jpg|jpeg|svg|webp|gif)$' } |
  ForEach-Object { '{0}  ({1} bytes)' -f $_.FullName.Replace('F:\AI5k v0.1\figma-vision\capability-nexus\',''), $_.Length }
