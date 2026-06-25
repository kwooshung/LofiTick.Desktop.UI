export const crawler = {
  blueprint: {
    title: '爬虫蓝图',
    groups: {
      navigation: {
        title: '导航与页面控制',
        description: '浏览器页面导航与前进后退'
      },
      wait: {
        title: '等待与同步',
        description: '等待元素、文本、条件或固定时长'
      },
      interaction: {
        title: '交互与输入',
        description: '点击、输入、选择与键盘交互'
      },
      scroll: {
        title: '滚动与视图',
        description: '控制页面滚动与可见区域'
      },
      extract: {
        title: '提取与查询',
        description: '读取文本、属性、HTML 与脚本结果'
      },
      http: {
        title: 'HTTP 请求',
        description: '执行纯 HTTP 请求与 Cookie 处理'
      },
      detect: {
        title: '检测与防护',
        description: '识别验证页与常见防护页面'
      },
      system: {
        title: '系统与窗口',
        description: '读取屏幕、窗口和剪贴板信息'
      },
      variable: {
        title: '数据处理 - 变量',
        description: '保存和读取节点间共享变量'
      },
      constant: {
        title: '数据处理 - 常量',
        description: '读取系统内置常量值'
      },
      logic: {
        title: '数据处理 - 逻辑',
        description: '比较、布尔与空值判断'
      },
      math: {
        title: '数据处理 - 数学',
        description: '基础算术、随机数与取整'
      },
      string: {
        title: '数据处理 - 字符串',
        description: '字符串截取、替换、拼接与正则'
      },
      dateTime: {
        title: '数据处理 - 日期时间',
        description: '处理当前时间与时间戳格式'
      },
      arrayObject: {
        title: '数据处理 - 数组与对象',
        description: '过滤、合并、拆分与索引读取'
      },
      typeConvert: {
        title: '数据处理 - 类型转换',
        description: '字符串、数字、布尔与 JSON 转换'
      },
      controlFlow: {
        title: '控制流',
        description: '循环、条件判断与多路分支'
      },
      output: {
        title: '输出',
        description: '发送、打印与截图类结果输出'
      }
    },
    nodes: {
      common: {
        start: {
          title: '开始',
          description: '爬虫的入口节点，负责触发爬虫的执行',
          form: {
            crawlerTitle: '爬虫标题（必填）',
            crawlerTitlePlaceholder: '请输入爬虫标题',
            crawlerTitleRequired: '爬虫标题不能为空，请先填写后再保存蓝图。',
            crawlerDescription: '爬虫描述',
            crawlerDescriptionPlaceholder: '请输入爬虫描述（可选）'
          }
        },
        end: {
          title: '结束',
          description: '爬虫的结束节点，负责终止爬虫的执行'
        },
        function: {
          start: {
            title: '函数开始',
            suffix: '开始',
            description: '函数逻辑的入口节点，负责接收执行流',
            fields: {
              parameterLabel: '参数',
              parameterDescription: '函数开始节点输出的参数值'
            },
            actions: {
              add: '添加参数'
            },
            empty: {
              title: '还没有参数',
              description: '添加参数后，函数就能从外部接收值。',
              action: '添加参数'
            }
          },
          return: {
            title: '函数返回',
            suffix: '返回值',
            description: '函数逻辑的返回节点，负责结束执行并返回结果',
            fields: {
              returnLabel: '返回值',
              returnDescription: '函数返回节点接收并输出的结果值'
            },
            actions: {
              add: '添加返回值'
            },
            empty: {
              title: '还没有返回值',
              description: '添加返回值后，函数就能把结果传递给调用方。',
              action: '添加返回值'
            }
          },
          pins: {
            connectedHint: '已连接，使用连线值',
            namePlaceholder: '引脚名称',
            stringPlaceholder: '请输入默认值',
            jsonPlaceholder: '请输入 JSON 默认值'
          }
        },
        units: {
          millisecond: '毫秒',
          count: '次',
          item: '项',
          char: '字符',
          pixel: '像素',
          percent: '%',
          indent: '格'
        },
        pinLabels: {
          input: '输入',
          element: '元素',
          elements: '元素列表',
          exists: '存在',
          context: '上下文',
          text: '文本',
          pattern: '模式',
          replacement: '替换',
          search: '查找',
          flags: '标志',
          value: '值',
          a: 'A',
          b: 'B',
          min: '最小值',
          max: '最大值',
          base: '底数',
          exp: '指数',
          start: '起始',
          separator: '分隔符',
          result: '结果',
          matches: '匹配',
          message: '信息',
          array: '数组',
          length: '长度',
          index: '索引',
          item: '数据项'
        },
        connectedInputHint: '已连接输入，使用连线值',
        operandInputLabel: '输入 {label}',
        operandCount: '{count}项',
        selectorInput: {
          mode: {
            options: {
              xpath: 'XPath',
              css: 'CSS'
            }
          },
          invalidHint: '当前选择器与所选类型不匹配，请检查 XPath/CSS 语法。'
        }
      },
      navigation: {
        goto: {
          title: '跳转页面',
          description: '打开指定 URL',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示是否跳转成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            path: {
              label: '目标路径',
              placeholder: '请输入目标路径，例如 /news/123',
              validation: {
                empty: '路径不能为空',
                invalidFormat: '路径应以 "/" 开头，或为完整 URL',
                invalidUrl: 'URL 格式无效',
                invalidTitle: '跳转路径提示',
                extractedTitle: '已自动提取路径',
                extracted: '已从 URL "{domain}" 提取路径：{path}',
                domainMismatch: '域名不匹配：期望 "{expected}"\n，实际 "{actual}"'
              }
            },
            waitReady: {
              label: '等待页面就绪'
            },
            timeoutMs: {
              label: '超时毫秒'
            },
            showWebview: {
              label: '显示 WebView'
            }
          }
        },
        refresh: {
          title: '刷新页面',
          description: '刷新当前页面',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示是否刷新成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            timeoutMs: {
              label: '超时毫秒'
            },
            waitReady: {
              label: '等待页面就绪'
            },
            hardReload: {
              label: '强制刷新'
            }
          }
        },
        back: {
          title: '后退',
          description: '浏览器历史后退',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示是否后退成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            steps: {
              label: '后退步数'
            },
            waitReady: {
              label: '等待页面就绪'
            },
            timeoutMs: {
              label: '超时毫秒'
            },
            allowNoHistory: {
              label: '无历史时忽略错误'
            }
          }
        },
        forward: {
          title: '前进',
          description: '浏览器历史前进',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示是否前进成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            steps: {
              label: '前进步数'
            },
            waitReady: {
              label: '等待页面就绪'
            },
            timeoutMs: {
              label: '超时毫秒'
            },
            allowNoHistory: {
              label: '无历史时忽略错误'
            }
          }
        },
        closePage: {
          title: '关闭页面',
          description: '关闭当前页面会话',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示是否关闭页面成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            endFlowAfterClose: {
              label: '关闭后终止流程'
            }
          }
        }
      },
      wait: {
        element: {
          title: '等待元素',
          description: '等待指定元素出现',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示等待元素是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            selector: {
              label: '元素选择器',
              placeholder: '请输入选择器，例如 .news-item'
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        time: {
          title: '等待时间',
          description: '固定等待指定毫秒数',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示等待时间是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            durationMs: {
              label: '等待毫秒'
            }
          }
        },
        random: {
          title: '随机等待',
          description: '在最小值和最大值之间随机等待',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示随机等待是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
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
          title: '等待加载状态',
          description: '等待页面达到指定加载状态',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示等待加载状态是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            state: {
              label: '加载状态',
              description: '选择等待到哪个加载阶段再继续执行',
              options: {
                load: 'load（页面资源加载完成）',
                domcontentloaded: 'domcontentloaded（DOM 结构就绪）',
                networkidle: 'networkidle（网络请求空闲）'
              }
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        condition: {
          title: '等待条件',
          description: '等待自定义 JS 条件成立',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示等待条件是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            expression: {
              label: '条件表达式',
              description: '请写返回 true/false 的 JS 表达式，表达式结果为 true 时继续流程',
              placeholder: "示例：window.location.href.includes('/news')"
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        text: {
          title: '等待文本',
          description: '等待页面出现指定文本',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示等待文本是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            text: {
              label: '目标文本',
              placeholder: '请输入需要等待出现的文本'
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        delay: {
          title: '延迟',
          description: '纯延迟等待',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: '结果',
            booleanDescription: '表示延迟等待是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            durationMs: {
              label: '延迟毫秒'
            }
          }
        }
      },
      interaction: {
        common: {
          outputs: {
            boolean: '结果',
            booleanDescription: '表示交互执行是否成功',
            message: '信息',
            messageDescription: '失败时的错误信息或异常说明'
          },
          pinDescriptions: {
            elementInput: '由元素查询节点输出的目标元素'
          },
          fields: {
            selector: {
              label: '元素选择器',
              placeholder: '例如：#login-btn 或 .form input[name="email"]'
            },
            timeoutMs: {
              label: '超时毫秒'
            },
            button: {
              label: '鼠标按钮',
              options: {
                left: '左键',
                middle: '中键',
                right: '右键'
              }
            },
            clickCount: {
              label: '点击次数'
            },
            hoverDelayMs: {
              label: '悬停后延迟',
              input: {
                prefix: '固定'
              }
            },
            randomHoverDelay: {
              label: '随机悬停延迟'
            },
            hoverDelayMinMs: {
              label: '最小悬停延迟毫秒',
              input: {
                prefix: '最小'
              }
            },
            hoverDelayMaxMs: {
              label: '最大悬停延迟毫秒',
              input: {
                prefix: '最大'
              }
            },
            text: {
              label: '文本内容',
              placeholder: '请输入要输入的文本'
            },
            content: {
              label: '填充内容',
              placeholder: '请输入要填充的内容'
            },
            typeMode: {
              label: '输入模式',
              options: {
                type: '逐字输入',
                fill: '直接填充'
              }
            },
            inputIntervalMs: {
              label: '输入间隔',
              input: {
                prefix: '固定',
                unit: '毫秒'
              }
            },
            randomInputInterval: {
              label: '随机间隔'
            },
            inputIntervalMinMs: {
              label: '最小间隔毫秒',
              input: {
                prefix: '最小',
                unit: '毫秒'
              }
            },
            inputIntervalMaxMs: {
              label: '最大间隔毫秒',
              input: {
                prefix: '最大',
                unit: '毫秒'
              }
            },
            clearBefore: {
              label: '输入前清空'
            },
            optionMode: {
              label: '选项匹配模式',
              options: {
                text: '按显示文本',
                value: '按 value',
                index: '按索引'
              }
            },
            optionValue: {
              label: '选项目标值',
              placeholder: '请输入目标文本 / value / 索引'
            },
            skipIfAlreadyState: {
              label: '已是目标状态则跳过'
            },
            eventName: {
              label: '事件名称',
              placeholder: '请选择要触发的事件',
              options: {
                click: '点击 click',
                dblclick: '双击 dblclick',
                mousedown: '按下 mousedown',
                mouseup: '抬起 mouseup',
                mouseenter: '移入 mouseenter',
                mouseleave: '移出 mouseleave',
                mousemove: '移动 mousemove',
                input: '输入 input',
                change: '变化 change',
                focus: '聚焦 focus',
                blur: '失焦 blur',
                keydown: '按键按下 keydown',
                keyup: '按键抬起 keyup',
                keypress: '按键触发 keypress',
                submit: '提交 submit'
              }
            },
            bubbles: {
              label: '允许冒泡'
            },
            cancelable: {
              label: '允许取消'
            },
            key: {
              label: '按键',
              addPart: '添加组合键',
              removePart: '移除',
              preview: '当前组合',
              options: {
                enter: '回车 Enter',
                tab: 'Tab',
                shiftTab: 'Shift + Tab',
                escape: 'Esc',
                space: '空格 Space',
                backspace: '退格 Backspace',
                delete: '删除 Delete',
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
                ctrlA: '全选 Ctrl + A',
                ctrlC: '复制 Ctrl + C',
                ctrlV: '粘贴 Ctrl + V',
                ctrlX: '剪切 Ctrl + X',
                ctrlZ: '撤销 Ctrl + Z',
                ctrlY: '重做 Ctrl + Y',
                ctrlS: '保存 Ctrl + S',
                ctrlP: '打印 Ctrl + P',
                ctrlF: '查找 Ctrl + F',
                ctrlR: '刷新 Ctrl + R',
                ctrlL: '地址栏 Ctrl + L',
                ctrlT: '新建标签 Ctrl + T',
                ctrlW: '关闭标签 Ctrl + W',
                ctrlShiftT: '恢复标签 Ctrl + Shift + T',
                ctrlShiftN: '无痕窗口 Ctrl + Shift + N',
                altTab: '切换窗口 Alt + Tab',
                altF4: '关闭窗口 Alt + F4',
                shiftEnter: 'Shift + Enter',
                metaC: 'Mac 复制 Meta + C',
                metaV: 'Mac 粘贴 Meta + V',
                metaS: 'Mac 保存 Meta + S',
                metaZ: 'Mac 撤销 Meta + Z'
              }
            },
            repeatCount: {
              label: '重复次数'
            },
            pressDurationMs: {
              label: '按下时长毫秒'
            },
            simulateNativeInput: {
              label: '模拟真实设备输入'
            }
          }
        },
        clickElement: {
          title: '点击元素',
          description: '点击指定元素'
        },
        doubleClickElement: {
          title: '双击元素',
          description: '对元素执行双击'
        },
        hoverElement: {
          title: '悬停元素',
          description: '将鼠标悬停到元素上'
        },
        inputText: {
          title: '输入文本',
          description: '逐字输入文本内容'
        },
        fillContent: {
          title: '填充内容',
          description: '直接填充表单值'
        },
        selectOption: {
          title: '选择选项',
          description: '从下拉框中选择选项'
        },
        checkBox: {
          title: '勾选框',
          description: '勾选 checkbox'
        },
        uncheckBox: {
          title: '取消勾选',
          description: '取消勾选 checkbox'
        },
        focusElement: {
          title: '聚焦元素',
          description: '让元素获得焦点'
        },
        dispatchEvent: {
          title: '触发事件',
          description: '派发指定事件'
        },
        pressKey: {
          title: '键盘按键',
          description: '模拟键盘按下或组合键'
        }
      },
      mouse: {
        move: {
          title: '鼠标移动',
          description: '使用拟人参数控制鼠标从起点移动到终点',
          fields: {
            startX: {
              label: '起点 X',
              description: '鼠标起始位置 X 坐标'
            },
            startY: {
              label: '起点 Y',
              description: '鼠标起始位置 Y 坐标'
            },
            endX: {
              label: '终点 X',
              description: '鼠标目标位置 X 坐标'
            },
            endY: {
              label: '终点 Y',
              description: '鼠标目标位置 Y 坐标'
            },
            curveType: {
              label: '轨迹曲线',
              options: {
                linear: '线性',
                bezier: '贝塞尔曲线',
                spline: '样条曲线'
              }
            },
            curveStrength: {
              label: '曲率强度',
              description: '轨迹弯曲程度'
            },
            randomCurveStrength: {
              label: '随机曲率强度'
            },
            curveStrengthMin: {
              label: '最小曲率强度'
            },
            curveStrengthMax: {
              label: '最大曲率强度'
            },
            speedProfile: {
              label: '速度曲线',
              options: {
                linear: '匀速',
                easeIn: '先慢后快',
                easeOut: '先快后慢',
                easeInOut: '先慢后快再慢'
              }
            },
            randomDuration: {
              label: '随机移动时长'
            },
            durationMs: {
              label: '移动时长',
              description: '固定移动总时长'
            },
            durationMinMs: {
              label: '最小时长'
            },
            durationMaxMs: {
              label: '最大时长'
            },
            enableJitter: {
              label: '启用抖动'
            },
            jitterAmplitude: {
              label: '抖动幅度',
              description: '单次抖动位移幅度'
            },
            randomJitterAmplitude: {
              label: '随机抖动幅度'
            },
            jitterAmplitudeMin: {
              label: '最小抖动幅度'
            },
            jitterAmplitudeMax: {
              label: '最大抖动幅度'
            },
            jitterFrequency: {
              label: '抖动频率'
            },
            randomJitterFrequency: {
              label: '随机抖动频率'
            },
            jitterFrequencyMin: {
              label: '最小抖动频率'
            },
            jitterFrequencyMax: {
              label: '最大抖动频率'
            }
          },
          outputs: {
            endX: {
              label: '最终 X',
              description: '移动结束时的 X 坐标'
            },
            endY: {
              label: '最终 Y',
              description: '移动结束时的 Y 坐标'
            },
            path: {
              label: '轨迹点集',
              description: '完整移动轨迹坐标数组'
            }
          }
        }
      },
      scroll: {
        toPosition: {
          title: '滚动到位置',
          description: '滚动到指定坐标或元素',
          fields: {
            mode: {
              label: '滚动目标',
              options: {
                position: '坐标位置',
                element: '目标元素'
              }
            },
            x: {
              label: '目标 X'
            },
            y: {
              label: '目标 Y'
            },
            behavior: {
              label: '滚动行为',
              options: {
                auto: '自动',
                smooth: '平滑'
              }
            },
            randomOffset: {
              label: '启用随机偏移'
            },
            offsetMin: {
              label: '最小偏移'
            },
            offsetMax: {
              label: '最大偏移'
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        intoView: {
          title: '滚动进入视野',
          description: '让元素进入可见区域',
          fields: {
            behavior: {
              label: '滚动行为',
              options: {
                auto: '自动',
                smooth: '平滑'
              }
            },
            block: {
              label: '垂直对齐'
            },
            inline: {
              label: '水平对齐'
            },
            alignOptions: {
              start: '起点',
              center: '居中',
              end: '终点',
              nearest: '最近'
            },
            ensureVisible: {
              label: '确保最终可见'
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        infinite: {
          title: '无限滚动',
          description: '循环滚动加载更多内容',
          fields: {
            maxIterations: {
              label: '最大滚动轮次'
            },
            stepPx: {
              label: '每次滚动像素'
            },
            intervalMs: {
              label: '滚动间隔毫秒'
            },
            behavior: {
              label: '滚动行为',
              options: {
                auto: '自动',
                smooth: '平滑'
              }
            },
            stopWhenNoChange: {
              label: '内容不变时提前停止'
            },
            maxNoChangeCount: {
              label: '最大无变化次数'
            }
          },
          outputs: {
            iterationCount: {
              label: '实际滚动轮次',
              description: '本次执行完成时的滚动次数'
            }
          }
        }
      },
      extract: {
        getText: {
          title: '获取文本',
          description: '获取元素文本内容',
          fields: {
            textMode: {
              label: '文本来源',
              options: {
                innerText: 'innerText（可见文本）',
                textContent: 'textContent（原始文本）'
              }
            },
            trim: {
              label: '去除首尾空白'
            },
            normalizeWhitespace: {
              label: '压缩连续空白'
            }
          },
          outputs: {
            text: {
              label: '文本结果',
              description: '提取到的文本内容'
            },
            lengthDescription: '文本长度',
            existsDescription: '文本是否存在且非空'
          }
        },
        getAttribute: {
          title: '获取属性',
          description: '获取元素指定属性',
          fields: {
            attributeName: {
              label: '属性名',
              placeholder: '例如 href / src / data-id'
            },
            commonAttribute: {
              label: '常见属性',
              options: {
                custom: '自定义输入'
              }
            },
            defaultValue: {
              label: '默认值',
              placeholder: '属性缺失时返回该值（可留空）'
            }
          },
          outputs: {
            value: {
              label: '属性值',
              description: '提取到的属性值'
            },
            existsDescription: '属性是否存在'
          }
        },
        getHtml: {
          title: '获取 HTML',
          description: '获取 innerHTML 或 outerHTML',
          fields: {
            htmlType: {
              label: 'HTML 类型',
              options: {
                outerHTML: 'outerHTML（含自身标签）',
                innerHTML: 'innerHTML（仅内部内容）'
              }
            },
            normalizeWhitespace: {
              label: '压缩连续空白'
            }
          },
          outputs: {
            html: {
              label: 'HTML 结果',
              description: '提取到的 HTML 字符串'
            },
            lengthDescription: 'HTML 字符串长度'
          }
        },
        getValue: {
          title: '获取值',
          description: '获取表单元素的值',
          fields: {
            valueType: {
              label: '值类型',
              options: {
                value: 'value（输入值）',
                checked: 'checked（勾选状态）',
                text: 'text（文本内容）'
              }
            },
            trim: {
              label: '去除首尾空白'
            },
            parseNumber: {
              label: '尝试解析为数字'
            }
          },
          outputs: {
            value: {
              label: '原始结果',
              description: '按所选类型提取的原始结果'
            },
            stringValue: {
              label: '字符串结果',
              description: '字符串形式结果'
            },
            numberValue: {
              label: '数字结果',
              description: '数字解析结果'
            }
          }
        },
        queryElement: {
          title: '元素选择器（单个）',
          description: '通过选择器定位并输出单个元素',
          pinDescriptions: {
            element: '查询到的单个元素对象',
            exists: '是否查询到元素'
          }
        },
        queryAllElements: {
          title: '元素选择器（多个）',
          description: '通过选择器定位并输出元素列表',
          pinDescriptions: {
            elements: '匹配到的元素数组',
            length: '匹配到的元素数量'
          }
        },
        executeScript: {
          title: '执行脚本',
          description: '执行自定义 JS 并返回结果',
          pinDescriptions: {
            script: '脚本文本输入（覆盖下方文本框）',
            result: '脚本返回结果',
            resultArray: '当结果是数组时可直接接入循环/长度节点',
            resultLength: '当结果是数组或字符串时的长度'
          },
          fields: {
            script: {
              label: 'JavaScript 脚本',
              placeholder: '例如：return document.title;'
            }
          }
        }
      },
      http: {
        request: {
          title: 'HTTP 请求',
          description: '发送 GET / POST 等纯 HTTP 请求',
          fields: {
            method: {
              label: '请求方法'
            },
            url: {
              label: '请求 URL',
              placeholder: '例如 https://api.example.com/v1/items'
            },
            query: {
              label: '查询参数',
              placeholder: '例如：page=1&size=20',
              form: {
                keyPlaceholder: '参数名',
                valuePlaceholder: '参数值',
                add: '新增参数',
                remove: '删除'
              }
            },
            headers: {
              label: '请求头',
              placeholder: '例如：Authorization: Bearer xxx',
              form: {
                keyPlaceholder: '请求头名称',
                valuePlaceholder: '请求头值',
                add: '新增请求头',
                remove: '删除'
              },
              presets: {
                authorizationBearer: '常用：Authorization Bearer',
                contentTypeJson: '常用：Content-Type JSON',
                contentTypeFormUrlencoded: '常用：Content-Type 表单',
                acceptJson: '常用：Accept JSON',
                acceptLanguageZhCn: '常用：Accept-Language 中文',
                cacheControlNoCache: '常用：Cache-Control 禁缓存',
                xRequestedWith: '常用：X-Requested-With Ajax',
                userAgentBrowser: '常用：User-Agent 浏览器'
              }
            },
            referer: {
              label: 'Referer',
              placeholder: '例如 https://www.example.com/list'
            },
            cookie: {
              label: 'Cookie 字符串',
              placeholder: '例如 session_id=abc123; theme=dark'
            },
            bodyType: {
              label: '请求体类型',
              options: {
                none: '无',
                json: 'JSON',
                form: 'Form',
                text: 'Text'
              }
            },
            body: {
              label: '请求体',
              placeholder: '根据请求体类型填写内容',
              jsonInvalid: 'JSON 格式不合法，请检查后重试',
              actions: {
                validate: '校验 JSON',
                format: '格式化 JSON'
              },
              form: {
                keyPlaceholder: '参数名',
                valuePlaceholder: '参数值',
                add: '新增参数',
                remove: '删除'
              }
            },
            timeoutMs: {
              label: '超时毫秒'
            },
            retryCount: {
              label: '重试次数'
            },
            followRedirect: {
              label: '跟随重定向'
            }
          },
          outputs: {
            response: {
              label: '响应结果',
              description: '响应体数据'
            },
            statusCode: {
              label: '状态码',
              description: 'HTTP 状态码'
            },
            ok: {
              label: '是否成功',
              description: '响应是否为 2xx'
            },
            headers: {
              label: '响应头',
              description: '响应头对象'
            }
          }
        },
        getCookies: {
          title: '获取 Cookies',
          description: '获取当前 Cookies',
          fields: {
            scope: {
              label: '获取范围',
              options: {
                current: '当前页面',
                domain: '指定域名',
                all: '全部'
              }
            },
            domain: {
              label: '域名',
              placeholder: '例如 example.com'
            },
            path: {
              label: '路径',
              placeholder: '例如 /account'
            },
            includeHttpOnly: {
              label: '包含 HttpOnly'
            },
            includeSessionOnly: {
              label: '包含 Session Cookie'
            },
            asString: {
              label: '输出为字符串'
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          },
          inputs: {
            contextDescription: '上游上下文，可包含页面、域名或当前会话信息'
          },
          outputs: {
            cookies: {
              label: 'Cookies 列表',
              description: 'Cookie 对象列表'
            },
            cookieString: {
              label: 'Cookie 字符串',
              description: '以分号拼接的 Cookie 字符串'
            },
            count: {
              label: '数量',
              description: 'Cookie 数量'
            }
          }
        },
        setCookies: {
          title: '设置 Cookies',
          description: '设置或更新 Cookies',
          inputs: {
            cookieDescription: '上游输入单条 Cookie 字符串时可直接覆盖编辑区内容'
          },
          fields: {
            mode: {
              label: '编辑方式',
              options: {
                single: '单字符串',
                pairs: '多条 Cookie'
              }
            },
            cookie: {
              label: 'Cookie 字符串',
              placeholder: '例如 session_id=abc123; theme=dark'
            },
            pairs: {
              label: 'Cookie 列表',
              nameLabel: 'Cookie 名称',
              namePlaceholder: 'Cookie 名称',
              valueLabel: 'Cookie 值',
              valuePlaceholder: 'Cookie 值',
              domainLabel: '域名',
              domainPlaceholder: '例如 example.com',
              pathLabel: '路径',
              pathPlaceholder: '例如 /',
              add: '新增 Cookie',
              remove: '删除',
              preset: {
                httpOnly: 'HttpOnly',
                secure: 'Secure',
                domain: 'Domain',
                path: 'Path',
                maxAge: 'Max-Age'
              }
            },
            scope: {
              label: '作用范围',
              options: {
                current: '当前页面',
                domain: '指定域名',
                all: '全部'
              }
            },
            domain: {
              label: '域名',
              placeholder: '例如 example.com'
            },
            path: {
              label: '路径',
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
              label: '过期时间',
              placeholder: '请选择日期和时间'
            },
            flags: {
              label: '附加属性'
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
      detect: {
        verification: {
          title: '检测验证',
          description: '检测 Cloudflare、Google reCAPTCHA、hCaptcha 等常见验证防护',
          fields: {
            matchMode: {
              label: '命中模式',
              options: {
                any: '任意命中',
                all: '全部命中'
              }
            },
            vendors: {
              label: '验证类型',
              options: {
                cloudflareChallenge: 'Cloudflare Challenge',
                cloudflareTurnstile: 'Cloudflare Turnstile',
                googleRecaptcha: 'Google reCAPTCHA',
                hcaptcha: 'hCaptcha',
                geetest: 'GeeTest 极验',
                arkose: 'Arkose Labs FunCaptcha',
                datadome: 'DataDome',
                loginWall: '登录墙 / 访问受限页'
              }
            },
            strategy: {
              label: '智能判定策略',
              options: {
                smart: '智能平衡（推荐）',
                strict: '严格判定',
                lenient: '宽松判定'
              }
            },
            notifyAdmin: {
              label: '命中后邮件通知管理员'
            },
            adminEmails: {
              label: '管理员邮箱',
              placeholder: '每行一个邮箱，例如 admin@example.com'
            },
            minConfidence: {
              label: '最小置信度'
            },
            urlKeywords: {
              label: 'URL 关键词',
              placeholder: '每行一个关键词，例如 challenge'
            },
            titleKeywords: {
              label: '标题关键词',
              placeholder: '每行一个关键词，例如 Verify you are human'
            },
            textKeywords: {
              label: '页面文本关键词',
              placeholder: '每行一个关键词，例如 I am not a robot'
            },
            cookieKeywords: {
              label: 'Cookie 关键词',
              placeholder: '每行一个 Cookie 键名，例如 cf_clearance'
            },
            selectors: {
              label: '选择器特征',
              placeholder: '例如 iframe[src*="recaptcha"]',
              add: '新增选择器',
              remove: '删除'
            }
          },
          actions: {
            resetDefaults: '恢复常见验证预设'
          },
          inputs: {
            contextDescription: '传入页面上下文、脚本结果或外部检测输入'
          },
          outputs: {
            detected: {
              label: '检测结果',
              description: '是否命中验证或防护页面'
            },
            vendor: {
              label: '命中厂商',
              description: '返回命中的验证厂商标识'
            },
            kind: {
              label: '验证类型',
              description: '返回验证类型，例如 challenge 或 login-wall'
            },
            confidence: {
              label: '置信度',
              description: '返回本次检测的置信度分值'
            },
            matchedSignals: {
              label: '命中特征',
              description: '返回命中的 URL、文本、选择器等特征列表'
            },
            details: {
              label: '检测详情',
              description: '返回结构化的检测明细对象'
            }
          }
        }
      },
      system: {
        screenSize: {
          title: '获取屏幕尺寸',
          description: '获取系统屏幕宽高',
          outputs: {
            width: {
              label: '屏幕宽度',
              description: '系统屏幕宽度（像素）'
            },
            height: {
              label: '屏幕高度',
              description: '系统屏幕高度（像素）'
            },
            size: {
              label: '屏幕尺寸对象',
              description: '包含宽高的屏幕尺寸对象'
            }
          }
        },
        windowSize: {
          title: '获取窗口尺寸',
          description: '获取 WebView 窗口尺寸',
          outputs: {
            width: {
              label: '窗口宽度',
              description: 'WebView 窗口宽度（像素）'
            },
            height: {
              label: '窗口高度',
              description: 'WebView 窗口高度（像素）'
            },
            size: {
              label: '窗口尺寸对象',
              description: '包含宽高的窗口尺寸对象'
            }
          }
        },
        mousePosition: {
          title: '获取鼠标位置',
          description: '获取鼠标在 WebView 与屏幕中的坐标',
          fields: {
            outputScope: {
              label: '输出坐标范围',
              options: {
                both: '同时输出 WebView + 屏幕',
                webview: '仅 WebView 坐标',
                screen: '仅屏幕坐标'
              }
            }
          },
          outputs: {
            webviewX: {
              label: 'WebView X',
              description: '鼠标相对 WebView 左上角的 X 坐标'
            },
            webviewY: {
              label: 'WebView Y',
              description: '鼠标相对 WebView 左上角的 Y 坐标'
            },
            screenX: {
              label: '屏幕 X',
              description: '鼠标相对屏幕左上角的 X 坐标'
            },
            screenY: {
              label: '屏幕 Y',
              description: '鼠标相对屏幕左上角的 Y 坐标'
            },
            webviewPoint: {
              label: 'WebView 坐标对象',
              description: '包含 WebView 相对坐标的对象'
            },
            screenPoint: {
              label: '屏幕坐标对象',
              description: '包含屏幕绝对坐标的对象'
            }
          }
        },
        elementPosition: {
          title: '获取元素位置',
          description: '获取元素在 WebView 与屏幕中的坐标位置',
          fields: {
            anchorPoint: {
              label: '锚点',
              options: {
                topLeft: '左上角',
                center: '中心点'
              }
            },
            outputScope: {
              label: '输出坐标范围',
              options: {
                both: '同时输出 WebView + 屏幕',
                webview: '仅 WebView 坐标',
                screen: '仅屏幕坐标'
              }
            }
          },
          outputs: {
            exists: {
              label: '元素存在',
              description: '是否匹配到目标元素'
            },
            webviewX: {
              label: 'WebView X',
              description: '元素在 WebView 中的 X 坐标'
            },
            webviewY: {
              label: 'WebView Y',
              description: '元素在 WebView 中的 Y 坐标'
            },
            screenX: {
              label: '屏幕 X',
              description: '元素在屏幕中的 X 坐标'
            },
            screenY: {
              label: '屏幕 Y',
              description: '元素在屏幕中的 Y 坐标'
            },
            rectWebview: {
              label: 'WebView 矩形',
              description: '元素在 WebView 中的矩形对象'
            },
            rectScreen: {
              label: '屏幕矩形',
              description: '元素在屏幕中的矩形对象'
            }
          }
        },
        readClipboard: {
          title: '读取剪切板',
          description: '读取系统剪切板内容',
          outputs: {
            text: {
              label: '剪切板文本',
              description: '读取到的剪切板文本内容'
            },
            length: {
              label: '文本长度',
              description: '剪切板文本长度'
            },
            hasText: {
              label: '是否有文本',
              description: '剪切板是否包含文本内容'
            }
          }
        },
        writeClipboard: {
          title: '写入剪切板',
          description: '写入内容到系统剪切板',
          inputs: {
            text: {
              label: '写入文本',
              description: '上游输入的文本将直接写入剪切板'
            }
          },
          fields: {
            text: {
              label: '写入文本',
              placeholder: '请输入要写入剪切板的文本'
            }
          },
          outputs: {
            text: {
              label: '已写入文本',
              description: '本次写入剪切板的文本内容'
            }
          }
        }
      },
      variable: {
        common: {
          dataTypes: {
            string: '文本',
            number: '数字',
            boolean: '布尔',
            array: '数组',
            object: '对象'
          }
        },
        set: {
          title: '设置变量',
          description: '定义并输出当前画布共享变量',
          empty: {
            title: '还没有定义任何变量',
            description: '新增变量后，每个变量都会拥有独立的输入引脚和输出引脚。',
            action: '新增第一个变量'
          },
          inputs: {
            value: {
              label: '输入值',
              description: '上游输入会覆盖当前变量的默认值'
            }
          },
          outputs: {
            value: {
              label: '变量值',
              description: '输出当前变量的最新值'
            }
          },
          fields: {
            name: {
              label: '变量名',
              placeholder: '例如：username'
            },
            type: {
              label: '数据类型'
            },
            defaultValue: {
              label: '默认值',
              stringPlaceholder: '请输入默认文本',
              jsonPlaceholder: '请输入合法 JSON 默认值'
            },
            connectedHint: {
              label: '已连接上游输入，执行时会优先使用输入值。',
              description: '当前变量在执行时会优先使用输入引脚，不使用默认值。'
            }
          },
          actions: {
            add: '新增变量'
          },
          dialogs: {
            changeType: {
              title: '确认修改变量类型',
              description: '变量“{name}”当前已有 {count} 条关联连线。修改类型后这些连线会被断开，是否继续？',
              confirm: '确认修改',
              cancel: '取消'
            }
          },
          validations: {
            nameRequired: '变量名不能为空',
            nameDuplicate: '该变量名已经在当前画布中定义',
            arrayInvalid: '默认值必须是合法的数组 JSON',
            objectInvalid: '默认值必须是合法的对象 JSON'
          }
        },
        get: {
          title: '获取变量',
          description: '选择当前画布已定义变量并输出对应值',
          empty: {
            title: '当前画布还没有可读取的变量',
            description: '请先放置一个“设置变量”节点并定义变量。'
          },
          fields: {
            variables: {
              label: '选择变量',
              placeholder: '请选择已定义变量',
              description: '支持多选；不同变量会生成不同类型的输出引脚。'
            }
          },
          inputs: {
            value: {
              description: '输入会覆盖所选变量的当前值（{type}）'
            }
          },
          outputs: {
            value: {
              description: '输出所选变量的当前值（{type}）'
            }
          }
        }
      },
      constant: {
        get: {
          title: '常量',
          description: '输出系统预置常量值',
          pinDescriptions: {
            constantKey: '常量键输入'
          },
          outputs: {
            value: {
              description: '当前常量对应的值'
            },
            constantKey: {
              label: '常量键',
              description: '当前命中的常量键名'
            }
          },
          fields: {
            constantKey: {
              label: '常量键',
              options: {
                attachmentDir: '附件目录（attachmentDir）'
              }
            }
          }
        }
      },
      logic: {
        equal: {
          title: '等于',
          description: '判断两个值是否相等',
          pinDescriptions: {
            operand: '比较值 {label}',
            result: '比较结果'
          }
        },
        notEqual: {
          title: '不等于',
          description: '判断两个值是否不相等',
          pinDescriptions: {
            operand: '比较值 {label}',
            result: '比较结果'
          }
        },
        greaterThan: {
          title: '大于',
          description: '判断 a > b',
          pinDescriptions: {
            valueA: '数值 A',
            valueB: '数值 B',
            result: '比较结果'
          }
        },
        lessThan: {
          title: '小于',
          description: '判断 a < b',
          pinDescriptions: {
            valueA: '数值 A',
            valueB: '数值 B',
            result: '比较结果'
          }
        },
        greaterThanOrEqual: {
          title: '大于等于',
          description: '判断 a ≥ b',
          pinDescriptions: {
            valueA: '数值 A',
            valueB: '数值 B',
            result: '比较结果'
          }
        },
        lessThanOrEqual: {
          title: '小于等于',
          description: '判断 a ≤ b',
          pinDescriptions: {
            valueA: '数值 A',
            valueB: '数值 B',
            result: '比较结果'
          }
        },
        and: {
          title: 'AND',
          description: '逻辑与（两个布尔值）',
          pinDescriptions: {
            valueA: '布尔值 A',
            valueB: '布尔值 B',
            result: '逻辑运算结果'
          }
        },
        or: {
          title: 'OR',
          description: '逻辑或（两个布尔值）',
          pinDescriptions: {
            valueA: '布尔值 A',
            valueB: '布尔值 B',
            result: '逻辑运算结果'
          }
        },
        not: {
          title: 'NOT',
          description: '逻辑非（取反）',
          pinDescriptions: {
            value: '布尔值输入',
            result: '逻辑运算结果'
          }
        },
        isEmpty: {
          title: '是否为空',
          description: '判断值是否为空（null/undefined/空字符串/空数组）',
          pinDescriptions: {
            value: '待检测值',
            result: '检测结果'
          }
        },
        exists: {
          title: '是否存在',
          description: '判断值是否存在（非 null/undefined）',
          pinDescriptions: {
            value: '待检测值',
            result: '检测结果'
          }
        }
      },
      math: {
        add: {
          title: '加法',
          description: '两个数值相加',
          pinDescriptions: {
            operand: '加数 {label}',
            result: '加法结果'
          }
        },
        subtract: {
          title: '减法',
          description: '两个数值相减',
          pinDescriptions: {
            operand: '减数 {label}',
            result: '减法结果'
          }
        },
        multiply: {
          title: '乘法',
          description: '两个数值相乘',
          pinDescriptions: {
            operand: '乘数 {label}',
            result: '乘法结果'
          }
        },
        divide: {
          title: '除法',
          description: '两个数值相除',
          pinDescriptions: {
            operand: '除数 {label}',
            result: '除法结果'
          }
        },
        round: {
          title: '取整',
          description: '向下、向上或四舍五入取整',
          pinDescriptions: {
            input: '待取整数值',
            result: '取整结果'
          },
          fields: {
            value: {
              label: '输入值'
            },
            mode: {
              label: '取整模式',
              options: {
                round: '四舍五入',
                ceil: '向上取整',
                floor: '向下取整'
              }
            }
          }
        },
        random: {
          title: '随机数',
          description: '生成指定范围随机数',
          pinDescriptions: {
            min: '随机下限',
            max: '随机上限',
            result: '随机数结果'
          },
          fields: {
            numberType: {
              label: '随机类型',
              options: {
                float: '随机小数',
                integer: '随机整数'
              }
            },
            intervalType: {
              label: '区间类型',
              options: {
                leftClosedRightOpen: '[min, max)',
                leftOpenRightClosed: '(min, max]',
                open: '(min, max)',
                closed: '[min, max]'
              },
              descriptions: {
                leftClosedRightOpen: '包含最小值，不包含最大值',
                leftOpenRightClosed: '不包含最小值，包含最大值',
                open: '最小值和最大值都不包含',
                closed: '最小值和最大值都包含'
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
          title: '绝对值',
          description: '获取数值的绝对值',
          pinDescriptions: {
            input: '待求绝对值数值',
            result: '绝对值结果'
          },
          fields: {
            value: {
              label: '输入值'
            }
          }
        },
        modulo: {
          title: '求余',
          description: '执行取模运算',
          pinDescriptions: {
            valueA: '被取模数 A',
            valueB: '模数 B',
            result: '取模结果'
          },
          fields: {
            valueA: {
              label: '输入 A'
            },
            valueB: {
              label: '输入 B'
            }
          }
        },
        power: {
          title: '幂运算',
          description: '计算 a 的 b 次方',
          pinDescriptions: {
            base: '底数',
            exp: '指数',
            result: '幂运算结果'
          },
          fields: {
            base: {
              label: '底数 (base)'
            },
            exp: {
              label: '指数 (exp)'
            }
          }
        }
      },
      string: {
        common: {
          connectedInputHint: '已连接输入，使用连线值'
        },
        substring: {
          title: '截取子串',
          description: '从文本中截取指定位置的子字符串',
          pinDescriptions: {
            text: '待截取的文本',
            start: '起始位置（0开始）',
            length: '截取长度',
            result: '截取结果'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入原始文本'
            },
            start: {
              label: '起始位置'
            },
            length: {
              label: '截取长度'
            }
          }
        },
        replace: {
          title: '替换文本',
          description: '在文本中查找并替换指定内容（全部替换）',
          pinDescriptions: {
            text: '源文本',
            search: '查找字符串（全部替换）',
            replacement: '替换为',
            result: '替换结果'
          },
          fields: {
            text: {
              label: '源文本',
              placeholder: '输入源文本'
            },
            search: {
              label: '查找',
              placeholder: '输入要查找的文本'
            },
            replacement: {
              label: '替换为',
              placeholder: '输入替换内容'
            }
          }
        },
        concat: {
          title: '拼接文本',
          description: '将多个文本段拼接为一个',
          pinDescriptions: {
            segment: '文本段 {label}',
            result: '拼接结果'
          },
          fields: {
            segment: {
              label: '文本 {label}',
              placeholder: '文本段 {label}',
              count: '{count}段'
            }
          }
        },
        regexMatch: {
          title: '正则匹配',
          description: '使用正则表达式从文本中提取匹配内容',
          pinDescriptions: {
            text: '待匹配的文本',
            pattern: '正则表达式模式',
            flags: '标志(g/i/m等)',
            result: '匹配结果数组'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入待匹配的文本'
            },
            pattern: {
              label: '正则模式',
              placeholder: '输入正则表达式（如 \\d+）'
            },
            flags: {
              label: '标志',
              placeholder: '输入标志（如 g、i、m）'
            }
          }
        },
        regexReplace: {
          title: '正则替换',
          description: '使用正则表达式查找并替换文本内容',
          pinDescriptions: {
            text: '源文本',
            pattern: '正则表达式模式',
            replacement: '替换为（可用捕获组）',
            flags: '标志(g/i/m等)',
            result: '替换结果'
          },
          fields: {
            text: {
              label: '源文本',
              placeholder: '输入源文本'
            },
            pattern: {
              label: '正则模式',
              placeholder: '输入正则表达式'
            },
            replacement: {
              label: '替换为',
              placeholder: '输入替换内容（可使用捕获组 $1、$2 等）'
            },
            flags: {
              label: '标志',
              placeholder: '输入标志（如 g、i、m）'
            }
          }
        },
        split: {
          title: '分割文本',
          description: '按分割符将文本分割为数组',
          pinDescriptions: {
            text: '待分割的文本',
            separator: '分隔符',
            result: '分割结果数组'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入待分割的文本'
            },
            separator: {
              label: '分割符',
              placeholder: '输入分割符（如 , 或 |）'
            }
          }
        },
        length: {
          title: '计算长度',
          description: '获取文本的字符长度',
          pinDescriptions: {
            text: '待计算长度的文本',
            result: '文本长度（字符数）'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入待计算长度的文本'
            }
          }
        },
        uppercase: {
          title: '大写转换',
          description: '将文本转换为大写',
          pinDescriptions: {
            text: '待转大写的文本',
            result: '大写结果'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入待转大写的文本'
            }
          }
        },
        lowercase: {
          title: '小写转换',
          description: '将文本转换为小写',
          pinDescriptions: {
            text: '待转小写的文本',
            result: '小写结果'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入待转小写的文本'
            }
          }
        },
        trim: {
          title: '去空白',
          description: '从文本中移除空白字符',
          pinDescriptions: {
            text: '待去空白的文本',
            result: '去空白结果'
          },
          fields: {
            text: {
              label: '文本',
              placeholder: '输入待去空白的文本'
            },
            direction: {
              label: '去空白方向'
            },
            whitespaceTypes: {
              label: '空白类型'
            }
          },
          options: {
            directionBoth: '两头（前后）',
            directionStart: '开始（前）',
            directionEnd: '结束（后）',
            directionAll: '所有（全部）',
            whitespaceSpace: '空格',
            whitespaceTab: '制表符',
            whitespaceNewline: '换行符',
            whitespaceCarriageReturn: '回车符',
            whitespaceVerticalTab: '垂直制表符',
            whitespaceFormFeed: '换页符'
          }
        }
      },
      dateTime: {
        now: {
          title: '当前时间',
          description: '生成当前时间并输出多种格式',
          pinDescriptions: {
            outputMode: '输出模式输入'
          },
          outputs: {
            iso: {
              label: 'UTC ISO',
              description: 'UTC ISO 8601 字符串'
            },
            timestamp: {
              label: '时间戳',
              description: 'Unix 时间戳（毫秒）'
            },
            mode: {
              label: '输出模式',
              description: '当前启用的输出模式'
            }
          },
          fields: {
            outputMode: {
              label: '输出模式',
              options: {
                isoUtc: 'UTC ISO 字符串',
                timestampMs: '毫秒时间戳'
              }
            }
          }
        },
        format: {
          title: '日期时间格式化',
          description: '将时间值按指定格式输出',
          pinDescriptions: {
            value: '待格式化的时间值',
            sourceMode: '来源模式输入',
            formatPattern: '格式模板输入'
          },
          outputs: {
            formatted: {
              label: '格式结果',
              description: '按模板格式化后的时间字符串'
            },
            sourceMode: {
              label: '来源模式',
              description: '当前使用的来源模式'
            }
          },
          fields: {
            sourceMode: {
              label: '来源',
              options: {
                current: '当前时间',
                input: '输入值'
              }
            },
            formatPattern: {
              label: '格式模板',
              placeholder: '例如 YYYY-MM-DD HH:mm:ss'
            }
          }
        }
      },
      arrayObject: {
        filter: {
          title: '数据过滤',
          description: '过滤数组',
          pinLabels: {
            removed: '移除数'
          },
          pinDescriptions: {
            array: '输入待过滤的数组数据',
            path: '可选：输入对象字段路径（用于按字段过滤）',
            result: '过滤后的数组结果',
            removed: '被移除的数据项数量'
          },
          fields: {
            mode: {
              label: '过滤模式'
            },
            path: {
              label: '过滤路径',
              placeholder: '可选：输入对象字段路径，例如 data.value'
            }
          },
          options: {
            modeTruthy: '保留真值项',
            modeNonEmpty: '移除空值项',
            modeDistinct: '去重（按序）'
          }
        },
        merge: {
          title: '数据合并',
          description: '合并多个数据源',
          pinDescriptions: {
            source: '输入数据源 {label}',
            result: '合并后的结果（数组或对象）'
          },
          fields: {
            mode: {
              label: '合并模式'
            },
            source: {
              label: '数据源 {label}',
              placeholder: '可选：输入 JSON 数据源（如数组或对象）',
              count: '{count} 个数据源'
            }
          },
          options: {
            modeSmart: '智能合并（自动判断）',
            modeArrayConcat: '数组拼接',
            modeObjectAssign: '对象覆盖（后者优先）'
          }
        },
        split: {
          title: '数据拆分',
          description: '将数据拆分成多路',
          pinLabels: {
            size: '分块',
            chunks: '分块数组',
            first: '首项',
            rest: '剩余项'
          },
          pinDescriptions: {
            array: '输入待拆分的数组数据',
            size: '输入每块大小（可覆盖面板设置）',
            chunks: '按分块大小切分后的数组结果',
            first: '数组首项数据',
            rest: '除首项外的剩余数组'
          },
          fields: {
            size: {
              label: '分块大小'
            }
          }
        },
        length: {
          title: '数组长度',
          description: '获取数组长度',
          pinDescriptions: {
            array: '输入数组并输出长度',
            length: '数组长度'
          }
        },
        item: {
          title: '数组索引',
          description: '获取数组指定索引的值',
          pinDescriptions: {
            array: '输入数组',
            index: '输入索引（可覆盖面板中的默认索引）',
            item: '索引对应的数据项',
            exists: '该索引是否存在'
          },
          fields: {
            index: {
              label: '索引',
              placeholder: '输入要读取的数组索引'
            }
          }
        }
      },
      typeConvert: {
        string: {
          title: '转字符串',
          description: '转换为字符串类型',
          hint: '将任意类型的数据转换为字符串表示',
          inputs: {
            input: {
              description: '待转换的数据（任意类型）'
            }
          },
          outputs: {
            result: {
              description: '转换后的字符串'
            }
          },
          fields: {
            treatNullAsEmpty: {
              label: '将 null 视为空字符串'
            }
          }
        },
        number: {
          title: '转数字',
          description: '转换为数字类型',
          hint: '将任意类型的数据转换为数字，转换失败时返回默认值',
          inputs: {
            input: {
              description: '待转换的数据（任意类型）'
            }
          },
          outputs: {
            result: {
              description: '转换后的数字'
            }
          },
          fields: {
            defaultValue: {
              label: '默认值（转换失败时）'
            }
          }
        },
        boolean: {
          title: '转布尔',
          description: '转换为布尔类型',
          hint: '将任意类型的数据根据自定义规则转换为布尔值',
          inputs: {
            input: {
              description: '待转换的数据（任意类型）'
            }
          },
          outputs: {
            result: {
              description: '转换后的布尔值'
            }
          },
          fields: {
            truthyValues: {
              label: '真值列表（逗号分隔）',
              placeholder: 'true,1,"yes","on"'
            }
          }
        },
        json: {
          title: '转 JSON',
          description: '转换为 JSON 字符串',
          hint: '将任意类型的数据序列化为 JSON 字符串',
          inputs: {
            input: {
              description: '待转换的数据（任意类型）'
            }
          },
          outputs: {
            result: {
              description: '序列化后的 JSON 字符串'
            },
            message: {
              description: '转换失败时的错误信息'
            }
          },
          fields: {
            indent: {
              label: '缩进宽度（0 为无缩进）'
            },
            handleCircular: {
              label: '处理循环引用'
            }
          }
        },
        parseJson: {
          title: '解析 JSON',
          description: '解析 JSON 字符串',
          hint: '将 JSON 字符串反序列化为数据对象，失败时返回备选值',
          inputs: {
            input: {
              description: '待解析的 JSON 字符串'
            }
          },
          outputs: {
            result: {
              description: '解析后的数据对象'
            },
            message: {
              description: '解析失败时的错误信息'
            }
          },
          fields: {
            fallbackValue: {
              label: '备选值（解析失败时）',
              placeholder: 'null'
            }
          }
        }
      },
      controlFlow: {
        loop: {
          title: '循环',
          description: 'ForEach / While 循环',
          pinDescriptions: {
            array: 'ForEach 模式下的循环数组输入',
            condition: 'While 模式下的继续条件输入',
            mode: '循环模式输入（forEach / while）',
            limitIterations: '是否限制最大循环次数',
            maxIterations: '最大循环次数输入',
            breakOnError: '发生错误时是否中断'
          },
          outputs: {
            item: {
              description: '当前循环项'
            },
            index: {
              label: '索引',
              description: '当前循环索引'
            }
          },
          fields: {
            mode: {
              label: '循环模式',
              options: {
                forEach: 'ForEach（按数组项遍历）',
                while: 'While（按条件循环）'
              }
            },
            maxIterations: {
              label: '最大循环次数'
            },
            limitIterations: {
              label: '限制最大循环次数',
              switchLabel: '启用限制',
              unlimited: '不限制'
            },
            breakOnError: {
              label: '发生错误时中断'
            }
          }
        },
        condition: {
          title: '条件判断',
          description: 'If / Else 分支',
          pinDescriptions: {
            condition: '布尔条件输入（boolean 模式）',
            valueA: '比较值 A（compare 模式）',
            valueB: '比较值 B（compare 模式）',
            mode: '条件模式输入（boolean / compare）',
            strictCompare: '是否启用严格比较'
          },
          outputs: {
            true: {
              label: 'True 分支',
              description: '条件命中 true 时输出'
            },
            false: {
              label: 'False 分支',
              description: '条件命中 false 时输出'
            }
          },
          fields: {
            mode: {
              label: '条件模式',
              options: {
                boolean: '布尔模式（直接读取布尔输入）',
                compare: '比较模式（比较 A 与 B）'
              }
            },
            strictCompare: {
              label: '严格比较（===）'
            }
          }
        },
        switch: {
          title: '多路分支',
          description: 'Switch 多分支',
          pinDescriptions: {
            value: '待匹配的输入值',
            matchMode: '匹配模式输入（strict / loose）',
            cases: '分支列表输入（按行分隔）',
            useDefaultBranch: '是否启用默认分支'
          },
          outputs: {
            case: {
              description: '命中分支 {label} 时输出'
            },
            default: {
              label: '默认分支',
              description: '所有分支都不命中时输出'
            }
          },
          fields: {
            matchMode: {
              label: '匹配模式',
              options: {
                strict: '严格匹配（===）',
                loose: '宽松匹配（==）'
              }
            },
            cases: {
              label: '分支列表（每行一个）',
              placeholder: 'case_1\ncase_2'
            },
            useDefaultBranch: {
              label: '启用默认分支'
            }
          }
        }
      },
      output: {
        saveData: {
          title: '保存数据',
          description: '将数据保存到指定类型的资源池',
          pinDescriptions: {
            value: '待保存的数据值',
            saveType: '保存类型输入'
          },
          outputs: {
            savedType: {
              label: '保存类型',
              description: '本次实际保存的类型'
            }
          },
          fields: {
            saveType: {
              label: '保存类型',
              options: {
                music: '音乐',
                image: '图片'
              }
            }
          }
        },
        printLog: {
          title: '打印日志',
          description: '输出调试信息',
          pinDescriptions: {
            value: '要输出的日志值',
            level: '日志级别输入',
            template: '日志模板输入'
          },
          fields: {
            level: {
              label: '日志级别',
              options: {
                debug: '调试',
                info: '信息',
                warn: '警告',
                error: '错误'
              }
            },
            template: {
              label: '日志模板',
              placeholder: '例如：[crawler] 当前值：${value}'
            }
          }
        },
        screenshot: {
          title: '截图',
          description: '截取页面或元素',
          pinDescriptions: {
            element: '目标元素（element 模式）',
            targetMode: '截图目标模式输入',
            path: '截图保存路径输入',
            fullPage: '全页截图开关输入'
          },
          outputs: {
            path: {
              label: '截图路径',
              description: '截图文件路径或 URL'
            }
          },
          fields: {
            targetMode: {
              label: '截图目标',
              options: {
                page: '页面截图',
                element: '元素截图'
              }
            },
            path: {
              label: '保存路径',
              placeholder: '例如：/screenshots/news-item.png'
            },
            fullPage: {
              label: '全页截图'
            }
          }
        }
      }
    }
  }
};
