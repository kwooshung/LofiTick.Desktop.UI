import { card } from './card';

export const scenes = {
  labels: {
    machineName: '机器名称',
    machineId: '机器代码',
    machineRemark: '机器备注',
    sceneName: '场景名称',
    sourceExecPath: '程序路径',
    execPath: '副本路径',
    args: '启动参数',
    enabled: '是否启用'
  },
  desc: {
    machineName: '与机器代码共同用于区分不同电脑，避免管理混乱',
    machineId: '唯一标识一台电脑，用于判断程序路径是否允许编辑',
    sceneName: '用于识别被守护的 UE5 场景应用',
    sourceExecPath: '选择要守护的 exe，保存时会自动复制并生成对应副本',
    execPath: '当前场景实际运行的副本路径',
    execPathManaged: '当前场景实际运行的副本路径',
    args: '一行一个参数，将按顺序传入启动命令',
    enabled: '关闭后会保留该场景配置，但守护逻辑不会自动启动它'
  },
  placeholders: {
    sceneName: '请输入场景名称，例如：室内场景',
    sourceExecPath: '请选择可执行文件路径',
    execPath: '请选择或输入可执行文件路径',
    execPathManaged: '自动生成的副本路径',
    args: '一行一个参数，例如：\n-RenderOffScreen\n-Log'
  },
  actions: {
    pickProgram: '选择程序'
  },
  sync: {
    title: '本地与远程场景差异确认',
    description: '本地场景副本与远程机器配置存在差异，请确认本次同步方式。',
    descriptionWithMachine: '检测到 {machine} 的本地与远程场景不一致，请确认本次同步方式。',
    unnamed: '未命名场景',
    summary: {
      machine: '机器',
      local: '本地场景',
      remote: '远程场景',
      conflict: '冲突数量'
    },
    sources: {
      local: '本地副本',
      remote: '远程配置'
    },
    fields: {
      enabled: '启用状态',
      execPath: '副本路径',
      execState: '程序可用性',
      args: '启动命令'
    },
    values: {
      enabled: '已启用',
      disabled: '未启用',
      pathExists: '路径可用',
      pathMissing: '路径缺失'
    },
    actions: {
      open: '同步校验',
      useLocal: '使用本地',
      useRemote: '使用远程',
      merge: '合并配置'
    },
    status: {
      'local-only': '仅本地存在',
      'remote-only': '仅远程存在',
      same: '两端一致',
      conflict: '内容冲突'
    },
    empty: {
      local: {
        title: '本地不存在该场景',
        description: '该场景当前只存在于远程配置中。'
      },
      remote: {
        title: '远程不存在该场景',
        description: '该场景当前只存在于本地副本中。'
      }
    }
  },
  dialogs: {
    pickProgramTitle: '选择守护程序'
  },
  errors: {
    sceneNameRequired: '场景名称不能为空',
    sourceExecPathRequired: '程序路径不能为空',
    execPathRequired: '程序路径不能为空',
    execPathInvalidWindowsPath: '程序路径必须是 Windows 绝对路径（例如：C:\\Apps\\Scene.exe 或 \\\\Server\\Share\\Scene.exe）'
  },
  card
};
