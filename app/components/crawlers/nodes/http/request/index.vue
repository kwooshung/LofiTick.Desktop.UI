<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-globe" :title="t('components.crawler.blueprint.nodes.http.request.title')" :description="t('components.crawler.blueprint.nodes.http.request.description')" header-bg="bg-indigo-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-if="!computedHasMethodInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.method.label')">
        <USelect v-model="stateMethod" class="w-full" :items="stateMethodOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField v-if="!computedHasUrlInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.url.label')">
        <UInput v-model="stateUrl" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.url.placeholder')" />
      </UFormField>

      <UFormField v-if="!computedHasQueryInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.query.label')">
        <div class="space-y-2">
          <div v-for="(pair, index) in stateQueryPairs" :key="pair.id" :class="stateQueryPairs.length > 1 ? 'grid grid-cols-[1fr_1fr_auto] gap-2' : 'grid grid-cols-2 gap-2'">
            <UInput v-model="pair.key" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.query.form.keyPlaceholder')" />
            <UInput v-model="pair.value" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.query.form.valuePlaceholder')" />
            <UButton v-if="stateQueryPairs.length > 1" size="xs" color="error" variant="soft" icon="i-lucide-trash-2" :label="t('components.crawler.blueprint.nodes.http.request.fields.query.form.remove')" @click="removeQueryPair(index)" />
          </div>

          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" :label="t('components.crawler.blueprint.nodes.http.request.fields.query.form.add')" @click="addQueryPair" />
        </div>
      </UFormField>

      <UFormField v-if="!computedHasHeadersInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.label')">
        <div class="space-y-2">
          <div v-for="(pair, index) in stateHeaderPairs" :key="pair.id" :class="stateHeaderPairs.length > 1 ? 'grid grid-cols-[1fr_1fr_auto] gap-2' : 'grid grid-cols-2 gap-2'">
            <UInput v-model="pair.key" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.headers.form.keyPlaceholder')" />
            <UInput v-model="pair.value" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.headers.form.valuePlaceholder')" />
            <UButton v-if="stateHeaderPairs.length > 1" size="xs" color="error" variant="soft" icon="i-lucide-trash-2" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.form.remove')" @click="removeHeaderPair(index)" />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.form.add')" @click="addHeaderPair" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-key-round" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.authorizationBearer')" @click="applyHeaderPreset('Authorization', 'Bearer <token>')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-file-json" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.contentTypeJson')" @click="applyHeaderPreset('Content-Type', 'application/json')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-file-text" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.contentTypeFormUrlencoded')" @click="applyHeaderPreset('Content-Type', 'application/x-www-form-urlencoded')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-arrow-down-up" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.acceptJson')" @click="applyHeaderPreset('Accept', 'application/json')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-languages" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.acceptLanguageZhCn')" @click="applyHeaderPreset('Accept-Language', 'zh-CN,zh;q=0.9')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-rotate-ccw" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.cacheControlNoCache')" @click="applyHeaderPreset('Cache-Control', 'no-cache')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-mouse-pointer-click" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.xRequestedWith')" @click="applyHeaderPreset('X-Requested-With', 'XMLHttpRequest')" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-monitor" :label="t('components.crawler.blueprint.nodes.http.request.fields.headers.presets.userAgentBrowser')" @click="applyHeaderPreset('User-Agent', 'Mozilla/5.0')" />
          </div>
        </div>
      </UFormField>

      <UFormField v-if="!computedHasRefererInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.referer.label')">
        <UInput v-model="stateReferer" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.referer.placeholder')" />
      </UFormField>

      <UFormField v-if="!computedHasCookieInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.cookie.label')">
        <UTextarea v-model="stateCookie" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.cookie.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.http.request.fields.bodyType.label')">
        <USelect v-model="stateBodyType" class="w-full" :items="stateBodyTypeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField v-if="stateBodyType === 'json' && !computedHasBodyInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.label')">
        <div class="space-y-2">
          <UTextarea v-model="stateBody" :rows="6" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.body.placeholder')" />

          <div class="flex items-center justify-end gap-2">
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-check-check" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.actions.validate')" @click="validateJsonBody" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-align-left" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.actions.format')" @click="formatJsonBody" />
          </div>

          <p v-if="stateJsonError !== ''" class="text-error text-xs">{{ stateJsonError }}</p>
        </div>
      </UFormField>

      <UFormField v-else-if="stateBodyType === 'form' && !computedHasBodyInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.label')">
        <div class="space-y-2">
          <div v-for="(pair, index) in stateFormPairs" :key="pair.id" :class="stateFormPairs.length > 1 ? 'grid grid-cols-[1fr_1fr_auto] gap-2' : 'grid grid-cols-2 gap-2'">
            <UInput v-model="pair.key" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.body.form.keyPlaceholder')" />
            <UInput v-model="pair.value" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.body.form.valuePlaceholder')" />
            <UButton v-if="stateFormPairs.length > 1" size="xs" color="error" variant="soft" icon="i-lucide-trash-2" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.form.remove')" @click="removeFormPair(index)" />
          </div>

          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.form.add')" @click="addFormPair" />
        </div>
      </UFormField>

      <UFormField v-else-if="stateBodyType === 'text' && !computedHasBodyInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.body.label')">
        <UTextarea v-model="stateBody" :rows="5" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.request.fields.body.placeholder')" />
      </UFormField>

      <UFormField v-if="!computedHasTimeoutInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerHttpRequestTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField v-if="!computedHasRetryInput" :label="t('components.crawler.blueprint.nodes.http.request.fields.retryCount.label')">
        <CrawlersNodesCommonNumberInput id="crawlerHttpRequestRetryCount" v-model="stateRetryCount" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <USwitch v-if="!computedHasFollowRedirectInput" v-model="stateFollowRedirect" :label="t('components.crawler.blueprint.nodes.http.request.fields.followRedirect.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IHttpRequestFormPair {
  id: string;
  key: string;
  value: string;
}

