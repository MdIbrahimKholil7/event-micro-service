param(
  [Parameter(Mandatory = $true)][ValidateSet("auth", "event")] [string]$Service,
  [Parameter(Mandatory = $true)][string]$InputPath
)

if (-not (Test-Path -LiteralPath $InputPath)) {
  throw "Input file not found: $InputPath"
}

if ($Service -eq "auth") {
  Get-Content -LiteralPath $InputPath | docker compose exec -T postgres-auth psql -U auth_user -d auth_db
} else {
  Get-Content -LiteralPath $InputPath | docker compose exec -T postgres-event psql -U event_user -d event_db
}
