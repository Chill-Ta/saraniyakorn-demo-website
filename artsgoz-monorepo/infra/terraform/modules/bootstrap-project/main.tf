terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  description = "GCP project to bootstrap."
  type        = string
}

variable "environment" {
  description = "Environment label applied to bootstrap resources."
  type        = string
}

variable "region" {
  description = "Region for the Terraform state bucket."
  type        = string
}

variable "secret_ids" {
  description = "Secret Manager secrets to create without secret versions."
  type        = set(string)
  default     = []
}

locals {
  services = toset([
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "developerconnect.googleapis.com",
    "firebase.googleapis.com",
    "firebaseapphosting.googleapis.com",
    "firebasehosting.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "serviceusage.googleapis.com",
    "storage.googleapis.com",
  ])

  terraform_deployer_roles = toset([
    "roles/artifactregistry.admin",
    "roles/cloudbuild.builds.editor",
    "roles/firebase.admin",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.serviceAccountUser",
    "roles/logging.logWriter",
    "roles/resourcemanager.projectIamAdmin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/storage.admin",
  ])
}

module "project_services" {
  source = "../project-services"

  project_id = var.project_id
  services   = local.services
}

resource "google_storage_bucket" "terraform_state" {
  project  = var.project_id
  name     = "${var.project_id}-tfstate"
  location = var.region

  force_destroy               = false
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  labels = {
    environment = var.environment
    managed_by  = "terraform"
    purpose     = "terraform-state"
  }

  depends_on = [module.project_services]
}

resource "google_service_account" "terraform_deployer" {
  project      = var.project_id
  account_id   = "terraform-deployer"
  display_name = "Terraform deployer (${var.environment})"

  depends_on = [module.project_services]
}

resource "google_project_iam_member" "terraform_deployer" {
  for_each = local.terraform_deployer_roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.terraform_deployer.email}"
}

module "secrets" {
  source = "../secret-manager"

  project_id = var.project_id
  secret_ids = var.secret_ids

  depends_on = [module.project_services]
}

output "terraform_state_bucket" {
  value = google_storage_bucket.terraform_state.name
}

output "terraform_deployer_service_account_email" {
  value = google_service_account.terraform_deployer.email
}

output "secret_names" {
  value = module.secrets.secret_names
}
