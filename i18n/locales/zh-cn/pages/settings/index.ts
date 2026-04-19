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
      copyToClipboard: '点击复制到剪切板'
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
          enableStartup: '启用开机自启',
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
      machineUuid: {
        label: '机器 UUID',
        description: '每个电脑的 UUID 都是唯一的，用于标识设备身份'
      },
      machineFingerprint: {
        label: '机器指纹',
        description: '用于标识系统环境的指纹哈希，可能随硬件变化'
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
        form: {
          startup: {
            label: '开机自启',
            enableDescription: '开启：仅监护直播场景时推荐打开，确保开机后哨兵自动运行，守护场景稳定性',
            disablePrefix: '关闭：若本应用也需常驻运行，则建议关闭，因为已开启 ',
            disableMiddle: ' 模式，开机自启会自动启动本应用，',
            disableSuffix: ' 随之启动，实现互相监护'
          },
          requestUrl: {
            label: '请求地址',
            description: '监控的状态等信息，需要同步到远程服务器，方便统一协调管理',
            placeholder: 'lofitick.com/api/system/unattended/heartbeat'
          }
        }
      },
      guard: {
        title: '警卫',
        description: '主要配置此软件监护哨兵的相关设置，确保应用的稳定运行和及时响应，从而实现双向监护',
        actions: {
          sync: '同步配置',
          reset: '恢复默认'
        },
        form: {
          enabled: {
            label: '警卫守护',
            descriptionPrefix: '将会直接启动 ',
            descriptionMiddle: ' 监护程序，这样可以 ',
            and: '和',
            descriptionSuffix: ' 之间实现互相监护，提升整体稳定性'
          }
        }
      },
      scenes: {
        title: '场景守护',
        description: '主要守护虚幻引擎做的直播场景应用'
      }
    },
    labels: {
      thisApp: '此应用'
    }
  }
};
