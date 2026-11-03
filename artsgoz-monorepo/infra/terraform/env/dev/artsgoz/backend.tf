terraform {
  backend "gcs" {
    bucket = "artsgoz-artsgoz-web-develop-tfstate"
    prefix = "env/dev"
  }
}
