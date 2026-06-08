export const crawlers = {
  title: 'クローラー',
  search: {
    header: {
      title: 'クローラーを検索',
      startLabel: 'クリックしてクローラーを検索',
      conditions: '検索条件が設定されています'
    },
    body: {
      keyword: {
        placeholder: 'サイト名または説明を検索'
      },
      enabled: {
        placeholder: '有効状態で絞り込む'
      }
    }
  },
  targets: {
    title: 'サイト',
    add: 'サイトを追加',
    edit: 'サイトを編集',
    addTask: 'タスクを追加',
    menu: {
      open: 'サイトを開く',
      copyDomain: 'ドメインをコピー',
      copyBaseUrl: 'サイトURLをコピー',
      openBaseUrl: 'ブラウザで開く'
    },
    empty: {
      title: '対象サイトがありません',
      description: 'クローラー対象サイトが追加されていません。上のボタンをクリックして追加してください。'
    },
    form: {
      name: {
        label: 'サイト名',
        placeholder: 'サイト名を入力',
        verify: {
          required: 'サイト名は必須です',
          length: 'サイト名は255文字以内で入力してください'
        }
      },
      domain: {
        label: 'ドメイン',
        placeholder: 'ドメインを入力（例：weibo.com）',
        verify: {
          required: 'ドメインは必須です',
          length: 'ドメインは255文字以内で入力してください',
          pattern: 'ドメイン形式が不正です'
        }
      },
      baseUrl: {
        label: 'ベースURL',
        placeholder: 'ベースURLを入力（例：https://weibo.com）',
        verify: {
          required: 'ベースURLは必須です',
          length: 'ベースURLは255文字以内です',
          pattern: 'URL形式が不正です'
        }
      },
      description: {
        label: '説明',
        placeholder: '説明を入力'
      },
      isEnabled: {
        label: '有効'
      },
      unique: {
        checking: '一意性を確認中...',
        domainExists: 'このドメインは既に存在します'
      }
    }
  },
  executions: {
    title: '実行記録',
    status: {
      pending: '待機中',
      running: '実行中',
      success: '成功',
      failed: '失敗',
      stopped: '停止済み'
    },
    duration: '所要時間 {ms}ms',
    records: '{count} 件を取得',
    empty: {
      title: '実行記録がありません',
      description: 'まだ実行記録がありません'
    }
  },
  spider: {
    title: 'スパイダー',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音楽'
      }
    }
  },
  execute: {}
};
