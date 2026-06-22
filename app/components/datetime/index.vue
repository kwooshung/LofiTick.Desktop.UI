<template>
  <UTooltip v-if="computedDatetime && computedShowRelative" :content="{ side: 'top' }">
    <NuxtTime v-bind="computedNuxtTimeProps" :locale="computedLocale" :relative="true" />

    <template #content>
      {{ tooltipPrefix }}
      <NuxtTime v-bind="computedNuxtTimeProps" :locale="computedLocale" :relative="false" year="numeric" month="long" day="numeric" hour="2-digit" minute="2-digit" second="2-digit" />
    </template>
  </UTooltip>

  <NuxtTime v-else-if="computedDatetime" v-bind="computedNuxtTimeProps" :relative="false" :locale="computedLocale" />

  <span v-else class="text-dimmed">--</span>
</template>

<script setup lang="ts">
import type { IDatetimeProps } from '@/components/datetime/index.types';

/**
 * 属性
 */
/**
 * Props：组件入参。
 */
const { locale, datetime, value, tooltipPrefix = '', relative = true, noRelativeAfter = 7 * 24 * 60 * 60, ...computedNuxtTimeRest } = defineProps<IDatetimeProps>();
/**
 * Hook：i18n
 */
const { locale: currentLocale, locales } = useI18n();

/**
 * 计算属性：本地化语言区域
 */
const computedLocale = computed(() => locale ?? String(locales.value.find((l) => l.code === currentLocale.value)?.language ?? undefined));

/**
 * 计算属性：组件实际消费的时间入参。
 */
const computedDatetimeInput = computed(() => datetime ?? value ?? '');

/**
 * 计算属性：传递给 NuxtTime 的属性。
 */
const computedNuxtTimeProps = computed(() => {
  return {
    ...computedNuxtTimeRest,
    datetime: computedDatetimeInput.value
  };
});

/**
 * 计算属性：DateTime 实例
 */
const computedDatetime = computed(() => {
  /**
   * 常量：input。
   */
  const input = computedDatetimeInput.value;

  // 判断传入的时间类型：时间对象
  if (input instanceof Date) {
    return DateTime.fromJSDate(input);
  }

  // 时间戳（数字类型）
  if (typeof input === 'number') {
    if (!Number.isFinite(input)) {
      return null;
    }

    return DateTime.fromUnixMilliseconds(input);
  }

  // 字符串类型
  const text = String(input ?? '').trim();

  if (text === '') {
    return null;
  }

  try {
    return DateTime.parse(text);
  } catch {
    return null;
  }
});

/**
 * 计算属性：是否显示相对时间
 */
const computedShowRelative = computed(() => {
  // 如果属性中明确禁止相对时间，直接返回 false
  if (relative === false) {
    return false;
  }

  if (!computedDatetime.value) {
    return false;
  }

  // 计算时间差（毫秒）：通过 DateTime 对象的 subtract 方法，减去当前时间，取绝对值，就是时间差（毫秒）
  const diffMMilliseconds = Math.abs(computedDatetime.value.subtract(DateTime.utcNow()));

  // 如果时间差小于等于 noRelativeAfter，则显示相对时间
  return diffMMilliseconds <= noRelativeAfter * 1000;
});
</script>
