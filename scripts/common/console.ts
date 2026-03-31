import chalk from 'chalk';
import { MultiBar, Presets } from 'cli-progress';
import ora from 'ora';

/**
 * 对象：统一颜色输出（基于 chalk）
 */
export const colors = {
  /**
   * 函数：红色
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  red: (s: string | number): string => chalk.red(String(s)),

  /**
   * 函数：绿色
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  green: (s: string | number): string => chalk.green(String(s)),

  /**
   * 函数：黄色
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  yellow: (s: string | number): string => chalk.yellow(String(s)),

  /**
   * 函数：青色（浅蓝色）
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  cyan: (s: string | number): string => chalk.cyan(String(s)),

  /**
   * 函数：蓝色
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  blue: (s: string | number): string => chalk.blue(String(s)),

  /**
   * 函数：洋红色（品红色）
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  magenta: (s: string | number): string => chalk.magenta(String(s)),

  /**
   * 函数：灰色（暗淡）
   * @param { string | number } s 输入字符串
   * @returns { string } 带颜色的字符串
   */
  gray: (s: string | number): string => chalk.gray(String(s)),

  /**
   * 函数：加粗
   * @param { string | number } s 输入字符串
   * @returns { string } 加粗后的字符串
   */
  bold: (s: string | number): string => chalk.bold(String(s)),

  /**
   * 函数：绿色加粗
   * @param { string | number } s 输入字符串
   * @returns { string } 绿色加粗后的字符串
   */
  greenBold: (s: string | number): string => chalk.bold(chalk.green(String(s))),

  /**
   * 函数：黄色加粗
   * @param { string | number } s 输入字符串
   * @returns { string } 黄色加粗后的字符串
   */
  yellowBold: (s: string | number): string => chalk.bold(chalk.yellow(String(s))),

  /**
   * 函数：红色加粗
   * @param { string | number } s 输入字符串
   * @returns { string } 红色加粗后的字符串
   */
  redBold: (s: string | number): string => chalk.bold(chalk.red(String(s))),

  /**
   * 函数：青色加粗（浅蓝色加粗）
   * @param { string | number } s 输入字符串
   * @returns { string } 青色加粗后的字符串
   */
  cyanBold: (s: string | number): string => chalk.bold(chalk.cyan(String(s))),

  /**
   * 函数：蓝色加粗
   * @param { string | number } s 输入字符串
   * @returns { string } 蓝色加粗后的字符串
   */
  blueBold: (s: string | number): string => chalk.bold(chalk.blue(String(s))),

  /**
   * 函数：洋红色加粗（品红色加粗）
   * @param { string | number } s 输入字符串
   * @returns { string } 洋红色加粗后的字符串
   */
  magentaBold: (s: string | number): string => chalk.bold(chalk.magenta(String(s))),

  /**
   * 函数：灰色加粗（暗淡加粗）
   * @param { string | number } s 输入字符串
   * @returns { string } 灰色加粗后的字符串
   */
  grayBold: (s: string | number): string => chalk.bold(chalk.gray(String(s)))
} as const;

/**
 * 类型：日志工具
 */
export type TLogger = {
  /**
   * 函数：信息
   * @param { string | number } m 日志文本
   * @returns { void } 无返回值
   */
  info: (m: string | number) => void;

  /**
   * 函数：成功
   * @param { string | number } m 日志文本
   * @returns { void } 无返回值
   */
  ok: (m: string | number) => void;

  /**
   * 函数：警告
   * @param { string | number } m 日志文本
   * @returns { void } 无返回值
   */
  warn: (m: string | number) => void;

  /**
   * 函数：错误
   * @param { string | number } m 日志文本
   * @returns { void } 无返回值
   */
  error: (m: string | number) => void;
};

/**
 * 函数：创建日志器（统一格式：图标 + TAG + 文本）
 * @param { string | number } label 标签文本（例如 "[seed]"）
 * @returns { TLogger } 日志工具实例
 */
