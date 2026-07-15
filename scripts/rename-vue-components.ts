/**
 * 脚本：批量重命名 Vue 组件
 * 说明：
 * 1) 单目录仅一个 .vue => 重命名为 index.vue
 * 2) 单目录多个 .vue => 除 index.vue 外每个文件拆分到以其文件名转 kebab 的子目录并改名 index.vue
 * 3) 目录名统一驼峰→中横线（使用临时 .tmp 规避 Windows 大小写不敏感）
 * 4) 支持 --dry-run / --verbose
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

import { colors, createLogger } from './common/console';

/**
 * 配置：重命名参数
 * @typedef TRenameConfig
 * @property {string} rootDir 根目录绝对路径
 * @property {boolean} [dryRun] 是否演练（不执行真实写操作）
 * @property {boolean} [verbose] 是否输出详细跳过/错误列表
 */
type TRenameConfig = {
  /**
   * 根目录绝对路径
   */
  rootDir: string;

  /**
   * 是否演练（不执行真实写操作）
   */
  dryRun?: boolean;

  /**
   * 是否输出详细跳过/错误列表
   */
  verbose?: boolean;
};

/**
 * 类型：跳过记录（记录被跳过的路径与原因）
 * @typedef TSkipRecord
 * @property {string} path 被跳过的相对路径
 * @property {string} reason 跳过原因说明
 */
interface TSkipRecord {
  /**
   * 被跳过的相对路径
   */
  path: string;

  /**
   * 跳过原因说明
   */
  reason: string;
}

/**
 * 类型：运行结果集合
 */
interface IRenameResults {
  renamedFiles: string[];
  movedFiles: string[];
  renamedDirs: string[];
  skipped: TSkipRecord[];
  errors: string[];
}

/**
 * 常量：运行结果收集容器
 */
const results: IRenameResults = {
  renamedFiles: [],
  movedFiles: [],
  renamedDirs: [],
  skipped: [],
  errors: []
};

const logger = createLogger('[rename-vue-components]');

const getErrMessage = (e: unknown): string => (e instanceof Error ? e.message : String(e));

const rel = (p: string): string => path.relative(process.cwd(), p) || '.';

