job "sse-marketing" {
  datacenters = ["dc1"]
  type = "service"
  
  group "marketing" {
    count = 2
    
    network {
      port "http" {
        static = 20000
      }
    }
    
    service {
      name = "sse-marketing"
      port = "http"
      
      check {
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "marketing-app" {
      driver = "docker"
      
      config {
        image = "sse-marketing:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20000"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 500
        memory = 512
      }
    }
  }
}
