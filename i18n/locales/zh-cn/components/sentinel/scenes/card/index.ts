export const card = {
  machine: {
    unnamed: '未命名机器',
    online: '在线',
    offline: '离线',
    local: '本机',
    remote: '远程'
  },
  actions: {
    addScene: '添加场景',
    deleteMachine: '删除主机',
    network: '网卡',
    details: '详情',
    edit: '编辑',
    delete: '删除'
  },
  fields: {
    machineCode: '机器代码',
    machineRemark: '机器备注',
    lastSeen: '最后在线',
    machineIdentity: '机器标识',
    network: '网卡',
    scenes: '场景列表'
  },
  tooltips: {
    copyToClipboard: '复制到剪贴板',
    editRemark: '编辑备注',
    saveRemark: '保存备注'
  },
  toast: {
    machineRemarkSaved: '机器备注保存成功',
    machineDeleted: '主机删除成功'
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
    deleteSceneTitle: '确认删除该场景？',
    deleteMachineTitle: '确认删除该主机？'
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
      localDescription: '当前机器还没有场景，请在下方创建',
      remoteDescription: '远程机器暂不支持创建场景'
    },
    data: {
      title: '暂无数据',
      description: '未选择机器或数据未加载'
    }
  }
};
