/* eslint-disable @typescript-eslint/no-explicit-any */

const isBrowser = typeof window !== 'undefined';

/**
 * 枚举：主题切换动画类型
 */
export enum EThemeAnimationType {
  /**
   * 圆形扩散
   */
  CIRCLE = 'circle',

  /**
   * 模糊圆圈
   */
  BLUR_CIRCLE = 'blur-circle',

  /**
   * 扫码线
   */
  QR_SCAN = 'qr-scan'
}

/**
 * Hook：Vue / Nuxt 版主题切换动画 Hook
 * 对应 react-theme-switch-animation 的 useModeAnimation
 * @param {IThemeSwitchAnimationOptions} options 配置项
 * @return {{triggerElRef: Ref<HTMLElement | null>, toggleSwitchTheme: () => Promise<void>, isDarkMode: ComputedRef<boolean>}} 包含触发元素引用、切换函数和当前是否 Dark 的计算属性的对象
 */
export const useThemeSwitchAnimation = (options: IThemeSwitchAnimationOptions = {}): { triggerElRef: Ref<HTMLElement | null>; toggleSwitchTheme: () => Promise<void>; isDarkMode: ComputedRef<boolean> } => {
  /**
   * 常量：选项解构
   * - duration：动画时长，默认 750ms
   * - easing：动画缓动函数，默认 ease-in-out
   * - pseudoElement：伪元素选择器，默认 ::view-transition-new(root)
   * - globalClassName：全局 dark class 名称，默认 dark
   * - animationType：动画类型，默认 BLUR_CIRCLE
   * - blurAmount：模糊圆动画时的模糊量，默认 1
   * - styleId：动态注入样式的 style 元素 ID，默认 theme-switch-style
   */
  const { duration: propsDuration = 3000, easing = 'ease-in-out', pseudoElement = '::view-transition-new(root)', globalClassName = 'dark', animationType = EThemeAnimationType.BLUR_CIRCLE, blurAmount = 1, styleId = 'theme-switch-style' } = options;

  /**
   * Hook：主题模式
   */
  const colorMode = useColorMode();

  /**
   * 常量：是否高分辨率屏幕
   */
  const isHighResolution = isBrowser && (window.innerWidth >= 3000 || window.innerHeight >= 2000);

  /**
   * 常量：动画时长（高分屏时略短一些）
   */
  const duration = isHighResolution ? Math.max(propsDuration * 0.8, 500) : propsDuration;

  /**
   * 实际生效的「当前是否 Dark」
   * - light：false
   * - dark：true
   * - system：看系统 prefers-color-scheme
   */
  const isDarkMode = computed<boolean>({
    get() {
      if (!isBrowser) {
        return false;
      }
      const v = colorMode.value;
      if (v === 'dark') {
        return true;
      }
      if (v === 'system') {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      }
      return false;
    },
    set(next) {
      colorMode.preference = next ? 'dark' : 'light';
    }
  });

  /*====================【基础样式注入】====================*/
  const injectBaseStyles = () => {
    if (!isBrowser) {
      return;
    }
    const styleIdBase = 'theme-switch-base-style';
    if (document.getElementById(styleIdBase)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleIdBase;

    style.textContent = `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
        ${isHighResolution ? 'transform: translateZ(0);' : ''}
      }

      ${
        isHighResolution
          ? `
      ::view-transition-group(root),
      ::view-transition-image-pair(root),
      ::view-transition-old(root),
      ::view-transition-new(root) {
        backface-visibility: hidden;
        perspective: 1000px;
        transform: translate3d(0, 0, 0);
      }
      `
          : ''
      }
    `;
    document.head.appendChild(style);
  };

  onMounted(() => {
    injectBaseStyles();
  });

  /*====================【触发元素】====================*/
  /**
   * triggerEl引用：绑定到触发动画的 DOM 元素（按钮）
   * - 你在页面里通过 triggerElRef.value = el / event.currentTarget 来设置
   */
  const triggerElRef = ref<HTMLElement | null>(null);

  /*====================【模糊圆 Mask 生成】====================*/
  const createBlurCircleMask = (blur: number) => {
    const hr = typeof window !== 'undefined' && (window.innerWidth >= 3000 || window.innerHeight >= 2000);

    const blurFilter = `<filter id="blur"><feGaussianBlur stdDeviation="${blur}" /></filter>`;
    const circleRadius = hr ? 20 : 25;

    // 注意 %23 = '#'
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs>${blurFilter}</defs><circle cx="0" cy="0" r="${circleRadius}" fill="white" filter="url(%23blur)"/></svg>')`;
  };

  /*====================【核心：切换 + 动画】====================*/
  const toggleSwitchTheme = async () => {
    if (!isBrowser) {
      isDarkMode.value = !isDarkMode.value;
      return;
    }

    const supportsViewTransition = (document as any).startViewTransition;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!triggerElRef.value || !supportsViewTransition || reduceMotion) {
      // 不支持 ViewTransition 或没有触发元素时，直接切换，不做动画
      isDarkMode.value = !isDarkMode.value;
      return;
    }

    // 移除旧的样式
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const rawTrigger = triggerElRef.value as any;
    const triggerEl = (rawTrigger?.$el ?? rawTrigger) as HTMLElement;

    if (!triggerEl || typeof triggerEl.getBoundingClientRect !== 'function') {
      isDarkMode.value = !isDarkMode.value;
      return;
    }

    const rect = triggerEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 距离四个角的最大半径
    const topLeft = Math.hypot(x, y);
    const topRight = Math.hypot(window.innerWidth - x, y);
    const bottomLeft = Math.hypot(x, window.innerHeight - y);
    const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y);
    const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight);

    const viewportSize = Math.max(window.innerWidth, window.innerHeight) + 200;
    const hr = window.innerWidth >= 3000 || window.innerHeight >= 2000;
    const scaleFactor = hr ? 2.5 : 4;
    const optimalMaskSize = hr ? Math.min(viewportSize * scaleFactor, 5000) : viewportSize * scaleFactor;

    let blurAnimationDuration = duration;

    if (animationType === EThemeAnimationType.BLUR_CIRCLE) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;

      const blurFactor = hr ? 1.5 : 1.2;
      const finalMaskSize = Math.max(optimalMaskSize, maxRadius * 2.5);
      blurAnimationDuration = hr ? Math.max(duration + 120, 700) : duration;

      styleElement.textContent = `
        ::view-transition-group(root) {
          animation-duration: ${blurAnimationDuration}ms;
          animation-timing-function: ${
            hr ? 'cubic-bezier(0.2, 0, 0.2, 1)' : 'linear(' + '0 0%, 0.2342 12.49%, 0.4374 24.99%,' + '0.6093 37.49%, 0.6835 43.74%,' + '0.7499 49.99%, 0.8086 56.25%,' + '0.8593 62.5%, 0.9023 68.75%, 0.9375 75%,' + '0.9648 81.25%, 0.9844 87.5%,' + '0.9961 93.75%, 1 100%' + ')'
          };
          will-change: transform;
        }

        ::view-transition-new(root) {
          mask: ${createBlurCircleMask(blurAmount * blurFactor)} 0 0 / 100% 100% no-repeat;
          mask-position: ${x}px ${y}px;
          animation: maskScale ${blurAnimationDuration}ms ${easing} both;
          transform-origin: ${x}px ${y}px;
          will-change: mask-size, mask-position;
        }

        ::view-transition-old(root),
        .${globalClassName}::view-transition-old(root) {
          animation: maskScale ${blurAnimationDuration}ms ${easing} both;
          transform-origin: ${x}px ${y}px;
          z-index: -1;
          will-change: mask-size, mask-position;
        }

        @keyframes maskScale {
          0% {
            mask-size: 0px;
            mask-position: ${x}px ${y}px;
          }
          100% {
            mask-size: ${finalMaskSize}px;
            mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    // === 启动 ViewTransition，并在其中切换 dark/light ===
    const vt = (document as any).startViewTransition(() => {
      // 注意：这里同步切 isDarkMode，就相当于 React 里的 flushSync + setIsDarkMode
      isDarkMode.value = !isDarkMode.value;
    });

    await vt.ready;

    // === CIRCLE ===
    if (animationType === EThemeAnimationType.CIRCLE) {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`]
        },
        {
          duration,
          easing,
          pseudoElement,
          fill: 'both'
        }
      );
    }

    // === QR_SCAN ===
    if (animationType === EThemeAnimationType.QR_SCAN) {
      const scanLineWidth = hr ? 8 : 4;
      document.documentElement.animate(
        {
          clipPath: [`polygon(0% 0%, ${scanLineWidth}px 0%, ${scanLineWidth}px 100%, 0% 100%)`, `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`]
        },
        {
          duration,
          easing,
          pseudoElement,
          fill: 'both'
        }
      );
    }

    // === BLUR_CIRCLE 样式清理（比动画稍晚一点） ===
    if (animationType === EThemeAnimationType.BLUR_CIRCLE) {
      void vt.finished.finally(() => {
        window.setTimeout(
          () => {
            const styleElement = document.getElementById(styleId);

            if (styleElement) {
              styleElement.remove();
            }
          },
          Math.max(blurAnimationDuration - duration, 16)
        );
      });
    }
  };

  /*====================【可选：同步 html.class / localStorage】====================*/
  if (isBrowser) {
    watch(
      () => isDarkMode.value,
      (v) => {
        if (v) {
          document.documentElement.classList.add(globalClassName);
          localStorage.theme = 'dark';
        } else {
          document.documentElement.classList.remove(globalClassName);
          localStorage.theme = 'light';
        }
      },
      { immediate: true }
    );
  }

  return {
    triggerElRef,
    toggleSwitchTheme,
    isDarkMode
  };
};
