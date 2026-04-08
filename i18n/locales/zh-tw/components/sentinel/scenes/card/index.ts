export const card = {
  machine: {
    unnamed: '未命名機器',
    local: '本機',
    remote: '遠端'
  },
  actions: {
    addScene: '新增場景',
    details: '詳情',
    edit: '編輯',
    delete: '刪除'
  },
  fields: {
    machineCode: '機器碼',
    machineIdentity: '機器 UUID',
    machineFingerprint: '機器指紋',
    network: '網卡'
  },
  tooltips: {
    copyToClipboard: '複製到剪貼簿'
  },
  stats: {
    scenes: '場景',
    enabled: '啟用',
    disabled: '未啟用'
  },
  scene: {
    unnamed: '未命名場景',
    enabled: '啟用',
    disabled: '未啟用'
  },
  dialogs: {
    deleteSceneTitle: '確認刪除此場景？'
  },
  empty: {
    ipv4: {
      title: '暫無 IPv4 位址',
      description: '此機器尚未回報網卡 IPv4'
    },
    ipv6: {
      title: '暫無 IPv6 位址',
      description: '此機器尚未回報網卡 IPv6'
    },
    scenes: {
      title: '暫無場景',
      localDescription: '請點擊右上角「新增場景」進行建立',
      remoteDescription: '遠端機器暫不支援建立場景'
    },
    data: {
      title: '暫無資料',
      description: '尚未選擇機器或資料尚未載入'
    }
  }
};
