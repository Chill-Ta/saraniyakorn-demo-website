terraform {
  required_version = ">= 1.9.0, < 2.0.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "bootstrap" {
  source = "../../modules/bootstrap-project"

  project_id  = var.project_id
  environment = var.environment
  region      = var.region
  secret_ids  = var.secret_ids
}

output "terraform_state_bucket" {
  value = module.bootstrap.terraform_state_bucket
}

output "terraform_deployer_service_account_email" {
  value = module.bootstrap.terraform_deployer_service_account_email
}