interface IHttpRequestKeyValuePair {
  id: string;
  key: string;
  value: string;
}

const { t } = useI18n();

const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);

const stateMethod = ref('GET');
const stateUrl = ref('');
const stateQuery = ref('');
const stateHeaders = ref('');
const stateQueryPairs = ref<IHttpRequestKeyValuePair[]>([]);
const stateHeaderPairs = ref<IHttpRequestKeyValuePair[]>([]);
const stateBodyType = ref('none');
const stateBody = ref('');
const stateReferer = ref('');
const stateCookie = ref('');
const stateJsonError = ref('');
const stateFormPairs = ref<IHttpRequestFormPair[]>([]);
const stateTimeoutMs = ref(15000);
const stateRetryCount = ref(0);
const stateFollowRedirect = ref(true);

const createFormPair = (key: string = '', value: string = ''): IHttpRequestFormPair => {
  const pairId = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: pairId,
    key,
    value
  };
};

const createKeyValuePair = (key: string = '', value: string = ''): IHttpRequestKeyValuePair => {
  const pairId = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: pairId,
    key,
    value
  };
};

const keyValuePairsNormalize = (input: unknown): IHttpRequestKeyValuePair[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      const src = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : null;

      if (!src) {
        return null;
      }

      return createKeyValuePair(String(src.key ?? ''), String(src.value ?? ''));
    })
    .filter((item): item is IHttpRequestKeyValuePair => item !== null);
};

const queryPairsFromText = (queryText: string): IHttpRequestKeyValuePair[] => {
  const query = String(queryText ?? '').trim();

  if (query === '') {
    return [createKeyValuePair()];
  }

  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const pairs: IHttpRequestKeyValuePair[] = [];

  for (const [key, value] of params.entries()) {
    pairs.push(createKeyValuePair(key, value));
  }

  return pairs.length > 0 ? pairs : [createKeyValuePair()];
};

const queryPairsToText = (pairs: IHttpRequestKeyValuePair[]): string => {
  const params = new URLSearchParams();

  for (const pair of pairs) {
    const key = String(pair.key ?? '').trim();

    if (key === '') {
      continue;
    }

    params.append(key, String(pair.value ?? ''));
  }

  return params.toString();
};

