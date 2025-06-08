
terraform {
  required_version = ">= 1.0.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.10"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.5"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

module "cluster" {
  source = "./modules/cluster"
  
  cluster_name = "sota-marketing-stack"
  region       = "eu-west-3" # OVHcloud region
}

module "vcluster" {
  source = "./modules/vcluster"
  
  depends_on   = [module.cluster]
  cluster_name = "sota-marketing-stack"
  namespace    = "sota-marketing"
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
