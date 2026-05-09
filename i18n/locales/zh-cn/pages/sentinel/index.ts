export const sentinel = {
  title: '无人值守总览',
  description: '集中查看所有机器的哨兵日志汇总、在线状态变化与场景异常线索。',
  logs: {
    title: '日志总览',
    description: '统一查看仍有哨兵日志的机器，并快速进入单机日志详情。',
    lastRefreshEmpty: '最近刷新：等待首次拉取',
    lastRefreshAt: '最近刷新：{value}',
    actions: {
      openSettings: '前往设置',
      refresh: '立即刷新'
    },
    stats: {
      machines: '机器',
      machinesHint: '当前仍有日志的机器数',
      online: '在线',
      onlineHint: '正在上报或仍处于在线窗口的机器数',
      logs: '日志',
      logsHint: '当前聚合到的哨兵日志条目数',
      scenes: '场景',
      scenesHint: '日志涉及到的场景数量'
    }
  },
  overview: {
    title: '总览入口',
    description: '这里用于快速巡检无人值守状态；具体规则、心跳和场景配置仍在设置页维护。',
    badges: {
      autoRefresh: '自动刷新',
      allMachines: '全部机器',
      manualRefresh: '保留手动刷新'
    },
    actions: {
      openSettings: '前往设置'
    }
  }
};
