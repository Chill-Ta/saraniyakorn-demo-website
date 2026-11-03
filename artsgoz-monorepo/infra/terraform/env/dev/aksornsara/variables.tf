variable "region" {
  description = "GCP region for regional resources."
  type        = string
  default     = "asia-southeast1"
}

variable "app_hosting_location" {
  description = "Firebase App Hosting backend location."
  type        = string
  default     = "asia-east1"
}

variable "api_custom_domain" {
  description = "Optional API hostname without scheme or path."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition     = var.api_custom_domain == null || can(regex("^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$", var.api_custom_domain))
    error_message = "api_custom_domain must be null or a lowercase DNS hostname."
  }
}

variable "hosting_custom_domains" {
  description = "Firebase Hosting custom domains keyed by Aksornsara deploy target."
  type        = map(string)
  default     = {}

  validation {
    condition = alltrue([
      for target, domain in var.hosting_custom_domains :
      contains(["aksornsara-frontend"], target) &&
      can(regex("^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$", domain))
    ])
    error_message = "hosting_custom_domains must use known Aksornsara targets and lowercase DNS hostnames."
  }
}

variable "frontend_maintenance_mode" {
  description = "Whether the Aksornsara frontend is built in maintenance mode."
  type        = bool
  default     = false
}

variable "firebase_api_key" {
  description = "Firebase Auth API key"
  type        = string
  default     = "AIzaSyAS-GTc1ZsZ4XZSLmFFqwU1oxdU1DUYnf0"
}

variable "firebase_auth_domain" {
  description = "Firebase Auth Domain"
  type        = string
  default     = "artsgoz-aksornsara-web-develop.firebaseapp.com"
}

variable "firebase_project_id" {
  description = "Firebase Project ID"
  type        = string
  default     = "artartsgoz-aksornsara-web-develop"
}

variable "firebase_app_id" {
  description = "Firebase App ID"
  type        = string
  default     = "1:680736603215:web:c1034600fd094fba153e3a"
}

variable "cloud_build_repository" {
  description = "Existing Cloud Build v2 repository connection. Null disables application triggers."
  type = object({
    location        = string
    connection_name = string
    repository_name = string
  })
  default  = null
  nullable = true
}
