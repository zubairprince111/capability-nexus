$procs = Get-Process -Name node -ErrorAction SilentlyContinue
foreach ($p in $procs) {
  try { Stop-Process -Id $p.Id -Force -ErrorAction Stop; Write-Host "killed node $($p.Id)" }
  catch { Write-Host "skip $($p.Id) $($_.Exception.Message)" }
}
Start-Sleep 3
$procs2 = Get-Process -Name node -ErrorAction SilentlyContinue
if ($procs2) { Write-Host "STILL: $($procs2.Count)" } else { Write-Host "all gone" }
