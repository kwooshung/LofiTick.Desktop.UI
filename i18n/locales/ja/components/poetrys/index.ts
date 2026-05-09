export const poetrys = {
  search: {
    header: {
      title: '詩を検索',
      startLabel: 'クリックして詩の検索を開始',
      conditions: '検索条件が設定されています'
    },
    body: {
      title: { placeholder: 'タイトルで検索…' },
      content: { placeholder: '本文で検索…' },
      dynasty: { placeholder: '時代で検索…' },
      author: { placeholder: '作者で検索…' }
    },
    footer: {
      match: {
        all: 'すべての条件を満たす（より厳密）',
        any: 'いずれかを満たせばよい（よりゆるやか）'
      }
    },
    selects: {
      author: '作者',
      dynasty: '時代'
    },
    buttons: {
      reset: 'リセット',
      search: '検索'
    }
  }
};
