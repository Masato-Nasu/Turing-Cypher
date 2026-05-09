# Turing Cypher PWA

短い MASATO-LAB URL を、1枚の Gray-Scott / reaction-diffusion 模様PNGに変換し、同じ合い言葉でPNGからURLを復号するPWAです。

## 今回のUI調整

- URLと合い言葉のデフォルト入力・サンプルplaceholderを削除
- 復号側にも「合い言葉（復号用・必須）」入力欄を追加
- 復号結果のURLを大きく分かりやすく表示
- PASS後に「まだ復号していません」と残る不具合を修正
- 背景グラデーションを削除し、白背景＋黄緑アクセントに統一
- 日本語 / English 切り替え対応

## Deploy

```powershell
cd "$env:USERPROFILE\Desktop\Turing_Cypher"
npx wrangler pages deploy . --project-name turing-cypher
```

キャッシュ避け確認URL:

```text
https://turing-cypher.pages.dev/?v=ap522-clean-lime-1
```

## Scope


```text
https://masato-lab.pages.dev/{tools|portfolio|peripheral-memory|about}/slug
```

slug は最大16文字、使用文字は `a-z`, `-`, `0-4` です。



## 2026-05-09 update

- Fixed decoded URL visibility in the main result panel.
- PNG download name now uses timestamp + `Turing-Cyper`, for example `20260509-113000-Turing-Cyper.png`.
