resource "kubernetes_deployment" "convex" {
  metadata {
    name      = "convex-self-hosted"
    namespace = "sota-database"
    labels = {
      app = "convex"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "convex"
      }
    }

    template {
      metadata {
        labels = {
          app = "convex"
        }
      }

      spec {
        container {
          name  = "convex"
          image = "convex/server:latest"

          port {
            container_port = 8000
          }

          env {
            name = "CONVEX_ADMIN_PASSWORD"
            value_from {
              secret_key_ref {
                name = "convex-secrets"
                key  = "admin-password"
              }
            }
          }

          env {
            name  = "CONVEX_DB_CONNECTION_STRING"
            value = "postgresql://postgres:$(POSTGRES_PASSWORD)@convex-postgres-rw.sota-database.svc.cluster.local:5432/convex"
          }

          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = "convex-postgres-app"
                key  = "password"
              }
            }
          }

          resources {
            limits = {
              cpu    = "1"
              memory = "2Gi"
            }
            requests = {
              cpu    = "500m"
              memory = "1Gi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "convex" {
  metadata {
    name      = "convex"
    namespace = "sota-database"
  }

  spec {
    selector = {
      app = "convex"
    }

    port {
      port        = 80
      target_port = 8000
    }

    type = "ClusterIP"
  }
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
