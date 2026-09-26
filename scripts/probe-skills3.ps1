$body = (Invoke-WebRequest -UseBasicParsing 'http://localhost:3000/profile/me/skills').Content
$matches = [regex]::Matches($body, 'skills/page-([0-9a-f]+)\.js')
foreach ($m in $matches) { 'hash: ' + $m.Groups[1].Value }
