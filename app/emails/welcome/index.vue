<template>
  <EmailLayout :type="type" :official-site="officialSite" :preview-text="previewText ?? title" :name-en="nameEn" :name-cn="nameCn" :title="title">
    <EText :style="styles.text">emails.welcome.content.header.greeting</EText>
    <EText :style="styles.text">emails.welcome.content.header.intro.line1</EText>
    <EText :style="styles.text">emails.welcome.content.header.intro.line2</EText>
    <EHr :style="styles.divider" />
    <EText :style="styles.text">emails.welcome.content.task.intro</EText>
    <ul>
      <li>
        <EText :style="styles.text">
          emails.welcome.content.live.intro
          <ELink :style="styles.link" href="https://live.bilibili.com/27519423/">emails.welcome.content.live.platform.bilibili</ELink>、<ELink :style="styles.link" href="https://www.xiaohongshu.com/">emails.welcome.content.live.platform.xiaohongshu</ELink>、<ELink
            :style="styles.link"
            href="https://www.douyin.com/"
            >emails.welcome.content.live.platform.douyin</ELink
          >、<ELink :style="styles.link" href="https://www.youtube.com/">emails.welcome.content.live.platform.youtube</ELink>
          emails.welcome.content.live.suffix
        </EText>
      </li>
      <li>
        <EText :style="styles.text">emails.welcome.content.community.short</EText>
      </li>
    </ul>
    <EHr :style="styles.divider" />
    <EText :style="styles.title">emails.welcome.content.community.title</EText>
    <EText :style="styles.text">emails.welcome.content.community.description</EText>
    <EText :style="styles.subTitle">emails.welcome.content.socials.qq.title emails.welcome.content.socials.qq.group.title</EText>
    <ul>
      <li v-for="(group, index) in socials.qq.groups" :key="group.number">
        <EText :style="styles.text">
          emails.welcome.content.socials.qq.group.prefix{{ index + 1 }}emails.welcome.content.socials.qq.group.suffix
          <ELink :style="styles.link" :href="group.url">
            {{ group.number }}emails.welcome.content.socials.qq.meta.lparen{{ group.size }}emails.welcome.content.socials.qq.meta.membersUnitemails.welcome.content.socials.qq.meta.statusSeparator
            <template v-if="group.full">emails.welcome.content.socials.qq.meta.full</template>
            <template v-else>emails.welcome.content.socials.qq.meta.joinable</template>
            emails.welcome.content.socials.qq.meta.rparen
          </ELink>
        </EText>
      </li>
    </ul>
    <EHr :style="styles.divider" />
    <EText :style="styles.text">emails.welcome.content.closing.thanks</EText>
    <EText :style="styles.text">emails.welcome.content.closing.blessing</EText>
  </EmailLayout>
</template>

<script setup lang="ts">
import type { IEmailWelcomeProps } from '@/emails/index.types';

import EmailLayout from '@/emails/layout/index.vue';

/**
 * 属性：欢迎邮件属性
 */
withDefaults(defineProps<IEmailWelcomeProps>(), {
  type: 'primary'
});

/**
 * 常量：样式
 */
const styles = {
  title: {
    margin: '0 0 15px',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '36px'
  },
  subTitle: {
    margin: '15px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '28px'
  },
  text: {
    color: '#314158'
  },
  link: {
    color: '#2b7fff'
  },
  divider: {
    margin: '15px 0'
  }
};
</script>
