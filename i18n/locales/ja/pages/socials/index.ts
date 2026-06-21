export const socials = {
  title: 'ソーシャル',
  result: {
    table: {
      id: 'ID',
      name: '名前',
      number: 'グループ番号',
      size: '人数',
      full: '満員',
      enabled: '有効',
      actions: '操作'
    },
    footer: {
      total: '合計 {total} 件'
    },
    filter: {
      full: '参加可能のみ'
    }
  },
  form: {
    name: { placeholder: 'グループ名...' },
    number: { placeholder: 'グループ番号...' },
    size: { placeholder: '人数...' },
    url: { placeholder: '招待リンク...' }
  },
  all: {
    title: 'すべて'
  },
  qq: {
    title: 'QQ',
    groups: {
      title: 'QQ グループ',
      all: {
        title: 'すべて'
      },
      result: {
        table: {
          id: 'ID',
          name: '名前',
          number: 'グループ番号',
          size: '人数',
          full: '満員',
          enabled: '有効',
          actions: '操作'
        },
        footer: {
          total: '合計 {total} 件'
        },
        filter: {
          full: '参加可能のみ'
        }
      },
      form: {
        name: {
          label: '名前',
          placeholder: 'グループ名...',
          verify: {
            required: '名前は必須です',
            length: '名前の長さが不正です'
          }
        },
        number: {
          label: 'グループ番号',
          placeholder: 'グループ番号...',
          verify: {
            required: 'グループ番号は必須です',
            pattern: 'グループ番号の形式が不正です'
          }
        },
        size: {
          label: '人数',
          placeholder: '人数...',
          item: '{count}人',
          verify: {
            required: '人数を選択してください',
            pattern: '人数が不正です'
          }
        },
        url: {
          label: '招待リンク',
          placeholder: '招待リンク...',
          verify: {
            required: '招待リンクは必須です',
            pattern: '招待リンクの形式が不正です'
          }
        },
        unique: {
          checking: '重複チェック中...',
          nameExists: '名前が既に存在します',
          numberExists: 'グループ番号は既に存在します'
        }
      },
      add: 'グループ追加',
      edit: '編集'
    }
  },
  wechat: {
    title: 'WeChat',
    groups: {
      title: 'WeChat グループ',
      add: 'グループ追加',
      edit: '編集'
    },
    subscription: {
      title: 'WeChat 公式アカウント',
      add: 'アカウント追加',
      edit: '編集'
    }
  },
  discord: {
    title: 'Discord チャンネル'
  }
};
