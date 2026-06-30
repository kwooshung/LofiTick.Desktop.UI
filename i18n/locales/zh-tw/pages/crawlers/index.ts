import { crawler } from '@@/i18n/locales/zh-tw/components/crawler';

export const crawlers = {
  title: '爬蟲',
  search: {
    header: {
      title: '搜尋爬蟲',
      startLabel: '點擊搜尋爬蟲',
      conditions: '已設定搜尋條件'
    },
    body: {
      keyword: {
        placeholder: '搜尋站點名稱或描述'
      },
      enabled: {
        placeholder: '篩選啟用狀態'
      }
    }
  },
  targets: {
    title: '站點',
    add: '新增站點',
    edit: '編輯站點',
    addTask: '添加任務',
    menu: {
      open: '開啟站點',
      copyDomain: '複製網域',
      copyBaseUrl: '複製站點位址'
    },
    empty: {
      title: '暫無目標網站',
      description: '還沒有添加任何爬蟲目標網站，點擊上方按鈕添加'
    },
    form: {
      name: {
        label: '網站名稱',
        placeholder: '請輸入網站名稱',
        verify: {
          required: '網站名稱不能為空',
          length: '網站名稱不能超過255個字符'
        }
      },
      domain: {
        label: '域名',
        placeholder: '請輸入域名，如 weibo.com',
        verify: {
          required: '域名不能為空',
          length: '域名不能超過255個字符',
          pattern: '域名格式不正確'
        }
      },
      baseUrl: {
        label: '基礎URL',
        placeholder: '請輸入站點網域，如 weibo.com',
        verify: {
          required: '基礎URL不能為空',
          length: '基礎URL不能超過255個字元',
          pattern: '基礎URL格式不正確'
        }
      },
      description: {
        label: '描述',
        placeholder: '請輸入描述'
      },
      isEnabled: {
        label: '是否啟用'
      },
      unique: {
        checking: '正在檢查唯一性...',
        domainExists: '該域名已存在'
      }
    }
  },
  editor: {
    title: '爬蟲邏輯',
    sidebar: {
      tabs: {
        nodes: '節點',
        siteFunctions: '站點函數',
        globalFunctions: '全域函數'
      },
      loading: '函數列表載入中',
      row: {
        id: 'ID: {id}',
        reference: '引用 {count}',
        target: '站點 #{id}'
      },
      empty: {
        siteMissingTarget: '目前站點資訊缺失，無法載入站點函數。',
        siteNoData: '目前站點暫無函數。',
        globalNoData: '目前暫無全域函數。',
        defaultDescription: '暫無條目',
        siteTitle: '暫無站點函數',
        globalTitle: '暫無全域函數',
        defaultTitle: '暫無條目'
      },
      actions: {
        createSiteFunction: '建立站點函數',
        createGlobalFunction: '建立全域函數',
        editLogic: '編輯邏輯',
        edit: '編輯',
        delete: '刪除'
      },
      editModal: {
        title: '編輯函數資訊',
        nameLabel: '函數名稱',
        namePlaceholder: '請輸入函數名稱',
        descriptionLabel: '描述',
        descriptionPlaceholder: '請輸入函數描述（可選）'
      },
      deleteModal: {
        title: '刪除函數',
        description: '確定要刪除函數「{name}」嗎？此操作無法復原。'
      },
      createModal: {
        titleSite: '建立站點函數',
        titleGlobal: '建立全域函數',
        scopeLabel: '作用域',
        scopeSite: '站點函數',
        scopeGlobal: '全域函數',
        nameLabel: '函數名稱',
        namePlaceholder: '請輸入函數名稱',
        descriptionLabel: '描述',
        descriptionPlaceholder: '請輸入函數描述（選填）',
        siteTargetRequired: '目前缺少站點上下文，無法建立站點函數。'
      }
    },
    empty: {
      title: '畫布還沒有節點',
      description: '從左側拖拽一個藍圖節點到畫布中，開始搭建爬蟲流程。'
    },
    drag: {
      title: '放開滑鼠即可放入節點',
      description: '目前藍圖節點會依滑鼠位置插入到畫布中。'
    },
    actions: {
      restore: '還原',
      zoomIn: '放大',
      zoomOut: '縮小',
      autoLayout: '自動排版',
      redo: '恢復',
      undo: '撤銷'
    },
    draft: {
      saved: '草稿已自動儲存'
    },
    saveFeedback: {
      blueprintTitle: '藍圖儲存',
      title: '函數邏輯儲存'
    },
    loadSource: {
      title: '邏輯面板載入完成',
      loading: '正在從伺服器載入邏輯…',
      server: '已從伺服器載入最新邏輯',
      draft: '伺服器暫無可用資料，已從本地草稿復原',
      default: '未找到可用邏輯，已載入預設空白面板',
      fallbackRequestFailed: '伺服器請求失敗，已執行本地兜底。',
      fallbackNoMatchedData: '伺服器回應未命中目前函數，已執行本地兜底。',
      blueprintSaveSuccess: '藍圖已儲存到伺服器',
      blueprintSaveFailed: '藍圖儲存失敗',
      blueprintSaveFailedWithCode: '藍圖儲存失敗（{code}）',
      blueprintSaveFailedWithCodeAndMessage: '藍圖儲存失敗（{code}：{message}）',
      persistMismatch: '已提交保存，但伺服器回讀結果與本地參數不一致，請重試或檢查後端日誌',
      saveSuccess: '函數邏輯已儲存到伺服器',
      saveFailed: '函數邏輯儲存失敗',
      saveFailedWithCode: '函數邏輯儲存失敗（{code}）',
      saveEchoMissing: '保存已提交，但未讀取到最新函數詳情'
    }
  },
  executions: {
    title: '執行記錄',
    status: {
      pending: '等待執行',
      running: '執行中',
      success: '成功',
      failed: '失敗',
      stopped: '已停止'
    },
    duration: '耗時 {ms}ms',
    records: '抓取 {count} 條',
    empty: {
      title: '暫無執行記錄',
      description: '還沒有執行記錄'
    }
  },
  blueprints: {
    empty: {
      title: '暫無爬蟲',
      description: '目前站點還沒有建立任何爬蟲，請點擊右上角「添加任務」開始建立。'
    },
    parameters: {
      title: '設定執行參數',
      description: '本次執行會使用這裡填寫的參數值，不會自動覆蓋藍圖預設值。',
      fields: {
        stringPlaceholder: '請輸入本次執行的參數值',
        jsonPlaceholder: '請輸入合法 JSON',
        jsonInvalid: 'JSON 格式或資料類型不正確',
        description: '參數 ID：{id} · 類型：{type}'
      },
      actions: {
        execute: '使用目前值執行',
        saveDefaultAndExecute: '保存目前值為預設值並執行'
      }
    },
    table: {
      name: '名稱',
      description: '描述',
      status: '執行狀態',
      lastRunAt: '最後執行'
    },
    actions: {
      execute: '執行',
      pause: '暫停',
      stop: '停止',
      deleteConfirm: '確定要刪除爬蟲「{name}」嗎？此操作無法復原。',
      runSuccess: '已觸發執行，正在執行中。',
      stopSuccess: '已停止本次執行。',
      runFailed: '觸發執行失敗，請稍後再試。',
      deleteSuccess: '刪除成功。',
      deleteFailed: '刪除失敗，請稍後再試。'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音樂'
      }
    }
  },
  blueprint: crawler.blueprint
};
