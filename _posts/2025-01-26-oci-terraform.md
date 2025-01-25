---
layout: post
title: Terraform の tfstate を OCI のオブジェクト・ストレージ・バケットに格納してみた
---

tfstate はローカルにあっても良いのですが、異なる環境で Terraform を実行したい場合、すこし不便です。

また、OCI のリソースを扱うなら、OCI のオブジェクト・ストレージ・バケットに tfstate を格納した方が、認証認可の組み合わせが一つで済みます。

## terraform バージョンを確認

```bash
$ terraform -v
Terraform v1.5.5
on darwin_arm64
```

## 自分のプロファイルから「顧客秘密キー」を作成して保存

オブジェクト・ストレージ・バケットは S3 互換なので、AWS の credentials に、アクセスキーとシークレットを記載します。

```bash
# 以下は記載例
$ cat ~/.aws/credentials
[oci]
aws_access_key_id = <your access key>
aws_secret_access_key = <your secret key>
```

## tf ファイルに S3 バックエンドを設定

bucket, region, namespace, profile を環境にあわせて記載します。profile は、`~/.aws/credentials` のプロファイルです。

```terraform
# 以下は記載例
terraform {
  required_providers {
    oci = {
      source = "oracle/oci"
    }
  }

  backend "s3" {
    bucket                      = "terraform"
    region                      = "ap-tokyo-1"
    key                         = "terraform.tfstate"
    endpoint                    = "https://<namespace>.compat.objectstorage.ap-tokyo-1.oraclecloud.com"
    skip_region_validation      = true
    skip_credentials_validation = true
    force_path_style            = true
    profile                     = "oci"
  }
}
```

## （おまけ） OCI の設定が複数ある場合

`~/.oci/config` で DEFAULT 以外のプロファイルを使用したい場合は、config_file_profile を記載する。

```terraform
provider "oci" {
  config_file_profile = "myprofile"
}
```

## 参考

[状態ファイル用のオブジェクト・ストレージの使用](https://docs.oracle.com/ja-jp/iaas/Content/dev/terraform/object-storage-state.htm)
