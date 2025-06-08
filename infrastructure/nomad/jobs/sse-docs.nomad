job "sse-docs" {
  datacenters = ["dc1"]
  type = "service"
  
  group "docs" {
    count = 1
    
    network {
      port "http" {
        static = 20003
      }
    }
    
    service {
      name = "sse-docs"
      port = "http"
      
      check {
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "docs-app" {
      driver = "docker"
      
      config {
        image = "sse-docs:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20003"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 200
        memory = 128
      }
    }
  }
}
