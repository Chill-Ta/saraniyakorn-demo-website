terraform {
  backend "gcs" {
    bucket = "artsgoz-aksornsara-web-develop-tfstate"
    prefix = "env/dev"
  }
}
