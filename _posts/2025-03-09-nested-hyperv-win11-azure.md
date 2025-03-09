---
layout: post
title: Nested Hyper-V な Windows 11 を Azure VM で作ってみた
---

検証用の仮想マシンが必要になった時、自分の物理端末に仮想化ソフトを入れたり、自作 PC に入れた VMware 環境を使って検証していました。（一昔前までは）

今ではクラウドファースト。検証用の仮想マシンが必要になったら、いつでもどこからでも検証環境が用意できるので大変便利です。

今回は Hyper-V を使った検証をするために、Nested Hyper-V な Windows 11 を Azure VM で作ってみました。

## 検証用の仮想マシンを作成

Nested Hyper-V が可能な VM サイズにしています。

また、デフォルトの NSG に、後から自身の IP アドレスを許可するようにしています。

```bash
region=japaneast
prefix=mnrw11

az group create \
  --name ${prefix}-rg \
  --location $region

az vm create \
  --resource-group ${prefix}-rg \
  --name ${prefix}-vm \
  --os-disk-name ${prefix}-vmOSDisk \
  --image microsoftwindowsdesktop:windows-11:win11-24h2-avd:latest \
  --license-type Windows_Client \
  --size Standard_E2ds_v5 \
  --storage-sku Standard_LRS \
  --admin-username azureuser \
  --assign-identity \
  --nsg-rule NONE \
  --public-ip-address-dns-name ${prefix}

az network nsg rule create \
  --resource-group ${prefix}-rg \
  --name AllowRDP \
  --nsg-name ${prefix}-vmNSG \
  --priority 100 \
  --source-address-prefixes $(curl -s inet-ip.info) \
  --destination-port-ranges 3389 \
  --access Allow \
  --protocol Tcp
```

## Hyper-V を有効化

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
```

![2025-03-09-nested-hyperv-win11-azure-01.png](/assets/img/2025-03-09-nested-hyperv-win11-azure-01.png)

## （おまけ）日本語化

```powershell
Install-Language ja-jp
Set-WinUserLanguageList ja,en-US -Force
Set-WinUILanguageOverride -Language ja-JP
Set-WinHomeLocation -GeoId 122
Set-TimeZone -Id "Tokyo Standard Time"
Set-WinSystemLocale -SystemLocale ja-JP
Copy-UserInternationalSettingsToSystem -WelcomeScreen $True -NewUser $True
Restart-Computer
```

## 後片付け

```bash
az group delete \
  --name ${prefix}-rg \
  --yes
```

## 参考

[Nested virtualization on Azure : a step-by-step guide](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/nested-virtualization-on-azure--a-step-by-step-guide/4368074)
