---
layout: post
title: Azure DevOps で PAT を使用せず Entra 認証を使って git clone してみた
---

Git には PAT か SSH キーを使って認証するのが当たり前だと思っていました。

Azure DevOps のドキュメントを読むと、Entra ID で認証できるようなので、実際に試してみました。

前提条件は、Azure DevOps から Entra ID に接続（ Organization Settings -> Microsoft Entra で設定）済みである事が前提です。

当然ですが Entra ID で認証するユーザーが Azure DevOps の Repos にアクセスできる必要もあります。

## 検証用の Ubuntu 環境で git clone できないことを確認

```bash
$ git clone https://mnrsdev@dev.azure.com/mnrsdev/mnrpoc/_git/mnrpoc
Cloning into 'mnrpoc'...
Password for 'https://mnrsdev@dev.azure.com': 
fatal: Authentication failed for 'https://dev.azure.com/mnrsdev/mnrpoc/_git/mnrpoc/'
```

## Entra 認証で Azure DevOps 用のトークンを取得

499b84ac-1321-427f-aa17-267ca6975798 が Azure DevOps の ID のようです。

```bash
$ az login

$ accessToken=$(az account get-access-token \
  --resource 499b84ac-1321-427f-aa17-267ca6975798 \
  --query accessToken \
  --output tsv)
```

## Entra トークンで git clone を試す

```bash
$ git -c http.extraheader="Authorization: Bearer $accessToken" \
  clone https://dev.azure.com/mnrsdev/mnrpoc/_git/mnrpoc
Cloning into 'mnrpoc'...
remote: Azure Repos
remote: Found 37 objects to send. (2 ms)
Unpacking objects: 100% (37/37), 5.77 KiB | 537.00 KiB/s, done.
```

## 次の検証のためにディレクトリを削除

```bash
$ rm -rf mnrpoc
```

## Azure DevOps 用の alias を作成

```bash
$ alias gitaz="git -c http.extraheader=\"Authorization: Bearer $(az account get-access-token \
  --resource 499b84ac-1321-427f-aa17-267ca6975798 \
  --query accessToken \
  --output tsv)\""
```

## alias を使って git clone を試す

```bash
$ gitaz clone https://mnrsdev@dev.azure.com/mnrsdev/mnrpoc/_git/mnrpoc
Cloning into 'mnrpoc'...
remote: Azure Repos
remote: Found 37 objects to send. (2 ms)
Unpacking objects: 100% (37/37), 5.77 KiB | 590.00 KiB/s, done.
```

## ついでに git pull も試す

```bash
$ cd mnrpoc

$ gitaz pull
Already up to date.
```

## 参考

[Microsoft Entra OAuth トークン](https://learn.microsoft.com/ja-jp/azure/devops/repos/git/auth-overview?view=azure-devops&tabs=Windows#microsoft-entra-oauth-tokens)
