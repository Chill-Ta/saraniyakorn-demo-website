locals {
  application_triggers = {
    artsgoz-frontend = {
      filename              = "apps/artsgoz-frontend/build/cloudbuild.yaml"
      service_account_email = module.iam.firebase_deployer_service_account_email
      substitutions = {
        _MAINTENANCE_MODE = tostring(var.frontend_maintenance_mode)
      }
      included_files = [
        "apps/artsgoz-frontend/**",
        "libs/**",
        "packages/**",
        "firebase.json",
        ".firebaserc",
        "nx.json",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
      ]
    }
    artsgoz-backoffice = {
      filename              = "apps/artsgoz-backoffice/build/cloudbuild.yaml"
      service_account_email = module.iam.firebase_deployer_service_account_email
      substitutions = {
        _MAINTENANCE_MODE = tostring(var.backoffice_maintenance_mode)
      }
      included_files = [
        "apps/artsgoz-backoffice/**",
        "libs/**",
        "packages/**",
        "firebase.json",
        ".firebaserc",
        "nx.json",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
      ]
    }
  }
}

module "cloud_build" {
  count  = var.cloud_build_repository == null ? 0 : 1
  source = "../../../modules/cloud-build"

  project_id                    = local.project_id
  location                      = var.cloud_build_repository.location
  connection_name               = var.cloud_build_repository.connection_name
  repository_name               = var.cloud_build_repository.repository_name
  branch                        = "^develop$"
  environment                   = local.environment
  application_triggers          = local.application_triggers
  terraform_deployer_account_id = "terraform-deployer"
  terraform_root                = "infra/terraform/env/dev/artsgoz"
  terraform_var_file            = "dev.tfvars"
  state_bucket_name             = "${local.project_id}-tfstate"
  plan_bucket_name              = "${local.project_id}-terraform-plans"
  plan_bucket_location          = var.region

  depends_on = [module.iam, module.project_services]
}
