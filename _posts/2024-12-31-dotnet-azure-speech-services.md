---
layout: post
title: .NET を使って Azure AI サービスの Speech Services でテキストを音声に変換してみた
---

自分の声を録音して、自分の音声モデルを作成すれば、オンラインで何かしらの発表時に言い間違えたり言い忘れたりする事もなく済みそうです。

その前に、テキストを音声に変換する最小限のやり方を理解しておきたく、実際に試してみました。

## 検証用 Speech Services を作成

```bash
prefix=mnrssf
region=japaneast

az group create \
  --name ${prefix}-rg \
  --location $region

az cognitiveservices account create \
  --kind SpeechServices \
  --location $region \
  --name $prefix \
  --resource-group ${prefix}-rg \
  --sku F0 \
  --yes
```

## 環境変数に Speech Services 用のキーとリージョンをセット

```bash
export SPEECH_KEY=$(az cognitiveservices account keys list \
  --name $prefix \
  --resource-group ${prefix}-rg \
  --query key1 \
  --output tsv)

export SPEECH_REGION=$region
```

## 検証用 .NET コンソールアプリを作成

```bash
dotnet new console -o $prefix

cd $prefix

dotnet add package Microsoft.CognitiveServices.Speech

code Program.cs
```

```cs
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

string subscriptionKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
string subscriptionRegion = Environment.GetEnvironmentVariable("SPEECH_REGION");

var config = SpeechConfig.FromSubscription(subscriptionKey, subscriptionRegion);
config.SpeechSynthesisVoiceName = "ja-JP-NanamiNeural";
var synthesizer = new SpeechSynthesizer(config);

string text = "テキストから音声を生成しています。";
await synthesizer.SpeakTextAsync(text);
```

## コンソールアプリを実行して音声を確認

```bash
dotnet run
```

「テキストから音声を生成しています」という音声がスピーカーから聞こえます。

## 後片付け

```bash
az group delete \
  --name ${prefix}-rg \
  --yes
```

## 参考

[クイック スタート: テキストを音声に変換する](https://learn.microsoft.com/ja-jp/azure/ai-services/speech-service/get-started-text-to-speech?tabs=macos%2Cterminal&pivots=programming-language-csharp)

[az cognitiveservices account create](https://learn.microsoft.com/ja-jp/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-create)
