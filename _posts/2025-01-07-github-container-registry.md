---
layout: post
title: GitHub の個人アカウントに Docker イメージを PUSH して PULL してみた
---

Azure や AWS などのクラウドサービス上のコンテナレジストリに、コンテナーイメージを保管するとなると、少なからず利用料金が発生します。

無料で使わせて頂いている GitHub には、コンテナーイメージを管理できる、コンテナレジストリ機能があります。

そこで、クラウドサービスでコンテナーイメージを利用した検証をする際の、検証用サンプルアプリのコンテナーイメージを保管する場所として利用するため、使い方を簡易検証してみました。

## 検証用 Docker イメージをダウンロード

```bash
$ docker pull alpine
Using default tag: latest
latest: Pulling from library/alpine
707c94c90c59: Pull complete 
Digest: sha256:b97e2a89d0b9e4011bb88c02ddf01c544b8c781acf1f4d559e7c8f12f1047ac3
Status: Downloaded newer image for alpine:latest
docker.io/library/alpine:latest

$ docker images alpine
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
alpine       latest    6f646456f898   17 hours ago   8.16MB
```

## GitHub の PAT (classic) を環境変数に登録

write:packages スコープのみを有効にした PAT (classic) を用意して環境変数に登録します。

```bash
$ export CR_PAT=ghp_your_pat_here
```

## GitHub のコンテナレジストリにログイン

```bash
$ echo $CR_PAT | docker login ghcr.io -u mnrst --password-stdin
Login Succeeded
```

## 検証用 Docker イメージを GitHub 用にタグ付け

```bash
$ docker tag alpine:latest ghcr.io/mnrst/alpine:latest

$ docker images ghcr.io/mnrst/alpine:latest
REPOSITORY             TAG       IMAGE ID       CREATED        SIZE
ghcr.io/mnrst/alpine   latest    6f646456f898   17 hours ago   8.16MB
```

## GitHub コンテナレジストリに PUSH

```bash
$ docker push ghcr.io/mnrst/alpine:latest
The push refers to repository [ghcr.io/mnrst/alpine]
c1f4b58592d5: Pushed 
latest: digest: sha256:23a385544a4e43b48a3deb5aca554fd005ea7d49e41829e31a1f5291b452796a size: 527
```

## ローカルの Docker イメージを削除

```bash
$ docker rmi ghcr.io/mnrst/alpine:latest
Untagged: ghcr.io/mnrst/alpine:latest
Untagged: ghcr.io/mnrst/alpine@sha256:23a385544a4e43b48a3deb5aca554fd005ea7d49e41829e31a1f5291b452796a
```

## GitHub コンテナレジストリから PULL

```bash
$ docker pull ghcr.io/mnrst/alpine:latest
latest: Pulling from mnrst/alpine
Digest: sha256:23a385544a4e43b48a3deb5aca554fd005ea7d49e41829e31a1f5291b452796a
Status: Downloaded newer image for ghcr.io/mnrst/alpine:latest
ghcr.io/mnrst/alpine:latest

$ docker images ghcr.io/mnrst/alpine:latest
REPOSITORY             TAG       IMAGE ID       CREATED        SIZE
ghcr.io/mnrst/alpine   latest    6f646456f898   17 hours ago   8.16MB
```

## GitHub コンテナレジストリからログアウト

```bash
$ docker logout ghcr.io
Removing login credentials for ghcr.io
```

## ブラウザで Docker イメージを確認

ダウンロード数も確認できます。

![2025-01-07-github-container-registry-01.png](/assets/img/2025-01-07-github-container-registry-01.png)

## 参考

[コンテナレジストリの利用](https://docs.github.com/ja/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
