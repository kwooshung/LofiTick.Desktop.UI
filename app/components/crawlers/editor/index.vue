<template>
  <div class="bg-default flex h-full min-h-0 overflow-hidden" :aria-label="computedDescription">
    <aside class="border-default bg-elevated/30 scrollbar h-full min-h-0 w-80 shrink-0 overflow-y-auto border-r p-3">
      <CrawlersList :groups="computedGroups" :selected-key="selectedKey" @click="handleListClick" />
    </aside>

    <div class="bg-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="scrollbar flex-1 p-4"></div>

      <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 py-3">
        <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="primary" icon="i-lucide:save" @click="emit('save')">{{ t('common.actions.save') }}</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersListRow } from '../list/index.types';
import type { ICrawlersEditorEmits, ICrawlersEditorProps } from './index.types';

/**
 * 属性：站点展示名称与基础 URL。
 */
const { siteName = '', baseUrl = '', groups = [], selectedKey = '' } = defineProps<ICrawlersEditorProps>();

/**
 * 事件：编辑器操作。
 */
const emit = defineEmits<ICrawlersEditorEmits>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 计算属性：描述文本。
 */
const computedDescription = computed(() => {
  const siteNameText = String(siteName ?? '').trim();
  const baseUrlText = String(baseUrl ?? '').trim();

  return [siteNameText, baseUrlText].filter((value) => value !== '').join(' · ');
});

/**
 * 计算属性：分组数据。
 */
const computedGroups = computed(() => {
  if (groups.length > 0) {
    return groups;
  }

  const siteNameText = String(siteName ?? '').trim();
  const baseUrlText = String(baseUrl ?? '').trim();

  return [
    {
      label: '概览',
      description: '查看当前站点的基本信息。',
      iconName: 'i-lucide:layout-dashboard',
      crawlers: [
        {
          key: '1',
          name: siteNameText !== '' ? siteNameText : '当前站点',
          description: baseUrlText !== '' ? baseUrlText : '未提供基础 URL。'
        }
      ]
    },
    {
      label: '脚本',
      description: '切换不同脚本片段。',
      iconName: 'i-lucide:code-2',
      crawlers: [
        {
          key: '2',
          name: '正文脚本',
          description: '编辑正文阶段的脚本片段。'
        },
        {
          key: '3',
          name: '广告脚本',
          description: '编辑广告阶段的脚本片段。'
        }
      ]
    },
    {
      label: '工具',
      description: '打开调试与辅助功能。',
      iconName: 'i-lucide:wrench',
      crawlers: [
        {
          key: '4',
          name: '预览',
          description: '预览当前配置效果。'
        },
        {
          key: '5',
          name: '校验',
          description: '检查配置是否满足基础要求.'
        },
        {
          key: '6',
          name: '预览',
          description: '预览当前配置效果。'
        },
        {
          key: '7',
          name: '校验',
          description: '检查配置是否满足基础要求。'
        }
      ]
    }
  ];
});

/**
 * 函数：处理列表点击。
 * @param {ICrawlersListRow} row 条目。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleListClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  emit('click', row, event);
};
</script>
