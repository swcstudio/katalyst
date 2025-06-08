path "secret/data/sse/sveltekit/*" {
  capabilities = ["read"]
}

path "secret/data/sse/shared/*" {
  capabilities = ["read"]
}

path "auth/token/lookup-self" {
  capabilities = ["read"]
}

path "auth/token/renew-self" {
  capabilities = ["update"]
}
