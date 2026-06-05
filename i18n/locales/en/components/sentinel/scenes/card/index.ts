export const card = {
  machine: {
    unnamed: 'Unnamed machine',
    online: 'Online',
    offline: 'Offline',
    local: 'Local',
    remote: 'Remote'
  },
  actions: {
    addScene: 'Add scene',
    deleteMachine: 'Delete machine',
    network: 'Network',
    logs: 'Logs',
    details: 'Details',
    edit: 'Edit',
    delete: 'Delete'
  },
  fields: {
    machineCode: 'Machine ID',
    machineRemark: 'Machine Remark',
    lastSeen: 'Last seen',
    network: 'Network',
    logs: 'Logs',
    scenes: 'Scenes'
  },
  tooltips: {
    copyToClipboard: 'Copy to clipboard',
    editRemark: 'Edit remark',
    saveRemark: 'Save remark'
  },
  toast: {
    machineRemarkSaved: 'Machine remark saved',
    machineDeleted: 'Machine deleted'
  },
  stats: {
    scenes: 'Scenes',
    logs: 'Logs',
    machineLogs: 'Machine logs',
    sceneLogs: 'Scene logs',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  scene: {
    unnamed: 'Unnamed scene',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  dialogs: {
    deleteSceneTitle: 'Delete this scene?',
    deleteMachineTitle: 'Delete this machine?'
  },
  logsMeta: {
    recoveryTitle: 'Recovery details',
    labels: {
      reason: 'Reason',
      message: 'Message',
      lastSeenAt: 'Heartbeat time',
      recoveryState: 'Recovery state',
      consecutiveMissedHeartbeats: 'Consecutive missed heartbeats',
      currentRestartCount: 'Current restart count',
      currentCycleCount: 'Current cycle count',
      currentBurstCount: 'Current burst count',
      stopped: 'Stopped',
      nextRetryAt: 'Next retry at',
      offlineSince: 'Offline since'
    },
    values: {
      online: 'Online',
      offline: 'Offline',
      error: 'Error',
      idle: 'Idle',
      stateChanged: 'State changed',
      heartbeatDetected: 'Heartbeat detected',
      recoveryEvaluation: 'Recovery evaluation',
      recoveryUnlockedAfterStopped: 'Detected previous stopped state and resumed retries automatically',
      waiting: 'Waiting',
      cleanup: 'Cleanup',
      restart: 'Restart',
      shutdown: 'Shutdown',
      elevation: 'Elevation',
      closing: 'Closing',
      pending: 'Pending',
      cooldown: 'Cooldown',
      stopped: 'Stopped',
      queryRunningProcess: 'Check running processes',
      closeOldProcess: 'Stop old process',
      requestElevationCloseOldProcess: 'Request elevated stop',
      requestElevationKillThenRestart: 'Request elevated stop then restart',
      checkExecPath: 'Check executable path',
      startNewProcess: 'Start new process',
      requestElevationStart: 'Request elevated start',
      executeSceneRestart: 'Restart scene app',
      yes: 'Yes',
      no: 'No'
    },
    reasons: {
      unattendedDisabled: 'Unattended mode is disabled',
      machineCodeMissing: 'Machine code is missing',
      noEnabledScenes: 'No enabled scenes',
      settingsUnavailable: 'Settings unavailable',
      remoteFetchFailed: 'Failed to fetch remote status',
      heartbeatMissing: 'Heartbeat missing',
      heartbeatTimeout: 'Heartbeat timed out',
      lastSeenInvalid: 'Invalid last seen timestamp'
    },
    summaries: {
      sentinelStatusOnline: 'Sentinel state changed to online',
      sentinelStatusOffline: 'Sentinel state changed to offline',
      sentinelStatusError: 'Sentinel state changed to error',
      sentinelStatusIdle: 'Sentinel state changed to idle',
      heartbeatDetected: 'A new valid heartbeat was detected',
      recoveryEvaluated: 'Sentinel completed this recovery evaluation',
      waitForRetry: 'Sentinel will wait for the next check instead of restarting this round',
      recoveryCleared: 'Sentinel cleared the recovery state',
      restartEntered: 'Sentinel entered the restart flow and is trying to relaunch the scene app'
    },
    messages: {
      failedQueryRunningProcessBeforeShutdown: 'Failed to query running scene processes before shutdown',
      noRunningProcessToShutdown: 'No running scene process needs to be stopped',
      detectedRunningProcessToShutdown: 'A running scene process was detected and will be stopped',
      oldProcessStopped: 'The old scene process was stopped successfully',
      normalShutdownFailedNeedElevation: 'Stopping the old process failed under normal privileges, elevation will be requested',
      elevationShutdownSubmitted: 'An elevated request to stop the old scene process was submitted',
      elevationShutdownFailed: 'Failed to submit the elevated shutdown request',
      skipRestartBecauseExecMissing: 'Skipped restarting the scene app because the executable path does not exist',
      failedQueryRunningProcessBeforeRestart: 'Failed to query running scene processes before restart',
      detectedRunningProcessBeforeRestart: 'An old scene process is still running and will be stopped before restart',
      oldProcessStoppedBeforeRestart: 'The old scene process was stopped successfully, proceeding to restart',
      normalKillThenRestartNeedElevation: 'Stopping the old process failed under normal privileges, elevation will be requested for stop-then-restart',
      elevationKillThenRestartSubmitted: 'An elevated stop-then-restart request was submitted',
      elevationKillThenRestartFailed: 'Failed to submit the elevated stop-then-restart request',
      preparingStartNewProcess: 'Preparing to start a new scene process',
      newProcessStarted: 'The new scene process started successfully',
      normalStartFailedNeedElevation: 'Normal start failed, an elevated restart request was submitted',
      normalStartFailedAndElevationFailed: 'Normal start failed, and the elevated start request also failed',
      newProcessStartFailed: 'Failed to start the new scene process'
    }
  },
  empty: {
    ipv4: {
      title: 'No IPv4 address',
      description: 'This machine has not reported IPv4 yet.'
    },
    ipv6: {
      title: 'No IPv6 address',
      description: 'This machine has not reported IPv6 yet.'
    },
    scenes: {
      title: 'No scenes',
      localDescription: 'This machine has no scenes yet. Create one below.',
      remoteDescription: 'Creating scenes is not supported on remote machines.'
    },
    logs: {
      title: 'No logs',
      description: 'There are no logs to display yet.'
    },
    data: {
      title: 'No data',
      description: 'No machine selected or data not loaded.'
    }
  }
};
