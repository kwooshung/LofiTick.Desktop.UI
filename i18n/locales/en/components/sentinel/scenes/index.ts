import { card } from '@@/i18n/locales/en/components/sentinel/scenes/card';

export const scenes = {
  labels: {
    machineName: 'Machine name',
    machineId: 'Machine ID',
    machineRemark: 'Machine remark',
    sceneName: 'Scene name',
    sourceExecPath: 'Program path',
    execPath: 'Copy path',
    args: 'Arguments',
    enabled: 'Enabled'
  },
  desc: {
    sceneName: 'Used to identify the monitored UE5 scene app',
    sourceExecPath: 'Pick the executable to guard. Saving will copy it and generate the matching managed copy automatically.',
    execPathManaged: 'Path of the managed copy that this scene will actually run',
    args: 'One argument per line; passed to the launch command in order',
    enabled: 'When off, the scene config is kept, but Sentinel will not auto-start it'
  },
  placeholders: {
    sceneName: 'Enter a scene name, e.g. Indoor scene',
    sourceExecPath: 'Select the executable path',
    execPathManaged: 'Managed copy path generated automatically',
    args: 'One argument per line, e.g.:\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: 'Pick program'
  },
  sync: {
    title: 'Review local and remote scene differences',
    description: 'The local scene copy and the remote machine config differ. Choose how to sync them.',
    descriptionWithMachine: 'Detected differences between local and remote scenes for {machine}. Choose how to sync them.',
    unnamed: 'Unnamed scene',
    summary: {
      machine: 'Machine',
      local: 'Local scenes',
      remote: 'Remote scenes',
      conflict: 'Conflicts'
    },
    shortFields: {
      state: 'State',
      path: 'Path',
      command: 'Command'
    },
    shortSources: {
      local: 'Local',
      remote: 'Remote'
    },
    values: {
      enabled: 'Enabled',
      disabled: 'Disabled',
      pathExists: 'Path available',
      pathMissing: 'Path missing'
    },
    actions: {
      open: 'Sync review',
      useLocal: 'Use local',
      useRemote: 'Use remote',
      merge: 'Merge config'
    },
    status: {
      'local-only': 'Local only',
      'remote-only': 'Remote only',
      same: 'Same',
      conflict: 'Conflict'
    }
  },
  dialogs: {
    pickProgramTitle: 'Select program'
  },
  errors: {
    sceneNameRequired: 'Scene name is required',
    sourceExecPathRequired: 'Program path is required',
    execPathInvalidWindowsPath: 'Program path must be a Windows absolute path (e.g. C:\\Apps\\Scene.exe or \\\\Server\\Share\\Scene.exe)'
  },
  card
};
