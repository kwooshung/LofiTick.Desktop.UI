/**
 * 类型：settings / unattended 共享类型总入口。
 *
 * 该文件作为 settings/unattended 的 barrel，总结并转发分层子入口。
 * 为了避免单文件持续膨胀，这里将无人值守共享类型拆成三层：
 * - `page`：页面契约与后端/Tauri 数据结构
 * - `events`：组件事件 payload
 * - `display`：纯展示层派生模型
 *
 * 现有调用方继续从当前文件导入，无需修改路径。
 */

export * from './display/index.types';
export * from './events/index.types';
export * from './page/index.types';
