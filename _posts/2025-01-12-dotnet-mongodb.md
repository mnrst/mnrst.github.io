---
layout: post
title: .NET 8 コンソールアプリで MongoDB の Insert Update Find Delete をやってみた
---

NoSQL データベースの一種である MongoDB は、Azure Cosmos DB や MongoDB Atlas などで Free Tier があります。

RDBMS が得意とする高度なトランザクション処理が不要なアプリケーションでは、コストやパフォーマンスが良いイメージです。

そこで、.NET 8 コンソールアプリで MongoDB の Insert Update Find Delete を試してみました。

## 検証用の MongoDB を Docker で用意

```bash
$ docker run -d \
  --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
  -e MONGO_INITDB_ROOT_PASSWORD=secretpass \
  mongo
```

## 検証用の MongoDB の動作確認

```bash
$ mongosh \
  -u mongoadmin \
  -p secretpass \
  --authenticationDatabase admin \
  testdb

testdb> show databases
admin   100.00 KiB
config   12.00 KiB
local    40.00 KiB

testdb> quit
```

## MongoDB の接続情報を環境変数にセット

```bash
$ export MONGO_CONNECTION_STRING=mongodb://mongoadmin:secretpass@localhost:27017
```

## 検証用の .NET 8 コンソールアプリを作成

```bash
$ dotnet new console -n MnrMongo

$ cd MnrMongo

$ dotnet run
Hello, World!
```

## .NET に MongoDB パッケージを追加

```bash
$ dotnet add package MongoDB.Driver
```

## MongoDB 用のコードに書き換え

```bash
code Program.cs
```

```cs
using MongoDB.Driver;
using MongoDB.Bson;

var connectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
var client = new MongoClient(connectionString);
var database = client.GetDatabase("testdb"); 
var collection = database.GetCollection<BsonDocument>("users");

// Insert
var document = new BsonDocument
{
    { "name", "James" },
    { "age", 30 }
};
collection.InsertOne(document);
Console.WriteLine($"Insert: {document["_id"]}");

// Update
var filter = Builders<BsonDocument>.Filter.Eq("name", "James");
var update = Builders<BsonDocument>.Update.Set("age", 31);
var updateResult = collection.UpdateOne(filter, update);
Console.WriteLine($"updateResult: {updateResult.MatchedCount}, Modified: {updateResult.ModifiedCount}");

// Find
var documents = collection.Find(filter).ToList();
foreach (var doc in documents)
{
    Console.WriteLine($"Find: {doc}");
}

// Delete
var result = collection.DeleteOne(filter);
Console.WriteLine($"Deleted: {result.DeletedCount}");
```

## .NET 8 コンソールアプリの動作確認

```bash
$ dotnet run
Insert: 678302b7e02ff85914dbc429
updateResult: 1, Modified: 1
Find: { "_id" : { "$oid" : "678302b7e02ff85914dbc429" }, "name" : "James", "age" : 31 }
Deleted: 1
```

## MongoDB の後片付け

```bash
$ docker stop mongo

$ docker rm mongo

$ docker rmi mongo
```

## 参考

[クイック スタート](https://www.mongodb.com/ja-jp/docs/drivers/csharp/current/quick-start/#std-label-csharp-quickstart)

[クイック リファレンス](https://www.mongodb.com/ja-jp/docs/drivers/csharp/current/quick-reference/#std-label-csharp-quick-reference)

[MongoDB .NET/C# Driver API Reference](https://mongodb.github.io/mongo-csharp-driver/3.1.0/api/index.html)
