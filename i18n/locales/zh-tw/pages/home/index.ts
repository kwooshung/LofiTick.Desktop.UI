export const home = {
  title: '首頁',
  voicePreview: {
    title: '音色示例生成',
    description: '輸入一段文案後，點擊按鈕即可依目前支援的音色批量生成試聽案例。',
    generate: '生成全部音色示例',
    supportedCount: '目前結果數：{count}',
    input: {
      label: '示例文案',
      description: '這段文案會送進桌面殼，依全部支援音色分別生成示例聲音。',
      placeholder: '例如：今天的洛菲音色示例開始了，下面請依次試聽目前支援的播報音色。'
    },
    empty: {
      title: '還沒有音色示例',
      description: '先輸入一段文案，然後點擊生成按鈕。'
    },
    result: {
      errorTitle: '生成失敗',
      itemErrorTitle: '目前音色生成失敗',
      error: '音色示例生成失敗，請檢查服務憑證或桌面殼回傳。',
      notTauri: '目前不是 Tauri 執行環境，無法直接生成音色示例。'
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
