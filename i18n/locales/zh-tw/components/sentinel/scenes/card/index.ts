export const card = {
  machine: {
    unnamed: '未命名機器',
    online: '在線',
    offline: '離線',
    local: '本機',
    remote: '遠端'
  },
  actions: {
    addScene: '新增場景',
    deleteMachine: '刪除主機',
    network: '網卡',
    logs: '日誌',
    details: '詳情',
    edit: '編輯',
    delete: '刪除'
  },
  fields: {
    machineCode: '機器碼',
    machineRemark: '機器備註',
    lastSeen: '最後在線',
    machineIdentity: '機器 UUID',
    network: '網卡',
    logs: '日誌',
    scenes: '場景列表'
  },
  tooltips: {
    copyToClipboard: '複製到剪貼簿',
    editRemark: '編輯備註',
    saveRemark: '儲存備註'
  },
  toast: {
    machineRemarkSaved: '機器備註已儲存',
    machineDeleted: '主機已刪除'
  },
  stats: {
    scenes: '場景',
    logs: '日誌',
    machineLogs: '機器日誌',
    sceneLogs: '場景日誌',
    enabled: '啟用',
    disabled: '未啟用'
  },
  scene: {
    unnamed: '未命名場景',
    enabled: '啟用',
    disabled: '未啟用'
  },
  dialogs: {
    deleteSceneTitle: '確認刪除此場景？',
    deleteMachineTitle: '確認刪除此主機？'
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
      localDescription: '目前這台機器還沒有場景，請在下方建立',
      remoteDescription: '遠端機器暫不支援建立場景'
    },
    logs: {
      title: '暫無日誌',
      description: '目前尚無可顯示的日誌'
    },
    data: {
      title: '暫無資料',
      description: '尚未選擇機器或資料尚未載入'
    }
  }
};
