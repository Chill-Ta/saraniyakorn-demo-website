output "api_runtime_service_account_email" {
  description = "Email address of the Terraform-managed API runtime service account, when enabled."
  value       = try(google_service_account.api_runtime["default"].email, null)
}

output "api_runtime_service_account_name" {
  description = "Fully-qualified name of the Terraform-managed API runtime service account, when enabled."
  value       = try(google_service_account.api_runtime["default"].name, null)
}

output "firebase_deployer_service_account_email" {
  description = "Email address of the Cloud Build service account used for Firebase deployments."
  value       = google_service_account.firebase_deployer.email
}
