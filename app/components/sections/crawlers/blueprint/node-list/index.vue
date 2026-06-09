<template>
  <div class="flex h-full min-h-0 flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <div class="text-highlighted text-sm font-semibold">{{ t('pages.crawlers.blueprint.nodes.title') }}</div>
        <div class="text-muted mt-1 text-xs">{{ t('pages.crawlers.blueprint.nodes.description') }}</div>
      </div>
      <UBadge color="neutral" variant="soft">{{ computedNodeCount }}</UBadge>
    </div>

    <div class="scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
      <section v-for="group in computedBlueprintNodeGroups" :key="group.title" class="border-default bg-card/60 rounded-2xl border p-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-highlighted text-sm font-semibold">{{ group.title }}</div>
            <div class="text-muted mt-1 text-xs">{{ group.description }}</div>
          </div>
          <UBadge color="neutral" variant="soft">{{ group.nodes.length }}</UBadge>
        </div>

        <div class="mt-3 grid gap-2">
          <SectionsCrawlersBlueprintNodeBlock v-for="node in group.nodes" :key="`${group.title}-${node.title}`" :node="node" @select="emit('select', $event)" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBlueprintNodeGroup, IBlueprintNodeItem } from '../index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 事件：节点选择。
 */
const emit = defineEmits<{
  select: [node: IBlueprintNodeItem];
}>();

/**
 * 计算属性：蓝图节点分组。
 */
const computedBlueprintNodeGroups = computed<IBlueprintNodeGroup[]>(() => {
  return [
    {
      title: t('pages.crawlers.blueprint.groups.flow.title'),
      description: t('pages.crawlers.blueprint.groups.flow.description'),
      nodes: [
        {
          title: t('pages.crawlers.blueprint.nodes.flow.start.title'),
          description: t('pages.crawlers.blueprint.nodes.flow.start.description'),
          icon: 'i-lucide:play',
          tone: 'primary'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.flow.end.title'),
          description: t('pages.crawlers.blueprint.nodes.flow.end.description'),
          icon: 'i-lucide:square',
          tone: 'neutral'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.flow.sequence.title'),
          description: t('pages.crawlers.blueprint.nodes.flow.sequence.description'),
          icon: 'i-lucide:list-ordered',
          tone: 'info'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.flow.branch.title'),
          description: t('pages.crawlers.blueprint.nodes.flow.branch.description'),
          icon: 'i-lucide:git-branch',
          tone: 'warning'
        }
      ]
    },
    {
      title: t('pages.crawlers.blueprint.groups.request.title'),
      description: t('pages.crawlers.blueprint.groups.request.description'),
      nodes: [
        {
          title: t('pages.crawlers.blueprint.nodes.request.get.title'),
          description: t('pages.crawlers.blueprint.nodes.request.get.description'),
          icon: 'i-lucide:download',
          tone: 'success'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.request.post.title'),
          description: t('pages.crawlers.blueprint.nodes.request.post.description'),
          icon: 'i-lucide:send',
          tone: 'primary'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.request.config.title'),
          description: t('pages.crawlers.blueprint.nodes.request.config.description'),
          icon: 'i-lucide:sliders-horizontal',
          tone: 'info'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.request.parse.title'),
          description: t('pages.crawlers.blueprint.nodes.request.parse.description'),
          icon: 'i-lucide:file-code-2',
          tone: 'neutral'
        }
      ]
    },
    {
      title: t('pages.crawlers.blueprint.groups.parser.title'),
      description: t('pages.crawlers.blueprint.groups.parser.description'),
      nodes: [
        {
          title: t('pages.crawlers.blueprint.nodes.parser.css.title'),
          description: t('pages.crawlers.blueprint.nodes.parser.css.description'),
          icon: 'i-lucide:scan-text',
          tone: 'primary'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.parser.json.title'),
          description: t('pages.crawlers.blueprint.nodes.parser.json.description'),
          icon: 'i-lucide:braces',
          tone: 'success'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.parser.list.title'),
          description: t('pages.crawlers.blueprint.nodes.parser.list.description'),
          icon: 'i-lucide:list-checks',
          tone: 'warning'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.parser.attr.title'),
          description: t('pages.crawlers.blueprint.nodes.parser.attr.description'),
          icon: 'i-lucide:link-2',
          tone: 'info'
        }
      ]
    },
    {
      title: t('pages.crawlers.blueprint.groups.logic.title'),
      description: t('pages.crawlers.blueprint.groups.logic.description'),
      nodes: [
        {
          title: t('pages.crawlers.blueprint.nodes.logic.boolean.title'),
          description: t('pages.crawlers.blueprint.nodes.logic.boolean.description'),
          icon: 'i-lucide:toggle-right',
          tone: 'success'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.logic.string.title'),
          description: t('pages.crawlers.blueprint.nodes.logic.string.description'),
          icon: 'i-lucide:type',
          tone: 'primary'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.logic.ifElse.title'),
          description: t('pages.crawlers.blueprint.nodes.logic.ifElse.description'),
          icon: 'i-lucide:shuffle',
          tone: 'warning'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.logic.loop.title'),
          description: t('pages.crawlers.blueprint.nodes.logic.loop.description'),
          icon: 'i-lucide:repeat',
          tone: 'info'
        }
      ]
    },
    {
      title: t('pages.crawlers.blueprint.groups.debug.title'),
      description: t('pages.crawlers.blueprint.groups.debug.description'),
      nodes: [
        {
          title: t('pages.crawlers.blueprint.nodes.debug.log.title'),
          description: t('pages.crawlers.blueprint.nodes.debug.log.description'),
          icon: 'i-lucide:message-square-text',
          tone: 'primary'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.debug.preview.title'),
          description: t('pages.crawlers.blueprint.nodes.debug.preview.description'),
          icon: 'i-lucide:eye',
          tone: 'info'
        },
        {
          title: t('pages.crawlers.blueprint.nodes.debug.retry.title'),
          description: t('pages.crawlers.blueprint.nodes.debug.retry.description'),
          icon: 'i-lucide:rotate-cw',
          tone: 'warning'
        }
      ]
    }
  ];
});

/**
 * 计算属性：节点总数。
 */
const computedNodeCount = computed<number>(() => computedBlueprintNodeGroups.value.reduce((total, group) => total + group.nodes.length, 0));
</script>
