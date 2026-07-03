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
    actions: {
      execute: 'タスクを実行',
      browserSessionShow: 'ウィンドウを表示',
      browserSessionHide: 'ウィンドウを非表示',
      pause: 'タスクを一時停止',
      resume: 'タスクを再開',
      stop: 'タスクを停止',
      stopConfirmTitle: '現在のタスクを停止しますか？',
      stopConfirmDescription: '停止するとクローラーウィンドウを閉じ、実行状態をクリアします。',
      stopCancel: 'キャンセル',
      stopConfirm: '停止'
    },
    filters: {
      all: 'すべて'
    },
    footer: {
      total: '全 {total} 件のタスク'
    },
    progress: {
      indeterminate: '計算中',
      percent: '{value}%'
    },
    status: {
      pending: '待機中',
      resolving: '解析中',
      crawling: 'クロール中',
      downloading: 'ダウンロード中',
      paused: '一時停止',
      completed: '完了',
      failed: '失敗',
      stopped: '停止済み'
    },
    table: {
      task: 'タスク',
      name: '名前',
      status: '状態',
      progress: '進捗',
      transfer: '転送',
      speed: '速度',
      size: 'サイズ',
      downloaded: '転送済み',
      time: '時間',
      elapsed: '経過時間',
      remaining: '残り時間',
      items: '項目',
      updatedAt: '更新日時',
      actions: '操作'
    },
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
        dialog: {
          title: 'Suno タスクを実行',
          description: 'Suno タスクの実行設定はまだ接続されていません。今後ここに表示します。',
          close: '閉じる'
        },
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
