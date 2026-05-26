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
    adOpening: {
      label: '播客开头广告内容',
      description: '只影响本次首页测试；当开头模板里存在广告占位时，会优先用这里的内容替换。',
      placeholder: '输入本次测试要插入的开头广告文案',
      add: '新增开头广告片段',
      emptyTitle: '还没有开头广告片段',
      emptyDescription: '先添加一条开头广告片段，再设置不同角色和文案顺序。'
    },
    adClosing: {
      label: '播客结尾广告内容',
      description: '只影响本次首页测试；当结尾模板里存在广告占位时，会优先用这里的内容替换。',
      placeholder: '输入本次测试要插入的结尾广告文案',
      add: '新增结尾广告片段',
      emptyTitle: '还没有结尾广告片段',
      emptyDescription: '先添加一条结尾广告片段，再设置不同角色和文案顺序。'
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
      emptyDescription: '先调整文案，再点上面的四个生成按钮。',
      audio: {
        generate: '生成播客音频',
        openDirectory: '打开输出目录',
        defaultHint: '生成后的音频会保存到附件目录下的热搜播客归档目录。',
        statusTitle: '音频生成状态',
        errorTitle: '音频生成失败',
        errorFallback: '生成播客音频失败，请检查附件目录和豆包语音凭证是否已配置。',
        errorVolcRedisNil: '火山播客服务返回了 redis: nil。这个错误通常表示当前 AppID、AccessToken、resourceId 或 speaker code 的能力组合不匹配，并不是本地 Redis 缺失。原始错误：{raw}',
        statusIdle: '脚本结果已经就绪，可以开始生成真实播客音频。',
        statusAccepted: '任务已受理，桌面壳正在准备连接豆包播客服务。',
        statusRunning: '正在生成音频，当前阶段：{phase}。',
        statusSucceeded: '音频已生成完成，并保存到：{path}',
        statusFailed: '音频生成失败：{message}',
        statusCanceled: '音频生成任务已取消。',
        phases: {
          queued: '排队中',
          connecting: '正在连接',
          sessionStarting: '正在启动会话',
          generating: '正在生成',
          finalizing: '正在收尾',
          completed: '已完成',
          failed: '失败',
          canceled: '已取消'
        }
      }
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
