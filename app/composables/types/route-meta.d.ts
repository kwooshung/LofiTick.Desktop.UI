import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // 直接写死标题（不推荐 i18n 下使用）
    title?: string;
    // i18n key（推荐），例如 'pages.home.title'
    titleKey?: string;
    // 传给 t() 的参数（可选），也会与 route.params 合并
    titleParams?: Record<string, string | number>;

    // 描述的 i18n key（可选）
    descriptionKey?: string;
    descriptionParams?: Record<string, string | number>;
  }
}
