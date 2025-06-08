terraform {
  required_providers {
    nomad = {
      source  = "hashicorp/nomad"
      version = "~> 2.0"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 4.0"
    }
  }
}

provider "nomad" {
  address = var.nomad_address
  region  = var.nomad_region
}

provider "vault" {
  address = var.vault_address
}

variable "nomad_address" {
  description = "Nomad cluster address"
  type        = string
  default     = "http://localhost:4646"
}

variable "nomad_region" {
  description = "Nomad region"
  type        = string
  default     = "global"
}

variable "vault_address" {
  description = "Vault address"
  type        = string
  default     = "http://localhost:8200"
}

resource "nomad_job" "sse_marketing" {
  jobspec = file("${path.module}/../nomad/jobs/sse-marketing.nomad")
}

resource "nomad_job" "sse_blog" {
  jobspec = file("${path.module}/../nomad/jobs/sse-blog.nomad")
}

resource "nomad_job" "sse_storefront" {
  jobspec = file("${path.module}/../nomad/jobs/sse-storefront.nomad")
}

resource "nomad_job" "sse_docs" {
  jobspec = file("${path.module}/../nomad/jobs/sse-docs.nomad")
}

resource "nomad_job" "sse_remix" {
  jobspec = file("${path.module}/../nomad/jobs/sse-remix.nomad")
}

resource "nomad_job" "sse_sveltekit" {
  jobspec = file("${path.module}/../nomad/jobs/sse-sveltekit.nomad")
}
