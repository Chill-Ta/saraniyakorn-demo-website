terraform {
  backend "gcs" {
    bucket = "artsgoz-artsgoz-web-prod-tfstate"
    prefix = "env/prod"
  }
}
