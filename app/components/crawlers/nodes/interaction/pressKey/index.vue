<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-key-round" :title="t('components.crawler.blueprint.nodes.interaction.pressKey.title')" :description="t('components.crawler.blueprint.nodes.interaction.pressKey.description')" header-bg="bg-purple-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.key.label')">
        <div class="space-y-2">
          <div v-for="(_, index) in stateKeyParts" :key="`key-part-${index}`" class="flex items-center gap-2">
            <USelect v-model="stateKeyParts[index]" class="w-full" :items="stateKeyPartOptions" value-attribute="value" option-attribute="label" />
            <UButton v-if="stateKeyParts.length > 1" color="error" variant="soft" size="xs" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.key.removePart')" @click="removeKeyPart(index)" />
          </div>

          <div class="flex items-center gap-2">
            <UButton color="primary" variant="soft" size="xs" :disabled="stateKeyParts.length >= MAX_KEY_PARTS" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.key.addPart')" @click="addKeyPart" />
            <span class="text-muted text-xs">{{ t('components.crawler.blueprint.nodes.interaction.common.fields.key.preview') }}: {{ computedKeyPreview }}</span>
            <span class="text-muted text-xs">{{ computedKeySymbolPreview }}</span>
          </div>
        </div>
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.repeatCount.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionPressKeyRepeatCount" v-model="stateRepeatCount" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.pressDurationMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionPressKeyDurationMs" v-model="statePressDurationMs" :min="0" :step="10" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionPressKeyTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')">
        <USwitch v-model="stateSimulateNativeInput" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const MAX_KEY_PARTS = 4;

const stateNode = useNode();
const stateInitialized = ref(false);
const stateKeyParts = ref<string[]>(['Enter']);
const stateRepeatCount = ref(1);
const statePressDurationMs = ref(0);
const stateTimeoutMs = ref(10000);
const stateSimulateNativeInput = ref(false);

const stateModifierKeys = ['Ctrl', 'Shift', 'Alt', 'Meta'] as const;
const stateCoreKeys = [
  'Enter',
  'Tab',
  'Escape',
  'Space',
  'Backspace',
  'Delete',
  'Insert',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
] as const;

const stateAllowedKeyPartValues = [...stateModifierKeys, ...stateCoreKeys] as const;

const KEY_SYMBOLS: Record<string, string> = {
  Ctrl: '⌃',
  Shift: '⇧',
  Alt: '⎇',
  Meta: '⌘',
  Enter: '↵',
  Tab: '⇥',
  Escape: '⎋',
  Space: '␠',
  Backspace: '⌫',
  Delete: '⌦',
  Insert: '⎀',
  Home: '⇱',
  End: '⇲',
  PageUp: '⇞',
  PageDown: '⇟',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→'
};

const normalizeKeyPart = (value: unknown): string => {
  const normalized = String(value ?? '').trim();
  if ((stateAllowedKeyPartValues as readonly string[]).includes(normalized)) {
    return normalized;
  }

  return 'Enter';
};

const stateKeyPartOptions = computed(() => {
  return stateAllowedKeyPartValues.map((value) => {
    const symbol = KEY_SYMBOLS[String(value)] ?? '';

    return {
      value,
      label: symbol !== '' ? `${value}  ${symbol}` : value
    };
  });
});

const computedKeyPreview = computed(() => {
  return stateKeyParts.value.join('+');
});

const computedKeySymbolPreview = computed(() => {
  return stateKeyParts.value
    .map((part) => {
      return KEY_SYMBOLS[part] ?? part;
    })
    .join(' + ');
});

const addKeyPart = (): void => {
  if (stateKeyParts.value.length >= MAX_KEY_PARTS) {
    return;
  }

  stateKeyParts.value = [...stateKeyParts.value, 'Enter'];
};

const removeKeyPart = (index: number): void => {
  if (stateKeyParts.value.length <= 1) {
    return;
  }

  stateKeyParts.value = stateKeyParts.value.filter((_, currentIndex) => {
    return currentIndex !== index;
  });
};

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const keyParts = String(data.key ?? 'Enter')
    .split('+')
    .map((part) => {
      return normalizeKeyPart(part);
    })
    .filter((part) => {
      return part !== '';
    })
    .slice(0, MAX_KEY_PARTS);

  stateKeyParts.value = keyParts.length > 0 ? keyParts : ['Enter'];
  stateRepeatCount.value = Number.isFinite(Number(data.repeatCount)) ? Math.max(1, Number(data.repeatCount)) : 1;
  statePressDurationMs.value = Number.isFinite(Number(data.pressDurationMs)) ? Math.max(0, Number(data.pressDurationMs)) : 0;
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch(
  stateKeyParts,
  (parts) => {
    const normalized = parts
      .map((part) => {
        return normalizeKeyPart(part);
      })
      .slice(0, MAX_KEY_PARTS);

    const changed = normalized.length !== parts.length || normalized.some((part, index) => {
      return part !== parts[index];
    });

    if (changed) {
      stateKeyParts.value = normalized.length > 0 ? normalized : ['Enter'];
    }
  },
  { deep: true }
);

watch([computedKeyPreview, stateRepeatCount, statePressDurationMs, stateTimeoutMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    key: computedKeyPreview.value,
    repeatCount: stateRepeatCount.value,
    pressDurationMs: statePressDurationMs.value,
    timeoutMs: stateTimeoutMs.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
