import fs from 'node:fs';
import path from 'node:path';

import { config } from 'dotenv';
import pLimit from 'p-limit';
import upyun from 'upyun';

import { colors, createLogger } from './common/console';

config(); // 加载 .env

const TAG_ENV = process.env.TAG || 'latest';
const COMMON_FOLDER = process.env.UPYUN_COMMON_FOLDER_NAME || 'LofiTick';
console.log('COMMON_FOLDER:', COMMON_FOLDER);
const REMOTE_DIR = `${COMMON_FOLDER}/${TAG_ENV}`;

const LOG_TAG = colors.cyan('[upyun]');
const logger = createLogger('upyun');

const service = new upyun.Service(process.env.UPYUN_ASSETS_SERVICE_NAME!, process.env.UPYUN_ASSETS_USERNAME!, process.env.UPYUN_ASSETS_PASSWORD!);
const client = new upyun.Client(service);

// 并发限制为 60
const limit = pLimit(60);

const uploadFile = async (filePath: string) => {
  const relative = path.relative(path.join(process.cwd(), 'dist', 'public'), filePath).replace(/\\/g, '/');
  const remotePath = `/${REMOTE_DIR}/${relative}`;
  const stream = fs.createReadStream(filePath);
  await client.putFile(remotePath, stream);
  logger.info(`${LOG_TAG} ${colors.green(remotePath)}`);
};

const upload = async () => {
  console.log(`查找路径为：${path.join(process.cwd(), 'dist', 'public')}`);
  console.log(`上传路径为: /${REMOTE_DIR}/`);

  const localDir = path.join(process.cwd(), 'dist', 'public');
  if (!fs.existsSync(localDir)) {
    logger.info(`${LOG_TAG} dist/public 不存在，跳过`);
    return;
  }

  const files = fs.readdirSync(localDir, { recursive: true }) as string[];
  const filePaths = files.map((f) => path.join(localDir, f)).filter((f) => fs.statSync(f).isFile());

  if (filePaths.length === 0) {
    logger.info(`${LOG_TAG} 无文件可上传`);
    return;
  }

  logger.info(`${LOG_TAG} 并行上传 ${filePaths.length} 个文件 → ${colors.yellow(`/${REMOTE_DIR}/`)}`);

  const tasks = filePaths.map((file) => limit(() => uploadFile(file)));
  await Promise.all(tasks);

  logger.ok(`${LOG_TAG} 版本 ${colors.cyan(TAG_ENV)} 上传完成！`);
};

upload().catch((err) => {
  logger.error(`${LOG_TAG} 上传失败: ${err}`);
  process.exit(0);
});
