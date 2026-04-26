<template>
  <Dashboard>
    <div class="text-lofitick">asdf</div>

    <UCard v-if="stateIsDev" class="mt-4">
      <template #header>
        <div class="text-sm font-medium">Rust 签名测试</div>
      </template>

      <div class="flex flex-col gap-3">
        <UFormGroup label="machineCode">
          <UInput v-model="stateMachineCode" placeholder="请输入 machineCode" />
        </UFormGroup>

        <div class="flex flex-wrap items-center gap-2">
          <UButton :loading="stateSending && stateLastMethod === 'GET'" @click="testSend('GET')">发送 GET（desktop/signature-tests）</UButton>
          <UButton :loading="stateSending && stateLastMethod === 'POST'" @click="testSend('POST')">发送 POST</UButton>
          <UButton :loading="stateSending && stateLastMethod === 'PATCH'" @click="testSend('PATCH')">发送 PATCH</UButton>
          <UButton :loading="stateSending && stateLastMethod === 'DELETE'" @click="testSend('DELETE')">发送 DELETE</UButton>

          <div class="text-xs text-gray-500">
            method: {{ stateLastMethod }} | loading:
            GET={{ String(stateApiGetLoading) }},
            POST={{ String(stateApiPostLoading) }},
            PATCH={{ String(stateApiPatchLoading) }},
            DELETE={{ String(stateApiDeleteLoading) }}
          </div>
        </div>

        <UFormGroup label="status">
          <pre class="whitespace-pre-wrap wrap-break-word text-xs">{{ stateStatusText }}</pre>
        </UFormGroup>

        <UFormGroup label="datas">
          <pre class="max-h-72 overflow-auto whitespace-pre-wrap wrap-break-word text-xs">{{ stateDatasText }}</pre>
        </UFormGroup>

        <UFormGroup v-if="stateErrorText !== ''" label="error">
          <pre class="max-h-48 overflow-auto whitespace-pre-wrap wrap-break-word text-xs">{{ stateErrorText }}</pre>
        </UFormGroup>
      </div>
    </UCard>

    <ULink :to="localePath('/folder')"></ULink>
  </Dashboard>
</template>

<script setup lang="ts">
/**
 * 国际化：i18n
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-proicons:settings',
    to: localePath('/'),
    exact: true
  }
];

/**
 * 状态：machineCode
 */
const stateMachineCode = ref('c4befacf52fec9c1d60f3796');

/**
 * 状态：是否正在发送
 */
const stateSending = ref(false);

/**
 * 常量：是否开发环境
 */
const stateIsDev = import.meta.dev;

/**
 * 状态：最近一次发送的方法
 */
const stateLastMethod = ref<'GET' | 'POST' | 'PATCH' | 'DELETE'>('GET');

/**
 * API：签名测试（GET）
 * 描述：用于验证 useApi 生成的签名是否可通过后端校验。
 */
const {
  datas: stateApiGetDatas,
  status: stateApiGetStatus,
  loading: stateApiGetLoading,
  error: stateApiGetError,
  refresh: refreshApiGet
} = await useApi<Record<string, unknown>>('desktop/signature-tests', { immediate: false, method: 'GET' });

/**
 * API：签名测试（POST）
 * 描述：用于验证 body 方法的签名与参数合并规则。
 */
const {
  datas: stateApiPostDatas,
  status: stateApiPostStatus,
  loading: stateApiPostLoading,
  error: stateApiPostError,
  refresh: refreshApiPost
} = await useApi<Record<string, unknown>>('desktop/signature-tests', { immediate: false, method: 'POST' });

/**
 * API：签名测试（PATCH）
 * 描述：用于验证 PATCH 的签名与参数合并规则。
 */
const {
  datas: stateApiPatchDatas,
  status: stateApiPatchStatus,
  loading: stateApiPatchLoading,
  error: stateApiPatchError,
  refresh: refreshApiPatch
} = await useApi<Record<string, unknown>>('desktop/signature-tests', { immediate: false, method: 'PATCH' });

/**
 * API：签名测试（DELETE）
 * 描述：用于验证无 body 方法（DELETE）的签名口径。
 */
