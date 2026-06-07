export const crawlers = {
  title: 'クローラー',
  searchPlaceholder: '名前または説明で検索',
  targets: {
    title: 'サイト',
    empty: {
      title: '対象サイトがありません',
      description: 'クローラー対象サイトが追加されていません。上のボタンをクリックして追加してください。'
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