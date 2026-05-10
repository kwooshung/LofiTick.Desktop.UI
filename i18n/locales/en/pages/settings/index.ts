export const settings = {
  title: 'Settings',
  connections: {
    title: 'Service connections',
    description: 'Manage the desktop-side connection settings used for the Rust API and 1Panel in one place.',
    apiBase: {
      label: 'Rust API base',
      description: 'Base URL used by the desktop shell when it talks directly to the Rust API.',
      placeholder: 'https://api.example.com'
    },
    onepanelApiBase: {
      label: '1Panel base URL',
      description: 'Base URL of the 1Panel panel. It defaults to https://one-panel.lofitick.com/.',
      placeholder: 'https://one-panel.lofitick.com/'
    },
    onepanelApiKey: {
      label: '1Panel API Key',
      description: 'Stored only in server-side Redis for cron proxying and hot search cron sync.',
      placeholder: 'Enter the 1Panel API Key'
    },
  },
  general: {
    title: 'General',
    description: 'Configure basic app behavior, language, and common preferences.',
    closeBehavior: {
      label: 'Close behavior',
      description: 'Default action when closing the main window.',
      options: {
        unset: 'Ask every time',
        minimizeToTray: 'Minimize to tray',
        exit: 'Exit app immediately'
      }
    },
    language: {
      label: 'Interface language',
      description: 'Currently supports {count} languages.'
    },
    rememberWindowState: {
      label: 'Remember window state',
      description: 'Always record window position and size, then decide whether to restore it on startup using this switch.'
    },
    appDirectory: {
      label: 'App directory',
      description: 'Open the directory where the app executable is located.',
      open: 'Open directory'
    },
    userDataDirectory: {
      label: 'User data directory',
      description: 'Open the userData directory (preferences, cache, etc.).',
      open: 'Open directory'
    },
    storage: {
      label: 'Data storage directory',
      description: 'Directory where data files are stored. Current path:',
      dialogTitle: 'Choose attachment storage directory',
      choose: 'Choose directory',
      reselect: 'Choose again',
      unset: 'Not set'
    },
    devtools: {
      label: 'Developer tools',
      description: 'Open developer tools (close it manually in the DevTools window).',
      toggle: 'Open DevTools'
    },
    multiOpen: {
      label: 'Multiple instances',
      description: 'Allow running multiple instances of the app at the same time.'
    }
  },
  ui: {
    title: 'Appearance',
    description: 'Theme, light/dark mode, layout, and other UI options.',
    colorMode: {
      label: 'Color mode',
      description: 'Choose whether the appearance is light or dark, or adjust according to your computer settings.',
      options: {
        system: 'Follow system',
        light: 'Light',
        dark: 'Dark'
      }
    },
    primary: {
      label: 'Primary color palette',
      description: 'Applied to buttons, links, and other accent elements.',
      colors: {
        black: 'Black',
        red: 'Red',
        orange: 'Orange',
        amber: 'Amber',
        yellow: 'Yellow',
        lime: 'Lime',
        green: 'Green',
        emerald: 'Emerald',
        teal: 'Teal',
        cyan: 'Cyan',
        sky: 'Sky',
        blue: 'Blue',
        indigo: 'Indigo',
        violet: 'Violet',
        purple: 'Purple',
        fuchsia: 'Fuchsia',
        pink: 'Pink',
        rose: 'Rose'
      }
    },
    neutral: {
      label: 'Neutral palette',
      description: 'Used mainly for text, backgrounds, and borders.',
      colors: {
        ink: 'Ink',
        slate: 'Slate',
        gray: 'Gray',
        zinc: 'Zinc',
        neutral: 'Neutral',
        stone: 'Stone',
        taupe: 'Taupe',
        mauve: 'Mauve',
        mist: 'Mist',
        olive: 'Olive'
      }
    },
    radius: {
      label: 'Border radius',
      description: 'Corner radius for UI elements.'
    }
  },
  playback: {
    title: 'Playback',
    description: 'Audio playback parameters and behavior.',
    fade: {
      label: 'Fade in / out',
      description: 'Set fade-in and fade-out duration for audio (in milliseconds).',
      labels: {
        in: 'Fade in',
        out: 'Fade out'
      },
      unit: {
        ms: 'ms'
      }
    },
    normalization: {
      label: 'Loudness normalization',
      description: 'When enabled, automatically adjusts loudness so playback stays consistent and avoids big volume jumps.',
      unit: 'LUFS',
      lufs: {
        '-14': 'YouTube / Bilibili / Spotify / Tidal / NetEase / QQ Music',
        '-16': 'Apple Music / WeChat Official Account / Weibo / Podcasts',
        '-24': 'TV / Movies / Netflix / Disney+ / HBO Max'
      }
    }
  },
  power: {
    title: 'Power',
    description: 'Tune power management options to save energy.',
    startup: {
      enabled: {
        label: 'Launch at startup',
        description: 'Automatically start the app when the system starts.'
      }
    },
    system: {
      label: 'System sleep',
      description: 'When blocked, the system will not go to sleep, preventing long-running tasks (download, crawling, playback, etc.) from being interrupted.'
    },
    display: {
      label: 'Display sleep',
      description: 'When blocked, the display will not go to sleep, so you can always see the status while long-running tasks continue (download, crawling, playback, etc.).'
    },
    options: {
      never: 'Never block',
      always: 'Always block',
      crawling: 'Block while crawling',
      playing: 'Block while playing'
    }
  },
  hotsearch: {
    title: 'Hot Search',
    description: 'Configure local trending windows, selected platforms, budget, and podcast buffer time.',
    sections: {
      schedule: {
        title: 'Fetch schedule',
        description: 'Configure the source window times, platform interval, and retry policy here.'
      },
      platforms: {
        title: 'Platforms',
        description: 'Only select the platforms you really need. Budget is estimated from the selected count.'
      },
      summary: {
        title: 'Plan summary',
        description: 'Shows current window duration, estimated points, and suggested podcast times.'
      }
    },
    fields: {
      enabled: {
        label: 'Auto fetch',
        description: 'When enabled, this machine fetches the selected platforms according to the configured windows.'
      },
      podcastEnabled: {
        label: 'Auto podcast generation',
        description: 'When enabled, podcast time follows the suggested time derived from the hot search window.'
      },
      monthlyBudget: {
        label: 'Monthly point budget',
        description: 'Plan with 3500 by default. Check the official console for the real remaining balance.'
      },
      morningStartAt: {
        label: 'Morning hot search start',
        description: 'This is the source time for the morning window. Derived times follow it automatically.'
      },
      eveningStartAt: {
        label: 'Evening hot search start',
        description: 'This is the source time for the evening window. Derived times follow it automatically.'
      },
      platformIntervalSeconds: {
        label: 'Per-platform interval',
        description: 'Delay between platform triggers, in seconds. For example, 360 seconds is about 6 minutes.'
      },
      scheduleJitterSeconds: {
        label: 'Start time jitter',
        description: 'Apply a symmetric random offset around the morning and evening base times. For example, 1800 means plus or minus 30 minutes.'
      },
      podcastBufferMinutes: {
        label: 'Podcast buffer',
        description: 'Extra wait time after the window finishes, in minutes.'
      },
      retryMaxAttempts: {
        label: 'Retry attempts',
        description: 'Maximum automatic retries for one failed platform.'
      },
      retryDelayMinutes: {
        label: 'Retry delay',
        description: 'Wait time before retrying a failed platform, in minutes.'
      }
    },
    summary: {
      selectedPlatforms: 'Selected platforms',
      perWindowCost: 'Points per window',
      dailyCost: 'Daily points',
      monthlyEstimate: 'Monthly estimate',
      windowDuration: 'Window duration',
      suggestedMorningPodcast: 'Suggested morning podcast time',
      suggestedEveningPodcast: 'Suggested evening podcast time',
      budgetStatus: 'Budget balance',
      budgetStatusSafe: 'Safe',
      budgetStatusWarning: 'Notice',
      budgetStatusExceeded: 'Exceeded',
      scopeMonth: 'This month',
      scopeYear: 'This year',
      budgetStatusRemainingDetail: '{scope}: budget {budget}, estimate {estimate}, remaining {remaining}',
      budgetStatusExceededDetail: '{scope}: budget {budget}, estimate {estimate}, exceeded by {exceeded}',
      rangeValue: '{start} ~ {end}',
      minutesValue: '{value} min'
    },
    actions: {
      usage: 'Open usage console',
      selectAll: 'Select all',
      clearAll: 'Clear all',
      reset: 'Reset defaults',
      save: 'Save settings'
    }
  },
  cron: {
    title: 'Scheduled Tasks',
    description: 'Manage local jobs, server jobs, and system jobs in one place.',
    tabs: {
      local: 'Local jobs',
      server: 'Server jobs',
      system: 'System jobs'
    },
    actions: {
      refresh: 'Refresh',
      search: 'Search',
      resetSearch: 'Clear',
      syncHotsearch: 'Sync hot search cron',
      create: 'Create',
      edit: 'Edit',
      enableSelected: 'Enable selected',
      disableSelected: 'Disable selected',
      stopSelected: 'Stop selected',
      deleteSelected: 'Delete selected',
      run: 'Run',
      stop: 'Stop',
      records: 'Records',
      delete: 'Delete',
      viewLog: 'Log'
    },
    hotsearch: {
      label: 'Hot search cron',
      description: 'Shows whether the hot search switch and the 1Panel cron state are aligned.',
      enabled: 'Hot search: {value}',
      callbackUnset: 'No callback URL has been derived for 1Panel yet.',
      states: {
        ready: 'Synchronized',
        outOfSync: 'Needs repair',
        unconfigured: '1Panel not configured'
      }
    },
    local: {
      empty: {
        title: 'Local jobs are not wired yet',
        description: 'This section is reserved for Tauri desktop-local scheduled tasks and is not available in the current version.'
      }
    },
    system: {
      empty: {
        title: 'System jobs are read-only',
        description: 'This section is reserved for built-in desktop system jobs. The current version exposes a read-only entry and does not allow create, edit, or delete operations.'
      }
    },
    search: {
      label: 'Filter jobs',
      description: 'Filter 1Panel cron jobs by name.',
      placeholder: 'Enter a cron job name keyword'
    },
    table: {
      name: 'Job',
      schedule: 'Schedule',
      createdAt: 'Created at',
      status: 'Status',
      actions: 'Actions',
      executing: 'Running'
    },
    records: {
      title: 'Execution records for {name}',
      actions: {
        clean: 'Clean records'
      },
      empty: {
        title: 'No execution records',
        description: 'This job has no execution history to display yet.'
      },
      table: {
        startedAt: 'Started at',
        status: 'Status',
        message: 'Summary',
        interval: 'Duration',
        actions: 'Actions',
        intervalValue: '{value} ms'
      }
    },
    logs: {
      title: 'Log for record #{id}',
      empty: {
        title: 'No log content',
        description: 'This record did not return any displayable text log.'
      }
    },
    operate: {
      createTitle: 'Create cron job',
      editTitle: 'Edit cron job',
      description: 'This stage forwards the native 1Panel JSON payload directly so the full capability chain can work first.',
      payloadLabel: 'Cron job JSON payload',
      previewNext: 'Preview next run',
      nextTimes: 'Next execution times',
      nextEmpty: 'No preview has been generated yet',
      save: 'Save configuration'
    },
    delete: {
      title: 'Delete cron job',
      description: 'Delete {name} without cleaning related data.',
      confirm: 'Delete'
    },
    footer: {
      total: '{total} jobs in total',
      selected: '{total} selected'
    }
  },
  unattended: {
    title: 'Unattended',
    header: {
      description: 'Adjust unattended mode and heartbeat-related settings.',
      enter: 'Go to unattended page'
    },
    dialogs: {
      restart: {
        title: 'Restart required',
        description: 'The unattended switch has been changed. You can restart the app later manually, or restart now to apply the changes.',
        actions: {
          cancel: 'Cancel',
          later: 'Restart later',
          now: 'Restart now'
        },
        toast: {
          later: 'Saved. Will take effect after restart.'
        }
      }
    },
    tooltips: {
      copyToClipboard: 'Click to copy to clipboard',
      openLink: 'Open link'
    },
    analysis: {
      title: 'Analysis duration',
      empty: 'No data',
      button: 'Duration analysis',
      fields: {
        crashDecision: 'Crash decision',
        restartDelay: 'Restart delay',
        restartCooldown: 'Restart cooldown',
        restartEpisodeWorst: 'Worst consecutive restarts',
        restartEpisodeWithCooldownWorst: 'Worst consecutive restarts + cooldown',
        burstWorst: 'Worst burst',
        burstCooldown: 'Burst cooldown',
        worstTotal: 'Worst total duration'
      }
    },
    form: {
      enabled: {
        label: 'Enabled',
        line1: {
          prefix: 'Turning this on enables unattended mode and will',
          middle: ', but it will not explicitly change your original settings for these items;'
        },
        badges: {
          force: 'force',
          preventSystemSleep: 'prevent system sleep',
          enableStartup: 'force launch at startup',
          restoreOnClose: 'restore when turned off'
        },
        line2: {
          prefix: 'After enabling, the app will enter',
          middle: 'mode on the next launch, and will also auto-start after the next reboot and enter',
          suffix: 'mode'
        },
        line3: {
          prefix: 'You can also click the button in the top right to enter',
          suffix: 'mode'
        }
      },
      startBehavior: {
        label: 'Start behavior',
        description: 'How the window is shown after the app starts',
        options: {
          normal: 'Default',
          minimize: 'Minimize',
          minimizeToTray: 'Minimize to tray'
        }
      },
      machineName: {
        label: 'Machine name',
        description: 'Use a unique name for each computer to avoid confusion'
      },
      machineCode: {
        label: 'Machine ID',
        description: 'A unique ID for each computer, used for management'
      },
      machineCodeConsistent: {
        label: 'Machine code consistent',
        description: 'Empty or consistent means no changes detected'
      }
    },
    sections: {
      sentinel: {
        title: 'Sentinel',
        description: 'Adjust heartbeat-related settings in unattended mode.',
        actions: {
          sync: 'Sync config',
          reset: 'Reset to defaults'
        },
        runtime: {
          states: {
            idle: 'Waiting',
            online: 'Scene online',
            offline: 'Scene offline',
            error: 'Error'
          },
          summary: 'This only reflects the heartbeat state of enabled scene apps on this machine, not whether the desktop shell itself is online.',
          reasons: {
            awaitingSnapshot: 'Waiting for the desktop shell to return the current Sentinel state.',
            unattendedDisabled: 'Unattended mode is currently disabled.',
            machineCodeMissing: 'Machine code is missing, so Sentinel cannot start evaluation.',
            noEnabledScenes: 'No guarded scene is enabled on this machine yet.',
            heartbeatMissing: 'The remote side has not received any scene heartbeat from this machine yet.',
            heartbeatTimeout: 'Heartbeat is older than the online window, so this machine is treated as offline.',
            remoteFetchFailed: 'Unable to read the current machine scene state from the remote side right now.',
            lastSeenInvalid: 'The remote side returned an invalid last heartbeat timestamp.',
            settingsUnavailable: 'The desktop shell cannot read local settings right now.'
          },
          fields: {
            enabledScenes: '{count} enabled scenes',
            onlineWindow: 'Online check and refresh interval {count} sec',
            lastSeenAt: 'Last heartbeat {value}',
            staleFor: 'Timed out for {count} sec',
            recoveryIdle: 'Recovery queue idle',
            recoveryPending: 'Recovery decision in progress',
            recoveryCooldown: 'Recovery cooldown active',
            recoveryStopped: 'Burst limit reached, auto restart stopped',
            recoveryAttempts: '{count} restart attempts in current round',
            recoveryEpisodes: '{count} completed rounds in current burst window',
            recoveryBurstCount: '{count} bursts triggered',
            recoveryNextAttemptAt: 'Next retry allowed at {value}'
          }
        },
        form: {
          startup: {
            label: 'Launch at startup',
            enableDescription: 'On: recommended when monitoring live streaming scenes so Sentinel starts automatically after boot.',
            disablePrefix: 'Off: if this app also needs to stay running, consider turning it off; since ',
            disableMiddle: ' mode is enabled, launch at startup will start this app, and ',
            disableSuffix: ' will start along with it.'
          },
          onlineWindow: {
            label: 'Online check and refresh interval',
            description: 'Used for both offline detection and the refresh cycle of machine last-seen time.',
            value: '{seconds} sec'
          },
          requestUrl: {
            label: 'Request URL',
            description: 'Status information needs to be synced to the remote server for centralized coordination.',
            placeholder: 'api.v1.lofitick.com/system/unattended/heartbeat'
          }
        }
      },
      ue5: {
        title: 'UE5 Access',
        description: 'Entry address for the desktop localhost bridge. Specific requests are listed separately.',
        actions: {
          requests: 'View request list'
        },
        form: {
          endpoint: {
            label: 'Local access address',
            description: 'Heartbeat, info reads, and other UE5 bridge requests all expand from this local address.'
          },
          upstreamHost: {
            description: 'The upstream address is the remote target URL that the UE5 local bridge finally forwards to.'
          }
        },
        modal: {
          title: 'Local bridge requests',
          description: 'The current localhost bridge requests are listed directly on this page.',
          errorTitle: 'Bridge requests unavailable',
          requestListTitle: 'Available requests',
          actions: {
            close: 'Close',
            refresh: 'Refresh'
          },
          summary: {
            accessBase: 'Local access address',
            upstreamHost: 'Upstream host'
          },
          requests: {
            access: {
              title: 'Local access info',
              description: 'Reads the bridge information currently exposed by the desktop app to UE5.'
            },
            heartbeat: {
              title: 'Scene heartbeat report',
              description: 'Writes the latest heartbeat time for this machine to refresh online time and offline detection.'
            }
          },
          empty: {
            title: 'No requests available',
            description: 'There are no local bridge requests available for UE5 right now.'
          }
        }
      },
      scenes: {
        title: 'Scene protection',
        description: 'Primarily monitors live streaming scene apps built with Unreal Engine.',
        form: {
          onlineWindow: {
            label: 'Online check and refresh interval',
            short: 'Online check and refresh interval',
            unit: 'sec'
          }
        }
      },
      logs: {
        title: 'Logs overview',
        description: 'View recent Sentinel logs by machine so the same UI can later be reused for the online machines page and the home dashboard.',
        actions: {
          refresh: 'Refresh logs'
        }
      }
    },
    labels: {
      thisApp: 'this app'
    }
  }
};