const headerPairsFromText = (headersText: string): IHttpRequestKeyValuePair[] => {
  const text = String(headersText ?? '').trim();

  if (text === '') {
    return [createKeyValuePair()];
  }

  try {
    const jsonValue = JSON.parse(text) as unknown;
    if (jsonValue && typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
      const entries = Object.entries(jsonValue as Record<string, unknown>).map(([key, value]) => createKeyValuePair(key, String(value ?? '')));

      return entries.length > 0 ? entries : [createKeyValuePair()];
    }
  } catch {
    // 忽略 JSON 解析失败，继续按 header 行解析。
  }

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
  const pairs: IHttpRequestKeyValuePair[] = [];

  for (const line of lines) {
    const splitIndex = line.indexOf(':');

    if (splitIndex < 0) {
      pairs.push(createKeyValuePair(line, ''));
      continue;
    }

    const key = line.slice(0, splitIndex).trim();
    const value = line.slice(splitIndex + 1).trim();
    pairs.push(createKeyValuePair(key, value));
  }

  return pairs.length > 0 ? pairs : [createKeyValuePair()];
};

const headerPairsToText = (pairs: IHttpRequestKeyValuePair[]): string => {
  const lines: string[] = [];

  for (const pair of pairs) {
    const key = String(pair.key ?? '').trim();

    if (key === '') {
      continue;
    }

    lines.push(`${key}: ${String(pair.value ?? '')}`);
  }

  return lines.join('\n');
};

const ensureQueryPairsReady = (): void => {
  if (stateQueryPairs.value.length === 0) {
    stateQueryPairs.value = queryPairsFromText(stateQuery.value);
  }
};

const ensureHeaderPairsReady = (): void => {
  if (stateHeaderPairs.value.length === 0) {
    stateHeaderPairs.value = headerPairsFromText(stateHeaders.value);
  }
};

const addQueryPair = (): void => {
  stateQueryPairs.value.push(createKeyValuePair());
};

const removeQueryPair = (index: number): void => {
  if (stateQueryPairs.value.length <= 1) {
    stateQueryPairs.value = [createKeyValuePair()];
    return;
  }

  stateQueryPairs.value.splice(index, 1);
};

const addHeaderPair = (): void => {
  stateHeaderPairs.value.push(createKeyValuePair());
};

const removeHeaderPair = (index: number): void => {
  if (stateHeaderPairs.value.length <= 1) {
    stateHeaderPairs.value = [createKeyValuePair()];
    return;
  }

  stateHeaderPairs.value.splice(index, 1);
};

const applyHeaderPreset = (key: string, value: string): void => {
  const keyLower = key.toLowerCase();
  const existing = stateHeaderPairs.value.find(
    (item) =>
      String(item.key ?? '')
        .trim()
        .toLowerCase() === keyLower
  );

  if (existing) {
    existing.value = value;
    return;
  }

  const emptyPair = stateHeaderPairs.value.find((item) => {
    const itemKey = String(item.key ?? '').trim();
    const itemValue = String(item.value ?? '').trim();

    return itemKey === '' && itemValue === '';
  });

  if (emptyPair) {
    emptyPair.key = key;
    emptyPair.value = value;
    return;
  }

  stateHeaderPairs.value.push(createKeyValuePair(key, value));
};

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '');

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const computedHasMethodInput = computed(() => hasTargetPinConnection('method-input'));
const computedHasUrlInput = computed(() => hasTargetPinConnection('url-input'));
const computedHasQueryInput = computed(() => hasTargetPinConnection('query-input'));
const computedHasHeadersInput = computed(() => hasTargetPinConnection('headers-input'));
const computedHasRefererInput = computed(() => hasTargetPinConnection('referer-input'));
const computedHasCookieInput = computed(() => hasTargetPinConnection('cookie-input'));
const computedHasBodyInput = computed(() => hasTargetPinConnection('body-input'));
const computedHasTimeoutInput = computed(() => hasTargetPinConnection('timeout-ms-input'));
const computedHasRetryInput = computed(() => hasTargetPinConnection('retry-count-input'));
const computedHasFollowRedirectInput = computed(() => hasTargetPinConnection('follow-redirect-input'));

const formPairsNormalize = (input: unknown): IHttpRequestFormPair[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      const src = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : null;

      if (!src) {
        return null;
      }

      return createFormPair(String(src.key ?? ''), String(src.value ?? ''));
    })
    .filter((item): item is IHttpRequestFormPair => item !== null);
};

const formPairsFromBody = (bodyText: string): IHttpRequestFormPair[] => {
  const body = String(bodyText ?? '').trim();

  if (body === '') {
    return [createFormPair()];
  }

  try {
    const jsonValue = JSON.parse(body) as unknown;
    if (jsonValue && typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
      const entries = Object.entries(jsonValue as Record<string, unknown>).map(([key, value]) => createFormPair(key, String(value ?? '')));

      return entries.length > 0 ? entries : [createFormPair()];
    }
  } catch {
    // 忽略 JSON 解析失败，继续尝试按 querystring 解析。
  }

  const params = new URLSearchParams(body);
  const pairs: IHttpRequestFormPair[] = [];

  for (const [key, value] of params.entries()) {
    pairs.push(createFormPair(key, value));
  }

  return pairs.length > 0 ? pairs : [createFormPair()];
};

