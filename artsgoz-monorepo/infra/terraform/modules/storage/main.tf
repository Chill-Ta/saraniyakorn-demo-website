terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  description = "GCP project where the storage buckets are managed."
  type        = string
}

variable "buckets" {
  description = "Storage buckets to create, keyed by logical bucket name."
  type = map(object({
    name          = string
    location      = string
    storage_class = optional(string, "STANDARD")
    public        = optional(bool, false)
    cors_origins  = optional(list(string), [])
    cors_methods  = optional(list(string), ["GET", "HEAD"])
  }))
}

variable "allow_public_buckets" {
  description = "Explicit safety switch required when any bucket grants allUsers objectViewer."
  type        = bool
  default     = false
}

resource "google_storage_bucket" "this" {
  for_each = var.buckets

  project                     = var.project_id
  name                        = each.value.name
  location                    = each.value.location
  storage_class               = each.value.storage_class
  uniform_bucket_level_access = true
  public_access_prevention    = each.value.public ? "inherited" : "enforced"

  versioning {
    enabled = true
  }
  dynamic "cors" {
    for_each = length(each.value.cors_origins) == 0 ? [] : [each.value.cors_origins]

    content {
      origin          = cors.value
      method          = each.value.cors_methods
      response_header = ["*"]
      max_age_seconds = 3600
    }
  }

  lifecycle {
    precondition {
      condition     = !each.value.public || var.allow_public_buckets
      error_message = "Public bucket ${each.value.name} requires allow_public_buckets = true."
    }
  }
}

resource "google_storage_bucket_iam_member" "public_reader" {
  for_each = {
    for key, bucket in var.buckets : key => bucket
    if bucket.public
  }

  bucket = google_storage_bucket.this[each.key].name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
