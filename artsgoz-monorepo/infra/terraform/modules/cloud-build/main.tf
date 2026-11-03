terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  description = "GCP project where Cloud Build triggers are managed."
  type        = string
}

variable "location" {
  description = "Cloud Build location for the Gen 2 repository connection and triggers."
  type        = string
}

variable "connection_name" {
  description = "Existing Cloud Build Gen 2 connection name."
  type        = string
}

variable "repository_name" {
  description = "Existing Cloud Build Gen 2 repository name."
  type        = string
}

variable "branch" {
  description = "Regular expression for the branch that triggers builds."
  type        = string
}

variable "environment" {
  description = "Environment name included in trigger names and substitutions."
  type        = string
}

variable "application_triggers" {
  description = "Application Cloud Build trigger configuration by trigger name."
  type = map(object({
    filename              = string
    service_account_email = string
    substitutions         = optional(map(string), {})
    included_files        = optional(list(string), [])
    ignored_files         = optional(list(string), [])
  }))
}

variable "terraform_deployer_account_id" {
  description = "Service account ID used to run Cloud Build triggers."
  type        = string
}

variable "terraform_root" {
  description = "Repository-relative path to the Terraform environment root."
  type        = string
  default     = "infra/terraform/environment"
}

variable "terraform_var_file" {
  description = "Repository-relative-to-root variable file used by Terraform plan builds."
  type        = string
}

variable "state_bucket_name" {
  description = "GCS bucket containing the application Terraform state."
  type        = string
}

variable "plan_bucket_name" {
  description = "Private bucket used to store Terraform plans for review and apply."
  type        = string
}

variable "plan_bucket_location" {
  description = "GCS location for the Terraform plan bucket."
  type        = string
}

locals {
  repository                = "projects/${var.project_id}/locations/${var.location}/connections/${var.connection_name}/repositories/${var.repository_name}"
  terraform_service_account = "projects/${var.project_id}/serviceAccounts/${var.terraform_deployer_account_id}@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_cloudbuild_trigger" "application_push" {
  for_each = var.application_triggers

  project  = var.project_id
  name     = "${each.key}-${var.environment}-push"
  location = var.location
  filename = each.value.filename

  repository_event_config {
    repository = local.repository

    push {
      branch = var.branch
    }
  }

  service_account = "projects/${var.project_id}/serviceAccounts/${each.value.service_account_email}"

  substitutions  = each.value.substitutions
  included_files = each.value.included_files
  ignored_files  = each.value.ignored_files
}

resource "google_storage_bucket" "terraform_plans" {
  project                     = var.project_id
  name                        = var.plan_bucket_name
  location                    = var.plan_bucket_location
  force_destroy               = false
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 14
    }

    action {
      type = "Delete"
    }
  }
}

resource "google_cloudbuild_trigger" "terraform_plan" {
  project  = var.project_id
  name     = "terraform-${var.environment}-plan-push"
  location = var.location
  filename = "infra/cloudbuild/terraform-plan.yaml"

  repository_event_config {
    repository = local.repository

    push {
      branch = var.branch
    }
  }

  substitutions = {
    _ENVIRONMENT  = var.environment
    _PLAN_BUCKET  = google_storage_bucket.terraform_plans.name
    _PROJECT_ID   = var.project_id
    _STATE_BUCKET = var.state_bucket_name
    _STATE_PREFIX = "env/${var.environment}"
    _TF_ROOT      = var.terraform_root
    _TF_VAR_FILE  = var.terraform_var_file
  }

  included_files = [
    "infra/cloudbuild/terraform-*.yaml",
    "infra/terraform/**",
  ]

  service_account = local.terraform_service_account
}

resource "google_cloudbuild_trigger" "terraform_apply" {
  project  = var.project_id
  name     = "terraform-${var.environment}-apply-push"
  location = var.location
  filename = "infra/cloudbuild/terraform-apply.yaml"

  repository_event_config {
    repository = local.repository

    push {
      branch = var.branch
    }
  }

  substitutions = {
    _ENVIRONMENT  = var.environment
    _PLAN_BUCKET  = google_storage_bucket.terraform_plans.name
    _PROJECT_ID   = var.project_id
    _STATE_BUCKET = var.state_bucket_name
    _STATE_PREFIX = "env/${var.environment}"
    _TF_ROOT      = var.terraform_root
    _TF_VAR_FILE  = var.terraform_var_file
  }

  included_files = [
    "infra/cloudbuild/terraform-*.yaml",
    "infra/terraform/**",
  ]

  service_account = local.terraform_service_account

  approval_config {
    approval_required = true
  }
}

output "plan_bucket_name" {
  description = "Bucket containing saved plans keyed by commit SHA."
  value       = google_storage_bucket.terraform_plans.name
}
