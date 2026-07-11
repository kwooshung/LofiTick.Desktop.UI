import { card } from '@@/i18n/locales/zh-tw/components/sentinel/scenes/card';

export const scenes = {
  labels: {
    machineName: '機器名稱',
    machineId: '機器碼',
    machineRemark: '機器備註',
    sceneName: '場景名稱',
    sourceExecPath: '程式路徑',
    execPath: '副本路徑',
    args: '啟動參數',
    enabled: '是否啟用'
  },
  desc: {
    sceneName: '用於識別被守護的 UE5 場景應用',
    sourceExecPath: '選擇要守護的 exe 後，儲存時桌面殼會自動複製並產生對應副本',
    execPathManaged: '目前場景實際執行的副本路徑',
    args: '一行一個參數，將按順序傳入啟動命令',
    enabled: '關閉後會保留該場景設定，但守護邏輯不會自動啟動它'
  },
  placeholders: {
    sceneName: '請輸入場景名稱，例如：室內場景',
    sourceExecPath: '請選擇可執行檔路徑',
    execPathManaged: '自動產生的副本路徑',
    args: '一行一個參數，例如：\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: '選擇程式'
  },
  sync: {
    title: '本地與遠端場景差異確認',
    description: '本地場景副本與遠端機器設定存在差異，請確認本次同步方式。',
    descriptionWithMachine: '偵測到 {machine} 的本地與遠端場景不一致，請確認本次同步方式。',
    unnamed: '未命名場景',
    summary: {
      machine: '機器',
      local: '本地場景',
      remote: '遠端場景',
      conflict: '衝突數量'
    },
    shortFields: {
      state: '狀態',
      path: '路徑',
      command: '命令'
    },
    shortSources: {
      local: '本地',
      remote: '遠端'
    },
    values: {
      enabled: '已啟用',
      disabled: '未啟用',
      pathExists: '路徑可用',
      pathMissing: '路徑缺失'
    },
    actions: {
      open: '同步校驗',
      useLocal: '使用本地',
      useRemote: '使用遠端',
      merge: '合併配置'
    },
    status: {
      'local-only': '僅本地存在',
      'remote-only': '僅遠端存在',
      same: '兩端一致',
      conflict: '內容衝突'
    }
  },
  dialogs: {
    pickProgramTitle: '選擇守護程式'
  },
  errors: {
      shortFields: {
        state: '狀態',
        path: '路徑',
        command: '命令'
      },
      shortSources: {
        local: '本地',
        remote: '遠端'
      },
    sceneNameRequired: '場景名稱不能為空',
    sourceExecPathRequired: '程式路徑不能為空',
    execPathInvalidWindowsPath: '程式路徑必須是 Windows 絕對路徑（例如：C:\\Apps\\Scene.exe 或 \\\\Server\\Share\\Scene.exe）'
  },
  card
};
