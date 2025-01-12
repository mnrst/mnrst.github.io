---
layout: post
title: デザインセンスのない自分が生成 AI に HTML を tailwindcss で良い感じにデザインしてもらった
---

Web デザインって難しいです。

何が難しいかって、色の組み合わせや使用する数、それぞれの大きさや余白など、無限に組み合わせがある気がします。

プログラミングやインフラ構築なら、ある程度の制約の中でベストプラクティスで構成すれば良しと思えます。

そんな、デザインセンスのない自分が生成 AI に HTML を tailwindcss で良い感じにデザインしてもらいました。

## 検証用の HTML を用意

```html
<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website</title>
</head>

<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <main>
        <h2>Main Content</h2>
        <p>This is where your main content goes. You can add articles, images, or any other elements you need.</p>
    </main>
    <footer>
        <p>&copy; 2025 My Website. All rights reserved.</p>
    </footer>
</body>

</html>
```

## 検証用 HTML をブラウザで確認

![2025-01-12-tailwindcss-01.png](/assets/img/2025-01-12-tailwindcss-01.png)

## 生成 AI のプロンプト

```txt
このHTMLをtailwindcssを使用して良い感じにデザインして。
```

## 生成 AI が回答してくれた tailwindcss 入りの HTML

```Html
<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 text-gray-800 font-sans">
    <div class="flex flex-col min-h-screen">
        <header class="bg-blue-600 text-white py-4 shadow-md">
            <div class="container mx-auto px-4">
                <h1 class="text-3xl font-bold text-center">Welcome to My Website</h1>
            </div>
        </header>
        <main class="flex-grow container mx-auto px-4 py-8">
            <h2 class="text-2xl font-semibold mb-4">Main Content</h2>
            <p class="text-gray-700 leading-relaxed">This is where your main content goes. You can add articles, images, or any other elements you need.</p>
        </main>
        <footer class="bg-gray-800 text-gray-400 py-4">
            <div class="container mx-auto px-4 text-center">
                <p>&copy; 2025 My Website. All rights reserved.</p>
            </div>
        </footer>
    </div>
</body>

</html>
```

## 検証用 HTML をブラウザで確認

![2025-01-12-tailwindcss-02.png](/assets/img/2025-01-12-tailwindcss-02.png)

はやり、自分で 0 からデザインするより、時間的にも見た目的にも納得感が高い！

## 参考

[tailwindcss](https://tailwindcss.com/)
