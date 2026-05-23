export const settings = {
  title: '設定',
  connections: {
    title: 'サービス接続',
    description: 'Rust API と 1Panel の入口をここでまとめて管理します。',
    apiBase: {
      label: 'Rust API ドメイン',
      description: 'デスクトップシェルが Rust API に直接接続するときに使う基底ドメインです。デフォルト値は http://localhost:8180/ です。',
      placeholder: 'http://localhost:8180/'
    },
    onepanelPanelBase: {
      label: '1Panel ルート URL',
      description: 'ここには 1Panel ホームのルート URL だけを入力します。下の各リンクはこの値から自動生成されます。',
      placeholder: 'https://one-panel.lofitick.com/'
    },
    onepanelLinks: {
      title: '1Panel ナビゲーション一覧',
      description: 'この一覧はルート URL に合わせて即時更新されます。デスクトップ側では 1Panel の cron 管理画面をもう内蔵しません。',
      currentBase: '現在の 1Panel ルート URL',
      actions: {
        openCronjobs: '計画タスクを開く',
        openScriptLibrary: 'スクリプトライブラリを開く'
      }
    }
  },
  general: {
    title: '一般設定',
    description: 'アプリの基本的な動作や言語など、共通の設定を行います。',
    closeBehavior: {
      label: 'ウィンドウを閉じるとき',
      description: 'メインウィンドウを閉じたときの既定の動作です。',
      options: {
        unset: '毎回確認する',
        minimizeToTray: 'トレイに最小化',
        exit: 'アプリを終了'
      }
    },
    language: {
      label: '表示言語',
      description: '現在 {count} 種類の言語に対応しています。'
    },
    rememberWindowState: {
      label: 'ウィンドウ状態を記憶',
      description: 'ウィンドウ位置とサイズを常に記録し、このスイッチで起動時に復元するかどうかを決めます。'
    },
    appDirectory: {
      label: 'アプリの場所',
      description: 'アプリの実行ファイルがあるフォルダーを開きます。',
      open: 'フォルダーを開く'
    },
    userDataDirectory: {
      label: 'ユーザーデータの場所',
      description: 'userData フォルダー（設定やキャッシュなど）を開きます。',
      open: 'フォルダーを開く'
    },
    storage: {
      label: 'データ保存先',
      description: 'データファイルを保存するディレクトリです。現在のパス：',
      dialogTitle: '添付ファイルの保存先を選択',
      choose: 'フォルダーを選択',
      reselect: '再選択',
      unset: '未設定'
    },
    devtools: {
      label: '開発者ツール',
      description: '開発者ツールを開きます（閉じる場合は DevTools ウィンドウ側で手動で閉じてください）。',
      toggle: 'DevTools を開く'
    },
    multiOpen: {
      label: '複数起動',
      description: 'アプリを複数同時に起動できるようにします。'
    }
  },
  ui: {
    title: '外観',
    description: 'テーマ、ライト／ダークモード、レイアウトなどの外観設定です。',
    colorMode: {
      label: 'カラーモード',
      description: '外観をライト/ダークにするか、またはコンピューターの設定に合わせて調整します。',
      options: {
        system: 'システムに合わせる',
        light: 'ライト',
        dark: 'ダーク'
      }
    },
    primary: {
      label: 'アクセントカラー',
      description: 'ボタンやリンクなど、強調表示に使用される色です。',
      colors: {
        black: 'ブラック',
        red: 'レッド',
        orange: 'オレンジ',
        amber: 'アンバー',
        yellow: 'イエロー',
        lime: 'ライム',
        green: 'グリーン',
        emerald: 'エメラルド',
        teal: 'ティール',
        cyan: 'シアン',
        sky: 'スカイ',
        blue: 'ブルー',
        indigo: 'インディゴ',
        violet: 'バイオレット',
        purple: 'パープル',
        fuchsia: 'フューシャ',
        pink: 'ピンク',
        rose: 'ローズ'
      }
    },
    neutral: {
      label: 'ニュートラルカラー',
      description: '主にテキスト、背景、ボーダーなどに使用される補助的な色です。',
      colors: {
        ink: 'インク',
        slate: 'スレート',
        gray: 'グレー',
        zinc: 'ジンク',
        neutral: 'ニュートラル',
        stone: 'ストーン',
        taupe: 'トープ',
        mauve: 'モーブ',
        mist: 'ミスト',
        olive: 'オリーブ'
      }
    },
    radius: {
      label: '角丸',
      description: 'UI 要素の角丸の大きさです。'
    }
  },
  playback: {
    title: '再生設定',
    description: 'オーディオ再生に関する各種パラメータです。',
    fade: {
      label: 'フェードイン／アウト',
      description: '音声のフェードイン／アウト時間をミリ秒単位で設定します。',
      labels: {
        in: 'フェードイン',
        out: 'フェードアウト'
      },
      unit: {
        ms: 'ミリ秒'
      }
    },
    normalization: {
      label: 'ラウドネス正規化',
      description: '有効にすると、再生時の音量を自動調整し、急な音量差を防ぎます。',
      unit: 'LUFS',
      lufs: {
        '-14': 'YouTube / bilibili / Spotify / Tidal / NetEase / QQ 音楽',
        '-16': 'Apple Music / WeChat 公式アカウント / Weibo / Podcast',
        '-24': 'テレビ / 映画 / Netflix / Disney+ / HBO Max'
      }
    }
  },
  power: {
    title: '電源設定',
    description: '省電力のため、アプリの電源管理オプションを調整します。',
    startup: {
      enabled: {
        label: '起動時に自動起動',
        description: 'システム起動時にアプリを自動的に起動します。'
      }
    },
    system: {
      label: 'システムスリープ',
      description: 'ブロックすると、ダウンロードやクロール、再生などの長時間タスクが中断されないよう、システムがスリープしなくなります。'
    },
    display: {
      label: 'ディスプレイスリープ',
      description: 'ブロックすると、ダウンロードやクロール、再生などのタスクを実行しながら、いつでも状態を確認できるようディスプレイがスリープしなくなります。'
    },
    options: {
      never: 'ブロックしない',
      always: '常にブロック',
      crawling: 'クロール中のみブロック',
      playing: '再生中のみブロック'
    }
  },
  hotsearch: {
    title: 'トレンド設定',
    description: 'この端末で使う取得頻度、対象プラットフォーム、予算、Podcast 生成時刻を設定します。',
    header: {
      enter: 'トレンドへ'
    },
    sections: {
      schedule: {
        title: '取得スケジュール',
        description: 'Podcast 時刻の基準、プラットフォーム間隔、ランダム幅、再試行方針をここで設定します。'
      },
      podcast: {
        title: 'Podcast 文案',
        description: '番組名、読み手の名前、そして分かれた導入テンプレートと締めテンプレートをここで設定します。本文はプログラムが自動生成します。'
      },
      platforms: {
        title: 'プラットフォーム',
        description: '本当に必要なプラットフォームだけを選びます。予算は選択数から概算します。'
      },
      summary: {
        title: 'プラン概要',
        description: '現在の設定におけるウィンドウ所要時間、想定ポイント、Podcast の推奨時刻を表示します。'
      }
    },
    fields: {
      enabled: {
        label: '自動取得',
        description: '有効にすると、この端末が設定したウィンドウに従って選択済みプラットフォームを自動取得します。'
      },
      podcastEnabled: {
        label: 'Podcast 自動生成',
        description: '有効にすると、Podcast 時刻はトレンド取得ウィンドウから自動推定されます。'
      },
      podcastMaleSpeakerName: {
        label: '男性読み手の名前',
        description: '変数置換で使う男性読み手の名前です。初期値は小洛です。',
        placeholder: '例：小洛'
      },
      podcastFemaleSpeakerName: {
        label: '女性読み手の名前',
        description: '変数置換で使う女性読み手の名前です。初期値は菲菲です。',
        placeholder: '例：菲菲'
      },
      podcastProgramNames: {
        label: '番組名',
        description: '朝版、夜版、VIP 尊享版はそれぞれ専用の番組名変数を使います。'
      },
      podcastMorningProgramName: {
        label: '朝版の番組名',
        description: '通常の朝版 Podcast に使う番組名です。',
        placeholder: '例：洛菲ホット早報'
      },
      podcastEveningProgramName: {
        label: '夜版の番組名',
        description: '通常の夜版 Podcast に使う番組名です。',
        placeholder: '例：洛菲ホット晚報'
      },
      podcastVipMorningProgramName: {
        label: 'VIP 尊享版朝版の番組名',
        description: 'VIP 尊享版朝版 Podcast に使う番組名です。',
        placeholder: '例：洛菲ホット早報 尊享版'
      },
      podcastVipEveningProgramName: {
        label: 'VIP 尊享版夜版の番組名',
        description: 'VIP 尊享版夜版 Podcast に使う番組名です。',
        placeholder: '例：洛菲ホット晚報 尊享版'
      },
      podcastVariables: {
        label: '変数を挿入',
        description: '変数ボタンを押すと、現在フォーカス中の導入または締めテンプレート入力欄に直接挿入されます。'
      },
      podcastOpeningTemplates: {
        label: '導入テンプレート',
        description: 'ここでは導入テンプレートだけを管理します。本文は自動生成されます。',
        placeholder: '例：こちらは [programName]、今日は [solarDateTime] です。',
        placeholderAdContent: '広告内容は広告システムによって自動挿入・生成されます。',
        empty: {
          title: '導入テンプレートがまだありません',
          description: 'まず導入テンプレートを追加して、音声と導入文を設定してください。'
        }
      },
      podcastClosingTemplates: {
        label: '締めテンプレート',
        description: 'ここでは締めテンプレートだけを管理します。本文は自動生成されます。',
        placeholder: '例：以上が本日の [programName] でした。また次回お会いしましょう。',
        placeholderAdContent: '広告内容は広告システムによって自動挿入・生成されます。',
        empty: {
          title: '締めテンプレートがまだありません',
          description: 'まず締めテンプレートを追加して、音声と締め文を設定してください。'
        }
      },
      monthlyBudget: {
        label: '月間ポイント予算',
        description: '初期値は 3500 です。実際の残高は公式コンソールで確認してください。'
      },
      morningStartAt: {
        label: '朝の取得開始時刻',
        description: '朝の Podcast 推奨生成時刻を計算するための基準です。取得頻度には影響しません。'
      },
      eveningStartAt: {
        label: '夜の取得開始時刻',
        description: '夜の Podcast 推奨生成時刻を計算するための基準です。取得頻度には影響しません。'
      },
      platformIntervalSeconds: {
        label: 'プラットフォーム間隔',
        description: '各プラットフォームを発火する間の待機時間です。単位は秒です。たとえば 360 秒は約 6 分です。',
        input: {
          prefix: '間隔',
          unit: '秒'
        }
      },
      scheduleJitterSeconds: {
        label: '開始時刻のランダム幅',
        description: '計画時刻に前後のランダム秒数を加えます。初期値の 1800 は前後 30 分を意味します。',
        input: {
          prefix: '偏移',
          unit: '秒'
        }
      },
      podcastBufferSeconds: {
        label: 'Podcast バッファ',
        description: '取得完了後に、整理・仕上げ・Podcast 生成のために追加で確保する待機時間（秒）です。Podcast 時刻だけに影響し、取得頻度には影響しません。',
        input: {
          prefix: '緩衝',
          unit: '秒'
        }
      },
      retryMaxAttempts: {
        label: '再試行回数',
        description: '1 プラットフォームが失敗した場合に許可する自動再試行の最大回数です。',
        input: {
          prefix: '回数',
          unit: '回'
        }
      },
      retryDelaySeconds: {
        label: '再試行間隔',
        description: '失敗後に再試行するまでの待機時間（秒）です。',
        input: {
          prefix: '遅延',
          unit: '秒'
        }
      }
    },
    options: {
      podcastVoice: {
        random: 'ランダム',
        xiaoluo: 'XiaoLuo',
        feifei: 'Feifei',
        duet: '合'
      },
      podcastTemplate: {
        opening: '導入テンプレート',
        closing: '締めテンプレート'
      },
      podcastSegment: {
        normal: '共通内容',
        morningOnly: '朝のみ',
        eveningOnly: '夜のみ',
        adOpening: '広告導入',
        adContent: '広告内容',
        adClosing: '広告締め'
      }
    },
    variables: {
      speakerName: '読み手の名前',
      maleSpeakerName: '男性名',
      femaleSpeakerName: '女性名',
      programName: '現在の番組名',
      morningProgramName: '朝版の番組名',
      eveningProgramName: '夜版の番組名',
      vipMorningProgramName: 'VIP 尊享版朝版の番組名',
      vipEveningProgramName: 'VIP 尊享版夜版の番組名',
      greeting: '動的あいさつ',
      solarDateTime: '西暦の年月日',
      solarDate: '西暦の月日',
      solarTime: '時刻',
      lunarDateTime: '旧暦の年月日',
      lunarDate: '旧暦の月日',
      weekday: '曜日',
      editionLabel: '朝夕版の表示'
    },
    variableDescriptions: {
      speakerName: '現在の音声に対応する読み手名を使います。',
      maleSpeakerName: '男性読み手の名前を固定で使います。',
      femaleSpeakerName: '女性読み手の名前を固定で使います。',
      programName: '現在の版に対応する番組名を使います。',
      morningProgramName: '通常の朝版 Podcast の番組名です。',
      eveningProgramName: '通常の夜版 Podcast の番組名です。',
      vipMorningProgramName: 'VIP 尊享版朝版 Podcast の番組名です。',
      vipEveningProgramName: 'VIP 尊享版夜版 Podcast の番組名です。',
      greeting: '現在の時間帯に応じて朝か夜のあいさつを動的に出力します。',
      solarDateTime: '例: 2026年5月14日。',
      solarDate: '例: 5月14日。',
      solarTime: '例: 08:30。',
      lunarDateTime: '例: 農曆丙午年三月二十八。',
      lunarDate: '例: 三月二十八。',
      weekday: '現在の曜日です。',
      editionLabel: '現在の回が朝版か夜版かを表します。'
    },
    summary: {
      selectedPlatforms: '選択済みプラットフォーム',
      perWindowCost: '1 ウィンドウあたりのポイント',
      dailyCost: '1 日あたりのポイント',
      monthlyEstimate: '月間想定ポイント',
      windowDuration: 'ウィンドウ所要時間',
      suggestedMorningPodcast: '朝の Podcast 推奨時刻',
      suggestedEveningPodcast: '夜の Podcast 推奨時刻',
      budgetStatus: '予算残高',
      budgetStatusSafe: '安全',
      budgetStatusWarning: '注意',
      budgetStatusExceeded: '超過',
      scopeMonth: '今月',
      scopeYear: '今年',
      budgetStatusRemainingDetail: '{scope}：予算 {budget}、想定 {estimate}、残り {remaining}',
      budgetStatusExceededDetail: '{scope}：予算 {budget}、想定 {estimate}、超過 {exceeded}',
      rangeValue: '{start} ~ {end}',
      minutesValue: '{value} 分'
    },
    actions: {
      usage: '公式使用量を開く',
      selectAll: 'すべて選択',
      clearAll: 'すべて解除',
      addOpeningTemplate: '導入テンプレートを追加',
      addClosingTemplate: '締めテンプレートを追加',
      reset: '初期値に戻す',
      save: '設定を保存'
    }
  },
  cron: {
    title: 'スケジュールタスク',
    description: 'ローカルタスク、サーバータスク、システムタスクをまとめて管理します。',
    tabs: {
      local: 'ローカルタスク',
      server: 'サーバータスク',
      system: 'システムタスク'
    },
    actions: {
      refresh: '更新',
      search: '検索',
      resetSearch: 'クリア',
      syncHotsearch: 'トレンド cron を同期',
      create: '作成',
      edit: '編集',
      enableSelected: '選択項目を有効化',
      disableSelected: '選択項目を無効化',
      stopSelected: '選択項目を停止',
      deleteSelected: '選択項目を削除',
      run: '実行',
      stop: '停止',
      records: '記録',
      delete: '削除',
      viewLog: 'ログ'
    },
    hotsearch: {
      label: 'トレンド cron',
      description: 'トレンド取得の有効状態と 1Panel cron の状態が一致しているかを表示します。',
      enabled: 'トレンド取得：{value}',
      callbackUnset: '1Panel 用のコールバック URL はまだ導出されていません。',
      states: {
        ready: '同期済み',
        outOfSync: '要修復',
        unconfigured: '1Panel 未設定'
      }
    },
    local: {
      runtimeOnly: {
        title: '現在は Tauri 実行環境ではありません',
        description: 'ローカルタスクはデスクトップシェルが提供する計画スナップショットに依存するため、ブラウザー環境では実際の計画を表示できません。'
      },
      snapshot: {
        title: 'ローカルバックグラウンドタスク一覧',
        description: 'この端末でデスクトップシェルが担当しているバックグラウンドタスクを表示し、サーバー側の 1Panel cron と混在させません。'
      },
      summary: {
        enabled: '自動取得：{value}',
        podcastEnabled: '自動ポッドキャスト：{value}',
        platformCount: 'プラットフォーム数：{value}',
        monthlyBudget: '月間予算：{value}',
        sceneCount: '有効シーン数：{value}',
        recoveryState: '復旧状態：{value}'
      },
      items: {
        hotsearch: {
          title: 'ローカル熱搜スケジューラ',
          description: 'デスクトップシェルがローカル熱搜設定を常駐監視し、朝夕ウィンドウ内で取得ティックを実行します。'
        },
        sentinel: {
          title: 'ローカル Sentinel ポーリング',
          description: 'デスクトップシェルが無人運用 Sentinel 状態を常駐監視し、ローカル復旧戦略を適用します。'
        }
      },
      schedule: {
        windowsLabel: '実行ウィンドウ：',
        podcastLabel: '推奨ポッドキャスト：',
        sentinelPolling: 'アプリ起動中は継続ポーリング',
        lastSeenLabel: '最終ハートビート：',
        pending: 'ローカル実行時スナップショット待ち'
      },
      actions: {
        openSettings: '設定を開く'
      },
      card: {
        activity: '最近のアクティビティ'
      },
      states: {
        hotsearchEnabled: '稼働中',
        hotsearchDisabled: '停止中',
        sentinelOnline: 'オンライン',
        sentinelOffline: 'オフライン',
        sentinelError: 'エラー',
        sentinelIdle: 'アイドル',
        sentinelUnknown: '未報告'
      },
      windowKeys: {
        morning: '朝のウィンドウ',
        evening: '夜のウィンドウ'
      },
      window: {
        title: '{name}',
        startAt: '開始時刻',
        endAt: '終了時刻',
        suggestedPodcastAt: '推奨ポッドキャスト時刻',
        duration: '所要時間',
        durationValue: '{value} 分',
        platformCount: 'プラットフォーム数',
        points: '想定ポイント'
      },
      empty: {
        title: 'ローカルタスクは利用できません',
        description: '表示に使えるローカルバックグラウンドタスク情報をデスクトップシェルから取得できませんでした。'
      }
    },
    serverShortcut: {
      title: 'サーバータスク入口',
      description: 'サーバータスクは 1Panel へ直接移動する方式に変更しました。このページには入口と注意事項だけを残します。',
      heroTitle: '本物のサーバー cron は 1Panel で管理する',
      heroDescription: 'デスクトップ側では 1Panel の cron 一覧をミラーしません。また、この画面で API Key を管理する必要もありません。1Panel のルート URL を 1 つ設定し、ここから計画タスクやスクリプトライブラリへ直接移動してください。',
      actions: {
        openCronjobs: '1Panel 計画タスクを開く',
        openScriptLibrary: '1Panel スクリプトライブラリを開く',
        openConnections: 'サービス接続を開く'
      },
      quickLinks: {
        overview: '1Panel 概要を開く',
        terminal: '1Panel ターミナルを開く',
        logs: '1Panel 操作ログを開く'
      }
    },
    system: {
      readonly: '読み取り専用',
      groups: {
        system: 'システムタスク',
        hook: '公開ティッカー'
      },
      snapshot: {
        title: '内蔵システムタスク一覧',
        description: 'これらのタスクは Rust API 側で固定されており、デスクトップ側から新規作成・編集・削除はできません。'
      },
      items: {
        hotsearchMorningGenerate: {
          title: '朝の熱搜生成',
          description: '熱搜設定で定義した朝のウィンドウ内で、システムが熱搜生成フローを進めます。'
        },
        hotsearchEveningGenerate: {
          title: '夜の熱搜生成',
          description: '熱搜設定で定義した夜のウィンドウ内で、システムが熱搜生成フローを進めます。'
        },
        hotsearchStep: {
          title: '熱搜の単発ステップ実行',
          description: '外部 cron ティッカー用の入口で、1 回の呼び出しで 1 プラットフォームだけ進めます。'
        },
        quoteRandom: {
          title: 'ランダム名句の取得',
          description: 'ランダムな名句を 1 件取得し、冪等ルールで保存します。'
        }
      },
      schedules: {
        hotsearchMorningGenerate: {
          primary: '熱搜設定の朝ウィンドウに従って実行',
          secondary: 'システム内蔵の熱搜生成フロー'
        },
        hotsearchEveningGenerate: {
          primary: '熱搜設定の夜ウィンドウに従って実行',
          secondary: 'システム内蔵の熱搜生成フロー'
        },
        hotsearchStep: {
          primary: '外部 cron / 1Panel ティッカーから固定間隔で呼び出し',
          secondary: '/crons/system/hot_searchs/step'
        },
        quoteRandom: {
          primary: '必要に応じてシステム計画タスクから起動',
          secondary: '/crons/system/quotes/random'
        }
      },
      empty: {
        title: 'システムタスクは読み取り専用です',
        description: 'ここではシステム内蔵タスクの定義のみを表示し、編集操作は提供しません。'
      }
    },
    search: {
      label: 'ジョブ検索',
      description: '1Panel の cron ジョブを名前で絞り込みます。',
      placeholder: 'ジョブ名キーワードを入力'
    },
    table: {
      name: 'ジョブ',
      group: 'グループ',
      path: 'パス',
      method: 'メソッド',
      schedule: 'スケジュール',
      retainCopies: '保持世代',
      lastExecutedAt: '最終実行時刻',
      createdAt: '作成日時',
      status: '状態',
      actions: '操作',
      enabled: '有効',
      disabled: '無効',
      executing: '実行中'
    },
    records: {
      title: '{name} の実行履歴',
      actions: {
        clean: '記録をクリア'
      },
      empty: {
        title: '実行履歴はありません',
        description: 'このジョブにはまだ表示できる実行履歴がありません。'
      },
      table: {
        startedAt: '開始時刻',
        status: '状態',
        message: '概要',
        interval: '所要時間',
        actions: '操作',
        intervalValue: '{value} ms'
      }
    },
    logs: {
      title: '記録 #{id} のログ',
      empty: {
        title: 'ログはありません',
        description: 'この記録には表示できるテキストログがありません。'
      }
    },
    operate: {
      createTitle: 'スケジュールタスクを作成',
      editTitle: 'スケジュールタスクを編集',
      description: 'よく使う項目をフォームで編集し、保存時に 1Panel の設定構造へ自動変換します。',
      previewNext: '次回実行をプレビュー',
      nextTimes: '次回の実行時刻',
      nextEmpty: 'まだプレビュー結果はありません',
      save: '設定を保存',
      sections: {
        basic: '基本情報',
        schedule: '実行周期',
        execution: '実行内容',
        preview: '実行プレビュー',
        runtime: '実行ポリシー'
      },
      descriptions: {
        basic: 'タスク名、タスク種別、1Panel グループを取得済みメタデータに合わせます。',
        execution: 'タスク種別に応じて URL、スクリプト、コマンド、実行ユーザーを設定します。',
        preview: '保存前に生成される Cron 式と次回実行時刻を確認します。',
        runtime: '保持件数、再試行、タイムアウト、アラート回数をまとめて調整します。'
      },
      form: {
        name: 'タスク名',
        type: 'タスク種別',
        groupId: 'タスクグループ',
        spec: '実行周期',
        url: 'アクセス先 URL',
        executor: '実行器',
        script: 'スクリプト内容',
        command: 'コマンド内容',
        user: '実行ユーザー',
        retainCopies: '実行履歴の保持件数',
        retryTimes: '再試行回数',
        timeout: 'タイムアウト',
        ignoreErr: 'エラーを無視',
        alertCount: 'アラート回数',
        typeOptions: {
          url: 'URL アクセス',
          shell: 'Shell スクリプト',
          command: 'コマンド実行'
        }
      },
      schedule: {
        description: '通常の周期はフォームで設定し、特殊な式だけ自定义に切り替えます。',
        custom: '自定義',
        customPlaceholder: '例: 30 1 * * 1',
        generated: '現在の式: {value}',
        labels: {
          mode: '周期モード',
          dayOfMonth: '毎月の日付',
          weekday: '曜日',
          interval: '繰り返し間隔',
          every: '毎',
          hour: '実行時',
          minute: '実行分'
        },
        options: {
          monthly: '毎月',
          weekly: '毎週',
          daily: '毎日',
          everySeconds: 'N 秒ごと',
          everyHours: 'N 時間ごと',
          everyDays: 'N 日ごと',
          everyMinutes: 'N 分ごと'
        },
        weekdays: {
          mon: '月',
          tue: '火',
          wed: '水',
          thu: '木',
          fri: '金',
          sat: '土',
          sun: '日'
        },
        units: {
          day: '日',
          hour: '時間',
          minute: '分',
          second: '秒'
        }
      },
      validation: {
        nameRequired: 'タスク名は必須です',
        customSpecRequired: 'カスタム周期式を入力してください',
        urlRequired: 'アクセス先 URL は必須です',
        executorRequired: '実行器は必須です',
        scriptRequired: 'スクリプト内容は必須です',
        commandRequired: 'コマンド内容は必須です',
        userRequired: '実行ユーザーは必須です'
      }
    },
    delete: {
      title: 'cron を削除',
      description: '関連データを消さずに {name} を削除します。',
      confirm: '削除する'
    },
    footer: {
      total: '合計 {total} 件',
      selected: '{total} 件を選択中'
    }
  },
  unattended: {
    title: '無人値守',
    header: {
      description: '無人値守モードおよび心拍監視に関する設定を調整します。',
      enter: '無人値守ページへ移動'
    },
    dialogs: {
      restart: {
        title: '再起動が必要です',
        description: '無人値守の切り替えが変更されました。後で手動で再起動するか、今すぐ再起動して変更を反映できます。',
        actions: {
          cancel: 'キャンセル',
          later: '後で手動で再起動',
          now: '今すぐ再起動'
        },
        toast: {
          later: '保存しました。再起動後に反映されます。'
        }
      }
    },
    tooltips: {
      copyToClipboard: 'クリックしてクリップボードにコピー',
      openLink: 'リンクを開く'
    },
    analysis: {
      title: '分析時間',
      empty: 'データがありません',
      button: '時間分析',
      fields: {
        crashDecision: 'クラッシュ判定',
        restartDelay: '再起動遅延',
        restartCooldown: '再起動クールダウン',
        restartEpisodeWorst: '連続再起動（最悪）',
        restartEpisodeWithCooldownWorst: '連続再起動＋冷却（最悪）',
        burstWorst: 'バースト（最悪）',
        burstCooldown: 'バースト冷却',
        worstTotal: '最悪合計時間'
      }
    },
    form: {
      enabled: {
        label: '有効化',
        line1: {
          prefix: 'オンにすると無人値守モードが有効になり、',
          middle: 'ただしこれらの設定自体を明示的に変更するわけではなく、'
        },
        badges: {
          force: '強制',
          preventSystemSleep: 'システムスリープを禁止',
          enableStartup: '起動時自動起動を強制有効化',
          restoreOnClose: 'オフで元に戻す'
        },
        line2: {
          prefix: '有効化後、次回起動時に',
          middle: 'モードで開始し、次回再起動後も自動起動して',
          suffix: 'モードに入ります'
        },
        line3: {
          prefix: '右上のボタンから直接',
          suffix: 'モードに入ることもできます'
        }
      },
      startBehavior: {
        label: '起動時の表示',
        description: 'アプリ起動後のウィンドウ表示方法',
        options: {
          normal: 'デフォルト',
          minimize: '最小化',
          minimizeToTray: 'トレイに最小化'
        }
      },
      machineName: {
        label: 'マシン名',
        description: '混乱を避けるため、各PCで一意の名前を推奨します'
      },
      machineCode: {
        label: 'マシンID',
        description: '各PCを識別する一意のIDです'
      },
      machineCodeConsistent: {
        label: 'マシンコード一致',
        description: '空または一致なら変更なしと判断します'
      }
    },
    sections: {
      sentinel: {
        title: '哨兵',
        description: '無人値守モードでの心拍監視関連設定を調整します。',
        actions: {
          sync: '設定を同期',
          reset: '既定に戻す'
        },
        runtime: {
          states: {
            idle: '判定待ち',
            online: 'シーンオンライン',
            offline: 'シーンオフライン',
            error: '異常'
          },
          summary: 'ここで示すのは、このマシンで有効なシーンアプリの心拍状態だけであり、デスクトップシェル本体のオンライン状態ではありません。',
          reasons: {
            awaitingSnapshot: 'デスクトップシェルから現在の哨兵状態を取得中です。',
            unattendedDisabled: '現在は無人値守モードが無効です。',
            machineCodeMissing: 'マシンコードがないため、哨兵判定を開始できません。',
            noEnabledScenes: 'このマシンではまだ監護対象のシーンが有効になっていません。',
            heartbeatMissing: 'このマシンのシーン心拍がまだリモートに届いていません。',
            heartbeatTimeout: '心拍がオンライン判定時間を超えたため、このマシンはオフライン扱いです。',
            remoteFetchFailed: '現在このマシンのシーン状態をリモートから取得できません。',
            lastSeenInvalid: 'リモートが返した最後の心拍時刻の形式が不正です。',
            settingsUnavailable: 'デスクトップシェルがローカル設定を読み取れません。'
          },
          fields: {
            enabledScenes: '有効なシーン {count} 件',
            onlineWindow: 'オンライン判定と更新間隔 {count} 秒',
            lastSeenAt: '最後の心拍 {value}',
            staleFor: '{count} 秒タイムアウト中',
            recoveryIdle: '復旧キュー待機中',
            recoveryPending: '復旧判定を進行中',
            recoveryCooldown: '復旧クールダウン中',
            recoveryStopped: 'バースト上限に達したため自動再起動を停止',
            recoveryAttempts: '現在ラウンドで {count} 回再起動',
            recoveryEpisodes: '現在のバースト枠で {count} ラウンド完了',
            recoveryBurstCount: '累計バースト {count} 回',
            recoveryNextAttemptAt: '次回再試行可能時刻 {value}'
          }
        },
        form: {
          startup: {
            label: '起動時に自動起動',
            enableDescription: 'オン：配信シーン監護時に推奨。起動後に哨兵が自動起動します。',
            disablePrefix: 'オフ：このアプリも常駐が必要ならオフ推奨。',
            disableMiddle: ' モードが有効なため、自動起動でこのアプリが起動し、',
            disableSuffix: ' も起動します。'
          },
          onlineWindow: {
            label: 'オンライン判定と更新間隔',
            description: 'オフライン判定の時間幅と、マシン最終オンライン時刻の更新周期の両方に使われます。',
            value: '{seconds} 秒'
          },
          requestUrl: {
            label: 'リクエストURL',
            description: '状態などの情報をリモートサーバーに同期して集中管理します。',
            placeholder: 'api.v1.lofitick.com/system/unattended/heartbeat'
          }
        }
      },
      ue5: {
        title: 'UE5 連携',
        description: 'デスクトップの localhost ブリッジへ接続する入口アドレスです。個別のリクエストは一覧で確認します。',
        actions: {
          requests: 'リクエスト一覧を見る'
        },
        form: {
          endpoint: {
            label: 'ローカル接続先',
            description: 'ハートビートや情報取得などの UE5 ブリッジ要求は、このローカルアドレスから展開されます。'
          },
          upstreamHost: {
            description: '上流アドレスは UE5 のローカルブリッジが最終的に転送する先のリモート URL です。'
          }
        },
        modal: {
          title: 'ローカル接続リクエスト',
          description: '現在利用できる localhost ブリッジ要求をこのページに直接表示します。',
          errorTitle: 'ローカル接続リクエストを取得できません',
          requestListTitle: '現在利用できるリクエスト',
          actions: {
            close: '閉じる',
            refresh: '更新'
          },
          summary: {
            accessBase: 'ローカル接続先',
            upstreamHost: '上流ドメイン'
          },
          requests: {
            access: {
              title: 'ローカル接続情報',
              description: 'デスクトップ側が UE5 に公開している現在のブリッジ情報を取得します。'
            },
            heartbeat: {
              title: 'シーンのハートビート送信',
              description: 'このマシンの最新ハートビート時刻を書き込み、オンライン時間とオフライン判定を更新します。'
            }
          },
          empty: {
            title: '利用できるリクエストがありません',
            description: '現在、UE5 が呼び出せる localhost ブリッジ要求はありません。'
          }
        }
      },
      scenes: {
        title: 'シーン監護',
        description: 'Unreal Engine製の配信シーンアプリを主に監護します。',
        form: {
          onlineWindow: {
            label: 'オンライン判定と更新間隔',
            short: 'オンライン判定と更新間隔',
            unit: '秒'
          }
        }
      },
      logs: {
        title: 'ログ概要',
        description: 'マシンごとに最近の哨兵ログを確認します。この表示は今後オンラインマシン一覧やホーム画面にも再利用できます。',
        actions: {
          refresh: 'ログを更新'
        }
      }
    },
    labels: {
      thisApp: 'このアプリ'
    }
  }
};
