export const sentinel = {
  title: 'Unattended Overview',
  description: 'Monitor aggregated sentinel logs, machine state changes, and scene anomalies across all machines.',
  logs: {
    title: 'Log Overview',
    description: 'Review machines that still have sentinel logs and jump into per-machine details quickly.',
    lastRefreshEmpty: 'Last refresh: waiting for the first fetch',
    lastRefreshAt: 'Last refresh: {value}',
    actions: {
      refresh: 'Refresh Now'
    },
    stats: {
      machines: 'Machines',
      machinesHint: 'Machines that currently still have logs',
      online: 'Online',
      onlineHint: 'Machines still reporting or within the online window',
      logs: 'Logs',
      logsHint: 'Aggregated sentinel log entries currently available',
      scenes: 'Scenes',
      scenesHint: 'Distinct scenes involved in the current logs'
    }
  },
  overview: {
    title: 'Overview Entry',
    description: 'Use this page for quick unattended inspection. Detailed heartbeat, sentinel, and scene settings remain in Settings.',
    badges: {
      autoRefresh: 'Auto Refresh',
      allMachines: 'All Machines',
      manualRefresh: 'Manual Refresh Kept'
    },
    actions: {
      openSettings: 'Open Settings'
    }
  }
};
