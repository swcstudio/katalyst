variable "nomad_datacenter" {
  description = "Nomad datacenter name"
  type        = string
  default     = "dc1"
}

variable "service_replicas" {
  description = "Number of replicas for each service"
  type = object({
    marketing  = number
    blog       = number
    storefront = number
    docs       = number
    remix      = number
    sveltekit  = number
  })
  default = {
    marketing  = 2
    blog       = 2
    storefront = 3
    docs       = 1
    remix      = 2
    sveltekit  = 2
  }
}

variable "resource_limits" {
  description = "Resource limits for each service"
  type = object({
    marketing = object({
      cpu    = number
      memory = number
    })
    blog = object({
      cpu    = number
      memory = number
    })
    storefront = object({
      cpu    = number
      memory = number
    })
    docs = object({
      cpu    = number
      memory = number
    })
    remix = object({
      cpu    = number
      memory = number
    })
    sveltekit = object({
      cpu    = number
      memory = number
    })
  })
  default = {
    marketing = {
      cpu    = 500
      memory = 512
    }
    blog = {
      cpu    = 300
      memory = 256
    }
    storefront = {
      cpu    = 800
      memory = 1024
    }
    docs = {
      cpu    = 200
      memory = 128
    }
    remix = {
      cpu    = 600
      memory = 768
    }
    sveltekit = {
      cpu    = 400
      memory = 512
    }
  }
}