const formPairsToBody = (pairs: IHttpRequestFormPair[]): string => {
  const params = new URLSearchParams();

  for (const pair of pairs) {
    const key = String(pair.key ?? '').trim();

    if (key === '') {
      continue;
    }

    params.append(key, String(pair.value ?? ''));
  }

  return params.toString();
};

const ensureFormPairsReady = (): void => {
  if (stateFormPairs.value.length === 0) {
    stateFormPairs.value = formPairsFromBody(stateBody.value);
  }
};

const addFormPair = (): void => {
  stateFormPairs.value.push(createFormPair());
};

const removeFormPair = (index: number): void => {
  if (stateFormPairs.value.length <= 1) {
    stateFormPairs.value = [createFormPair()];
    return;
  }

  stateFormPairs.value.splice(index, 1);
};

const validateJsonBody = (): void => {
  const raw = String(stateBody.value ?? '').trim();

  if (raw === '') {
    stateJsonError.value = '';
    return;
  }

  try {
    JSON.parse(raw);
    stateJsonError.value = '';
  } catch {
    stateJsonError.value = t('components.crawler.blueprint.nodes.http.request.fields.body.jsonInvalid');
  }
};

const formatJsonBody = (): void => {
  const raw = String(stateBody.value ?? '').trim();

  if (raw === '') {
    stateJsonError.value = '';
    return;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    stateBody.value = JSON.stringify(parsed, null, 2);
    stateJsonError.value = '';
  } catch {
    stateJsonError.value = t('components.crawler.blueprint.nodes.http.request.fields.body.jsonInvalid');
  }
};

