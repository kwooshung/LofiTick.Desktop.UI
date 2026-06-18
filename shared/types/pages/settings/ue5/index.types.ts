/**
 * 类型：settings / ue5 共享类型总入口。
 *
 * 该文件作为 settings/ue5 的 barrel，总结并转发分层子入口。
 * 当前 UE5 相关共享结构主要集中在展示层，
 * 因此先收敛到 `display` 子入口，并保留当前文件作为总入口。
 */

export * from '@@/shared/types/pages/settings/ue5/display/index.types';
