/**
 * 接口：URL 协议选项。
 */
export interface IFormUrlInputProtocolOption {
  /** 显示文案。 */
  label: string;
  /** 协议值。 */
  value: TFormUrlInputProtocol;
}

/**
 * 类型：URL 输入组件协议。
 */
export type TFormUrlInputProtocol = 'http' | 'https' | 'ws' | 'wss';

/**
 * 接口：URL 输入组件属性。
 */
export interface IFormUrlInputProps {
  /** 输入框占位文案。 */
  placeholder?: string;
  /** 是否只读。 */
  readonly?: boolean;
  /** 是否禁用。 */
  disabled?: boolean;
  /** 协议选择器宽度类名。 */
  protocolSelectClass?: string;
  /** 是否只保留基础 URL。 */
  baseUrlOnly?: boolean;
}

/**
 * 接口：URL 拆分结果。
 */
export interface IFormUrlInputSplitResult {
  /** URL 协议。 */
  protocol: TFormUrlInputProtocol;
  /** 协议后面的主体内容，可包含路径。 */
  value: string;
}
