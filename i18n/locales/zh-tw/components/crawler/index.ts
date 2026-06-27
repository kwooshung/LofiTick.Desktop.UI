export const crawler = {
  blueprint: {
    title: '爬蟲藍圖',
    groups: {
      navigation: {
        title: '導覽與頁面控制',
        description: '瀏覽器導覽、前進與返回'
      },
      wait: {
        title: '等待與同步',
        description: '等待元素、文字、條件或時間'
      },
      interaction: {
        title: '互動與輸入',
        description: '點擊、輸入、選取與鍵盤輸入'
      },
      scroll: {
        title: '捲動與視圖',
        description: '控制頁面捲動與可見性'
      },
      extract: {
        title: '擷取與查詢',
        description: '讀取文字、屬性、HTML 與腳本結果'
      },
      http: {
        title: 'HTTP 請求',
        description: '執行原始 HTTP 請求並處理 cookie'
      },
      system: {
        title: '系統與視窗',
        description: '讀取螢幕、視窗與剪貼簿資料'
      },
      variable: {
        title: '資料處理 - 變數',
        description: '在節點間儲存與讀取共用變數'
      },
      constant: {
        title: '資料處理 - 常數',
        description: '讀取內建系統常數'
      },
      logic: {
        title: '資料處理 - 邏輯',
        description: '比較、布林與空值檢查'
      },
      math: {
        title: '資料處理 - 數學',
        description: '基本算術、亂數與四捨五入'
      },
      string: {
        title: '資料處理 - 字串',
        description: '子字串、取代、串接與正則表達式'
      },
      dateTime: {
        title: '資料處理 - 日期與時間',
        description: '處理目前時間與時間戳格式'
      },
      arrayObject: {
        title: '資料處理 - 陣列與物件',
        description: '篩選、合併、拆分與索引查找'
      },
      typeConvert: {
        title: '資料處理 - 型別轉換',
        description: '字串、數字、布林與 JSON 轉換'
      },
      controlFlow: {
        title: '控制流程',
        description: '迴圈、分支與 switch 控制'
      },
      output: {
        title: '輸出',
        description: '傳送、日誌與截圖輸出'
      }
    },
    nodes: {
      common: {
        start: {
          title: '函式開始',
          suffix: '開始',
          description: '函式邏輯的入口節點，負責接收參數並開始執行',
          form: {
            crawlerTitle: '爬蟲標題（必填）',
            crawlerTitlePlaceholder: '請輸入爬蟲標題',
            crawlerTitleRequired: '儲存藍圖前必須先填寫爬蟲標題。',
            crawlerDescription: '爬蟲描述',
            crawlerDescriptionPlaceholder: '請輸入爬蟲描述（選填）'
          }
        },
        end: {
          title: '結束',
          description: '終止節點，結束爬蟲執行'
        },
        function: {
          start: {
            title: '函式開始',
            suffix: '開始',
            description: '函式邏輯的入口節點，負責接收參數並開始執行',
            fields: {
              parameterLabel: '參數',
              parameterDescription: '函式開始節點輸出的參數值'
            },
            actions: {
              add: '新增參數'
            },
            empty: {
              title: '還沒有參數',
              description: '新增參數後，函式就能從外部接收值。',
              action: '新增參數'
            }
          },
          return: {
            title: '函式返回',
            suffix: '回傳值',
            description: '函式邏輯的返回節點，負責結束執行並回傳結果',
            fields: {
              returnLabel: '回傳值',
              returnDescription: '函式返回節點接收並輸出的結果值'
            },
            actions: {
              add: '新增回傳值'
            },
            empty: {
              title: '還沒有回傳值',
              description: '新增回傳值後，函式就能把結果傳遞給呼叫方。',
              action: '新增回傳值'
            }
          },
          pins: {
            connectedHint: '已連接，使用連線值',
            namePlaceholder: '引腳名稱',
            stringPlaceholder: '請輸入預設值',
            jsonPlaceholder: '請輸入 JSON 預設值'
          }
        },
        units: {
          millisecond: '毫秒',
          count: '次',
          item: '項',
          char: '字元',
          pixel: '像素',
          percent: '%',
          indent: '格'
        },
        pinLabels: {
          input: '輸入',
          element: '元素',
          elements: '元素列表',
          exists: '存在',
          context: '上下文',
          text: '文字',
          pattern: '模式',
          replacement: '替換',
          search: '查找',
          flags: '標誌',
          value: '值',
          a: 'A',
          b: 'B',
          min: '最小值',
          max: '最大值',
          base: '底數',
          exp: '指數',
          start: '起始',
          separator: '分隔符',
          result: '結果',
          matches: '匹配',
          message: '訊息',
          array: '陣列',
          length: '長度',
          index: '索引',
          item: '資料項'
        },
        connectedInputHint: '已連接輸入，使用連線值',
        operandInputLabel: '輸入 {label}',
        operandCount: '{count}項',
        selectorInput: {
          mode: {
            options: {
              xpath: 'XPath',
              css: 'CSS'
            }
          },
          invalidHint: '目前選擇器與所選類型不匹配，請檢查 XPath/CSS 語法。'
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
              placeholder: '請輸入目標路徑，例如 /news/123',
              validation: {
                empty: '路徑不能為空',
                invalidFormat: '路徑應以 "/" 開頭，或為完整 URL',
                invalidUrl: 'URL 格式無效',
                invalidTitle: '跳轉路徑提示',
                extractedTitle: '已自動擷取路徑',
                extracted: '已從 URL "{domain}" 擷取路徑：{path}',
                domainMismatch: '網域不符：期望 "{expected}"\n，實際 "{actual}"'
              }
            },
            waitReady: {
              label: '等待頁面就緒'
            },
            timeoutMs: {
              label: '逾時毫秒'
            },
            windowWidth: {
              label: '視窗寬度'
            },
            windowHeight: {
              label: '視窗高度'
            },
            windowPositionMode: {
              label: '位置模式',
              options: {
                preset: '預設位置',
                custom: '自訂座標'
              }
            },
            windowPositionPreset: {
              label: '預設位置',
              options: {
                topLeft: '左上',
                topCenter: '上中',
                topRight: '右上',
                centerLeft: '左中',
                center: '置中',
                centerRight: '右中',
                bottomLeft: '左下',
                bottomCenter: '下中',
                bottomRight: '右下'
              }
            },
            windowX: {
              label: '視窗 X'
            },
            windowY: {
              label: '視窗 Y'
            },
            showWebview: {
              label: '顯示 WebView'
            }
          }
        },
        refresh: {
          title: '重新整理頁面',
          description: '重新整理目前頁面',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示是否重新整理成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            timeoutMs: {
              label: '逾時毫秒'
            },
            waitReady: {
              label: '等待頁面就緒'
            },
            hardReload: {
              label: '強制重新整理'
            }
          }
        },
        back: {
          title: '後退',
          description: '瀏覽器歷史後退',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示是否後退成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
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
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示是否前進成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
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
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示是否關閉頁面成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
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
          description: '等待指定元素出現',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示等待元素是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            selector: {
              label: '元素選擇器',
              placeholder: '請輸入選擇器，例如 .news-item'
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        time: {
          title: '等待時間',
          description: '固定等待指定毫秒數',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示等待時間是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            durationMs: {
              label: '等待毫秒'
            }
          }
        },
        random: {
          title: '隨機等待',
          description: '在最小值與最大值之間隨機等待',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示隨機等待是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            minMs: {
              label: '最小毫秒'
            },
            maxMs: {
              label: '最大毫秒'
            }
          }
        },
        loadState: {
          title: '等待載入狀態',
          description: '等待頁面達到指定載入狀態',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示等待載入狀態是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            state: {
              label: '載入狀態',
              description: '選擇要等待到哪個載入階段再繼續執行',
              options: {
                load: 'load（頁面資源載入完成）',
                domcontentloaded: 'domcontentloaded（DOM 結構就緒）',
                networkidle: 'networkidle（網路請求閒置）'
              }
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        condition: {
          title: '等待條件',
          description: '等待自訂 JS 條件成立',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示等待條件是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            expression: {
              label: '條件表達式',
              description: '請填入回傳 true/false 的 JS 表達式，回傳 true 時會繼續流程',
              placeholder: "範例：window.location.href.includes('/news')"
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        text: {
          title: '等待文字',
          description: '等待頁面出現指定文字',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示等待文字是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            text: {
              label: '目標文字',
              placeholder: '請輸入需要等待出現的文字'
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        delay: {
          title: '延遲',
          description: '純延遲等待',
          outputs: {
            success: '成功',
            fail: '失敗',
            boolean: '結果',
            booleanDescription: '表示延遲等待是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          fields: {
            durationMs: {
              label: '延遲毫秒'
            }
          }
        }
      },
      interaction: {
        common: {
          outputs: {
            boolean: '結果',
            booleanDescription: '表示互動執行是否成功',
            message: '資訊',
            messageDescription: '失敗時的錯誤訊息或例外說明'
          },
          pinDescriptions: {
            elementInput: '由元素查詢節點輸出的目標元素'
          },
          fields: {
            selector: {
              label: '元素選擇器',
              placeholder: '例如：#login-btn 或 .form input[name="email"]'
            },
            timeoutMs: {
              label: '逾時毫秒'
            },
            button: {
              label: '滑鼠按鍵',
              options: {
                left: '左鍵',
                middle: '中鍵',
                right: '右鍵'
              }
            },
            clickCount: {
              label: '點擊次數'
            },
            hoverDelayMs: {
              label: '懸停後延遲',
              input: {
                prefix: '固定'
              }
            },
            randomHoverDelay: {
              label: '隨機懸停延遲'
            },
            hoverDelayMinMs: {
              label: '最小懸停延遲毫秒',
              input: {
                prefix: '最小'
              }
            },
            hoverDelayMaxMs: {
              label: '最大懸停延遲毫秒',
              input: {
                prefix: '最大'
              }
            },
            text: {
              label: '文字內容',
              placeholder: '請輸入要鍵入的文字'
            },
            content: {
              label: '填入內容',
              placeholder: '請輸入要填入的內容'
            },
            typeMode: {
              label: '輸入模式',
              options: {
                type: '逐字輸入',
                fill: '直接填入'
              }
            },
            inputIntervalMs: {
              label: '輸入間隔',
              input: {
                prefix: '固定',
                unit: '毫秒'
              }
            },
            randomInputInterval: {
              label: '隨機間隔'
            },
            inputIntervalMinMs: {
              label: '最小間隔毫秒',
              input: {
                prefix: '最小',
                unit: '毫秒'
              }
            },
            inputIntervalMaxMs: {
              label: '最大間隔毫秒',
              input: {
                prefix: '最大',
                unit: '毫秒'
              }
            },
            clearBefore: {
              label: '輸入前清空'
            },
            optionMode: {
              label: '選項匹配模式',
              options: {
                text: '依顯示文字',
                value: '依 value',
                index: '依索引'
              }
            },
            optionValue: {
              label: '選項目標值',
              placeholder: '請輸入目標文字 / value / 索引'
            },
            skipIfAlreadyState: {
              label: '已是目標狀態則略過'
            },
            eventName: {
              label: '事件名稱',
              placeholder: '請選擇要觸發的事件',
              options: {
                click: '點擊 click',
                dblclick: '雙擊 dblclick',
                mousedown: '按下 mousedown',
                mouseup: '放開 mouseup',
                mouseenter: '移入 mouseenter',
                mouseleave: '移出 mouseleave',
                mousemove: '移動 mousemove',
                input: '輸入 input',
                change: '變更 change',
                focus: '聚焦 focus',
                blur: '失焦 blur',
                keydown: '按鍵按下 keydown',
                keyup: '按鍵放開 keyup',
                keypress: '按鍵觸發 keypress',
                submit: '提交 submit'
              }
            },
            bubbles: {
              label: '允許冒泡'
            },
            cancelable: {
              label: '允許取消'
            },
            key: {
              label: '按鍵',
              addPart: '新增組合鍵',
              removePart: '移除',
              preview: '目前組合',
              options: {
                enter: 'Enter',
                tab: 'Tab',
                shiftTab: 'Shift + Tab',
                escape: 'Esc',
                space: '空白 Space',
                backspace: '退格 Backspace',
                delete: '刪除 Delete',
                insert: '插入 Insert',
                home: 'Home',
                end: 'End',
                pageUp: 'PageUp',
                pageDown: 'PageDown',
                arrowUp: '方向上 ArrowUp',
                arrowDown: '方向下 ArrowDown',
                arrowLeft: '方向左 ArrowLeft',
                arrowRight: '方向右 ArrowRight',
                f1: 'F1',
                f2: 'F2',
                f3: 'F3',
                f4: 'F4',
                f5: 'F5',
                f6: 'F6',
                f7: 'F7',
                f8: 'F8',
                f9: 'F9',
                f10: 'F10',
                f11: 'F11',
                f12: 'F12',
                ctrlA: '全選 Ctrl + A',
                ctrlC: '複製 Ctrl + C',
                ctrlV: '貼上 Ctrl + V',
                ctrlX: '剪下 Ctrl + X',
                ctrlZ: '復原 Ctrl + Z',
                ctrlY: '重做 Ctrl + Y',
                ctrlS: '儲存 Ctrl + S',
                ctrlP: '列印 Ctrl + P',
                ctrlF: '搜尋 Ctrl + F',
                ctrlR: '重新整理 Ctrl + R',
                ctrlL: '網址列 Ctrl + L',
                ctrlT: '新分頁 Ctrl + T',
                ctrlW: '關閉分頁 Ctrl + W',
                ctrlShiftT: '還原分頁 Ctrl + Shift + T',
                ctrlShiftN: '無痕視窗 Ctrl + Shift + N',
                altTab: '切換視窗 Alt + Tab',
                altF4: '關閉視窗 Alt + F4',
                shiftEnter: 'Shift + Enter',
                metaC: 'Mac 複製 Meta + C',
                metaV: 'Mac 貼上 Meta + V',
                metaS: 'Mac 儲存 Meta + S',
                metaZ: 'Mac 復原 Meta + Z'
              }
            },
            repeatCount: {
              label: '重複次數'
            },
            pressDurationMs: {
              label: '按下時長毫秒'
            },
            simulateNativeInput: {
              label: '模擬真實裝置輸入'
            }
          }
        },
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
          description: '使用擬人化參數控制滑鼠由起點移動到終點',
          fields: {
            startX: {
              label: '起點 X',
              description: '滑鼠起始位置 X 座標'
            },
            startY: {
              label: '起點 Y',
              description: '滑鼠起始位置 Y 座標'
            },
            endX: {
              label: '終點 X',
              description: '滑鼠目標位置 X 座標'
            },
            endY: {
              label: '終點 Y',
              description: '滑鼠目標位置 Y 座標'
            },
            curveType: {
              label: '軌跡曲線',
              options: {
                linear: '線性',
                bezier: '貝茲曲線',
                spline: '樣條曲線'
              }
            },
            curveStrength: {
              label: '曲率強度',
              description: '軌跡彎曲程度'
            },
            randomCurveStrength: {
              label: '隨機曲率強度'
            },
            curveStrengthMin: {
              label: '最小曲率強度'
            },
            curveStrengthMax: {
              label: '最大曲率強度'
            },
            speedProfile: {
              label: '速度曲線',
              options: {
                linear: '等速',
                easeIn: '先慢後快',
                easeOut: '先快後慢',
                easeInOut: '先慢後快再慢'
              }
            },
            randomDuration: {
              label: '隨機移動時長'
            },
            durationMs: {
              label: '移動時長',
              description: '固定移動總時長'
            },
            durationMinMs: {
              label: '最短時長'
            },
            durationMaxMs: {
              label: '最長時長'
            },
            enableJitter: {
              label: '啟用抖動'
            },
            jitterAmplitude: {
              label: '抖動幅度',
              description: '單次抖動位移幅度'
            },
            randomJitterAmplitude: {
              label: '隨機抖動幅度'
            },
            jitterAmplitudeMin: {
              label: '最小抖動幅度'
            },
            jitterAmplitudeMax: {
              label: '最大抖動幅度'
            },
            jitterFrequency: {
              label: '抖動頻率'
            },
            randomJitterFrequency: {
              label: '隨機抖動頻率'
            },
            jitterFrequencyMin: {
              label: '最小抖動頻率'
            },
            jitterFrequencyMax: {
              label: '最大抖動頻率'
            }
          },
          outputs: {
            endX: {
              label: '最終 X',
              description: '移動結束時的 X 座標'
            },
            endY: {
              label: '最終 Y',
              description: '移動結束時的 Y 座標'
            },
            path: {
              label: '軌跡點集',
              description: '完整移動軌跡座標陣列'
            }
          }
        }
      },
      scroll: {
        toPosition: {
          title: '捲動到位置',
          description: '捲動到指定座標或元素',
          fields: {
            mode: {
              label: '捲動目標',
              options: {
                position: '座標位置',
                element: '目標元素'
              }
            },
            x: {
              label: '目標 X'
            },
            y: {
              label: '目標 Y'
            },
            behavior: {
              label: '捲動行為',
              options: {
                auto: '自動',
                smooth: '平滑'
              }
            },
            randomOffset: {
              label: '啟用隨機偏移'
            },
            offsetMin: {
              label: '最小偏移'
            },
            offsetMax: {
              label: '最大偏移'
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        intoView: {
          title: '捲動進入視野',
          description: '讓元素進入可見區域',
          fields: {
            behavior: {
              label: '捲動行為',
              options: {
                auto: '自動',
                smooth: '平滑'
              }
            },
            block: {
              label: '垂直對齊'
            },
            inline: {
              label: '水平對齊'
            },
            alignOptions: {
              start: '起點',
              center: '置中',
              end: '終點',
              nearest: '最近'
            },
            ensureVisible: {
              label: '確保最終可見'
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          }
        },
        infinite: {
          title: '無限捲動',
          description: '循環捲動載入更多內容',
          fields: {
            maxIterations: {
              label: '最大捲動輪次'
            },
            stepPx: {
              label: '每次捲動像素'
            },
            intervalMs: {
              label: '捲動間隔毫秒'
            },
            behavior: {
              label: '捲動行為',
              options: {
                auto: '自動',
                smooth: '平滑'
              }
            },
            stopWhenNoChange: {
              label: '內容不變時提前停止'
            },
            maxNoChangeCount: {
              label: '最大無變化次數'
            }
          },
          outputs: {
            iterationCount: {
              label: '實際捲動輪次',
              description: '本次執行完成時的捲動次數'
            }
          }
        }
      },
      extract: {
        getText: {
          title: '取得文字',
          description: '取得元素文字內容',
          fields: {
            textMode: {
              label: '文字來源',
              options: {
                innerText: 'innerText（可見文字）',
                textContent: 'textContent（原始文字）'
              }
            },
            trim: {
              label: '去除前後空白'
            },
            normalizeWhitespace: {
              label: '壓縮連續空白'
            }
          },
          outputs: {
            text: {
              label: '文字結果',
              description: '提取到的文字內容'
            },
            lengthDescription: '文字長度',
            existsDescription: '文字是否存在且非空'
          }
        },
        getAttribute: {
          title: '取得屬性',
          description: '取得元素指定屬性',
          fields: {
            attributeName: {
              label: '屬性名稱',
              placeholder: '例如 href / src / data-id'
            },
            commonAttribute: {
              label: '常見屬性',
              options: {
                custom: '自訂輸入'
              }
            },
            defaultValue: {
              label: '預設值',
              placeholder: '屬性缺失時回傳此值（可留空）'
            }
          },
          outputs: {
            value: {
              label: '屬性值',
              description: '提取到的屬性值'
            },
            existsDescription: '屬性是否存在'
          }
        },
        getHtml: {
          title: '取得 HTML',
          description: '取得 innerHTML 或 outerHTML',
          fields: {
            htmlType: {
              label: 'HTML 類型',
              options: {
                outerHTML: 'outerHTML（含自身標籤）',
                innerHTML: 'innerHTML（僅內部內容）'
              }
            },
            normalizeWhitespace: {
              label: '壓縮連續空白'
            }
          },
          outputs: {
            html: {
              label: 'HTML 結果',
              description: '提取到的 HTML 字串'
            },
            lengthDescription: 'HTML 字串長度'
          }
        },
        getValue: {
          title: '取得值',
          description: '取得表單元素的值',
          fields: {
            valueType: {
              label: '值類型',
              options: {
                value: 'value（輸入值）',
                checked: 'checked（勾選狀態）',
                text: 'text（文字內容）'
              }
            },
            trim: {
              label: '去除前後空白'
            },
            parseNumber: {
              label: '嘗試解析為數字'
            }
          },
          outputs: {
            value: {
              label: '原始結果',
              description: '依所選類型提取的原始結果'
            },
            stringValue: {
              label: '字串結果',
              description: '字串形式結果'
            },
            numberValue: {
              label: '數字結果',
              description: '數字解析結果'
            }
          }
        },
        queryElement: {
          title: '元素選擇器（單個）',
          description: '透過選擇器定位並輸出單一元素',
          pinDescriptions: {
            element: '查詢到的單一元素物件',
            exists: '是否查詢到元素'
          }
        },
        queryAllElements: {
          title: '元素選擇器（多個）',
          description: '透過選擇器定位並輸出元素列表',
          pinDescriptions: {
            elements: '匹配到的元素陣列',
            length: '匹配到的元素數量'
          }
        },
        queryBlocked: {
          title: '頁面攔截判斷',
          description: '偵測目前頁面是否進入 Cloudflare 等攔截驗證頁並輸出布林值',
          fields: {
            mode: {
              label: '攔截方式',
              options: {
                auto: '自動識別',
                cloudflare: 'Cloudflare 攔截'
              }
            }
          },
          pinDescriptions: {
            blocked: '是否偵測到攔截頁面'
          }
        },
        executeScript: {
          title: '執行腳本',
          description: '執行自訂 JS 並回傳結果',
          pinDescriptions: {
            script: '腳本文字輸入（覆蓋下方編輯內容）',
            result: '腳本回傳結果',
            resultArray: '當結果是陣列時可直接接入迴圈/長度節點',
            resultLength: '當結果是陣列或字串時的長度'
          },
          fields: {
            script: {
              label: 'JavaScript 腳本',
              placeholder: '例如：return document.title;'
            }
          }
        }
      },
      http: {
        request: {
          title: 'HTTP 請求',
          description: '傳送 GET / POST 等純 HTTP 請求',
          fields: {
            method: {
              label: '請求方法'
            },
            url: {
              label: '請求 URL',
              placeholder: '例如 https://api.example.com/v1/items'
            },
            query: {
              label: '查詢參數',
              placeholder: '例如：page=1&size=20',
              form: {
                keyPlaceholder: '參數名稱',
                valuePlaceholder: '參數值',
                add: '新增參數',
                remove: '刪除'
              }
            },
            headers: {
              label: '請求標頭',
              placeholder: '例如：Authorization: Bearer xxx',
              form: {
                keyPlaceholder: '標頭名稱',
                valuePlaceholder: '標頭值',
                add: '新增標頭',
                remove: '刪除'
              },
              presets: {
                authorizationBearer: '常用：Authorization Bearer',
                contentTypeJson: '常用：Content-Type JSON',
                contentTypeFormUrlencoded: '常用：Content-Type 表單',
                acceptJson: '常用：Accept JSON',
                acceptLanguageZhCn: '常用：Accept-Language 中文',
                cacheControlNoCache: '常用：Cache-Control 禁快取',
                xRequestedWith: '常用：X-Requested-With Ajax',
                userAgentBrowser: '常用：User-Agent 瀏覽器'
              }
            },
            referer: {
              label: 'Referer',
              placeholder: '例如 https://www.example.com/list'
            },
            cookie: {
              label: 'Cookie 字串',
              placeholder: '例如 session_id=abc123; theme=dark'
            },
            bodyType: {
              label: '請求體類型',
              options: {
                none: '無',
                json: 'JSON',
                form: 'Form',
                text: 'Text'
              }
            },
            body: {
              label: '請求體',
              placeholder: '依所選請求體類型填寫內容',
              jsonInvalid: 'JSON 格式不合法，請檢查後再試',
              actions: {
                validate: '校驗 JSON',
                format: '格式化 JSON'
              },
              form: {
                keyPlaceholder: '參數名稱',
                valuePlaceholder: '參數值',
                add: '新增參數',
                remove: '刪除'
              }
            },
            timeoutMs: {
              label: '逾時毫秒'
            },
            retryCount: {
              label: '重試次數'
            },
            followRedirect: {
              label: '跟隨重新導向'
            }
          },
          outputs: {
            response: {
              label: '回應結果',
              description: '回應主體資料'
            },
            statusCode: {
              label: '狀態碼',
              description: 'HTTP 狀態碼'
            },
            ok: {
              label: '是否成功',
              description: '回應是否為 2xx'
            },
            headers: {
              label: '回應標頭',
              description: '回應標頭物件'
            }
          }
        },
        getCookies: {
          title: '取得 Cookies',
          description: '取得目前 Cookies',
          fields: {
            scope: {
              label: '取得範圍',
              options: {
                current: '目前頁面',
                domain: '指定網域',
                all: '全部'
              }
            },
            domain: {
              label: '網域',
              placeholder: '例如 example.com'
            },
            path: {
              label: '路徑',
              placeholder: '例如 /account'
            },
            includeHttpOnly: {
              label: '包含 HttpOnly'
            },
            includeSessionOnly: {
              label: '包含 Session Cookie'
            },
            asString: {
              label: '輸出為字串'
            },
            timeoutMs: {
              label: '逾時毫秒'
            }
          },
          inputs: {
            contextDescription: '上游上下文可包含頁面、網域或目前工作階段資訊'
          },
          outputs: {
            cookies: {
              label: 'Cookies 清單',
              description: 'Cookie 物件清單'
            },
            cookieString: {
              label: 'Cookie 字串',
              description: '以分號串接的 Cookie 字串'
            },
            count: {
              label: '數量',
              description: 'Cookie 數量'
            }
          }
        },
        setCookies: {
          title: '設定 Cookies',
          description: '設定或更新 Cookies',
          inputs: {
            cookieDescription: '上游輸入單條 Cookie 字串時可直接覆蓋編輯區內容'
          },
          fields: {
            mode: {
              label: '編輯方式',
              options: {
                single: '單字串',
                pairs: '多條 Cookie'
              }
            },
            cookie: {
              label: 'Cookie 字串',
              placeholder: '例如 session_id=abc123; theme=dark'
            },
            pairs: {
              label: 'Cookie 清單',
              nameLabel: 'Cookie 名稱',
              namePlaceholder: 'Cookie 名稱',
              valueLabel: 'Cookie 值',
              valuePlaceholder: 'Cookie 值',
              domainLabel: '網域',
              domainPlaceholder: '例如 example.com',
              pathLabel: '路徑',
              pathPlaceholder: '例如 /',
              add: '新增 Cookie',
              remove: '刪除',
              preset: {
                httpOnly: 'HttpOnly',
                secure: 'Secure',
                domain: 'Domain',
                path: 'Path',
                maxAge: 'Max-Age'
              }
            },
            scope: {
              label: '作用範圍',
              options: {
                current: '目前頁面',
                domain: '指定網域',
                all: '全部'
              }
            },
            domain: {
              label: '網域',
              placeholder: '例如 example.com'
            },
            path: {
              label: '路徑',
              placeholder: '例如 /'
            },
            sameSite: {
              label: 'SameSite',
              options: {
                lax: 'Lax',
                strict: 'Strict',
                none: 'None'
              }
            },
            expiresAt: {
              label: '到期時間',
              placeholder: '請選擇日期和時間'
            },
            flags: {
              label: '附加屬性'
            },
            httpOnly: {
              label: 'HttpOnly'
            },
            secure: {
              label: 'Secure'
            },
            persistent: {
              label: '持久化'
            }
          }
        }
      },
      system: {
        screenSize: {
          title: '取得螢幕尺寸',
          description: '取得系統螢幕寬高',
          outputs: {
            width: {
              label: '螢幕寬度',
              description: '系統螢幕寬度（像素）'
            },
            height: {
              label: '螢幕高度',
              description: '系統螢幕高度（像素）'
            },
            size: {
              label: '螢幕尺寸物件',
              description: '包含寬高的螢幕尺寸物件'
            }
          }
        },
        windowSize: {
          title: '取得視窗尺寸',
          description: '取得 WebView 視窗尺寸',
          outputs: {
            width: {
              label: '視窗寬度',
              description: 'WebView 視窗寬度（像素）'
            },
            height: {
              label: '視窗高度',
              description: 'WebView 視窗高度（像素）'
            },
            size: {
              label: '視窗尺寸物件',
              description: '包含寬高的視窗尺寸物件'
            }
          }
        },
        mousePosition: {
          title: '取得滑鼠位置',
          description: '取得滑鼠在 WebView 與螢幕中的座標',
          fields: {
            outputScope: {
              label: '輸出座標範圍',
              options: {
                both: '同時輸出 WebView + 螢幕',
                webview: '僅 WebView 座標',
                screen: '僅螢幕座標'
              }
            }
          },
          outputs: {
            webviewX: {
              label: 'WebView X',
              description: '滑鼠相對 WebView 左上角的 X 座標'
            },
            webviewY: {
              label: 'WebView Y',
              description: '滑鼠相對 WebView 左上角的 Y 座標'
            },
            screenX: {
              label: '螢幕 X',
              description: '滑鼠相對螢幕左上角的 X 座標'
            },
            screenY: {
              label: '螢幕 Y',
              description: '滑鼠相對螢幕左上角的 Y 座標'
            },
            webviewPoint: {
              label: 'WebView 座標物件',
              description: '包含 WebView 相對座標的物件'
            },
            screenPoint: {
              label: '螢幕座標物件',
              description: '包含螢幕絕對座標的物件'
            }
          }
        },
        elementPosition: {
          title: '取得元素位置',
          description: '取得元素在 WebView 與螢幕中的座標位置',
          fields: {
            anchorPoint: {
              label: '錨點',
              options: {
                topLeft: '左上角',
                center: '中心點'
              }
            },
            outputScope: {
              label: '輸出座標範圍',
              options: {
                both: '同時輸出 WebView + 螢幕',
                webview: '僅 WebView 座標',
                screen: '僅螢幕座標'
              }
            }
          },
          outputs: {
            exists: {
              label: '元素存在',
              description: '是否匹配到目標元素'
            },
            webviewX: {
              label: 'WebView X',
              description: '元素在 WebView 中的 X 座標'
            },
            webviewY: {
              label: 'WebView Y',
              description: '元素在 WebView 中的 Y 座標'
            },
            screenX: {
              label: '螢幕 X',
              description: '元素在螢幕中的 X 座標'
            },
            screenY: {
              label: '螢幕 Y',
              description: '元素在螢幕中的 Y 座標'
            },
            rectWebview: {
              label: 'WebView 矩形',
              description: '元素在 WebView 中的矩形物件'
            },
            rectScreen: {
              label: '螢幕矩形',
              description: '元素在螢幕中的矩形物件'
            }
          }
        },
        readClipboard: {
          title: '讀取剪貼簿',
          description: '讀取系統剪貼簿內容',
          outputs: {
            text: {
              label: '剪貼簿文字',
              description: '讀取到的剪貼簿文字內容'
            },
            length: {
              label: '文字長度',
              description: '剪貼簿文字長度'
            },
            hasText: {
              label: '是否有文字',
              description: '剪貼簿是否包含文字內容'
            }
          }
        },
        writeClipboard: {
          title: '寫入剪貼簿',
          description: '寫入內容到系統剪貼簿',
          inputs: {
            text: {
              label: '輸入文字',
              description: '上游輸入的文字會直接寫入剪貼簿'
            }
          },
          fields: {
            text: {
              label: '寫入文字',
              placeholder: '請輸入要寫入剪貼簿的文字'
            }
          },
          outputs: {
            text: {
              label: '已寫入文字',
              description: '本次寫入剪貼簿的文字內容'
            }
          }
        }
      },
      variable: {
        common: {
          dataTypes: {
            string: '文字',
            number: '數字',
            boolean: '布林',
            array: '陣列',
            object: '物件'
          }
        },
        set: {
          title: '設定變數',
          description: '定義並輸出目前畫布共用變數',
          empty: {
            title: '還沒有定義任何變數',
            description: '新增變數後，每個變數都會擁有獨立的輸入引腳與輸出引腳。',
            action: '新增第一個變數'
          },
          inputs: {
            value: {
              label: '輸入值',
              description: '上游輸入會覆蓋目前變數的預設值'
            }
          },
          outputs: {
            value: {
              label: '變數值',
              description: '輸出目前變數的最新值'
            }
          },
          fields: {
            name: {
              label: '變數名稱',
              placeholder: '例如：username'
            },
            type: {
              label: '資料類型'
            },
            defaultValue: {
              label: '預設值',
              stringPlaceholder: '請輸入預設文字',
              jsonPlaceholder: '請輸入合法 JSON 預設值'
            },
            connectedHint: {
              label: '已連接上游輸入，執行時會優先使用輸入值。',
              description: '目前變數在執行時會優先使用輸入引腳，不會使用預設值。'
            }
          },
          actions: {
            add: '新增變數'
          },
          dialogs: {
            changeType: {
              title: '確認修改變數類型',
              description: '變數「{name}」目前已有 {count} 條關聯連線。修改類型後這些連線會被斷開，是否繼續？',
              confirm: '確認修改',
              cancel: '取消'
            }
          },
          validations: {
            nameRequired: '變數名稱不能為空',
            nameDuplicate: '此變數名稱已在目前畫布中定義',
            arrayInvalid: '預設值必須是合法的陣列 JSON',
            objectInvalid: '預設值必須是合法的物件 JSON'
          }
        },
        get: {
          title: '取得變數',
          description: '選擇目前畫布已定義變數並輸出對應值',
          empty: {
            title: '目前畫布還沒有可讀取的變數',
            description: '請先放置一個「設定變數」節點並定義變數。'
          },
          fields: {
            variables: {
              label: '選擇變數',
              placeholder: '請選擇已定義變數',
              description: '支援多選；不同變數會生成不同類型的輸出引腳。'
            }
          },
          inputs: {
            value: {
              description: '輸入會覆蓋所選變數的目前值（{type}）'
            }
          },
          outputs: {
            value: {
              description: '輸出所選變數的目前值（{type}）'
            }
          }
        }
      },
      constant: {
        get: {
          title: '常量',
          description: '輸出系統預設常量值',
          pinDescriptions: {
            constantKey: '常量鍵輸入'
          },
          outputs: {
            value: {
              description: '目前常量對應的值'
            },
            constantKey: {
              label: '常量鍵',
              description: '目前命中的常量鍵名稱'
            }
          },
          fields: {
            constantKey: {
              label: '常量鍵',
              options: {
                attachmentDir: '附件目錄（attachmentDir）'
              }
            }
          }
        }
      },
      logic: {
        equal: {
          title: '等於',
          description: '判斷兩個值是否相等',
          pinDescriptions: {
            operand: '比較值 {label}',
            result: '比較結果'
          }
        },
        notEqual: {
          title: '不等於',
          description: '判斷兩個值是否不相等',
          pinDescriptions: {
            operand: '比較值 {label}',
            result: '比較結果'
          }
        },
        greaterThan: {
          title: '大於',
          description: '判斷 a > b',
          pinDescriptions: {
            valueA: '數值 A',
            valueB: '數值 B',
            result: '比較結果'
          }
        },
        lessThan: {
          title: '小於',
          description: '判斷 a < b',
          pinDescriptions: {
            valueA: '數值 A',
            valueB: '數值 B',
            result: '比較結果'
          }
        },
        greaterThanOrEqual: {
          title: '大於等於',
          description: '判斷 a ≥ b',
          pinDescriptions: {
            valueA: '數值 A',
            valueB: '數值 B',
            result: '比較結果'
          }
        },
        lessThanOrEqual: {
          title: '小於等於',
          description: '判斷 a ≤ b',
          pinDescriptions: {
            valueA: '數值 A',
            valueB: '數值 B',
            result: '比較結果'
          }
        },
        and: {
          title: 'AND',
          description: '邏輯與（兩個布林值）',
          pinDescriptions: {
            valueA: '布林值 A',
            valueB: '布林值 B',
            result: '邏輯運算結果'
          }
        },
        or: {
          title: 'OR',
          description: '邏輯或（兩個布林值）',
          pinDescriptions: {
            valueA: '布林值 A',
            valueB: '布林值 B',
            result: '邏輯運算結果'
          }
        },
        not: {
          title: 'NOT',
          description: '邏輯非（取反）',
          pinDescriptions: {
            value: '布林值輸入',
            result: '邏輯運算結果'
          }
        },
        isEmpty: {
          title: '是否為空',
          description: '判斷值是否為空（null/undefined/空字串/空陣列）',
          pinDescriptions: {
            value: '待檢測值',
            result: '檢測結果'
          }
        },
        exists: {
          title: '是否存在',
          description: '判斷值是否存在（非 null/undefined）',
          pinDescriptions: {
            value: '待檢測值',
            result: '檢測結果'
          }
        }
      },
      math: {
        add: {
          title: '加法',
          description: '兩個數值相加',
          pinDescriptions: {
            operand: '加數 {label}',
            result: '加法結果'
          }
        },
        subtract: {
          title: '減法',
          description: '兩個數值相減',
          pinDescriptions: {
            operand: '減數 {label}',
            result: '減法結果'
          }
        },
        multiply: {
          title: '乘法',
          description: '兩個數值相乘',
          pinDescriptions: {
            operand: '乘數 {label}',
            result: '乘法結果'
          }
        },
        divide: {
          title: '除法',
          description: '兩個數值相除',
          pinDescriptions: {
            operand: '除數 {label}',
            result: '除法結果'
          }
        },
        round: {
          title: '取整',
          description: '向下、向上或四捨五入取整',
          pinDescriptions: {
            input: '待取整數值',
            result: '取整結果'
          },
          fields: {
            mode: {
              label: '取整模式',
              options: {
                round: '四捨五入',
                ceil: '向上取整',
                floor: '向下取整'
              }
            }
          }
        },
        random: {
          title: '隨機數',
          description: '產生指定範圍隨機數',
          pinDescriptions: {
            min: '隨機下限',
            max: '隨機上限',
            result: '隨機數結果'
          },
          fields: {
            numberType: {
              label: '隨機類型',
              options: {
                float: '隨機小數',
                integer: '隨機整數'
              }
            },
            intervalType: {
              label: '區間類型',
              options: {
                leftClosedRightOpen: '[min, max)',
                leftOpenRightClosed: '(min, max]',
                open: '(min, max)',
                closed: '[min, max]'
              },
              descriptions: {
                leftClosedRightOpen: '包含最小值，不包含最大值',
                leftOpenRightClosed: '不包含最小值，包含最大值',
                open: '最小值與最大值都不包含',
                closed: '最小值與最大值都包含'
              }
            },
            min: {
              label: '最小值（min）'
            },
            max: {
              label: '最大值（max）'
            }
          }
        },
        absolute: {
          title: '絕對值',
          description: '取得數值的絕對值',
          pinDescriptions: {
            input: '待求絕對值數值',
            result: '絕對值結果'
          }
        },
        modulo: {
          title: '求餘',
          description: '執行取模運算',
          pinDescriptions: {
            valueA: '被取模數 A',
            valueB: '模數 B',
            result: '取模結果'
          }
        },
        power: {
          title: '冪運算',
          description: '計算 a 的 b 次方',
          pinDescriptions: {
            base: '底數',
            exp: '指數',
            result: '冪運算結果'
          }
        }
      },
      string: {
        common: {
          connectedInputHint: '已連接輸入，使用連線值'
        },
        substring: {
          title: '截取子字符串',
          description: '從文字中截取指定位置的子字符串',
          pinDescriptions: {
            text: '待截取的文字',
            start: '起始位置（0開始）',
            length: '截取長度',
            result: '截取結果'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入原始文字'
            },
            start: {
              label: '起始位置'
            },
            length: {
              label: '截取長度'
            }
          }
        },
        replace: {
          title: '替換文字',
          description: '在文字中查找並替換指定內容（全部替換）',
          pinDescriptions: {
            text: '源文字',
            search: '查找字符串（全部替換）',
            replacement: '替換為',
            result: '替換結果'
          },
          fields: {
            text: {
              label: '源文字',
              placeholder: '輸入源文字'
            },
            search: {
              label: '查找',
              placeholder: '輸入要查找的文字'
            },
            replacement: {
              label: '替換為',
              placeholder: '輸入替換內容'
            }
          }
        },
        concat: {
          title: '拼接文字',
          description: '將多個文字段拼接為一個',
          pinDescriptions: {
            segment: '文字段 {label}',
            result: '拼接結果'
          },
          fields: {
            segment: {
              label: '文字 {label}',
              placeholder: '文字段 {label}',
              count: '{count}段'
            }
          }
        },
        regexMatch: {
          title: '正則匹配',
          description: '使用正則表達式從文字中提取匹配內容',
          pinDescriptions: {
            text: '待匹配的文字',
            pattern: '正則表達式模式',
            flags: '標誌(g/i/m等)',
            result: '匹配結果陣列'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入待匹配的文字'
            },
            pattern: {
              label: '正則模式',
              placeholder: '輸入正則表達式（如 \\d+）'
            },
            flags: {
              label: '標誌',
              placeholder: '輸入標誌（如 g、i、m）'
            }
          }
        },
        regexReplace: {
          title: '正則替換',
          description: '使用正則表達式查找並替換文字內容',
          pinDescriptions: {
            text: '源文字',
            pattern: '正則表達式模式',
            replacement: '替換為（可用捕獲組）',
            flags: '標誌(g/i/m等)',
            result: '替換結果'
          },
          fields: {
            text: {
              label: '源文字',
              placeholder: '輸入源文字'
            },
            pattern: {
              label: '正則模式',
              placeholder: '輸入正則表達式'
            },
            replacement: {
              label: '替換為',
              placeholder: '輸入替換內容（可使用捕獲組 $1、$2 等）'
            },
            flags: {
              label: '標誌',
              placeholder: '輸入標誌（如 g、i、m）'
            }
          }
        },
        split: {
          title: '分割文字',
          description: '按分割符將文字分割為陣列',
          pinDescriptions: {
            text: '待分割的文字',
            separator: '分割符',
            result: '分割結果陣列'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入待分割的文字'
            },
            separator: {
              label: '分割符',
              placeholder: '輸入分割符（如 , 或 |）'
            }
          }
        },
        length: {
          title: '計算長度',
          description: '獲取文字的字符長度',
          pinDescriptions: {
            text: '待計算長度的文字',
            result: '文字長度（字符數）'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入待計算長度的文字'
            }
          }
        },
        uppercase: {
          title: '大寫轉換',
          description: '將文字轉換為大寫',
          pinDescriptions: {
            text: '待轉大寫的文字',
            result: '大寫結果'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入待轉大寫的文字'
            }
          }
        },
        lowercase: {
          title: '小寫轉換',
          description: '將文字轉換為小寫',
          pinDescriptions: {
            text: '待轉小寫的文字',
            result: '小寫結果'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入待轉小寫的文字'
            }
          }
        },
        trim: {
          title: '去空白',
          description: '從文字中移除空白字符',
          pinDescriptions: {
            text: '待去空白的文字',
            result: '去空白結果'
          },
          fields: {
            text: {
              label: '文字',
              placeholder: '輸入待去空白的文字'
            },
            direction: {
              label: '去空白方向'
            },
            whitespaceTypes: {
              label: '空白類型'
            }
          },
          options: {
            directionBoth: '兩頭（前後）',
            directionStart: '開始（前）',
            directionEnd: '結束（後）',
            directionAll: '所有（全部）',
            whitespaceSpace: '空格',
            whitespaceTab: '製表符',
            whitespaceNewline: '換行符',
            whitespaceCarriageReturn: '回車符',
            whitespaceVerticalTab: '垂直製表符',
            whitespaceFormFeed: '換頁符'
          }
        }
      },
      dateTime: {
        now: {
          title: '目前時間',
          description: '產生目前時間並輸出多種格式',
          pinDescriptions: {
            outputMode: '輸出模式輸入'
          },
          outputs: {
            iso: {
              label: 'UTC ISO',
              description: 'UTC ISO 8601 字串'
            },
            timestamp: {
              label: '時間戳',
              description: 'Unix 時間戳（毫秒）'
            },
            mode: {
              label: '輸出模式',
              description: '目前啟用的輸出模式'
            }
          },
          fields: {
            outputMode: {
              label: '輸出模式',
              options: {
                isoUtc: 'UTC ISO 字串',
                timestampMs: '毫秒時間戳'
              }
            }
          }
        },
        format: {
          title: '日期時間格式化',
          description: '將時間值依指定格式輸出',
          pinDescriptions: {
            value: '待格式化的時間值',
            sourceMode: '來源模式輸入',
            formatPattern: '格式樣板輸入'
          },
          outputs: {
            formatted: {
              label: '格式結果',
              description: '依樣板格式化後的時間字串'
            },
            sourceMode: {
              label: '來源模式',
              description: '目前使用的來源模式'
            }
          },
          fields: {
            sourceMode: {
              label: '來源',
              options: {
                current: '目前時間',
                input: '輸入值'
              }
            },
            formatPattern: {
              label: '格式樣板',
              placeholder: '例如 YYYY-MM-DD HH:mm:ss'
            }
          }
        }
      },
      arrayObject: {
        filter: {
          title: '資料過濾',
          description: '過濾陣列',
          pinLabels: {
            removed: '移除數'
          },
          pinDescriptions: {
            array: '輸入待過濾的陣列資料',
            path: '可選：輸入物件欄位路徑（用於按欄位過濾）',
            result: '過濾後的陣列結果',
            removed: '被移除的資料項數量'
          },
          fields: {
            mode: {
              label: '過濾模式'
            },
            path: {
              label: '過濾路徑',
              placeholder: '可選：輸入物件欄位路徑，例如 data.value'
            }
          },
          options: {
            modeTruthy: '保留真值項',
            modeNonEmpty: '移除空值項',
            modeDistinct: '去重（按序）'
          }
        },
        merge: {
          title: '資料合併',
          description: '合併多個資料來源',
          pinDescriptions: {
            source: '輸入資料來源 {label}',
            result: '合併後的結果（陣列或物件）'
          },
          fields: {
            mode: {
              label: '合併模式'
            },
            source: {
              label: '資料來源 {label}',
              placeholder: '可選：輸入 JSON 資料來源（如陣列或物件）',
              count: '{count} 個資料來源'
            }
          },
          options: {
            modeSmart: '智慧合併（自動判斷）',
            modeArrayConcat: '陣列串接',
            modeObjectAssign: '物件覆蓋（後者優先）'
          }
        },
        split: {
          title: '資料拆分',
          description: '將資料拆分成多路',
          pinLabels: {
            size: '分塊',
            chunks: '分塊陣列',
            first: '首項',
            rest: '剩餘項'
          },
          pinDescriptions: {
            array: '輸入待拆分的陣列資料',
            size: '輸入每塊大小（可覆蓋面板設定）',
            chunks: '依分塊大小切分後的陣列結果',
            first: '陣列首項資料',
            rest: '除首項外的剩餘陣列'
          },
          fields: {
            size: {
              label: '分塊大小'
            }
          }
        },
        length: {
          title: '陣列長度',
          description: '取得陣列長度',
          pinDescriptions: {
            array: '輸入陣列並輸出長度',
            length: '陣列長度'
          }
        },
        item: {
          title: '陣列索引',
          description: '取得陣列指定索引的值',
          pinDescriptions: {
            array: '輸入陣列',
            index: '輸入索引（可覆蓋面板中的預設索引）',
            item: '索引對應的資料項',
            exists: '該索引是否存在'
          },
          fields: {
            index: {
              label: '索引',
              placeholder: '輸入要讀取的陣列索引'
            }
          }
        }
      },
      typeConvert: {
        string: {
          title: '轉字串',
          description: '轉換為字串型別',
          hint: '將任意型別的資料轉換為字串表示',
          inputs: {
            input: {
              description: '待轉換的資料（任意型別）'
            }
          },
          outputs: {
            result: {
              description: '轉換後的字串'
            }
          },
          fields: {
            treatNullAsEmpty: {
              label: '將 null 視為空字串'
            }
          }
        },
        number: {
          title: '轉數字',
          description: '轉換為數字型別',
          hint: '將任意型別的資料轉換為數字，轉換失敗時返回預設值',
          inputs: {
            input: {
              description: '待轉換的資料（任意型別）'
            }
          },
          outputs: {
            result: {
              description: '轉換後的數字'
            }
          },
          fields: {
            defaultValue: {
              label: '預設值（轉換失敗時）'
            }
          }
        },
        boolean: {
          title: '轉布林',
          description: '轉換為布林型別',
          hint: '將任意型別的資料根據自訂規則轉換為布林值',
          inputs: {
            input: {
              description: '待轉換的資料（任意型別）'
            }
          },
          outputs: {
            result: {
              description: '轉換後的布林值'
            }
          },
          fields: {
            truthyValues: {
              label: '真值列表（逗號分隔）',
              placeholder: 'true,1,"yes","on"'
            }
          }
        },
        json: {
          title: '轉 JSON',
          description: '轉換為 JSON 字串',
          hint: '將任意型別的資料序列化為 JSON 字串',
          inputs: {
            input: {
              description: '待轉換的資料（任意型別）'
            }
          },
          outputs: {
            result: {
              description: '序列化後的 JSON 字串'
            },
            message: {
              description: '轉換失敗時的錯誤訊息'
            }
          },
          fields: {
            indent: {
              label: '縮排寬度（0 為無縮排）'
            },
            handleCircular: {
              label: '處理循環參考'
            }
          }
        },
        parseJson: {
          title: '解析 JSON',
          description: '解析 JSON 字串',
          hint: '將 JSON 字串反序列化為資料物件，失敗時返回備選值',
          inputs: {
            input: {
              description: '待解析的 JSON 字串'
            }
          },
          outputs: {
            result: {
              description: '解析後的資料物件'
            },
            message: {
              description: '解析失敗時的錯誤訊息'
            }
          },
          fields: {
            fallbackValue: {
              label: '備選值（解析失敗時）',
              placeholder: 'null'
            }
          }
        }
      },
      controlFlow: {
        loop: {
          title: '迴圈',
          description: 'ForEach / While 迴圈',
          pinDescriptions: {
            array: 'ForEach 模式的迴圈陣列輸入',
            condition: 'While 模式的持續條件輸入',
            mode: '迴圈模式輸入（forEach / while）',
            limitIterations: '是否限制最大迴圈次數',
            maxIterations: '最大迴圈次數輸入',
            breakOnError: '發生錯誤時是否中斷'
          },
          outputs: {
            item: {
              description: '目前迴圈項目'
            },
            index: {
              label: '索引',
              description: '目前迴圈索引'
            }
          },
          fields: {
            mode: {
              label: '迴圈模式',
              options: {
                forEach: 'ForEach（逐項遍歷陣列）',
                while: 'While（依條件迴圈）'
              }
            },
            maxIterations: {
              label: '最大迴圈次數'
            },
            limitIterations: {
              label: '限制最大迴圈次數',
              switchLabel: '啟用限制',
              unlimited: '不限制'
            },
            breakOnError: {
              label: '發生錯誤時中斷'
            }
          }
        },
        condition: {
          title: '條件判斷',
          description: 'If / Else 分支',
          pinDescriptions: {
            condition: '布林條件輸入（boolean 模式）',
            valueA: '比較值 A（compare 模式）',
            valueB: '比較值 B（compare 模式）',
            mode: '條件模式輸入（boolean / compare）',
            strictCompare: '是否啟用嚴格比較'
          },
          outputs: {
            true: {
              label: 'True 分支',
              description: '條件命中 true 時輸出'
            },
            false: {
              label: 'False 分支',
              description: '條件命中 false 時輸出'
            }
          },
          fields: {
            mode: {
              label: '條件模式',
              options: {
                boolean: '布林模式（直接讀取布林輸入）',
                compare: '比較模式（比較 A 與 B）'
              }
            },
            strictCompare: {
              label: '嚴格比較（===）'
            }
          }
        },
        switch: {
          title: '多路分支',
          description: 'Switch 多分支',
          pinDescriptions: {
            value: '待比對的輸入值',
            matchMode: '比對模式輸入（strict / loose）',
            cases: '分支清單輸入（逐行）',
            useDefaultBranch: '是否啟用預設分支'
          },
          outputs: {
            case: {
              description: '命中分支 {label} 時輸出'
            },
            default: {
              label: '預設分支',
              description: '所有分支皆未命中時輸出'
            }
          },
          fields: {
            matchMode: {
              label: '比對模式',
              options: {
                strict: '嚴格比對（===）',
                loose: '寬鬆比對（==）'
              }
            },
            cases: {
              label: '分支清單（每行一個）',
              placeholder: 'case_1\ncase_2'
            },
            useDefaultBranch: {
              label: '啟用預設分支'
            }
          }
        }
      },
      output: {
        saveData: {
          title: '保存資料',
          description: '將資料保存到指定類型的資源池',
          pinDescriptions: {
            value: '待保存的資料值',
            saveType: '保存類型輸入'
          },
          outputs: {
            savedType: {
              label: '保存類型',
              description: '本次實際保存的類型'
            }
          },
          fields: {
            saveType: {
              label: '保存類型',
              options: {
                music: '音樂',
                image: '圖片'
              }
            }
          }
        },
        printLog: {
          title: '列印日誌',
          description: '輸出除錯資訊',
          pinDescriptions: {
            value: '要輸出的日誌值',
            level: '日誌等級輸入',
            template: '日誌模板輸入'
          },
          fields: {
            level: {
              label: '日誌等級',
              options: {
                debug: '偵錯',
                info: '資訊',
                warn: '警告',
                error: '錯誤'
              }
            },
            template: {
              label: '日誌模板',
              placeholder: '例如：[crawler] 目前值：${value}'
            }
          }
        },
        screenshot: {
          title: '截圖',
          description: '擷取頁面或元素',
          pinDescriptions: {
            element: '目標元素（element 模式）',
            targetMode: '截圖目標模式輸入',
            path: '截圖保存路徑輸入',
            fullPage: '整頁截圖開關輸入'
          },
          outputs: {
            path: {
              label: '截圖路徑',
              description: '截圖檔案路徑或 URL'
            }
          },
          fields: {
            targetMode: {
              label: '截圖目標',
              options: {
                page: '頁面截圖',
                element: '元素截圖'
              }
            },
            path: {
              label: '儲存路徑',
              placeholder: '例如：/screenshots/news-item.png'
            },
            fullPage: {
              label: '整頁截圖'
            }
          }
        }
      }
    }
  }
};
