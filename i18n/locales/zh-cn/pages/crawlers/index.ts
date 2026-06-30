export const crawlers = {
  title: '爬虫',
  targets: {
    empty: {
      title: '暂无文件夹',
      description: '当前还没有可展示的爬虫文件夹。'
    }
  },
  spider: {
    title: '蜘蛛',
    websites: {
      pixabay: {
        name: 'Pixabay',
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
        name: 'Suno'
      }
    }
  }
};
