import { card } from '@@/i18n/locales/ja/components/sentinel/scenes/card';

export const scenes = {
  labels: {
    machineName: 'マシン名',
    machineId: 'マシンID',
    machineRemark: 'マシン備考',
    sceneName: 'シーン名',
    sourceExecPath: 'プログラムパス',
    execPath: '副本パス',
    args: '起動引数',
    enabled: '有効化'
  },
  desc: {
    sceneName: '監護対象のUE5シーンアプリを識別します',
    sourceExecPath: '監護対象の exe を選ぶと、保存時にデスクトップシェルが対応する副本を自動生成します',
    execPathManaged: 'このシーンが実際に起動する副本のパスです',
    args: '1行1引数。順番どおりに起動コマンドへ渡します',
    enabled: 'オフにすると設定は残りますが、Sentinel はこのシーンを自動起動しません'
  },
  placeholders: {
    sceneName: 'シーン名を入力してください（例：屋内シーン）',
    sourceExecPath: '実行ファイルパスを選択してください',
    execPathManaged: '自動生成される副本パス',
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
    }
  },
  dialogs: {
    pickProgramTitle: '監護プログラムを選択'
  },
  errors: {
    sceneNameRequired: 'シーン名は必須です',
    sourceExecPathRequired: 'プログラムパスは必須です',
    execPathInvalidWindowsPath: 'プログラムパスは Windows の絶対パスである必要があります（例：C:\\Apps\\Scene.exe または \\\\Server\\Share\\Scene.exe）'
  },
  card
};
