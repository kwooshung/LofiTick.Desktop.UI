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
    scope: {
      label: '生成範圍',
      commonDescription: '目前生成 common 版本。它永遠不帶廣告，只生成通用正文與通用開頭結尾。',
      bilibiliDescription: '目前生成 bilibili 版本。若填寫了廣告文案，會生成平台開頭結尾，並與 common 正文合成。'
    },
    badges: {
      morning: '早間',
      evening: '晚間',
      short: '短篇',
      long: '長篇',
      common: 'Common',
      bilibili: 'Bilibili'
    },
    result: {
      title: '生成結果',
      description: '回傳結構已經是最終可直接餵給豆包播客引擎的 speaker + text 行陣列。',
      emptyTitle: '還沒有生成腳本',
      emptyDescription: '先調整文案，再點上面的四個生成按鈕。',
      audio: {
        generate: '生成播客音訊',
        openDirectory: '開啟輸出目錄',
        defaultHint: '生成後的音訊會保存到附件目錄下的熱搜播客歸檔目錄。',
        statusTitle: '音訊生成狀態',
        errorTitle: '音訊生成失敗',
        errorFallback: '生成播客音訊失敗，請檢查附件目錄與豆包語音憑證是否已設定。',
        errorVolcRedisNil: '火山播客服務回傳了 redis: nil。這通常表示目前 AppID、AccessToken、resourceId 或 speaker code 的能力組合不匹配，並不是本地 Redis 缺失。原始錯誤：{raw}',
        statusIdle: '腳本結果已經就緒，可以開始生成真實播客音訊。',
        statusAccepted: '任務已受理，桌面殼正在準備連線豆包播客服務。',
        statusRunning: '正在生成音訊，目前階段：{phase}。',
        statusSucceeded: '音訊已生成完成，並保存到：{path}',
        statusFailed: '音訊生成失敗：{message}',
        statusCanceled: '音訊生成任務已取消。',
        phases: {
          queued: '排隊中',
          connecting: '正在連線',
          sessionStarting: '正在啟動會話',
          generating: '正在生成',
          finalizing: '正在收尾',
          completed: '已完成',
          failed: '失敗',
          canceled: '已取消'
        }
      }
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
