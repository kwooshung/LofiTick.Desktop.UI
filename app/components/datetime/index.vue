<template>
  <UTooltip v-if="computedShowRelative" :content="{ side: 'top' }">
    <NuxtTime v-bind="$props" :locale="computedLocale" :relative="true" />

    <template #content> {{ tooltipPrefix }}<NuxtTime v-bind="$props" :locale="computedLocale" :relative="false" year="numeric" month="long" day="numeric" hour="2-digit" minute="2-digit" second="2-digit" /> </template>
  </UTooltip>

  <NuxtTime v-else v-bind="$props" :relative="false" :locale="computedLocale" />
</template>

<script setup lang="ts">
import type { IDatetimeProps } from '@/components/datetime/index.types';

/**
 * 属性
 */
const props = withDefaults(defineProps<IDatetimeProps>(), {
  relative: true,
  noRelativeAfter: 7 * 24 * 60 * 60
});
/**
 * Hook：i18n
 */
const { locale: currentLocale, locales } = useI18n();

/**
 * 计算属性：本地化语言区域
 */
const computedLocale = computed(() => props.locale ?? String(locales.value.find((l) => l.code === currentLocale.value)?.language ?? undefined));

/**
 * 计算属性：DateTime 实例
 */
const computedDatetime = computed(() => {
  // 判断传入的时间类型：时间对象
  if (props.datetime instanceof Date) {
    return DateTime.fromJSDate(props.datetime);
  }

  // 时间戳（数字类型）
  if (typeof props.datetime === 'number') {
    return DateTime.fromUnixMilliseconds(props.datetime);
  }

  // 字符串类型
  return DateTime.parse(props.datetime);
});

/**
 * 计算属性：是否显示相对时间
 */
const computedShowRelative = computed(() => {
  // 如果属性中明确禁止相对时间，直接返回 false
  if (props.relative === false) {
    return false;
  }

  // 计算时间差（毫秒）：通过 DateTime 对象的 subtract 方法，减去当前时间，取绝对值，就是时间差（毫秒）
  const diffMMilliseconds = Math.abs(computedDatetime.value.subtract(DateTime.utcNow()));

  // 如果时间差小于等于 noRelativeAfter，则显示相对时间
  return diffMMilliseconds <= props.noRelativeAfter * 1000;
});
</script>
