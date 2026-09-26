$body = (Invoke-WebRequest -UseBasicParsing http://localhost:3000).Content
$matches = [regex]::Matches($body, '<link[^>]*rel="[^"]*icon[^"]*"[^>]*>')
foreach ($m in $matches) { $m.Value }
