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
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "remix-app" {
      driver = "docker"
      
      config {
        image = "sse-remix:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20004"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 600
        memory = 768
      }
    }
  }
}
