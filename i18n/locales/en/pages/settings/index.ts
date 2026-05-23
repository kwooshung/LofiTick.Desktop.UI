export const settings = {
  title: 'Settings',
  connections: {
    title: 'Service connections',
    description: 'Manage the desktop-side connection settings used for the Rust API and the 1Panel entry point in one place.',
    apiBase: {
      label: 'Rust API domain',
      description: 'Base domain used by the desktop shell when it talks directly to the Rust API. The default value is http://localhost:8180/.',
      placeholder: 'http://localhost:8180/'
    },
    onepanelPanelBase: {
      label: '1Panel root URL',
      description: 'Only enter the 1Panel homepage root URL here. Every navigation link below is derived from it automatically.',
      placeholder: 'https://one-panel.lofitick.com/'
    },
    onepanelLinks: {
      title: '1Panel navigation directory',
      description: 'This directory updates with the root URL in real time. The desktop app no longer embeds the 1Panel cron management page.',
      currentBase: 'Current 1Panel root URL',
      actions: {
        openCronjobs: 'Open cronjobs',
        openScriptLibrary: 'Open script library'
      }
    }
  },
  services: {
    title: 'Service credentials',
    description: 'Manage third-party service credentials in one place. When podcast generation does not pass Volc Speech credentials explicitly, the desktop app falls back to these defaults first.',
    actions: {
      showAccessToken: 'Show token',
      hideAccessToken: 'Hide token',
      resetDefaultResourceId: 'Reset default Resource ID'
    },
    volcSpeech: {
      title: 'Volc Speech',
      description: 'Default desktop credentials for the Volc podcast WebSocket endpoint. After saving here, podcast commands automatically fill missing App ID, Access Token, and Resource ID values.',
      appId: {
        label: 'App ID',
        description: 'Enter the App ID for the Volc Speech service.',
        placeholder: 'For example: 1234567890'
      },
      accessToken: {
        label: 'Access Token',
        description: 'Enter the Access Token for the Volc Speech service.',
        placeholder: 'Enter the Volc Speech Access Token'
      },
      resourceId: {
        label: 'Resource ID',
        description: 'The default value fits the current podcast endpoint. Change it only when the service side requires another resource.',
        placeholder: 'volc.service_type.10050'
      }
    }
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
    description: 'Configure local fetch cadence, selected platforms, budget, and podcast generation timing.',
    header: {
      enter: 'Open Hot Search'
    },
    sections: {
      schedule: {
        title: 'Fetch schedule',
        description: 'Configure the podcast timing baseline, platform interval, jitter, and retry policy here.'
      },
      podcast: {
        title: 'Podcast script',
        description: 'Configure program names, speaker names, and separate opening and closing templates here. The body copy is generated by the program.'
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
      podcastMaleSpeakerName: {
        label: 'Male speaker name',
        description: 'Used for variable substitution as the male announcer name. The default is Xiaoluo.',
        placeholder: 'For example: Xiaoluo'
      },
      podcastFemaleSpeakerName: {
        label: 'Female speaker name',
        description: 'Used for variable substitution as the female announcer name. The default is Feifei.',
        placeholder: 'For example: Feifei'
      },
      podcastProgramNames: {
        label: 'Program names',
        description: 'Morning, evening, and VIP editions each use their own program name variables.'
      },
      podcastMorningProgramName: {
        label: 'Morning program name',
        description: 'Used for the regular morning podcast title.',
        placeholder: 'For example: Lofi Hotspot Morning Brief'
      },
      podcastEveningProgramName: {
        label: 'Evening program name',
        description: 'Used for the regular evening podcast title.',
        placeholder: 'For example: Lofi Hotspot Evening Brief'
      },
      podcastVipMorningProgramName: {
        label: 'VIP morning program name',
        description: 'Used for the VIP morning podcast title.',
        placeholder: 'For example: Lofi Hotspot Morning Brief VIP Edition'
      },
      podcastVipEveningProgramName: {
        label: 'VIP evening program name',
        description: 'Used for the VIP evening podcast title.',
        placeholder: 'For example: Lofi Hotspot Evening Brief VIP Edition'
      },
      podcastVariables: {
        label: 'Insert variables',
        description: 'Click a variable button to insert it into the currently focused opening or closing template input.'
      },
      podcastOpeningTemplates: {
        label: 'Opening templates',
        description: 'Maintain only the opening templates here. The body copy is generated automatically.',
        placeholder: 'For example: This is [programName], and today is [solarDateTime].',
        placeholderAdContent: 'Ad content is automatically inserted and generated by the ad system.',
        empty: {
          title: 'No opening templates yet',
          description: 'Add an opening template, choose the voice, and write the opening copy.'
        }
      },
      podcastClosingTemplates: {
        label: 'Closing templates',
        description: 'Maintain only the closing templates here. The body copy is generated automatically.',
        placeholder: "For example: That was today's [programName]. See you next time.",
        placeholderAdContent: 'Ad content is automatically inserted and generated by the ad system.',
        empty: {
          title: 'No closing templates yet',
          description: 'Add a closing template, choose the voice, and write the closing copy.'
        }
      },
      monthlyBudget: {
        label: 'Monthly point budget',
        description: 'Plan with 3500 by default. Check the official console for the real remaining balance.'
      },
      morningStartAt: {
        label: 'Morning hot search start',
        description: 'Used to derive the suggested morning podcast generation time. It does not affect fetch cadence.'
      },
      eveningStartAt: {
        label: 'Evening hot search start',
        description: 'Used to derive the suggested evening podcast generation time. It does not affect fetch cadence.'
      },
      platformIntervalSeconds: {
        label: 'Per-platform interval',
        description: 'Delay between platform triggers, in seconds. For example, 360 seconds is about 6 minutes.',
        input: {
          prefix: 'Every',
          unit: 'sec'
        }
      },
      scheduleJitterSeconds: {
        label: 'Start time jitter',
        description: 'Apply a symmetric random offset to planned times. The default 1800 means plus or minus 30 minutes.',
        input: {
          prefix: 'Offset',
          unit: 'sec'
        }
      },
      podcastBufferSeconds: {
        label: 'Podcast buffer',
        description: 'Extra wait time reserved after fetching finishes for organizing, polishing, and generating the podcast, in seconds. It only affects podcast timing, not fetch cadence.',
        input: {
          prefix: 'Buffer',
          unit: 'sec'
        }
      },
      retryMaxAttempts: {
        label: 'Retry attempts',
        description: 'Maximum automatic retries for one failed platform.',
        input: {
          prefix: 'Count',
          unit: 'times'
        }
      },
      retryDelaySeconds: {
        label: 'Retry delay',
        description: 'Wait time before retrying a failed platform, in seconds.',
        input: {
          prefix: 'Delay',
          unit: 'sec'
        }
      }
    },
    options: {
      podcastVoice: {
        random: 'Random',
        xiaoluo: 'Xiaoluo',
        feifei: 'Feifei',
        duet: 'Dual'
      },
      podcastTemplate: {
        opening: 'Opening template',
        closing: 'Closing template'
      },
      podcastSegment: {
        normal: 'General content',
        morningOnly: 'Morning only',
        eveningOnly: 'Evening only',
        adOpening: 'Ad opening',
        adContent: 'Ad content',
        adClosing: 'Ad closing'
      }
    },
    variables: {
      speakerName: 'Speaker name',
      maleSpeakerName: 'Male speaker name',
      femaleSpeakerName: 'Female speaker name',
      programName: 'Current program name',
      morningProgramName: 'Morning program name',
      eveningProgramName: 'Evening program name',
      vipMorningProgramName: 'VIP morning program name',
      vipEveningProgramName: 'VIP evening program name',
      greeting: 'Dynamic greeting',
      solarDateTime: 'Solar year/month/day',
      solarDate: 'Solar month/day',
      solarTime: 'Time',
      lunarDateTime: 'Lunar year/month/day',
      lunarDate: 'Lunar month/day',
      weekday: 'Weekday',
      editionLabel: 'Morning or evening edition'
    },
    variableDescriptions: {
      speakerName: 'Uses the speaker name that matches the current voice.',
      maleSpeakerName: 'Always uses the male speaker name.',
      femaleSpeakerName: 'Always uses the female speaker name.',
      programName: 'Uses the program name that matches the current edition.',
      morningProgramName: 'Program name for the regular morning podcast.',
      eveningProgramName: 'Program name for the regular evening podcast.',
      vipMorningProgramName: 'Program name for the VIP morning podcast.',
      vipEveningProgramName: 'Program name for the VIP evening podcast.',
      greeting: 'Outputs a greeting that changes automatically between morning and evening.',
      solarDateTime: 'For example, 2026年5月14日.',
      solarDate: 'For example, 5月14日.',
      solarTime: 'For example, 08:30.',
      lunarDateTime: 'For example, 农历丙午年三月二十八.',
      lunarDate: 'For example, 三月二十八.',
      weekday: 'Current weekday.',
      editionLabel: 'Whether the current episode is morning or evening.'
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
      addOpeningTemplate: 'Add opening template',
      addClosingTemplate: 'Add closing template',
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
      runtimeOnly: {
        title: 'Not running inside Tauri',
        description: 'Local jobs rely on schedule snapshots exposed by the desktop shell and are not available in a plain browser runtime.'
      },
      snapshot: {
        title: 'Local background task list',
        description: 'Shows background tasks owned by the desktop shell on this machine instead of mixing them with server-side 1Panel cron jobs.'
      },
      summary: {
        enabled: 'Auto fetch: {value}',
        podcastEnabled: 'Auto podcast: {value}',
        platformCount: 'Platforms: {value}',
        monthlyBudget: 'Monthly budget: {value}',
        sceneCount: 'Enabled scenes: {value}',
        recoveryState: 'Recovery state: {value}'
      },
      items: {
        hotsearch: {
          title: 'Local hot search scheduler',
          description: 'The desktop shell keeps polling local hot search settings and runs fetch ticks inside the morning and evening windows.'
        },
        sentinel: {
          title: 'Local sentinel poller',
          description: 'The desktop shell keeps polling unattended sentinel state and applies local recovery strategies.'
        }
      },
      schedule: {
        windowsLabel: 'Windows: ',
        podcastLabel: 'Suggested podcast: ',
        sentinelPolling: 'Continuous polling while the app is running',
        lastSeenLabel: 'Last heartbeat: ',
        pending: 'Waiting for local runtime snapshot'
      },
      actions: {
        openSettings: 'Open settings'
      },
      card: {
        activity: 'Recent activity'
      },
      states: {
        hotsearchEnabled: 'Running',
        hotsearchDisabled: 'Disabled',
        sentinelOnline: 'Online',
        sentinelOffline: 'Offline',
        sentinelError: 'Error',
        sentinelIdle: 'Idle',
        sentinelUnknown: 'Not reported'
      },
      windowKeys: {
        morning: 'Morning window',
        evening: 'Evening window'
      },
      window: {
        title: '{name}',
        startAt: 'Start time',
        endAt: 'End time',
        suggestedPodcastAt: 'Suggested podcast time',
        duration: 'Window duration',
        durationValue: '{value} min',
        platformCount: 'Platform count',
        points: 'Estimated points'
      },
      empty: {
        title: 'Local tasks are unavailable',
        description: 'The desktop shell did not provide any local background task data to display.'
      }
    },
    serverShortcut: {
      title: 'Server task entry',
      description: 'Server tasks now open directly in 1Panel. This page only keeps the jump entry and reminders.',
      heroTitle: 'Manage real server cronjobs inside 1Panel',
      heroDescription: 'The desktop app no longer mirrors the 1Panel cron list and no longer asks you to maintain an API key here. Configure one 1Panel root URL, then jump straight to cronjobs or the script library from this page.',
      actions: {
        openCronjobs: 'Open 1Panel cronjobs',
        openScriptLibrary: 'Open 1Panel script library',
        openConnections: 'Open service connections'
      },
      quickLinks: {
        overview: 'Open 1Panel overview',
        terminal: 'Open 1Panel terminal',
        logs: 'Open 1Panel operation logs'
      }
    },
    system: {
      readonly: 'Read-only',
      groups: {
        system: 'System job',
        hook: 'Public hook'
      },
      snapshot: {
        title: 'Built-in system job list',
        description: 'These jobs are fixed by the Rust API and cannot be created, edited, or deleted from the desktop app.'
      },
      items: {
        hotsearchMorningGenerate: {
          title: 'Morning hot search generation',
          description: 'The system advances the hot search generation flow inside the morning window defined by hot search settings.'
        },
        hotsearchEveningGenerate: {
          title: 'Evening hot search generation',
          description: 'The system advances the hot search generation flow inside the evening window defined by hot search settings.'
        },
        hotsearchStep: {
          title: 'Hot search step runner',
          description: 'Called by an external cron ticker and advances only one platform per request.'
        },
        quoteRandom: {
          title: 'Random quote fetch',
          description: 'Fetches one random quote and stores it with idempotent rules.'
        }
      },
      schedules: {
        hotsearchMorningGenerate: {
          primary: 'Runs inside the morning window defined by hot search settings',
          secondary: 'Built-in hot search generation flow'
        },
        hotsearchEveningGenerate: {
          primary: 'Runs inside the evening window defined by hot search settings',
          secondary: 'Built-in hot search generation flow'
        },
        hotsearchStep: {
          primary: 'Called by an external cron / 1Panel ticker on a fixed interval',
          secondary: '/crons/system/hot_searchs/step'
        },
        quoteRandom: {
          primary: 'Triggered by built-in scheduled jobs when needed',
          secondary: '/crons/system/quotes/random'
        }
      },
      empty: {
        title: 'System jobs are read-only',
        description: 'This section shows the built-in system job definitions only and does not expose any editing entry.'
      }
    },
    search: {
      label: 'Filter jobs',
      description: 'Filter 1Panel cron jobs by name.',
      placeholder: 'Enter a cron job name keyword'
    },
    table: {
      name: 'Job',
      group: 'Group',
      path: 'Path',
      method: 'Method',
      schedule: 'Schedule',
      retainCopies: 'Retained copies',
      lastExecutedAt: 'Last execution',
      createdAt: 'Created at',
      status: 'Status',
      actions: 'Actions',
      enabled: 'Enabled',
      disabled: 'Disabled',
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
      description: 'Edit common job fields with a visual form, then map them to the 1Panel payload automatically when saving.',
      previewNext: 'Preview next run',
      nextTimes: 'Next execution times',
      nextEmpty: 'No preview has been generated yet',
      save: 'Save configuration',
      sections: {
        basic: 'Basics',
        schedule: 'Schedule',
        execution: 'Execution',
        preview: 'Preview',
        runtime: 'Runtime policy'
      },
      descriptions: {
        basic: 'Keep the task name, task type, and 1Panel group aligned with upstream metadata.',
        execution: 'Fill the callback URL, script, command, and execution user based on the task type.',
        preview: 'Check the generated cron expression and next run times before saving.',
        runtime: 'Manage retention, retries, timeout, and alert count together in one place.'
      },
      form: {
        name: 'Job name',
        type: 'Job type',
        groupId: 'Task group',
        spec: 'Schedule',
        url: 'Target URL',
        executor: 'Executor',
        script: 'Script content',
        command: 'Command',
        user: 'Run as user',
        retainCopies: 'Retained execution records',
        retryTimes: 'Retry attempts',
        timeout: 'Timeout',
        ignoreErr: 'Ignore errors',
        alertCount: 'Alert count',
        typeOptions: {
          url: 'Request URL',
          shell: 'Shell script',
          command: 'Run command'
        }
      },
      schedule: {
        description: 'Use the visual builder for normal schedules, and switch to custom only for special expressions.',
        custom: 'Custom',
        customPlaceholder: 'For example: 30 1 * * 1',
        generated: 'Generated expression: {value}',
        labels: {
          mode: 'Mode',
          dayOfMonth: 'Day of month',
          weekday: 'Weekday',
          interval: 'Repeat interval',
          every: 'Every',
          hour: 'Hour',
          minute: 'Minute'
        },
        options: {
          monthly: 'Monthly',
          weekly: 'Weekly',
          daily: 'Daily',
          everySeconds: 'Every N seconds',
          everyHours: 'Every N hours',
          everyDays: 'Every N days',
          everyMinutes: 'Every N minutes'
        },
        weekdays: {
          mon: 'Mon',
          tue: 'Tue',
          wed: 'Wed',
          thu: 'Thu',
          fri: 'Fri',
          sat: 'Sat',
          sun: 'Sun'
        },
        units: {
          day: 'day',
          hour: 'hour',
          minute: 'minute',
          second: 'second'
        }
      },
      validation: {
        nameRequired: 'Job name is required',
        customSpecRequired: 'Enter a custom schedule expression',
        urlRequired: 'Target URL is required',
        executorRequired: 'Executor is required',
        scriptRequired: 'Script content is required',
        commandRequired: 'Command content is required',
        userRequired: 'Run as user is required'
      }
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
