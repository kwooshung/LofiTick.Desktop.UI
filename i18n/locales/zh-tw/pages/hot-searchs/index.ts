export const hotsearch = {
  title: '熱搜',
  description: '按日期歸檔查看熱搜資料、播客腳本與完整媒體檔案。',
  layout: {
    updatedAt: '更新於',
    dates: {
      title: '日期歸檔',
      description: '左側像郵件列表一樣按日期查看熱搜批次。',
      total: '熱搜 {value}',
      newCount: '新增 {value}',
      podcastCount: '播客 {value}'
    }
  },
  sections: {
    data: {
      title: '資料'
    },
    podcast: {
      title: '播客'
    },
    music: {
      title: '背景音樂'
    }
  },
  actions: {
    resetFilters: '重設篩選',
    openSource: '打開來源'
  },
  categories: {
    social: '社會民生',
    politics: '時政國際',
    legal: '法治安全',
    finance: '財經經濟',
    tech: '科技網路',
    auto: '汽車出行',
    sports: '體育賽事',
    entertainment: '娛樂八卦',
    filmTv: '影視綜藝',
    games: '遊戲電競',
    anime: '動漫二次元',
    lifestyle: '生活情感',
    health: '健康醫療',
    history: '歷史人文'
  },
  data: {
    description: '依平台與關鍵字篩選熱搜條目，右側表格聚焦當天資料明細。',
    searchPlaceholder: '搜尋標題、摘要或關鍵字',
    searchAction: '搜尋',
    platformsTitle: '熱搜平台',
    platformsDescription: '用垂直切換方式快速縮小表格範圍。',
    allPlatforms: '全部平台',
    allTags: '全部標籤',
    variants: {
      content: '內容',
      tags: '標籤',
      platforms: '平台'
    },
    cards: {
      totalRows: '熱搜總條數',
      newRows: '新增條數',
      podcastRows: '已生成播客'
    },
    table: {
      rank: '編號',
      title: '標題 / 摘要',
      platform: '平台',
      popularity: '熱度',
      publishedAt: '入庫時間',
      actions: '操作',
      detail: '詳情'
    },
    status: {
      new: '新增',
      podcastReady: '已播客化',
      pending: '待生成'
    },
    empty: {
      title: '目前篩選下沒有熱搜資料',
      description: '可切換日期、平台或清空關鍵字後再查看。'
    }
  },
  tags: {
    table: {
      no: '編號',
      tag: '標籤',
      updatedAt: '更新時間',
      createdAt: '建立時間'
    }
  },
  platforms: {
    table: {
      no: '編號',
      platform: '平台',
      updatedAt: '更新時間',
      createdAt: '建立時間'
    }
  },
  podcast: {
    description: '依早報/晚報與短篇/長篇切換腳本，並查看完整音訊與影片成品。',
    enterVariant: '進入此版本',
    scriptTitle: '腳本逐句預覽',
    scriptDescription: '整段支援順播，逐句支援單獨試聽與波形拖動。',
    playAll: '順播全部',
    pause: '暫停',
    stop: '停止',
    openVideoModal: '完整影片',
    openAudioModal: '完整音訊',
    nowPlaying: '目前播放：{text}',
    previousSentence: '上一句',
    nextSentence: '下一句',
    totalSentences: '總句數',
    currentSentence: '目前句數',
    totalDuration: '總時長',
    totalDurationDescription: '依目前腳本全部句子彙總。',
    sentenceNumber: '音訊編號',
    speaker: '人物名稱',
    notStarted: '尚未開始',
    currentSentenceDescriptionIdle: '目前還沒有開始播放任何句子。',
    fullMediaTitle: '完整媒體檔案',
    fullMediaDescription: '下方顯示目前版本可用的完整音訊或影片檔案。',
    emptyAssets: {
      title: '此平台暫時沒有完整媒體檔案',
      description: '等對應平台廣告版本產出後，這裡會自動顯示。'
    },
    variants: {
      morningShort: {
        title: '早報短篇',
        description: '適合快節奏平台的晨間短播版本。'
      },
      morningLong: {
        title: '早報長篇',
        description: '適合音訊或長影片平台的晨間長版。'
      },
      eveningShort: {
        title: '晚報短篇',
        description: '適合晚間時段發布的短播版本。'
      },
      eveningLong: {
        title: '晚報長篇',
        description: '適合音訊或長影片平台的晚間長版。'
      }
    }
  },
  music: {
    description: '背景音樂將關聯資料庫音樂表，這一頁先保留結構與狀態位。',
    empty: {
      title: '背景音樂列表尚未接入生成流程',
      description: '等播客音訊生成穩定後，這裡會接入音樂庫選擇、試聽與綁定。'
    },
    moods: {
      calm: '平靜',
      tense: '緊張',
      warm: '溫暖'
    },
    status: {
      pending: '待接入'
    },
    reserved: {
      ambientPiano: {
        title: '晨間鋼琴氛圍',
        description: '適合早報通用版與音訊平台的輕量背景。'
      },
      newsPulse: {
        title: '快訊節奏脈衝',
        description: '適合影片化短篇版本的快節奏墊樂。'
      },
      nightWrap: {
        title: '夜間收束氛圍',
        description: '適合晚報長篇或音訊平台收尾段落。'
      }
    }
  },
  mediaPlatforms: {
    general: '通用',
    bilibili: 'B站',
    toutiao: '頭條',
    ixigua: '西瓜視頻',
    douyin: '抖音',
    xiaohongshu: '小紅書',
    kuaishou: '快手',
    weibo: '微博',
    shengbo: '聲播',
    youtube: 'YouTube',
    ximalaya: '喜馬拉雅',
    qingtingfm: '蜻蜓FM',
    wangyiPodcast: '網易播客',
    pipixia: '皮皮蝦',
    pipigaoxiao: '皮皮搞笑'
  }
};
