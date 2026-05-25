export const home = {
  title: '首頁',
  podcastScript: {
    title: '播客腳本測試區',
    description: '這裡不再生成音色示例，只用來暫時測試熱搜播客文案如何拼成豆包腳本。',
    editorDescription: '會先讀取「設定 > 熱搜」的配置作為初始值。這裡的修改只影響本次測試，不會自動存回設定頁。',
    templateCount: '目前模板片段：{count}',
    body: {
      label: '播客正文',
      description: '逐條新增正文片段；這裡固定就是正文編輯，只需要填寫內容、選擇角色與片段類型。',
      placeholder: '輸入這一段要播報的正文內容',
      add: '新增正文片段',
      emptyTitle: '還沒有正文片段',
      emptyDescription: '先新增一條正文片段，再選擇對應播報角色與片段類型。'
    },
    adOpening: {
      label: '播客開頭廣告內容',
      description: '只影響這次首頁測試；當開頭模板裡存在廣告佔位時，會優先用這裡的內容替換。',
      placeholder: '輸入這次測試要插入的開頭廣告文案',
      add: '新增開頭廣告片段',
      emptyTitle: '還沒有開頭廣告片段',
      emptyDescription: '先新增一條開頭廣告片段，再設定不同角色與文案順序。'
    },
    adClosing: {
      label: '播客結尾廣告內容',
      description: '只影響這次首頁測試；當結尾模板裡存在廣告佔位時，會優先用這裡的內容替換。',
      placeholder: '輸入這次測試要插入的結尾廣告文案',
      add: '新增結尾廣告片段',
      emptyTitle: '還沒有結尾廣告片段',
      emptyDescription: '先新增一條結尾廣告片段，再設定不同角色與文案順序。'
    },
    names: {
      maleLabel: '男播報者名稱',
      femaleLabel: '女播報者名稱',
      morningLabel: '早報名稱',
      eveningLabel: '晚報名稱',
      vipMorningLabel: '長篇早報名稱',
      vipEveningLabel: '長篇晚報名稱'
    },
    actions: {
      title: '生成模式',
      morningShort: '生成早報（短篇）',
      morningLong: '生成早報（長篇）',
      eveningShort: '生成晚報（短篇）',
      eveningLong: '生成晚報（長篇）',
      tip: '首頁只做腳本測試，不代表最終首頁視覺。'
    },
    badges: {
      morning: '早間',
      evening: '晚間',
      short: '短篇',
      long: '長篇'
    },
    result: {
      title: '生成結果',
      description: '回傳結構已經是最終可直接餵給豆包播客引擎的 speaker + text 行陣列。',
      emptyTitle: '還沒有生成腳本',
      emptyDescription: '先調整文案，再點上面的四個生成按鈕。'
    }
  },
  welcomeEmail: {
    description: '點擊按鈕後，會產生歡迎郵件內容，並寄送到目前收件信箱。',
    target: '預設收件信箱：{email}',
    send: '發送歡迎郵件',
    result: {
      successTitle: '發送成功',
      errorTitle: '發送失敗',
      success: '歡迎郵件已寄送到 {email}，實際收件人數：{count}。',
      error: '歡迎郵件發送失敗，請檢查郵件設定或後端回應。'
    }
  }
};