const {
  datas: stateApiDeleteDatas,
  status: stateApiDeleteStatus,
  loading: stateApiDeleteLoading,
  error: stateApiDeleteError,
  refresh: refreshApiDelete
} = await useApi<Record<string, unknown>>('desktop/signature-tests', { immediate: false, method: 'DELETE' });

/**
 * 函数：获取当前选中的 status 值
 * @returns {unknown} status 值
 */
const getActiveStatus = (): unknown => {
  if (stateLastMethod.value === 'POST') {
    return stateApiPostStatus.value as unknown;
  }
  if (stateLastMethod.value === 'PATCH') {
    return stateApiPatchStatus.value as unknown;
  }
  if (stateLastMethod.value === 'DELETE') {
    return stateApiDeleteStatus.value as unknown;
  }
  return stateApiGetStatus.value as unknown;
};

/**
 * 函数：获取当前选中的 datas 值
 * @returns {unknown} datas 值
 */
const getActiveDatas = (): unknown => {
  if (stateLastMethod.value === 'POST') {
    return stateApiPostDatas.value as unknown;
  }
  if (stateLastMethod.value === 'PATCH') {
    return stateApiPatchDatas.value as unknown;
  }
  if (stateLastMethod.value === 'DELETE') {
    return stateApiDeleteDatas.value as unknown;
  }
  return stateApiGetDatas.value as unknown;
};

/**
 * 函数：获取当前选中的 error 值
 * @returns {unknown} error 值
 */
const getActiveError = (): unknown => {
  if (stateLastMethod.value === 'POST') {
    return stateApiPostError.value as unknown;
  }
  if (stateLastMethod.value === 'PATCH') {
    return stateApiPatchError.value as unknown;
  }
  if (stateLastMethod.value === 'DELETE') {
    return stateApiDeleteError.value as unknown;
  }
  return stateApiGetError.value as unknown;
};

/**
 * 计算属性：status 文本
 */
const stateStatusText = computed((): string => {
  const s = getActiveStatus();
  if (!s || typeof s !== 'object' || Array.isArray(s)) {
    return '';
  }
  return JSON.stringify(s, null, 2);
});

/**
 * 计算属性：datas 文本
 */
const stateDatasText = computed((): string => {
  const d = getActiveDatas();
  if (typeof d === 'undefined') {
    return '';
  }
  return JSON.stringify(d, null, 2);
});

/**
 * 计算属性：error 文本
 */
const stateErrorText = computed((): string => {
  const e = getActiveError();
  if (!e) {
    return '';
  }
  if (e instanceof Error) {
    return e.stack || e.message;
  }
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
});

/**
 * 函数：发送一次测试请求
 * @param {'GET' | 'POST' | 'PATCH' | 'DELETE'} method 请求方法
 * @returns {Promise<void>} 无返回值
 */
const testSend = async (method: 'GET' | 'POST' | 'PATCH' | 'DELETE'): Promise<void> => {
  if (stateSending.value) {
    return;
  }

  const machineCode = String(stateMachineCode.value ?? '').trim();
  if (machineCode === '') {
    return;
  }

  stateSending.value = true;
  try {
    stateLastMethod.value = method;

    /**
     * 常量：请求测试载荷
     */
    const now = Date.now();

    if (method === 'GET') {
      await refreshApiGet({
        datas: {
          machineCode,
          marker: 'get',
          tsClient: now
        }
      });
      return;
    }

    if (method === 'POST') {
      await refreshApiPost({
        query: {
          machineCode,
          q: 'post'
        },
        body: {
          bodyMarker: 'post',
          tsBody: now
        },
        datas: {
          machineCode,
          marker: 'datas-post',
          tsClient: now
        }
      });
      return;
    }

    if (method === 'PATCH') {
      await refreshApiPatch({
        query: {
          machineCode,
          q: 'patch'
        },
        body: {
          bodyMarker: 'patch',
          tsBody: now
        },
        datas: {
          machineCode,
          marker: 'datas-patch',
          tsClient: now
        }
      });
      return;
    }

    await refreshApiDelete({
      datas: {
        machineCode,
        marker: 'delete',
        tsClient: now
      }
    });
  } finally {
    stateSending.value = false;
  }
};
</script>
