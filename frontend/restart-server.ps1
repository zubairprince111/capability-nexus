#!/usr/bin/env pwsh
$ErrorActionPreference = 'SilentlyContinue'
$procs = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $procs) { if ($p) { Stop-Process -Id $p -Force } }
Start-Sleep -Seconds 2
Set-Location 'f:\AI5k v0.1\figma-vision\capability-nexus\frontend'
& npm run build 2>&1 | Select-Object -Last 5
& npx next start -p 3000
