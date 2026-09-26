Write-Host '--- prev-front/ ---'
Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\prev-front' -Recurse -File | Select-Object -First 30 | ForEach-Object { Write-Host $_.FullName.Replace('F:\AI5k v0.1\figma-vision\capability-nexus\','') }
Write-Host ''
Write-Host '--- ai-backend/ ---'
Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\ai-backend' -Recurse -File | Select-Object -First 30 | ForEach-Object { Write-Host $_.FullName.Replace('F:\AI5k v0.1\figma-vision\capability-nexus\','') }
Write-Host ''
Write-Host '--- public/ (root) ---'
Get-ChildItem -Path 'F:\AI5k v0.1\figma-vision\capability-nexus\public' -Recurse -File | ForEach-Object { Write-Host $_.FullName.Replace('F:\AI5k v0.1\figma-vision\capability-nexus\','') }
