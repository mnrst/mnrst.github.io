---
layout: post
title: GPU なし Ubuntu で Ollama のカスタムモデルを試してみた
---

既存の言語モデルをベースに追加学習させたり、RAG で検索拡張したり、カスタムパラメーターでモデルをカスタムしたりと、LLM を単に使うだけではなくシステムの一部として何がどうなるのか、少し興味があります。

これらをやり始めると、Apple シリコン の GPU では物足りなく感じて、NVIDIA の GPU が欲しくなってきます。

そこで今回は、GPU なし Ubuntu で Ollama のカスタムモデルを試してみました。

## Multipass で Ubuntu 検証環境を用意

```bash
$ multipass launch -n primary --cpus 4 --memory 4G --disk 20G 24.04

$ multipass shell
```

## Ollama をインストール

```bash
$ curl -fsSL https://ollama.com/install.sh | sh
```

最後に下記のメッセージが表示されたので、CPU オンリーモードです。

```txt
WARNING: No NVIDIA/AMD GPU detected. Ollama will run in CPU-only mode.
```

## 既存の言語モデルを試す

```bash
$ ollama run llama3.2:1b
```

```txt
>>> 日本の首都は？
東京です。

>>> /bye
```

## モデルファイルを作成し test モデルを作成

`SYSTEM` は、日本語で記述しても意図した結果になりませんでした。

```bash
$ cat <<EOF > Modelfile
FROM llama3.2:1b
PARAMETER temperature 0.8
SYSTEM "You're the most knowledgeable person in the world. Add a relevant piece of trivia to your answer to the question."
EOF

$ ollama create test -f Modelfile
```

## カスタムモデル test の動作確認

```bash
$ ollama run test
```

意図した通りになりましたが、ウンチクの内容はハルシネーションです。

```txt
>>> 日本の首都は？
東京都です。Trivia：東京電力が持有的東武京王線の駅である渋谷 Station では、1995年7月に、東急西南線と東急東線の駅間で最高速度100 km/h (62 mph) を設定しました。これは日本で初めてとなりました。

>>> 日本の首都は？
Tokyoです。Trivia：東京には多くのテナントがありますが、最も知られているのは東京タワースクエアです。この広い天井下部は1958年に完成し、その後改名されて「東京タワースクエア」と呼ばれました。

>>> /bye
```

## 検証が終わったら後片付け

```bash
$ exit

$ multipass stop

$ multipass delete primary

$ multipass purge
```

## （おまけ）DiffusionBee で生成した本記事のイメージ画像

![2025-03-30-ollama-custom-model-01.png](/assets/img/2025-03-30-ollama-custom-model-01.png)

## 参考

[Ollama Model File](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)
