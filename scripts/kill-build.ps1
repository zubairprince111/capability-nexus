if ($env:USERPROFILE) {
  $log = Join-Path $env:USERPROFILE ".puku\last_cmd.log"
  if (Test-Path $log) {
    Get-Content -Tail 80 $log
  }
}
