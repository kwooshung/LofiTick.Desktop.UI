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
  blueprint: {
    drawer: {
      title: '爬蟲邏輯',
      description: '從左側挑選節點，在右側拼裝爬蟲任務流程'
    },
    logic: {
      title: '爬蟲邏輯',
      description: '這裡先保留節點畫布、屬性面板與連線能力的占位框',
      badge: '占位中',
      empty: {
        title: '爬蟲邏輯區',
        description: '後續會在這裡放置畫布、節點屬性和執行預覽。',
        badges: {
          canvas: '畫布',
          inspector: '屬性',
          preview: '預覽'
        }
      }
    },
    nodes: {
      title: '節點列表',
      description: '按功能分組展示可拖曳節點',
      groups: {
        flow: {
          title: '流程控制',
          description: '用於搭建執行入口、分支與順序'
        },
        request: {
          title: '網路請求',
          description: '用於發起請求和處理回應'
        },
        parser: {
          title: '資料解析',
          description: '用於擷取頁面和資料內容'
        },
        logic: {
          title: '邏輯與變數',
          description: '用於條件判斷、型別節點與循環'
        },
        debug: {
          title: '除錯與輔助',
          description: '用於日誌、預覽和失敗重試'
        }
      },
      nodes: {
        flow: {
          start: {
            title: '開始節點',
            description: '藍圖執行入口，可配置初始參數'
          },
          end: {
            title: '結束節點',
            description: '藍圖執行終點，輸出最終結果'
          },
          sequence: {
            title: '順序執行',
            description: '按順序連接多個子流程'
          },
          branch: {
            title: '分支選擇',
            description: '根據條件切換執行分支'
          }
        },
        request: {
          get: {
            title: 'GET 請求',
            description: '發送 HTTP GET 請求'
          },
          post: {
            title: 'POST 請求',
            description: '發送 HTTP POST 請求'
          },
          config: {
            title: '請求設定',
            description: '設定請求標頭、Cookie 與代理'
          },
          parse: {
            title: '回應解析',
            description: '解析 JSON、HTML 或 XML 回應'
          }
        },
        parser: {
          css: {
            title: 'CSS 選擇器',
            description: '從 HTML 中擷取元素'
          },
          json: {
            title: 'JSON 解析',
            description: '提取 JSON 欄位'
          },
          list: {
            title: '列表提取',
            description: '處理分頁並展開列表資料'
          },
          attr: {
            title: '屬性提取',
            description: '提取 src、href 等元素屬性'
          }
        },
        logic: {
          boolean: {
            title: 'Boolean',
            description: '布林值節點'
          },
          string: {
            title: 'String',
            description: '字串節點'
          },
          ifElse: {
            title: 'if-else',
            description: '雙分支條件判斷'
          },
          loop: {
            title: 'for',
            description: '循環遍歷集合或次數'
          }
        },
        debug: {
          log: {
            title: '日誌輸出',
            description: '輸出除錯資訊'
          },
          preview: {
            title: '資料預覽',
            description: '預覽當前節點輸出'
          },
          retry: {
            title: '重試機制',
            description: '失敗後自動重試'
          }
        }
      }
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
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音樂'
      }
    }
  },
  execute: {}
};
