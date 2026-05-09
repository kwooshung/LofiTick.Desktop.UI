/**
 * 类型：场景配置值
 * 描述：用于 UE5 场景守护的基础信息与启动参数。
 */
export type TSentinelScenesConfigValues = {
  /**
   * 机器码
   */
  machineId: string;

  /**
   * 机器名称
   */
  machineName: string;

  /**
   * 机器备注
   */
  machineRemark: string;

  /**
   * 场景名称
   */
  sceneName: string;

  /**
   * 原始可执行文件路径
   */
  sourceExecPath: string;

  /**
   * 可执行文件路径
   */
  execPath: string;

  /**
   * 启动参数（每项为一个参数）
   */
  args: string[];

  /**
   * 是否启用
   */
  enabled: boolean;
};

/**
 * 接口：表单校验错误
 */
export interface ISentinelScenesConfigValidateErrors {
  /**
   * sceneName 错误信息
   */
  sceneName?: string;

  /**
   * sourceExecPath 错误信息
   */
  sourceExecPath?: string;
}

/**
 * 类型：表单校验结果
 */
export type TSentinelScenesConfigValidateResult = {
  /**
   * 是否校验通过
   */
  valid: boolean;

  /**
   * 错误信息
   */
  errors: ISentinelScenesConfigValidateErrors;
};

/**
 * 接口：表单状态
 */
export interface ISentinelScenesConfigFormState {
  /**
   * 场景名称
   */
  sceneName: string;

  /**
   * 原始可执行文件路径
   */
  sourceExecPath: string;

  /**
   * 可执行文件路径
   */
  execPath: string;

  /**
   * 启动参数（文本形式：一行一个参数）
   */
  argsText: string;

  /**
   * 是否启用
   */
  enabled: boolean;
}

/**
 * 接口：组件属性
 */
export interface ISentinelScenesConfigProps {
  /**
   * 机器码（只读）
   */
  machineId?: string;

  /**
   * 机器名称（只读）
   */
  machineName?: string;

  /**
   * 机器备注（只读）
   */
  machineRemark?: string;

  /**
   * 场景名称（初始值）
   */
  sceneName?: string;

  /**
   * 本机机器码
   * 描述：用于判断 execPath 是否允许编辑；与 machineId 一致才允许编辑。
   */
  localMachineId?: string;

  /**
   * execPath 是否允许编辑（外部开关）
   */
  execPathEditable?: boolean;

  /**
   * 原始路径是否允许选择（外部开关）
   */
  sourceExecPathEditable?: boolean;

  /**
   * 初始原始可执行文件路径
   */
  sourceExecPath?: string;

  /**
   * 初始可执行文件路径
   */
  execPath?: string;

  /**
   * 初始启动参数
   */
  args?: string[];

  /**
   * 初始启用状态
   */
  enabled?: boolean;

  /**
   * 表单 id
   * 描述：用于让抽屉外部的按钮通过 HTML form 属性触发表单提交。
   */
  formId?: string;
}

/**
 * 接口：组件事件
 */
export interface ISentinelScenesConfigEmits {
  /**
   * 事件：配置变更/表单提交
   * 描述：e='change' 表示配置变更；e='submit' 表示校验通过后的提交。
   * @param {TSentinelScenesConfigValues} values 当前值
   * @returns {void} 无返回值
   */
  (e: 'change' | 'submit', values: TSentinelScenesConfigValues): void;

  /**
   * 事件：请求选择可执行文件
   * @param {string} current 当前 execPath
   * @returns {void} 无返回值
   */
  (e: 'execpath-pick', current: string): void;

  /**
   * 事件：表单校验结果
   * 描述：无论通过或失败都会触发，用于外部控制按钮可用状态。
   * @param {TSentinelScenesConfigValidateResult} result 校验结果
   * @returns {void} 无返回值
   */
  (e: 'validate', result: TSentinelScenesConfigValidateResult): void;
}

/**
 * 接口：组件暴露方法
 */
export interface ISentinelScenesConfigExpose {
  /**
   * 函数：获取当前配置值
   * @returns {TSentinelScenesConfigValues} 当前值
   */
  valuesGet: () => TSentinelScenesConfigValues;

  /**
   * 函数：设置当前配置值
   * @param {TSentinelScenesConfigValues} values 值
   * @returns {void} 无返回值
   */
  valuesSet: (values: TSentinelScenesConfigValues) => void;

  /**
   * 函数：触发表单校验并在通过时提交
   * @returns {TSentinelScenesConfigValidateResult} 校验结果
   */
  validateAndSubmit: () => TSentinelScenesConfigValidateResult;
}
