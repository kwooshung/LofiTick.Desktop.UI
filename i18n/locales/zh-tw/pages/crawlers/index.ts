export const crawlers = {
  title: '爬蟲',
  targets: {
    addTask: '新增任務',
    edit: '編輯',
    empty: {
      title: '暫無資料夾',
      description: '目前沒有可顯示的爬蟲資料夾。'
    },
    menu: {
      open: '開啟',
      copyDomain: '複製網域',
      copyBaseUrl: '複製基礎地址'
    }
  },
  task: {
    actions: {
      execute: '執行任務',
      pause: '暫停任務',
      resume: '繼續任務',
      stop: '停止任務'
    },
    filters: {
      all: '全部',
      active: '進行中',
      paused: '已暫停',
      completed: '已完成',
      failed: '失敗'
    },
    footer: {
      total: '共 {total} 個任務'
    },
    progress: {
      indeterminate: '計算中',
      percent: '{value}%'
    },
    status: {
      pending: '等待中',
      resolving: '解析中',
      crawling: '爬取中',
      downloading: '下載中',
      paused: '已暫停',
      completed: '已完成',
      failed: '失敗',
      stopped: '已停止'
    },
    table: {
      preview: '預覽',
      task: '任務',
      status: '狀態',
      progress: '進度',
      transfer: '傳輸',
      speed: '速率',
      size: '大小',
      downloaded: '已下載',
      time: '時間',
      elapsed: '已用時間',
      remaining: '剩餘時間',
      items: '項目',
      updatedAt: '更新時間',
      actions: '操作'
    },
    unsupported: {
      name: '未知爬蟲',
      title: '暫不支援此爬蟲',
      description: '目前站點尚未接入爬蟲控制台。'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        name: 'Pixabay',
        page: {
          description: '管理 Pixabay 的爬取任務、執行模式與採集結果。',
          actions: {
            create: '新增爬取'
          },
          tasks: {
            empty: {
              title: '暫無 Pixabay 任務',
              description: '目前還沒有 Pixabay 爬取任務，後續任務列表會在這裡顯示。'
            }
          }
        },
        dialog: {
          title: '選擇 Pixabay 地址',
          description: '先輸入關鍵字，再按需要補頁碼，下方會即時顯示最終網址。',
          keywordLabel: '關鍵字',
          keywordPlaceholder: '請輸入關鍵字',
          keywordPreview: '關鍵字',
          pageLabel: '頁碼',
          typeLabel: '網址',
          urlLabel: '網址預覽',
          submit: '確認',
          cancel: '取消',
          types: {
            photos: '圖片：照片',
            illustrations: '圖片：插畫',
            vectors: '圖片：向量圖',
            videos: '影片：影片',
            gifs: '動圖：動圖',
            threeDModels: '圖片：3D 模型',
            music: '音頻：音樂',
            soundEffects: '音頻：音效'
          }
        }
      },
      suno: {
        name: 'Suno',
        dialog: {
          title: '執行 Suno 任務',
          description: 'Suno 任務執行設定尚未接入，後續會在這裡補充。',
          close: '關閉'
        },
        page: {
          description: '管理 Suno 的爬取任務、執行模式與採集結果。',
          tasks: {
            empty: {
              title: '暫無 Suno 任務',
              description: '目前還沒有 Suno 爬取任務，後續任務列表會在這裡顯示。'
            }
          }
        }
      }
    }
  }
};
