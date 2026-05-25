export const home = {
  title: '首页',
  podcastScript: {
    title: '播客脚本测试区',
    description: '这里不再生成音色示例，只用于临时测试热搜播客文案如何拼成豆包脚本。',
    editorDescription: '会先读取“设置 > 热搜”的配置作为初始值。这里的改动只影响本次测试，不会自动保存回设置页。',
    templateCount: '当前模板片段：{count}',
    body: {
      label: '播客正文',
      description: '逐条添加正文片段；这里固定就是正文编辑，只需要填写内容、选择角色和片段类型。',
      placeholder: '输入这一段要播报的正文内容',
      add: '新增正文片段',
      emptyTitle: '还没有正文片段',
      emptyDescription: '先添加一条正文片段，再选择对应播报角色和片段类型。'
    },
    names: {
      maleLabel: '男播报者名称',
      femaleLabel: '女播报者名称',
      morningLabel: '早报名称',
      eveningLabel: '晚报名称',
      vipMorningLabel: '长篇早报名称',
      vipEveningLabel: '长篇晚报名称'
    },
    actions: {
      title: '生成模式',
      morningShort: '生成早报（短篇）',
      morningLong: '生成早报（长篇）',
      eveningShort: '生成晚报（短篇）',
      eveningLong: '生成晚报（长篇）',
      tip: '首页只做脚本测试，不负责最终首页视觉。'
    },
    badges: {
      morning: '早间',
      evening: '晚间',
      short: '短篇',
      long: '长篇'
    },
    result: {
      title: '生成结果',
      description: '返回结构已经是最终可直接喂给豆包播客引擎的 speaker + text 行数组。',
      emptyTitle: '还没有生成脚本',
      emptyDescription: '先调整文案，再点上面的四个生成按钮。'
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
