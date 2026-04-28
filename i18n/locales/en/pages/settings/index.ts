export const settings = {
  title: 'Settings',
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
      description: 'Always record window position and size, and decide whether to restore on startup according to this switch.'
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
  unattended: {
    title: 'Unattended',
    header: {
      description: 'Adjust unattended mode and heartbeat-related settings.',
      enter: 'Enter unattended mode'
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
          enableStartup: 'enable launch at startup',
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
        form: {
          startup: {
            label: 'Launch at startup',
            enableDescription: 'On: recommended when monitoring live streaming scenes so Sentinel starts automatically after boot.',
            disablePrefix: 'Off: if this app also needs to stay running, consider turning it off; since ',
            disableMiddle: ' mode is enabled, launch at startup will start this app, and ',
            disableSuffix: ' will start along with it.'
          },
          onlineWindow: {
            label: 'Online window',
            description: 'If no new heartbeat is received within this time, the machine is treated as offline.',
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
            description: 'Only the upstream host needs to be shown here instead of the full remote path.'
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
        description: 'Primarily monitors live streaming scene apps built with Unreal Engine.'
      }
    },
    labels: {
      thisApp: 'this app'
    }
  }
};
