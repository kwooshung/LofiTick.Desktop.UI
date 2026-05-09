<template>
  <EHtml>
    <EHead>
      <EStyle>
        .email-content a{color:#2b7fff!important; transition:color 300ms ease-out!important;}.email-content a:hover{text-decoration:underline!important;}.email-footer a{transition:color 300ms ease-out!important;}.email-footer a:hover{color:#51a2ff!important; text-decoration:underline!important;}
      </EStyle>
    </EHead>
    <EBody :style="styles.main">
      <EPreview>{{ previewText }}</EPreview>
      <EContainer :style="styles.container">
        <ESection :style="styles.logo">
          <ELink :href="officialSite" :style="styles.brandLink">
            <EText :style="styles.brandText">{{ nameEn }}</EText>
          </ELink>
        </ESection>
        <ESection class="email-content" :style="{ ...styles.content, borderColor: computedColorByType }">
          <EHeading :style="styles.contentTitle">{{ title }}</EHeading>
          <slot />
          <EText :style="styles.text">
            <b> emails.layout.signature </b>
            emails.layout.teamSuffix
          </EText>
        </ESection>
      </EContainer>
      <ESection class="email-footer" :style="styles.footer">
        <EText :style="styles.footerNoReply">emails.layout.noReply <ELink :style="styles.footerLink" :href="officialSite">emails.layout.unsubscribe</ELink></EText>
        <EText :style="styles.footerText">
          <ELink :style="styles.footerLink" :href="officialSite">{{ nameCn }}</ELink>
          emails.layout.copyright.owner
        </EText>
        <EText :style="styles.footerText">
          emails.layout.copyright.prefix
          {{ new Date().getFullYear() }}
          <ELink :style="styles.footerLink" :href="officialSite">{{ nameEn }}</ELink>
          . emails.layout.copyright.suffix
        </EText>
      </ESection>
    </EBody>
  </EHtml>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { IEmailLayoutProps } from '../index.types';

/**
 * 属性：布局属性
 */
const props = defineProps<IEmailLayoutProps>();

/**
 * 计算属性：边框颜色
 */
const computedColorByType = computed(() => {
  switch (props.type) {
    case 'info':
      return '#0092b8';
    case 'success':
      return '#00c950';
    case 'warning':
      return '#f0b100';
    case 'error':
      return '#fb2c36';
    default:
      return '#2b7fff';
  }
});

/**
 * 常量：样式
 */
const styles = {
  main: {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    backgroundColor: '#f7f8fa'
  },
  container: {
    margin: '0 auto',
    padding: 0,
    width: '680px',
    maxWidth: '100%',
    backgroundColor: '#ffffff'
  },
  logo: {
    display: 'flex',
    padding: '20px 30px 20px 30px',
    backgroundColor: '#f7f8fa'
  },
  brandLink: {
    textDecoration: 'none'
  },
  brandText: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827'
  },
  text: {
    color: '#314158'
  },
  content: {
    padding: '30px 30px 40px 30px',
    borderTop: '3px solid',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0px 1px 1px 0px rgba(122, 55, 55, 0.2)',
    overflow: 'hidden'
  },
  contentTitle: {
    margin: '0 0 15px',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '36px'
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    margin: '0 auto',
    padding: '15px 0',
    width: '680px',
    maxWidth: '100%'
  },
  footerNoReply: {
    margin: '0 0 10px',
    padding: 0,
    fontSize: '14px',
    color: '#314158'
  },
  footerLink: {
    color: '#314158',
    textDecoration: 'underline !important'
  },
  footerText: {
    margin: 0,
    padding: 0,
    fontSize: '14px',
    color: '#314158'
  }
};
</script>
