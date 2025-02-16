---
layout: post
title: .NET 9 の MAUI Blazor Hybrid でネイティブアプリと Web アプリを試してみた
---

.NET 9 からネイティブアプリと Web アプリのソースを共通化したテンプレートが提供されるようになりました。

手元の Mac 環境で動作するか、.NET 9 の MAUI Blazor Hybrid でネイティブアプリと Web アプリを試してみました。

## 自分の .NET SDK 環境を確認

```zsh
% dotnet --list-sdks
6.0.428 [/usr/local/share/dotnet/sdk]
8.0.404 [/usr/local/share/dotnet/sdk]
9.0.102 [/usr/local/share/dotnet/sdk]
```

## .NET MAUI ワークロードをインストール

```zsh
% sudo dotnet workload install maui
```

## .NET MAUI 関連のテンプレートを確認

```zsh
% dotnet new list | grep maui
..NET MAUI ContentPage (C#)               maui-page-csharp            [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Tizen/Xaml/Code                    
..NET MAUI Window (C#)                    maui-window-csharp          [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Tizen/Xaml/Code                    
.NET MAUI Blazor Hybrid and Web App       maui-blazor-web             [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/Windows/Tizen/Blazor/Blazor Hybrid/Mobile
.NET MAUI Blazor アプリ                   maui-blazor                 [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/Windows/Tizen/Blazor/Blazor Hybrid/Mobile
.NET MAUI ContentPage (XAML)              maui-page-xaml              [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Tizen/Xaml/Code                    
.NET MAUI ContentView (XAML)              maui-view-xaml              [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Tizen/Xaml/Code                    
.NET MAUI Multi-Project App               maui-multiproject           [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/Windows/Mobile                           
.NET MAUI ResourceDictionary (XAML)       maui-dict-xaml              [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Xaml/Code                          
.NET MAUI Window (XAML)                   maui-window-xaml            [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Tizen/Xaml/Code                    
.NET MAUI アプリ                          maui                        [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/Windows/Tizen/Mobile                     
.NET MAUI クラス ライブラリ               mauilib                     [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/Windows/Tizen/Mobile                     
.NET MAUI コンテンツ ビュー (C#)          maui-view-csharp            [C#]        MAUI/Android/iOS/macOS/Mac Catalyst/WinUI/Tizen/Xaml/Code                    
```

## .NET MAUI Blazor Hybrid and Web App テンプレートで検証用アプリを作成

```zsh
% dotnet new maui-blazor-web -o mnrmaui

% cd mnrmaui
```

## ビルドが通るか確認

Xcode や Andoroid Studio や JDK 17 がインストール済みで、ローカル環境が整っていればビルドが通りました。

```zsh
% dotnet build                                             
復元が完了しました (0.5 秒)
  mnrmaui.Shared 成功しました (0.1 秒) → mnrmaui.Shared/bin/Debug/net9.0/mnrmaui.Shared.dll
  mnrmaui.Web 成功しました (0.1 秒) → mnrmaui.Web/bin/Debug/net9.0/mnrmaui.Web.dll
  mnrmaui net9.0-ios 成功しました (0.4 秒) → mnrmaui/bin/Debug/net9.0-ios/iossimulator-arm64/mnrmaui.dll
  mnrmaui net9.0-maccatalyst 成功しました (0.4 秒) → mnrmaui/bin/Debug/net9.0-maccatalyst/maccatalyst-arm64/mnrmaui.dll
  mnrmaui.Shared 成功しました (0.1 秒) → mnrmaui.Shared/bin/Debug/net9.0/mnrmaui.Shared.dll
  mnrmaui net9.0-android 成功しました (39.9 秒) → mnrmaui/bin/Debug/net9.0-android/mnrmaui.dll
41.0 秒後に 成功しました をビルド
```

## iOS の動作確認

```zsh
% dotnet build -t:Run -f net9.0-ios
```

![dotnet9-maui-01.png](/assets/img/2025-01-18-dotnet9-maui-01.png)

## Android の動作確認

```zsh
% dotnet build -t:Run -f net9.0-android
```

![dotnet9-maui-02.png](/assets/img/2025-01-18-dotnet9-maui-02.png)

## Mac の動作確認

```zsh
% dotnet build -t:Run -f net9.0-maccatalyst
```

![dotnet9-maui-03.png](/assets/img/2025-01-18-dotnet9-maui-03.png)

## Web アプリの動作確認

```zsh
% dotnet run --project mnrmaui.Web/mnrmaui.Web.csproj
```

![dotnet9-maui-04.png](/assets/img/2025-01-18-dotnet9-maui-04.png)

## 共通化されたコードの例

```zsh
% code mnrmaui.Shared/Pages/Home.razor
```

```razor
@page "/"
@using mnrmaui.Shared.Services
@inject IFormFactor FormFactor

<PageTitle>Home</PageTitle>

<h1>Hello, world!</h1>

Welcome to your new app running on <em>@factor</em> using <em>@platform</em>.

@code {
    private string factor => FormFactor.GetFormFactor();
    private string platform => FormFactor.GetPlatform();
}
```

@factor で、Tablet / Phone / Desktop / Web がそれぞれ出力されているのが、スクショからわかります。

@platform で、iOS / Android / MacCatalyst / Unix がそれぞれ出力されているのが、スクショからわかります。

## 参考

[.NET MAUI Blazor Hybrid および Web アプリ ソリューション テンプレート](https://learn.microsoft.com/ja-jp/aspnet/core/blazor/hybrid/tutorials/maui-blazor-web-app?view=aspnetcore-9.0#net-maui-blazor-hybrid-and-web-app-solution-template)
