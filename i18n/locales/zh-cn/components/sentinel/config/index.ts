export const config = {
  labels: {
    onlineWindowSeconds: '在线窗口',
    heartbeatInterval: '场景应用心跳间隔',
    heartbeatTimeoutCount: '连续丢心跳次数',
    restartDelay: '重启延时',
    restartMaxAttempts: '最大重启',
    restartCooldown: '重启冷却',
    restartBurstWindow: '重启爆发',
    restartBurstMaxAttempts: '最大爆发',
    restartBurstCooldown: '爆发冷却'
  },
  units: {
    window: '窗口',
    interval: '间隔',
    count: '计数',
    delay: '延时',
    cooldown: '冷却',
    seconds: '秒',
    milliseconds: '毫秒',
    times: '次数',
    consecutive: '连续',
    burst: '爆发'
  },
  badges: {
    heartbeat: '场景心跳',
    crash: '崩溃',
    wait: '等待',
    consecutiveRestart: '连续重启',
    restartDelay: '重启延时',
    maxRestart: '最大重启',
    restartCooldown: '重启冷却',
    restartBurst: '重启爆发'
  },
  desc: {
    onlineWindowSecondsAfterHeartbeat: '当前主机已启用场景中的应用心跳到达后的在线判定窗口',
    heartbeatIntervalAfterHeartbeat: '当前主机已启用场景中的应用心跳间隔，也是哨兵执行监护检查的基准',
    crashCountPrefix: '当前主机已启用场景中的应用连续丢失心跳',
    crashCountMiddle: '达到设定次数后判定为',
    restartDelayPrefix: '',
    restartDelayMiddle: '',
    restartDelaySuffix: '多久后才尝试重启',
    restartEpisodePrefix: '',
    restartEpisodeAfterConsecutive: '',
    restartEpisodeAfterCrash: '判定后，按',
    restartEpisodeAfterDelay: '的间隔反复尝试重启；尝试次数达到',
    restartEpisodeAfterMax: '后进入',
    restartCooldownPrefix: '当',
    restartCooldownMiddle: '的尝试次数达到',
    restartCooldownSuffixBeforeNext: '后进入冷却；冷却结束后才允许下一轮',
    restartBurstWindowAfterConsecutive: '失败次数达到本阈值时，计为 1 次',
    maxBurstAfterBurst: '允许触发的总次数上限；达到后停止重启',
    burstCooldownAfterBurst: '每触发 1 次后，',
    burstCooldownAfterWait: '多久才允许继续尝试重启'
  }
};
