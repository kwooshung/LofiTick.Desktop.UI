import { card } from './card';

export const scenes = {
  labels: {
    machineName: 'マシン名',
    machineId: 'マシンID',
    machineRemark: 'マシン備考',
    sceneName: 'シーン名',
    execPath: 'プログラムパス',
    args: '起動引数',
    enabled: '有効化'
  },
  desc: {
    machineName: 'マシンIDと合わせて端末を識別します',
    machineId: '端末を一意に識別し、プログラムパスの編集可否判定に使用します',
    sceneName: '監護対象のUE5シーンアプリを識別します',
    execPath: 'UE5シーンアプリの実行ファイルパス（必須）',
    args: '1行1引数。順番どおりに起動コマンドへ渡します',
    enabled: 'オフにすると設定は残りますが、Sentinel はこのシーンを自動起動しません'
  },
  placeholders: {
    sceneName: 'シーン名を入力してください（例：屋内シーン）',
    execPath: '実行ファイルパスを選択または入力してください',
    args: '1行1引数。例：\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: 'プログラムを選択'
  },
  sync: {
    title: 'ローカルとリモートのシーン差分を確認',
    description: 'ローカルのシーン副本とリモート設定に差異があります。同期方法を選択してください。',
    descriptionWithMachine: '{machine} のローカルとリモートのシーン設定に差異があります。同期方法を選択してください。',
    unnamed: '名称未設定のシーン',
    summary: {
      machine: 'マシン',
      local: 'ローカルシーン',
      remote: 'リモートシーン',
      conflict: '競合数'
    },
    sources: {
      local: 'ローカル副本',
      remote: 'リモート設定'
    },
    fields: {
      enabled: '有効状態',
      execPath: 'プログラムパス',
      execState: 'プログラム可用性',
      args: '起動コマンド'
    },
    values: {
      enabled: '有効',
      disabled: '無効',
      pathExists: 'パス有効',
      pathMissing: 'パス欠落'
    },
    actions: {
      open: '同期確認',
      useLocal: 'ローカルを使用',
      useRemote: 'リモートを使用',
      merge: '設定をマージ'
    },
    status: {
      'local-only': 'ローカルのみ',
      'remote-only': 'リモートのみ',
      same: '一致',
      conflict: '競合'
    },
    empty: {
      local: {
        title: 'ローカルには存在しません',
        description: 'このシーンは現在リモート設定にのみ存在します。'
      },
      remote: {
        title: 'リモートには存在しません',
        description: 'このシーンは現在ローカル副本にのみ存在します。'
      }
    }
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
