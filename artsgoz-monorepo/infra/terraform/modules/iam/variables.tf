variable "project_id" {
  description = "GCP project where IAM resources are managed."
  type        = string
}

variable "api_runtime_service_account_id" {
  description = "Short ID for the API runtime service account managed by Terraform."
  type        = string
  default     = "firebase-app-hosting-compute"
}

variable "create_api_runtime_service_account" {
  description = "Whether Terraform should create the custom API runtime service account."
  type        = bool
  default     = true
}

variable "api_runtime_project_roles" {
  description = "Project-level roles granted to the Terraform-managed API runtime account."
  type        = set(string)
  default = [
    "roles/cloudtasks.enqueuer",
    "roles/datastore.user",
    "roles/secretmanager.secretAccessor",
    "roles/storage.objectAdmin",
  ]
}

variable "firebase_deployer_service_account_id" {
  description = "Short ID for the Cloud Build service account that deploys Firebase applications."
  type        = string
  default     = "firebase-deployer"
}

variable "firebase_deployer_project_roles" {
  description = "Project-level roles granted to the Firebase application deployer."
  type        = set(string)
  default = [
    "roles/cloudbuild.builds.builder",
    "roles/firebase.admin",
    "roles/logging.logWriter",
    "roles/storage.objectAdmin",
  ]
}

variable "app_hosting_compute" {
  description = "Externally managed Firebase App Hosting compute identity and its project roles."
  type = object({
    service_account_email = string
    project_roles         = set(string)
  })
  default  = null
  nullable = true
}
