Copy-Item -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\public\cloudcamp.png' -Destination 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\public\cloudcamp.png' -Force
'copied cloudcamp.png to frontend/public/'
Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\public' -File | ForEach-Object { '{0}  ({1} bytes)' -f $_.Name, $_.Length }
