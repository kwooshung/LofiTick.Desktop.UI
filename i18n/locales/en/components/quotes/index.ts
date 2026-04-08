export const quotes = {
  search: {
    types: {
      0: 'Other',
      1: 'Anime',
      2: 'Manga',
      3: 'Game',
      4: 'Literature',
      5: 'Original',
      6: 'Internet',
      7: 'Film & TV',
      8: 'Poetry',
      9: 'NetEase Music',
      10: 'Philosophy',
      11: 'Witty lines'
    },
    header: {
      title: 'Search quotes',
      startLabel: 'Click to start searching quotes',
      conditions: 'Search filters applied'
    },
    body: {
      uuid: { placeholder: 'Unique ID…' },
      content: { placeholder: 'Search by content…' },
      translate: { placeholder: 'Search by translation…' },
      type: { placeholder: 'Search by type…' },
      author: { placeholder: 'Search by author…' },
      source: { placeholder: 'Search by source…' }
    },
    footer: {
      match: {
        all: 'All conditions must match (more precise)',
        any: 'Any condition can match (more flexible)'
      }
    },
    selects: {
      content: 'Content',
      translate: 'Translation'
    },
    buttons: {
      reset: 'Reset',
      search: 'Search'
    }
  }
};
