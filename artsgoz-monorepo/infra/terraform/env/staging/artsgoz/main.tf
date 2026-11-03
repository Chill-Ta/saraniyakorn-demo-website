locals {
  project_id  = "artsgoz-artsgoz-web-staging"
  environment = "staging"

  hosting_sites = {
    artsgoz-frontend   = "artsgoz-artsgoz-web-frontend-staging"
    artsgoz-backoffice = "artsgoz-artsgoz-web-backoffice-staging"
  }

  required_services = toset([
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "developerconnect.googleapis.com",
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "serviceusage.googleapis.com",
    "storage.googleapis.com",
  ])
}

module "project_services" {
  source = "../../../modules/project-services"

  project_id = local.project_id
  services   = local.required_services
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

module "iam" {
  source = "../../../modules/iam"

  project_id                         = local.project_id
  create_api_runtime_service_account = false

  depends_on = [module.project_services]
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
        "https://staging.web.artsgoz.com",
        "https://staging.backoffice.artsgoz.com",
        "http://localhost:4200",
        "http://localhost:4201",
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

output "storage_bucket_names" {
  value = module.storage.bucket_names
}
