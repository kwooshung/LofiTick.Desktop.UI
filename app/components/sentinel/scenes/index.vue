<template>
  <UPageGrid class="mb-4">
    <UPageCard icon="i-material-symbols:id-card-outline-sharp" :title="t('components.sentinel.scenes.labels.machineName')" :description="props.machineName" />
    <UPageCard icon="i-material-symbols:code" :title="t('components.sentinel.scenes.labels.machineId')" :description="props.machineId" />
    <UPageCard icon="i-lucide:sticky-note" :title="t('components.sentinel.scenes.labels.machineRemark')" :description="props.machineRemark || '-'" />
  </UPageGrid>

  <UForm :id="computedFormId" ref="refForm" :schema="schema" :state="stateForm" class="mb-4 w-full max-w-none space-y-4" @submit="handleSubmit">
    <UFormField required name="sceneName" :label="t('components.sentinel.scenes.labels.sceneName')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted', error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
      <template #description>{{ t('components.sentinel.scenes.desc.sceneName') }}</template>
      <UInput v-model="stateForm.sceneName" class="z-1 w-full" :readonly="computedFormReadonly" :placeholder="t('components.sentinel.scenes.placeholders.sceneName')" />
      <template #error="{ error }">
        <p v-if="typeof error === 'string' && error">{{ error }}</p>
      </template>
    </UFormField>

    <UFormField required name="execPath" :label="t('components.sentinel.scenes.labels.execPath')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted', error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
      <template #description>{{ t('components.sentinel.scenes.desc.execPath') }}</template>
      <UInput v-model="stateForm.execPath" class="z-1 w-full" :readonly="computedExecPathReadonly" :placeholder="t('components.sentinel.scenes.placeholders.execPath')" :ui="{ trailing: 'pr-0.5' }">
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

import type { ISentinelScenesConfigEmits, ISentinelScenesConfigExpose, ISentinelScenesConfigFormState, ISentinelScenesConfigProps, ISentinelScenesConfigValidateErrors, TSentinelScenesConfigValidateResult, TSentinelScenesConfigValues } from './index.types';

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Props：组件属性
 */
const props = withDefaults(defineProps<ISentinelScenesConfigProps>(), {
  machineId: '',
  machineName: '',
  machineRemark: '',
  sceneName: '',
  localMachineId: '',
  execPathEditable: true,
  execPath: '',
  args: () => [],
  enabled: true
});

/**
 * 事件：emit
 */
const emit = defineEmits<ISentinelScenesConfigEmits>();

/**
 * 常量：默认表单 id
 */
const FORM_ID_DEFAULT = 'sentinelScenesEditorForm';

/**
 * 状态：表单状态
 */
const stateForm = reactive<ISentinelScenesConfigFormState>({
  sceneName: String(props.sceneName || ''),
  execPath: String(props.execPath || ''),
  argsText: Array.isArray(props.args) ? props.args.join('\n') : '',
  enabled: Boolean(props.enabled)
});

/**
 * 引用：表单
 */
const refForm = useTemplateRef('refForm');

/**
 * 计算属性：表单 id
 */
const computedFormId = computed(() => String(props.formId || FORM_ID_DEFAULT).trim() || FORM_ID_DEFAULT);

/**
 * 计算属性：表单是否只读
 * 描述：当 machineId 与 localMachineId 都存在时，需二者一致才允许编辑。
 */
const computedFormReadonly = computed(() => {
  const machineId = String(props.machineId || '').trim();
  const localMachineId = String(props.localMachineId || '').trim();

  // 未提供机器码时，视为可编辑（由外部控制提交即可）
  if (!machineId || !localMachineId) {
    return false;
  }

  return machineId !== localMachineId;
});

/**
 * 计算属性：execPath 是否只读
 * 描述：优先遵循 execPathEditable；当 machineId 与 localMachineId 都存在时，需二者一致才允许编辑。
 */
const computedExecPathReadonly = computed(() => {
  if (computedFormReadonly.value) {
    return true;
  }

  if (!props.execPathEditable) {
    return true;
  }

  const machineId = String(props.machineId || '').trim();
  const localMachineId = String(props.localMachineId || '').trim();

  // 未提供机器码时，仅由外部开关控制
  if (!machineId || !localMachineId) {
    return false;
  }

  return machineId !== localMachineId;
});

/**
 * 计算属性：args 数组（清洗为一行一个参数）
 */
const computedArgs = computed(() =>
  String(stateForm.argsText || '')
    .split('\n')
    .map((i) => i.trim())
    .filter((i) => i.length > 0)
);

/**
 * 函数：判断是否为 Windows 绝对路径
 * 描述：支持盘符路径（C:\\...）与 UNC 路径（\\\\server\\share\\...）。
 * @param {string} value 路径
 * @returns {boolean} 是否为 Windows 绝对路径
 */
const isWindowsAbsolutePath = (value: string): boolean => {
  const v = String(value || '').trim();
  if (!v) {
    return false;
  }

  // 盘符路径：C:\ or C:/
  if (/^[a-zA-Z]:[\\/]/.test(v)) {
    return true;
  }

  // UNC 路径：\\server\share\...
  if (/^\\\\[^\\/]+[\\/][^\\/]+/.test(v)) {
    return true;
  }

  return false;
};

const schema = z.object({
  sceneName: z.string().trim().min(1, t('components.sentinel.scenes.errors.sceneNameRequired')),
  execPath: z
    .string()
    .trim()
    .min(1, t('components.sentinel.scenes.errors.execPathRequired'))
    .refine((v) => isWindowsAbsolutePath(v), t('components.sentinel.scenes.errors.execPathInvalidWindowsPath'))
});

/**
 * 类型：表单数据
 */
type Schema = z.output<typeof schema>;

/**
 * 函数：执行校验
 * @param {boolean} touched 是否标记为已触发校验（用于展示错误）
 * @returns {TSentinelScenesConfigValidateResult} 校验结果
 */
const validateBuildResult = (): TSentinelScenesConfigValidateResult => {
  const parsed = schema.safeParse({ sceneName: stateForm.sceneName, execPath: stateForm.execPath });
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
    if (key === 'execPath') {
      errors.execPath = issue.message;
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
  machineId: String(props.machineId || ''),
  machineName: String(props.machineName || ''),
  machineRemark: String(props.machineRemark || ''),
  sceneName: String(stateForm.sceneName || '').trim(),
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
  stateForm.execPath = String(values.execPath || '');
  stateForm.argsText = Array.isArray(values.args) ? values.args.join('\n') : '';
  stateForm.enabled = Boolean(values.enabled);

  refForm.value?.clear();
  validateBuildResult();
};

/**
 * 事件：选择程序
 */
const handlePickExecPath = (): void => {
  emit('execpath-pick', String(stateForm.execPath || '').trim());
};

/**
 * 事件：表单提交
 * 描述：校验通过后触发。
 */
const handleSubmit = (_e: FormSubmitEvent<Schema>): void => {
  emit('submit', valuesGet());
};

/**
 * 函数：触发表单校验并在通过时提交
 * @returns {TSentinelScenesConfigValidateResult} 校验结果
 */
const validateAndSubmit = (): TSentinelScenesConfigValidateResult => {
  void refForm.value?.submit();
  return validateBuildResult();
};

watch(
  [() => stateForm.sceneName, () => stateForm.execPath, () => stateForm.argsText],
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
