export const crawlers = {
  title: 'クローラー',
  targets: {
    addTask: 'タスクを追加',
    edit: '編集',
    empty: {
      title: 'クローラー用フォルダがありません',
      description: '現在表示できるフォルダはありません。'
    },
    menu: {
      open: '開く',
      copyDomain: 'ドメインをコピー',
      copyBaseUrl: 'ベース URL をコピー'
    }
  },
  task: {
    unsupported: {
      name: '不明なクローラー',
      title: 'このクローラーはまだ対応していません',
      description: 'このサイトのクローラーコンソールはまだ接続されていません。'
    }
  },
  spider: {
    title: 'スパイダー',
    websites: {
      pixabay: {
        name: 'Pixabay',
        page: {
          description: 'Pixabay のクロールタスク、実行モード、収集結果を管理します。',
          actions: {
            create: 'クロールを作成'
          },
          tasks: {
            empty: {
              title: 'Pixabay タスクはまだありません',
              description: '現在 Pixabay のクロールタスクはありません。今後ここにタスク一覧を表示します。'
            }
          }
        },
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
        name: 'Suno',
        page: {
          description: 'Suno のクロールタスク、実行モード、収集結果を管理します。',
          tasks: {
            empty: {
              title: 'Suno タスクはまだありません',
              description: '現在 Suno のクロールタスクはありません。今後ここにタスク一覧を表示します。'
            }
          }
        }
      }
    }
  }
};
