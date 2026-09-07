param([Parameter(Mandatory=$true)][string]$BackupFile, [switch]$ConfirmRestore)
$ErrorActionPreference = "Stop"
if (-not $ConfirmRestore) { throw "Pass -ConfirmRestore after verifying the target database." }
if (-not $env:DIRECT_DATABASE_URL) { throw "DIRECT_DATABASE_URL is required." }
foreach ($command in @("pg_restore", "gpg")) { if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "$command is required." } }
$source = (Resolve-Path -LiteralPath $BackupFile).Path
$plain = Join-Path $env:TEMP "tamibedford-restore-$([guid]::NewGuid()).dump"
try {
  & gpg --decrypt --output $plain $source
  if ($LASTEXITCODE -ne 0) { throw "gpg decryption failed." }
  & pg_restore --dbname=$env:DIRECT_DATABASE_URL --clean --if-exists --no-owner --no-privileges $plain
  if ($LASTEXITCODE -ne 0) { throw "pg_restore failed." }
} finally { if (Test-Path -LiteralPath $plain) { Remove-Item -LiteralPath $plain -Force } }
