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
    logs: 'ログ',
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
    logs: 'ログ',
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
    logs: 'ログ',
    machineLogs: 'マシンログ',
    sceneLogs: 'シーンログ',
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
  logsMeta: {
    recoveryTitle: '復旧情報',
    labels: {
      reason: '理由',
      message: 'メッセージ',
      lastSeenAt: 'ハートビート時刻',
      recoveryState: '復旧状態',
      consecutiveMissedHeartbeats: '連続ハートビート欠落回数',
      currentRestartCount: '現在の再起動回数',
      currentCycleCount: '現在の周期数',
      currentBurstCount: '現在のバースト回数',
      stopped: '停止済み',
      nextRetryAt: '次回再試行時刻',
      offlineSince: '今回のオフライン開始時刻'
    },
    values: {
      online: 'オンライン',
      offline: 'オフライン',
      error: 'エラー',
      idle: 'アイドル',
      stateChanged: '状態変更',
      heartbeatDetected: 'ハートビート検知',
      recoveryEvaluation: '復旧評価',
      waiting: '待機',
      cleanup: 'クリーンアップ',
      restart: '再起動',
      shutdown: '停止',
      elevation: '昇格',
      closing: '停止中',
      pending: '保留中',
      cooldown: 'クールダウン中',
      stopped: '停止済み',
      queryRunningProcess: '実行中プロセス確認',
      closeOldProcess: '旧プロセス停止',
      requestElevationCloseOldProcess: '昇格して旧プロセス停止',
      requestElevationKillThenRestart: '昇格して停止後に再起動',
      checkExecPath: '実行ファイルパス確認',
      startNewProcess: '新しいプロセスを起動',
      requestElevationStart: '昇格して起動',
      executeSceneRestart: 'シーンアプリを再起動',
      yes: 'はい',
      no: 'いいえ'
    },
    reasons: {
      unattendedDisabled: '無人運用が無効です',
      machineCodeMissing: 'マシンコードがありません',
      noEnabledScenes: '有効なシーンがありません',
      settingsUnavailable: '設定を取得できません',
      remoteFetchFailed: 'リモート状態の取得に失敗しました',
      heartbeatMissing: 'ハートビートがありません',
      heartbeatTimeout: 'ハートビートがタイムアウトしました',
      lastSeenInvalid: '最終接続時刻が不正です'
    },
    summaries: {
      sentinelStatusOnline: 'Sentinel の状態がオンラインに切り替わりました',
      sentinelStatusOffline: 'Sentinel の状態がオフラインに切り替わりました',
      sentinelStatusError: 'Sentinel の状態がエラーに切り替わりました',
      sentinelStatusIdle: 'Sentinel の状態がアイドルに切り替わりました',
      heartbeatDetected: '新しい正常なハートビートを検知しました',
      recoveryEvaluated: 'Sentinel は今回の復旧評価を完了しました',
      waitForRetry: 'この回は再起動せず、次の判定を待機します',
      recoveryCleared: 'Sentinel は復旧状態をクリアしました',
      restartEntered: 'Sentinel は再起動フローに入り、シーンアプリの再起動を試みています'
    },
    messages: {
      failedQueryRunningProcessBeforeShutdown: '停止前のシーンプロセス確認に失敗しました',
      noRunningProcessToShutdown: '停止対象のシーンプロセスは見つかりませんでした',
      detectedRunningProcessToShutdown: '実行中のシーンプロセスを検知したため停止します',
      oldProcessStopped: '旧シーンプロセスの停止に成功しました',
      normalShutdownFailedNeedElevation: '通常権限での停止に失敗したため、昇格を要求します',
      elevationShutdownSubmitted: '昇格して旧シーンプロセスを停止する要求を送信しました',
      elevationShutdownFailed: '昇格停止要求の送信に失敗しました',
      skipRestartBecauseExecMissing: '実行ファイルが存在しないため、シーンアプリの再起動をスキップしました',
      failedQueryRunningProcessBeforeRestart: '再起動前のシーンプロセス確認に失敗しました',
      detectedRunningProcessBeforeRestart: '旧シーンプロセスが動作中のため、停止後に再起動します',
      oldProcessStoppedBeforeRestart: '旧シーンプロセスの停止に成功し、再起動へ進みます',
      normalKillThenRestartNeedElevation: '通常権限で停止に失敗したため、昇格して停止後に再起動します',
      elevationKillThenRestartSubmitted: '昇格して停止後に再起動する要求を送信しました',
      elevationKillThenRestartFailed: '昇格して停止後に再起動する要求の送信に失敗しました',
      preparingStartNewProcess: '新しいシーンプロセスを起動する準備をしています',
      newProcessStarted: '新しいシーンプロセスの起動に成功しました',
      normalStartFailedNeedElevation: '通常起動に失敗したため、昇格して再起動する要求を送信しました',
      normalStartFailedAndElevationFailed: '通常起動にも昇格起動にも失敗しました',
      newProcessStartFailed: '新しいシーンプロセスの起動に失敗しました'
    }
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
    logs: {
      title: 'ログがありません',
      description: '表示できるログはまだありません'
    },
    data: {
      title: 'データがありません',
      description: 'マシン未選択、またはデータ未読み込み'
    }
  }
};
