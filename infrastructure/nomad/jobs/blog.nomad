job "sse-blog" {
  datacenters = ["dc1"]
  type        = "service"
  
  group "blog" {
    count = 2
    
    network {
      port "http" {
        static = 20001
      }
    }
    
    service {
      name = "sse-blog"
      port = "http"
      
      tags = [
        "sse",
        "blog",
        "astro",
        "solidjs",
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
    
    task "blog-app" {
      driver = "docker"
      
      config {
        image = "denoland/deno:2.3.5"
        ports = ["http"]
        
        command = "deno"
        args = ["task", "dev:blog"]
        
        work_dir = "/app"
        
        mount {
          type   = "bind"
          source = "local/app"
          target = "/app"
        }
      }
      
      template {
        data = <<EOF
PORT=20001
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

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
