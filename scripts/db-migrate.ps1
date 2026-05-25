param(
  [Parameter(Mandatory = $true)][ValidateSet("auth", "event")] [string]$Service
)

if ($Service -eq "auth") {
  docker compose exec auth-service npm run db:migrate
} else {
  docker compose exec event-service npm run db:migrate
}
