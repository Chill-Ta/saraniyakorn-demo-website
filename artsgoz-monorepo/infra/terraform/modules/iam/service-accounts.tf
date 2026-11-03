resource "google_service_account" "api_runtime" {
  for_each = var.create_api_runtime_service_account ? { default = true } : {}

  project      = var.project_id
  account_id   = var.api_runtime_service_account_id
  display_name = "API runtime"
  description  = "Runtime identity for the App Hosting backend."

  create_ignore_already_exists = true
}

resource "google_service_account" "firebase_deployer" {
  project      = var.project_id
  account_id   = var.firebase_deployer_service_account_id
  display_name = "Firebase deployer"
  description  = "Cloud Build identity used only for Firebase application deployments."

  create_ignore_already_exists = true
}
