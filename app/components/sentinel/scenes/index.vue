<template>
  <UPageGrid class="mb-4">
    <UPageCard icon="i-material-symbols:id-card-outline-sharp" :title="t('components.sentinel.scenes.labels.machineName')" :description="machineName" />
    <UPageCard icon="i-material-symbols:code" :title="t('components.sentinel.scenes.labels.machineId')" :description="machineId" />
    <UPageCard icon="i-lucide:sticky-note" :title="t('components.sentinel.scenes.labels.machineRemark')" :description="machineRemark || '-'" />
  </UPageGrid>

  <UForm :id="computedFormId" ref="refForm" :schema="schema" :state="stateForm" class="mb-4 w-full max-w-none space-y-4" @submit="handleSubmit">
    <UFormField required name="sceneName" :label="t('components.sentinel.scenes.labels.sceneName')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted', error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
      <template #description>{{ t('components.sentinel.scenes.desc.sceneName') }}</template>
      <UInput v-model="stateForm.sceneName" class="z-1 w-full" :readonly="computedFormReadonly" :placeholder="t('components.sentinel.scenes.placeholders.sceneName')" />
      <template #error="{ error }">
        <p v-if="typeof error === 'string' && error">{{ error }}</p>
      </template>
    </UFormField>

    <UFormField required name="sourceExecPath" :label="t('components.sentinel.scenes.labels.sourceExecPath')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted', error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
      <template #description>{{ t('components.sentinel.scenes.desc.sourceExecPath') }}</template>
      <UInput v-model="stateForm.sourceExecPath" class="z-1 w-full" :readonly="computedExecPathReadonly" :placeholder="t('components.sentinel.scenes.placeholders.sourceExecPath')" :ui="{ trailing: 'pr-0.5' }">
        <template #trailing>
          <UButton size="sm" color="neutral" variant="outline" :disabled="computedExecPathReadonly" @click="handlePickExecPath">
            {{ t('components.sentinel.scenes.actions.pickProgram') }}
          </UButton>
        </template>
      </UInput>
      <template #error="{ error }">
        <p v-if="typeof error === 'string' && error">{{ error }}</p>
      </template>
    </UFormField>

    <UFormField v-if="computedShowManagedExecPath" name="execPath" :label="t('components.sentinel.scenes.labels.execPath')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }">
      <template #description>{{ t('components.sentinel.scenes.desc.execPathManaged') }}</template>
      <UInput v-model="stateForm.execPath" class="z-1 w-full" readonly :placeholder="t('components.sentinel.scenes.placeholders.execPathManaged')" />
    </UFormField>

    <UFormField :label="t('components.sentinel.scenes.labels.args')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }">
      <template #description>{{ t('components.sentinel.scenes.desc.args') }}</template>
      <UTextarea v-model="stateForm.argsText" class="w-full" :readonly="computedFormReadonly" :rows="4" autoresize :placeholder="t('components.sentinel.scenes.placeholders.args')" />
    </UFormField>

    <UFormField :label="t('components.sentinel.scenes.labels.enabled')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
      <template #description>{{ t('components.sentinel.scenes.desc.enabled') }}</template>
      <USwitch v-model="stateForm.enabled" :disabled="computedFormReadonly" />
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';

import type { ISentinelScenesConfigEmits, ISentinelScenesConfigExpose, ISentinelScenesConfigFormState, ISentinelScenesConfigProps, ISentinelScenesConfigValidateErrors, TSentinelScenesConfigValidateResult, TSentinelScenesConfigValues } from '@/components/sentinel/scenes/index.types';


/**
 * 函数：执行校验
 * @param {boolean} touched 是否标记为已触发校验（用于展示错误）
 * @returns {TSentinelScenesConfigValidateResult} 校验结果
 */
const validateBuildResult = (): TSentinelScenesConfigValidateResult => {
  const parsed = schema.safeParse({ sceneName: stateForm.sceneName, sourceExecPath: stateForm.sourceExecPath });
  if (parsed.success) {
    const result: TSentinelScenesConfigValidateResult = { valid: true, errors: {} };
    emit('validate', result);
    return result;
  }

  const errors: ISentinelScenesConfigValidateErrors = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path?.[0] || '').trim();
    if (key === 'sceneName') {
      errors.sceneName = issue.message;
    }
    if (key === 'sourceExecPath') {
      errors.sourceExecPath = issue.message;
    }
  }

  const result: TSentinelScenesConfigValidateResult = { valid: false, errors };
  emit('validate', result);
  return result;
};

/**
 * 函数：获取当前值
 * @returns {TSentinelScenesConfigValues} 当前值
 */
const valuesGet = (): TSentinelScenesConfigValues => ({
  machineId: String(machineId || ''),
  machineName: String(machineName || ''),
  machineRemark: String(machineRemark || ''),
  sceneName: String(stateForm.sceneName || '').trim(),
  sourceExecPath: String(stateForm.sourceExecPath || '').trim(),
  execPath: String(stateForm.execPath || '').trim(),
  args: computedArgs.value,
  enabled: Boolean(stateForm.enabled)
});

/**
 * 函数：设置当前值
 * @param {TSentinelScenesConfigValues} values 值
 */
const valuesSet = (values: TSentinelScenesConfigValues): void => {
  stateForm.sceneName = String(values.sceneName || '');
  stateForm.sourceExecPath = String(values.sourceExecPath || '');
  stateForm.execPath = String(values.execPath || '');
  stateForm.argsText = Array.isArray(values.args) ? values.args.join('\n') : '';
  stateForm.enabled = Boolean(values.enabled);

  stateRefForm.value?.clear();
  validateBuildResult();
};

/**
 * 事件：选择程序
 */
const handlePickExecPath = (): void => {
  emit('execpath-pick', String(stateForm.sourceExecPath || '').trim());
};

/**
 * 事件：表单提交
 * 描述：校验通过后触发。
 */
const handleSubmit = (_e: FormSubmitEvent<z.output<typeof schema>>): void => {
  emit('submit', valuesGet());
};

/**
 * 函数：触发表单校验并在通过时提交
 * @returns {TSentinelScenesConfigValidateResult} 校验结果
 */
const validateAndSubmit = (): TSentinelScenesConfigValidateResult => {
  void stateRefForm.value?.submit();
  return validateBuildResult();
};

watch(
  [() => stateForm.sceneName, () => stateForm.sourceExecPath, () => stateForm.execPath, () => stateForm.argsText],
  (_current, oldValues) => {
    // 首次（immediate）不触发 change，避免外部误认为用户改动
    if (oldValues) {
      emit('change', valuesGet());
    }

    // 外部按钮可用状态依赖于校验结果：变更时刷新校验结果
    validateBuildResult();
  },
  { immediate: true }
);

defineExpose<ISentinelScenesConfigExpose>({
  valuesGet,
  valuesSet,
  validateAndSubmit
});
</script>
