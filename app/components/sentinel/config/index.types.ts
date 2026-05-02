/**
 * 接口：哨兵通用配置
 * 描述：用于无人值守模式下的心跳与重启策略配置（不包含开机自启、请求地址等页面独有项）
 */
export interface ISentinelConfig {
  /**
   * 属性：在线窗口
   * 描述：单位秒；超过该时间未收到新心跳则视为离线
   */
  onlineWindowSeconds: number;

  /**
   * 属性：心跳间隔
   * 描述：单位毫秒
   */
  heartbeatInterval: number;

  /**
   * 属性：崩溃计数
   * 描述：连续多少次未收到心跳则判定崩溃
   */
  heartbeatTimeoutCount: number;

  /**
   * 属性：重启延时
   * 描述：检测到崩溃后，延时多久再执行重启（毫秒）
   */
  restartDelay: number;

  /**
   * 属性：重启冷却
   * 描述：达到最大重启次数后进入冷却期（毫秒）
   */
  restartCooldown: number;

  /**
   * 属性：最大重启
   * 描述：单次崩溃事件允许的最大连续重启次数
   */
  restartMaxAttempts: number;

  /**
   * 属性：重启爆发
   * 描述：每次连续重启失败的次数阈值，达到则视为一次爆发
   */
  restartBurstWindow: number;

  /**
   * 属性：爆发冷却
   * 描述：达到一次爆发后，禁止重启的冷却时间（毫秒）
   */
  restartBurstCooldown: number;

  /**
   * 属性：最大爆发
   * 描述：连续爆发事件允许的最大次数
   */
  restartBurstMaxAttempts: number;
}

/**
 * 类型：哨兵通用配置覆盖值
 * 描述：用于按字段覆盖默认值；字段缺失时回退到默认值
 */
export type ISentinelConfigOverrides = Partial<ISentinelConfig>;

/**
 * 接口：哨兵配置分析结果
 * 描述：用于把配置换算为可读时间，并给出最坏情况耗时估算
 */
export interface ISentinelConfigAnalysis {
  /**
   * 属性：判定崩溃时长
   * 描述：从“开始丢心跳”到“判定为崩溃”的时间
   */
  crashDecisionDuration: string;

  /**
   * 属性：单次重启延时
   * 描述：判定崩溃后，等待多久才执行一次重启
   */
  restartDelayDuration: string;

  /**
   * 属性：达到最大重启后的冷却时长
   */
  restartCooldownDuration: string;

  /**
   * 属性：一次“连续重启”最坏时长
   * 描述：从“开始丢心跳”开始估算；按“每次重启尝试都会再次进入判定崩溃流程”的最坏情况推演，并重复到「最大重启」为止
   */
  restartEpisodeWorstDuration: string;

  /**
   * 属性：一次“连续重启”+ 冷却 的最坏时长
   */
  restartEpisodeWithCooldownWorstDuration: string;

  /**
   * 属性：一次“重启爆发”最坏时长
   * 描述：从“开始丢心跳”开始估算；按“完整一轮连续重启（达到最大重启后进入重启冷却）算 1 次失败”计数，直到触发 1 次「重启爆发」为止
   */
  burstWorstDuration: string;

  /**
   * 属性：爆发冷却时长
   */
  burstCooldownDuration: string;

  /**
   * 属性：最坏总时长
   * 描述：从“开始丢心跳”到“触发 1 次爆发，并叠加剩余爆发次数的爆发冷却、重启被强制禁用”的估算总时长
   */
  worstTotalDuration: string;
}

/**
 * 接口：组件对外事件
 */
export interface ISentinelConfigEmits {
  /**
   * 事件：分析结果变化
   * @param {ISentinelConfigAnalysis} analysis 分析结果
   */
  'analysis-change': [analysis: ISentinelConfigAnalysis];
}

/**
 * 接口：组件对外暴露的方法
 */
export interface ISentinelConfigExpose {
  /**
   * 函数：获取当前生效的配置
   * @return {ISentinelConfig} 当前配置
   */
  configGet: () => ISentinelConfig;

  /**
   * 函数：获取配置分析结果
   * @return {ISentinelConfigAnalysis} 分析结果
   */
  analysisGet: () => ISentinelConfigAnalysis;

  /**
   * 函数：设置覆盖值（缺失字段回退默认值）
   * @param {ISentinelConfigOverrides} overrides 覆盖值
   */
  overridesSet: (overrides: ISentinelConfigOverrides) => void;

  /**
   * 函数：重置为默认值
   */
  resetToDefaults: () => void;

  /**
   * 函数：重置为（默认值 + 覆盖值）
   * @param {ISentinelConfigOverrides} overrides 覆盖值
   */
  resetToOverrides: (overrides: ISentinelConfigOverrides) => void;
}
