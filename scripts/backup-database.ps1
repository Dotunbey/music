param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference = "Stop"
if (-not $env:DIRECT_DATABASE_URL) { throw "DIRECT_DATABASE_URL is required." }
foreach ($command in @("pg_dump", "gpg")) { if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "$command is required." } }
$resolved = [IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Force -Path $resolved | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$plain = Join-Path $resolved "tamibedford-$stamp.dump"
$encrypted = "$plain.gpg"
try {
  & pg_dump --dbname=$env:DIRECT_DATABASE_URL --format=custom --no-owner --no-privileges --file=$plain
  if ($LASTEXITCODE -ne 0) { throw "pg_dump failed." }
  & gpg --symmetric --cipher-algo AES256 --output $encrypted $plain
  if ($LASTEXITCODE -ne 0) { throw "gpg encryption failed." }
  Write-Output $encrypted
} finally { if (Test-Path -LiteralPath $plain) { Remove-Item -LiteralPath $plain -Force } }
