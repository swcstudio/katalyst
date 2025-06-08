terraform {
  required_version = ">= 1.0"
  
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
  
  backend "local" {
    path = "terraform.tfstate"
  }
}

locals {
  common_tags = {
    Environment = "production"
    Project     = "sse"
    ManagedBy   = "terraform"
  }
  
  service_ports = {
    marketing  = 20000
    blog       = 20001
    storefront = 20002
    docs       = 20003
    remix      = 20004
    sveltekit  = 20005
  }
}
