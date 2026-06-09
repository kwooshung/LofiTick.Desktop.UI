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
    nodes: {
      groups: {
        recent: {
          title: '最近使用的節點',
          description: '快速存取最近插入的節點'
        },
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
        },
        array: {
          title: '陣列操作',
          description: '用於陣列增刪查改與排序'
        },
        string: {
          title: '字串操作',
          description: '用於字串截取、替換與格式化'
        },
        object: {
          title: '物件操作',
          description: '用於物件屬性讀寫與合併'
        },
        math: {
          title: '數學運算',
          description: '用於數值計算與隨機處理'
        },
        convert: {
          title: '型別轉換',
          description: '用於不同資料型別之間的轉換'
        },
        compare: {
          title: '比較運算',
          description: '用於大小、相等與不等比較'
        },
        logicOp: {
          title: '邏輯運算',
          description: '用於與、或、非和空值合併'
        },
        function: {
          title: '函式節點',
          description: '用於定義、呼叫與回傳函式'
        },
        storage: {
          title: '資料儲存',
          description: '用於檔案寫入與資料提交'
        },
        delay: {
          title: '延遲與等待',
          description: '用於固定、隨機和條件等待'
        },
        antiBot: {
          title: '反爬處理',
          description: '用於請求偽裝與挑戰頁識別'
        },
        helper: {
          title: '輔助功能',
          description: '用於時間、ID 與雜湊等通用能力'
        },
        browser: {
          title: '瀏覽器自動化',
          description: '用於頁面導覽、截圖與分頁控制'
        },
        element: {
          title: '頁面元素互動',
          description: '用於點擊、輸入、拖曳與捲動'
        },
        elementWait: {
          title: '元素等待與檢測',
          description: '用於等待、判斷與讀取元素狀態'
        },
        form: {
          title: '表單處理',
          description: '用於填寫、提交與驗證表單'
        },
        context: {
          title: '瀏覽器上下文',
          description: '用於分頁、Frame 與彈窗控制'
        },
        cookie: {
          title: 'Cookie 與儲存',
          description: '用於 Cookie 與本地儲存讀寫'
        },
        network: {
          title: '網路與請求攔截',
          description: '用於攔截、修改和查看網路請求'
        },
        js: {
          title: '執行 JavaScript',
          description: '用於頁面腳本執行與注入'
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
          },
          parallel: {
            title: '並行執行',
            description: '同時執行多個子流程'
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
          },
          put: {
            title: 'PUT 請求',
            description: '發送 HTTP PUT 請求'
          },
          delete: {
            title: 'DELETE 請求',
            description: '發送 HTTP DELETE 請求'
          },
          download: {
            title: '下載檔案',
            description: '下載檔案到本機'
          },
          upload: {
            title: '上傳檔案',
            description: '上傳檔案到伺服器'
          },
          session: {
            title: '會話管理',
            description: '保持登入狀態、Cookie 管理'
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
          },
          xpath: {
            title: 'XPath 選擇器',
            description: '使用 XPath 擷取 XML / HTML 資料'
          },
          regex: {
            title: '正則表達式',
            description: '使用正則匹配提取文字'
          },
          text: {
            title: 'HTML 轉文字',
            description: '將 HTML 轉換為純文字'
          },
          table: {
            title: '表格解析',
            description: '解析 HTML 表格資料'
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
          },
          integer: {
            title: 'Integer',
            description: '整數值節點'
          },
          float: {
            title: 'Float',
            description: '浮點數值節點'
          },
          array: {
            title: 'Array',
            description: '陣列節點'
          },
          object: {
            title: 'Object',
            description: '物件節點'
          },
          null: {
            title: 'Null',
            description: '空值節點'
          },
          get: {
            title: '取得變數',
            description: '讀取變數值'
          },
          set: {
            title: '設定變數',
            description: '寫入變數值'
          },
          if: {
            title: 'if',
            description: '單分支條件判斷'
          },
          switch: {
            title: 'switch',
            description: '多分支選擇'
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
        },
        array: {
          push: {
            title: 'push',
            description: '在陣列末尾新增元素'
          },
          pop: {
            title: 'pop',
            description: '移除陣列最後一個元素'
          },
          slice: {
            title: 'slice',
            description: '擷取陣列片段'
          },
          concat: {
            title: 'concat',
            description: '合併陣列'
          },
          join: {
            title: 'join',
            description: '陣列轉字串'
          },
          get: {
            title: 'get',
            description: '依索引取得元素'
          },
          indexOf: {
            title: 'indexOf',
            description: '查找元素索引'
          },
          includes: {
            title: 'includes',
            description: '檢查元素是否存在'
          },
          find: {
            title: 'find',
            description: '查找符合條件的元素'
          },
          filter: {
            title: 'filter',
            description: '過濾陣列元素'
          },
          map: {
            title: 'map',
            description: '映射轉換陣列元素'
          },
          reduce: {
            title: 'reduce',
            description: '陣列歸約計算'
          },
          sort: {
            title: 'sort',
            description: '陣列排序'
          },
          length: {
            title: 'length',
            description: '取得陣列長度'
          }
        },
        string: {
          charAt: {
            title: 'charAt',
            description: '取得指定位置字元'
          },
          includes: {
            title: 'includes',
            description: '檢查是否包含子字串'
          },
          slice: {
            title: 'slice',
            description: '擷取字串片段'
          },
          split: {
            title: 'split',
            description: '字串分割為陣列'
          },
          replace: {
            title: 'replace',
            description: '替換字串'
          },
          trim: {
            title: 'trim',
            description: '去除首尾空白'
          },
          toLowerCase: {
            title: 'toLowerCase',
            description: '轉小寫'
          },
          toUpperCase: {
            title: 'toUpperCase',
            description: '轉大寫'
          },
          repeat: {
            title: 'repeat',
            description: '字串重複'
          },
          padStart: {
            title: 'padStart',
            description: '開頭填充'
          },
          padEnd: {
            title: 'padEnd',
            description: '末尾填充'
          },
          length: {
            title: 'length',
            description: '取得字串長度'
          }
        },
        object: {
          get: {
            title: '取得屬性',
            description: '讀取物件屬性'
          },
          set: {
            title: '設定屬性',
            description: '寫入物件屬性'
          },
          delete: {
            title: '刪除屬性',
            description: '刪除物件屬性'
          },
          keys: {
            title: 'keys',
            description: '取得鍵列表'
          },
          values: {
            title: 'values',
            description: '取得值列表'
          },
          entries: {
            title: 'entries',
            description: '取得鍵值對列表'
          },
          assign: {
            title: 'assign',
            description: '合併物件'
          },
          hasOwnProperty: {
            title: 'hasOwnProperty',
            description: '檢查自有屬性'
          },
          create: {
            title: '建立物件',
            description: '建立新物件'
          }
        },
        math: {
          add: {
            title: '加法 (+)',
            description: '數值相加'
          },
          subtract: {
            title: '減法 (-)',
            description: '數值相減'
          },
          multiply: {
            title: '乘法 (*)',
            description: '數值相乘'
          },
          divide: {
            title: '除法 (/)',
            description: '數值相除'
          },
          mod: {
            title: '取餘 (%)',
            description: '取模運算'
          },
          pow: {
            title: '冪運算 (**)',
            description: '指數運算'
          },
          random: {
            title: 'Math.random',
            description: '隨機數'
          },
          max: {
            title: 'Math.max',
            description: '最大值'
          },
          min: {
            title: 'Math.min',
            description: '最小值'
          }
        },
        convert: {
          parseInt: {
            title: 'parseInt',
            description: '字串轉整數'
          },
          parseFloat: {
            title: 'parseFloat',
            description: '字串轉浮點數'
          },
          number: {
            title: 'Number',
            description: '轉數值'
          },
          string: {
            title: 'String',
            description: '轉字串'
          },
          boolean: {
            title: 'Boolean',
            description: '轉布林值'
          },
          toString: {
            title: 'toString',
            description: '物件轉字串'
          },
          typeof: {
            title: 'typeof',
            description: '取得型別'
          },
          instanceof: {
            title: 'instanceof',
            description: '檢查型別'
          }
        },
        compare: {
          eq: {
            title: '==',
            description: '值相等（寬鬆比較）'
          },
          eqStrict: {
            title: '===',
            description: '值和型別相等'
          },
          ne: {
            title: '!=',
            description: '值不等'
          },
          neStrict: {
            title: '!==',
            description: '值或型別不等'
          },
          gt: {
            title: '>',
            description: '大於比較'
          },
          gte: {
            title: '>=',
            description: '大於等於'
          },
          lt: {
            title: '<',
            description: '小於比較'
          },
          lte: {
            title: '<=',
            description: '小於等於'
          }
        },
        logicOp: {
          and: {
            title: '&&',
            description: '邏輯與'
          },
          or: {
            title: '||',
            description: '邏輯或'
          },
          not: {
            title: '!',
            description: '邏輯非'
          },
          nullish: {
            title: '??',
            description: '空值合併'
          },
          optional: {
            title: '?.',
            description: '可選鏈'
          }
        },
        function: {
          define: {
            title: '定義函式',
            description: 'function 宣告或箭頭函式'
          },
          call: {
            title: '呼叫函式',
            description: '執行函式'
          },
          return: {
            title: '回傳值',
            description: 'return 回傳結果'
          },
          params: {
            title: '參數傳遞',
            description: '傳遞函式參數'
          },
          arrow: {
            title: '箭頭函式',
            description: '() => {} 箭頭函式'
          }
        },
        storage: {
          writeFile: {
            title: '寫入檔案',
            description: '寫入資料到暫存檔案'
          },
          readFile: {
            title: '讀取檔案',
            description: '讀取本地檔案資料'
          },
          submit: {
            title: '提交資料',
            description: '透過 API 提交資料到後端'
          }
        },
        delay: {
          fixed: {
            title: '固定延遲',
            description: '等待固定時間'
          },
          random: {
            title: '隨機延遲',
            description: '等待隨機時間（防反爬）'
          },
          element: {
            title: '等待元素',
            description: '等待頁面元素出現'
          },
          condition: {
            title: '等待條件',
            description: '等待滿足某個條件'
          }
        },
        antiBot: {
          ua: {
            title: 'User-Agent 設定',
            description: '設定隨機 User-Agent'
          },
          proxy: {
            title: '代理設定',
            description: '使用代理 IP'
          },
          challenge: {
            title: '驗證碼/挑戰頁檢測',
            description: '識別 Cloudflare、reCAPTCHA、hCaptcha、Turnstile'
          },
          headers: {
            title: '請求標頭偽裝',
            description: '偽裝瀏覽器請求標頭'
          },
          referer: {
            title: 'Referer 設定',
            description: '設定請求來源'
          }
        },
        helper: {
          comment: {
            title: '註解',
            description: '加入註解說明'
          },
          subflow: {
            title: '子流程',
            description: '封裝 reusable 子流程'
          },
          timestamp: {
            title: '時間戳',
            description: '取得目前時間戳'
          },
          uuid: {
            title: 'UUID 產生',
            description: '產生唯一 ID'
          },
          hash: {
            title: '雜湊計算',
            description: 'MD5、SHA 等雜湊計算'
          }
        },
        browser: {
          launch: {
            title: '啟動瀏覽器',
            description: '啟動 Chrome/Firefox/Edge 瀏覽器'
          },
          close: {
            title: '關閉瀏覽器',
            description: '關閉瀏覽器實例'
          },
          openPage: {
            title: '開啟頁面',
            description: '開啟指定 URL 頁面'
          },
          closePage: {
            title: '關閉頁面',
            description: '關閉目前頁面'
          },
          navigate: {
            title: '頁面導覽',
            description: '在目前頁面跳轉到新 URL'
          },
          waitLoad: {
            title: '等待頁面載入',
            description: '等待頁面完全載入'
          },
          waitIdle: {
            title: '等待網路閒置',
            description: '等待網路請求完成'
          },
          screenshot: {
            title: '截圖',
            description: '對目前頁面截圖'
          },
          html: {
            title: '取得頁面 HTML',
            description: '取得頁面完整 HTML'
          },
          url: {
            title: '取得頁面 URL',
            description: '取得目前頁面 URL'
          },
          refresh: {
            title: '頁面重新整理',
            description: '重新整理目前頁面'
          },
          back: {
            title: '頁面返回',
            description: '瀏覽器返回'
          },
          forward: {
            title: '頁面前進',
            description: '瀏覽器前進'
          }
        },
        element: {
          click: {
            title: '點擊元素',
            description: '點擊頁面元素'
          },
          input: {
            title: '輸入文字',
            description: '在輸入框輸入文字'
          },
          clear: {
            title: '清空輸入',
            description: '清空輸入框內容'
          },
          select: {
            title: '選擇下拉選單',
            description: '選擇下拉選單選項'
          },
          checkbox: {
            title: '勾選核取方塊',
            description: '勾選 / 取消勾選核取方塊'
          },
          radio: {
            title: '選擇單選按鈕',
            description: '選擇單選按鈕'
          },
          upload: {
            title: '檔案上傳',
            description: '上傳檔案到檔案輸入框'
          },
          hover: {
            title: '懸停元素',
            description: '滑鼠懸停在元素上'
          },
          drag: {
            title: '拖曳元素',
            description: '拖曳元素到目標位置'
          },
          scrollToElement: {
            title: '捲動到元素',
            description: '捲動頁面到元素位置'
          },
          scrollToPosition: {
            title: '捲動到位置',
            description: '捲動到指定座標'
          },
          rightClick: {
            title: '右鍵點擊',
            description: '右鍵點擊元素'
          },
          doubleClick: {
            title: '雙擊',
            description: '雙擊元素'
          },
          setValue: {
            title: '設定值',
            description: '通用的設定元素值'
          },
          trigger: {
            title: '觸發事件',
            description: '通用的觸發元素事件'
          }
        },
        elementWait: {
          appear: {
            title: '等待元素出現',
            description: '等待元素在 DOM 中出現'
          },
          disappear: {
            title: '等待元素消失',
            description: '等待元素從 DOM 中消失'
          },
          visible: {
            title: '等待元素可見',
            description: '等待元素變為可見'
          },
          hidden: {
            title: '等待元素隱藏',
            description: '等待元素變為隱藏'
          },
          clickable: {
            title: '等待元素可點擊',
            description: '等待元素可被點擊'
          },
          exists: {
            title: '檢查元素存在',
            description: '檢查元素是否存在'
          },
          visibleCheck: {
            title: '檢查元素可見',
            description: '檢查元素是否可見'
          },
          clickableCheck: {
            title: '檢查元素可點擊',
            description: '檢查元素是否可點擊'
          },
          text: {
            title: '取得元素文字',
            description: '取得元素文字內容'
          },
          attr: {
            title: '取得元素屬性',
            description: '取得元素屬性值'
          },
          style: {
            title: '取得元素樣式',
            description: '取得元素 CSS 樣式'
          },
          count: {
            title: '取得元素數量',
            description: '取得符合選擇器的元素數量'
          }
        },
        form: {
          fill: {
            title: '填寫表單',
            description: '批次填寫表單欄位'
          },
          submit: {
            title: '提交表單',
            description: '提交表單'
          },
          reset: {
            title: '重設表單',
            description: '重設表單到初始狀態'
          },
          validate: {
            title: '表單驗證',
            description: '驗證表單欄位'
          }
        },
        context: {
          switchTab: {
            title: '切換分頁',
            description: '切換到不同的瀏覽器分頁'
          },
          openTab: {
            title: '開啟新分頁',
            description: '開啟新的分頁'
          },
          closeTab: {
            title: '關閉分頁',
            description: '關閉目前分頁'
          },
          switchFrame: {
            title: '切換 Frame',
            description: '切換到 iframe'
          },
          switchMainFrame: {
            title: '切換到主 Frame',
            description: '切回主文件'
          },
          switchDialog: {
            title: '切換彈窗',
            description: '切換到瀏覽器彈窗'
          },
          acceptDialog: {
            title: '接受彈窗',
            description: '接受 alert / confirm'
          },
          dismissDialog: {
            title: '拒絕彈窗',
            description: '拒絕 confirm'
          },
          promptText: {
            title: '輸入彈窗文字',
            description: '在 prompt 中輸入文字'
          }
        },
        cookie: {
          get: {
            title: '取得 Cookie',
            description: '取得頁面 Cookie'
          },
          set: {
            title: '設定 Cookie',
            description: '設定 Cookie'
          },
          delete: {
            title: '刪除 Cookie',
            description: '刪除 Cookie'
          },
          localGet: {
            title: '取得 LocalStorage',
            description: '取得 LocalStorage 資料'
          },
          localSet: {
            title: '設定 LocalStorage',
            description: '設定 LocalStorage 資料'
          },
          sessionGet: {
            title: '取得 SessionStorage',
            description: '取得 SessionStorage 資料'
          },
          sessionSet: {
            title: '設定 SessionStorage',
            description: '設定 SessionStorage 資料'
          }
        },
        network: {
          intercept: {
            title: '攔截請求',
            description: '攔截網路請求'
          },
          modifyRequest: {
            title: '修改請求',
            description: '修改請求內容'
          },
          interceptResponse: {
            title: '攔截回應',
            description: '攔截網路回應'
          },
          modifyResponse: {
            title: '修改回應',
            description: '修改回應內容'
          },
          mock: {
            title: '模擬回應',
            description: 'Mock 回應資料'
          },
          list: {
            title: '取得請求列表',
            description: '取得所有網路請求'
          },
          wait: {
            title: '等待特定請求',
            description: '等待某個請求完成'
          }
        },
        js: {
          exec: {
            title: '執行 JS',
            description: '在頁面執行 JavaScript 代碼'
          },
          execReturn: {
            title: '執行 JS 並回傳',
            description: '執行 JS 並取得回傳值'
          },
          inject: {
            title: '注入腳本',
            description: '注入外部腳本檔案'
          },
          listen: {
            title: '新增事件監聽',
            description: '新增事件監聽器'
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
