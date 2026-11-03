region = "asia-southeast1"

hosting_custom_domains = {
  artsgoz-frontend   = "www.artsgoz.com"
  artsgoz-backoffice = "backoffice.artsgoz.com"
}

frontend_maintenance_mode   = true
backoffice_maintenance_mode = true

# Enable after this repository is linked through Cloud Build v2 in this project.
cloud_build_repository = {
  location        = "asia-southeast1"
  connection_name = "artsgoz"
  repository_name = "artsgoz-artsgoz-monorepo"
}
