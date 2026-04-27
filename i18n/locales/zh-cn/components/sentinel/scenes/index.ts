import { card } from './card';

export const scenes = {
  labels: {
    machineName: '机器名称',
    machineId: '机器代码',
    machineRemark: '机器备注',
    sceneName: '场景名称',
    execPath: '程序路径',
    args: '启动参数'
  },
  desc: {
    machineName: '与机器代码共同用于区分不同电脑，避免管理混乱',
    machineId: '唯一标识一台电脑，用于判断程序路径是否允许编辑',
    sceneName: '用于识别被守护的 UE5 场景应用',
    execPath: 'UE5 场景应用可执行文件路径（必填）',
    args: '一行一个参数，将按顺序传入启动命令'
  },
  placeholders: {
    sceneName: '请输入场景名称，例如：室内场景',
    execPath: '请选择或输入可执行文件路径',
    args: '一行一个参数，例如：\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: '选择程序'
  },
  dialogs: {
    pickProgramTitle: '选择守护程序'
  },
  errors: {
    sceneNameRequired: '场景名称不能为空',
    execPathRequired: '程序路径不能为空',
    execPathInvalidWindowsPath: '程序路径必须是 Windows 绝对路径（例如：C:\\Apps\\Scene.exe 或 \\\\Server\\Share\\Scene.exe）'
  },
  card
};
