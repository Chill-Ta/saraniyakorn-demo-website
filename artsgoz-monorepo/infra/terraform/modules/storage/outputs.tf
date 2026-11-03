output "bucket_names" {
  description = "Names of the managed storage buckets by logical bucket name."
  value       = { for key, bucket in google_storage_bucket.this : key => bucket.name }
}

output "bucket_urls" {
  description = "URLs of the managed storage buckets by logical bucket name."
  value       = { for key, bucket in google_storage_bucket.this : key => bucket.url }
}