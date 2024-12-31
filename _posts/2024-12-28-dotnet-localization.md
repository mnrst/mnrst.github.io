---
layout: post
title: .NET Web アプリの多言語対応を試してみた
---

アプリの多言語対応と言えば、画面上に表示される文言が英語だったり日本語だったりの事だと認識しています。

言語ごとの辞書ファイルを用意しておいて、表示する文言を出し分けるだけなので、自前で実装しても良いのかもしれません。

今回は、.NET Web アプリで教科書的な多言語対応（グローバライズとローカライズ）を試してみました。

## 検証用 Web アプリを作成

```bash
$ dotnet new web --name MnrWeb 

$ cd MnrWeb

$ dotnet run

$ curl http://localhost:5261
Hello World!
```

## Program.cs を多言語化

```bash
$ code Program.cs
```

変更前のコード。

```cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
```

変更後のコード。

```cs
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Localization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

var app = builder.Build();

var supportedCultures = new[]
{
    new CultureInfo("en-US"),
    new CultureInfo("ja-JP")
};

app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en-US"),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures
});

// app.MapGet("/", () => "Hello World!");
app.MapGet("/", (IStringLocalizer<Program> localizer) => localizer["Hello"].Value);

app.Run();
```

## 辞書ファイルを作成

```bash
$ mkdir Resources

$ cat <<EOF > Resources/Program.en-US.resx
<?xml version="1.0" encoding="utf-8"?>
<root>
  <data name="Hello" xml:space="preserve">
    <value>Hello, World!</value>
  </data>
</root>
EOF

$ cat <<EOF > Resources/Program.ja-JP.resx
<?xml version="1.0" encoding="utf-8"?>
<root>
  <data name="Hello" xml:space="preserve">
    <value>こんにちは、世界！</value>
  </data>
</root>
EOF
```

## 動作確認

```bash
$ dotnet run

$ curl http://localhost:5261
Hello, World!

$ curl http://localhost:5261 -H "Accept-Language: ja-JP"
こんにちは、世界！

$ curl http://localhost:5261 -H "Accept-Language: en-US"
Hello, World!

$ curl http://localhost:5261 -H "Accept-Language: en-UK"
Hello, World!

$ curl "http://localhost:5261/?culture=ja-JP"
こんにちは、世界！
```

## 参考

[ローカライズされた ASP.NET Core アプリで要求ごとに言語またはカルチャを選択する戦略を実装する](https://learn.microsoft.com/ja-jp/aspnet/core/fundamentals/localization/select-language-culture?view=aspnetcore-8.0)