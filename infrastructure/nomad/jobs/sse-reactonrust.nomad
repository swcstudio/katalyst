job "sse-reactonrust" {
  datacenters = ["dc1"]
  type = "service"
  
  group "reactonrust" {
    count = 2
    
    network {
      port "http" {
        static = 20007
      }
    }
    
    service {
      name = "sse-reactonrust"
      port = "http"
      
      check {
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "reactonrust-app" {
      driver = "docker"
      
      config {
        image = "sse-reactonrust:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20007"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 600
        memory = 768
      }
    }
  }
}
