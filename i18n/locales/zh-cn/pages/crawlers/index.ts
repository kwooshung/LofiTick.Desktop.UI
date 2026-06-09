export const crawlers = {
  title: '爬虫',
  search: {
    header: {
      title: '搜索爬虫',
      startLabel: '点击搜索爬虫',
      conditions: '已设置搜索条件'
    },
    body: {
      keyword: {
        placeholder: '搜索站点名称或描述'
      },
      enabled: {
        placeholder: '筛选启用状态'
      }
    }
  },
  targets: {
    title: '站点',
    add: '新增站点',
    edit: '编辑站点',
    addTask: '添加爬虫',
    menu: {
      open: '打开站点',
      copyDomain: '复制域名',
      copyBaseUrl: '复制站点地址'
    },
    empty: {
      title: '暂无目标站点',
      description: '还没有添加任何爬虫目标站点，点击上方按钮添加'
    },
    form: {
      name: {
        label: '网站名称',
        placeholder: '请输入网站名称',
        verify: {
          required: '网站名称不能为空',
          length: '网站名称不能超过255个字符'
        }
      },
      domain: {
        label: '域名',
        placeholder: '请输入域名，如 weibo.com',
        verify: {
          required: '域名不能为空',
          length: '域名不能超过255个字符',
          pattern: '域名格式不正确'
        }
      },
      baseUrl: {
        label: '基础URL',
        placeholder: '请输入站点域名，如 weibo.com',
        verify: {
          required: '基础URL不能为空',
          length: '基础URL不能超过255个字符',
          pattern: '基础URL格式不正确'
        }
      },
      description: {
        label: '描述',
        placeholder: '请输入描述'
      },
      isEnabled: {
        label: '是否启用'
      },
      unique: {
        checking: '正在检查唯一性...',
        domainExists: '该域名已存在'
      }
    }
  },
  blueprint: {
    drawer: {
      title: '爬虫逻辑'
    },
    nodes: {
      groups: {
        recent: {
          title: '最近使用的节点',
          description: '快速访问最近插入的节点'
        },
        flow: {
          title: '流程控制',
          description: '用于搭建执行入口、分支与顺序'
        },
        request: {
          title: '网络请求',
          description: '用于发起请求和处理响应'
        },
        parser: {
          title: '数据解析',
          description: '用于提取页面和数据内容'
        },
        variable: {
          title: '变量与数据',
          description: '用于布尔、数字、字符串与读写变量'
        },
        compare: {
          title: '比较运算',
          description: '用于大小、相等与不等比较'
        },
        logicOp: {
          title: '逻辑运算',
          description: '用于与、或、非和空值合并'
        },
        logic: {
          title: '条件与循环',
          description: '用于分支判断、条件切换与循环执行'
        },
        debug: {
          title: '调试与辅助',
          description: '用于日志、预览和失败重试'
        },
        array: {
          title: '数组操作',
          description: '用于数组增删查改与排序'
        },
        string: {
          title: '字符串操作',
          description: '用于字符串截取、替换与格式化'
        },
        object: {
          title: '对象操作',
          description: '用于对象属性读写与合并'
        },
        math: {
          title: '数学运算',
          description: '用于数值计算与随机处理'
        },
        convert: {
          title: '类型转换',
          description: '用于不同数据类型之间的转换'
        },
        function: {
          title: '函数节点',
          description: '用于定义、调用与返回函数'
        },
        storage: {
          title: '数据存储',
          description: '用于文件写入与数据提交'
        },
        delay: {
          title: '延迟与等待',
          description: '用于固定、随机和条件等待'
        },
        antiBot: {
          title: '反爬处理',
          description: '用于请求伪装与挑战页识别'
        },
        helper: {
          title: '辅助功能',
          description: '用于时间、ID 与哈希等通用能力'
        },
        browser: {
          title: 'WebView2 自动化',
          description: '用于页面导航、点击、截图与标签页控制，优先走 WebView2 原子能力'
        },
        element: {
          title: '页面元素交互',
          description: '用于点击、输入、拖拽与滚动'
        },
        elementWait: {
          title: '元素等待与检测',
          description: '用于等待、判断与读取元素状态'
        },
        form: {
          title: '表单处理',
          description: '用于填写、提交与验证表单'
        },
        context: {
          title: '浏览器上下文',
          description: '用于标签页、Frame 与弹窗控制'
        },
        cookie: {
          title: 'Cookie 与存储',
          description: '用于 Cookie 与本地存储读写'
        },
        network: {
          title: '网络与请求拦截',
          description: '用于拦截、修改和查看网络请求'
        },
        js: {
          title: '执行 JavaScript',
          description: '用于页面脚本执行与注入'
        }
      },
      nodes: {
        flow: {
          start: {
            title: '开始节点',
            description: '蓝图执行入口，可配置初始参数'
          },
          end: {
            title: '结束节点',
            description: '蓝图执行终点，输出最终结果'
          },
          sequence: {
            title: '顺序执行',
            description: '按顺序连接多个子流程'
          },
          branch: {
            title: '分支选择',
            description: '根据条件切换执行分支'
          },
          parallel: {
            title: '并行执行',
            description: '同时执行多个子流程'
          }
        },
        request: {
          get: {
            title: 'GET 请求',
            description: '发送 HTTP GET 请求'
          },
          post: {
            title: 'POST 请求',
            description: '发送 HTTP POST 请求'
          },
          config: {
            title: '请求配置',
            description: '设置请求头、Cookie 与代理'
          },
          parse: {
            title: '响应解析',
            description: '解析 JSON、HTML 或 XML 响应'
          },
          put: {
            title: 'PUT 请求',
            description: '发送 HTTP PUT 请求'
          },
          delete: {
            title: 'DELETE 请求',
            description: '发送 HTTP DELETE 请求'
          },
          download: {
            title: '下载文件',
            description: '下载文件到本地'
          },
          upload: {
            title: '上传文件',
            description: '上传文件到服务器'
          },
          session: {
            title: '会话管理',
            description: '保持登录状态、Cookie 管理'
          }
        },
        parser: {
          css: {
            title: 'CSS 选择器',
            description: '从 HTML 中提取元素'
          },
          json: {
            title: 'JSON 解析',
            description: '提取 JSON 字段'
          },
          list: {
            title: '列表提取',
            description: '处理分页并展开列表数据'
          },
          attr: {
            title: '属性提取',
            description: '提取 src、href 等元素属性'
          },
          xpath: {
            title: 'XPath 选择器',
            description: '使用 XPath 提取 XML / HTML 数据'
          },
          regex: {
            title: '正则表达式',
            description: '使用正则匹配提取文本'
          },
          text: {
            title: 'HTML 转文本',
            description: '将 HTML 转换为纯文本'
          },
          table: {
            title: '表格解析',
            description: '解析 HTML 表格数据'
          }
        },
        logic: {
          boolean: {
            title: 'Boolean',
            description: '布尔值节点'
          },
          string: {
            title: 'String',
            description: '字符串节点'
          },
          ifElse: {
            title: 'if-else',
            description: '双分支条件判断'
          },
          loop: {
            title: 'for',
            description: '循环遍历集合或次数'
          },
          integer: {
            title: 'Integer',
            description: '整数值节点'
          },
          float: {
            title: 'Float',
            description: '浮点数值节点'
          },
          array: {
            title: 'Array',
            description: '数组节点'
          },
          object: {
            title: 'Object',
            description: '对象节点'
          },
          null: {
            title: 'Null',
            description: '空值节点'
          },
          get: {
            title: '获取变量',
            description: '读取变量值'
          },
          set: {
            title: '设置变量',
            description: '写入变量值'
          },
          if: {
            title: 'if',
            description: '单分支条件判断'
          },
          switch: {
            title: 'switch',
            description: '多分支选择'
          }
        },
        debug: {
          log: {
            title: '日志输出',
            description: '输出调试信息'
          },
          preview: {
            title: '数据预览',
            description: '预览当前节点输出'
          },
          breakpoint: {
            title: '断点调试',
            description: '在指定位置暂停节点执行并检查现场数据'
          },
          error: {
            title: '错误捕获',
            description: '捕获节点执行错误并进行统一处理'
          },
          retry: {
            title: '重试机制',
            description: '失败后自动重试'
          }
        },
        array: {
          push: {
            title: 'push',
            description: '数组末尾添加元素'
          },
          pop: {
            title: 'pop',
            description: '移除数组末尾元素'
          },
          slice: {
            title: 'slice',
            description: '截取数组片段'
          },
          concat: {
            title: 'concat',
            description: '合并数组'
          },
          join: {
            title: 'join',
            description: '数组转字符串'
          },
          get: {
            title: 'get',
            description: '按索引获取元素'
          },
          indexOf: {
            title: 'indexOf',
            description: '查找元素索引'
          },
          includes: {
            title: 'includes',
            description: '检查元素是否存在'
          },
          find: {
            title: 'find',
            description: '查找满足条件的元素'
          },
          filter: {
            title: 'filter',
            description: '过滤数组元素'
          },
          map: {
            title: 'map',
            description: '映射转换数组元素'
          },
          reduce: {
            title: 'reduce',
            description: '数组归约计算'
          },
          sort: {
            title: 'sort',
            description: '数组排序'
          },
          length: {
            title: 'length',
            description: '获取数组长度'
          }
        },
        string: {
          charAt: {
            title: 'charAt',
            description: '获取指定位置字符'
          },
          includes: {
            title: 'includes',
            description: '检查是否包含子字符串'
          },
          slice: {
            title: 'slice',
            description: '截取字符串片段'
          },
          split: {
            title: 'split',
            description: '字符串分割为数组'
          },
          replace: {
            title: 'replace',
            description: '替换字符串'
          },
          trim: {
            title: 'trim',
            description: '去除首尾空白'
          },
          toLowerCase: {
            title: 'toLowerCase',
            description: '转小写'
          },
          toUpperCase: {
            title: 'toUpperCase',
            description: '转大写'
          },
          repeat: {
            title: 'repeat',
            description: '字符串重复'
          },
          padStart: {
            title: 'padStart',
            description: '开头填充'
          },
          padEnd: {
            title: 'padEnd',
            description: '末尾填充'
          },
          length: {
            title: 'length',
            description: '获取字符串长度'
          }
        },
        object: {
          get: {
            title: '获取属性',
            description: '读取对象属性'
          },
          set: {
            title: '设置属性',
            description: '写入对象属性'
          },
          delete: {
            title: '删除属性',
            description: '删除对象属性'
          },
          keys: {
            title: 'keys',
            description: '获取键列表'
          },
          values: {
            title: 'values',
            description: '获取值列表'
          },
          entries: {
            title: 'entries',
            description: '获取键值对列表'
          },
          assign: {
            title: 'assign',
            description: '合并对象'
          },
          hasOwnProperty: {
            title: 'hasOwnProperty',
            description: '检查自有属性'
          },
          create: {
            title: '创建对象',
            description: '创建新对象'
          }
        },
        math: {
          add: {
            title: '加法 (+)',
            description: '数值相加'
          },
          subtract: {
            title: '减法 (-)',
            description: '数值相减'
          },
          multiply: {
            title: '乘法 (*)',
            description: '数值相乘'
          },
          divide: {
            title: '除法 (/)',
            description: '数值相除'
          },
          mod: {
            title: '取余 (%)',
            description: '取模运算'
          },
          pow: {
            title: '幂运算 (**)',
            description: '指数运算'
          },
          random: {
            title: 'Math.random',
            description: '随机数'
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
            description: '字符串转整数'
          },
          parseFloat: {
            title: 'parseFloat',
            description: '字符串转浮点数'
          },
          number: {
            title: 'Number',
            description: '转数值'
          },
          string: {
            title: 'String',
            description: '转字符串'
          },
          boolean: {
            title: 'Boolean',
            description: '转布尔值'
          },
          toString: {
            title: 'toString',
            description: '对象转字符串'
          },
          typeof: {
            title: 'typeof',
            description: '获取类型'
          },
          instanceof: {
            title: 'instanceof',
            description: '检查类型'
          }
        },
        compare: {
          eq: {
            title: '==',
            description: '值相等（宽松比较）'
          },
          eqStrict: {
            title: '===',
            description: '值和类型相等'
          },
          ne: {
            title: '!=',
            description: '值不等'
          },
          neStrict: {
            title: '!==',
            description: '值或类型不等'
          },
          gt: {
            title: '>',
            description: '大于比较'
          },
          gte: {
            title: '>=',
            description: '大于等于'
          },
          lt: {
            title: '<',
            description: '小于比较'
          },
          lte: {
            title: '<=',
            description: '小于等于'
          }
        },
        logicOp: {
          and: {
            title: '&&',
            description: '逻辑与'
          },
          or: {
            title: '||',
            description: '逻辑或'
          },
          not: {
            title: '!',
            description: '逻辑非'
          },
          nullish: {
            title: '??',
            description: '空值合并'
          },
          optional: {
            title: '?.',
            description: '可选链'
          }
        },
        function: {
          define: {
            title: '定义函数',
            description: 'function 声明或箭头函数'
          },
          call: {
            title: '调用函数',
            description: '执行函数'
          },
          return: {
            title: '返回值',
            description: 'return 返回结果'
          },
          params: {
            title: '参数传递',
            description: '传递函数参数'
          },
          arrow: {
            title: '箭头函数',
            description: '箭头函数'
          }
        },
        storage: {
          writeFile: {
            title: '写入文件',
            description: '写入数据到临时文件'
          },
          readFile: {
            title: '读取文件',
            description: '读取本地文件数据'
          },
          submit: {
            title: '提交数据',
            description: '通过 API 提交数据到后端'
          }
        },
        delay: {
          fixed: {
            title: '固定延迟',
            description: '等待固定时间'
          },
          random: {
            title: '随机延迟',
            description: '等待随机时间（防反爬）'
          },
          element: {
            title: '等待元素',
            description: '等待页面元素出现'
          },
          condition: {
            title: '等待条件',
            description: '等待满足某个条件'
          }
        },
        antiBot: {
          ua: {
            title: 'User-Agent 设置',
            description: '设置随机 User-Agent'
          },
          proxy: {
            title: '代理设置',
            description: '使用代理 IP'
          },
          challenge: {
            title: '验证码/挑战页检测',
            description: '识别 Cloudflare、reCAPTCHA、hCaptcha、Turnstile'
          },
          headers: {
            title: '请求头伪装',
            description: '伪装浏览器请求头'
          },
          referer: {
            title: 'Referer 设置',
            description: '设置请求来源'
          }
        },
        helper: {
          comment: {
            title: '注释',
            description: '添加注释说明'
          },
          subflow: {
            title: '子流程',
            description: '封装 reusable 子流程'
          },
          timestamp: {
            title: '时间戳',
            description: '获取当前时间戳'
          },
          uuid: {
            title: 'UUID 生成',
            description: '生成唯一 ID'
          },
          hash: {
            title: '哈希计算',
            description: 'MD5、SHA 等哈希计算'
          }
        },
        browser: {
          launch: {
            title: '启动浏览器',
            description: '启动 Chrome/Firefox/Edge 浏览器'
          },
          close: {
            title: '关闭浏览器',
            description: '关闭浏览器实例'
          },
          openPage: {
            title: '打开页面',
            description: '打开指定 URL 页面'
          },
          closePage: {
            title: '关闭页面',
            description: '关闭当前页面'
          },
          navigate: {
            title: '页面导航',
            description: '在当前页面跳转到新 URL'
          },
          waitLoad: {
            title: '等待页面加载',
            description: '等待页面完全加载'
          },
          waitIdle: {
            title: '等待网络空闲',
            description: '等待网络请求完成'
          },
          screenshot: {
            title: '截图',
            description: '对当前页面截图'
          },
          html: {
            title: '获取页面 HTML',
            description: '获取页面完整 HTML'
          },
          url: {
            title: '获取页面 URL',
            description: '获取当前页面 URL'
          },
          refresh: {
            title: '页面刷新',
            description: '刷新当前页面'
          },
          back: {
            title: '页面回退',
            description: '浏览器回退'
          },
          forward: {
            title: '页面前进',
            description: '浏览器前进'
          }
        },
        element: {
          click: {
            title: '点击元素',
            description: '点击页面元素'
          },
          input: {
            title: '输入文本',
            description: '在输入框输入文本'
          },
          clear: {
            title: '清空输入',
            description: '清空输入框内容'
          },
          select: {
            title: '选择下拉框',
            description: '选择下拉框选项'
          },
          checkbox: {
            title: '勾选复选框',
            description: '勾选 / 取消勾选复选框'
          },
          radio: {
            title: '单选按钮选择',
            description: '选择单选按钮'
          },
          upload: {
            title: '文件上传',
            description: '上传文件到文件输入框'
          },
          hover: {
            title: '悬停元素',
            description: '鼠标悬停在元素上'
          },
          drag: {
            title: '拖拽元素',
            description: '拖拽元素到目标位置'
          },
          scrollToElement: {
            title: '滚动到元素',
            description: '滚动页面到元素位置'
          },
          scrollToPosition: {
            title: '滚动到位置',
            description: '滚动到指定坐标'
          },
          rightClick: {
            title: '右键点击',
            description: '右键点击元素'
          },
          doubleClick: {
            title: '双击',
            description: '双击元素'
          },
          setValue: {
            title: '设置值',
            description: '通用的设置元素值'
          },
          trigger: {
            title: '触发事件',
            description: '通用的触发元素事件'
          }
        },
        elementWait: {
          appear: {
            title: '等待元素出现',
            description: '等待元素在 DOM 中出现'
          },
          disappear: {
            title: '等待元素消失',
            description: '等待元素从 DOM 中消失'
          },
          visible: {
            title: '等待元素可见',
            description: '等待元素变为可见'
          },
          hidden: {
            title: '等待元素隐藏',
            description: '等待元素变为隐藏'
          },
          clickable: {
            title: '等待元素可点击',
            description: '等待元素可被点击'
          },
          exists: {
            title: '检查元素存在',
            description: '检查元素是否存在'
          },
          visibleCheck: {
            title: '检查元素可见',
            description: '检查元素是否可见'
          },
          clickableCheck: {
            title: '检查元素可点击',
            description: '检查元素是否可点击'
          },
          text: {
            title: '获取元素文本',
            description: '获取元素文本内容'
          },
          attr: {
            title: '获取元素属性',
            description: '获取元素属性值'
          },
          style: {
            title: '获取元素样式',
            description: '获取元素 CSS 样式'
          },
          count: {
            title: '获取元素数量',
            description: '获取匹配选择器的元素数量'
          }
        },
        form: {
          fill: {
            title: '填写表单',
            description: '批量填写表单字段'
          },
          submit: {
            title: '提交表单',
            description: '提交表单'
          },
          reset: {
            title: '重置表单',
            description: '重置表单到初始状态'
          },
          validate: {
            title: '表单验证',
            description: '验证表单字段'
          }
        },
        context: {
          switchTab: {
            title: '切换标签页',
            description: '切换到不同的浏览器标签'
          },
          openTab: {
            title: '打开新标签页',
            description: '打开新的标签页'
          },
          closeTab: {
            title: '关闭标签页',
            description: '关闭当前标签页'
          },
          switchFrame: {
            title: '切换 Frame',
            description: '切换到 iframe'
          },
          switchMainFrame: {
            title: '切换到主 Frame',
            description: '切回主文档'
          },
          switchDialog: {
            title: '切换弹窗',
            description: '切换到浏览器弹窗'
          },
          acceptDialog: {
            title: '接受弹窗',
            description: '接受 alert / confirm'
          },
          dismissDialog: {
            title: '拒绝弹窗',
            description: '拒绝 confirm'
          },
          promptText: {
            title: '输入弹窗文本',
            description: '在 prompt 中输入文本'
          }
        },
        cookie: {
          get: {
            title: '获取 Cookie',
            description: '获取页面 Cookie'
          },
          set: {
            title: '设置 Cookie',
            description: '设置 Cookie'
          },
          delete: {
            title: '删除 Cookie',
            description: '删除 Cookie'
          },
          localGet: {
            title: '获取 LocalStorage',
            description: '获取 LocalStorage 数据'
          },
          localSet: {
            title: '设置 LocalStorage',
            description: '设置 LocalStorage 数据'
          },
          sessionGet: {
            title: '获取 SessionStorage',
            description: '获取 SessionStorage 数据'
          },
          sessionSet: {
            title: '设置 SessionStorage',
            description: '设置 SessionStorage 数据'
          }
        },
        network: {
          intercept: {
            title: '拦截请求',
            description: '拦截网络请求'
          },
          modifyRequest: {
            title: '修改请求',
            description: '修改请求内容'
          },
          interceptResponse: {
            title: '拦截响应',
            description: '拦截网络响应'
          },
          modifyResponse: {
            title: '修改响应',
            description: '修改响应内容'
          },
          mock: {
            title: '模拟响应',
            description: 'Mock 响应数据'
          },
          list: {
            title: '获取请求列表',
            description: '获取所有网络请求'
          },
          wait: {
            title: '等待特定请求',
            description: '等待某个请求完成'
          }
        },
        js: {
          exec: {
            title: '执行页面脚本',
            description: '仅在 WebView2 原子能力不够时执行页面脚本'
          },
          execReturn: {
            title: '执行脚本并返回',
            description: '仅在必要时执行页面脚本并获取返回值'
          },
          inject: {
            title: '注入页面脚本',
            description: '仅在必要时注入外部脚本文件'
          },
          listen: {
            title: '添加事件监听',
            description: '仅在必要时为页面添加事件监听器'
          }
        }
      }
    }
  },
  executions: {
    title: '执行记录',
    status: {
      pending: '等待执行',
      running: '执行中',
      success: '成功',
      failed: '失败',
      stopped: '已停止'
    },
    duration: '耗时 {ms}ms',
    records: '抓取 {count} 条',
    empty: {
      title: '暂无执行记录',
      description: '还没有执行记录'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音乐'
      }
    }
  },
  execute: {}
};
