export const card = {
  machine: {
    unnamed: '未命名机器',
    local: '本机',
    remote: '远程'
  },
  actions: {
    addScene: '添加场景',
    details: '详情',
    edit: '编辑',
    delete: '删除'
  },
  fields: {
    machineCode: '机器代码',
    machineIdentity: '机器标识',
    machineFingerprint: '机器指纹',
    network: '网卡'
  },
  tooltips: {
    copyToClipboard: '复制到剪贴板'
  },
  stats: {
    scenes: '场景',
    enabled: '启用',
    disabled: '未启用'
  },
  scene: {
    unnamed: '未命名场景',
    enabled: '启用',
    disabled: '未启用'
  },
  dialogs: {
    deleteSceneTitle: '确认删除该场景？'
  },
  empty: {
    ipv4: {
      title: '暂无 IPv4 地址',
      description: '该机器暂未上报网卡 IPv4'
    },
    ipv6: {
      title: '暂无 IPv6 地址',
      description: '该机器暂未上报网卡 IPv6'
    },
    scenes: {
      title: '暂无场景',
      localDescription: '请点击右上角“添加场景”进行创建',
      remoteDescription: '远程机器暂不支持创建场景'
    },
    data: {
      title: '暂无数据',
      description: '未选择机器或数据未加载'
    }
  }
};
