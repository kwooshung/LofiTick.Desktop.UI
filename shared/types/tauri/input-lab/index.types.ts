/**
 * 类型：键鼠实验台动作。
 */
export type TInputLabAction =
  | 'current_position'
  | 'distance_to'
  | 'move_to'
  | 'move_by'
  | 'move_to_rect_random'
  | 'click'
  | 'click_current'
  | 'double_click'
  | 'right_click'
  | 'click_rect_random'
  | 'drag_to'
  | 'drag_by'
  | 'drag_rect_to_rect_random'
  | 'scroll_vertical'
  | 'scroll_horizontal'
  | 'idle_random_move'
  | 'idle_circle'
  | 'idle_infinity'
  | 'idle_eight'
  | 'idle_random_scroll'
  | 'key_tap'
  | 'hotkey'
  | 'type_text'
  | 'paste_text'
  | 'random_wait'
  | 'move_to_area'
  | 'click_area'
  | 'double_click_area'
  | 'right_click_area'
  | 'drag_area_to_area'
  | 'type_text_into_area'
  | 'replace_text_in_area'
  | 'scroll_vertical_human';

/**
 * 接口：键鼠实验台点位。
 */
export interface IInputLabPoint {
  /**
   * X 坐标，单位为物理像素。
   */
  x: number;

  /**
   * Y 坐标，单位为物理像素。
   */
  y: number;
}

/**
 * 接口：键鼠实验台矩形。
 */
export interface IInputLabRect {
  /**
   * 左上角 X 坐标，单位为物理像素。
   */
  x: number;

  /**
   * 左上角 Y 坐标，单位为物理像素。
   */
  y: number;

  /**
   * 宽度，单位为物理像素。
   */
  width: number;

  /**
   * 高度，单位为物理像素。
   */
  height: number;
}

/**
 * 接口：键鼠实验台连续动作步骤。
 */
export interface IInputLabStep {
  /**
   * 步骤标识。
   */
  id: string;

  /**
   * 步骤名称。
   */
  label: string;

  /**
   * 是否启用。
   */
  enabled: boolean;

  /**
   * 动作名称。
   */
  action: TInputLabAction;

  /**
   * 单点动作目标点。
   */
  point?: IInputLabPoint;

  /**
   * 起点。
   */
  from?: IInputLabPoint;

  /**
   * 终点。
   */
  to?: IInputLabPoint;

  /**
   * 单区域动作目标区域。
   */
  rect?: IInputLabRect;

  /**
   * 起点区域。
   */
  fromRect?: IInputLabRect;

  /**
   * 终点区域。
   */
  toRect?: IInputLabRect;

  /**
   * 文本内容或按键名。
   */
  text: string;

  /**
   * 快捷键按键序列。
   */
  keys: string[];

  /**
   * 步骤专属数值参数。
   */
  numbers: Record<string, number>;
}

/**
 * 接口：键鼠实验台执行请求。
 */
export interface IInputLabExecuteRequest {
  /**
   * 动作名称。
   */
  action: TInputLabAction;

  /**
   * 连续动作步骤。
   */
  steps: IInputLabStep[];

  /**
   * 是否仅生成 trace。
   */
  dryRun: boolean;

  /**
   * 数值参数映射。
   */
  numbers: Record<string, number>;

  /**
   * 布尔参数映射。
   */
  booleans: Record<string, boolean>;

  /**
   * 字符串参数映射。
   */
  strings: Record<string, string>;

  /**
   * 单点动作目标点。
   */
  point?: IInputLabPoint;

  /**
   * 起点。
   */
  from?: IInputLabPoint;

  /**
   * 终点。
   */
  to?: IInputLabPoint;

  /**
   * 单区域动作目标区域。
   */
  rect?: IInputLabRect;

  /**
   * 起点区域。
   */
  fromRect?: IInputLabRect;

  /**
   * 终点区域。
   */
  toRect?: IInputLabRect;

  /**
   * 文本内容或按键名。
   */
  text: string;
}

/**
 * 接口：键鼠实验台 trace 项。
 */
export interface IInputLabTraceItem {
  /**
   * trace 类型。
   */
  kind: string;

  /**
   * trace 摘要。
   */
  summary: string;

  /**
   * trace 详情。
   */
  detail: unknown;
}

/**
 * 接口：键鼠实验台执行响应。
 */
export interface IInputLabExecuteResponse {
  /**
   * 实际执行的动作。
   */
  action: TInputLabAction | 'script';

  /**
   * 是否 dry-run。
   */
  dryRun: boolean;

  /**
   * 执行摘要。
   */
  summary: string;

  /**
   * 动作轨迹。
   */
  trace: IInputLabTraceItem[];

  /**
   * 附加结果。
   */
  result: unknown;
}
