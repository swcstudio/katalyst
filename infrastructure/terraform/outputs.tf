output "nomad_jobs" {
  description = "Deployed Nomad jobs"
  value = {
    marketing  = nomad_job.sse_marketing.name
    blog       = nomad_job.sse_blog.name
    storefront = nomad_job.sse_storefront.name
    docs       = nomad_job.sse_docs.name
    remix      = nomad_job.sse_remix.name
    sveltekit  = nomad_job.sse_sveltekit.name
  }
}

output "vault_policies" {
  description = "Created Vault policies"
  value = {
    marketing  = vault_policy.sse_marketing.name
    blog       = vault_policy.sse_blog.name
    storefront = vault_policy.sse_storefront.name
    docs       = vault_policy.sse_docs.name
    remix      = vault_policy.sse_remix.name
    sveltekit  = vault_policy.sse_sveltekit.name
  }
}

output "service_ports" {
  description = "Service port assignments"
  value = {
    marketing  = 20000
    blog       = 20001
    storefront = 20002
    docs       = 20003
    remix      = 20004
    sveltekit  = 20005
    storybook  = 20006
    rsdoctor   = 20007
  }
}
