locals {
  project_id  = "artsgoz-aksornsara-web-develop"
  environment = "dev"

  hosting_sites = {
    aksornsara-frontend = "artsgoz-aksornsara-web-frontend-develop-85a05"
  }

  required_services = toset([
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
}

module "project_services" {
  source = "../../../modules/project-services"

  project_id = local.project_id
  services   = local.required_services
}

resource "google_project_service_identity" "firebase_app_hosting" {
  provider = google-beta
  project  = local.project_id
  service  = "firebaseapphosting.googleapis.com"

  depends_on = [module.project_services]
}

resource "google_project_iam_member" "firebase_app_hosting_service_agent" {
  project = local.project_id
  role    = "roles/firebaseapphosting.serviceAgent"
  member  = "serviceAccount:${google_project_service_identity.firebase_app_hosting.email}"
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = local.project_id

  depends_on = [module.project_services]
}

resource "google_firebase_hosting_site" "environment" {
  provider = google-beta
  for_each = local.hosting_sites

  project = local.project_id
  site_id = each.value

  depends_on = [google_firebase_project.default]
}

resource "google_firebase_hosting_custom_domain" "environment" {
  provider = google-beta
  for_each = var.hosting_custom_domains

  project               = local.project_id
  site_id               = google_firebase_hosting_site.environment[each.key].site_id
  custom_domain         = each.value
  wait_dns_verification = false
}

moved {
  from = google_firebase_hosting_site.frontend
  to   = google_firebase_hosting_site.environment["aksornsara-frontend"]
}

moved {
  from = google_firebase_hosting_custom_domain.frontend[0]
  to   = google_firebase_hosting_custom_domain.environment["aksornsara-frontend"]
}

resource "google_firebase_web_app" "api" {
  provider     = google-beta
  project      = local.project_id
  display_name = "Aksornsara API"

  depends_on = [google_firebase_project.default]
}

module "iam" {
  source = "../../../modules/iam"

  project_id                     = local.project_id
  api_runtime_service_account_id = "firebase-app-hosting-compute"
  api_runtime_project_roles = [
    "roles/developerconnect.readTokenAccessor",
    "roles/firebase.sdkAdminServiceAgent",
    "roles/firebaseapphosting.computeRunner",
    "roles/secretmanager.secretAccessor",
    "roles/storage.objectViewer",
  ]
  depends_on = [module.project_services]
}

resource "google_firebase_app_hosting_backend" "api" {
  provider = google-beta

  project          = local.project_id
  location         = var.app_hosting_location
  backend_id       = "aksornsara-api"
  app_id           = google_firebase_web_app.api.app_id
  serving_locality = "GLOBAL_ACCESS"
  service_account  = module.iam.api_runtime_service_account_email
  environment      = local.environment

  depends_on = [
    google_firebase_project.default,
    google_project_iam_member.firebase_app_hosting_service_agent,
    module.iam,
  ]
}

resource "google_firebase_app_hosting_domain" "api" {
  count    = var.api_custom_domain == null ? 0 : 1
  provider = google-beta

  project   = local.project_id
  location  = google_firebase_app_hosting_backend.api.location
  backend   = google_firebase_app_hosting_backend.api.backend_id
  domain_id = var.api_custom_domain
}

module "storage" {
  source = "../../../modules/storage"

  project_id           = local.project_id
  allow_public_buckets = true
  buckets = {
    public = {
      name     = "${local.project_id}-public-assets"
      location = var.region
      public   = true
      cors_origins = [
        "https://dev.aksornsara.artsgoz.com",
        "http://localhost:4202",
      ]
    }
    private = {
      name     = "${local.project_id}-private-assets"
      location = var.region
    }
  }

  depends_on = [module.project_services]
}

output "project_id" {
  value = local.project_id
}

output "firebase_hosting_sites" {
  value = { for target, site in google_firebase_hosting_site.environment : target => site.site_id }
}

output "firebase_hosting_custom_domains" {
  value = {
    for target, domain in google_firebase_hosting_custom_domain.environment : target => {
      domain               = domain.custom_domain
      host_state           = domain.host_state
      ownership_state      = domain.ownership_state
      required_dns_updates = domain.required_dns_updates
    }
  }
}

output "firebase_app_hosting_backend" {
  value = google_firebase_app_hosting_backend.api.backend_id
}

output "firebase_app_hosting_domain" {
  value = try({
    domain = google_firebase_app_hosting_domain.api[0].domain_id
    status = google_firebase_app_hosting_domain.api[0].custom_domain_status
  }, null)
}

output "storage_bucket_names" {
  value = module.storage.bucket_names
}
