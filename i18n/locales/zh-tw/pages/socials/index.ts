export const socials = {
  title: '社交',
  result: {
    table: {
      id: '編號',
      name: '名稱',
      number: '群號',
      size: '人數',
      full: '滿員',
      enabled: '啟用',
      updatedAt: '更新時間',
      createdAt: '建立時間',
      actions: '操作'
    },
    footer: {
      total: '共 {total} 筆結果'
    },
    filter: {
      full: '僅顯示可加入'
    }
  },
  form: {
    name: { placeholder: '群名稱...' },
    number: { placeholder: '群號...' },
    size: { placeholder: '群規模...' },
    url: { placeholder: '邀請連結...' }
  },
  all: {
    title: '全部'
  },
  qq: {
    title: 'QQ',
    groups: {
      title: 'QQ 群',
      all: {
        title: '全部'
      },
      result: {
        table: {
          id: '編號',
          name: '名稱',
          number: '群號',
          size: '人數',
          full: '滿員',
          enabled: '啟用',
          updatedAt: '更新時間',
          createdAt: '建立時間',
          actions: '操作'
        },
        footer: {
          total: '共 {total} 筆結果'
        },
        filter: {
          full: '僅顯示可加入'
        }
      },
      form: {
        name: {
          label: '名稱',
          placeholder: '群名稱...',
          verify: {
            required: '群名稱不能為空',
            length: '群名稱長度不符合要求'
          }
        },
        number: {
          label: '群號',
          placeholder: '群號...',
          verify: {
            required: '群號不能為空',
            pattern: '群號格式不正確'
          }
        },
        size: {
          label: '人數',
          placeholder: '群規模...',
          item: '{count}人',
          verify: {
            required: '請選擇群規模',
            pattern: '群規模不合法'
          }
        },
        url: {
          label: '邀請連結',
          placeholder: '邀請連結...',
          verify: {
            required: '邀請連結不能為空',
            pattern: '邀請連結格式不正確'
          }
        },
        unique: {
          checking: '正在查重...',
          nameExists: '名稱已存在',
          numberExists: '群號已存在'
        }
      },
      add: '新增群',
      edit: '編輯'
    }
  },
  wechat: {
    title: '微信',
    groups: {
      title: '微信群',
      add: '新增群',
      edit: '編輯'
    },
    subscription: {
      title: '微信公眾號',
      add: '新增公眾號',
      edit: '編輯'
    }
  },
  discord: {
    title: 'Discord 頻道'
  }
};
