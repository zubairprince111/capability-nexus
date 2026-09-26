# Kill all node and next-server processes
$procs = Get-Process -Name node -ErrorAction SilentlyContinue
foreach ($p in $procs) {
  try { Stop-Process -Id $p.Id -Force -ErrorAction Stop; Write-Host "killed node $($p.Id)" }
  catch { Write-Host "skip $($p.Id) $($_.Exception.Message)" }
}
$procs2 = Get-Process -Name next-server -ErrorAction SilentlyContinue
foreach ($p in $procs2) {
  try { Stop-Process -Id $p.Id -Force -ErrorAction Stop; Write-Host "killed next $($p.Id)" }
  catch { Write-Host "skip $($p.Id) $($_.Exception.Message)" }
}
Start-Sleep 2
$still = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($still) { Write-Host "STILL bound ($($still.Count))" } else { Write-Host "port 3000 free" }
