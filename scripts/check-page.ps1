$r = Invoke-WebRequest -UseBasicParsing http://localhost:3000/dashboard
$body = $r.Content
$hits = @(
  "Profile readiness","SourcePill","KPI strip","Focus","Dimension breakdown",
  "Identity rail","Activity stream","Radial","sticky top-0","Sources"
)
foreach ($h in $hits) {
  $found = $body.Contains($h)
  "{0} : {1}" -f $h, $found
}
"--- size ---"
$r.Content.Length
