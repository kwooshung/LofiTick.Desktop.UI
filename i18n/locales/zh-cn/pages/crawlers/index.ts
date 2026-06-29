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
    sidebar: {
      tabs: {
        nodes: '节点',
        siteFunctions: '站点函数',
        globalFunctions: '全局函数'
      },
      loading: '函数列表加载中',
      row: {
        id: 'ID: {id}',
        reference: '引用 {count}',
        target: '站点 #{id}'
      },
      empty: {
        siteMissingTarget: '当前站点信息缺失，无法加载站点函数。',
        siteNoData: '当前站点暂无函数。',
        globalNoData: '当前暂无全局函数。',
        defaultDescription: '暂无条目',
        siteTitle: '暂无站点函数',
        globalTitle: '暂无全局函数',
        defaultTitle: '暂无条目'
      },
      actions: {
        createSiteFunction: '创建站点函数',
        createGlobalFunction: '创建全局函数',
        editLogic: '编辑逻辑',
        edit: '编辑',
        delete: '删除'
      },
      editModal: {
        title: '编辑函数信息',
        nameLabel: '函数名称',
        namePlaceholder: '请输入函数名称',
        descriptionLabel: '描述',
        descriptionPlaceholder: '请输入函数描述（可选）'
      },
      deleteModal: {
        title: '删除函数',
        description: '确定要删除函数「{name}」吗？此操作不可撤销。'
      },
      createModal: {
        titleSite: '创建站点函数',
        titleGlobal: '创建全局函数',
        scopeLabel: '作用域',
        scopeSite: '站点函数',
        scopeGlobal: '全局函数',
        nameLabel: '函数名称',
        namePlaceholder: '请输入函数名称',
        descriptionLabel: '描述',
        descriptionPlaceholder: '请输入函数描述（可选）',
        siteTargetRequired: '当前缺少站点上下文，无法创建站点函数。'
      }
    },
    empty: {
      title: '画布还没有节点',
      description: '从左侧拖拽一个蓝图节点到画布中，开始搭建爬虫流程。'
    },
    drag: {
      title: '松开鼠标即可放入节点',
      description: '当前蓝图节点会按鼠标位置插入到画布中。'
    },
    actions: {
      restore: '还原',
      zoomIn: '放大',
      zoomOut: '缩小',
      autoLayout: '自动排版',
      redo: '恢复',
      undo: '撤销'
    },
    draft: {
      saved: '草稿已自动保存'
    },
    saveFeedback: {
      title: '函数逻辑保存'
    },
    loadSource: {
      title: '逻辑面板加载完成',
      loading: '正在从服务端加载逻辑…',
      server: '已从服务端加载最新逻辑',
      draft: '服务端暂无可用数据，已从本地草稿恢复',
      default: '未找到可用逻辑，已加载默认空面板',
      fallbackRequestFailed: '服务端请求失败，已执行本地兜底。',
      fallbackNoMatchedData: '服务端响应未命中当前函数，已执行本地兜底。',
      persistMismatch: '已提交保存，但服务端回读结果与本地参数不一致，请重试或检查后端日志',
      saveSuccess: '函数逻辑已保存到服务器',
      saveFailed: '函数逻辑保存失败',
      saveFailedWithCode: '函数逻辑保存失败（{code}）',
      saveEchoMissing: '保存已提交，但未读取到最新函数详情'
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
  blueprints: {
    empty: {
      title: '暂无爬虫',
      description: '当前站点还没有创建任何爬虫，点击右上角“添加爬虫”开始创建。'
    },
    parameters: {
      title: '设置执行参数',
      description: '本次执行会使用这里填写的参数值，不会自动覆盖蓝图默认值。',
      fields: {
        stringPlaceholder: '请输入本次执行的参数值',
        jsonPlaceholder: '请输入合法 JSON',
        jsonInvalid: 'JSON 格式或数据类型不正确',
        description: '参数 ID：{id} · 类型：{type}'
      },
      actions: {
        execute: '使用当前值执行',
        saveDefaultAndExecute: '保存当前值为默认值并执行'
      }
    },
    table: {
      name: '名称',
      description: '描述',
      status: '执行状态',
      lastRunAt: '最后执行'
    },
    actions: {
      execute: '执行',
      pause: '暂停',
      stop: '停止',
      deleteConfirm: '确定要删除爬虫「{name}」吗？此操作不可撤销。',
      runSuccess: '已触发执行，正在运行。',
      stopSuccess: '已停止本次执行。',
      runFailed: '触发执行失败，请稍后重试。',
      deleteSuccess: '删除成功。',
      deleteFailed: '删除失败，请稍后重试。'
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
