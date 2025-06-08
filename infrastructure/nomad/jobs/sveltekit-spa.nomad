job "sse-sveltekit-spa" {
  datacenters = ["dc1"]
  type        = "service"
  
  group "sveltekit" {
    count = 2
    
    network {
      port "http" {
        static = 20005
      }
    }
    
    service {
      name = "sse-sveltekit-spa"
      port = "http"
      
      tags = [
        "sse",
        "sveltekit",
        "spa",
        "rspack",
        "deno"
      ]
      
      check {
        type     = "http"
        path     = "/health"
        interval = "10s"
        timeout  = "3s"
      }
    }
    
    task "sveltekit-app" {
      driver = "docker"
      
      config {
        image = "denoland/deno:2.3.5"
        ports = ["http"]
        
        command = "deno"
        args = ["task", "dev:sveltekit"]
        
        work_dir = "/app"
        
        mount {
          type   = "bind"
          source = "local/app"
          target = "/app"
        }
      }
      
      template {
        data = <<EOF
PORT=20005
NODE_ENV=production
VAULT_ADDR={{ key "sse/vault/addr" }}
VAULT_TOKEN={{ key "sse/vault/token" }}
DATABASE_URL={{ key "sse/database/url" }}
VERCEL_TOKEN={{ key "sse/api-keys/vercel" }}
NX_CLOUD_ACCESS_TOKEN={{ key "sse/api-keys/nx-cloud" }}
EOF
        destination = "local/env"
        env         = true
      }
      
      artifact {
        source = "git::https://github.com/spectrumwebco/sse.git"
        destination = "local/app"
      }
      
      resources {
        cpu    = 500
        memory = 512
      }
      
      restart {
        attempts = 3
        interval = "30m"
        delay    = "15s"
        mode     = "fail"
      }
    }
  }
  
  update {
    max_parallel     = 1
    min_healthy_time = "10s"
    healthy_deadline = "3m"
    auto_revert      = true
    canary           = 1
  }
}
