---
layout: post
title: nginx で Basic 認証を設定してみた
---

外出先からのアクセスを想定していたり、固定 IP アドレスで制限できないなど、開発中の Web サイトにアクセス制限を設けるなら、簡易的ではあるものの Basic 認証が手軽で良いです。

## パスワード文字列をランダム生成

```bash
$ passwd=$(openssl rand -base64 32)

$ echo $passwd
```

## パスワードを apr アルゴリズムで暗号化

```bash
$ encpasswd=$(openssl passwd -apr1 $passwd)
```

## Basic 認証の設定ファイルを作成

```bash
$ echo "muzuinamae:$encpasswd" | sudo tee -a /etc/nginx/.htpasswd

$ cat /etc/nginx/.htpasswd
```

## nginx の設定ファイルを修正

```bash
$ sudo vi /etc/nginx/sites-available/default
```

## nginx の Basic 認証設定例

```conf
location / {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

## nginx の設定に問題ないことを確認

```bash
$ sudo nginx -t
```

## nginx の設定を再読み込み

```bash
$ sudo nginx -s reload
```

## 参考

[Module ngx_http_auth_basic_module](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
