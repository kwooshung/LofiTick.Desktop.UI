import { card } from './card';

export const scenes = {
  labels: {
    machineName: 'マシン名',
    machineId: 'マシンID',
    sceneName: 'シーン名',
    execPath: 'プログラムパス',
    args: '起動引数'
  },
  desc: {
    machineName: 'マシンIDと合わせて端末を識別します',
    machineId: '端末を一意に識別し、プログラムパスの編集可否判定に使用します',
    sceneName: '監護対象のUE5シーンアプリを識別します',
    execPath: 'UE5シーンアプリの実行ファイルパス（必須）',
    args: '1行1引数。順番どおりに起動コマンドへ渡します'
  },
  placeholders: {
    sceneName: 'シーン名を入力してください（例：屋内シーン）',
    execPath: '実行ファイルパスを選択または入力してください',
    args: '1行1引数。例：\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: 'プログラムを選択'
  },
  dialogs: {
    pickProgramTitle: '監護プログラムを選択'
  },
  errors: {
    sceneNameRequired: 'シーン名は必須です',
    execPathRequired: 'プログラムパスは必須です',
    execPathInvalidWindowsPath: 'プログラムパスは Windows の絶対パスである必要があります（例：C:\\Apps\\Scene.exe または \\\\Server\\Share\\Scene.exe）'
  },
  card
};
