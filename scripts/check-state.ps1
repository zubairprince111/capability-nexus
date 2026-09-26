"--- ipv4 ---"
Get-NetTCPConnection -LocalPort 3000 -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess, State | Format-Table -AutoSize
"--- ipv6 ---"
Get-NetTCPConnection -LocalPort 3000 -AddressFamily IPv6 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess, State | Format-Table -AutoSize
"--- node procs ---"
Get-Process -Name node -ErrorAction SilentlyContinue |
  Select-Object Id, ProcessName, Path | Format-Table -AutoSize
"--- next ---"
Get-Process -Name "next-server*" -ErrorAction SilentlyContinue | Format-Table -AutoSize
"--- listening 3000 v4 ---"
$l4 = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties()
"--- last 50 lines cmd log ---"
$log = "$env:USERPROFILE\.puku\last_cmd.log"
if (Test-Path $log) { Get-Content -Tail 50 $log }