export const createLogger = (label: string | number): TLogger => {
  /**
   * 常量：标签（灰色显示）
   */
  const TAG = colors.gray(label);

  return {
    info: (m: string | number) => console.log(`${colors.cyan('ℹ')} ${TAG} ${m}`),
    ok: (m: string | number) => console.log(`${colors.green('✔')} ${TAG} ${colors.green(m)}`),
    warn: (m: string | number) => console.warn(`${colors.yellow('⚠')} ${TAG} ${colors.yellow(m)}`),
    error: (m: string | number) => console.error(`${colors.red('✖')} ${TAG} ${colors.red(m)}`)
  };
};

/**
 * 类型：Spinner 控制器
 */
export type TSpinner = {
  /**
   * 函数：开始旋转动画
   * @returns { void } 无返回值
   */
  start: () => void;
  /**
   * 函数：更新文本
   * @param { string } msg 文本内容
   * @returns { void } 无返回值
   */
  text: (msg: string) => void;
  /**
   * 函数：成功结束
   * @param { string } msg 成功文本
   * @returns { void } 无返回值
   */
  succeed: (msg: string) => void;
  /**
   * 函数：失败结束
   * @param { string } msg 失败文本
   * @returns { void } 无返回值
   */
  fail: (msg: string) => void;
  /**
   * 函数：警告结束
   * @param { string } msg 警告文本
   * @returns { void } 无返回值
   */
  warn: (msg: string) => void;
};

/**
 * 函数：创建 Spinner（基于 ora）
 * @param { string } label 初始标签文本
 * @returns { TSpinner } Spinner 控制器
 */
export const createSpinner = (label: string): TSpinner => {
  const s = ora({ text: label });
  return {
    start: () => s.start(),
    text: (msg: string) => {
      s.text = msg;
    },
    succeed: (msg: string) => s.succeed(msg),
    fail: (msg: string) => s.fail(msg),
    warn: (msg: string) => s.warn(msg)
  };
};

/**
 * 类型：进度条控制器
 */
export type TProgress = {
  /**
   * 函数：更新当前值
   * @param { number } n 当前已处理数量
   * @returns { void } 无返回值
   */
  update: (n: number) => void;
  /**
   * 函数：增加已处理数量
   * @param { number } k 增量
   * @returns { void } 无返回值
   */
  increment: (k?: number) => void;
  /**
   * 函数：设置总量
   * @param { number } t 总量
   * @returns { void } 无返回值
   */
  setTotal: (t: number) => void;
  /**
   * 函数：停止并清理进度条
   * @returns { void } 无返回值
   */
  stop: () => void;
};

/**
 * 函数：创建单进度条
 * @param { number } total 总量（可为 0，表示未知）
 * @param { string } label 标签文本
 * @returns { TProgress } 进度条控制器
 */
export const createProgress = (total: number, label: string): TProgress => {
  const multibar = new MultiBar({ clearOnComplete: true, hideCursor: true }, Presets.shades_classic);
  const bar = multibar.create(Math.max(1, total || 1), 0, { label });
  return {
    update: (n: number) => bar.update(Math.min(Math.max(0, n), bar.getTotal())),
    increment: (k = 1) => bar.increment(k),
    setTotal: (t: number) => bar.setTotal(Math.max(1, t || 1)),
    stop: () => {
      try {
        bar.stop();
      } catch {
        /* ignore */
      }
      try {
        multibar.stop();
      } catch {
        /* ignore */
      }
    }
  };
};

/**
 * 函数：阶段标题（统一样式）
 * @param { string } title 标题文本
 * @returns { void } 无返回值
 */
export const section = (title: string): void => {
  console.log(colors.cyanBold(`⟫ ${title}`));
};

/**
 * 函数：子阶段标题（统一样式）
 * @param { string } title 标题文本
 * @returns { void } 无返回值
 */
export const subsection = (title: string): void => {
  console.log(colors.grayBold(`› ${title}`));
};

/**
 * 函数：输出统一摘要
 * @param { { success:number; fail:number; durationMs:number } } stats 统计对象
 * @returns { void } 无返回值
 */
export const summary = (stats: { success: number; fail: number; durationMs: number }): void => {
  console.log(`${colors.green('✔')} 成功：${colors.green(stats.success)}  ${colors.red('✖')} 失败：${colors.red(stats.fail)}  ⏱ 用时：${colors.cyan(`${stats.durationMs}ms`)}`);
};
