<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-cookie" :title="t('components.crawler.blueprint.nodes.http.getCookies.title')" :description="t('components.crawler.blueprint.nodes.http.getCookies.description')" header-bg="bg-indigo-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.scope.label')">
        <USelect v-model="stateScope" class="w-full" :items="stateScopeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField v-if="stateScope !== 'current'" :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.domain.label')">
        <UInput v-model="stateDomain" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.getCookies.fields.domain.placeholder')" />
      </UFormField>

      <UFormField v-if="stateScope !== 'current'" :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.path.label')">
        <UInput v-model="statePath" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.getCookies.fields.path.placeholder')" />
      </UFormField>

      <div class="space-y-3">
        <UFormField :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.includeHttpOnly.label')">
          <USwitch v-model="stateIncludeHttpOnly" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.includeSessionOnly.label')">
          <USwitch v-model="stateIncludeSessionOnly" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.asString.label')">
          <USwitch v-model="stateAsString" />
        </UFormField>
      </div>

      <UFormField :label="t('components.crawler.blueprint.nodes.http.getCookies.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerHttpGetCookiesTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);
const stateScope = ref('current');
const stateDomain = ref('');
const statePath = ref('/');
const stateIncludeHttpOnly = ref(true);
const stateIncludeSessionOnly = ref(true);
const stateAsString = ref(true);
const stateTimeoutMs = ref(10000);

const rightPins: IBasicSidePin[] = [
  {
    id: 'cookies-any',
    label: t('components.crawler.blueprint.nodes.http.getCookies.outputs.cookies.label'),
    direction: 'out',
    dataType: 'any',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.http.getCookies.outputs.cookies.description')
  },
  {
    id: 'cookies-string',
    label: t('components.crawler.blueprint.nodes.http.getCookies.outputs.cookieString.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 46,
    description: t('components.crawler.blueprint.nodes.http.getCookies.outputs.cookieString.description')
  },
  {
    id: 'cookies-count',
    label: t('components.crawler.blueprint.nodes.http.getCookies.outputs.count.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.http.getCookies.outputs.count.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

const stateScopeOptions = computed(() => {
  return [
    {
      value: 'current',
      label: t('components.crawler.blueprint.nodes.http.getCookies.fields.scope.options.current')
    },
    {
      value: 'domain',
      label: t('components.crawler.blueprint.nodes.http.getCookies.fields.scope.options.domain')
    },
    {
      value: 'all',
      label: t('components.crawler.blueprint.nodes.http.getCookies.fields.scope.options.all')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateScope.value = ['current', 'domain', 'all'].includes(String(data.scope)) ? String(data.scope) : 'current';
  stateDomain.value = String(data.domain ?? '');
  statePath.value = String(data.path ?? '/');
  stateIncludeHttpOnly.value = Boolean(data.includeHttpOnly ?? true);
  stateIncludeSessionOnly.value = Boolean(data.includeSessionOnly ?? true);
  stateAsString.value = Boolean(data.asString ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch([stateScope, stateDomain, statePath, stateIncludeHttpOnly, stateIncludeSessionOnly, stateAsString, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    scope: stateScope.value,
    domain: stateDomain.value,
    path: statePath.value,
    includeHttpOnly: stateIncludeHttpOnly.value,
    includeSessionOnly: stateIncludeSessionOnly.value,
    asString: stateAsString.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
