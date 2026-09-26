$body = (Invoke-WebRequest -UseBasicParsing "http://localhost:3000/profile/me/skills" -ErrorAction Stop).Content
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$checks = @(
  "Skills", "Add a skill", "Your claims", "From your CV",
  "consent", "evidenced", "Skill claims", "skill claims", "page-cab6225ece147f92", "Profile/me"
)
foreach ($c in $checks) {
  $found = $body.Contains($c)
  "{0,-40} : {1}" -f $c, $found
}
"size : {0}" -f $body.Length
