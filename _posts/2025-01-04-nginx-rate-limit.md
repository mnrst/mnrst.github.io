---
layout: post
title: 同じ IP アドレスからの過多なリクエストを防止するために Nginx のレートリミットを試してみた
---

年末年始に DDoS 攻撃のニュースがいくつかありました。

ふと Nginx でも簡易的に DoS 対策することは可能なのではないかと調べてみました。

DDoS 攻撃は分散型なので効果は限定的ではあるものの、Nginx で同じ IP アドレスからの過多なリクエストを防止する事ができそうなので、試してみました。

## 検証用 Nginx を Multipass の Ubuntu で用意

```bash
$ multipass launch -n primary --cpus 4 --memory 4G --disk 20G 24.04

$ multipass shell

$ sudo apt update

$ sudo apt install -y nginx

$ curl -I localhost
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Fri, 03 Jan 2025 23:32:43 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Fri, 03 Jan 2025 23:32:21 GMT
Connection: keep-alive
ETag: "67787385-267"
Accept-Ranges: bytes
```

## Nginx の設定ファイルにレートリミットを追加

```bash
$ sudo vi /etc/nginx/sites-available/default
```

```txt
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=5r/s;

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name _;

    location / {
        try_files $uri $uri/ =404;
        limit_req zone=mylimit burst=10 nodelay;
        limit_req_status 429;
    }
}
```

```bash
$ sudo nginx -t

$ sudo nginx -s reload
```

## 単体で動作確認

```bash
$ curl -sI localhost | head -n 1
HTTP/1.1 200 OK
```

## 過多なリクエストで動作確認

```bash
$ seq 1 20 | xargs -I{} sh -c "echo -n {}:; curl -sI localhost | head -n 1"
1:HTTP/1.1 200 OK
2:HTTP/1.1 200 OK
3:HTTP/1.1 200 OK
4:HTTP/1.1 200 OK
5:HTTP/1.1 200 OK
6:HTTP/1.1 200 OK
7:HTTP/1.1 200 OK
8:HTTP/1.1 200 OK
9:HTTP/1.1 200 OK
10:HTTP/1.1 200 OK
11:HTTP/1.1 200 OK
12:HTTP/1.1 429 Too Many Requests
13:HTTP/1.1 429 Too Many Requests
14:HTTP/1.1 429 Too Many Requests
15:HTTP/1.1 429 Too Many Requests
16:HTTP/1.1 429 Too Many Requests
17:HTTP/1.1 429 Too Many Requests
18:HTTP/1.1 429 Too Many Requests
19:HTTP/1.1 429 Too Many Requests
20:HTTP/1.1 429 Too Many Requests
```

バーストの 10 も含めて、概ね想定通りの動きになりました。

## 後片付け

```bash
$ exit

$ multipass stop

$ multipass delete primary

$ multipass purge
```

## 参考

[Module ngx_http_limit_req_module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
