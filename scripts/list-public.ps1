Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\public' -File | ForEach-Object { '{0}  ({1} bytes)' -f $_.Name, $_.Length }
