resource "google_project_iam_member" "api_runtime" {
  for_each = var.create_api_runtime_service_account ? var.api_runtime_project_roles : toset([])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.api_runtime["default"].email}"
}


resource "google_project_iam_member" "firebase_deployer" {
  for_each = var.firebase_deployer_project_roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.firebase_deployer.email}"
}

resource "google_service_account_iam_member" "firebase_deployer_runtime_user" {
  for_each = var.create_api_runtime_service_account ? { default = true } : {}

  service_account_id = google_service_account.api_runtime[each.key].name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.firebase_deployer.email}"
}

resource "google_project_iam_member" "app_hosting_compute" {
  for_each = var.app_hosting_compute == null ? toset([]) : var.app_hosting_compute.project_roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${var.app_hosting_compute.service_account_email}"
}
