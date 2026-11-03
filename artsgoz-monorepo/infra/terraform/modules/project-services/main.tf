terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  description = "GCP project where services are enabled."
  type        = string
}

variable "services" {
  description = "Google APIs required by the environment."
  type        = set(string)
}

resource "google_project_service" "enabled" {
  for_each = var.services

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

output "services" {
  description = "Google APIs managed by this module."
  value       = toset(keys(google_project_service.enabled))
}
