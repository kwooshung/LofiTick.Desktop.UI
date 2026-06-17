<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-move" :title="t('components.crawler.blueprint.nodes.mouse.move.title')" header-bg="bg-pink-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <div class="space-y-2">
        <UFormField v-if="!computedHasStartXInput" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.startX.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveStartX" v-model="stateStartX" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>
        <UFormField v-if="!computedHasStartYInput" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.startY.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveStartY" v-model="stateStartY" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>
        <UFormField v-if="!computedHasEndXInput" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.endX.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveEndX" v-model="stateEndX" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>
        <UFormField v-if="!computedHasEndYInput" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.endY.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveEndY" v-model="stateEndY" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>
      </div>

      <UFormField :label="t('components.crawler.blueprint.nodes.mouse.move.fields.curveType.label')">
        <USelect v-model="stateCurveType" class="w-full" :items="stateCurveTypeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField v-if="!computedHasCurveStrengthInput" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.curveStrength.label')">
        <CrawlersNodesCommonNumberInput id="crawlerMouseMoveCurveStrength" v-model="stateCurveStrength" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.percent')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.mouse.move.fields.speedProfile.label')">
        <USelect v-model="stateSpeedProfile" class="w-full" :items="stateSpeedProfileOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateRandomDuration" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.randomDuration.label')" />

      <div v-if="!computedHasDurationInput" class="space-y-2">
        <UFormField v-if="!stateRandomDuration" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.durationMs.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveDurationMs" v-model="stateDurationMs" :min="50" :step="10" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
        </UFormField>
        <UFormField v-if="stateRandomDuration" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.durationMinMs.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveDurationMinMs" v-model="stateDurationMinMs" :min="50" :step="10" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
        </UFormField>
        <UFormField v-if="stateRandomDuration" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.durationMaxMs.label')">
          <CrawlersNodesCommonNumberInput id="crawlerMouseMoveDurationMaxMs" v-model="stateDurationMaxMs" :min="50" :step="10" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
        </UFormField>
      </div>

      <USwitch v-model="stateEnableJitter" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.enableJitter.label')" />

      <UFormField v-if="stateEnableJitter && !computedHasJitterAmplitudeInput" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.jitterAmplitude.label')">
        <CrawlersNodesCommonNumberInput id="crawlerMouseMoveJitterAmplitude" v-model="stateJitterAmplitude" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
      </UFormField>

      <UFormField v-if="stateEnableJitter" :label="t('components.crawler.blueprint.nodes.mouse.move.fields.jitterFrequency.label')">
        <CrawlersNodesCommonNumberInput id="crawlerMouseMoveJitterFrequency" v-model="stateJitterFrequency" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <USwitch v-model="stateSimulateNativeInput" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);

