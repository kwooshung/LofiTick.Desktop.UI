export const sentinel = {
  title: '無人值守總覽',
  description: '集中查看所有機器的哨兵日誌彙總、在線狀態變化與場景異常線索。',
  logs: {
    title: '日誌總覽',
    description: '統一查看仍有哨兵日誌的機器，並快速進入單機日誌詳情。',
    lastRefreshEmpty: '最近刷新：等待首次拉取',
    lastRefreshAt: '最近刷新：{value}',
    actions: {
      openSettings: '前往設定',
      refresh: '立即刷新'
    },
    stats: {
      machines: '機器',
      machinesHint: '目前仍有日誌的機器數',
      online: '在線',
      onlineHint: '正在上報或仍處於在線視窗內的機器數',
      logs: '日誌',
      logsHint: '目前聚合到的哨兵日誌條目數',
      scenes: '場景',
      scenesHint: '日誌涉及到的場景數量'
    }
  },
  overview: {
    title: '總覽入口',
    description: '這裡用於快速巡檢無人值守狀態；具體規則、心跳與場景配置仍在設定頁維護。',
    badges: {
      autoRefresh: '自動刷新',
      allMachines: '全部機器',
      manualRefresh: '保留手動刷新'
    },
    actions: {
      openSettings: '前往設定'
    }
  }
};
