job "sse-sveltekit" {
  datacenters = ["dc1"]
  type = "service"
  
  group "sveltekit" {
    count = 2
    
    network {
      port "http" {
        static = 20005
      }
    }
    
    service {
      name = "sse-sveltekit"
      port = "http"
      
      check {
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "sveltekit-app" {
      driver = "docker"
      
      config {
        image = "sse-sveltekit:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20005"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 400
        memory = 512
      }
    }
  }
}
