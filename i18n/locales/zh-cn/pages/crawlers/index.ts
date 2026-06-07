export const crawlers = {
  title: '爬虫',
  searchPlaceholder: '搜索名称或描述',
  targets: {
    title: '站点',
    empty: {
      title: '暂无目标站点',
      description: '还没有添加任何爬虫目标站点，点击上方按钮添加'
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
