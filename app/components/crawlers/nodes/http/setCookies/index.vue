<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-clipboard-plus" :title="t('components.crawler.blueprint.nodes.http.setCookies.title')" :description="t('components.crawler.blueprint.nodes.http.setCookies.description')" header-bg="bg-indigo-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-if="!computedHasCookieInput" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.mode.label')">
        <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField v-if="stateMode === 'single' && !computedHasCookieInput" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.cookie.label')">
        <UTextarea v-model="stateCookie" :rows="4" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.cookie.placeholder')" />
      </UFormField>

      <div v-else-if="stateMode !== 'single' && !computedHasCookieInput" class="space-y-3">
        <div
          v-for="(pair, index) in stateCookiePairs"
          :key="pair.id"
          class="rounded-lg border border-dashed border-default bg-(--ui-bg-soft) p-3"
        >
          <div class="space-y-3">
            <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.nameLabel')">
              <UInput v-model="pair.name" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.namePlaceholder')" />
            </UFormField>

            <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.valueLabel')">
              <UInput v-model="pair.value" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.valuePlaceholder')" />
            </UFormField>

            <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.domainLabel')">
              <UInput v-model="pair.domain" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.domainPlaceholder')" />
            </UFormField>

            <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.pathLabel')">
              <UInput v-model="pair.path" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.pathPlaceholder')" />
            </UFormField>
          </div>

          <div class="mt-3 space-y-3">
            <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.sameSite.label')">
              <USelect v-model="pair.sameSite" class="w-full" :items="stateSameSiteOptions" value-attribute="value" option-attribute="label" />
            </UFormField>

            <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.flags.label')">
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <USwitch v-model="pair.httpOnly" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.httpOnly.label')" />
                <USwitch v-model="pair.secure" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.secure.label')" />
                <USwitch v-model="pair.persistent" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.persistent.label')" />
              </div>
            </UFormField>

            <div class="flex items-end justify-end">
              <UButton
                v-if="stateCookiePairs.length > 1"
                size="xs"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.remove')"
                @click="removeCookiePair(index)"
              />
            </div>
          </div>

          <UFormField class="mt-3" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.expiresAt.label')">
            <UFieldGroup class="w-full">
              <UPopover :content="{ align: 'start', side: 'bottom', sideOffset: 8 }">
                <UInput :model-value="cookieExpiresAtDateTextGet(pair.expiresAt)" readonly class="w-full" :ui="{ base: 'text-left' }" icon="i-lucide-calendar-days" />

                <template #content>
                  <div class="p-2">
                    <UCalendar :model-value="cookieExpiresAtDateValueGet(pair.expiresAt)" color="neutral" variant="subtle" :year-controls="false" :disable-days-outside-current-view="true" @update:model-value="(value) => handleCookiePairExpiresAtDateUpdate(pair, value)" />
                  </div>
                </template>
              </UPopover>

              <UInputTime :model-value="cookieExpiresAtTimeValueGet(pair.expiresAt)" granularity="minute" :hour-cycle="24" class="w-44 shrink-0" @update:model-value="(value) => handleCookiePairExpiresAtTimeUpdate(pair, value)">
                <template #trailing>
                  <UIcon name="i-lucide:clock-3" class="text-dimmed size-4" />
                </template>
              </UInputTime>
            </UFieldGroup>
          </UFormField>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.pairs.add')" @click="addCookiePair" />
        </div>

      </div>

      <div v-if="stateMode === 'single' && !computedHasCookieInput" class="space-y-3">
        <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.scope.label')">
          <USelect v-model="stateScope" class="w-full" :items="stateScopeOptions" value-attribute="value" option-attribute="label" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.domain.label')">
          <UInput v-model="stateDomain" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.domain.placeholder')" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.path.label')">
          <UInput v-model="statePath" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.http.setCookies.fields.path.placeholder')" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.sameSite.label')">
          <USelect v-model="stateSameSite" class="w-full" :items="stateSameSiteOptions" value-attribute="value" option-attribute="label" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.expiresAt.label')">
          <UFieldGroup class="w-full">
            <UPopover :content="{ align: 'start', side: 'bottom', sideOffset: 8 }">
              <UInput :model-value="cookieExpiresAtDateTextGet(stateExpiresAt)" readonly class="w-full" :ui="{ base: 'text-left' }" icon="i-lucide-calendar-days" />

              <template #content>
                <div class="p-2">
                  <UCalendar :model-value="cookieExpiresAtDateValueGet(stateExpiresAt)" color="neutral" variant="subtle" :year-controls="false" :disable-days-outside-current-view="true" @update:model-value="handleStateExpiresAtDateUpdate" />
                </div>
              </template>
            </UPopover>

            <UInputTime :model-value="cookieExpiresAtTimeValueGet(stateExpiresAt)" granularity="minute" :hour-cycle="24" class="w-44 shrink-0" @update:model-value="handleStateExpiresAtTimeUpdate">
              <template #trailing>
                <UIcon name="i-lucide:clock-3" class="text-dimmed size-4" />
              </template>
            </UInputTime>
          </UFieldGroup>
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.flags.label')">
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <USwitch v-model="stateHttpOnly" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.httpOnly.label')" />
            <USwitch v-model="stateSecure" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.secure.label')" />
            <USwitch v-model="statePersistent" :label="t('components.crawler.blueprint.nodes.http.setCookies.fields.persistent.label')" />
          </div>
        </UFormField>
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { CalendarDate, parseTime } from '@internationalized/date';
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

