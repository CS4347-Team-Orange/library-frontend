output "app_url" { 
    value = "http://${nonsensitive(data.tfe_outputs.backend.values.lb_dns)}"
}