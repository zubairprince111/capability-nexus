# Cleanup script — removes files that are confirmed unused.
# Each removal is logged with the reason.

$base = 'F:\AI5k v0.1\figma-vision\capability-nexus'

Write-Host '=== Removing AppHeader.tsx (unreferenced) ==='
Remove-Item -LiteralPath (Join-Path $base 'frontend\src\components\layout\AppHeader.tsx') -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $base 'frontend\src\components\layout\AppHeader.tsx')) {
  Write-Host '  FAIL'
} else {
  Write-Host '  ok'
}

Write-Host '=== Removing root public/ (duplicates of frontend/public/) ==='
Remove-Item -LiteralPath (Join-Path $base 'public') -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $base 'public')) {
  Write-Host '  FAIL'
} else {
  Write-Host '  ok'
}

Write-Host '=== Removing prev-front/ (stale previous frontend) ==='
Remove-Item -LiteralPath (Join-Path $base 'prev-front') -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $base 'prev-front')) {
  Write-Host '  FAIL'
} else {
  Write-Host '  ok'
}

Write-Host '=== Removing ai-backend/ (leftover) ==='
Remove-Item -LiteralPath (Join-Path $base 'ai-backend') -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $base 'ai-backend')) {
  Write-Host '  FAIL'
} else {
  Write-Host '  ok'
}

Write-Host '=== Removing frontend/next.log (old build log) ==='
Remove-Item -LiteralPath (Join-Path $base 'frontend\next.log') -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $base 'frontend\next.log')) {
  Write-Host '  FAIL'
} else {
  Write-Host '  ok'
}

Write-Host ''
Write-Host '=== Done ==='
