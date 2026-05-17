export const hotsearch = {
  title: '热搜',
  description: '按日期归档查看热搜数据、播客脚本与完整媒体文件。',
  runtimes: {
    title: '实时'
  },
  list: {
    title: '全部'
  },
  layout: {
    updatedAt: '更新于',
    dates: {
      title: '日期归档',
      description: '左侧像邮箱列表一样按日期查看热搜批次。',
      total: '热搜 {value}',
      newCount: '新增 {value}',
      podcastCount: '播客 {value}'
    }
  },
  sections: {
    data: {
      title: '数据'
    },
    podcast: {
      title: '播客'
    },
    music: {
      title: '背景音乐'
    }
  },
  actions: {
    resetFilters: '重置筛选',
    openSource: '打开来源'
  },
  categories: {
    tech: '科技',
    social: '社会',
    business: '商业',
    entertainment: '娱乐'
  },
  data: {
    description: '按平台和关键词筛选当天热搜',
    searchPlaceholder: '搜索标题、摘要或关键词',
    searchAction: '搜索',
    platformsTitle: '热搜平台',
    platformsDescription: '垂直切换平台分类，快速缩小表格范围。',
    allPlatforms: '全部平台',
    cards: {
      totalRows: '热搜总条数',
      newRows: '新增条数',
      podcastRows: '已生成播客'
    },
    table: {
      title: '标题 / 摘要',
      platform: '平台',
      popularity: '热度',
      publishedAt: '入库时间',
      actions: '操作',
      detail: '详情'
    },
    status: {
      new: '新增',
      podcastReady: '已播客化',
      pending: '待生成'
    },
    empty: {
      title: '当前筛选下暂无热搜数据',
      description: '可以切换日期、平台或清空关键词后再看。'
    }
  },
  podcast: {
    description: '按早报/晚报与短篇/长篇切换脚本，并查看完整音频与视频产物。',
    enterVariant: '进入该版本',
    mediaPlatformTitle: '自媒体平台版本',
    scriptTitle: '脚本逐句预览',
    scriptDescription: '整段支持顺播，逐句支持单独试听与波形拖动。',
    playAll: '顺播全部',
    pause: '暂停',
    stop: '停止',
    openVideoModal: '完整视频',
    openAudioModal: '完整音频',
    nowPlaying: '当前播放：{text}',
    fullMediaTitle: '完整媒体文件',
    fullMediaDescription: '下方展示当前版本可用的完整音频或视频文件。',
    emptyAssets: {
      title: '这个平台暂时没有完整媒体文件',
      description: '等对应平台广告版本产出后，这里会自动显示。'
    },
    variants: {
      morningShort: {
        title: '早报短篇',
        description: '适合快节奏平台的晨间短播版本。'
      },
      morningLong: {
        title: '早报长篇',
        description: '适合音频或长视频平台的晨间长版。'
      },
      eveningShort: {
        title: '晚报短篇',
        description: '适合晚间时段发布的短播版本。'
      },
      eveningLong: {
        title: '晚报长篇',
        description: '适合音频或长视频平台的晚间长版。'
      }
    }
  },
  music: {
    description: '背景音乐将关联数据库音乐表，这一页先预留结构与状态位。',
    empty: {
      title: '背景音乐列表暂未接入生成链路',
      description: '等播客音频生成稳定后，这里会接入音乐库选择、试听与绑定。'
    },
    moods: {
      calm: '平静',
      tense: '紧张',
      warm: '温暖'
    },
    status: {
      pending: '待接入'
    },
    reserved: {
      ambientPiano: {
        title: '晨间钢琴氛围',
        description: '适合早报通用版和音频平台的轻量背景。'
      },
      newsPulse: {
        title: '快讯节奏脉冲',
        description: '适合视频化短篇版本的快节奏垫乐。'
      },
      nightWrap: {
        title: '夜间收束氛围',
        description: '适合晚报长篇或音频平台收尾段落。'
      }
    }
  },
  mediaPlatforms: {
    general: '通用',
    bilibili: 'B站',
    toutiao: '头条',
    ixigua: '西瓜视频',
    douyin: '抖音',
    xiaohongshu: '小红书',
    kuaishou: '快手',
    weibo: '微博',
    shengbo: '声播',
    youtube: 'YouTube',
    ximalaya: '喜马拉雅',
    qingtingfm: '蜻蜓FM',
    wangyiPodcast: '网易播客',
    pipixia: '皮皮虾',
    pipigaoxiao: '皮皮搞笑'
  }
};
