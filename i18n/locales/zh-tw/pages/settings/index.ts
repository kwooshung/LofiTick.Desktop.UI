export const settings = {
  title: '設定',
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
  unattended: {
    title: '無人值守',
    header: {
      description: '調整無人值守模式與心跳檢測相關設定。',
      enter: '進入無人值守模式'
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
      }
    },
    labels: {
      thisApp: '此應用'
    }
  }
};
