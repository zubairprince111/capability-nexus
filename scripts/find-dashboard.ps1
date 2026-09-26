$dir = 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\.next\static\chunks\app\dashboard'
if (Test-Path $dir) {
  Get-ChildItem $dir -File | ForEach-Object { 'dashboard: ' + $_.Name }
}
$dir = 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\.next\static\chunks\app\analyze'
if (Test-Path $dir) {
  Get-ChildItem $dir -File | ForEach-Object { 'analyze: ' + $_.Name }
}
$dir = 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\.next\static\chunks\app\profile'
if (Test-Path $dir) {
  Get-ChildItem $dir -Recurse -File | ForEach-Object { 'profile: ' + $_.Name }
}
$dir = 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\.next\static\chunks\app\organizations'
if (Test-Path $dir) {
  Get-ChildItem $dir -Recurse -File | ForEach-Object { 'organizations: ' + $_.Name }
}
$dir = 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend\.next\static\chunks\app\settings'
if (Test-Path $dir) {
  Get-ChildItem $dir -File | ForEach-Object { 'settings: ' + $_.Name }
}