const toKebabCase = (input: string): string => {
  const noExt = input.replace(/\.[^/.]+$/, '');
  const s1 = noExt.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  const s2 = s1.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2');
  return s2
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

const pathExists = async (p: string): Promise<boolean> => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const isDirectory = async (p: string): Promise<boolean> => {
  try {
    const st = await fs.lstat(p);
    return st.isDirectory();
  } catch {
    return false;
  }
};

const safeRenameDir = async (oldPath: string, newPath: string, dryRun = false): Promise<boolean> => {
  if (path.resolve(oldPath) === path.resolve(newPath)) {
    return true;
  }

  const oldLower = path.resolve(oldPath).toLowerCase();
  const newLower = path.resolve(newPath).toLowerCase();
  const targetExists = await pathExists(newPath);

  if (targetExists && oldLower !== newLower) {
    results.skipped.push({ path: rel(oldPath), reason: `目标目录已存在: ${rel(newPath)}` });
    logger.warn(`目录重命名跳过：${colors.blue(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}（目标存在）`);
    return false;
  }

  if (dryRun) {
    logger.info(`${colors.yellowBold('[dry-run]')} 目录重命名：${colors.blue(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
    return true;
  }

  const onlyCaseChange = oldLower === newLower;

  if (!onlyCaseChange) {
    try {
      await fs.rename(oldPath, newPath);
      return true;
    } catch (e: unknown) {
      const msg = getErrMessage(e);
      results.errors.push(`${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
      logger.error(`目录重命名失败: ${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
      return false;
    }
  }

  const baseName = path.basename(oldPath);
  const parent = path.dirname(oldPath);
  const genTempName = () => `${baseName}.__tmp__${Math.random().toString(36).slice(2, 8)}`;
  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    attempt++;
    const tempName = genTempName();
    const tempPath = path.join(parent, tempName);
    try {
      if (await pathExists(tempPath)) {
        await fs.rm(tempPath, { recursive: true, force: true });
      }
      await fs.rename(oldPath, tempPath);
      await fs.rename(tempPath, newPath);
      if (attempt > 1) {
        logger.info(`目录重命名成功（第${attempt}次重试）：${colors.blue(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
      }
      return true;
    } catch (e: unknown) {
      const msg = getErrMessage(e);
      logger.warn(`大小写重命名重试(${attempt}/${maxAttempts})失败：${colors.blue(rel(oldPath))}：${colors.yellow(msg)}`);
      await sleep(100 * 2 ** (attempt - 1));
    }
  }

  try {
    const backupName = `${baseName}.__bak__${Date.now()}`;
    const backupPath = path.join(parent, backupName);
    const tempCopy = path.join(parent, `${baseName}.__copy__${Date.now()}`);
    await fs.cp(oldPath, tempCopy, { recursive: true });
    await fs.rename(oldPath, backupPath);
    if (await pathExists(newPath)) {
      results.skipped.push({ path: rel(oldPath), reason: `大小写回退时发现目标已出现: ${rel(newPath)}` });
      logger.warn(`目录重命名跳过（回退阶段目标出现）：${colors.blue(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
      await fs.rm(tempCopy, { recursive: true, force: true });
      return false;
    }
    await fs.rename(tempCopy, newPath);
    await fs.rm(backupPath, { recursive: true, force: true });
    logger.info(`目录重命名（回退 copy 模式）成功：${colors.blue(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
    return true;
  } catch (e: unknown) {
    const msg = getErrMessage(e);
    results.errors.push(`${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
    logger.error(`目录重命名回退失败: ${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
    return false;
  }
};

const safeRenameFile = async (oldPath: string, newPath: string, dryRun = false): Promise<boolean> => {
  if (path.resolve(oldPath) === path.resolve(newPath)) {
    return true;
  }
  const oldLower = path.resolve(oldPath).toLowerCase();
  const newLower = path.resolve(newPath).toLowerCase();
  const targetExists = await pathExists(newPath);
  if (targetExists && oldLower !== newLower) {
    results.skipped.push({ path: rel(oldPath), reason: `目标文件已存在: ${rel(newPath)}` });
    logger.warn(`文件重命名跳过：${colors.gray(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}（目标存在）`);
    return false;
  }
  if (dryRun) {
    logger.info(`${colors.yellowBold('[dry-run]')} 文件重命名：${colors.gray(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
    return true;
  }
  if (oldLower === newLower) {
    const tmp = oldPath + '.tmp';
    try {
      if (await pathExists(tmp)) {
        await fs.rm(tmp, { force: true });
      }
      await fs.rename(oldPath, tmp);
      await fs.rename(tmp, newPath);
      logger.info(`文件重命名：${colors.gray(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
      return true;
    } catch (e: unknown) {
      const msg = getErrMessage(e);
      results.errors.push(`${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
      logger.error(`文件大小写重命名失败: ${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
      return false;
    }
  } else {
    try {
      await fs.rename(oldPath, newPath);
      logger.info(`文件重命名：${colors.gray(rel(oldPath))} ${colors.cyan('→')} ${colors.green(rel(newPath))}`);
      return true;
    } catch (e: unknown) {
      const msg = getErrMessage(e);
      results.errors.push(`${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
      logger.error(`文件重命名失败: ${rel(oldPath)} -> ${rel(newPath)}: ${msg}`);
      return false;
    }
  }
};

const splitMultiVueFiles = async (dir: string, vueFiles: string[], dryRun = false): Promise<void> => {
  for (const f of vueFiles) {
    if (f.toLowerCase() === 'index.vue') {
      continue;
    }
    const base = f.replace(/\.vue$/i, '');
    const targetFolderName = toKebabCase(base) || 'component';
    let targetDir = path.join(dir, targetFolderName);
    let suffix = 1;
    while (await pathExists(targetDir)) {
      suffix += 1;
      targetDir = path.join(dir, `${targetFolderName}-${suffix}`);
    }
    const srcFile = path.join(dir, f);
    const destFile = path.join(targetDir, 'index.vue');
    try {
      if (!dryRun) {
        await fs.mkdir(targetDir, { recursive: true });
      } else {
        logger.info(`${colors.yellowBold('[dry-run]')} 创建目录：${colors.blue(rel(targetDir))}`);
      }
      if (await pathExists(destFile)) {
        results.skipped.push({ path: rel(srcFile), reason: `目标 index.vue 已存在: ${rel(destFile)}` });
        logger.warn(`移动跳过：${colors.gray(rel(srcFile))} ${colors.cyan('→')} ${colors.green(rel(destFile))}（目标已存在）`);
        continue;
      }
      if (dryRun) {
        logger.info(`${colors.yellowBold('[dry-run]')} 移动：${colors.gray(rel(srcFile))} ${colors.cyan('→')} ${colors.green(rel(destFile))}`);
      } else {
        await fs.rename(srcFile, destFile);
      }
      results.movedFiles.push(`${rel(srcFile)} -> ${rel(destFile)}`);
      logger.info(`文件移动：${colors.gray(rel(srcFile))} ${colors.cyan('→')} ${colors.green(rel(destFile))}`);
    } catch (e: unknown) {
      const msg = getErrMessage(e);
      results.errors.push(`${rel(srcFile)} -> ${rel(destFile)}: ${msg}`);
      logger.error(`文件移动失败: ${rel(srcFile)} -> ${rel(destFile)}: ${msg}`);
    }
  }
};

const processDirectory = async (dir: string, cfg: TRenameConfig): Promise<void> => {
  let entries: { name: string; isFile: boolean; isDir: boolean }[] = [];
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    entries = dirents.map((d) => ({ name: d.name, isFile: d.isFile(), isDir: d.isDirectory() }));
  } catch (e: unknown) {
    const msg = getErrMessage(e);
    results.errors.push(`读取目录失败: ${rel(dir)}: ${msg}`);
    logger.error(`读取目录失败: ${rel(dir)}: ${msg}`);
    return;
  }
  const files = entries.filter((e) => e.isFile).map((e) => e.name);
  const vueFiles = files.filter((f) => /\.vue$/i.test(f));

  if (vueFiles.length === 1) {
    const only = vueFiles[0];
    if (only.toLowerCase() !== 'index.vue') {
      const oldPath = path.join(dir, only);
      const newPath = path.join(dir, 'index.vue');
      await safeRenameFile(oldPath, newPath, cfg.dryRun);
      results.renamedFiles.push(`${rel(oldPath)} -> ${rel(newPath)}`);
    }
  } else if (vueFiles.length > 1) {
    await splitMultiVueFiles(dir, vueFiles, cfg.dryRun);
  }

  try {
    const dirents2 = await fs.readdir(dir, { withFileTypes: true });
    const subdirs2 = dirents2.filter((d) => d.isDirectory()).map((d) => d.name);
    for (const sd of subdirs2) {
      await processDirectory(path.join(dir, sd), cfg);
    }
  } catch (e: unknown) {
    const msg = getErrMessage(e);
    results.errors.push(`读取子目录失败: ${rel(dir)}: ${msg}`);
    logger.error(`读取子目录失败: ${rel(dir)}: ${msg}`);
  }
  const parent = path.dirname(dir);
  const currentName = path.basename(dir);
  const targetName = toKebabCase(currentName);
  if (targetName && targetName !== currentName) {
    const targetPath = path.join(parent, targetName);
    const ok = await safeRenameDir(dir, targetPath, cfg.dryRun);
    if (ok) {
      results.renamedDirs.push(`${rel(dir)} -> ${rel(targetPath)}`);
      logger.info(`目录重命名：${colors.blue(rel(dir))} ${colors.cyan('→')} ${colors.green(rel(targetPath))}`);
    }
  }
};

const validate = async (rootDir: string): Promise<{ ok: boolean; details: string[] }> => {
  const details: string[] = [];
  let ok = true;
  const walk = async (dir: string): Promise<void> => {
    let dirents: import('node:fs').Dirent[] = [];
    try {
      dirents = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const d of dirents) {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) {
        const kebab = toKebabCase(d.name);
        if (kebab !== d.name) {
          ok = false;
          details.push(`目录非中横线命名: ${rel(p)}`);
        }
        await walk(p);
      } else if (d.isFile()) {
        if (/\.vue$/i.test(d.name) && d.name.toLowerCase() !== 'index.vue') {
          ok = false;
          details.push(`存在非 index.vue: ${rel(p)}`);
        }
      }
    }
  };
  await walk(rootDir);
  return { ok, details };
};

const main = async (): Promise<void> => {
  const argDir = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  const verbose = process.argv.includes('--verbose');
  const rootDir = path.resolve(process.cwd(), argDir || 'app/components');
  const cfg: TRenameConfig = { rootDir, dryRun, verbose };
  if (!(await pathExists(rootDir)) || !(await isDirectory(rootDir))) {
    logger.error(`源目录不存在或不可访问: ${rel(rootDir)}`);
    process.exitCode = 2;
    return;
  }
  if (cfg.dryRun) {
    logger.warn(`运行模式：${colors.yellowBold('dry-run')}（不实际修改）`);
  } else {
    logger.info(`开始执行目录：${colors.blue(rel(rootDir))}`);
  }
  try {
    await processDirectory(rootDir, cfg);
  } catch (e: unknown) {
    const msg = getErrMessage(e);
    results.errors.push(`处理失败: ${rel(rootDir)}: ${msg}`);
    logger.error(`处理失败: ${rel(rootDir)}: ${msg}`);
  }
  const verify = await validate(rootDir);
  if (verify.ok) {
    logger.ok(`${colors.greenBold('验证通过')}：所有 Vue 文件均为 ${colors.green('index.vue')}，目录为 ${colors.green('kebab-case')}`);
  } else {
    logger.warn(`${colors.yellowBold('验证未通过')}：`);
    verify.details.forEach((d) => logger.warn(` - ${colors.yellow(d)}`));
  }

  logger.info(colors.bold('结果汇总：'));

  if (results.renamedFiles.length) {
    logger.ok(`文件重命名 ${colors.greenBold(results.renamedFiles.length)}`);
  }
  if (results.movedFiles.length) {
    logger.ok(`文件拆分移动 ${colors.greenBold(results.movedFiles.length)}`);
  }
  if (results.renamedDirs.length) {
    logger.ok(`目录重命名 ${colors.greenBold(results.renamedDirs.length)}`);
  }
  if (results.skipped.length) {
    logger.warn(`跳过项 ${colors.yellowBold(results.skipped.length)}`);
    if (cfg.verbose) {
      results.skipped.forEach((s) => logger.warn(` - ${colors.gray(s.path)} ${colors.cyan('→')} ${colors.yellow(s.reason)}`));
    }
  }
  if (results.errors.length) {
    logger.error(`错误 ${colors.redBold(results.errors.length)}`);
    if (cfg.verbose) {
      results.errors.forEach((e) => logger.error(` - ${colors.red(e)}`));
    }
  }
  if (!cfg.dryRun && !verify.ok) {
    process.exitCode = 1;
  }
};

main().catch((e) => {
  const msg = getErrMessage(e);
  logger.error(`执行异常: ${msg}`);
  process.exitCode = 1;
});
