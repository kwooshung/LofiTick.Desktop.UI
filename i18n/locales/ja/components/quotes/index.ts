export const quotes = {
  search: {
    types: {
      0: 'その他',
      1: 'アニメ',
      2: 'マンガ',
      3: 'ゲーム',
      4: '文学',
      5: 'オリジナル',
      6: 'ネット',
      7: '映像作品',
      8: '詩',
      9: 'NetEase 音楽',
      10: '哲学',
      11: 'ネタ・一言'
    },
    header: {
      title: '名言を検索',
      startLabel: 'クリックして名言の検索を開始',
      conditions: '検索条件が設定されています'
    },
    body: {
      uuid: { placeholder: '一意の ID…' },
      content: { placeholder: '本文で検索…' },
      translate: { placeholder: '訳文で検索…' },
      type: { placeholder: '種類で検索…' },
      author: { placeholder: '作者で検索…' },
      source: { placeholder: '出典で検索…' }
    },
    footer: {
      match: {
        all: 'すべての条件を満たす（より厳密）',
        any: 'いずれかを満たせばよい（よりゆるやか）'
      }
    },
    selects: {
      content: '本文',
      translate: '訳文'
    },
    buttons: {
      reset: 'リセット',
      search: '検索'
    }
  }
};
