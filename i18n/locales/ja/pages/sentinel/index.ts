export const sentinel = {
  title: '無人運用ダッシュボード',
  description: 'すべてのマシンの哨兵ログ集約、オンライン状態の変化、シーン異常の兆候をまとめて確認します。',
  logs: {
    title: 'ログ概要',
    description: '哨兵ログが残っているマシンをまとめて確認し、個別ログ詳細へすばやく移動します。',
    lastRefreshEmpty: '最終更新: 初回取得待ち',
    lastRefreshAt: '最終更新: {value}',
    actions: {
      openSettings: '設定を開く',
      refresh: '今すぐ更新'
    },
    stats: {
      machines: 'マシン',
      machinesHint: '現在もログが残っているマシン数',
      online: 'オンライン',
      onlineHint: 'まだ報告中、またはオンライン判定内のマシン数',
      logs: 'ログ',
      logsHint: '現在集約されている哨兵ログ件数',
      scenes: 'シーン',
      scenesHint: '現在のログに含まれるシーン数'
    }
  },
  overview: {
    title: '概要入口',
    description: 'このページは無人運用の巡回確認用です。詳細なハートビート、哨兵、シーン設定は設定ページで管理します。',
    badges: {
      autoRefresh: '自動更新',
      allMachines: '全マシン',
      manualRefresh: '手動更新も維持'
    },
    actions: {
      openSettings: '設定を開く'
    }
  }
};
