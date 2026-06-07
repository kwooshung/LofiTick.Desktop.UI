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
  logsMeta: {
    recoveryTitle: '恢復資訊',
    labels: {
      reason: '原因',
      message: '訊息',
      lastSeenAt: '心跳時間',
      recoveryState: '恢復狀態',
      consecutiveMissedHeartbeats: '連續丟心跳次數',
      currentRestartCount: '目前重啟次數',
      currentCycleCount: '目前週期數',
      currentBurstCount: '目前爆發次數',
      stopped: '已停止',
      nextRetryAt: '下次允許重試時間',
      offlineSince: '本輪離線起點'
    },
    values: {
      online: '在線',
      offline: '離線',
      error: '錯誤',
      idle: '空閒',
      stateChanged: '狀態切換',
      heartbeatDetected: '檢測到新心跳',
      recoveryEvaluation: '恢復評估',
      recoveryUnlockedAfterStopped: '檢測到舊的停止狀態，已自動解鎖並繼續重試',
      waiting: '等待',
      cleanup: '清理',
      restart: '重啟',
      shutdown: '關閉',
      elevation: '提權',
      closing: '關閉中',
      pending: '等待中',
      cooldown: '冷卻中',
      stopped: '已停止',
      queryRunningProcess: '查詢執行中程序',
      closeOldProcess: '關閉舊程序',
      requestElevationCloseOldProcess: '申請提權關閉舊程序',
      requestElevationKillThenRestart: '申請提權先殺後啟',
      checkExecPath: '檢查可執行檔路徑',
      startNewProcess: '啟動新程序',
      requestElevationStart: '申請提權啟動',
      executeSceneRestart: '執行場景應用重啟',
      yes: '是',
      no: '否'
    },
    reasons: {
      unattendedDisabled: '無人值守未啟用',
      machineCodeMissing: '機器碼缺失',
      noEnabledScenes: '沒有啟用中的場景',
      settingsUnavailable: '設定不可用',
      remoteFetchFailed: '遠端擷取失敗',
      heartbeatMissing: '心跳缺失',
      heartbeatTimeout: '心跳超時',
      lastSeenInvalid: '最後在線時間無效'
    },
    summaries: {
      sentinelStatusOnline: '哨兵狀態已切換為在線',
      sentinelStatusOffline: '哨兵狀態已切換為離線',
      sentinelStatusError: '哨兵狀態已切換為錯誤',
      sentinelStatusIdle: '哨兵狀態已切換為空閒',
      heartbeatDetected: '檢測到新的正常心跳',
      recoveryEvaluated: '哨兵已完成本輪恢復狀態評估',
      waitForRetry: '哨兵本輪不重啟，繼續等待下一次判定',
      recoveryCleared: '哨兵已清理恢復狀態',
      restartEntered: '哨兵已進入重啟步驟並嘗試重新拉起場景應用'
    },
    messages: {
      failedQueryRunningProcessBeforeShutdown: '關閉前查詢場景應用執行中程序失敗',
      noRunningProcessToShutdown: '未發現需要關閉的場景應用執行中程序',
      detectedRunningProcessToShutdown: '檢測到場景應用仍在執行，準備主動關閉',
      oldProcessStopped: '場景應用舊程序已成功關閉',
      normalShutdownFailedNeedElevation: '一般權限關閉舊程序失敗，準備申請提權後執行關閉',
      elevationShutdownSubmitted: '已申請提權關閉場景應用舊程序',
      elevationShutdownFailed: '申請提權關閉舊程序失敗',
      skipRestartBecauseExecMissing: '因可執行檔路徑不存在，已跳過場景應用重啟',
      failedQueryRunningProcessBeforeRestart: '重啟前查詢場景應用執行中程序失敗',
      detectedRunningProcessBeforeRestart: '檢測到場景應用舊程序仍在執行，準備先關閉再重啟',
      oldProcessStoppedBeforeRestart: '場景應用舊程序已成功關閉，準備進入重新啟動步驟',
      normalKillThenRestartNeedElevation: '一般權限關閉舊程序失敗，準備申請提權後執行先殺後啟',
      elevationKillThenRestartSubmitted: '已申請提權執行先殺舊程序再重啟場景應用',
      elevationKillThenRestartFailed: '申請提權先殺後啟失敗',
      preparingStartNewProcess: '準備啟動場景應用新程序',
      newProcessStarted: '場景應用新程序已成功啟動',
      normalStartFailedNeedElevation: '一般啟動失敗，已申請提權重新啟動場景應用',
      normalStartFailedAndElevationFailed: '一般啟動失敗後，申請提權啟動也失敗了',
      newProcessStartFailed: '場景應用新程序啟動失敗'
    }
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
