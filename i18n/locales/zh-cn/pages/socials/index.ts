export const socials = {
  title: '社交',
  result: {
    table: {
      id: '编号',
      name: '名称',
      number: '群号',
      size: '人数',
      full: '满员',
      enabled: '启用',
      actions: '操作'
    },
    footer: {
      total: '共 {total} 条结果'
    },
    filter: {
      full: '是否满员'
    }
  },
  form: {
    name: { placeholder: '群名称...' },
    number: { placeholder: '群号...' },
    size: { placeholder: '群规模...' },
    url: { placeholder: '群链接...' }
  },
  all: {
    title: '所有'
  },
  qq: {
    title: 'Q 号',
    groups: {
      title: 'Q 群',
      all: {
        title: '所有'
      },
      result: {
        table: {
          id: '编号',
          name: '名称',
          number: '群号',
          size: '人数',
          full: '满员',
          enabled: '启用',
          actions: '操作'
        },
        footer: {
          total: '共 {total} 条结果'
        },
        filter: {
          full: '是否满员'
        }
      },
      form: {
        name: {
          label: '名称',
          placeholder: '请输入群名称',
          verify: {
            required: '群名称不能为空',
            length: '群名称长度不符合要求'
          }
        },
        number: {
          label: '群号',
          placeholder: '请输入 QQ 群号',
          verify: {
            required: '群号不能为空',
            pattern: '群号格式不正确'
          }
        },
        size: {
          label: '人数',
          placeholder: '选择群规模（人数上限）',
          item: '{count}人',
          verify: {
            required: '请选择群规模',
            pattern: '群规模不合法'
          }
        },
        url: {
          label: '群链接',
          placeholder: '粘贴群链接（https://...）',
          verify: {
            required: '群链接不能为空',
            pattern: '群链接格式不正确'
          }
        },
        unique: {
          checking: '正在查重...',
          nameExists: '名称已存在',
          numberExists: '群号已存在'
        }
      },
      add: '添加群',
      edit: '编辑'
    }
  },
  wechat: {
    title: '微信',
    groups: {
      title: '微信群',
      add: '添加群',
      edit: '编辑'
    },
    subscription: {
      title: '微信公众号',
      add: '添加公众号',
      edit: '编辑'
    }
  },
  discord: {
    title: 'Discord 频道'
  }
};
