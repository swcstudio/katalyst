resource "kubernetes_secret" "clerk_secrets" {
  metadata {
    name      = "clerk-secrets"
    namespace = "sota-auth"
  }

  data = {
    "clerk-publishable-key" = var.clerk_publishable_key
    "clerk-secret-key"      = var.clerk_secret_key
  }
}

resource "kubernetes_deployment" "clerk_webhook_handler" {
  metadata {
    name      = "clerk-webhook-handler"
    namespace = "sota-auth"
    labels = {
      app = "clerk-webhook-handler"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "clerk-webhook-handler"
      }
    }

    template {
      metadata {
        labels = {
          app = "clerk-webhook-handler"
        }
      }

      spec {
        container {
          name  = "clerk-webhook-handler"
          image = "node:18-alpine"
          
          command = ["/bin/sh", "-c"]
          args    = ["npm start"]

          port {
            container_port = 3000
          }

          env {
            name = "CLERK_SECRET_KEY"
            value_from {
              secret_key_ref {
                name = "clerk-secrets"
                key  = "clerk-secret-key"
              }
            }
          }

          env {
            name = "CLERK_PUBLISHABLE_KEY"
            value_from {
              secret_key_ref {
                name = "clerk-secrets"
                key  = "clerk-publishable-key"
              }
            }
          }

          resources {
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
          }
        }
      }
    }
  }
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key"
  type        = string
  sensitive   = true
}

variable "clerk_secret_key" {
  description = "Clerk secret key"
  type        = string
  sensitive   = true
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
