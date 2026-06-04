import type { SelectMenuItem } from '@nuxt/ui';

/**
 * Hook：为多选的 USelectMenu 提供"最多选择 N 个"的限制逻辑。
 *
 * 当已选数量达到上限时，下拉选项列表会自动收缩为仅显示已选项目（防止继续添加新项），
 * 但已选项目仍可正常删除。未达到上限时显示完整的候选列表。
 *
 * @template T 选项对象的类型，必须兼容 {@link SelectMenuItem}（包含 label 和 value），可以扩展额外字段（如 count）
 * @param {Ref<T[]>} selected 已选选项的 Ref（v-model）
 * @param {number} [limit=5] 最大可选数量，默认 5
 * @returns 一个对象，包含：
 *   - {@link items} 只读的选项列表，直接绑定到 USelectMenu 的 :items 属性
 *   - {@link setOriginItems} 用于在 API 返回新数据时更新完整候选列表的函数
 *
 * @example
 * interface TagItem extends SelectMenuItem {
 *   count: number
 * }
 *
 * const { items: tagItems, setOriginItems: setTagOrigin } =
 *   useSelectMenuLimited<TagItem>(stateTagSelected, 5);
 */
export const useSelectMenuLimited = <T extends SelectMenuItem = SelectMenuItem>(selected: Ref<T[]>, limit: number = 5) => {
  /**
   * 完整的原始候选选项列表（API 返回的所有结果）
   */
  const originItems = ref<T[]>([]);

  /**
   * 实际传递给 USelectMenu 显示的选项列表（会根据已选数量自动切换）
   */
  const items = ref<T[]>([]);

  /**
   * 监听已选数量变化，动态控制下拉显示内容
   */
  watch(
    selected,
    () => {
      if (selected.value.length >= limit) {
        // 已达到上限 → 只显示已选项目（保持可删除能力）
        items.value = selected.value.slice();
      } else {
        // 未达到上限 → 显示完整候选列表
        items.value = originItems.value;
      }
    },
    { deep: true, immediate: true } // 加 immediate 确保初次加载也正确
  );

  /**
   * 更新原始候选选项列表（通常在 API 请求成功后调用）
   *
   * @param newItems - API 返回的完整选项数组
   */
  const setOriginItems = (newItems: T[]) => {
    originItems.value = newItems;

    // 如果当前未达到上限，立即同步到显示列表
    if (selected.value.length < limit) {
      items.value = newItems;
    }
    // 已达上限时保持只显示已选项，由 watch 自动处理
  };

  return {
    /**
     * 只读的选项列表，直接绑定到 USelectMenu 的 `:items`
     */
    items: items as Readonly<Ref<T[]>>,

    /**
     * 更新原始候选列表的函数
     */
    setOriginItems
  };
};
