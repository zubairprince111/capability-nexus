Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess, @{n="PID";e={ $_.OwningProcess } } |
  Format-Table -AutoSize
"---"
Get-Process | Where-Object { $_.ProcessName -match "node|next" } |
  Select-Object Id, ProcessName, @{n="CmdLine";e={ try { (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)" -ErrorAction SilentlyContinue).CommandLine } catch { "n/a" } }} |
  Format-Table -AutoSize -Wrap