interface ICookiePair {
  id: string;
  name: string;
  value: string;
  domain: string;
  path: string;
  sameSite: string;
  expiresAt: string;
  httpOnly: boolean;
  secure: boolean;
  persistent: boolean;
}

type TCookieInputTimeValue = ReturnType<typeof parseTime>;

const COOKIE_EXPIRES_TIME_FALLBACK = '00:00';

const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);

const stateMode = ref('pairs');
const stateCookie = ref('');
const stateCookiePairs = ref<ICookiePair[]>([createCookiePair()]);
const stateScope = ref('current');
const stateDomain = ref('');
const statePath = ref('/');
const stateSameSite = ref('lax');
const stateExpiresAt = ref('');
const stateHttpOnly = ref(true);
const stateSecure = ref(false);
const statePersistent = ref(false);

function createCookiePair(name: string = '', value: string = ''): ICookiePair {
  const pairId = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: pairId,
    name,
    value,
    domain: '',
    path: '/',
    sameSite: 'lax',
    expiresAt: '',
    httpOnly: true,
    secure: false,
    persistent: false
  };
}

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const computedHasCookieInput = computed(() => hasTargetPinConnection('cookie-input'));

const leftPins: IBasicSidePin[] = [
  {
    id: 'cookie-input',
    label: t('components.crawler.blueprint.nodes.http.setCookies.fields.cookie.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.http.setCookies.inputs.cookieDescription')
  }
];

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

