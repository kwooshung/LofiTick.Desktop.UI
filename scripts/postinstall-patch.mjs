/**
 * postinstall patch 脚本
 *
 * 历史记录：
 * - [已废弃] nuxt-nightly routeRules optional chaining patch（nightly → v4.4.2 后不再需要）
 * - [已废弃] @pinia/nuxt 兼容性版本范围 patch（v0.11.3 原生支持 Nuxt 4，不再需要）
 * - [已废弃] nitro/node_modules/h3 v2 RC getRequestURL fallback patch（升级到 nuxt v4.4.2 后
 *   不再捆绑 h3 v2 RC，顶层 h3 v1.15.10 用 bracket 访问 headers，无此 bug）
 *
 * 当前（nuxt v4.4.2）：所有已知 nightly 兼容性 bug 均已在正式版中修复，暂无需要 patch 的项目。
 * 保留此脚本框架，以便将来发现新的兼容性问题时快速添加 patch。
 */

import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeModules = resolve(__dirname, '..', 'node_modules');

// 验证 node_modules 存在
if (!existsSync(nodeModules)) {
  console.warn('⚠ node_modules not found, skipping postinstall patches');
  process.exit(0);
}

console.log('✓ postinstall-patch: no patches needed for nuxt v4.x');
