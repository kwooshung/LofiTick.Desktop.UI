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
      mouse: {
        title: '鼠标人类模拟',
        description: '模拟更自然的鼠标移动轨迹'
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
          description: '爬虫的入口节点，负责触发爬虫的执行'
        },
        end: {
          title: '结束',
          description: '爬虫的结束节点，负责终止爬虫的执行'
        }
      },
      navigation: {
        goto: {
          title: '跳转页面',
          description: '打开指定 URL',
          outputs: {
            success: '成功',
            fail: '失败',
            boolean: 'boolean',
            booleanDescription: '表示是否跳转成功',
            message: 'message',
            messageDescription: '失败时的错误信息或异常说明'
          },
          fields: {
            path: {
              label: '目标路径',
              placeholder: '请输入目标路径，例如 /news/123'
            },
            waitReady: {
              label: '等待页面就绪'
            },
            timeoutMs: {
              label: '超时毫秒'
            }
          }
        },
        refresh: {
          title: '刷新页面',
          description: '刷新当前页面',
          fields: {
            waitReady: {
              label: '等待页面就绪'
            },
            timeoutMs: {
              label: '超时毫秒'
            },
            hardReload: {
              label: '强制刷新'
            }
          }
        },
        back: {
          title: '后退',
          description: '浏览器历史后退',
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
          description: '等待指定元素出现'
        },
        time: {
          title: '等待时间',
          description: '固定等待指定毫秒数'
        },
        random: {
          title: '随机等待',
          description: '在最小值和最大值之间随机等待'
        },
        loadState: {
          title: '等待加载状态',
          description: '等待页面达到指定加载状态'
        },
        condition: {
          title: '等待条件',
          description: '等待自定义 JS 条件成立'
        },
        text: {
          title: '等待文本',
          description: '等待页面出现指定文本'
        },
        delay: {
          title: '延迟',
          description: '纯延迟等待'
        }
      },
      interaction: {
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
          description: '移动鼠标到指定坐标'
        },
        curve: {
          title: '鼠标曲线',
          description: '为鼠标移动添加曲线路径'
        },
        accel: {
          title: '鼠标加减速',
          description: '为鼠标移动添加加减速效果'
        },
        jitter: {
          title: '鼠标抖动',
          description: '为鼠标移动添加随机抖动'
        },
        duration: {
          title: '鼠标移动时长',
          description: '设置鼠标移动执行总时长'
        }
      },
      scroll: {
        toPosition: {
          title: '滚动到位置',
          description: '滚动到指定坐标或元素'
        },
        intoView: {
          title: '滚动进入视野',
          description: '让元素进入可见区域'
        },
        infinite: {
          title: '无限滚动',
          description: '循环滚动加载更多内容'
        }
      },
      extract: {
        getText: {
          title: '获取文本',
          description: '获取元素文本内容'
        },
        getAttribute: {
          title: '获取属性',
          description: '获取元素指定属性'
        },
        getHtml: {
          title: '获取 HTML',
          description: '获取 innerHTML 或 outerHTML'
        },
        getValue: {
          title: '获取值',
          description: '获取表单元素的值'
        },
        queryElement: {
          title: '查询元素',
          description: '查询单个元素'
        },
        queryAllElements: {
          title: '查询所有元素',
          description: '查询多个元素并返回列表'
        },
        executeScript: {
          title: '执行脚本',
          description: '执行自定义 JS 并返回结果'
        }
      },
      http: {
        request: {
          title: 'HTTP 请求',
          description: '发送 GET / POST 等纯 HTTP 请求'
        },
        getCookies: {
          title: '获取 Cookies',
          description: '获取当前 Cookies'
        },
        setCookies: {
          title: '设置 Cookies',
          description: '设置 Cookies'
        }
      },
      detect: {
        verification: {
          title: '检测验证',
          description: '检测验证页面是否出现'
        }
      },
      system: {
        screenSize: {
          title: '获取屏幕尺寸',
          description: '获取系统屏幕宽高'
        },
        windowSize: {
          title: '获取窗口尺寸',
          description: '获取 WebView 窗口尺寸'
        },
        mousePosition: {
          title: '设置鼠标位置',
          description: '设置鼠标初始位置'
        },
        readClipboard: {
          title: '读取剪切板',
          description: '读取系统剪切板内容'
        },
        writeClipboard: {
          title: '写入剪切板',
          description: '写入内容到系统剪切板'
        }
      },
      variable: {
        set: {
          title: '设置变量',
          description: '将数据存入变量'
        },
        get: {
          title: '获取变量',
          description: '读取变量的值'
        }
      },
      logic: {
        equal: {
          title: '等于',
          description: '判断两个值是否相等'
        },
        notEqual: {
          title: '不等于',
          description: '判断两个值是否不相等'
        },
        greaterThan: {
          title: '大于',
          description: '判断 a > b'
        },
        lessThan: {
          title: '小于',
          description: '判断 a < b'
        },
        greaterThanOrEqual: {
          title: '大于等于',
          description: '判断 a ≥ b'
        },
        lessThanOrEqual: {
          title: '小于等于',
          description: '判断 a ≤ b'
        },
        and: {
          title: 'AND',
          description: '逻辑与（两个布尔值）'
        },
        or: {
          title: 'OR',
          description: '逻辑或（两个布尔值）'
        },
        not: {
          title: 'NOT',
          description: '逻辑非（取反）'
        },
        isEmpty: {
          title: '是否为空',
          description: '判断值是否为空（null/undefined/空字符串/空数组）'
        },
        exists: {
          title: '是否存在',
          description: '判断值是否存在（非 null/undefined）'
        }
      },
      math: {
        add: {
          title: '加法',
          description: '两个数值相加'
        },
        subtract: {
          title: '减法',
          description: '两个数值相减'
        },
        multiply: {
          title: '乘法',
          description: '两个数值相乘'
        },
        divide: {
          title: '除法',
          description: '两个数值相除'
        },
        round: {
          title: '取整',
          description: '向下、向上或四舍五入取整'
        },
        random: {
          title: '随机数',
          description: '生成指定范围随机数'
        },
        absolute: {
          title: '绝对值',
          description: '获取数值的绝对值'
        },
        modulo: {
          title: '求余',
          description: '执行取模运算'
        },
        power: {
          title: '幂运算',
          description: '计算 a 的 b 次方'
        }
      },
      string: {
        substring: {
          title: '字符串截取',
          description: '截取字符串指定部分'
        },
        replace: {
          title: '字符串替换',
          description: '替换字符串中的内容'
        },
        concat: {
          title: '字符串拼接',
          description: '拼接多个字符串'
        },
        regexMatch: {
          title: '正则匹配',
          description: '使用正则表达式匹配'
        },
        regexReplace: {
          title: '正则替换',
          description: '使用正则表达式替换'
        },
        split: {
          title: '字符串分割',
          description: '按分隔符分割字符串'
        },
        length: {
          title: '字符串长度',
          description: '获取字符串长度'
        },
        uppercase: {
          title: '转大写',
          description: '转换为大写'
        },
        lowercase: {
          title: '转小写',
          description: '转换为小写'
        },
        trim: {
          title: '去除空格',
          description: '去除字符串首尾空格'
        }
      },
      arrayObject: {
        filter: {
          title: '数据过滤',
          description: '过滤数组'
        },
        merge: {
          title: '数据合并',
          description: '合并多个数据源'
        },
        split: {
          title: '数据拆分',
          description: '将数据拆分成多路'
        },
        length: {
          title: '数组长度',
          description: '获取数组长度'
        },
        item: {
          title: '数组索引',
          description: '获取数组指定索引的值'
        }
      },
      typeConvert: {
        string: {
          title: '转字符串',
          description: '转换为字符串类型'
        },
        number: {
          title: '转数字',
          description: '转换为数字类型'
        },
        boolean: {
          title: '转布尔',
          description: '转换为布尔类型'
        },
        json: {
          title: '转 JSON',
          description: '转换为 JSON 字符串'
        },
        parseJson: {
          title: '解析 JSON',
          description: '解析 JSON 字符串'
        }
      },
      controlFlow: {
        loop: {
          title: '循环',
          description: 'ForEach / While 循环'
        },
        condition: {
          title: '条件判断',
          description: 'If / Else 分支'
        },
        switch: {
          title: '多路分支',
          description: 'Switch 多分支'
        }
      },
      output: {
        sendToApi: {
          title: '发送到 API',
          description: '将数据发送到你的专用 API'
        },
        printLog: {
          title: '打印日志',
          description: '输出调试信息'
        },
        screenshot: {
          title: '截图',
          description: '截取页面或元素'
        }
      }
    }
  }
};
