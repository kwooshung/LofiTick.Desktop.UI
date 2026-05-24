export const home = {
  title: '首页',
  voicePreview: {
    title: '音色示例生成',
    description: '输入一段文案后，点击按钮即可按当前支持的音色批量生成试听案例。',
    generate: '生成全部音色示例',
    supportedCount: '当前结果数：{count}',
    input: {
      label: '示例文案',
      description: '这段文案会被送入桌面壳，按全部支持音色分别生成示例声音。',
      placeholder: '例如：今天的洛菲音色示例开始了，下面请依次试听当前支持的播报音色。'
    },
    empty: {
      title: '还没有音色示例',
      description: '先输入一段文案，然后点击生成按钮。'
    },
    result: {
      errorTitle: '生成失败',
      itemErrorTitle: '当前音色生成失败',
      error: '音色示例生成失败，请检查服务凭证或桌面壳返回。',
      notTauri: '当前不是 Tauri 运行环境，无法直接生成音色示例。'
    }
  },
  welcomeEmail: {
    description: '点击按钮后，会生成欢迎邮件内容，并发送到当前收件邮箱。',
    target: '默认收件邮箱：{email}',
    send: '发送欢迎邮件',
    result: {
      successTitle: '发送成功',
      errorTitle: '发送失败',
      success: '欢迎邮件已发送到 {email}，实际收件人数：{count}。',
      error: '欢迎邮件发送失败，请检查邮件配置或后端返回。'
    }
  }
};
