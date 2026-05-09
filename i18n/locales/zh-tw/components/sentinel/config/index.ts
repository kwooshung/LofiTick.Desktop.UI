export const config = {
  labels: {
    onlineWindowSeconds: '在線視窗',
    heartbeatInterval: '場景應用心跳間隔',
    heartbeatTimeoutCount: '連續丟心跳次數',
    restartDelay: '重啟延時',
    restartMaxAttempts: '最大重啟',
    restartCooldown: '重啟冷卻',
    restartBurstWindow: '重啟爆發',
    restartBurstMaxAttempts: '最大爆發',
    restartBurstCooldown: '爆發冷卻'
  },
  units: {
    window: '視窗',
    interval: '間隔',
    count: '計數',
    delay: '延時',
    cooldown: '冷卻',
    seconds: '秒',
    milliseconds: '毫秒',
    times: '次數',
    consecutive: '連續',
    burst: '爆發'
  },
  badges: {
    heartbeat: '場景心跳',
    crash: '崩潰',
    wait: '等待',
    consecutiveRestart: '連續重啟',
    restartDelay: '重啟延時',
    maxRestart: '最大重啟',
    restartCooldown: '重啟冷卻',
    restartBurst: '重啟爆發'
  },
  desc: {
    onlineWindowSecondsAfterHeartbeat: '目前主機已啟用場景中的應用心跳到達後的在線判定視窗',
    heartbeatIntervalAfterHeartbeat: '目前主機已啟用場景中的應用心跳間隔，也是哨兵執行監護檢測的基準',
    crashCountPrefix: '目前主機已啟用場景中的應用連續丟失心跳',
    crashCountMiddle: '達到設定次數後判定為',
    restartDelayPrefix: '',
    restartDelayMiddle: '',
    restartDelaySuffix: '多久後才嘗試重啟',
    restartEpisodePrefix: '',
    restartEpisodeAfterConsecutive: '',
    restartEpisodeAfterCrash: '判定後，按',
    restartEpisodeAfterDelay: '的間隔反覆嘗試重啟；嘗試次數達到',
    restartEpisodeAfterMax: '後進入',
    restartCooldownPrefix: '當',
    restartCooldownMiddle: '的嘗試次數達到',
    restartCooldownSuffixBeforeNext: '後進入冷卻；冷卻結束後才允許下一輪',
    restartBurstWindowAfterConsecutive: '失敗次數達到本閾值時，計為 1 次',
    maxBurstAfterBurst: '允許觸發的總次數上限；達到後停止重啟',
    burstCooldownAfterBurst: '每觸發 1 次後，',
    burstCooldownAfterWait: '多久才允許繼續嘗試重啟'
  }
};
