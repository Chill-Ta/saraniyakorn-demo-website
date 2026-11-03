# Terraform deployment guide

The Artsgoz and Aksornsara development environments are intentionally managed as separate GCP/Firebase projects with separate Terraform state and IAM boundaries.

| Stack | GCP project | Terraform root | State bucket |
| --- | --- | --- | --- |
| Artsgoz | `artsgoz-artsgoz-web-develop` | `env/dev/artsgoz` | `artsgoz-artsgoz-web-develop-tfstate` |
| Aksornsara | `artsgoz-aksornsara-web-develop` | `env/dev/aksornsara` | `artsgoz-aksornsara-web-develop-tfstate` |

## Prerequisites

- Terraform `>= 1.9.0, < 2.0.0`
- Google Cloud CLI authenticated with permission to enable APIs, create buckets and service accounts, and manage IAM and Firebase resources in both projects
- Billing enabled on both GCP projects
- Application Default Credentials configured:

```bash
gcloud auth application-default login
```

Run all commands from the repository root unless a command uses `-chdir`.

## 1. Bootstrap Artsgoz

The first apply uses local state because the remote state bucket does not exist yet.

```bash
terraform -chdir=infra/terraform/bootstrap/artsgoz init
terraform -chdir=infra/terraform/bootstrap/artsgoz plan \
  -var-file=dev.tfvars
terraform -chdir=infra/terraform/bootstrap/artsgoz apply \
  -var-file=dev.tfvars
```

After the state bucket exists, enable the GCS backend and migrate the local bootstrap state:

```bash
cp infra/terraform/bootstrap/artsgoz/backend.dev.tf.example \
  infra/terraform/bootstrap/artsgoz/backend.tf
terraform -chdir=infra/terraform/bootstrap/artsgoz init -migrate-state
```

The generated `backend.tf` is intentionally ignored because `backend.tf.example` is the committed source of truth.

## 2. Bootstrap Aksornsara

Repeat the same process in the Aksornsara project:

```bash
terraform -chdir=infra/terraform/bootstrap/aksornsara init
terraform -chdir=infra/terraform/bootstrap/aksornsara plan \
  -var-file=dev.tfvars
terraform -chdir=infra/terraform/bootstrap/aksornsara apply \
  -var-file=dev.tfvars

cp infra/terraform/bootstrap/aksornsara/backend.dev.tf.example \
  infra/terraform/bootstrap/aksornsara/backend.tf
terraform -chdir=infra/terraform/bootstrap/aksornsara init -migrate-state
```

Each bootstrap root creates its own API enablement, Terraform deployer service account, and versioned state bucket.

Each product has one reusable bootstrap root. Add `staging.tfvars` or `prod.tfvars` beside `dev.tfvars` and a matching `backend.staging.tf.example` or `backend.prod.tf.example`. Always copy the matching backend example to `backend.tf` and run `terraform init -reconfigure` before operating on another environment.

For the first bootstrap of any new environment, ensure `backend.tf` is absent so Terraform uses isolated local state. After that environment's state bucket is created, copy its matching backend example and migrate that local state. Never reuse or migrate one environment's local state into another environment's backend.

## 3. Configure development values

Review these files before planning:

- `env/dev/artsgoz/dev.tfvars`
- `env/dev/aksornsara/dev.tfvars`

Leave `cloud_build_repository` commented until a Cloud Build v2 GitHub connection and repository link exist in that specific project. Connections are project-scoped, so link the repository once in each project.

Custom domains are configured independently in each product's `dev.tfvars` file. No API URL or other runtime dependency is shared between Artsgoz and Aksornsara.

Firebase domain associations are created with DNS waiting disabled. After the first apply, inspect the `firebase_hosting_custom_domains` and `firebase_app_hosting_domain` outputs. Add the requested ownership and routing records at the external DNS provider, then apply again to refresh domain status. Terraform does not create external DNS records because no managed DNS zone is configured in this repository.

### Maintenance mode

Each frontend has an independent build-time maintenance switch in its project `dev.tfvars`:

- Artsgoz: `frontend_maintenance_mode` and `backoffice_maintenance_mode`
- Aksornsara: `frontend_maintenance_mode`

Set the required value to `true`, apply the corresponding Terraform root, and then manually run that application's Cloud Build trigger. Terraform updates the trigger substitution but does not itself rebuild or redeploy the Vite application. Set the value back to `false`, apply, and run the trigger again to leave maintenance mode.

## 4. Plan and apply Aksornsara

Apply Aksornsara first so its Hosting site and API backend exist before configuring the Artsgoz API URL.

```bash
terraform -chdir=infra/terraform/env/dev/aksornsara init
terraform -chdir=infra/terraform/env/dev/aksornsara fmt -check
terraform -chdir=infra/terraform/env/dev/aksornsara validate
terraform -chdir=infra/terraform/env/dev/aksornsara plan \
  -var-file=dev.tfvars \
  -out=tfplan
terraform -chdir=infra/terraform/env/dev/aksornsara apply tfplan
```

## 5. Plan and apply Artsgoz

```bash
terraform -chdir=infra/terraform/env/dev/artsgoz init
terraform -chdir=infra/terraform/env/dev/artsgoz fmt -check
terraform -chdir=infra/terraform/env/dev/artsgoz validate
terraform -chdir=infra/terraform/env/dev/artsgoz plan \
  -var-file=dev.tfvars \
  -out=tfplan
terraform -chdir=infra/terraform/env/dev/artsgoz apply tfplan
```

Never reuse a plan file between projects. The two roots, state buckets, deployer identities, and Cloud Build triggers are independent.

## Existing Firebase resources

If a Hosting site, Firebase project, service account, bucket, or App Hosting backend already exists, do not recreate or delete it manually. Import it into the matching Terraform root before applying. Review the plan carefully and use the import identifier required by the Google provider resource.

## Cloud Build

After `cloud_build_repository` is enabled and Terraform is applied:

- The Artsgoz project receives frontend and backoffice triggers only.
- The Aksornsara project receives frontend and API triggers only.
- Each trigger uses a Firebase deployer service account from its own project.
- Terraform plans and approved applies use the corresponding project state bucket and `env/dev` state prefix.
