$chunk = 'page-67f3e13cf32c1982.js'
$path = "F:\AI5k v0.1\figma-vision\capability-nexus\frontend\.next\static\chunks\app\profile\me\skills\$chunk"
if (Test-Path $path) {
  $c = Get-Content -Raw $path
  "size: {0}" -f $c.Length
  "has SkillsEditor: {0}" -f $c.Contains("SkillsEditor")
  "has listSkillClaims: {0}" -f $c.Contains("listSkillClaims")
  "has skill_category: {0}" -f $c.Contains("skill_category")
  "has catBySkillId: {0}" -f $c.Contains("catBySkillId")
  "has suggest in code: {0}" -f $c.Contains("sugg")
} else {
  Write-Host "chunk not found at $path"
}
