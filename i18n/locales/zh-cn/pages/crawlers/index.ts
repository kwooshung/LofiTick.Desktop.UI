export const crawlers = {
  title: '爬虫',
  targets: {
    addTask: '添加任务',
    edit: '编辑',
    empty: {
      title: '暂无文件夹',
      description: '当前还没有可展示的爬虫文件夹。'
    },
    menu: {
      open: '打开',
      copyDomain: '复制域名',
      copyBaseUrl: '复制基础地址'
    }
  },
  task: {
    actions: {
      execute: '执行任务',
      webviewShow: '显示窗口',
      webviewHide: '隐藏窗口',
      pause: '暂停任务',
      resume: '继续任务',
      stop: '停止任务'
    },
    filters: {
      all: '全部'
    },
    footer: {
      total: '共 {total} 个任务'
    },
    progress: {
      indeterminate: '计算中',
      percent: '{value}%'
    },
    status: {
      pending: '等待中',
      resolving: '解析中',
      crawling: '爬取中',
      downloading: '下载中',
      paused: '已暂停',
      completed: '已完成',
      failed: '失败',
      stopped: '已停止'
    },
    table: {
      task: '任务',
      name: '名称',
      status: '状态',
      progress: '进度',
      transfer: '传输',
      speed: '速率',
      size: '大小',
      downloaded: '已传输',
      time: '时间',
      elapsed: '已用时间',
      remaining: '剩余时间',
      items: '条目',
      updatedAt: '更新时间',
      actions: '操作'
    },
    unsupported: {
      name: '未知爬虫',
      title: '暂不支持该爬虫',
      description: '当前站点还没有接入爬虫控制台。'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        name: 'Pixabay',
        page: {
          description: '管理 Pixabay 的爬取任务、执行模式与采集结果。',
          actions: {
            create: '新建爬取'
          },
          tasks: {
            empty: {
              title: '暂无 Pixabay 任务',
              description: '当前还没有 Pixabay 爬取任务，后续任务列表会在这里展示。'
            }
          }
        },
        dialog: {
          title: '选择 Pixabay 地址',
          description: '先填关键词，再按需补页码，下面会实时显示最终链接。',
          keywordLabel: '搜索关键词',
          keywordPlaceholder: '请输入关键词',
          keywordPreview: '搜索关键词',
          pageLabel: '页码',
          typeLabel: '爬取地址',
          urlLabel: '对应网址',
          submit: '确认',
          cancel: '取消',
          types: {
            photos: '图片：照片',
            illustrations: '图片：插画',
            vectors: '图片：矢量',
            videos: '视频：视频',
            gifs: '动图：动图',
            threeDModels: '图片：3D 模型',
            music: '音频：音乐',
            soundEffects: '音频：音效'
          }
        }
      },
      suno: {
        name: 'Suno',
        dialog: {
          title: '执行 Suno 任务',
          description: 'Suno 任务执行配置暂未接入，后续会在这里补充。',
          close: '关闭'
        },
        page: {
          description: '管理 Suno 的爬取任务、执行模式与采集结果。',
          tasks: {
            empty: {
              title: '暂无 Suno 任务',
              description: '当前还没有 Suno 爬取任务，后续任务列表会在这里展示。'
            }
          }
        }
      }
    }
  }
};
