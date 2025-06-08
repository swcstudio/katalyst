job "sse-blog" {
  datacenters = ["dc1"]
  type = "service"
  
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
      
      check {
        type = "http"
        path = "/health"
        interval = "10s"
        timeout = "3s"
      }
    }
    
    task "blog-app" {
      driver = "docker"
      
      config {
        image = "sse-blog:latest"
        ports = ["http"]
      }
      
      env {
        PORT = "20001"
        NODE_ENV = "production"
      }
      
      resources {
        cpu = 300
        memory = 256
      }
    }
  }
}
