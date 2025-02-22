---
layout: post
title: Terraform で Firebase プロジェクトと Web アプリを登録して CLI で静的サイトの Hosting を作ってみた
---

最初は Web GUI で動作確認をしてから、同じパターンを何度も繰り返せるように CLI で作成手順を作成する事がよくあります。

今回は、Terraform で Firebase プロジェクトと Web アプリを登録して CLI で静的サイトの Hosting を作ってみました。

## Terraform で Firebase プロジェクトを登録

[Terraform と Firebase を使ってみる](https://firebase.google.com/docs/projects/terraform/get-started?hl=ja#general-workflow-terraform-and-firebase)

こちらの Firebase ドキュメントを参考に、`main.tf` を作成します。

`mnr-fb-test` の箇所は、Google Cloud のプロジェクト ID なので、重複しないよう変更します。

```terraform
# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

# Configures the provider to use the resource block's specified project for quota checks.
provider "google-beta" {
  user_project_override = true
}

# Configures the provider to not use the resource block's specified project for quota checks.
# This provider should only be used during project creation and initializing services.
provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

# Creates a new Google Cloud project.
resource "google_project" "default" {
  provider = google-beta.no_user_project_override

  name       = "mnr-fb-test"
  project_id = "mnr-fb-test"
  # Required for any service that requires the Blaze pricing plan
  # (like Firebase Authentication with GCIP)
  # billing_account = "000000-000000-000000"

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "serviceusage.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default
  ]
}
```

## Terraform を実行して Firebase プロジェクトを作成

```bash
terraform init

terraform plan

terraform apply
```

## Firebase プロジェクトが作成された事を確認

[Firebase へようこそ](https://console.firebase.google.com/)

こちらにアクセスして Firebase プロジェクトが作成された事を確認します。

![2025-02-22-firebase-hosting-terraform-01.png](/assets/img/2025-02-22-firebase-hosting-terraform-01.png)

この時点では、アプリな何も登録されていません。

![2025-02-22-firebase-hosting-terraform-02.png](/assets/img/2025-02-22-firebase-hosting-terraform-02.png)

## Terraform で Web アプリを登録

`main.tf` に下記を追加します。

```terraform
# Creates a Firebase Web App in the new project created above.
resource "google_firebase_web_app" "default" {
  provider = google-beta

  project      = google_project.default.project_id
  display_name = "My Web App"

  # Wait for Firebase to be enabled in the Google Cloud project before creating this App.
  depends_on = [
    google_firebase_project.default,
  ]
}
```

```bash
terraform plan

terraform apply
```

## Web アプリが登録された事を確認

![2025-02-22-firebase-hosting-terraform-03.png](/assets/img/2025-02-22-firebase-hosting-terraform-03.png)

## Firebase CLI で Web アプリを作成

```bash
$ npm -v
11.1.0

$ npm install -g firebase-tools

$ firebase --version
13.31.2

$ firebase login

$ cat <<EOF > .firebaserc
{
  "projects": {
    "default": "mnr-fb-test"
  }
}
EOF

$ cat <<EOF > firebase.json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
EOF

$ mkdir public

$ cat <<EOF > public/index.html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
EOF
```

## Web アプリを Firebase Hosting にデプロイ

```bash
$ firebase deploy --only hosting

=== Deploying to 'mnr-fb-test'...

i  deploying hosting
i  hosting[mnr-fb-test]: beginning deploy...
i  hosting[mnr-fb-test]: found 1 files in public
✔  hosting[mnr-fb-test]: file upload complete
i  hosting[mnr-fb-test]: finalizing version...
✔  hosting[mnr-fb-test]: version finalized
i  hosting[mnr-fb-test]: releasing new version...
✔  hosting[mnr-fb-test]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/mnr-fb-test/overview
Hosting URL: https://mnr-fb-test.web.app
```

![2025-02-22-firebase-hosting-terraform-04.png](/assets/img/2025-02-22-firebase-hosting-terraform-04.png)

## 参考

[Firebase Hosting を使ってみる](https://firebase.google.com/docs/hosting/quickstart?hl=ja)

[Firebase CLI リファレンス](https://firebase.google.com/docs/cli?hl=ja)

[google_firebase_web_app | Terraform](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firebase_web_app)
