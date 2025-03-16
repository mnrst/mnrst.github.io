---
layout: post
title: Mac の Multipass で Ubuntu Desktop を試してみた
---

クリーンな検証環境が必要な時は、別途仮想マシンを用意するのが手っ取り早いです。

昔と違って仮想マシンを作るのに、ISO イメージから OS インストールをしなくて済むのは便利です。

SSH やリモートデスクトップで仮想マシンに接続するので、手元のマウスとキーボードで操作できます。

そこで今回は、Mac の Multipass で Ubuntu Desktop を試してみました。

## 検証用の仮想マシンを作成

```bash
$ brew install multipass

$ multipass --version
multipass   1.15.1+mac
multipassd  1.15.1+mac

$ multipass launch -n primary --cpus 4 --memory 4G --disk 20G 24.04

$ multipass list
Name                    State             IPv4             Image
primary                 Running           192.168.64.3     Ubuntu 24.04 LTS

$ multipass shell
```

## Ubuntu に Desktop と xrdp をインストール

```bash
sudo apt update

sudo apt install -y ubuntu-desktop xrdp
```

## ログインパスワードを設定

```bash
sudo passwd ubuntu
```

## リモートデスクトップソフトから接続

![2025-03-16-multipass-ubuntu-desktop-01.png](/assets/img/2025-03-16-multipass-ubuntu-desktop-01.png)

## 仮想マシンを停止

```bash
$ multipass stop

$ multipass list
Name                    State             IPv4             Image
primary                 Stopped           --               Ubuntu 24.04 LTS
```

## 仮想マシンが不要になったら後片付け

```bash
$ multipass delete primary

$ multipass purge
```

## 参考

[xrdp をインストールして、Ubuntu でリモート デスクトップを使用するように構成する
](https://learn.microsoft.com/ja-jp/azure/virtual-machines/linux/use-remote-desktop?tabs=azure-cli)
