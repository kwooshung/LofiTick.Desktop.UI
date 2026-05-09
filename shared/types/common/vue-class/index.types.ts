/**
 * 类型：Vue Class 绑定值
 * 描述：用于兼容 Vue 的 `:class` 传参形式（字符串 / 数组 / 对象）。
 */
export type TVueClass = string | string[] | Record<string, boolean>;
