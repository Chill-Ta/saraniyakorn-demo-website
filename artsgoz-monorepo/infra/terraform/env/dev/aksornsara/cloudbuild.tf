locals {
  api_base_url = var.api_custom_domain == null ? "" : "https://${var.api_custom_domain}"

  application_triggers = {
    aksornsara-frontend = {
      filename              = "apps/aksornsara-frontend/build/cloudbuild.yaml"
      service_account_email = module.iam.firebase_deployer_service_account_email
      substitutions = {
        _API_BASE_URL         = local.api_base_url
        _MAINTENANCE_MODE     = tostring(var.frontend_maintenance_mode)
        _FIREBASE_API_KEY     = tostring(var.firebase_api_key)
        _FIREBASE_AUTH_DOMAIN = tostring(var.firebase_auth_domain)
        _FIREBASE_PROJECT_ID  = tostring(var.firebase_project_id)
        _FIREBASE_APP_ID      = tostring(var.firebase_app_id)
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
  branch                        = "^develop$"
  environment                   = local.environment
  application_triggers          = local.application_triggers
  terraform_deployer_account_id = "terraform-deployer"
  terraform_root                = "infra/terraform/env/dev/aksornsara"
  terraform_var_file            = "dev.tfvars"
  state_bucket_name             = "${local.project_id}-tfstate"
  plan_bucket_name              = "${local.project_id}-terraform-plans"
  plan_bucket_location          = var.region

  depends_on = [module.iam, module.project_services]
}
