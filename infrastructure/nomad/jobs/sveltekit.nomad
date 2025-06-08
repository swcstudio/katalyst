job "sse-sveltekit" {
  datacenters = ["dc1"]
  type = "service"

  group "sveltekit" {
    count = 1

    network {
      port "http" {
        static = 20005
      }
    }

    service {
      name = "sse-sveltekit"
      port = "http"
      
      check {
        type     = "http"
        path     = "/"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "sveltekit" {
      driver = "docker"

      config {
        image = "sse-sveltekit:latest"
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
PORT=20005
ORIGIN=https://spa.sse.spectrumweb.co
EOH
        destination = "local/config/env"
        env         = true
      }

      vault {
        policies = ["sse-sveltekit"]
      }

      resources {
        cpu    = 400
        memory = 512
      }
    }
  }
}
