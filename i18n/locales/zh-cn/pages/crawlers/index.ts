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
      title: '爬虫逻辑',
      description: '从左侧挑选节点，在右侧拼装爬虫任务流程'
    },
    nodes: {
      groups: {
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
        logic: {
          title: '逻辑与变量',
          description: '用于条件判断、类型节点与循环'
        },
        debug: {
          title: '调试与辅助',
          description: '用于日志、预览和失败重试'
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
          retry: {
            title: '重试机制',
            description: '失败后自动重试'
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
