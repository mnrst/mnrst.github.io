---
layout: post
title: React Native 開発を効率化する Expo フレームワークを試してみた 
---

単一のコードベースでクロスプラットフォームアプリが開発できる React Native ですが、デバイスごとに動作確認するのは大変面倒です。

そこで、開発の生産性を向上する事ができる Expo という開発フレームワークを使ってみました。

## 検証用アプリを作成

```bash
npx create-expo-app@latest MnrExpo
```

下記が表示されれば OK です。

```txt
✅ Your project is ready!
```

## デフォルト状態の検証用アプリを確認

```bash
cd MnrExpo

npm run ios
```

![2025-03-01-expo-react-native-01.png](/assets/img/2025-03-01-expo-react-native-01.png)

```bash
# Android は先にシミュレーターを起動しておく必要がある
flutter emulators --launch Medium_Phone_API_35

npm run android
```

![2025-03-01-expo-react-native-02.png](/assets/img/2025-03-01-expo-react-native-02.png)

```bash
npm run web
```

![2025-03-01-expo-react-native-03.png](/assets/img/2025-03-01-expo-react-native-03.png)

## Expo を起動

```bash
npx expo start
```

`a` や `i` や `w` で各環境を同時に確認する事ができます。

## コードを修正

```bash
code app/\(tabs\)/index.tsx
```

`Welcome` を `Hello World` に変更します。

変更前。

```tsx
<ThemedText type="title">Welcome!</ThemedText>
```

変更後。

```tsx
<ThemedText type="title">Hello World!</ThemedText>
```

## 各環境が同時に修正されるのを確認

![2025-03-01-expo-react-native-04.png](/assets/img/2025-03-01-expo-react-native-04.png)

## 参考

[Create your first app](https://docs.expo.dev/tutorial/create-your-first-app/)
