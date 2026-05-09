export const settings = {
  title: '设置',
  general: {
    title: '常规设置',
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
      open: '打开目录'
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
  ui: {
    title: '界面设置',
    description: '主题、深浅色模式、布局与界面元素显示相关的选项',
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
    title: '播放设置',
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
    title: '电源设置',
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
    title: '热搜设置',
    description: '配置本机热搜抓取窗口、平台选择、预算与播客缓冲时间。',
    sections: {
      schedule: {
        title: '抓取计划',
        description: '这里配置热搜窗口的源时间、平台执行间隔和失败补抓策略。'
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
      monthlyBudget: {
        label: '月度预算积分',
        description: '默认按 3500 规划；真实剩余积分请以官网为准。'
      },
      morningStartAt: {
        label: '早间热搜开始时间',
        description: '这是早间窗口的源时间，其他推导时间都会跟随变化。'
      },
      eveningStartAt: {
        label: '晚间热搜开始时间',
        description: '这是晚间窗口的源时间，其他推导时间都会跟随变化。'
      },
      platformIntervalSeconds: {
        label: '单个平台抓取间隔',
        description: '每个平台触发之间的等待时间，单位为秒。比如 360 秒约等于 6 分钟。'
      },
      scheduleJitterSeconds: {
        label: '开始时间随机偏移',
        description: '以早晚基准时间为中心做正负随机秒数偏移。比如 1800 表示正负 30 分钟。'
      },
      podcastBufferMinutes: {
        label: '播客缓冲时长',
        description: '热搜窗口结束后额外预留的缓冲时间，单位为分钟。'
      },
      retryMaxAttempts: {
        label: '失败重试次数',
        description: '单个平台抓取失败后允许自动补抓的最大次数。'
      },
      retryDelayMinutes: {
        label: '重试间隔',
        description: '失败后再次尝试抓取的等待时间，单位为分钟。'
      }
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
      reset: '恢复默认',
      save: '保存设置'
    }
  },
  unattended: {
    title: '无人值守',
    header: {
      description: '调整无人值守模式下和心跳检测相关的设置',
      enter: '前往无人值守页面'
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
