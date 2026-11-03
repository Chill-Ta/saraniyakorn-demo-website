terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  description = "GCP project where the Artifact Registry repository is managed."
  type        = string
}

variable "location" {
  description = "Artifact Registry repository location."
  type        = string
}

variable "repository_id" {
  description = "Artifact Registry repository ID."
  type        = string
}

variable "description" {
  description = "Description of the Artifact Registry repository."
  type        = string
  default     = "Container images for Artsgoz services."
}

variable "writer_service_account_email" {
  description = "Optional service account granted permission to push images."
  type        = string
  default     = null

  validation {
    condition = (
      var.writer_service_account_email == null ||
      can(regex("^[^@\\s]+@[^@\\s]+\\.iam\\.gserviceaccount\\.com$", var.writer_service_account_email))
    )
    error_message = "writer_service_account_email must be null or a service account email address."
  }
}

resource "google_artifact_registry_repository" "this" {
  project       = var.project_id
  location      = var.location
  repository_id = var.repository_id
  description   = var.description
  format        = "DOCKER"
}

resource "google_artifact_registry_repository_iam_member" "writer" {
  count = var.writer_service_account_email == null ? 0 : 1

  project    = var.project_id
  location   = google_artifact_registry_repository.this.location
  repository = google_artifact_registry_repository.this.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${var.writer_service_account_email}"
}

output "repository_name" {
  description = "Fully qualified Artifact Registry repository name."
  value       = google_artifact_registry_repository.this.name
}

output "docker_repository_url" {
  description = "Docker repository URL without an image name or tag."
  value       = "${var.location}-docker.pkg.dev/${var.project_id}/${var.repository_id}"
}
