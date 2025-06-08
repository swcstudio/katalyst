resource "vault_policy" "sse_marketing" {
  name   = "sse-marketing"
  policy = file("${path.module}/../vault/policies/sse-marketing.hcl")
}

resource "vault_policy" "sse_blog" {
  name   = "sse-blog"
  policy = file("${path.module}/../vault/policies/sse-blog.hcl")
}

resource "vault_policy" "sse_storefront" {
  name   = "sse-storefront"
  policy = file("${path.module}/../vault/policies/sse-storefront.hcl")
}

resource "vault_policy" "sse_docs" {
  name   = "sse-docs"
  policy = file("${path.module}/../vault/policies/sse-docs.hcl")
}

resource "vault_policy" "sse_remix" {
  name   = "sse-remix"
  policy = file("${path.module}/../vault/policies/sse-remix.hcl")
}

resource "vault_policy" "sse_sveltekit" {
  name   = "sse-sveltekit"
  policy = file("${path.module}/../vault/policies/sse-sveltekit.hcl")
}

resource "vault_auth_backend" "nomad" {
  type = "nomad"
  path = "nomad"
}

resource "vault_generic_secret" "sse_shared" {
  path = "secret/sse/shared"
  
  data_json = jsonencode({
    database_url = var.database_url
    redis_url    = var.redis_url
    jwt_secret   = var.jwt_secret
  })
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
  sensitive   = true
}

variable "redis_url" {
  description = "Redis connection URL"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}
