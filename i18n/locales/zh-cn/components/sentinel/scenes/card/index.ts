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
    logs: '日志',
    details: '详情',
    edit: '编辑',
    delete: '删除'
  },
  fields: {
    machineCode: '机器代码',
    machineRemark: '机器备注',
    lastSeen: '最后在线',
    network: '网卡',
    logs: '日志',
    scenes: '场景列表'
  },
  tooltips: {
    copyToClipboard: '复制到剪贴板',
    editRemark: '编辑备注',
    saveRemark: '保存备注'
  },
  toast: {
    copiedPrefix: '已复制：',
    machineRemarkSaved: '机器备注保存成功',
    machineDeleted: '主机删除成功'
  },
  stats: {
    scenes: '场景',
    logs: '日志',
    machineLogs: '机器日志',
    sceneLogs: '场景日志',
    enabled: '启用',
    disabled: '未启用'
  },
  scene: {
    unnamed: '未命名场景',
    enabled: '启用',
    disabled: '未启用'
  },
  dialogs: {
    guardTitle: '场景守护',
    deleteSceneTitle: '确认删除该场景？',
    deleteMachineTitle: '确认删除该主机？'
  },
  logsMeta: {
    recoveryTitle: '恢复信息',
    labels: {
      reason: '原因',
      message: '消息',
      lastSeenAt: '心跳时间',
      recoveryState: '恢复状态',
      consecutiveMissedHeartbeats: '连续丢心跳次数',
      currentRestartCount: '当前重启次数',
      currentCycleCount: '当前周期数',
      currentBurstCount: '当前爆发次数',
      stopped: '已停止',
      nextRetryAt: '下次允许重试时间',
      offlineSince: '本轮离线起点'
    },
    values: {
      online: '在线',
      offline: '离线',
      error: '错误',
      idle: '空闲',
      stateChanged: '状态切换',
      heartbeatDetected: '检测到新心跳',
      recoveryEvaluation: '恢复评估',
      recoveryUnlockedAfterStopped: '检测到旧的停止状态，已自动解锁并继续重试',
      waiting: '等待',
      cleanup: '清理',
      restart: '重启',
      shutdown: '关闭',
      elevation: '提权',
      closing: '关闭中',
      pending: '等待中',
      cooldown: '冷却中',
      stopped: '已停止',
      queryRunningProcess: '查询运行中进程',
      closeOldProcess: '关闭旧进程',
      requestElevationCloseOldProcess: '申请提权关闭旧进程',
      requestElevationKillThenRestart: '申请提权先杀后启',
      checkExecPath: '检查可执行文件路径',
      startNewProcess: '启动新进程',
      requestElevationStart: '申请提权启动',
      executeSceneRestart: '执行场景应用重启',
      yes: '是',
      no: '否'
    },
    reasons: {
      unattendedDisabled: '无人值守未启用',
      machineCodeMissing: '机器码缺失',
      noEnabledScenes: '没有启用中的场景',
      settingsUnavailable: '设置不可用',
      remoteFetchFailed: '远端拉取失败',
      heartbeatMissing: '心跳缺失',
      heartbeatTimeout: '心跳超时',
      lastSeenInvalid: '最后在线时间无效'
    },
    summaries: {
      sentinelStatusOnline: '哨兵状态已切换为在线',
      sentinelStatusOffline: '哨兵状态已切换为离线',
      sentinelStatusError: '哨兵状态已切换为错误',
      sentinelStatusIdle: '哨兵状态已切换为空闲',
      heartbeatDetected: '检测到新的正常心跳',
      recoveryEvaluated: '哨兵已完成本轮恢复状态评估',
      waitForRetry: '哨兵本轮不重启，继续等待下一次判定',
      recoveryCleared: '哨兵已清理恢复状态',
      restartEntered: '哨兵已进入重启步骤并尝试拉起场景应用'
    },
    messages: {
      failedQueryRunningProcessBeforeShutdown: '关闭前查询场景应用运行中进程失败',
      noRunningProcessToShutdown: '未发现需要关闭的场景应用运行中进程',
      detectedRunningProcessToShutdown: '检测到场景应用仍在运行，准备主动关闭',
      oldProcessStopped: '场景应用旧进程已成功关闭',
      normalShutdownFailedNeedElevation: '普通权限关闭旧进程失败，准备申请提权后执行关闭',
      elevationShutdownSubmitted: '已申请提权关闭场景应用旧进程',
      elevationShutdownFailed: '申请提权关闭旧进程失败',
      skipRestartBecauseExecMissing: '跳过场景应用重启，因为可执行文件路径不存在',
      failedQueryRunningProcessBeforeRestart: '重启前查询场景应用运行中进程失败',
      detectedRunningProcessBeforeRestart: '检测到场景应用旧进程仍在运行，准备先关闭再重启',
      oldProcessStoppedBeforeRestart: '场景应用旧进程已成功关闭，准备进入重新启动步骤',
      normalKillThenRestartNeedElevation: '普通权限关闭旧进程失败，准备申请提权后执行先杀后启',
      elevationKillThenRestartSubmitted: '已申请提权执行先杀旧进程再重启场景应用',
      elevationKillThenRestartFailed: '申请提权先杀后启失败',
      preparingStartNewProcess: '准备启动场景应用新进程',
      newProcessStarted: '场景应用新进程已成功启动',
      normalStartFailedNeedElevation: '普通启动失败，已申请提权重新启动场景应用',
      normalStartFailedAndElevationFailed: '普通启动失败后，申请提权启动也失败了',
      newProcessStartFailed: '场景应用新进程启动失败'
    }
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
    logs: {
      title: '暂无日志',
      description: '当前还没有可展示的日志'
    },
    data: {
      title: '暂无数据',
      description: '未选择机器或数据未加载'
    }
  }
};
