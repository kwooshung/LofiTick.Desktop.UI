export const hotsearch = {
  title: 'トレンド',
  description: '日付ごとに急上昇データ、Podcast 台本、完成メディアを確認します。',
  layout: {
    updatedAt: '更新',
    dates: {
      title: '日付アーカイブ',
      description: 'メール一覧のように日付ごとのバッチを確認できます。',
      total: '急上昇 {value}',
      newCount: '新規 {value}',
      podcastCount: 'Podcast {value}'
    }
  },
  sections: {
    data: {
      title: 'データ'
    },
    podcast: {
      title: 'Podcast'
    },
    music: {
      title: 'BGM'
    }
  },
  actions: {
    resetFilters: '絞り込みをリセット',
    openSource: '元リンクを開く'
  },
  categories: {
    social: '社会・民生',
    politics: '政治・国際',
    legal: '法務・安全',
    finance: '経済・金融',
    tech: 'テック・IT',
    auto: '自動車・モビリティ',
    sports: 'スポーツ',
    entertainment: '芸能・ゴシップ',
    filmTv: '映画・テレビ',
    games: 'ゲーム・eスポーツ',
    anime: 'アニメ・二次元',
    lifestyle: '暮らし・感情',
    health: '健康・医療',
    history: '歴史・人文'
  },
  data: {
    description: 'プラットフォームとキーワードで急上昇データを絞り込みます。',
    searchPlaceholder: 'タイトル、要約、キーワードを検索',
    searchAction: '検索',
    platformsTitle: 'プラットフォーム',
    platformsDescription: '縦並びの一覧で対象プラットフォームを切り替えます。',
    allPlatforms: 'すべてのプラットフォーム',
    allTags: 'すべてのタグ',
    variants: {
      content: '内容',
      tags: 'タグ',
      platforms: 'プラットフォーム'
    },
    cards: {
      totalRows: '総件数',
      newRows: '新規件数',
      podcastRows: 'Podcast 化済み'
    },
    table: {
      rank: '番号',
      title: 'タイトル / 要約',
      platform: 'プラットフォーム',
      popularity: '人気度',
      publishedAt: '保存時刻',
      actions: '操作',
      detail: '詳細'
    },
    status: {
      new: '新規',
      podcastReady: 'Podcast 化済み',
      pending: '未生成'
    },
    empty: {
      title: '現在の条件ではデータがありません',
      description: '日付やプラットフォームを切り替えるか、キーワードをクリアしてください。'
    }
  },
  tags: {
    table: {
      no: '番号',
      tag: 'タグ',
      updatedAt: '更新日時',
      createdAt: '作成日時'
    }
  },
  platforms: {
    table: {
      no: '番号',
      platform: 'プラットフォーム',
      updatedAt: '更新日時',
      createdAt: '作成日時'
    }
  },
  podcast: {
    description: '朝/夕と短編/長編を切り替えて台本と完成素材を確認します。',
    enterVariant: 'この版を開く',
    scriptTitle: '台本プレビュー',
    scriptDescription: '文ごとの試聴と波形シークに対応します。',
    playAll: '連続再生',
    pause: '一時停止',
    stop: '停止',
    openVideoModal: '完成動画',
    openAudioModal: '完成音声',
    nowPlaying: '再生中: {text}',
    previousSentence: '前の文',
    nextSentence: '次の文',
    totalSentences: '総文数',
    currentSentence: '現在の文',
    totalDuration: '総再生時間',
    totalDurationDescription: 'この台本の全文章から集計します。',
    sentenceNumber: '音声番号',
    speaker: '話者名',
    notStarted: '未開始',
    currentSentenceDescriptionIdle: 'まだどの文も再生していません。',
    fullMediaTitle: '完成メディア',
    fullMediaDescription: '利用可能な音声版・動画版を下に表示します。',
    emptyAssets: {
      title: 'このプラットフォームの完成素材はまだありません',
      description: '広告差し替え版ができるとここに表示されます。'
    },
    variants: {
      morningShort: {
        title: '朝報ショート',
        description: 'テンポの速いプラットフォーム向けの短い朝版です。'
      },
      morningLong: {
        title: '朝報ロング',
        description: '音声・長尺動画向けの朝のロング版です。'
      },
      eveningShort: {
        title: '夕報ショート',
        description: '夜間公開向けの短い夕報版です。'
      },
      eveningLong: {
        title: '夕報ロング',
        description: '音声・長尺動画向けの夜のロング版です。'
      }
    }
  },
  music: {
    description: '背景音楽は後で音楽テーブルと連携します。',
    empty: {
      title: '背景音楽はまだ未接続です',
      description: '後続で音楽ライブラリ選択、試聴、紐付けに対応します。'
    },
    moods: {
      calm: '穏やか',
      tense: '緊張感',
      warm: '温かい'
    },
    status: {
      pending: '未接続'
    },
    reserved: {
      ambientPiano: {
        title: '朝のピアノアンビエンス',
        description: '朝報の共通版に合う軽めの背景です。'
      },
      newsPulse: {
        title: 'ニュースパルス',
        description: '短尺動画版に合う速めの背景です。'
      },
      nightWrap: {
        title: '夜のラップアップ',
        description: '夕報ロングの締めに合う柔らかい背景です。'
      }
    }
  },
  mediaPlatforms: {
    general: '共通',
    bilibili: 'Bilibili',
    toutiao: 'Toutiao',
    ixigua: 'Xigua Video',
    douyin: 'Douyin',
    xiaohongshu: 'Xiaohongshu',
    kuaishou: 'Kuaishou',
    weibo: 'Weibo',
    shengbo: 'Shengbo',
    youtube: 'YouTube',
    ximalaya: 'Ximalaya',
    qingtingfm: 'Qingting FM',
    wangyiPodcast: 'NetEase Podcast',
    pipixia: 'Pipixia',
    pipigaoxiao: 'Pipigaoxiao'
  }
};
