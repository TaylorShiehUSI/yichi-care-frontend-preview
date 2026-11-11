# 憶起照顧 7A1 安裝與使用

1. 在 [7A1 目錄](https://taylorshiehusi.github.io/yichi-care-frontend-preview/7a1/) 下載 [Chrome 擴充功能 ZIP](https://taylorshiehusi.github.io/yichi-care-frontend-preview/7a1/yichi-care-7a1-bridge-0.3.1.zip) 並解壓。
2. 使用準備試用的 Chrome 設定檔開啟 `chrome://extensions`，啟用「開發人員模式」，選「載入未封裝項目」，選取含 `manifest.json` 的解壓資料夾。確認版本為 0.3.1，ID 為 `nmicdjkjccfmpkpgiibjnnabonhaoppk`。
3. 在同一設定檔登入自己的 Google 帳號，開啟 [指定 NotebookLM 筆記本](https://notebook.google.com/notebook/8242fbbf-ed59-4541-93db-4e3c7eb4d275)，只保留一個該筆記本分頁。打開來源面板，可單選、多選或全選。
4. 開啟或重新整理 [7A1](https://taylorshiehusi.github.io/yichi-care-frontend-preview/7a1/)。輸入問題並按「查詢」。原始回答顯示於右欄，點引用標題即可展開。窄版的原答在語氣區塊下方。
5. 若語氣試用已開放，展開左欄「預覽將送給 Cloud Run／Vertex AI 的回答段落」，確認內容。首次輸入團隊發給你的試用通行碼，再按「送出並調整語氣」。改寫沒有產出時，原答可照常閱讀。
6. 再查一題時，畫面更新成最新一題。NotebookLM 保留先前的聊天紀錄，可能參考前文。

試用 ZIP SHA-256：`61844aaf4d249b590b57051076a6c45e34fa3ca3bf42ab1dc7fb3a4e000593eb`。

若已安裝 0.3.0，請用新版解壓資料夾取代原資料夾內容，並在擴充功能頁按重新載入，再重新整理 NotebookLM 與 7A1 兩個分頁。

輸入時請避開真實個資。頁面會檢查可辨識的手機號碼、身分證字號與電子郵件格式，仍請在送雲前自行核對預覽。回答與改寫尚未經專家覆核。
