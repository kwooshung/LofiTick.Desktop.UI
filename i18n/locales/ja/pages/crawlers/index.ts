export const crawlers = {
  title: 'クローラー',
  targets: {
    empty: {
      title: 'クローラー用フォルダがありません',
      description: '現在表示できるフォルダはありません。'
    }
  },
  spider: {
    title: 'スパイダー',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音楽',
        dialog: {
          title: 'Pixabay のURLを選択',
          description: 'まずキーワードを入力し、必要ならページ番号を追加すると、下に最終URLを表示します。',
          keywordLabel: 'キーワード',
          keywordPlaceholder: 'キーワードを入力',
          keywordPreview: 'キーワード',
          pageLabel: 'ページ',
          typeLabel: 'URL',
          urlLabel: 'URL プレビュー',
          submit: '確定',
          cancel: 'キャンセル',
          types: {
            photos: '画像：写真',
            illustrations: '画像：イラスト',
            vectors: '画像：ベクター',
            videos: '動画：動画',
            gifs: 'GIF：GIF',
            threeDModels: '画像：3D モデル',
            music: '音声：音楽',
            soundEffects: '音声：効果音'
          }
        }
      },
      suno: {
        name: 'Suno'
      }
    }
  }
};
