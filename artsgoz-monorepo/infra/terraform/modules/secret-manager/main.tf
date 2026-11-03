terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  description = "GCP project where the secrets are managed."
  type        = string
}

variable "secret_ids" {
  description = "Secret Manager secret IDs to create without secret values."
  type        = set(string)
}

resource "google_secret_manager_secret" "this" {
  for_each = var.secret_ids

  project   = var.project_id
  secret_id = each.value

  replication {
    auto {}
  }
}

output "secret_names" {
  description = "Fully qualified Secret Manager resource names by secret ID."
  value       = { for key, secret in google_secret_manager_secret.this : key => secret.name }
}
