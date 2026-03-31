import fs from 'node:fs';
import path from 'node:path';

import { config } from 'dotenv';
import yaml from 'yaml';

import { colors, createLogger } from './common/console';

/**
 * 接口：Docker Compose 服务定义
 */
interface IDockerComposeService {
  image?: string;
  container_name?: string;
  restart?: string;
  ports?: string[];
  environment?: string[] | Record<string, string>;
  [key: string]: unknown;
}

/**
 * 接口：Docker Compose 文件定义
 */
interface IDockerCompose {
  version: string;
  services: Record<string, IDockerComposeService>;
}

// ================= 配置区（请根据你的项目修改）=================
const PROJECT_ROOT = process.cwd();
const ENV_FILE = '.env';
const COMPOSE_FILE = 'docker-compose.yml';
const SERVICE_NAME = 'nuxt';
const IMAGE_NAME = 'kwooshung/lofitick-desktop-frontend';
// =================================================================

const TAG = colors.cyan('[sync-env-to-compose]');
const logger = createLogger('sync-env-to-compose');

/**
 * 函数：同步生产环境变量到 docker-compose.yml
 */
const syncEnvToCompose = async () => {
  const envPath = path.join(PROJECT_ROOT, ENV_FILE);
  const composePath = path.join(PROJECT_ROOT, COMPOSE_FILE);

  if (!fs.existsSync(envPath)) {
    logger.error(`${TAG} 错误: 未找到 ${colors.yellow(ENV_FILE)} 文件！`);
    process.exit(0);
  }

  const envResult = config({ path: envPath });
  if (envResult.error) {
    logger.error(`${TAG} 读取 .env 文件失败: ${envResult.error.message || String(envResult.error)}`);
    process.exit(0);
  }

  const prodEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(envResult.parsed || {})) {
    if (key.startsWith('DEV_')) {
      continue;
    }
    if (value === undefined || value === null || value === '') {
      continue;
    }
    prodEnv[key] = String(value);
  }

  let composeObj: IDockerCompose = { version: '3.8', services: {} };

  if (fs.existsSync(composePath)) {
    const content = fs.readFileSync(composePath, 'utf-8');
    try {
      composeObj = yaml.parse(content);
    } catch (e) {
      logger.error(`${TAG} 解析 ${colors.yellow('docker-compose.yml')} 失败: ${e instanceof Error ? e.message : String(e)}`);
      process.exit(0);
    }
    logger.info(`${TAG} ${colors.yellow(COMPOSE_FILE)} 已存在，正在更新...`);
  } else {
    logger.info(`${TAG} ${colors.yellow(COMPOSE_FILE)} 不存在，将创建新文件...`);
  }

  if (!composeObj.services) {
    composeObj.services = {};
  }
  if (!composeObj.services[SERVICE_NAME]) {
    composeObj.services[SERVICE_NAME] = {};
  }
  const service = composeObj.services[SERVICE_NAME];

  const currentEnv = service.environment || {};
  const envObj: Record<string, string> = {};

  if (Array.isArray(currentEnv)) {
    currentEnv.forEach((item) => {
      const [k, ...v] = item.split('=');
      if (k) {
        envObj[k] = v.join('=');
      }
    });
  } else if (typeof currentEnv === 'object') {
    Object.assign(envObj, currentEnv);
  }

  Object.assign(envObj, prodEnv);

  service.environment = Object.entries(envObj).map(([k, v]) => `${k}=${v}`);

  if (!service.image) {
    service.image = IMAGE_NAME;
  }
  if (!service.container_name) {
    service.container_name = 'lofitick-desktop-frontend';
  }
  if (!service.restart) {
    service.restart = 'always';
  }
  if (!service.ports) {
    service.ports = ['3000:3000'];
  }

  const newContent = yaml.stringify(composeObj);
  fs.writeFileSync(composePath, newContent, 'utf-8');

  logger.ok(`${TAG} 成功！${colors.yellow(COMPOSE_FILE)} 已更新`);
  logger.info(`${TAG} → 同步了 ${colors.green(String(Object.keys(prodEnv).length))} 个生产环境变量`);
  logger.info(`${TAG} → 服务名: ${colors.cyan(SERVICE_NAME)}`);
  logger.info(`${TAG} → 镜像: ${colors.cyan(service.image)}`);
};

syncEnvToCompose().catch((err) => {
  logger.error(`${TAG} 脚本执行失败: ${err instanceof Error ? err.stack || err.message : String(err)}`);
  process.exit(0);
});
