export const card = {
  machine: {
    unnamed: '名称未設定のマシン',
    online: 'オンライン',
    offline: 'オフライン',
    local: '本機',
    remote: 'リモート'
  },
  actions: {
    addScene: 'シーンを追加',
    deleteMachine: 'マシンを削除',
    network: 'ネットワーク',
    details: '詳細',
    edit: '編集',
    delete: '削除'
  },
  fields: {
    machineCode: 'マシンID',
    machineRemark: 'マシン備考',
    lastSeen: '最終接続',
    machineIdentity: 'マシンUUID',
    network: 'ネットワーク',
    scenes: 'シーン一覧'
  },
  tooltips: {
    copyToClipboard: 'クリップボードにコピー',
    editRemark: '備考を編集',
    saveRemark: '備考を保存'
  },
  toast: {
    machineRemarkSaved: 'マシン備考を保存しました',
    machineDeleted: 'マシンを削除しました'
  },
  stats: {
    scenes: 'シーン',
    enabled: '有効',
    disabled: '無効'
  },
  scene: {
    unnamed: '名称未設定のシーン',
    enabled: '有効',
    disabled: '無効'
  },
  dialogs: {
    deleteSceneTitle: 'このシーンを削除しますか？',
    deleteMachineTitle: 'このマシンを削除しますか？'
  },
  empty: {
    ipv4: {
      title: 'IPv4 アドレスなし',
      description: 'このマシンは IPv4 をまだ報告していません'
    },
    ipv6: {
      title: 'IPv6 アドレスなし',
      description: 'このマシンは IPv6 をまだ報告していません'
    },
    scenes: {
      title: 'シーンがありません',
      localDescription: 'このマシンにはまだシーンがありません。下のボタンから作成してください',
      remoteDescription: 'リモート端末ではシーンを作成できません'
    },
    data: {
      title: 'データがありません',
      description: 'マシン未選択、またはデータ未読み込み'
    }
  }
};
