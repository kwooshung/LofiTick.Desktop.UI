/**
 * postinstall patch 脚本
 * 修复 nuxt-nightly + @pinia/nuxt 的兼容性问题
 *
 * 1. nuxt-nightly/dist/index.mjs: nitro.routing?.routeRules?.routes 防止空指针
 * 2. @pinia/nuxt/dist/module.mjs: 兼容性版本范围扩展到 >=5.0.0-0
 * 3. nitro/node_modules/h3 v2 RC: getRequestURL 支持相对路径（dev 模式无 host 时不报 Invalid URL）
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// scripts/ 目录在项目根目录下，node_modules 在根目录，需要 '../node_modules'
const nodeModules = resolve(__dirname, '..', 'node_modules');

// Patch 1: nuxt-nightly routeRules optional chaining
// 注意：必须先替换更具体的（含 .routes.some / .routes.length），再替换短的（.routeRules）
// 否则短模式会把长模式的前缀替换掉，导致长模式匹配失败
const nuxtNightlyPath = resolve(nodeModules, 'nuxt-nightly/dist/index.mjs');
if (existsSync(nuxtNightlyPath)) {
  let content = readFileSync(nuxtNightlyPath, 'utf8');

  const patterns = [
    ['nitro.routing.routeRules.routes.some', 'nitro.routing?.routeRules?.routes?.some'],
    ['nitro.routing.routeRules.routes.length', 'nitro.routing?.routeRules?.routes?.length'],
    ['nitro.routing.routeRules', 'nitro.routing?.routeRules'],
  ];

  let patchCount = 0;
  for (const [from, to] of patterns) {
    // 使用 split+join 替代 replaceAll，规避 Windows CRLF 行尾字符导致的匹配失败
    const parts = content.split(from);
    if (parts.length > 1) {
      content = parts.join(to);
      patchCount += parts.length - 1;
    }
  }

  if (patchCount > 0) {
    writeFileSync(nuxtNightlyPath, content);
    console.log(`✓ Patched nuxt-nightly: optional chaining for routeRules (${patchCount} replacements)`);
  }
}

// Patch 2: @pinia/nuxt compatibility range
const pianuxtPath = resolve(nodeModules, '@pinia/nuxt/dist/module.mjs');
if (existsSync(pianuxtPath)) {
  let content = readFileSync(pianuxtPath, 'utf8');
  const from = 'nuxt: "^3.15.0 || ^4.0.0"';
  const to = 'nuxt: "^3.15.0 || ^4.0.0 || >=5.0.0-0"';
  if (content.includes(from)) {
    content = content.replace(from, to);
    writeFileSync(pianuxtPath, content);
    console.log('✓ Patched @pinia/nuxt: extended compatibility range to >=5.0.0-0');
  }
}

// Patch 3: nitro/node_modules/h3 v2 RC — getRequestURL 支持相对路径
// h3 v2 使用 `new URL(event.url || event.req.url)` 但在 dev 模式下 event.url 可能只是路径 "/"
// 导致 @nuxtjs/i18n 的 server plugin 触发 `Invalid URL` 错误
// 修复：加上 fallback base URL，使相对路径也能正常解析
// 注意：h3 v2 bundle 文件名含 rollup hash，需动态查找包含目标代码的文件
const h3V2Dir = resolve(nodeModules, 'nitro/node_modules/h3/dist');
if (existsSync(h3V2Dir)) {
  const from = 'const url = new URL(event.url || event.req.url);';
  const to = 'const _rawUrl = event.url || event.req.url; const url = new URL(_rawUrl, /^https?:\\/\\//.test(_rawUrl) ? undefined : "http://localhost");';

  // 查找所有 h3-*.mjs 文件（排除 _entries 子目录），找到包含目标代码的那个
  const candidates = readdirSync(h3V2Dir).filter(
    (f) => f.startsWith('h3-') && f.endsWith('.mjs')
  );
  for (const candidate of candidates) {
    const h3V2Path = resolve(h3V2Dir, candidate);
    let content = readFileSync(h3V2Path, 'utf8');
    const parts = content.split(from);
    if (parts.length > 1) {
      content = parts.join(to);
      writeFileSync(h3V2Path, content);
      console.log(`✓ Patched nitro/h3 v2 (${candidate}): getRequestURL fallback base URL (${parts.length - 1} replacements)`);
      break;
    }
  }
}
