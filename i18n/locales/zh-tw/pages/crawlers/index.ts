export const crawlers = {
  title: '爬蟲',
  targets: {
    empty: {
      title: '暫無資料夾',
      description: '目前沒有可顯示的爬蟲資料夾。'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音樂',
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
        name: 'Suno'
      }
    }
  }
};
