variable "region" {
  description = "GCP region for regional resources."
  type        = string
  default     = "asia-southeast1"
}

variable "hosting_custom_domains" {
  description = "Firebase Hosting custom domains keyed by Artsgoz deploy target."
  type        = map(string)
  default     = {}

  validation {
    condition = alltrue([
      for target, domain in var.hosting_custom_domains :
      contains(["artsgoz-frontend", "artsgoz-backoffice"], target) &&
      can(regex("^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$", domain))
    ])
    error_message = "hosting_custom_domains must use known Artsgoz targets and lowercase DNS hostnames."
  }
}

variable "frontend_maintenance_mode" {
  description = "Whether the Artsgoz frontend is built in maintenance mode."
  type        = bool
  default     = false
}

variable "backoffice_maintenance_mode" {
  description = "Whether the Artsgoz backoffice is built in maintenance mode."
  type        = bool
  default     = false
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
