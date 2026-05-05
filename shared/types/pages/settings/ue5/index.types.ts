/**
 * 类型：settings / ue5 展示字段契约。
 *
 * 该文件统一承载 settings/ue5 组件层使用的本地桥接展示结构，
 * 避免组件内继续维护匿名或局部重复的数据入口。
 *
 * 当前覆盖来源：
 * - `app/components/settings/ue5/index.vue`
 * - Tauri settings bridge 返回的 UE5 本地接入地址与详情
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
