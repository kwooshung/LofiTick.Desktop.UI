<template>
  <Dashboard>
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <UPageCard :title="t('pages.home.title')" :description="t('pages.home.welcomeEmail.description')" variant="naked" />

      <UPageCard variant="outline" :ui="{ container: 'space-y-5' }">
        <div class="flex flex-col gap-3">
          <div class="text-sm leading-6 text-muted">
            {{ t('pages.home.welcomeEmail.target', { email: stateTargetEmail }) }}
          </div>
          <div class="flex items-center gap-3">
            <UButton icon="i-lucide-mail" color="primary" :loading="computedSending" @click="handleSendWelcomeEmail">
              {{ t('pages.home.welcomeEmail.send') }}
            </UButton>
            <UBadge color="neutral" variant="soft">{{ stateTargetEmail }}</UBadge>
          </div>
        </div>

        <UAlert
          v-if="stateResultVisible"
          :color="stateResultSuccess ? 'success' : 'error'"
          variant="soft"
          :title="stateResultSuccess ? t('pages.home.welcomeEmail.result.successTitle') : t('pages.home.welcomeEmail.result.errorTitle')"
          :description="stateResultMessage"
        />
      </UPageCard>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
/**
 * 国际化：i18n
 */
const { t, locale } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 状态：默认收件邮箱
 */
const stateTargetEmail = 'kwooshung@qq.com';

/**
 * 状态：结果是否展示
 */
const stateResultVisible = ref(false);

/**
 * 状态：结果是否成功
 */
const stateResultSuccess = ref(false);

/**
 * 状态：结果文案
 */
const stateResultMessage = ref('');

/**
 * API：生成欢迎邮件
 */
const { datas: stateWelcomeEmailDatas, loading: stateWelcomeEmailLoading, refresh: refreshWelcomeEmail } = await useApi<IPageHomeWelcomeEmailPayload>('email/welcome', {
  method: 'POST',
  immediate: false
});

/**
 * API：发送邮件
 */
const { datas: stateEmailSendDatas, loading: stateEmailSendLoading, refresh: refreshEmailSend } = await useApi<IPageHomeSendWelcomeEmailResponse>('email/send', {
  method: 'POST',
  immediate: false
});

/**
 * 计算属性：是否正在发送
 */
const computedSending = computed(() => stateWelcomeEmailLoading.value || stateEmailSendLoading.value);

/**
 * 事件：发送欢迎邮件
 */
const handleSendWelcomeEmail = async (): Promise<void> => {
  stateResultVisible.value = false;

  try {
    await refreshWelcomeEmail({ datas: { locale: locale.value }, replace: true });

    const payload = stateWelcomeEmailDatas.value;
    if (!payload || !payload.subject || !payload.html) {
      throw new Error('welcome payload missing');
    }

    await refreshEmailSend({
      datas: {
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        to: payload.to
      },
      replace: true
    });

    stateResultVisible.value = true;
    stateResultSuccess.value = true;
    stateResultMessage.value = t('pages.home.welcomeEmail.result.success', {
      count: Number(stateEmailSendDatas.value?.toCount ?? payload.to.length),
      email: stateTargetEmail
    });
  } catch {
    stateResultVisible.value = true;
    stateResultSuccess.value = false;
    stateResultMessage.value = t('pages.home.welcomeEmail.result.error', {
      email: stateTargetEmail
    });
  }
};

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
</script>
