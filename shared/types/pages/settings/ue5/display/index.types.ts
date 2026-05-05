/**
 * 类型：settings / ue5 展示字段契约。
 *
 * 该文件承载 settings/ue5 组件当前使用的展示层请求模型，
 * 主要覆盖 UE5 本地桥接接入地址与请求说明区域。
 */

/**
 * 接口：UE5 本地桥接请求参数项
 */
export interface IPageSettingsUe5RequestParamItem {
  /**
   * 参数名
   */
  name: string;

  /**
   * 参数值
   */
  value: string;
}

/**
 * 接口：UE5 本地桥接请求项
 */
export interface IPageSettingsUe5RequestItem {
  /**
   * 请求唯一标识
   */
  id: string;

  /**
   * 请求标题
   */
  title: string;

  /**
   * 请求方法
   */
  method: string;

  /**
   * 完整请求地址
   */
  url: string;

  /**
   * 请求说明
   */
  description: string;

  /**
   * 请求参数
   */
  params: IPageSettingsUe5RequestParamItem[];
}