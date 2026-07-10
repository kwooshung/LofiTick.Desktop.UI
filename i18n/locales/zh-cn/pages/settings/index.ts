export const settings = {
  title: '设置',
  connections: {
    title: '服务连接',
    description: '统一管理桌面端连接 Rust API 与 1Panel 面板入口所需的接入配置。',
    apiBase: {
      label: 'Rust API 域名',
      description: '桌面壳直连 Rust API 时使用的基础域名，默认值为 http://localhost:8180/。',
      placeholder: 'http://localhost:8180/'
    },
    onepanelPanelBase: {
      label: '1Panel 根域名',
      description: '这里只填写 1Panel 面板首页根域名，页面内所有跳转地址都会基于它自动推导。',
      placeholder: 'https://one-panel.lofitick.com/'
    },
    onepanelLinks: {
      title: '1Panel 导航目录',
      description: '下面这份目录会随着根域名实时变化，桌面端不再直接托管 1Panel 计划任务页面。',
      currentBase: '当前 1Panel 根域名',
      actions: {
        openCronjobs: '打开计划任务',
        openScriptLibrary: '打开脚本库'
      }
    }
  },
  services: {
    title: '服务凭证',
    actions: {
      showAccessToken: '显示令牌',
      hideAccessToken: '隐藏令牌',
      resetDefaultResourceId: '恢复默认 Resource ID',
      resetDefaultMaleSpeakerCode: '恢复默认男声',
      resetDefaultFemaleSpeakerCode: '恢复默认女声'
    },
    volcSpeech: {
      title: '豆包语音',
      description: '用于火山播客 WebSocket 接口的桌面端默认凭证。这里保存后，播客命令会自动补齐缺省的 App ID、Access Token 和 Resource ID。',
      appId: {
        label: 'App ID',
        description: '填写豆包语音服务的应用 ID。',
        placeholder: '例如：1234567890'
      },
      accessToken: {
        label: 'Access Token',
        description: '填写豆包语音服务的 Access Token。',
        placeholder: '请输入豆包语音 Access Token'
      },
      resourceId: {
        label: 'Resource ID',
        description: '默认值适用于当前播客接口；只有服务侧要求切换资源时才需要修改。',
        placeholder: 'volc.service_type.10050'
      },
      maleSpeakerCode: {
        label: '男声音色代码',
        descriptionPrefix: '用于把 M 和 D 中的男声映射成豆包真实 ',
        descriptionSuffix: '。',
        linkLabel: 'speaker code',
        placeholder: 'zh_male_dayixiansheng_v2_saturn_bigtts'
      },
      femaleSpeakerCode: {
        label: '女声音色代码',
        descriptionPrefix: '用于把 F 和 D 中的女声映射成豆包真实 ',
        descriptionSuffix: '。',
        linkLabel: 'speaker code',
        placeholder: 'zh_female_mizaitongxue_v2_saturn_bigtts'
      }
    }
  },
  general: {
    title: '常规',
    description: '应用程序基础行为、语言等通用偏好配置',
    closeBehavior: {
      label: '关闭行为',
      description: '关闭主窗口时的默认动作',
      options: {
        unset: '每次询问',
        minimizeToTray: '最小化到托盘',
        exit: '直接退出应用'
      }
    },
    language: {
      label: '界面语言',
      description: '目前支持 {count} 种语言'
    },
    rememberWindowState: {
      label: '记忆窗口状态',
      description: '始终记录窗口位置及大小，启动时按开关决定是否恢复'
    },
    appDirectory: {
      label: '应用目录',
      description: '打开应用可执行文件所在的目录',
      open: '打开目录'
    },
    userDataDirectory: {
      label: '用户目录',
      description: '打开应用的 userData 目录（用户配置、缓存等）',
      open: '打开目录',
      unset: '未设置',
      notExists: '用户目录不存在'
    },
    storage: {
      label: '数据存放目录',
      description: '数据文件保存的目录，当前路径：',
      dialogTitle: '选择附件保存目录',
      choose: '选择目录',
      reselect: '重新选择',
      unset: '未设置'
    },
    devtools: {
      label: '开发者工具',
      description: '打开开发者调试工具（关闭请在 DevTools 窗口内手动关闭）',
      toggle: '打开开发者工具'
    },
    multiOpen: {
      label: '应用多开',
      description: '允许同时运行多个应用实例'
    }
  },
  crawler: {
    title: '爬虫',
    actions: {
      enterCrawlers: '前往爬虫'
    },
    browser: {
      title: '浏览器',
      description: '选择采集时使用的本机浏览器。',
      runtimeDescriptions: {
        edge: '适合追求系统一致性的默认采集环境，和 Windows 自带浏览器行为保持一致。',
        chrome: '适合需要贴近日常 Chrome 行为的任务，尤其是账号登录、Cookie 和站点兼容性要求较高时。'
      },
      actions: {
        refresh: '刷新',
        installOfficial: '前往官网下载并安装'
      }
    },
    runtime: {
      title: '爬虫运行与诊断',
      description: '统一控制模板比较后端、诊断截图保留范围和可见日志输出。'
    },
    compareBackend: {
      title: '模板比较后端',
      description: '控制站点模板比较时使用 CPU 还是 GPU。GPU 仅在硬件条件满足时可启用，CPU 模式始终保留。',
      label: '使用 GPU 比较',
      runtimeDescription: '开启前会先探测当前机器的 GPU 条件；不满足时会自动保持 CPU。',
      currentMode: '当前模式：{mode}',
      modes: {
        cpu: 'CPU',
        gpu: 'GPU'
      },
      probeSuccessTitle: 'GPU 比较可用',
      probeFailedTitle: 'GPU 比较不可用',
      probeFailedFallback: '当前机器不满足 GPU 比较条件'
    },
    diagnostics: {
      title: '诊断截图',
      description: '控制写入 matches 目录的诊断比较范围。',
      compareMode: {
        label: '全流程比较',
        description: '开启后每次模板比较都保存完整流程；关闭时仅在最终失败后保存最后一轮多阶段比较，最终成功不保存。'
      }
    },
    logs: {
      title: '日志显示',
      description: '控制爬虫运行过程中的可见日志输出。',
      label: '显示爬虫日志',
      runtimeDescription: '开启后会显示爬虫会话、浏览器视觉状态与入口守卫的关键日志；关闭后只保留错误信息。'
    },
    browserProfilesDirectory: {
      label: '浏览器资料缓存',
      description: '浏览器资料目录和路径都固定在这里。',
      rootDescription: '爬虫浏览器资料和匹配记录的固定根目录。',
      rootLabel: '浏览器目录',
      edgeDescription: 'Edge 的浏览器资料目录。',
      edgeLabel: 'Edge 目录',
      chromeDescription: 'Chrome 的浏览器资料目录。',
      chromeLabel: 'Chrome 目录',
      actionOpen: '打开目录',
      actionClear: '清理',
      browserDirectory: '浏览器目录',
      matchesDirectory: '匹配记录',
      clearCache: '清空缓存',
      clearMatches: '清空匹配记录',
      clearConfirmTitle: '确认清空缓存？',
      clearConfirmDescription: '这会删除该目录下的所有内容。',
      rootClearCacheConfirmDescription: '这会删除三个浏览器的资料缓存内容。',
      matchesClearConfirmTitle: '确认清空匹配记录？',
      matchesClearConfirmDescription: '这会删除该站点匹配记录目录下的所有诊断截图和元信息。',
      rootClearMatchesConfirmDescription: '这会删除三个浏览器的所有匹配记录内容。',
      clearSuccess: '缓存已清空',
      clearFailed: '清空缓存失败',
      matchesClearSuccess: '匹配记录已清空',
      matchesClearFailed: '清空匹配记录失败',
      open: '打开目录',
      openMatches: '打开匹配记录',
      unset: '未设置',
      notExists: '爬虫资料目录不存在'
    }
  },
  ui: {
    title: '界面',
    description: '调整应用外观、颜色与视觉呈现方式。',
    colorMode: {
      label: '颜色模式',
      description: '外观是浅色还是深色，或者按照计算机的设置进行调整',
      options: {
        system: '跟随系统',
        light: '浅色',
        dark: '深色'
      }
    },
    primary: {
      label: '主要色系',
      description: '主要作用于，按钮、链接等强调元素',
      colors: {
        black: '黑',
        red: '红',
        orange: '橙',
        amber: '琥珀',
        yellow: '明黄',
        lime: '柠檬绿',
        green: '绿',
        emerald: '翠绿',
        teal: '青绿',
        cyan: '青',
        sky: '天蓝',
        blue: '靛蓝',
        indigo: '靛紫',
        violet: '紫罗兰',
        purple: '紫蓝',
        fuchsia: '品红',
        pink: '粉红',
        rose: '玫红'
      }
    },
    neutral: {
      label: '中性色系',
      description: '主要作用于，文字，背景、边框等辅助元素',
      colors: {
        ink: '墨灰',
        slate: '石板',
        gray: '深灰',
        zinc: '锌灰',
        neutral: '中灰',
        stone: '石灰',
        taupe: '灰褐',
        mauve: '藕紫',
        mist: '雾灰',
        olive: '橄榄'
      }
    },
    radius: {
      label: '圆角弧度',
      description: '界面元素的弧度大小'
    }
  },
  playback: {
    title: '播放',
    description: '音频播放参数等',
    fade: {
      label: '淡入淡出',
      description: '设置音频淡入和淡出的时间，单位为毫秒',
      labels: {
        in: '淡入',
        out: '淡出'
      },
      unit: {
        ms: '毫秒'
      }
    },
    normalization: {
      label: '音频标准化',
      description: '启用后将自动调整音频响度，使其在播放时保持一致，避免音量忽大忽小',
      unit: 'Lufs',
      lufs: {
        '-14': '油管/哔哩哔哩/Spotify/Tidal/网易云/QQ音乐',
        '-16': '苹果音乐/微信公众号/微博/播客',
        '-24': 'TV/电影/奈菲/Disney+/HBO Max'
      }
    }
  },
  power: {
    title: '电源',
    description: '调整应用的电源管理选项，以节省电量',
    startup: {
      enabled: {
        label: '开机自启',
        description: '系统启动后自动启动应用，确保在需要时应用始终在后台运行，适合需要无人值守模式的启用'
      }
    },
    system: {
      label: '系统休眠',
      description: '阻止后，确保系统不会进入休眠，避免任务中断，如：下载、爬取、播放等'
    },
    display: {
      label: '显示器休眠',
      description: '阻止后，确保显示器不会进入休眠，方便随时查看状态，任务不会中断，如：下载、爬取、播放等'
    },
    options: {
      never: '从不阻止',
      always: '始终阻止',
      crawling: '爬取时阻止',
      playing: '播放时阻止'
    }
  },
  hotsearch: {
    title: '热搜',
    description: '配置本机热搜抓取频次、平台选择、预算与播客生成时间。',
    header: {
      enter: '前往热搜'
    },
    sections: {
      headMusic: {
        title: '开头音乐',
        description: '这里统一管理播客生成占用、普通版开头音乐和 VIP 版开头音乐。'
      },
      schedule: {
        title: '抓取计划',
        description: '这里配置播客时间基准、平台抓取间隔、随机偏移与失败补抓策略。'
      },
      podcast: {
        title: '播客文案',
        description: '这里配置播报者姓名、节目名称，以及播客开头和结尾模板；正文由程序自动生成。'
      },
      podcastRules: {
        title: '播客规则',
        description: '这里单独维护给 AI 使用的播客规则，支持 Markdown，方便你约束语气、结构和禁用项。'
      },
      platforms: {
        title: '平台选择',
        description: '只抓取你真正需要的平台，预算会按已选平台数量实时估算。'
      },
      summary: {
        title: '计划摘要',
        description: '这里展示当前配置下的窗口耗时、积分预算和建议播客时间。'
      }
    },
    fields: {
      enabled: {
        label: '自动抓取',
        description: '启用后，本机将按热搜窗口计划自动抓取已选平台。'
      },
      podcastEnabled: {
        label: '自动生成播客',
        description: '启用后，播客时间将默认跟随热搜窗口的推导结果。'
      },
      podcastGenerateEnabled: {
        label: '本机生成播客',
        description: '启用后，只有当前机器负责生成热搜播客；开启前会优先检查本地开头音乐，缺失时再尝试从云端补齐。'
      },
      podcastHeadMusicNormal: {
        label: '开头音乐（普通版）',
        description: '用于普通播客的开头音乐。'
      },
      podcastHeadMusicVip: {
        label: '开头音乐（VIP 版）',
        description: '用于 VIP 播客的开头音乐。'
      },
      podcastMaleSpeakerName: {
        label: '男生播报者姓名',
        description: '用于变量替换中的男生姓名，默认是男声主播。',
        placeholder: '例如：男声主播'
      },
      podcastFemaleSpeakerName: {
        label: '女生播报者姓名',
        description: '用于变量替换中的女生姓名，默认是女声主播。',
        placeholder: '例如：女声主播'
      },
      podcastProgramNames: {
        label: '节目名称',
        description: '早间、晚间以及 VIP 专项版会按各自的节目名称渲染到模板变量中。'
      },
      podcastMorningProgramName: {
        label: '早间节目名称',
        description: '用于普通早间播客的节目名称。',
        placeholder: '例如：洛菲热点早报'
      },
      podcastEveningProgramName: {
        label: '晚间节目名称',
        description: '用于普通晚间播客的节目名称。',
        placeholder: '例如：洛菲热点晚报'
      },
      podcastVipMorningProgramName: {
        label: 'VIP 专项版早间节目名称',
        description: '用于 VIP 专项版早间播客的节目名称。',
        placeholder: '例如：洛菲热点早报 尊享版'
      },
      podcastVipEveningProgramName: {
        label: 'VIP 专项版晚间节目名称',
        description: '用于 VIP 专项版晚间播客的节目名称。',
        placeholder: '例如：洛菲热点晚报 尊享版'
      },
      podcastAiRulesMarkdown: {
        label: 'AI 播客规则',
        description: '这块内容只作为 AI 生成播客时的规则提示，不直接作为最终播报文本。',
        systemLineLabel: '系统会自动在最终内容末尾追加这一行，且不允许改写：',
        placeholder: '例如：\n# 角色\n- 用自然、克制、口语化的中文\n\n# 约束\n- 不要编造不存在的信息\n- 不要输出标题党语气\n- 结尾保留简短收束'
      },
      podcastVariables: {
        label: '变量插入',
        description: '点击变量按钮会直接插入到当前聚焦的开头或结尾模板输入框。'
      },
      podcastOpeningTemplates: {
        label: '开头模板',
        description: '这里只维护播客开头模板，正文由程序自动生成。',
        placeholder: '例如：这里是 [programName]，今天是 [solarDateTime]。',
        placeholderAdContent: '广告内容由广告系统自动插入生成。',
        empty: {
          title: '还没有开头模板',
          description: '先新增一条开头模板，再选择音色并输入开头文案。'
        }
      },
      podcastClosingTemplates: {
        label: '结尾模板',
        description: '这里只维护播客结尾模板，正文由程序自动生成。',
        placeholder: '例如：以上就是今天的 [programName]，我们下次再见。',
        placeholderAdContent: '广告内容由广告系统自动插入生成。',
        empty: {
          title: '还没有结尾模板',
          description: '先新增一条结尾模板，再选择音色并输入结尾文案。'
        }
      },
      monthlyBudget: {
        label: '月度预算积分',
        description: '默认按 3500 规划；真实剩余积分请以官网为准。'
      },
      morningStartAt: {
        label: '早间热搜开始时间',
        description: '用于推导早间热搜播客的建议生成时间，不影响热搜抓取频次。'
      },
      eveningStartAt: {
        label: '晚间热搜开始时间',
        description: '用于推导晚间热搜播客的建议生成时间，不影响热搜抓取频次。'
      },
      platformIntervalSeconds: {
        label: '单个平台抓取间隔',
        description: '每个平台触发之间的等待时间，单位为秒。比如 360 秒约等于 6 分钟。',
        input: {
          prefix: '间隔',
          unit: '秒'
        }
      },
      scheduleJitterSeconds: {
        label: '开始时间随机偏移',
        description: '对计划时间做正负随机秒数偏移，默认 1800 表示正负 30 分钟。',
        input: {
          prefix: '偏移',
          unit: '秒'
        }
      },
      podcastBufferSeconds: {
        label: '播客缓冲时长',
        description: '在抓取阶段完成后，再额外预留给整理、润色和生成播客的等待时间，单位为秒。它只影响播客建议时间，不影响热搜抓取频次。',
        input: {
          prefix: '缓冲',
          unit: '秒'
        }
      },
      retryMaxAttempts: {
        label: '失败重试次数',
        description: '单个平台抓取失败后允许自动补抓的最大次数。',
        input: {
          prefix: '计数',
          unit: '次数'
        }
      },
      retryDelaySeconds: {
        label: '重试间隔',
        description: '失败后再次尝试抓取的等待时间，单位为秒。',
        input: {
          prefix: '延时',
          unit: '秒'
        }
      }
    },
    options: {
      podcastVoice: {
        M: '男声',
        F: '女声',
        R: '随机'
      },
      podcastTemplate: {
        opening: '开头模板',
        closing: '结尾模板'
      },
      podcastSegment: {
        normal: '通用内容',
        morningOnly: '仅早间',
        eveningOnly: '仅晚间',
        adContent: '广告内容',
        adPlaceholder: '广告占位'
      }
    },
    editor: {
      groups: {
        text: '文本',
        lists: '列表',
        insert: '插入'
      },
      items: {
        paragraph: '段落',
        heading1: '标题 1',
        heading2: '标题 2',
        heading3: '标题 3',
        bold: '加粗',
        italic: '斜体',
        underline: '下划线',
        bulletList: '无序列表',
        orderedList: '有序列表',
        blockquote: '引用',
        codeBlock: '代码块',
        divider: '分隔线'
      }
    },
    headMusicActions: {
      selectHeadMusic: '选择音乐',
      previewHeadMusic: '试听',
      reuploadHeadMusic: '重新上传',
      syncHeadMusic: '从云端同步',
      chooseAttachmentsDir: '选择附件目录'
    },
    status: {
      localReady: '本地已就绪',
      localMissing: '本地缺失',
      remoteReady: '云端已就绪',
      remoteMissing: '云端缺失',
      attachmentsDirUnset: '当前还没有配置附件目录。',
      attachmentsDirUnsetShort: '未设置附件目录',
      podcastGenerateOwnedByCurrentMachine: '当前机器已占用',
      podcastGenerateOwnedByOtherMachine: '其他机器已占用',
      podcastGenerateOwnerIdle: '当前无人占用',
      podcastGenerateOwnerIdleDescription: '只有一台机器可以开启生成播客；开启时会先检查本地开头音乐，缺失时再尝试从云端补齐。',
      podcastGenerateOwnedByCurrentMachineDescription: '当前由本机负责生成播客。机器名：{machineName}；机器码：{machineCode}。',
      podcastGenerateOwnedByOtherMachineDescription: '当前由其他机器负责生成播客。机器名：{machineName}；机器码：{machineCode}。',
      headMusicReady: '本地与云端都已经准备好，可以直接试听、同步或重新上传。',
      headMusicWaitingTitle: '开头音乐还没准备好',
      headMusicNeedAttachmentsDir: '当前还没有配置附件目录。',
      headMusicNeedUpload: '云端还没有这份开头音乐，请先选择音乐并上传。',
      headMusicCloudMissingAfterLocalReady: '本地已经准备好了，但云端副本还缺失。',
      headMusicNeedSync: '当前机器本地还没有这份开头音乐。开启生成播客时会优先尝试从云端补齐。',
      headMusicNeedPreview: '当前音乐已经存在，但暂时还没有可用的预览地址。'
    },
    dialogs: {
      attachmentsDirRequired: {
        title: '需要先设置附件目录',
        description: '开头音乐必须落在附件目录下的固定路径中。请先选择附件目录，然后再继续开启播客生成或上传音乐。'
      },
      headMusicUpload: {
        title: '上传 {title}',
        description: '支持拖放和点击选择。上传会直接从前端直传到又拍云，并同步写入当前机器的固定路径。',
        dropLabel: '把 MP3 文件拖到这里',
        dropDescription: '或者点击下面按钮选择文件。建议保持文件简短、响度稳定。',
        dropActive: '松开即可上传',
        selectFile: '选择文件',
        clearFile: '清空选择',
        confirmUpload: '开始上传',
        currentPreview: '当前线上预览',
        pendingPreview: '待上传预览',
        uploadProgress: '上传进度'
      },
      headMusicPreview: {
        title: '{title} 试听',
        description: '这里可以先试听云端可用的开头音乐。',
        loadingTitle: '正在加载试听地址',
        loadingDescription: '正在从云端获取可播放的预览地址，请稍候。',
        remoteAddress: '云端地址'
      }
    },
    messages: {
      podcastGenerateErrorTitle: '播客生成不可用',
      podcastHeadMusicErrorTitle: '开头音乐处理失败',
      machineCodeMissing: '当前机器码缺失，暂时无法申请播客生成占用。',
      podcastGenerateOwnerConflict: '当前已有其他机器开启生成播客：{machineName}（{machineCode}）。',
      podcastGenerateHeadMusicMissing: '普通版或 VIP 版开头音乐还没有准备好，暂时无法开启生成播客。',
      podcastGenerateHeadMusicMissingToast: '{titles} 还没有可用的本地或云端文件，请先选择音乐。',
      podcastHeadMusicRemoteMissing: '云端还没有这个开头音乐文件。',
      podcastHeadMusicDownloadFailed: '从云端下载开头音乐失败。',
      podcastHeadMusicUploadFailed: '上传开头音乐失败。'
    },
    variables: {
      speakerName: '播报者名称',
      otherSpeakerName: '搭档名称',
      maleSpeakerName: '男生姓名',
      femaleSpeakerName: '女生姓名',
      maleOtherSpeakerName: '男声搭档名称',
      femaleOtherSpeakerName: '女声搭档名称',
      programName: '当前节目名称',
      morningProgramName: '早间节目名称',
      eveningProgramName: '晚间节目名称',
      vipMorningProgramName: 'VIP 专项版早间节目名称',
      vipEveningProgramName: 'VIP 专项版晚间节目名称',
      greeting: '动态问候语',
      solarDateTime: '阳历年月日',
      solarDate: '阳历月日',
      solarTime: '时间',
      lunarDateTime: '农历年月日',
      lunarDate: '农历月日',
      weekday: '星期',
      editionLabel: '早晚报标识'
    },
    variableDescriptions: {
      speakerName: '根据当前音色自动取播报者姓名。',
      otherSpeakerName: '根据当前音色自动取当前播报者对应的搭档姓名。',
      maleSpeakerName: '始终使用男生播报者姓名。',
      femaleSpeakerName: '始终使用女生播报者姓名。',
      maleOtherSpeakerName: '固定取女声播报者姓名，可作为男声当前搭档名称。',
      femaleOtherSpeakerName: '固定取男声播报者姓名，可作为女声当前搭档名称。',
      programName: '根据当前节目场景自动取节目名称。',
      morningProgramName: '普通早间播客的节目名称。',
      eveningProgramName: '普通晚间播客的节目名称。',
      vipMorningProgramName: 'VIP 专项版早间播客的节目名称。',
      vipEveningProgramName: 'VIP 专项版晚间播客的节目名称。',
      greeting: '根据当前时段动态输出早上好或晚上的问候语。',
      solarDateTime: '例如 2026年5月14日。',
      solarDate: '例如 5月14日。',
      solarTime: '例如 08:30。',
      lunarDateTime: '例如 农历丙午年三月二十八。',
      lunarDate: '例如 三月二十八。',
      weekday: '当前星期。',
      editionLabel: '当前是早间还是晚间播客。'
    },
    summary: {
      selectedPlatforms: '已选平台',
      perWindowCost: '单窗口积分',
      dailyCost: '每日积分',
      monthlyEstimate: '月度预计积分',
      windowDuration: '窗口耗时',
      suggestedMorningPodcast: '建议早间播客时间',
      suggestedEveningPodcast: '建议晚间播客时间',
      budgetStatus: '预算结余',
      budgetStatusSafe: '安全',
      budgetStatusWarning: '提醒',
      budgetStatusExceeded: '超预算',
      scopeMonth: '本月',
      scopeYear: '本年',
      budgetStatusRemainingDetail: '{scope}：预算 {budget}，预计 {estimate}，剩余 {remaining}',
      budgetStatusExceededDetail: '{scope}：预算 {budget}，预计 {estimate}，超出 {exceeded}',
      rangeValue: '{start} ~ {end}',
      minutesValue: '{value} 分钟'
    },
    actions: {
      usage: '查看官网用量',
      selectAll: '全选平台',
      clearAll: '清空平台',
      addOpeningTemplate: '新增开头模板',
      addClosingTemplate: '新增结尾模板',
      reset: '恢复默认',
      save: '保存设置'
    }
  },
  cron: {
    title: '计划任务',
    description: '统一管理本地任务、服务器任务与系统任务。',
    tabs: {
      local: '本地任务',
      server: '服务器任务',
      system: '系统任务'
    },
    actions: {
      refresh: '刷新',
      search: '查询',
      resetSearch: '清空',
      syncHotsearch: '同步热搜 cron',
      create: '创建',
      edit: '编辑',
      enableSelected: '批量启用',
      disableSelected: '批量停用',
      stopSelected: '批量停止',
      deleteSelected: '批量删除',
      run: '执行',
      stop: '停止',
      records: '记录',
      delete: '删除',
      viewLog: '日志'
    },
    hotsearch: {
      label: '热搜计划任务',
      description: '这里展示热搜开关与 1Panel cron 是否已经保持一致。',
      enabled: '热搜开关：{value}',
      callbackUnset: '尚未推导出可供 1Panel 回调的地址',
      states: {
        ready: '已同步',
        outOfSync: '待修复',
        unconfigured: '未配置 1Panel'
      }
    },
    local: {
      runtimeOnly: {
        title: '当前不在 Tauri 运行环境',
        description: '本地任务依赖桌面壳提供的计划快照，浏览器环境下不显示实际计划。'
      },
      snapshot: {
        title: '本地后台任务清单',
        description: '这里展示桌面壳在本机负责的后台任务，不和服务器 1Panel cron 混在一起。'
      },
      summary: {
        enabled: '自动抓取：{value}',
        podcastEnabled: '自动播客：{value}',
        platformCount: '平台数：{value}',
        monthlyBudget: '月预算：{value}',
        sceneCount: '启用场景：{value}',
        recoveryState: '恢复状态：{value}'
      },
      items: {
        hotsearch: {
          title: '本地热搜调度',
          description: '桌面壳常驻轮询本地热搜配置，并在早晚时间段内执行抓取节拍。'
        },
        sentinel: {
          title: '本地哨兵轮询',
          description: '桌面壳常驻轮询无人值守哨兵状态，并按恢复策略处理异常。'
        }
      },
      schedule: {
        windowsLabel: '执行窗口：',
        podcastLabel: '建议播客：',
        sentinelPolling: '应用运行期间持续轮询',
        lastSeenLabel: '最后心跳：',
        pending: '等待本地运行时快照'
      },
      actions: {
        openSettings: '前往设置'
      },
      card: {
        activity: '最近活动'
      },
      states: {
        hotsearchEnabled: '运行中',
        hotsearchDisabled: '已停用',
        sentinelOnline: '在线',
        sentinelOffline: '离线',
        sentinelError: '错误',
        sentinelIdle: '空闲',
        sentinelUnknown: '未上报'
      },
      windowKeys: {
        morning: '早间窗口',
        evening: '晚间窗口'
      },
      window: {
        title: '{name}',
        startAt: '开始时间',
        endAt: '结束时间',
        suggestedPodcastAt: '建议播客时间',
        duration: '窗口耗时',
        durationValue: '{value} 分钟',
        platformCount: '平台数量',
        points: '预计积分'
      },
      empty: {
        title: '本地任务暂不可用',
        description: '当前未读取到桌面壳可展示的本地后台任务信息。'
      }
    },
    serverShortcut: {
      title: '服务器任务入口',
      description: '服务器任务改为直达 1Panel，桌面端这里只保留跳转和提醒。',
      heroTitle: '去 1Panel 里管理真实的服务器计划任务',
      heroDescription: '桌面端不再镜像 1Panel 计划任务列表，也不再要求你在这里维护 API Key。你只需要配置 1Panel 根域名，然后从这里一键跳到计划任务或脚本库。',
      fields: {
        serverTaskLabel: '服务器任务',
        realCronLabel: '真实计划任务',
        realCronDescription: '去 1Panel 里管理真实的服务器计划任务。',
        panelBaseLabel: '当前 1Panel 地址',
        panelBaseDescription: '如果入口地址不对，去服务连接里修改 1Panel 根域名。'
      },
      actions: {
        openCronjobs: '打开 1Panel 计划任务',
        openScriptLibrary: '打开 1Panel 脚本库',
        openConnections: '前往服务连接'
      },
      quickEntriesTitle: '常用入口',
      atlas: {
        title: '导航入口',
        description: '按 1Panel 一级栏目直接展开常用入口。',
        total: '{count} 个入口'
      },
      quickLinks: {
        overview: '打开 1Panel 概览',
        terminal: '打开 1Panel 终端',
        logs: '打开 1Panel 面板日志'
      }
    },
    system: {
      readonly: '只读',
      groups: {
        system: '系统任务',
        hook: '公开节拍器'
      },
      snapshot: {
        title: '系统内建任务清单',
        description: '这些任务由 Rust API 固定提供，不允许在桌面端新增、编辑或删除。'
      },
      items: {
        hotsearchMorningGenerate: {
          title: '早间热搜生成',
          description: '系统会在热搜配置定义的早间窗口内推进热搜生成流程。'
        },
        hotsearchEveningGenerate: {
          title: '晚间热搜生成',
          description: '系统会在热搜配置定义的晚间窗口内推进热搜生成流程。'
        },
        hotsearchStep: {
          title: '热搜单步推进',
          description: '供外部 cron 节拍器调用，每次仅推进一个平台。'
        },
        quoteRandom: {
          title: '随机名句抓取',
          description: '抓取一条随机名句并按幂等规则入库。'
        }
      },
      schedules: {
        hotsearchMorningGenerate: {
          primary: '按热搜设置中的早间窗口执行',
          secondary: '系统内建热搜生成流程'
        },
        hotsearchEveningGenerate: {
          primary: '按热搜设置中的晚间窗口执行',
          secondary: '系统内建热搜生成流程'
        },
        hotsearchStep: {
          primary: '由外部 cron / 1Panel 节拍器按固定周期回调',
          secondary: '/crons/system/hot_searchs/step'
        },
        quoteRandom: {
          primary: '由系统计划任务按需触发',
          secondary: '/crons/system/quotes/random'
        }
      },
      empty: {
        title: '系统任务为只读视图',
        description: '这里展示的是系统内建任务定义，不提供任何编辑入口。'
      }
    },
    search: {
      label: '任务筛选',
      description: '按名称筛选 1Panel 计划任务。',
      placeholder: '输入任务名称关键字'
    },
    table: {
      name: '任务',
      detail: '详情',
      group: '分组',
      path: '路径',
      method: '方法',
      schedule: '计划',
      retainCopies: '保留份数',
      lastExecutedAt: '上次执行时间',
      status: '状态',
      actions: '操作',
      executing: '执行中'
    },
    records: {
      title: '{name} 的执行记录',
      actions: {
        clean: '清理记录'
      },
      empty: {
        title: '暂无执行记录',
        description: '当前任务还没有可展示的执行历史。'
      },
      table: {
        startedAt: '开始时间',
        status: '状态',
        message: '摘要',
        interval: '耗时',
        actions: '操作',
        intervalValue: '{value} ms'
      }
    },
    logs: {
      title: '执行记录 #{id} 日志',
      empty: {
        title: '暂无日志内容',
        description: '当前记录没有返回可展示的文本日志。'
      }
    },
    operate: {
      createTitle: '创建计划任务',
      editTitle: '编辑计划任务',
      description: '使用图形表单编辑常用任务字段，保存时会自动映射到 1Panel 所需的配置结构。',
      previewNext: '预览下一次执行',
      nextTimes: '下一次执行时间',
      nextEmpty: '暂未生成预览结果',
      save: '保存配置',
      sections: {
        basic: '基础信息',
        schedule: '执行周期',
        execution: '执行内容',
        preview: '执行预览',
        runtime: '运行策略'
      },
      descriptions: {
        basic: '任务名称、任务类型和 1Panel 分组直接和返回的元数据对齐。',
        execution: '根据任务类型填写回调地址、脚本、命令和执行用户。',
        preview: '保存前先检查即将生成的 Cron 表达式与下一次执行时间。',
        runtime: '执行记录保留、重试、超时和告警次数在这里统一控制。'
      },
      form: {
        name: '任务名称',
        type: '任务类型',
        groupId: '任务分组',
        spec: '执行周期',
        url: '访问地址',
        executor: '执行器',
        script: '脚本内容',
        command: '命令内容',
        user: '执行用户',
        retainCopies: '执行记录保留份数',
        retryTimes: '失败重试次数',
        timeout: '超时时间',
        ignoreErr: '忽略错误',
        alertCount: '告警次数',
        typeOptions: {
          url: '访问 URL',
          shell: 'Shell 脚本',
          command: '命令执行'
        }
      },
      schedule: {
        description: '优先使用图形方式配置周期；只有特殊表达式时再切到自定义。',
        custom: '自定义',
        customPlaceholder: '例如：30 1 * * 1',
        generated: '当前表达式：{value}',
        labels: {
          mode: '周期模式',
          dayOfMonth: '每月日期',
          weekday: '执行星期',
          interval: '重复间隔',
          every: '每',
          hour: '执行小时',
          minute: '执行分钟'
        },
        options: {
          monthly: '每月',
          weekly: '每周',
          daily: '每天',
          everySeconds: '每 N 秒',
          everyHours: '每 N 小时',
          everyDays: '每 N 天',
          everyMinutes: '每 N 分钟'
        },
        weekdays: {
          mon: '周一',
          tue: '周二',
          wed: '周三',
          thu: '周四',
          fri: '周五',
          sat: '周六',
          sun: '周日'
        },
        units: {
          day: '日',
          hour: '小时',
          minute: '分钟',
          second: '秒'
        }
      },
      validation: {
        nameRequired: '任务名称不能为空',
        customSpecRequired: '请输入自定义周期表达式',
        urlRequired: '访问地址不能为空',
        executorRequired: '执行器不能为空',
        scriptRequired: '脚本内容不能为空',
        commandRequired: '命令内容不能为空',
        userRequired: '执行用户不能为空'
      }
    },
    delete: {
      title: '确认删除任务',
      description: '将删除 {name}，但不会清理关联数据。',
      confirm: '确认删除'
    },
    footer: {
      total: '共 {total} 条任务',
      selected: '已选 {total} 条'
    }
  },
  unattended: {
    title: '无人值守',
    header: {
      description: '调整无人值守模式下和心跳检测相关的设置',
      enter: '进入无人值守模式'
    },
    dialogs: {
      restart: {
        title: '需要重启才能生效',
        description: '无人值守开关已变更。你可以稍后手动重启，或立即重启应用以使更改生效。',
        actions: {
          cancel: '取消',
          later: '稍后自行重启',
          now: '立即重启'
        },
        toast: {
          later: '已保存，重启后生效'
        }
      }
    },
    tooltips: {
      copyToClipboard: '点击复制到剪切板',
      openLink: '直接打开链接'
    },
    analysis: {
      title: '分析时长',
      empty: '暂无数据',
      button: '时长分析',
      fields: {
        crashDecision: '判定崩溃',
        restartDelay: '重启延时',
        restartCooldown: '重启冷却',
        restartEpisodeWorst: '连续重启最坏',
        restartEpisodeWithCooldownWorst: '连续重启+冷却最坏',
        burstWorst: '爆发最坏',
        burstCooldown: '爆发冷却',
        worstTotal: '最坏总时长'
      }
    },
    form: {
      enabled: {
        label: '是否启用',
        line1: {
          prefix: '打开将会启用无人值守模式，同时会',
          middle: '，但不会显式改变你原本的这两项设置，'
        },
        badges: {
          force: '强制',
          preventSystemSleep: '禁止系统休眠',
          enableStartup: '强制开启开机自启',
          restoreOnClose: '关闭时恢复原状'
        },
        line2: {
          prefix: '开启后，应用将会在下次启动时进入',
          middle: '模式，也会在下次计算机重启后自动启动此应用并进入',
          suffix: '模式'
        },
        line3: {
          prefix: '你也可以直接点击右上角的按钮，直接进入',
          suffix: '模式'
        }
      },
      startBehavior: {
        label: '启动行为',
        description: '应用启动后，窗口的显示方式',
        options: {
          normal: '默认',
          minimize: '最小化',
          minimizeToTray: '最小化到托盘'
        }
      },
      machineName: {
        label: '机器名称',
        description: '每个电脑的名称建议唯一，否则将会导致管理混乱'
      },
      machineCode: {
        label: '机器代码',
        description: '每个电脑的机器代码都是唯一的，用于区分不同的电脑，方便管理'
      },
      machineCodeConsistent: {
        label: '机器码一致',
        description: '为空或一致表示未发生变更'
      }
    },
    sections: {
      sentinel: {
        title: '哨兵',
        description: '调整无人值守模式下和心跳检测相关设置',
        actions: {
          sync: '同步配置',
          reset: '恢复默认'
        },
        runtime: {
          states: {
            idle: '等待判定',
            online: '场景在线',
            offline: '场景离线',
            error: '异常'
          },
          summary: '这里只表示当前主机已启用场景应用的心跳状态，不表示桌面壳本身是否在线。',
          reasons: {
            awaitingSnapshot: '等待桌面壳返回当前哨兵状态',
            unattendedDisabled: '当前未开启无人值守模式',
            machineCodeMissing: '机器码缺失，无法启动哨兵判定',
            noEnabledScenes: '当前主机还没有启用任何需要守护的场景应用',
            heartbeatMissing: '远端尚未收到当前主机已启用场景应用的心跳',
            heartbeatTimeout: '当前主机已启用场景应用的心跳已超过在线窗口，已判定为离线',
            remoteFetchFailed: '暂时无法从远端读取当前主机已启用场景应用的心跳状态',
            lastSeenInvalid: '远端返回的场景应用最后心跳时间格式无效',
            settingsUnavailable: '桌面壳暂时无法读取本地设置'
          },
          fields: {
            enabledScenes: '已启用守护场景 {count} 个',
            onlineWindow: '场景应用在线判定窗口 {count} 秒',
            lastSeenAt: '场景应用最后心跳 {value}',
            staleFor: '已超时 {count} 秒',
            recoveryIdle: '恢复队列空闲',
            recoveryPending: '场景应用恢复判定进行中',
            recoveryCooldown: '场景应用恢复冷却中',
            recoveryStopped: '已达到爆发上限，场景应用自动拉起已停止',
            recoveryAttempts: '当前轮已尝试拉起 {count} 次',
            recoveryEpisodes: '当前爆发窗口已完成 {count} 轮',
            recoveryBurstCount: '累计触发爆发 {count} 次',
            recoveryNextAttemptAt: '下次允许重试 {value}'
          }
        },
        form: {
          startup: {
            label: '开机自启',
            enableDescription: '开启：仅监护直播场景时推荐打开，确保开机后哨兵自动运行，守护场景稳定性',
            disablePrefix: '关闭：若本应用也需常驻运行，则建议关闭，因为已开启 ',
            disableMiddle: ' 模式，开机自启会自动启动本应用，',
            disableSuffix: ' 随之启动'
          },
          onlineWindow: {
            label: '在线判定与刷新间隔',
            description: '同时用于离线判定窗口与机器最后在线时间的刷新周期',
            value: '{seconds} 秒'
          },
          requestUrl: {
            label: '请求地址',
            description: '监控的状态等信息，需要同步到远程服务器，方便统一协调管理',
            placeholder: 'api.v1.lofitick.com/system/unattended/heartbeat'
          }
        }
      },
      ue5: {
        title: 'UE5 接入',
        description: '提供给 UE5 场景侧连接本机 localhost 服务的入口地址，具体请求在列表中查看。',
        actions: {
          requests: '查看请求列表'
        },
        form: {
          endpoint: {
            label: '接入地址',
            description: 'UE5 心跳、信息读取等桥接请求都从这个本地地址展开。'
          },
          upstreamHost: {
            description: '上游地址指 UE5 本地桥接最终转发到的远端目标地址。'
          }
        },
        modal: {
          title: '本地接入请求',
          description: '当前可用的本地桥接请求列表。',
          errorTitle: '本地接入请求暂不可用',
          requestListTitle: '当前可用请求',
          actions: {
            close: '关闭',
            refresh: '刷新'
          },
          summary: {
            accessBase: '接入地址',
            upstreamHost: '上游地址'
          },
          requests: {
            access: {
              title: '本地接入信息',
              description: '读取当前桌面端暴露给 UE5 的桥接信息。'
            },
            heartbeat: {
              title: '场景心跳上报',
              description: '写入当前机器的最新心跳时间，用于刷新在线时间与离线判定。'
            }
          },
          empty: {
            title: '暂无可用请求',
            description: '当前还没有可供 UE5 调用的本地桥接请求。'
          }
        }
      },
      scenes: {
        title: '场景守护',
        description: '主要守护虚幻引擎做的直播场景应用',
        form: {
          onlineWindow: {
            label: '在线判定与刷新间隔',
            short: '在线判定与刷新间隔',
            unit: '秒'
          }
        }
      },
      logs: {
        title: '日志总览',
        description: '按机器查看最近的哨兵日志，后续也可复用到在线机器页与首页大屏。',
        actions: {
          refresh: '刷新日志'
        }
      }
    },
    labels: {
      thisApp: '此应用'
    }
  }
};
