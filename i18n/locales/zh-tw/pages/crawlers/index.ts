export const crawlers = {
  title: '爬蟲',
  searchPlaceholder: '搜索名稱或描述',
  targets: {
    title: '站點',
    add: '新增站點',
    edit: '編輯站點',
    addTask: '添加任務',
    empty: {
      title: '暫無目標網站',
      description: '還沒有添加任何爬蟲目標網站，點擊上方按鈕添加'
    },
    form: {
      name: {
        label: '網站名稱',
        placeholder: '請輸入網站名稱',
        verify: {
          required: '網站名稱不能為空',
          length: '網站名稱不能超過255個字符'
        }
      },
      domain: {
        label: '域名',
        placeholder: '請輸入域名，如 weibo.com',
        verify: {
          required: '域名不能為空',
          length: '域名不能超過255個字符',
          pattern: '域名格式不正確'
        }
      },
      baseUrl: {
        label: '基礎URL',
        placeholder: '請輸入基礎URL，如 https://weibo.com',
        verify: {
          required: '基礎URL不能為空',
          length: '基礎URL不能超過255個字元',
          pattern: '基礎URL格式不正確'
        }
      },
      description: {
        label: '描述',
        placeholder: '請輸入描述'
      },
      isEnabled: {
        label: '是否啟用'
      },
      unique: {
        checking: '正在檢查唯一性...',
        domainExists: '該域名已存在'
      }
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
