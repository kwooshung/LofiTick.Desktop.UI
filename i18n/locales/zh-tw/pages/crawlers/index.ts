export const crawlers = {
  title: '爬蟲',
  targets: {
    title: '站點',
    empty: {
      title: '暫無目標網站',
      description: '還沒有添加任何爬蟲目標網站，點擊上方按鈕添加'
    }
  },
  executions: {
    title: '執行記錄',
    status: {
      pending: '等待執行',
      running: '執行中',
      success: '成功',
      failed: '失敗',
      stopped: '已停止'
    },
    duration: '耗時 {ms}ms',
    records: '抓取 {count} 條',
    empty: {
      title: '暫無執行記錄',
      description: '還沒有執行記錄'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音樂'
      }
    }
  },
  execute: {}
};