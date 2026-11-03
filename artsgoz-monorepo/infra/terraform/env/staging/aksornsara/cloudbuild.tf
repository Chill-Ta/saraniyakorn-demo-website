locals {
  api_base_url = var.api_custom_domain == null ? "" : "https://${var.api_custom_domain}"

  application_triggers = {
    aksornsara-frontend = {
      filename              = "apps/aksornsara-frontend/build/cloudbuild.yaml"
      service_account_email = module.iam.firebase_deployer_service_account_email
      substitutions = {
        _API_BASE_URL     = local.api_base_url
        _MAINTENANCE_MODE = tostring(var.frontend_maintenance_mode)
      }
      included_files = [
        "apps/aksornsara-frontend/**",
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
    aksornsara-api = {
      filename              = "apps/aksornsara-api/build/cloudbuild.yaml"
      service_account_email = module.iam.firebase_deployer_service_account_email
      included_files = [
        "apps/aksornsara-api/**",
        "libs/**",
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
  branch                        = "^staging$"
  environment                   = local.environment
  application_triggers          = local.application_triggers
  terraform_deployer_account_id = "terraform-deployer"
  terraform_root                = "infra/terraform/env/staging/aksornsara"
  terraform_var_file            = "staging.tfvars"
  state_bucket_name             = "${local.project_id}-tfstate"
  plan_bucket_name              = "${local.project_id}-terraform-plans"
  plan_bucket_location          = var.region

  depends_on = [module.iam, module.project_services]
}
