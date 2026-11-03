terraform {
  backend "gcs" {
    bucket = "artsgoz-aksornsara-web-staging-tfstate"
    prefix = "env/staging"
  }
}
