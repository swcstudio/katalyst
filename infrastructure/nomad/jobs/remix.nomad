job "sse-remix" {
  datacenters = ["dc1"]
  type = "service"

  group "remix" {
    count = 2

    network {
      port "http" {
        static = 20004
      }
    }

    service {
      name = "sse-remix"
      port = "http"
      
      check {
        type     = "http"
        path     = "/"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "remix" {
      driver = "docker"

      config {
        image = "sse-remix:latest"
        ports = ["http"]
        
        mount {
          type   = "bind"
          source = "local/config"
          target = "/app/config"
        }
      }

      template {
        data = <<EOH
DENO_VERSION=2.3.5
NODE_ENV=production
PORT=20004
SESSION_SECRET={{ with secret "secret/sse/remix" }}{{ .Data.data.session_secret }}{{ end }}
EOH
        destination = "local/config/env"
        env         = true
      }

      vault {
        policies = ["sse-remix"]
      }

      resources {
        cpu    = 600
        memory = 768
      }
    }
  }
}