const leftPins: IBasicSidePin[] = [
  {
    id: 'method-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.method.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 12,
    description: t('components.crawler.blueprint.nodes.http.request.fields.method.label')
  },
  {
    id: 'url-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.url.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 20,
    description: t('components.crawler.blueprint.nodes.http.request.fields.url.label')
  },
  {
    id: 'query-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.query.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 28,
    description: t('components.crawler.blueprint.nodes.http.request.fields.query.label')
  },
  {
    id: 'headers-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.headers.label'),
    direction: 'in',
    dataType: 'object',
    topPercent: 36,
    description: t('components.crawler.blueprint.nodes.http.request.fields.headers.label')
  },
  {
    id: 'referer-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.referer.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 44,
    description: t('components.crawler.blueprint.nodes.http.request.fields.referer.label')
  },
  {
    id: 'cookie-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.cookie.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 52,
    description: t('components.crawler.blueprint.nodes.http.request.fields.cookie.label')
  },
  {
    id: 'body-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.body.label'),
    direction: 'in',
    dataType: 'any',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.http.request.fields.body.label')
  },
  {
    id: 'timeout-ms-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.timeoutMs.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 74,
    description: t('components.crawler.blueprint.nodes.http.request.fields.timeoutMs.label')
  },
  {
    id: 'retry-count-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.retryCount.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 82,
    description: t('components.crawler.blueprint.nodes.http.request.fields.retryCount.label')
  },
  {
    id: 'follow-redirect-input',
    label: t('components.crawler.blueprint.nodes.http.request.fields.followRedirect.label'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.http.request.fields.followRedirect.label')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'response-any',
    label: t('components.crawler.blueprint.nodes.http.request.outputs.response.label'),
    direction: 'out',
    dataType: 'any',
    topPercent: 20,
    description: t('components.crawler.blueprint.nodes.http.request.outputs.response.description')
  },
  {
    id: 'status-number',
    label: t('components.crawler.blueprint.nodes.http.request.outputs.statusCode.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 38,
    description: t('components.crawler.blueprint.nodes.http.request.outputs.statusCode.description')
  },
  {
    id: 'ok-boolean',
    label: t('components.crawler.blueprint.nodes.http.request.outputs.ok.label'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 56,
    description: t('components.crawler.blueprint.nodes.http.request.outputs.ok.description')
  },
  {
    id: 'headers-object',
    label: t('components.crawler.blueprint.nodes.http.request.outputs.headers.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 74,
    description: t('components.crawler.blueprint.nodes.http.request.outputs.headers.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

const stateMethodOptions = computed(() => {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => {
    return {
      value: method,
      label: method
    };
  });
});

const stateBodyTypeOptions = computed(() => {
  return [
    {
      value: 'none',
      label: t('components.crawler.blueprint.nodes.http.request.fields.bodyType.options.none')
    },
    {
      value: 'json',
      label: t('components.crawler.blueprint.nodes.http.request.fields.bodyType.options.json')
    },
    {
      value: 'form',
      label: t('components.crawler.blueprint.nodes.http.request.fields.bodyType.options.form')
    },
    {
      value: 'text',
      label: t('components.crawler.blueprint.nodes.http.request.fields.bodyType.options.text')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateMethod.value = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(String(data.method)) ? String(data.method) : 'GET';
  stateUrl.value = String(data.url ?? '');
  stateQuery.value = String(data.query ?? '');
  stateHeaders.value = String(data.headers ?? '');
  stateReferer.value = String(data.referer ?? '');
  stateCookie.value = String(data.cookie ?? data.cookies ?? '');
  stateQueryPairs.value = keyValuePairsNormalize(data.queryPairs);
  stateHeaderPairs.value = keyValuePairsNormalize(data.headerPairs);
  ensureQueryPairsReady();
  ensureHeaderPairsReady();
  stateQuery.value = queryPairsToText(stateQueryPairs.value);
  stateHeaders.value = headerPairsToText(stateHeaderPairs.value);
  stateBodyType.value = ['none', 'json', 'form', 'text'].includes(String(data.bodyType)) ? String(data.bodyType) : 'none';
  stateBody.value = String(data.body ?? '');
  stateFormPairs.value = formPairsNormalize(data.formPairs);

  if (stateBodyType.value === 'form') {
    ensureFormPairsReady();
    stateBody.value = formPairsToBody(stateFormPairs.value);
  }

  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 15000;
  stateRetryCount.value = Number.isFinite(Number(data.retryCount)) ? Math.max(0, Number(data.retryCount)) : 0;
  stateFollowRedirect.value = Boolean(data.followRedirect ?? true);
  stateInitialized.value = true;
});

watch(stateBodyType, (type) => {
  if (!stateInitialized.value) {
    return;
  }

  if (type === 'form') {
    ensureFormPairsReady();
    stateBody.value = formPairsToBody(stateFormPairs.value);
    stateJsonError.value = '';
    return;
  }

  if (type !== 'json') {
    stateJsonError.value = '';
  }
});

watch(
  stateFormPairs,
  () => {
    if (!stateInitialized.value || stateBodyType.value !== 'form') {
      return;
    }

    stateBody.value = formPairsToBody(stateFormPairs.value);
  },
  { deep: true }
);

watch(stateBody, () => {
  if (!stateInitialized.value || stateBodyType.value !== 'json') {
    return;
  }

  validateJsonBody();
});

watch(
  stateQueryPairs,
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateQuery.value = queryPairsToText(stateQueryPairs.value);
  },
  { deep: true }
);

watch(
  stateHeaderPairs,
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateHeaders.value = headerPairsToText(stateHeaderPairs.value);
  },
  { deep: true }
);

watch([stateMethod, stateUrl, stateQuery, stateHeaders, stateReferer, stateCookie, stateBodyType, stateBody, stateTimeoutMs, stateRetryCount, stateFollowRedirect], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    method: stateMethod.value,
    url: stateUrl.value,
    query: stateQuery.value,
    queryPairs: stateQueryPairs.value.map((item) => ({
      key: item.key,
      value: item.value
    })),
    headers: stateHeaders.value,
    headerPairs: stateHeaderPairs.value.map((item) => ({
      key: item.key,
      value: item.value
    })),
    bodyType: stateBodyType.value,
    body: stateBody.value,
    referer: stateReferer.value,
    cookie: stateCookie.value,
    formPairs: stateFormPairs.value.map((item) => ({
      key: item.key,
      value: item.value
    })),
    timeoutMs: stateTimeoutMs.value,
    retryCount: stateRetryCount.value,
    followRedirect: stateFollowRedirect.value,
    useCookies: String(stateCookie.value ?? '').trim() !== ''
  };
});
</script>
