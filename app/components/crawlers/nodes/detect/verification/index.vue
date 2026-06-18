<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-shield-alert" :title="t('components.crawler.blueprint.nodes.detect.verification.title')" :description="t('components.crawler.blueprint.nodes.detect.verification.description')" header-bg="bg-orange-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.label')">
        <UCheckboxGroup v-model="stateVendors" :items="stateVendorOptions" value-key="value" label-key="label" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.detect.verification.fields.strategy.label')">
        <USelect v-model="stateStrategy" class="w-full" :items="stateStrategyOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.detect.verification.fields.notifyAdmin.label')">
        <USwitch v-model="stateNotifyAdmin" />
      </UFormField>

      <UFormField v-if="stateNotifyAdmin" :label="t('components.crawler.blueprint.nodes.detect.verification.fields.adminEmails.label')">
        <UTextarea v-model="stateAdminEmailsText" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.detect.verification.fields.adminEmails.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

/**
 * 状态：stateNode。
 */
const stateNode = useNode();
/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);
/**
 * 状态：stateVendors。
 */
const stateVendors = ref<string[]>([]);
/**
 * 状态：stateStrategy。
 */
const stateStrategy = ref('smart');
/**
 * 状态：stateNotifyAdmin。
 */
const stateNotifyAdmin = ref(false);
/**
 * 状态：stateAdminEmailsText。
 */
const stateAdminEmailsText = ref('');

/**
 * 常量：DEFAULT_VENDORS。
 */
const DEFAULT_VENDORS = ['cloudflare-challenge', 'cloudflare-turnstile', 'google-recaptcha', 'hcaptcha'];
/**
 * 常量：DEFAULT_STRATEGY。
 */
const DEFAULT_STRATEGY = 'smart';

/**
 * 状态：stateStrategyOptions。
 */
const stateStrategyOptions = computed(() => [
  {
    value: 'smart',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.strategy.options.smart')
  },
  {
    value: 'strict',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.strategy.options.strict')
  },
  {
    value: 'lenient',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.strategy.options.lenient')
  }
]);

/**
 * 状态：stateVendorOptions。
 */
const stateVendorOptions = computed(() => [
  {
    value: 'cloudflare-challenge',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.cloudflareChallenge')
  },
  {
    value: 'cloudflare-turnstile',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.cloudflareTurnstile')
  },
  {
    value: 'google-recaptcha',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.googleRecaptcha')
  },
  {
    value: 'hcaptcha',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.hcaptcha')
  },
  {
    value: 'geetest',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.geetest')
  },
  {
    value: 'arkose',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.arkose')
  },
  {
    value: 'datadome',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.datadome')
  },
  {
    value: 'login-wall',
    label: t('components.crawler.blueprint.nodes.detect.verification.fields.vendors.options.loginWall')
  }
]);

const rightPins: IBasicSidePin[] = [
  {
    id: 'detected-boolean',
    label: t('components.crawler.blueprint.nodes.detect.verification.outputs.detected.label'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 20,
    description: t('components.crawler.blueprint.nodes.detect.verification.outputs.detected.description')
  },
  {
    id: 'vendor-string',
    label: t('components.crawler.blueprint.nodes.detect.verification.outputs.vendor.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.detect.verification.outputs.vendor.description')
  },
  {
    id: 'confidence-number',
    label: t('components.crawler.blueprint.nodes.detect.verification.outputs.confidence.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.detect.verification.outputs.confidence.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

/**
 * 常量：linesFromText。
 */
const linesFromText = (value: string): string[] => {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
};

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateVendors.value = Array.isArray(data.vendors) ? data.vendors.map((item) => String(item ?? '').trim()).filter((item) => item !== '') : [...DEFAULT_VENDORS];
  /**
   * 常量：strategy。
   */
  const strategy = String(data.strategy ?? DEFAULT_STRATEGY);
  stateStrategy.value = ['smart', 'strict', 'lenient'].includes(strategy) ? strategy : DEFAULT_STRATEGY;
  stateNotifyAdmin.value = Boolean(data.notifyAdmin ?? false);
  stateAdminEmailsText.value = Array.isArray(data.adminEmails) ? (data.adminEmails as unknown[]).map((item) => String(item ?? '')).join('\n') : '';

  stateInitialized.value = true;
});

watch(
  [stateVendors, stateStrategy, stateNotifyAdmin, stateAdminEmailsText],
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      vendors: [...stateVendors.value],
      strategy: stateStrategy.value,
      notifyAdmin: stateNotifyAdmin.value,
      adminEmails: linesFromText(stateAdminEmailsText.value)
    };
  },
  { deep: true }
);
</script>
