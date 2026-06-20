export default defineNuxtPlugin({
  name: 'theme-plugin',
  setup() {
    /**
     * 常量：appConfig。
     */
    const appConfig = useAppConfig();

    if (import.meta.client) {
      /**
       * 函数：更新主题颜色
       * @param {'primary' | 'neutral'} type 颜色类型
       * @returns {void} 无返回值
       */
      const updateColor = (type: 'primary' | 'neutral'): void => {
        /**
         * 常量：color。
         */
        const color = localStorage.getItem(`app-${type}`);
        if (color) {
          appConfig.ui.colors[type] = color;
        }
      };

      /**
       * 函数：更新主题 radius
       * @returns {void} 无返回值
       */
      const updateRadius = (): void => {
        /**
         * 常量：radius。
         */
        const radius = localStorage.getItem('app-theme-radius');
        if (radius) {
          appConfig.theme.radius = Number.parseFloat(radius);
        }
      };

      /**
       * 函数：更新主题 blackAsPrimary
       * @returns {void} 无返回值
       */
      const updateBlackAsPrimary = (): void => {
        /**
         * 常量：blackAsPrimary。
         */
        const blackAsPrimary = localStorage.getItem('app-theme-black-as-primary');
        if (blackAsPrimary) {
          appConfig.theme.blackAsPrimary = blackAsPrimary === 'true';
        }
      };

      updateColor('primary');
      updateColor('neutral');
      updateRadius();
      updateBlackAsPrimary();
    }

    if (import.meta.server) {
      useHead({
        script: [
          {
            innerHTML: `
            /**
             * 常量：html。
             */
            let html = document.querySelector('style#nuxt-ui-colors').innerHTML;

            if (localStorage.getItem('app-theme-primary')) {
              /**
               * 常量：primaryColor。
               */
              const primaryColor = localStorage.getItem('app-theme-primary');
              if (primaryColor !== 'black') {
                html = html.replace(
                  /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                  \`$1\${primaryColor}$2\`
                );
              }
            }
            if (localStorage.getItem('app-theme-neutral')) {
              /**
               * 常量：neutralColor。
               */
              let neutralColor = localStorage.getItem('app-theme-neutral');
              html = html.replace(
                /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
              );
            }

            document.querySelector('style#nuxt-ui-colors').innerHTML = html;
            `.replace(/\s+/g, ' '),
            type: 'text/javascript',
            tagPriority: -1
          },
          {
            innerHTML: `
            if (localStorage.getItem('app-theme-radius')) {
              document.querySelector('style#nuxt-ui-radius').innerHTML = ':root { --ui-radius: ' + localStorage.getItem('app-theme-radius') + 'rem; }';
            }
          `.replace(/\s+/g, ''),
            type: 'text/javascript',
            tagPriority: -1
          },
          {
            innerHTML: `
            if (localStorage.getItem('app-theme-black-as-primary') === 'true') {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';
            } else {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = '';
            }

          `.replace(/\s+/g, '')
          }
        ]
      });
    }
  }
});