const stateStartX = ref(0);
const stateStartY = ref(0);
const stateEndX = ref(300);
const stateEndY = ref(300);
const stateCurveType = ref('bezier');
const stateCurveStrength = ref(40);
const stateSpeedProfile = ref('easeInOut');
const stateRandomDuration = ref(false);
const stateDurationMs = ref(600);
const stateDurationMinMs = ref(400);
const stateDurationMaxMs = ref(1200);
const stateEnableJitter = ref(false);
const stateJitterAmplitude = ref(2);
const stateJitterFrequency = ref(6);
const stateSimulateNativeInput = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'start-x-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.startX.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 12,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.startX.description')
  },
  {
    id: 'start-y-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.startY.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.startY.description')
  },
  {
    id: 'end-x-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.endX.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 36,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.endX.description')
  },
  {
    id: 'end-y-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.endY.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 48,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.endY.description')
  },
  {
    id: 'duration-ms-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.durationMs.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.durationMs.description')
  },
  {
    id: 'curve-strength-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.curveStrength.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 72,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.curveStrength.description')
  },
  {
    id: 'jitter-amplitude-input',
    label: t('components.crawler.blueprint.nodes.mouse.move.fields.jitterAmplitude.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 84,
    description: t('components.crawler.blueprint.nodes.mouse.move.fields.jitterAmplitude.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'moved-x-number',
    label: t('components.crawler.blueprint.nodes.mouse.move.outputs.endX.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.mouse.move.outputs.endX.description')
  },
  {
    id: 'moved-y-number',
    label: t('components.crawler.blueprint.nodes.mouse.move.outputs.endY.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.mouse.move.outputs.endY.description')
  },
  {
    id: 'path-array',
    label: t('components.crawler.blueprint.nodes.mouse.move.outputs.path.label'),
    direction: 'out',
    dataType: 'array',
    topPercent: 56,
    description: t('components.crawler.blueprint.nodes.mouse.move.outputs.path.description')
  },
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 72,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
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

const stateCurveTypeOptions = computed(() => {
  return [
    {
      value: 'linear',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.curveType.options.linear')
    },
    {
      value: 'bezier',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.curveType.options.bezier')
    },
    {
      value: 'spline',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.curveType.options.spline')
    }
  ];
});

const stateSpeedProfileOptions = computed(() => {
  return [
    {
      value: 'linear',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.speedProfile.options.linear')
    },
    {
      value: 'easeIn',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.speedProfile.options.easeIn')
    },
    {
      value: 'easeOut',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.speedProfile.options.easeOut')
    },
    {
      value: 'easeInOut',
      label: t('components.crawler.blueprint.nodes.mouse.move.fields.speedProfile.options.easeInOut')
    }
  ];
});

const hasTargetPinConnection = (handleId: string) => {
  const nodeId = String(stateNodeId ?? '');

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const computedHasStartXInput = computed(() => hasTargetPinConnection('start-x-input'));
const computedHasStartYInput = computed(() => hasTargetPinConnection('start-y-input'));
const computedHasEndXInput = computed(() => hasTargetPinConnection('end-x-input'));
const computedHasEndYInput = computed(() => hasTargetPinConnection('end-y-input'));
const computedHasDurationInput = computed(() => hasTargetPinConnection('duration-ms-input'));
const computedHasCurveStrengthInput = computed(() => hasTargetPinConnection('curve-strength-input'));
const computedHasJitterAmplitudeInput = computed(() => hasTargetPinConnection('jitter-amplitude-input'));

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateStartX.value = Number.isFinite(Number(data.startX)) ? Math.max(0, Number(data.startX)) : 0;
  stateStartY.value = Number.isFinite(Number(data.startY)) ? Math.max(0, Number(data.startY)) : 0;
  stateEndX.value = Number.isFinite(Number(data.endX)) ? Math.max(0, Number(data.endX)) : 300;
  stateEndY.value = Number.isFinite(Number(data.endY)) ? Math.max(0, Number(data.endY)) : 300;
  stateCurveType.value = ['linear', 'bezier', 'spline'].includes(String(data.curveType)) ? String(data.curveType) : 'bezier';
  stateCurveStrength.value = Number.isFinite(Number(data.curveStrength)) ? Math.max(0, Number(data.curveStrength)) : 40;
  stateSpeedProfile.value = ['linear', 'easeIn', 'easeOut', 'easeInOut'].includes(String(data.speedProfile)) ? String(data.speedProfile) : 'easeInOut';
  stateRandomDuration.value = Boolean(data.randomDuration ?? false);
  stateDurationMs.value = Number.isFinite(Number(data.durationMs)) ? Math.max(50, Number(data.durationMs)) : 600;
  stateDurationMinMs.value = Number.isFinite(Number(data.durationMinMs)) ? Math.max(50, Number(data.durationMinMs)) : 400;
  stateDurationMaxMs.value = Number.isFinite(Number(data.durationMaxMs)) ? Math.max(50, Number(data.durationMaxMs)) : 1200;
  stateEnableJitter.value = Boolean(data.enableJitter ?? false);
  stateJitterAmplitude.value = Number.isFinite(Number(data.jitterAmplitude)) ? Math.max(0, Number(data.jitterAmplitude)) : 2;
  stateJitterFrequency.value = Number.isFinite(Number(data.jitterFrequency)) ? Math.max(1, Number(data.jitterFrequency)) : 6;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([
  stateStartX,
  stateStartY,
  stateEndX,
  stateEndY,
  stateCurveType,
  stateCurveStrength,
  stateSpeedProfile,
  stateRandomDuration,
  stateDurationMs,
  stateDurationMinMs,
  stateDurationMaxMs,
  stateEnableJitter,
  stateJitterAmplitude,
  stateJitterFrequency,
  stateSimulateNativeInput
], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    startX: stateStartX.value,
    startY: stateStartY.value,
    endX: stateEndX.value,
    endY: stateEndY.value,
    curveType: stateCurveType.value,
    curveStrength: stateCurveStrength.value,
    speedProfile: stateSpeedProfile.value,
    randomDuration: stateRandomDuration.value,
    durationMs: stateDurationMs.value,
    durationMinMs: stateDurationMinMs.value,
    durationMaxMs: stateDurationMaxMs.value,
    enableJitter: stateEnableJitter.value,
    jitterAmplitude: stateJitterAmplitude.value,
    jitterFrequency: stateJitterFrequency.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
