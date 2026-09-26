# Kill any node procs and restart server
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
  Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}
Start-Sleep 2
Set-Location -LiteralPath 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend'
$proc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npx next start -p 3000' -WorkingDirectory 'F:\AI5k v0.1\figma-vision\capability-nexus\frontend' -RedirectStandardOutput 'C:\Users\user\Desktop\next.log' -RedirectStandardError 'C:\Users\user\Desktop\next-err.log' -WindowStyle Hidden -PassThru
Write-Host "started PID $($proc.Id)"
