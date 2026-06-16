import { crawler } from '@@/i18n/locales/zh-cn/components/crawler';

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
  editor: {
    title: '爬虫逻辑',
    empty: {
      title: '画布还没有节点',
      description: '从左侧拖拽一个蓝图节点到画布中，开始搭建爬虫流程。'
    },
    drag: {
      title: '松开鼠标即可放入节点',
      description: '当前蓝图节点会按鼠标位置插入到画布中。'
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
  blueprint: crawler.blueprint
};
