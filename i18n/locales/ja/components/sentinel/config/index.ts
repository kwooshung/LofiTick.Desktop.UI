export const config = {
  labels: {
    onlineWindowSeconds: 'オンライン判定',
    heartbeatInterval: 'シーンアプリ心拍間隔',
    heartbeatTimeoutCount: '連続心拍欠落回数',
    restartDelay: '再起動遅延',
    restartMaxAttempts: '最大再起動',
    restartCooldown: '再起動クールダウン',
    restartBurstWindow: '再起動バースト',
    restartBurstMaxAttempts: '最大バースト',
    restartBurstCooldown: 'バーストクールダウン'
  },
  units: {
    window: '判定',
    interval: '間隔',
    count: '回数',
    delay: '遅延',
    cooldown: '冷却',
    seconds: '秒',
    milliseconds: 'ms',
    times: '回',
    consecutive: '連続',
    burst: 'バースト'
  },
  badges: {
    heartbeat: 'シーン心拍',
    crash: 'クラッシュ',
    wait: '待機',
    consecutiveRestart: '連続再起動',
    restartDelay: '再起動遅延',
    maxRestart: '最大再起動',
    restartCooldown: '再起動冷却',
    restartBurst: '再起動バースト'
  },
  desc: {
    onlineWindowSecondsAfterHeartbeat: 'このマシンで有効なシーンアプリの心拍を受け取った後のオンライン判定時間',
    heartbeatIntervalAfterHeartbeat: 'このマシンで有効なシーンアプリの心拍間隔であり、哨兵の監視周期にも使われます',
    crashCountPrefix: 'このマシンで有効なシーンアプリの心拍連続欠落が',
    crashCountMiddle: '設定回数に達すると判定：',
    restartDelayPrefix: '',
    restartDelayMiddle: '',
    restartDelaySuffix: '再起動を試みるまでの待機時間',
    restartEpisodePrefix: '',
    restartEpisodeAfterConsecutive: '',
    restartEpisodeAfterCrash: 'を検知後、',
    restartEpisodeAfterDelay: '間隔で再起動を反復；試行回数が',
    restartEpisodeAfterMax: 'に達すると',
    restartCooldownPrefix: '',
    restartCooldownMiddle: '',
    restartCooldownSuffixBeforeNext: 'に達するとクールダウン；終了後に次の',
    restartBurstWindowAfterConsecutive: '失敗回数がこの閾値に達すると、1 回としてカウント',
    maxBurstAfterBurst: '許容される総回数の上限；到達で再起動停止',
    burstCooldownAfterBurst: '発生するたび、',
    burstCooldownAfterWait: 'どれだけ待って再試行するか'
  }
};
