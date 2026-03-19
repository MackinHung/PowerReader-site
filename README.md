# PowerReader - 公民算力實驗計畫 | 宣傳網站

> 用你的閒置 GPU 算力，讓 AI 分析台灣新聞的媒體偏見與政治立場。

## 網站連結

- **宣傳頁**: [powerreader-site.pages.dev](https://powerreader-site.pages.dev)
- **主體平台**: [powerreader.pages.dev](https://powerreader.pages.dev)
- **原始碼（平台）**: [MackinHung/PowerReader-beta](https://github.com/MackinHung/PowerReader-beta)

## 這是什麼？

這是 PowerReader 公民算力實驗計畫的**宣傳 Landing Page**，說明計畫理念、運作方式與參與途徑。

PowerReader 讓每個打開瀏覽器的人，透過閒置 GPU 算力貢獻 AI 新聞分析。不仰賴機構、政黨，完全開源透明。

## 頁面結構

| 區塊 | 內容 |
|------|------|
| Hero | 計畫願景與行動呼籲 |
| 為什麼 | 使用者心聲與問題描述 |
| 對比 | 傳統媒體評比 vs PowerReader |
| 使用情境 | LINE 群組、選舉、媒體識讀、長期激勵 |
| 加入方式 | 閱讀新聞 / 回報錯誤 / 參與討論 |
| 信任與透明 | 開源、規則歷史、實驗方案 |

## 技術

- 純靜態 HTML / CSS / JS（無框架）
- 部署: Cloudflare Pages
- 設計: 新聞紙嚴肅感 + 抗議海報緊迫感
- 字體: Noto Serif TC（標題）+ Noto Sans TC（內文）
- SEO: OG / Twitter Card / JSON-LD / sitemap

## 本地開發

```bash
# 任何靜態伺服器即可
npx serve .
# 或
python -m http.server 8000
```

## 授權

MIT License

## 開發者

[@MackinHung](https://github.com/MackinHung) - mackinhung@gmail.com
