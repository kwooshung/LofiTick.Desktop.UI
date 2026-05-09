<template>
  <html lang="zh-CN">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{{ title }}</title>
    </head>
    <body :style="styles.body">
      <div :style="styles.preview">{{ previewText ?? title }}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" :style="styles.wrapper">
        <tbody>
          <tr>
            <td align="center">
              <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" :style="styles.container">
                <tbody>
                  <tr>
                    <td :style="styles.header">
                      <div :style="styles.brandEn">{{ nameEn }}</div>
                      <div :style="styles.brandCn">{{ nameCn }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td :style="styles.content">
                      <h1 :style="styles.title">{{ title }}</h1>
                      <p :style="styles.text">emails.welcome.content.header.greeting</p>
                      <p :style="styles.text">emails.welcome.content.header.intro.line1</p>
                      <p :style="styles.text">emails.welcome.content.header.intro.line2</p>
                      <p :style="styles.text">emails.welcome.content.task.intro</p>
                      <ul :style="styles.list">
                        <li :style="styles.listItem">
                          <span>emails.welcome.content.live.intro </span>
                          <a :href="officialSite" :style="styles.link">{{ nameEn }}</a>
                          <span> emails.welcome.content.live.suffix</span>
                        </li>
                        <li :style="styles.listItem">
                          <span>emails.welcome.content.community.short</span>
                        </li>
                      </ul>
                      <p :style="styles.subTitle">emails.welcome.content.community.title</p>
                      <p :style="styles.text">emails.welcome.content.community.description</p>
                      <p :style="styles.subTitle">emails.welcome.content.socials.qq.title emails.welcome.content.socials.qq.group.title</p>
                      <ul :style="styles.list">
                        <li v-for="(group, index) in socials.qq.groups" :key="group.number" :style="styles.listItem">
                          <span>emails.welcome.content.socials.qq.group.prefix{{ index + 1 }}emails.welcome.content.socials.qq.group.suffix </span>
                          <a :href="group.url" :style="styles.link">
                            {{ group.number }}
                          </a>
                          <span>
                            emails.welcome.content.socials.qq.meta.lparen{{ group.size }}emails.welcome.content.socials.qq.meta.membersUnitemails.welcome.content.socials.qq.meta.statusSeparator
                            {{ group.full ? 'emails.welcome.content.socials.qq.meta.full' : 'emails.welcome.content.socials.qq.meta.joinable' }}
                            emails.welcome.content.socials.qq.meta.rparen
                          </span>
                        </li>
                      </ul>
                      <p :style="styles.text">emails.welcome.content.closing.thanks</p>
                      <p :style="styles.text">emails.welcome.content.closing.blessing</p>
                      <p :style="styles.signature">emails.layout.signature emails.layout.teamSuffix</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
</template>

<script setup lang="ts">
import type { IEmailWelcomeProps } from './index.types';

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
  body: {
    margin: '0',
    padding: '0',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    backgroundColor: '#f7f8fa',
    color: '#314158'
  },
  preview: {
    display: 'none',
    overflow: 'hidden',
    lineHeight: '1px',
    opacity: '0',
    maxHeight: '0',
    maxWidth: '0'
  },
  wrapper: {
    width: '100%',
    backgroundColor: '#f7f8fa',
    padding: '24px 0'
  },
  container: {
    width: '680px',
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    borderCollapse: 'collapse'
  },
  header: {
    padding: '28px 32px 20px',
    backgroundColor: '#eef4ff'
  },
  brandEn: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827'
  },
  brandCn: {
    marginTop: '6px',
    fontSize: '14px',
    color: '#4b5563'
  },
  content: {
    padding: '32px'
  },
  title: {
    margin: '0 0 18px',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '36px',
    color: '#111827'
  },
  text: {
    margin: '0 0 14px',
    color: '#314158',
    fontSize: '14px',
    lineHeight: '24px'
  },
  subTitle: {
    margin: '22px 0 12px',
    color: '#111827',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '28px'
  },
  list: {
    margin: '0 0 18px',
    paddingLeft: '20px'
  },
  listItem: {
    marginBottom: '10px',
    fontSize: '14px',
    lineHeight: '24px'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline'
  },
  signature: {
    margin: '24px 0 0',
    color: '#111827',
    fontSize: '14px',
    fontWeight: '700'
  }
};
</script>
