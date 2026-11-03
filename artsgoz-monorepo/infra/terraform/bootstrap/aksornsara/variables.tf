variable "project_id" {
  description = "GCP project ID to bootstrap."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "project_id must be a valid GCP project ID."
  }
}

variable "environment" {
  description = "Environment name used for labels and resource descriptions."
  type        = string
}

variable "region" {
  description = "GCP region for the Terraform state bucket."
  type        = string
  default     = "asia-southeast1"
}

variable "secret_ids" {
  description = "Secret Manager secret IDs to create without secret versions."
  type        = set(string)
  default     = []
}
