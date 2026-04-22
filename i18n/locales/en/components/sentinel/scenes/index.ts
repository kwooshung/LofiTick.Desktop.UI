import { card } from './card';

export const scenes = {
  labels: {
    machineName: 'Machine name',
    machineId: 'Machine ID',
    machineUuid: 'Machine UUID',
    sceneName: 'Scene name',
    execPath: 'Program path',
    args: 'Arguments'
  },
  desc: {
    machineName: 'Use with Machine ID to distinguish computers',
    machineId: 'Unique identifier of the computer; used to decide whether Program path is editable',
    machineUuid: 'Used to identify the same computer across devices',
    sceneName: 'Used to identify the monitored UE5 scene app',
    execPath: 'Executable path of the UE5 scene app (required)',
    args: 'One argument per line; passed to the launch command in order'
  },
  placeholders: {
    sceneName: 'Enter a scene name, e.g. Indoor scene',
    execPath: 'Select or enter the executable path',
    args: 'One argument per line, e.g.:\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: 'Pick program'
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
