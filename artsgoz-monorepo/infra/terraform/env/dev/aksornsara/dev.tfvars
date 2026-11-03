region               = "asia-southeast1"
app_hosting_location = "asia-east1"
hosting_custom_domains = {
  aksornsara-frontend = "dev.aksornsara.artsgoz.com"
}
api_custom_domain         = "dev.api.aksornsara.artsgoz.com"
frontend_maintenance_mode = false
firebase_api_key          = "AIzaSyAS-GTc1ZsZ4XZSLmFFqwU1oxdU1DUYnf0"
firebase_auth_domain      = "artsgoz-aksornsara-web-develop.firebaseapp.com"
firebase_project_id       = "artartsgoz-aksornsara-web-develop"
firebase_app_id           = "1:680736603215:web:c1034600fd094fba153e3a"

# Enable after this repository is linked through Cloud Build v2 in this project.
cloud_build_repository = {
  location        = "asia-southeast1"
  connection_name = "artsgoz"
  repository_name = "artsgoz-artsgoz-monorepo"
}
