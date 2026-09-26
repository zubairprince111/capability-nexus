$port = 3000
$conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
$ids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($id in $ids) {
  try { Stop-Process -Id $id -Force -ErrorAction Stop; Write-Host "killed $id" }
  catch { Write-Host "skip $id $($_.Exception.Message)" }
}
Start-Sleep 2
$still = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($still) { Write-Host "STILL bound ($($still.Count))"; exit 1 } else { Write-Host "port $port free" }
