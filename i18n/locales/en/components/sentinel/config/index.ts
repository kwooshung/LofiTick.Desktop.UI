export const config = {
  labels: {
    heartbeatInterval: 'Heartbeat interval',
    heartbeatTimeoutCount: 'Crash count',
    restartDelay: 'Restart delay',
    restartMaxAttempts: 'Max restarts',
    restartCooldown: 'Restart cooldown',
    restartBurstWindow: 'Restart burst',
    restartBurstMaxAttempts: 'Max bursts',
    restartBurstCooldown: 'Burst cooldown'
  },
  units: {
    interval: 'Interval',
    count: 'Count',
    delay: 'Delay',
    cooldown: 'Cooldown',
    milliseconds: 'ms',
    times: 'times',
    consecutive: 'Consecutive',
    burst: 'Burst'
  },
  badges: {
    heartbeat: 'Heartbeat',
    crash: 'Crash',
    wait: 'Wait',
    consecutiveRestart: 'Consecutive restart',
    restartDelay: 'Restart delay',
    maxRestart: 'Max restarts',
    restartCooldown: 'Restart cooldown',
    restartBurst: 'Restart burst'
  },
  desc: {
    heartbeatIntervalAfterHeartbeat: 'Interval between app heartbeats and monitoring checks',
    crashCountPrefix: 'Consecutive heartbeat misses',
    crashCountMiddle: 'reach the configured count, then mark as',
    restartDelayPrefix: '',
    restartDelayMiddle: '',
    restartDelaySuffix: 'how long before attempting restart',
    restartEpisodePrefix: '',
    restartEpisodeAfterConsecutive: '',
    restartEpisodeAfterCrash: 'is detected, retry restart at',
    restartEpisodeAfterDelay: 'interval; when attempts reach',
    restartEpisodeAfterMax: ', enter',
    restartCooldownPrefix: 'When',
    restartCooldownMiddle: 'attempts reach',
    restartCooldownSuffixBeforeNext: ', enter cooldown; once finished, allow the next',
    restartBurstWindowAfterConsecutive: 'failures reach this threshold, count as 1',
    maxBurstAfterBurst: 'Total triggers allowed; stop restarting when reached',
    burstCooldownAfterBurst: 'After each trigger,',
    burstCooldownAfterWait: 'how long before trying restarts again'
  }
};
