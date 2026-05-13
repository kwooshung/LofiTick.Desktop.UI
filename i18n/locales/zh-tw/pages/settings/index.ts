export const settings = {
  title: '設定',
  connections: {
    title: '服務連線',
    description: '集中管理桌面端連接 Rust API 與 1Panel 面板入口所需的設定。',
    apiBase: {
      label: 'Rust API 網域',
      description: '桌面殼直連 Rust API 時使用的基礎網域，預設值為 http://localhost:8180/。',
      placeholder: 'http://localhost:8180/'
    },
    onepanelPanelBase: {
      label: '1Panel 根網址',
      description: '這裡只填 1Panel 面板首頁根網址，下面所有跳轉位址都會依它自動推導。',
      placeholder: 'https://one-panel.lofitick.com/'
    },
    onepanelLinks: {
      title: '1Panel 導航目錄',
      description: '這份目錄會隨根網址即時變化，桌面端不再直接內嵌 1Panel 排程管理頁。',
      currentBase: '目前的 1Panel 根網址',
      actions: {
        openCronjobs: '開啟排程任務',
        openScriptLibrary: '開啟腳本庫'
      }
    }
  },
  general: {
    title: '一般設定',
    description: '調整應用程式的基本行為、介面語言與常用偏好。',
    closeBehavior: {
      label: '關閉行為',
      description: '關閉主視窗時預設要執行的動作。',
      options: {
        unset: '每次詢問',
        minimizeToTray: '最小化到系統匣',
        exit: '直接結束應用程式'
      }
    },
    language: {
      label: '介面語言',
      description: '目前支援 {count} 種語言。'
    },
    rememberWindowState: {
      label: '記住視窗狀態',
      description: '持續記錄視窗位置與大小，並由此開關決定啟動時是否恢復。'
    },
    appDirectory: {
      label: '應用程式目錄',
      description: '開啟應用程式可執行檔所在的目錄。',
      open: '開啟目錄'
    },
    userDataDirectory: {
      label: '使用者資料目錄',
      description: '開啟應用程式的 userData 目錄（偏好設定、快取等）。',
      open: '開啟目錄'
    },
    storage: {
      label: '資料存放目錄',
      description: '資料檔案儲存的目錄，目前路徑：',
      dialogTitle: '選擇附件儲存目錄',
      choose: '選擇目錄',
      reselect: '重新選擇',
      unset: '尚未設定'
    },
    devtools: {
      label: '開發者工具',
      description: '開啟開發者除錯工具（關閉請在 DevTools 視窗內手動關閉）。',
      toggle: '開啟 DevTools'
    },
    multiOpen: {
      label: '允許多重開啟',
      description: '允許同時執行多個應用程式實例。'
    }
  },
  ui: {
    title: '介面外觀',
    description: '主題、亮暗模式、版面配置與介面元素的相關設定。',
    colorMode: {
      label: '顏色模式',
      description: '外觀是淺色還是深色，或依照電腦的設定進行調整',
      options: {
        system: '跟隨系統',
        light: '亮色',
        dark: '暗色'
      }
    },
    primary: {
      label: '主色系',
      description: '主要用於按鈕、連結等需要強調的元素。',
      colors: {
        black: '黑',
        red: '紅',
        orange: '橙',
        amber: '琥珀',
        yellow: '明黃',
        lime: '萊姆綠',
        green: '綠',
        emerald: '翠綠',
        teal: '青綠',
        cyan: '青',
        sky: '天藍',
        blue: '藍',
        indigo: '靛藍',
        violet: '紫羅蘭',
        purple: '紫藍',
        fuchsia: '桃紅',
        pink: '粉紅',
        rose: '玫紅'
      }
    },
    neutral: {
      label: '中性色系',
      description: '主要用於文字、背景與邊框等輔助元素。',
      colors: {
        ink: '墨灰',
        slate: '石板',
        gray: '深灰',
        zinc: '鋅灰',
        neutral: '中灰',
        stone: '石灰',
        taupe: '灰褐',
        mauve: '藕紫',
        mist: '霧灰',
        olive: '橄欖'
      }
    },
    radius: {
      label: '圓角',
      description: '調整介面元件的圓角大小。'
    }
  },
  playback: {
    title: '播放設定',
    description: '與音訊播放相關的各項參數。',
    fade: {
      label: '淡入淡出',
      description: '設定音訊淡入與淡出的時間（毫秒）。',
      labels: {
        in: '淡入',
        out: '淡出'
      },
      unit: {
        ms: '毫秒'
      }
    },
    normalization: {
      label: '音量標準化',
      description: '啟用後會自動調整音訊響度，讓播放音量維持一致，避免忽大忽小。',
      unit: 'LUFS',
      lufs: {
        '-14': 'YouTube / Bilibili / Spotify / Tidal / 網易雲 / QQ 音樂',
        '-16': 'Apple Music / 微信公眾號 / 微博 / Podcast',
        '-24': '電視 / 電影 / Netflix / Disney+ / HBO Max'
      }
    }
  },
  power: {
    title: '電源設定',
    description: '調整應用程式的電源管理選項，以節省電力。',
    startup: {
      enabled: {
        label: '開機自動啟動',
        description: '系統啟動後自動啟動本應用程式。'
      }
    },
    system: {
      label: '系統睡眠',
      description: '阻止後，系統不會進入睡眠，以免下載、爬取、播放等長時間任務被中斷。'
    },
    display: {
      label: '螢幕休眠',
      description: '阻止後，螢幕不會自動關閉，方便隨時查看狀態，同時不影響下載、爬取、播放等任務。'
    },
    options: {
      never: '永不阻止',
      always: '永遠阻止',
      crawling: '爬取時阻止',
      playing: '播放時阻止'
    }
  },
  hotsearch: {
    title: '熱搜設定',
    description: '設定本機熱搜抓取頻率、平台選擇、預算與 Podcast 生成時間。',
    sections: {
      schedule: {
        title: '抓取計畫',
        description: '這裡設定 Podcast 時間基準、平台抓取間隔、隨機偏移與失敗補抓策略。'
      },
      platforms: {
        title: '平台選擇',
        description: '只選你真正需要的平台，預算會依已選平台數量即時計算。'
      },
      summary: {
        title: '計畫摘要',
        description: '顯示目前設定下的視窗耗時、積分預估與建議 Podcast 時間。'
      }
    },
    fields: {
      enabled: {
        label: '自動抓取',
        description: '啟用後，本機會依熱搜視窗計畫自動抓取已選平台。'
      },
      podcastEnabled: {
        label: '自動生成 Podcast',
        description: '啟用後，Podcast 時間會預設跟隨熱搜視窗推導。'
      },
      monthlyBudget: {
        label: '月度預算積分',
        description: '預設以 3500 規劃；真實剩餘積分請以官網為準。'
      },
      morningStartAt: {
        label: '早間熱搜開始時間',
        description: '用來推導早間熱搜 Podcast 的建議生成時間，不影響熱搜抓取頻率。'
      },
      eveningStartAt: {
        label: '晚間熱搜開始時間',
        description: '用來推導晚間熱搜 Podcast 的建議生成時間，不影響熱搜抓取頻率。'
      },
      platformIntervalSeconds: {
        label: '單一平台抓取間隔',
        description: '每個平台觸發之間的等待時間，單位為秒。例如 360 秒約等於 6 分鐘。',
        input: {
          prefix: '間隔',
          unit: '秒'
        }
      },
      scheduleJitterSeconds: {
        label: '開始時間隨機偏移',
        description: '對計畫時間做正負隨機秒數偏移，預設 1800 代表正負 30 分鐘。',
        input: {
          prefix: '偏移',
          unit: '秒'
        }
      },
      podcastBufferSeconds: {
        label: 'Podcast 緩衝時長',
        description: '在抓取階段完成後，再額外保留給整理、潤飾與生成 Podcast 的等待時間，單位為秒。它只影響 Podcast 建議時間，不影響熱搜抓取頻率。',
        input: {
          prefix: '緩衝',
          unit: '秒'
        }
      },
      retryMaxAttempts: {
        label: '失敗重試次數',
        description: '單一平台抓取失敗後允許自動補抓的最大次數。',
        input: {
          prefix: '計數',
          unit: '次數'
        }
      },
      retryDelaySeconds: {
        label: '重試間隔',
        description: '失敗後再次嘗試抓取的等待時間，單位為秒。',
        input: {
          prefix: '延時',
          unit: '秒'
        }
      }
    },
    summary: {
      selectedPlatforms: '已選平台',
      perWindowCost: '單視窗積分',
      dailyCost: '每日積分',
      monthlyEstimate: '月度預估積分',
      windowDuration: '視窗耗時',
      suggestedMorningPodcast: '建議早間 Podcast 時間',
      suggestedEveningPodcast: '建議晚間 Podcast 時間',
      budgetStatus: '預算結餘',
      budgetStatusSafe: '安全',
      budgetStatusWarning: '提醒',
      budgetStatusExceeded: '超出預算',
      scopeMonth: '本月',
      scopeYear: '本年',
      budgetStatusRemainingDetail: '{scope}：預算 {budget}，預估 {estimate}，剩餘 {remaining}',
      budgetStatusExceededDetail: '{scope}：預算 {budget}，預估 {estimate}，超出 {exceeded}',
      rangeValue: '{start} ~ {end}',
      minutesValue: '{value} 分鐘'
    },
    actions: {
      usage: '查看官網用量',
      selectAll: '全選平台',
      clearAll: '清空平台',
      reset: '恢復預設',
      save: '儲存設定'
    }
  },
  cron: {
    title: '計畫任務',
    description: '集中管理本地任務、伺服器任務與系統任務。',
    tabs: {
      local: '本地任務',
      server: '伺服器任務',
      system: '系統任務'
    },
    actions: {
      refresh: '重新整理',
      search: '查詢',
      resetSearch: '清空',
      syncHotsearch: '同步熱搜 cron',
      create: '建立',
      edit: '編輯',
      enableSelected: '批次啟用',
      disableSelected: '批次停用',
      stopSelected: '批次停止',
      deleteSelected: '批次刪除',
      run: '執行',
      stop: '停止',
      records: '紀錄',
      delete: '刪除',
      viewLog: '日誌'
    },
    hotsearch: {
      label: '熱搜計畫任務',
      description: '這裡顯示熱搜開關與 1Panel cron 是否已經一致。',
      enabled: '熱搜開關：{value}',
      callbackUnset: '尚未推導出可供 1Panel 回呼的位址',
      states: {
        ready: '已同步',
        outOfSync: '待修復',
        unconfigured: '尚未設定 1Panel'
      }
    },
    local: {
      runtimeOnly: {
        title: '目前不在 Tauri 執行環境',
        description: '本地任務依賴桌面殼提供的計畫快照，瀏覽器環境下不顯示實際計畫。'
      },
      snapshot: {
        title: '本地背景任務清單',
        description: '這裡展示桌面殼在本機負責的背景任務，不和伺服器端的 1Panel cron 混在一起。'
      },
      summary: {
        enabled: '自動抓取：{value}',
        podcastEnabled: '自動播客：{value}',
        platformCount: '平台數：{value}',
        monthlyBudget: '月預算：{value}',
        sceneCount: '啟用場景：{value}',
        recoveryState: '恢復狀態：{value}'
      },
      items: {
        hotsearch: {
          title: '本地熱搜調度',
          description: '桌面殼常駐輪詢本地熱搜設定，並在早晚時段內執行抓取節拍。'
        },
        sentinel: {
          title: '本地哨兵輪詢',
          description: '桌面殼常駐輪詢無人值守哨兵狀態，並依恢復策略處理異常。'
        }
      },
      schedule: {
        windowsLabel: '執行視窗：',
        podcastLabel: '建議播客：',
        sentinelPolling: '應用執行期間持續輪詢',
        lastSeenLabel: '最後心跳：',
        pending: '等待本地執行時快照'
      },
      actions: {
        openSettings: '前往設定'
      },
      card: {
        activity: '最近活動'
      },
      states: {
        hotsearchEnabled: '執行中',
        hotsearchDisabled: '已停用',
        sentinelOnline: '在線',
        sentinelOffline: '離線',
        sentinelError: '錯誤',
        sentinelIdle: '空閒',
        sentinelUnknown: '未回報'
      },
      windowKeys: {
        morning: '早間視窗',
        evening: '晚間視窗'
      },
      window: {
        title: '{name}',
        startAt: '開始時間',
        endAt: '結束時間',
        suggestedPodcastAt: '建議播客時間',
        duration: '視窗耗時',
        durationValue: '{value} 分鐘',
        platformCount: '平台數量',
        points: '預估積分'
      },
      empty: {
        title: '本地任務暫不可用',
        description: '目前未讀取到桌面殼可展示的本地背景任務資訊。'
      }
    },
    serverShortcut: {
      title: '伺服器任務入口',
      description: '伺服器任務改為直接跳到 1Panel，桌面端這裡只保留入口與提醒。',
      heroTitle: '真正的伺服器排程請直接到 1Panel 管理',
      heroDescription: '桌面端不再鏡像 1Panel 排程列表，也不再要求你在這裡維護 API Key。你只需要設定 1Panel 根網址，之後從這裡一鍵打開排程任務或腳本庫。',
      actions: {
        openCronjobs: '開啟 1Panel 排程任務',
        openScriptLibrary: '開啟 1Panel 腳本庫',
        openConnections: '前往服務連線'
      },
      quickLinks: {
        overview: '開啟 1Panel 概覽',
        terminal: '開啟 1Panel 終端',
        logs: '開啟 1Panel 面板日誌'
      }
    },
    system: {
      readonly: '唯讀',
      groups: {
        system: '系統任務',
        hook: '公開節拍器'
      },
      snapshot: {
        title: '系統內建任務清單',
        description: '這些任務由 Rust API 固定提供，不允許在桌面端新增、編輯或刪除。'
      },
      items: {
        hotsearchMorningGenerate: {
          title: '早間熱搜生成',
          description: '系統會在熱搜設定定義的早間視窗內推進熱搜生成流程。'
        },
        hotsearchEveningGenerate: {
          title: '晚間熱搜生成',
          description: '系統會在熱搜設定定義的晚間視窗內推進熱搜生成流程。'
        },
        hotsearchStep: {
          title: '熱搜單步推進',
          description: '供外部 cron 節拍器呼叫，每次只推進一個平台。'
        },
        quoteRandom: {
          title: '隨機名句抓取',
          description: '抓取一條隨機名句並依冪等規則入庫。'
        }
      },
      schedules: {
        hotsearchMorningGenerate: {
          primary: '依熱搜設定中的早間視窗執行',
          secondary: '系統內建熱搜生成流程'
        },
        hotsearchEveningGenerate: {
          primary: '依熱搜設定中的晚間視窗執行',
          secondary: '系統內建熱搜生成流程'
        },
        hotsearchStep: {
          primary: '由外部 cron / 1Panel 節拍器按固定週期回呼',
          secondary: '/crons/system/hot_searchs/step'
        },
        quoteRandom: {
          primary: '由系統計畫任務按需觸發',
          secondary: '/crons/system/quotes/random'
        }
      },
      empty: {
        title: '系統任務為唯讀視圖',
        description: '這裡展示的是系統內建任務定義，不提供任何編輯入口。'
      }
    },
    search: {
      label: '任務篩選',
      description: '依名稱篩選 1Panel 計畫任務。',
      placeholder: '輸入任務名稱關鍵字'
    },
    table: {
      name: '任務',
      group: '分組',
      path: '路徑',
      method: '方法',
      schedule: '排程',
      retainCopies: '保留份數',
      lastExecutedAt: '上次執行時間',
      createdAt: '建立時間',
      status: '狀態',
      actions: '操作',
      enabled: '啟用',
      disabled: '停用',
      executing: '執行中'
    },
    records: {
      title: '{name} 的執行紀錄',
      actions: {
        clean: '清理紀錄'
      },
      empty: {
        title: '暫無執行紀錄',
        description: '目前任務還沒有可顯示的執行歷史。'
      },
      table: {
        startedAt: '開始時間',
        status: '狀態',
        message: '摘要',
        interval: '耗時',
        actions: '操作',
        intervalValue: '{value} ms'
      }
    },
    logs: {
      title: '執行紀錄 #{id} 日誌',
      empty: {
        title: '暫無日誌內容',
        description: '目前紀錄沒有可顯示的文字日誌。'
      }
    },
    operate: {
      createTitle: '建立計畫任務',
      editTitle: '編輯計畫任務',
      description: '使用圖形表單編輯常用任務欄位，儲存時會自動映射成 1Panel 所需的設定結構。',
      previewNext: '預覽下一次執行',
      nextTimes: '下一次執行時間',
      nextEmpty: '尚未產生預覽結果',
      save: '儲存設定',
      sections: {
        basic: '基本資訊',
        schedule: '執行週期',
        execution: '執行內容',
        preview: '執行預覽',
        runtime: '執行策略'
      },
      descriptions: {
        basic: '任務名稱、任務類型與 1Panel 分組直接對齊回傳的中繼資料。',
        execution: '依任務類型填寫回呼位址、腳本、命令與執行使用者。',
        preview: '儲存前先檢查即將產生的 Cron 表達式與下一次執行時間。',
        runtime: '執行記錄保留、重試、逾時與告警次數在這裡集中設定。'
      },
      form: {
        name: '任務名稱',
        type: '任務類型',
        groupId: '任務分組',
        spec: '執行週期',
        url: '存取位址',
        executor: '執行器',
        script: '腳本內容',
        command: '命令內容',
        user: '執行使用者',
        retainCopies: '執行記錄保留份數',
        retryTimes: '失敗重試次數',
        timeout: '逾時時間',
        ignoreErr: '忽略錯誤',
        alertCount: '告警次數',
        typeOptions: {
          url: '存取 URL',
          shell: 'Shell 腳本',
          command: '命令執行'
        }
      },
      schedule: {
        description: '一般週期優先用圖形方式設定，只有特殊表達式時再切換成自訂。',
        custom: '自訂',
        customPlaceholder: '例如：30 1 * * 1',
        generated: '目前表達式：{value}',
        labels: {
          mode: '週期模式',
          dayOfMonth: '每月日期',
          weekday: '執行星期',
          interval: '重複間隔',
          every: '每',
          hour: '執行小時',
          minute: '執行分鐘'
        },
        options: {
          monthly: '每月',
          weekly: '每週',
          daily: '每天',
          everySeconds: '每 N 秒',
          everyHours: '每 N 小時',
          everyDays: '每 N 天',
          everyMinutes: '每 N 分鐘'
        },
        weekdays: {
          mon: '週一',
          tue: '週二',
          wed: '週三',
          thu: '週四',
          fri: '週五',
          sat: '週六',
          sun: '週日'
        },
        units: {
          day: '日',
          hour: '小時',
          minute: '分鐘',
          second: '秒'
        }
      },
      validation: {
        nameRequired: '任務名稱不能為空',
        customSpecRequired: '請輸入自訂週期表達式',
        urlRequired: '存取位址不能為空',
        executorRequired: '執行器不能為空',
        scriptRequired: '腳本內容不能為空',
        commandRequired: '命令內容不能為空',
        userRequired: '執行使用者不能為空'
      }
    },
    delete: {
      title: '確認刪除任務',
      description: '將刪除 {name}，但不會清理關聯資料。',
      confirm: '確認刪除'
    },
    footer: {
      total: '共 {total} 筆任務',
      selected: '已選 {total} 筆'
    }
  },
  unattended: {
    title: '無人值守',
    header: {
      description: '調整無人值守模式與心跳檢測相關設定。',
      enter: '前往無人值守頁面'
    },
    dialogs: {
      restart: {
        title: '需要重新啟動才能生效',
        description: '無人值守開關已變更。你可以稍後手動重新啟動，或立即重新啟動應用程式以套用變更。',
        actions: {
          cancel: '取消',
          later: '稍後自行重新啟動',
          now: '立即重新啟動'
        },
        toast: {
          later: '已儲存，重新啟動後生效'
        }
      }
    },
    tooltips: {
      copyToClipboard: '點擊複製到剪貼簿',
      openLink: '直接開啟連結'
    },
    analysis: {
      title: '分析時長',
      empty: '暫無資料',
      button: '時長分析',
      fields: {
        crashDecision: '判定崩潰',
        restartDelay: '重啟延遲',
        restartCooldown: '重啟冷卻',
        restartEpisodeWorst: '連續重啟最壞',
        restartEpisodeWithCooldownWorst: '連續重啟＋冷卻最壞',
        burstWorst: '爆發最壞',
        burstCooldown: '爆發冷卻',
        worstTotal: '最壞總時長'
      }
    },
    form: {
      enabled: {
        label: '是否啟用',
        line1: {
          prefix: '開啟後會啟用無人值守模式，同時會',
          middle: '，但不會明確改動你原本的這兩項設定，'
        },
        badges: {
          force: '強制',
          preventSystemSleep: '禁止系統睡眠',
          enableStartup: '強制開啟開機自動啟動',
          restoreOnClose: '關閉時恢復原狀'
        },
        line2: {
          prefix: '啟用後，應用將於下次啟動時進入',
          middle: '模式，並在下次電腦重啟後自動啟動並進入',
          suffix: '模式'
        },
        line3: {
          prefix: '你也可以直接點擊右上角按鈕，直接進入',
          suffix: '模式'
        }
      },
      startBehavior: {
        label: '啟動行為',
        description: '應用啟動後，視窗的顯示方式',
        options: {
          normal: '預設',
          minimize: '最小化',
          minimizeToTray: '最小化到系統匣'
        }
      },
      machineName: {
        label: '機器名稱',
        description: '建議每台電腦名稱唯一，以免管理混亂'
      },
      machineCode: {
        label: '機器碼',
        description: '每台電腦的機器碼皆為唯一，用於區分不同裝置'
      },
      machineCodeConsistent: {
        label: '機器碼一致',
        description: '為空或一致表示未發生變更'
      }
    },
    sections: {
      sentinel: {
        title: '哨兵',
        description: '調整無人值守模式下與心跳檢測相關設定。',
        actions: {
          sync: '同步設定',
          reset: '恢復預設'
        },
        runtime: {
          states: {
            idle: '等待判定',
            online: '場景在線',
            offline: '場景離線',
            error: '異常'
          },
          summary: '這裡只表示目前主機已啟用場景應用的心跳狀態，不表示桌面殼本身是否在線。',
          reasons: {
            awaitingSnapshot: '等待桌面殼回傳目前的哨兵狀態。',
            unattendedDisabled: '目前尚未啟用無人值守模式。',
            machineCodeMissing: '缺少機器碼，無法啟動哨兵判定。',
            noEnabledScenes: '目前這台主機尚未啟用任何守護場景。',
            heartbeatMissing: '遠端尚未收到這台主機的場景心跳。',
            heartbeatTimeout: '心跳已超過在線視窗，目前主機會被視為離線。',
            remoteFetchFailed: '暫時無法從遠端讀取這台主機的場景狀態。',
            lastSeenInvalid: '遠端回傳的最後心跳時間格式無效。',
            settingsUnavailable: '桌面殼暫時無法讀取本機設定。'
          },
          fields: {
            enabledScenes: '已啟用場景 {count} 個',
            onlineWindow: '在線判定與刷新間隔 {count} 秒',
            lastSeenAt: '最後心跳 {value}',
            staleFor: '已超時 {count} 秒',
            recoveryIdle: '恢復佇列閒置中',
            recoveryPending: '恢復判定進行中',
            recoveryCooldown: '恢復冷卻中',
            recoveryStopped: '已達爆發上限，自動重啟已停止',
            recoveryAttempts: '當前輪已重啟 {count} 次',
            recoveryEpisodes: '當前爆發窗口已完成 {count} 輪',
            recoveryBurstCount: '累計觸發爆發 {count} 次',
            recoveryNextAttemptAt: '下次允許重試 {value}'
          }
        },
        form: {
          startup: {
            label: '開機自動啟動',
            enableDescription: '開啟：僅監護直播場景時建議啟用，確保開機後哨兵自動運行。',
            disablePrefix: '關閉：若本應用也需常駐，建議關閉；因已啟用 ',
            disableMiddle: ' 模式，開機自動啟動會啟動本應用，且 ',
            disableSuffix: ' 會隨之啟動。'
          },
          onlineWindow: {
            label: '在線判定與刷新間隔',
            description: '同時用於離線判定視窗與機器最後在線時間的刷新週期。',
            value: '{seconds} 秒'
          },
          requestUrl: {
            label: '請求位址',
            description: '監控狀態等資訊需同步到遠端伺服器，方便統一協調管理。',
            placeholder: 'api.v1.lofitick.com/system/unattended/heartbeat'
          }
        }
      },
      ue5: {
        title: 'UE5 接入',
        description: '提供給 UE5 場景端連接本機 localhost 服務的入口位址，具體請求可在列表中查看。',
        actions: {
          requests: '查看請求列表'
        },
        form: {
          endpoint: {
            label: '本地接入位址',
            description: 'UE5 心跳、資訊讀取等橋接請求都會從這個本地位址展開。'
          },
          upstreamHost: {
            description: '上游位址指 UE5 本地橋接最終轉發到的遠端目標位址。'
          }
        },
        modal: {
          title: '本地接入請求',
          description: '目前可用的本地橋接請求會直接列在這個頁面上。',
          errorTitle: '本地接入請求暫時不可用',
          requestListTitle: '目前可用請求',
          actions: {
            close: '關閉',
            refresh: '重新整理'
          },
          summary: {
            accessBase: '本地接入位址',
            upstreamHost: '上游網域'
          },
          requests: {
            access: {
              title: '本地接入資訊',
              description: '讀取桌面端目前提供給 UE5 的橋接資訊。'
            },
            heartbeat: {
              title: '場景心跳上報',
              description: '寫入目前機器的最新心跳時間，用於刷新在線時間與離線判定。'
            }
          },
          empty: {
            title: '暫無可用請求',
            description: '目前還沒有可供 UE5 呼叫的本地橋接請求。'
          }
        }
      },
      scenes: {
        title: '場景守護',
        description: '主要守護由 Unreal Engine 製作的直播場景應用。',
        form: {
          onlineWindow: {
            label: '在線判定與刷新間隔',
            short: '在線判定與刷新間隔',
            unit: '秒'
          }
        }
      },
      logs: {
        title: '日誌總覽',
        description: '依機器查看最近的哨兵日誌，後續也可復用到在線機器頁與首頁大屏。',
        actions: {
          refresh: '重新整理日誌'
        }
      }
    },
    labels: {
      thisApp: '此應用'
    }
  }
};
