/**
 * 类型：Tauri 播客任务状态。
 */
export type TTauraPodcastTaskStatus = 'accepted' | 'running' | 'succeeded' | 'failed' | 'canceled';

/**
 * 类型：Tauri 播客任务阶段。
 */
export type TTauraPodcastTaskPhase = 'queued' | 'connecting' | 'sessionStarting' | 'generating' | 'finalizing' | 'completed' | 'failed' | 'canceled';

/**
 * 类型：Tauri 播客任务事件。
 */
export type TTauraPodcastEventType = 'taskStarted' | 'connectionStarted' | 'sessionStarted' | 'roundStarted' | 'audioChunk' | 'roundFinished' | 'usage' | 'taskFinished' | 'taskFailed' | 'taskCanceled';

/**
 * 接口：Tauri 播客脚本文本。
 */
export interface ITauriPodcastNlpText {
  /**
   * 发音人 speaker code。
   */
  speaker: string;

  /**
   * 播报文本。
   */
  text: string;
}

/**
 * 接口：Tauri 播客任务受理响应。
 */
export interface ITauriPodcastGenerateAccepted {
  /**
   * 任务 ID。
   */
  taskId: string;

  /**
   * 请求 ID。
   */
  requestId: string;

  /**
   * 输入 ID。
   */
  inputId: string;

  /**
   * 当前状态。
   */
  status: TTauraPodcastTaskStatus;

  /**
   * 当前阶段。
   */
  phase: TTauraPodcastTaskPhase;
}

/**
 * 接口：Tauri 播客任务用量。
 */
export interface ITauriPodcastUsage {
  /**
   * 输入文本 token 数。
   */
  inputTextTokens: number;

  /**
   * 输出音频 token 数。
   */
  outputAudioTokens: number;
}

/**
 * 接口：Tauri 播客轮次元数据。
 */
export interface ITauriPodcastRound {
  /**
   * 轮次 ID。
   */
  roundId: number;

  /**
   * 发音人 speaker code。
   */
  speaker: string;

  /**
   * 当前轮次文本。
   */
  text: string;

  /**
   * 文本类型。
   */
  textType: string;

  /**
   * 开始时间。
   */
  startTime?: null | number;

  /**
   * 结束时间。
   */
  endTime?: null | number;

  /**
   * 音频时长。
   */
  audioDuration?: null | number;

  /**
   * 分段文件路径。
   */
  filePath: string;

  /**
   * 字节长度。
   */
  byteLength: number;

  /**
   * 是否片头音乐。
   */
  isHeadMusic: boolean;

  /**
   * 是否片尾音乐。
   */
  isTailMusic: boolean;
}

/**
 * 接口：Tauri 播客进度快照。
 */
export interface ITauriPodcastProgress {
  /**
   * 当前阶段。
   */
  phase: TTauraPodcastTaskPhase;

  /**
   * 已完成轮次。
   */
  completedRounds: number;

  /**
   * 总轮次。
   */
  totalRounds?: null | number;

  /**
   * 当前轮次 ID。
   */
  currentRoundId?: null | number;

  /**
   * 当前发音人。
   */
  currentSpeaker: string;

  /**
   * 当前已接收字节数。
   */
  receivedBytes: number;

  /**
   * 当前已接收时长。
   */
  receivedDuration?: null | number;

  /**
   * 百分比。
   */
  percent?: null | number;

  /**
   * 是否为不确定进度。
   */
  indeterminate: boolean;
}

/**
 * 接口：Tauri 播客任务结果。
 */
export interface ITauriPodcastTaskResult {
  /**
   * 服务端返回的音频地址。
   */
  audioUrl: string;

  /**
   * 最终音频文件路径。
   */
  finalFilePath: string;

  /**
   * 文本转写。
   */
  transcript: ITauriPodcastNlpText[];

  /**
   * 轮次列表。
   */
  rounds: ITauriPodcastRound[];

  /**
   * 总音频时长。
   */
  totalAudioDuration?: null | number;

  /**
   * 总轮次。
   */
  totalRounds?: null | number;
}

/**
 * 接口：Tauri 播客任务快照。
 */
export interface ITauriPodcastTaskSnapshot {
  /**
   * 任务 ID。
   */
  taskId: string;

  /**
   * 请求 ID。
   */
  requestId: string;

  /**
   * 输入 ID。
   */
  inputId: string;

  /**
   * 动作类型。
   */
  action: 'longText' | 'script' | 'prompt';

  /**
   * 当前状态。
   */
  status: TTauraPodcastTaskStatus;

  /**
   * 当前阶段。
   */
  phase: TTauraPodcastTaskPhase;

  /**
   * 开始时间戳。
   */
  startedAtMs: number;

  /**
   * 结束时间戳。
   */
  finishedAtMs?: null | number;

  /**
   * 最近错误。
   */
  lastError: string;

  /**
   * 用量信息。
   */
  usage: ITauriPodcastUsage;

  /**
   * 任务结果。
   */
  result?: null | ITauriPodcastTaskResult;

  /**
   * 当前进度。
   */
  progress: ITauriPodcastProgress;
}

/**
 * 接口：Tauri 播客任务事件。
 */
export interface ITauriPodcastTaskEvent {
  /**
   * 任务 ID。
   */
  taskId: string;

  /**
   * 事件类型。
   */
  eventType: TTauraPodcastEventType;

  /**
   * 事件时间戳。
   */
  timestampMs: number;

  /**
   * 最新任务快照。
   */
  snapshot: ITauriPodcastTaskSnapshot;
}
