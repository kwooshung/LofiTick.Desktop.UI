/**
 * 接口：API 返回的信息
 */
export interface IStoresToastApi {
  /**
   * key，用于区分和监听
   */
  key: string;

  /**
   * 是否启用
   */
  enable: boolean;

  /**
   * 错误代码
   */
  code?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 类型
   */
  color?: 'neutral' | 'success' | 'info' | 'warning' | 'error';

  /**
   * 持续时间，单位毫秒
   */
  duration?: number;

  /**
   * 是否显示进度条
   */
  progress?: boolean;

  /**
   * 是否显示关闭按钮
   */
  close?: boolean;
}
