import { card } from './card';

export const scenes = {
  labels: {
    machineName: '機器名稱',
    machineId: '機器碼',
    sceneName: '場景名稱',
    execPath: '程式路徑',
    args: '啟動參數'
  },
  desc: {
    machineName: '與機器碼共同用於區分不同電腦，避免管理混亂',
    machineId: '唯一標識一台電腦，用於判斷程式路徑是否允許編輯',
    sceneName: '用於識別被守護的 UE5 場景應用',
    execPath: 'UE5 場景應用可執行檔路徑（必填）',
    args: '一行一個參數，將按順序傳入啟動命令'
  },
  placeholders: {
    sceneName: '請輸入場景名稱，例如：室內場景',
    execPath: '請選擇或輸入可執行檔路徑',
    args: '一行一個參數，例如：\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: '選擇程式'
  },
  dialogs: {
    pickProgramTitle: '選擇守護程式'
  },
  errors: {
    sceneNameRequired: '場景名稱不能為空',
    execPathRequired: '程式路徑不能為空',
    execPathInvalidWindowsPath: '程式路徑必須是 Windows 絕對路徑（例如：C:\\Apps\\Scene.exe 或 \\\\Server\\Share\\Scene.exe）'
  },
  card
};
