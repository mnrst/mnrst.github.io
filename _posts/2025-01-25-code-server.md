---
layout: post
title: Ubuntu に code-server を入れて自分専用のブラウザ版 Visual Studio Code 環境を作ってみた
---

ブラウザ版 Visual Studio Code の code-server があれば、例えばスマホやタブレットからでも操作できます。

ふと技術課題の解決方法やアイデアを思いついた時に、この環境があれば便利です。

外出先の場合は、別途 VPN 接続など固定 IP アドレス環境経由でアクセスする必要はありますが、IP アドレス制限も追加して、よりセキュアな環境にしておくと安心です。

## code-server をインストール

```bash
$ curl -fsSL https://code-server.dev/install.sh | sh
```

## code-server のポート番号を変更

```bash
$ sed -i 's/:8080/:8088/' ~/.config/code-server/config.yaml

$ cat ~/.config/code-server/config.yaml
```

## code-server を再起動して自動起動を有効化

```bash
$ sudo systemctl restart --now code-server@$USER

$ sudo systemctl enable --now code-server@$USER

$ sudo systemctl status code-server@$USER
```

## nginx の設定ファイルを修正

```bash
$ sudo vi /etc/nginx/sites-available/default
```

## nginx のリバースプロキシと WebSocket の設定例

```conf
location / {
    proxy_pass http://localhost:8088/;
    proxy_set_header Host $http_host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection upgrade;
    proxy_set_header Accept-Encoding gzip;
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

## code-server のログイン画面

![2025-01-25-code-server-01.png](/assets/img/2025-01-25-code-server-01.png)

## code-server のメイン画面

![2025-01-25-code-server-02.png](/assets/img/2025-01-25-code-server-02.png)

## 参考

[coder/code-server: VS Code in the browser](https://github.com/coder/code-server)

[code-server Docs](https://coder.com/docs/code-server/guide)
