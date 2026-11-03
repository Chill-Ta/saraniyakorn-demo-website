terraform {
  backend "gcs" {
    bucket = "artsgoz-aksornsara-web-prod-tfstate"
    prefix = "env/prod"
  }
}
