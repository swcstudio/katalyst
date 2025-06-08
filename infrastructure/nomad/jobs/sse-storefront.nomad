job "sse-storefront" {
  datacenters = ["dc1"]
  type = "service"
  
  group "storefront" {
    count = 3
    
    network {
      port "http" {
        static = 20002
      }
    }
    
    service {
      name = "sse-storefront"
      port = "http"
      
      check {
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "storefront-app" {
      driver = "docker"
      
      config {
        image = "sse-storefront:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20002"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 800
        memory = 1024
      }
    }
  }
}
