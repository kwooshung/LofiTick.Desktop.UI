export const crawler = {
  blueprint: {
    title: '爬蟲藍圖',
    groups: {
      navigation: {
        title: '導覽與頁面控制',
        description: '瀏覽器頁面導覽與前進後退'
      },
      wait: {
        title: '等待與同步',
        description: '等待元素、文字、條件或固定時間'
      },
      interaction: {
        title: '互動與輸入',
        description: '點擊、輸入、選擇與鍵盤互動'
      },
      mouse: {
        title: '滑鼠人類模擬',
        description: '模擬更自然的滑鼠移動軌跡'
      },
      scroll: {
        title: '捲動與視圖',
        description: '控制頁面捲動與可見區域'
      },
      extract: {
        title: '擷取與查詢',
        description: '讀取文字、屬性、HTML 與腳本結果'
      },
      http: {
        title: 'HTTP 請求',
        description: '執行純 HTTP 請求與 Cookie 處理'
      },
      detect: {
        title: '檢測與防護',
        description: '辨識驗證頁與常見防護頁面'
      },
      system: {
        title: '系統與視窗',
        description: '讀取螢幕、視窗與剪貼簿資訊'
      },
      variable: {
        title: '資料處理 - 變數',
        description: '儲存與讀取節點間共用變數'
      },
      logic: {
        title: '資料處理 - 邏輯',
        description: '比較、布林與空值判斷'
      },
      math: {
        title: '資料處理 - 數學',
        description: '基本算術、隨機數與取整'
      },
      string: {
        title: '資料處理 - 字串',
        description: '字串擷取、替換、拼接與正則'
      },
      arrayObject: {
        title: '資料處理 - 陣列與物件',
        description: '過濾、合併、拆分與索引讀取'
      },
      typeConvert: {
        title: '資料處理 - 型別轉換',
        description: '字串、數字、布林與 JSON 轉換'
      },
      controlFlow: {
        title: '控制流程',
        description: '迴圈、條件判斷與多路分支'
      },
      output: {
        title: '輸出',
        description: '傳送、列印與截圖類輸出'
      }
    },
    nodes: {
      common: {
        start: {
          title: '開始',
          description: '爬蟲的入口節點，負責觸發爬蟲執行'
        },
        end: {
          title: '結束',
          description: '爬蟲的結束節點，負責終止爬蟲執行'
        }
      },
      navigation: {
        goto: {
          title: '跳轉頁面',
          description: '開啟指定 URL',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示是否跳轉成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            path: {
              label: '目標路徑',
              placeholder: '請輸入目標路徑，例如 /news/123'
            },
            waitReady: {
              label: '等待頁面就緒'
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        refresh: {
          title: '重新整理頁面',
          description: '重新整理目前頁面',
          fields: {
            waitReady: {
              label: '等待頁面就緒'
            },
            timeoutMs: {
              label: '逾時毫秒'
            },
            hardReload: {
              label: '強制重新整理'
            }
          }
        },
        back: {
          title: '後退',
          description: '瀏覽器歷史後退',
          fields: {
            steps: {
              label: '後退步數'
            },
            waitReady: {
              label: '等待頁面就緒'
            },
            timeoutMs: {
              label: '逾時毫秒'
            },
            allowNoHistory: {
              label: '無歷史時忽略錯誤'
            }
          }
        },
        forward: {
          title: '前進',
          description: '瀏覽器歷史前進',
          fields: {
            steps: {
              label: '前進步數'
            },
            waitReady: {
              label: '等待頁面就緒'
            },
            timeoutMs: {
              label: '逾時毫秒'
            },
            allowNoHistory: {
              label: '無歷史時忽略錯誤'
            }
          }
        },
        closePage: {
          title: '關閉頁面',
          description: '關閉目前頁面會話',
          fields: {
            endFlowAfterClose: {
              label: '關閉後終止流程'
            }
          }
        }
      },
      wait: {
        element: {
          title: '等待元素',
          description: '等待指定元素出現'
        },
        time: {
          title: '等待時間',
          description: '固定等待指定毫秒數'
        },
        random: {
          title: '隨機等待',
          description: '在最小值與最大值之間隨機等待'
        },
        loadState: {
          title: '等待載入狀態',
          description: '等待頁面達到指定載入狀態'
        },
        condition: {
          title: '等待條件',
          description: '等待自訂 JS 條件成立'
        },
        text: {
          title: '等待文字',
          description: '等待頁面出現指定文字'
        },
        delay: {
          title: '延遲',
          description: '純延遲等待'
        }
      },
      interaction: {
        clickElement: {
          title: '點擊元素',
          description: '點擊指定元素'
        },
        doubleClickElement: {
          title: '雙擊元素',
          description: '對元素執行雙擊'
        },
        hoverElement: {
          title: '懸停元素',
          description: '將滑鼠懸停到元素上'
        },
        inputText: {
          title: '輸入文字',
          description: '逐字輸入文字內容'
        },
        fillContent: {
          title: '填入內容',
          description: '直接填入表單值'
        },
        selectOption: {
          title: '選擇選項',
          description: '從下拉選單中選擇選項'
        },
        checkBox: {
          title: '勾選框',
          description: '勾選 checkbox'
        },
        uncheckBox: {
          title: '取消勾選',
          description: '取消勾選 checkbox'
        },
        focusElement: {
          title: '聚焦元素',
          description: '讓元素取得焦點'
        },
        dispatchEvent: {
          title: '觸發事件',
          description: '派發指定事件'
        },
        pressKey: {
          title: '鍵盤按鍵',
          description: '模擬鍵盤按下或組合鍵'
        }
      },
      mouse: {
        move: {
          title: '滑鼠移動',
          description: '移動滑鼠到指定座標'
        },
        curve: {
          title: '滑鼠曲線',
          description: '為滑鼠移動加入曲線路徑'
        },
        accel: {
          title: '滑鼠加減速',
          description: '為滑鼠移動加入加減速效果'
        },
        jitter: {
          title: '滑鼠抖動',
          description: '為滑鼠移動加入隨機抖動'
        },
        duration: {
          title: '滑鼠移動時長',
          description: '設定滑鼠移動執行總時長'
        }
      },
      scroll: {
        toPosition: {
          title: '捲動到位置',
          description: '捲動到指定座標或元素'
        },
        intoView: {
          title: '捲動進入視野',
          description: '讓元素進入可見區域'
        },
        infinite: {
          title: '無限捲動',
          description: '循環捲動載入更多內容'
        }
      },
      extract: {
        getText: {
          title: '取得文字',
          description: '取得元素文字內容'
        },
        getAttribute: {
          title: '取得屬性',
          description: '取得元素指定屬性'
        },
        getHtml: {
          title: '取得 HTML',
          description: '取得 innerHTML 或 outerHTML'
        },
        getValue: {
          title: '取得值',
          description: '取得表單元素的值'
        },
        queryElement: {
          title: '查詢元素',
          description: '查詢單一元素'
        },
        queryAllElements: {
          title: '查詢所有元素',
          description: '查詢多個元素並回傳列表'
        },
        executeScript: {
          title: '執行腳本',
          description: '執行自訂 JS 並回傳結果'
        }
      },
      http: {
        request: {
          title: 'HTTP 請求',
          description: '傳送 GET / POST 等純 HTTP 請求'
        },
        getCookies: {
          title: '取得 Cookies',
          description: '取得目前 Cookies'
        },
        setCookies: {
          title: '設定 Cookies',
          description: '設定 Cookies'
        }
      },
      detect: {
        verification: {
          title: '檢測驗證',
          description: '檢測驗證頁面是否出現'
        }
      },
      system: {
        screenSize: {
          title: '取得螢幕尺寸',
          description: '取得系統螢幕寬高'
        },
        windowSize: {
          title: '取得視窗尺寸',
          description: '取得 WebView 視窗尺寸'
        },
        mousePosition: {
          title: '設定滑鼠位置',
          description: '設定滑鼠初始位置'
        },
        readClipboard: {
          title: '讀取剪貼簿',
          description: '讀取系統剪貼簿內容'
        },
        writeClipboard: {
          title: '寫入剪貼簿',
          description: '寫入內容到系統剪貼簿'
        }
      },
      variable: {
        set: {
          title: '設定變數',
          description: '將資料存入變數'
        },
        get: {
          title: '取得變數',
          description: '讀取變數的值'
        }
      },
      logic: {
        equal: {
          title: '等於',
          description: '判斷兩個值是否相等'
        },
        notEqual: {
          title: '不等於',
          description: '判斷兩個值是否不相等'
        },
        greaterThan: {
          title: '大於',
          description: '判斷 a > b'
        },
        lessThan: {
          title: '小於',
          description: '判斷 a < b'
        },
        greaterThanOrEqual: {
          title: '大於等於',
          description: '判斷 a ≥ b'
        },
        lessThanOrEqual: {
          title: '小於等於',
          description: '判斷 a ≤ b'
        },
        and: {
          title: 'AND',
          description: '邏輯與（兩個布林值）'
        },
        or: {
          title: 'OR',
          description: '邏輯或（兩個布林值）'
        },
        not: {
          title: 'NOT',
          description: '邏輯非（取反）'
        },
        isEmpty: {
          title: '是否為空',
          description: '判斷值是否為空（null/undefined/空字串/空陣列）'
        },
        exists: {
          title: '是否存在',
          description: '判斷值是否存在（非 null/undefined）'
        }
      },
      math: {
        add: {
          title: '加法',
          description: '兩個數值相加'
        },
        subtract: {
          title: '減法',
          description: '兩個數值相減'
        },
        multiply: {
          title: '乘法',
          description: '兩個數值相乘'
        },
        divide: {
          title: '除法',
          description: '兩個數值相除'
        },
        round: {
          title: '取整',
          description: '向下、向上或四捨五入取整'
        },
        random: {
          title: '隨機數',
          description: '產生指定範圍隨機數'
        },
        absolute: {
          title: '絕對值',
          description: '取得數值的絕對值'
        },
        modulo: {
          title: '求餘',
          description: '執行取模運算'
        },
        power: {
          title: '冪運算',
          description: '計算 a 的 b 次方'
        }
      },
      string: {
        substring: {
          title: '字串截取',
          description: '截取字串指定部分'
        },
        replace: {
          title: '字串替換',
          description: '替換字串中的內容'
        },
        concat: {
          title: '字串拼接',
          description: '拼接多個字串'
        },
        regexMatch: {
          title: '正則匹配',
          description: '使用正則表達式匹配'
        },
        regexReplace: {
          title: '正則替換',
          description: '使用正則表達式替換'
        },
        split: {
          title: '字串分割',
          description: '按分隔符分割字串'
        },
        length: {
          title: '字串長度',
          description: '取得字串長度'
        },
        uppercase: {
          title: '轉大寫',
          description: '轉換為大寫'
        },
        lowercase: {
          title: '轉小寫',
          description: '轉換為小寫'
        },
        trim: {
          title: '去除空格',
          description: '去除字串首尾空格'
        }
      },
      arrayObject: {
        filter: {
          title: '資料過濾',
          description: '過濾陣列'
        },
        merge: {
          title: '資料合併',
          description: '合併多個資料來源'
        },
        split: {
          title: '資料拆分',
          description: '將資料拆分成多路'
        },
        length: {
          title: '陣列長度',
          description: '取得陣列長度'
        },
        item: {
          title: '陣列索引',
          description: '取得陣列指定索引的值'
        }
      },
      typeConvert: {
        string: {
          title: '轉字串',
          description: '轉換為字串型別'
        },
        number: {
          title: '轉數字',
          description: '轉換為數字型別'
        },
        boolean: {
          title: '轉布林',
          description: '轉換為布林型別'
        },
        json: {
          title: '轉 JSON',
          description: '轉換為 JSON 字串'
        },
        parseJson: {
          title: '解析 JSON',
          description: '解析 JSON 字串'
        }
      },
      controlFlow: {
        loop: {
          title: '迴圈',
          description: 'ForEach / While 迴圈'
        },
        condition: {
          title: '條件判斷',
          description: 'If / Else 分支'
        },
        switch: {
          title: '多路分支',
          description: 'Switch 多分支'
        }
      },
      output: {
        sendToApi: {
          title: '傳送到 API',
          description: '將資料傳送到你的專用 API'
        },
        printLog: {
          title: '列印日誌',
          description: '輸出除錯資訊'
        },
        screenshot: {
          title: '截圖',
          description: '擷取頁面或元素'
        }
      }
    }
  }
};
