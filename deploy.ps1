# Deploy folio.jonbailey.xyz to Cloudflare Pages
# Uses CLOUDFLARE_API_TOKEN from the environment. Does not name a personal account.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Dist = Join-Path $Root "dist"
$Project = if ($env:FOLIO_PAGES_PROJECT) { $env:FOLIO_PAGES_PROJECT } else { "folio-jonbailey" }
$Domain = "folio.jonbailey.xyz"

if (-not (Test-Path (Join-Path $Dist "index.html"))) {
  Write-Error "Missing dist/index.html - run npm run build first"
}
if (-not (Test-Path (Join-Path $Dist "og.jpg"))) {
  Write-Error "Missing dist/og.jpg"
}

Write-Host "[DEPLOY] Folio Pages project=$Project"
Push-Location $Root
try {
  npx --yes wrangler@4 pages deploy $Dist --project-name=$Project --branch main --commit-dirty=true
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "Site:    https://$Domain/"
Write-Host "Preview: https://$Project.pages.dev/"
Write-Host "Source:  $Root"
