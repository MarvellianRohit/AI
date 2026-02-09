provider "google" {
  project = "nexus-ai-project"
  region  = "us-central1"
}

resource "google_cloud_run_service" "nexus_ai" {
  name     = "nexus-ai-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/nexus-ai-project/nexus-ai-image:latest"
        env {
          name  = "DATABASE_URL"
          value = google_sql_database_instance.instance.connection_name
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_sql_database_instance" "instance" {
  name             = "nexus-ai-db-instance"
  region           = "us-central1"
  database_version = "POSTGRES_13"

  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_database" "database" {
  name     = "nexus_ai_db"
  instance = google_sql_database_instance.instance.name
}

output "url" {
  value = google_cloud_run_service.nexus_ai.status[0].url
}