const stateModeOptions = computed(() => [
  { value: 'pairs', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.mode.options.pairs') },
  { value: 'single', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.mode.options.single') }
]);

const stateScopeOptions = computed(() => [
  { value: 'current', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.scope.options.current') },
  { value: 'domain', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.scope.options.domain') },
  { value: 'all', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.scope.options.all') }
]);

const stateSameSiteOptions = computed(() => [
  { value: 'lax', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.sameSite.options.lax') },
  { value: 'strict', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.sameSite.options.strict') },
  { value: 'none', label: t('components.crawler.blueprint.nodes.http.setCookies.fields.sameSite.options.none') }
]);

const isSingleCalendarDateValue = (value: unknown): value is CalendarDate => {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return false;
  }

  return 'year' in value && 'month' in value && 'day' in value;
};

const calendarIsoDateGet = (value: unknown): string => {
  if (!isSingleCalendarDateValue(value)) {
    return '';
  }

  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
};

const datePartGet = (value: string): string => {
  const matched = /^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}$/.exec(String(value ?? '').trim());

  return matched?.[1] ?? '';
};

const timePartGet = (value: string, fallback: string): string => {
  const matched = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})$/.exec(String(value ?? '').trim());

  return matched?.[1] ?? fallback;
};

const localDateTimeMerge = (dateText: string, timeText: string): string => `${dateText}T${timeText}`;

const localDateTextGet = (): string => {
  const now = new Date();

  return `${String(now.getFullYear()).padStart(4, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const cookieExpiresAtDateValueGet = (value: string): CalendarDate | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}$/.exec(String(value ?? '').trim());

  if (!matched) {
    return undefined;
  }

  return new CalendarDate(Number(matched[1]), Number(matched[2]), Number(matched[3]));
};

const cookieExpiresAtTimeValueGet = (value: string): TCookieInputTimeValue => {
  const normalized = timePartGet(value, COOKIE_EXPIRES_TIME_FALLBACK);

  try {
    return parseTime(normalized) as unknown as TCookieInputTimeValue;
  } catch {
    return parseTime(COOKIE_EXPIRES_TIME_FALLBACK) as unknown as TCookieInputTimeValue;
  }
};

const cookieExpiresAtDateTextGet = (value: string): string => {
  return datePartGet(value) || t('components.crawler.blueprint.nodes.http.setCookies.fields.expiresAt.placeholder');
};

const cookieExpiresAtDateUpdate = (value: string, updater: (nextValue: string) => void, calendarValue: unknown): void => {
  if (!isSingleCalendarDateValue(calendarValue)) {
    return;
  }

  const nextValue = localDateTimeMerge(calendarIsoDateGet(calendarValue), timePartGet(value, COOKIE_EXPIRES_TIME_FALLBACK));
  updater(nextValue);
};

const cookieExpiresAtTimeUpdate = (value: string, updater: (nextValue: string) => void, timeValue: TCookieInputTimeValue): void => {
  if (!timeValue) {
    return;
  }

  const dateText = datePartGet(value) || localDateTextGet();
  const nextValue = localDateTimeMerge(dateText, `${String(timeValue.hour).padStart(2, '0')}:${String(timeValue.minute).padStart(2, '0')}`);
  updater(nextValue);
};

const addCookiePair = (): void => {
  stateCookiePairs.value.push(createCookiePair());
};

const removeCookiePair = (index: number): void => {
  if (stateCookiePairs.value.length <= 1) {
    stateCookiePairs.value = [createCookiePair()];
    return;
  }

  stateCookiePairs.value.splice(index, 1);
};

const handleStateExpiresAtDateUpdate = (value: unknown): void => {
  cookieExpiresAtDateUpdate(stateExpiresAt.value, (nextValue) => {
    stateExpiresAt.value = nextValue;
  }, value);
};

const handleStateExpiresAtTimeUpdate = (value: TCookieInputTimeValue): void => {
  cookieExpiresAtTimeUpdate(stateExpiresAt.value, (nextValue) => {
    stateExpiresAt.value = nextValue;
  }, value);
};

const handleCookiePairExpiresAtDateUpdate = (pair: ICookiePair, value: unknown): void => {
  cookieExpiresAtDateUpdate(pair.expiresAt, (nextValue) => {
    pair.expiresAt = nextValue;
  }, value);
};

const handleCookiePairExpiresAtTimeUpdate = (pair: ICookiePair, value: TCookieInputTimeValue): void => {
  cookieExpiresAtTimeUpdate(pair.expiresAt, (nextValue) => {
    pair.expiresAt = nextValue;
  }, value);
};

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateMode.value = ['single', 'pairs'].includes(String(data.mode)) ? String(data.mode) : 'pairs';
  stateCookie.value = String(data.cookie ?? '');
  stateCookiePairs.value = Array.isArray(data.cookiePairs)
    ? (data.cookiePairs as Array<Record<string, unknown>>).map((item) => ({
        ...createCookiePair(String(item.name ?? ''), String(item.value ?? '')),
        domain: String(item.domain ?? ''),
        path: String(item.path ?? '/'),
        sameSite: ['lax', 'strict', 'none'].includes(String(item.sameSite)) ? String(item.sameSite) : 'lax',
        expiresAt: String(item.expiresAt ?? ''),
        httpOnly: Boolean(item.httpOnly ?? true),
        secure: Boolean(item.secure ?? false),
        persistent: Boolean(item.persistent ?? false)
      }))
    : [createCookiePair()];
  stateScope.value = ['current', 'domain', 'all'].includes(String(data.scope)) ? String(data.scope) : 'current';
  stateDomain.value = String(data.domain ?? '');
  statePath.value = String(data.path ?? '/');
  stateSameSite.value = ['lax', 'strict', 'none'].includes(String(data.sameSite)) ? String(data.sameSite) : 'lax';
  stateExpiresAt.value = String(data.expiresAt ?? '');
  stateHttpOnly.value = Boolean(data.httpOnly ?? true);
  stateSecure.value = Boolean(data.secure ?? false);
  statePersistent.value = Boolean(data.persistent ?? false);
  stateInitialized.value = true;
});

watch(
  () => [
    stateMode.value,
    stateCookie.value,
    stateScope.value,
    stateDomain.value,
    statePath.value,
    stateSameSite.value,
    stateExpiresAt.value,
    stateHttpOnly.value,
    stateSecure.value,
    statePersistent.value,
    JSON.stringify(
      stateCookiePairs.value.map((item) => ({
        name: item.name,
        value: item.value,
        domain: item.domain,
        path: item.path,
        sameSite: item.sameSite,
        expiresAt: item.expiresAt,
        httpOnly: item.httpOnly,
        secure: item.secure,
        persistent: item.persistent
      }))
    )
  ],
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      mode: stateMode.value,
      cookie: stateCookie.value,
      cookiePairs: stateCookiePairs.value.map((item) => ({
        name: item.name,
        value: item.value,
        domain: item.domain,
        path: item.path,
        sameSite: item.sameSite,
        expiresAt: item.expiresAt,
        httpOnly: item.httpOnly,
        secure: item.secure,
        persistent: item.persistent
      })),
      scope: stateScope.value,
      domain: stateDomain.value,
      path: statePath.value,
      sameSite: stateSameSite.value,
      expiresAt: stateExpiresAt.value,
      httpOnly: stateHttpOnly.value,
      secure: stateSecure.value,
      persistent: statePersistent.value
    };
  }
);
</script>
