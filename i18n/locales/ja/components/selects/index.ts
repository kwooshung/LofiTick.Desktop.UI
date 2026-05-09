export const selects = {
  enabled: {
    placeholder: '状態で絞り込む',
    items: {
      all: 'すべて（状態を問わない）',
      enabled: '有効',
      disabled: '無効'
    }
  },
  full: {
    placeholder: '満員状態で絞り込む',
    items: {
      all: 'すべて（満員状態を問わない）',
      full: '満員',
      not_full: '空きあり'
    }
  },
  pagesizes: {
    placeholder: '1 ページあたりの件数',
    item: '1 ページあたり {count} 件'
  }
};
