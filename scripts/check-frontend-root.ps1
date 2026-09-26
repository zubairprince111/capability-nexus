Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend' -Force | Where-Object { $_.Name -notin @('.next','node_modules') } | ForEach-Object { Write-Host $_.Name }
