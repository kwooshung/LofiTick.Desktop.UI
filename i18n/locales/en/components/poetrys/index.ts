export const poetrys = {
  search: {
    header: {
      title: 'Search poems',
      startLabel: 'Click to start searching poems',
      conditions: 'Search filters applied'
    },
    body: {
      title: { placeholder: 'Search by title…' },
      content: { placeholder: 'Search by content…' },
      dynasty: { placeholder: 'Search by dynasty…' },
      author: { placeholder: 'Search by author…' },
      tag: { placeholder: 'Search by tag…' }
    },
    footer: {
      match: {
        all: 'All conditions must match (more precise)',
        any: 'Any condition can match (more flexible)'
      }
    },
    selects: {
      author: 'Author',
      dynasty: 'Dynasty',
      tag: 'Tag'
    },
    buttons: {
      reset: 'Reset',
      search: 'Search'
    }
  }
};
