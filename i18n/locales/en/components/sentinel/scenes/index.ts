import { card } from './card';

export const scenes = {
  labels: {
    machineName: 'Machine name',
    machineId: 'Machine ID',
    machineRemark: 'Machine remark',
    sceneName: 'Scene name',
    execPath: 'Program path',
    args: 'Arguments',
    enabled: 'Enabled'
  },
  desc: {
    machineName: 'Use with Machine ID to distinguish computers',
    machineId: 'Unique identifier of the computer; used to decide whether Program path is editable',
    sceneName: 'Used to identify the monitored UE5 scene app',
    execPath: 'Executable path of the UE5 scene app (required)',
    args: 'One argument per line; passed to the launch command in order',
    enabled: 'When off, the scene config is kept, but Sentinel will not auto-start it'
  },
  placeholders: {
    sceneName: 'Enter a scene name, e.g. Indoor scene',
    execPath: 'Select or enter the executable path',
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
    sources: {
      local: 'Local copy',
      remote: 'Remote config'
    },
    fields: {
      enabled: 'Enabled',
      execPath: 'Program path',
      execState: 'Program availability',
      args: 'Launch command'
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
      merge: 'Merge and keep local conflicts'
    },
    status: {
      'local-only': 'Local only',
      'remote-only': 'Remote only',
      same: 'Same',
      conflict: 'Conflict'
    },
    empty: {
      local: {
        title: 'Not available locally',
        description: 'This scene currently exists only in the remote config.'
      },
      remote: {
        title: 'Not available remotely',
        description: 'This scene currently exists only in the local copy.'
      }
    }
  },
  dialogs: {
    pickProgramTitle: 'Select program'
  },
  errors: {
    sceneNameRequired: 'Scene name is required',
    execPathRequired: 'Program path is required',
    execPathInvalidWindowsPath: 'Program path must be a Windows absolute path (e.g. C:\\Apps\\Scene.exe or \\\\Server\\Share\\Scene.exe)'
  },
  card
};
