import fs from 'node:fs';
import path from 'node:path';

import { colors, createLogger } from './common/console';

/**
 * 常量：日志工具
 */
const logger = createLogger('[minify-colors]');

/**
 * 常量：扫描目录
 */
const SCAN_DIRS = [path.resolve(process.cwd(), 'dist/public'), path.resolve(process.cwd(), 'dist/server')].filter((dir) => fs.existsSync(dir));

// 检查扫描目录是否存在
if (SCAN_DIRS.length === 0) {
  logger.error('没找到 dist/public 或 dist/server，先构建！');
  process.exit(1);
}

/**
 * 变量：压缩计数
 */
let count = 0;

/**
 * 函数：替换文件内容
 * @param {string} file 文件路径
 * @return {void} 无返回值
 */
const replaceInFile = (file: string): void => {
  const content = fs.readFileSync(file, 'utf-8');

  // 关键：只在包含 "nuxt-ui-colors" 的文件里动手
  if (!content.includes('"nuxt-ui-colors"')) {
    return;
  }

  const original = content;

  // 精准正则：只匹配 nuxt-ui-colors 附近出现的 \n + 空格
  // 特征：\n 后面紧跟 2~14 个空格
  const modified = content
    .replace(/\\n\s{2,}/g, () => {
      count++;
      return ''; // 直接干掉这坨垃圾
    })
    .replace(/\}\\n\}`/g, () => {
      count++;
      return '`'; // 直接干掉这坨垃圾
    });

  if (modified !== original) {
    fs.writeFileSync(file, modified, 'utf-8');
    logger.ok(`已净化 → ${path.relative(process.cwd(), file)}`);
  }
};

/**
 * 函数：遍历处理
 * @param {string} dir 目录路径
 * @return {void} 无返回值
 */
const walk = (dir: string): void => {
  if (path.basename(dir) === 'node_modules') {
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|mjs)$/.test(file)) {
      replaceInFile(fullPath);
    }
  }
};

/**
 * 主函数
 */
const main = (): void => {
  logger.info(colors.cyanBold('开始干掉 nuxt-ui-colors 的换行垃圾'));

  SCAN_DIRS.forEach((dir) => {
    logger.info(`扫描：${dir}`);
    walk(dir);
  });

  if (count === 0) {
    logger.warn('没找到要压缩的，可能是已经干过了');
  } else {
    logger.ok(colors.greenBold(`搞定！压缩了 ${count} 处，体积起飞！`));
  }
};

main();
