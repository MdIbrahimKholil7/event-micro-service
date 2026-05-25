param(
  [Parameter(Mandatory = $true)][ValidateSet("auth", "event")] [string]$Service,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

$resolvedPath = Resolve-Path -LiteralPath (Split-Path -Parent $OutputPath) -ErrorAction SilentlyContinue
if (-not $resolvedPath) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputPath) | Out-Null
}

if ($Service -eq "auth") {
  docker compose exec -T postgres-auth pg_dump -U auth_user -d auth_db --clean --if-exists > $OutputPath
} else {
  docker compose exec -T postgres-event pg_dump -U event_user -d event_db --clean --if-exists > $OutputPath
}
