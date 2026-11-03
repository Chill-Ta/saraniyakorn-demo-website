terraform {
  backend "gcs" {
    bucket = "artsgoz-artsgoz-web-staging-tfstate"
    prefix = "env/staging"
  }
}
