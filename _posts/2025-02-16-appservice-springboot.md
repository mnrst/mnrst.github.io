---
layout: post
title: Azure App Service の SSH 上で Spring Boot を動かしてみた
---

前回の「[Azure App Service からプライベートエンドポイント経由の Azure SQL Database へパスワードレス Entra 認証を試してみた](/2025/02/15/appservice-sqldatabase-privateendpoint.html)」の続きです。

実際に Java の Spring Boot を使用して、マネージド ID を使用したパスワードレス認証を試してみました。

## App Service 内の Java バージョン確認

```bash
$ java -version
Picked up JAVA_TOOL_OPTIONS: -Djava.net.preferIPv4Stack=true 
openjdk version "17.0.12" 2024-07-16 LTS
OpenJDK Runtime Environment Microsoft-9889599 (build 17.0.12+7-LTS)
OpenJDK 64-Bit Server VM Microsoft-9889599 (build 17.0.12+7-LTS, mixed mode, sharing)
```

## App Service 内に必要なツールをインストール

```bash
$ apt install -y maven unzip zip vim
```

## Maven のバージョン確認

```bash
$ mvn -version
Picked up JAVA_TOOL_OPTIONS: -Djava.net.preferIPv4Stack=true 
Apache Maven 3.6.3
Maven home: /usr/share/maven
Java version: 17.0.12, vendor: Microsoft, runtime: /usr/lib/jvm/msopenjdk-17-amd64
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "5.15.173.1-1.cm2", arch: "amd64", family: "unix"
```

## Spring Boot CLI をインストール

```bash
$ curl -s "https://get.sdkman.io" | bash

$ source "$HOME/.sdkman/bin/sdkman-init.sh"

$ sdk install springboot

$ spring --version
Picked up JAVA_TOOL_OPTIONS: -Djava.net.preferIPv4Stack=true 
Spring CLI v3.4.2
```

## 検証用コンソールアプリを作成

```bash
$ spring init --build=maven --java-version=17 midtest

$ cd midtest

$ vi src/main/java/com/example/midtest/DemoApplication.java
```

```java
package com.example.midtest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);

		SQLServerDataSource ds = new SQLServerDataSource();
        ds.setServerName("mnrappsql-sqlsrv.privatelink.database.windows.net");
        ds.setDatabaseName("sqldb");
        ds.setAuthentication("ActiveDirectoryManagedIdentity");

        try (
            Connection connection = ds.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT @@VERSION;")
        ) {
            while (rs.next()) {
                System.out.println("SQL Server Version: " + rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
	}

}
```

```bash
$ vi pom.xml
```

以下を `<dependencies>` に追加。

```xml:pom.xml
		<dependency>
			<groupId>com.microsoft.sqlserver</groupId>
			<artifactId>mssql-jdbc</artifactId>
			<version>12.8.1.jre11</version>
		</dependency>

		<dependency>
			<groupId>com.microsoft.azure</groupId>
			<artifactId>msal4j</artifactId>
			<version>1.19.0</version>
		</dependency>

		<dependency>
			<groupId>com.azure</groupId>
			<artifactId>azure-identity</artifactId>
			<version>1.13.3</version>
		</dependency>
```



## 検証用コンソールアプリの動作確認


```bash
$ ./mvnw spring-boot:run
（中略）
SQL Server Version: Microsoft SQL Azure (RTM) - 12.0.2000.8 
        Oct  2 2024 11:51:41 
        Copyright (C) 2022 Microsoft Corporation

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  48.205 s
[INFO] Finished at: 2025-02-16T00:16:21Z
[INFO] ------------------------------------------------------------------------
```

![2025-02-16-appservice-springboot-01.png](/assets/img/2025-02-16-appservice-springboot-01.png)

## 参考

[Microsoft SQL Server 用 JDBC Driver のダウンロード](https://learn.microsoft.com/ja-jp/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-ver16)
