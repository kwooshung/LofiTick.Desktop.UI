/**
 * 常量：1Panel 默认根域名。
 */
export const ONEPANEL_PANEL_BASE_DEFAULT = 'https://one-panel.lofitick.com/';

/**
 * 常量：1Panel 计划任务页路径。
 */
export const ONEPANEL_CRONJOBS_PATH = '/cronjobs/cronjob';

/**
 * 常量：1Panel 脚本库页路径。
 */
export const ONEPANEL_CRON_LIBRARY_PATH = '/cronjobs/library';

/**
 * 接口：1Panel 导航链接。
 */
export interface IOnepanelLinkEntry {
  /**
   * 链接文案。
   */
  label: string;

  /**
   * 相对路径。
   */
  path: string;
}

/**
 * 接口：1Panel 导航分组。
 */
export interface IOnepanelLinkGroup {
  /**
   * 分组标题。
   */
  title: string;

  /**
   * 分组链接。
   */
  links: IOnepanelLinkEntry[];
}

/**
 * 接口：1Panel 导航栏目。
 */
export interface IOnepanelLinkSection {
  /**
   * 栏目标题。
   */
  title: string;

  /**
   * 栏目说明。
   */
  description?: string;

  /**
   * 分组集合。
   */
  groups: IOnepanelLinkGroup[];
}

/**
 * 常量：1Panel 导航目录。
 */
export const onepanelLinkSections: IOnepanelLinkSection[] = [
  {
    title: '总览',
    groups: [
      {
        title: '入口',
        links: [
          { label: '概览', path: '/' },
          { label: '应用商店', path: '/apps/installed' }
        ]
      }
    ]
  },
  {
    title: '网站',
    groups: [
      {
        title: '站点',
        links: [
          { label: '网站', path: '/websites' },
          { label: '证书', path: '/websites/ssl' }
        ]
      },
      {
        title: '运行环境',
        links: [
          { label: 'PHP', path: '/websites/runtimes/php' },
          { label: 'Java', path: '/websites/runtimes/java' },
          { label: 'Node.js', path: '/websites/runtimes/node' },
          { label: 'Go', path: '/websites/runtimes/go' },
          { label: 'Python', path: '/websites/runtimes/python' },
          { label: '.NET', path: '/websites/runtimes/dotnet' }
        ]
      }
    ]
  },
  {
    title: 'AI',
    groups: [
      {
        title: '智能体',
        links: [
          { label: '智能体', path: '/ai/agents/agent' },
          { label: '模型账号', path: '/ai/agents/model' }
        ]
      },
      {
        title: '本地模型',
        links: [
          { label: 'Ollama', path: '/ai/model/ollama' },
          { label: 'Vllm', path: '/ai/model/vllm' },
          { label: 'Tensorrt', path: '/ai/model/tensorrt' }
        ]
      },
      {
        title: 'MCP',
        links: [{ label: 'Servers', path: '/ai/mcp' }]
      },
      {
        title: 'GPU 监控',
        links: [
          { label: '实时监控', path: '/ai/gpu/current' },
          { label: '历史记录', path: '/ai/gpu/history' }
        ]
      }
    ]
  },
  {
    title: '数据库',
    groups: [
      {
        title: '引擎',
        links: [
          { label: 'MySql', path: '/databases/mysql' },
          { label: 'PostgreSQL', path: '/databases/postgresql' },
          { label: 'Redis', path: '/databases/redis' }
        ]
      }
    ]
  },
  {
    title: '容器',
    groups: [
      {
        title: 'Docker',
        links: [
          { label: '概览', path: '/containers/dashboard' },
          { label: '容器', path: '/containers/container' },
          { label: '编排', path: '/containers/compose' },
          { label: '镜像', path: '/containers/image' },
          { label: '网络', path: '/containers/network' },
          { label: '储存卷', path: '/containers/volume' },
          { label: '仓库', path: '/containers/repo' },
          { label: '编排模板', path: '/containers/template' },
          { label: '配置', path: '/containers/setting' }
        ]
      }
    ]
  },
  {
    title: '系统',
    groups: [
      {
        title: '主机',
        links: [
          { label: '文件', path: '/hosts/files' },
          { label: '磁盘管理', path: '/hosts/disk' }
        ]
      },
      {
        title: '监控',
        links: [
          { label: '监控', path: '/hosts/monitor/monitor' },
          { label: '设置', path: '/hosts/monitor/setting' }
        ]
      },
      {
        title: '防火墙',
        links: [
          { label: '端口规则', path: '/hosts/firewall/port' },
          { label: '端口转发', path: '/hosts/firewall/forward' },
          { label: 'IP 规则', path: '/hosts/firewall/ip' },
          { label: 'iptables 高级控制', path: '/hosts/firewall/advance' }
        ]
      },
      {
        title: '进程管理',
        links: [
          { label: '进程', path: '/hosts/process/process' },
          { label: '网络', path: '/hosts/process/network' }
        ]
      },
      {
        title: 'SSH 管理',
        links: [
          { label: '配置', path: '/hosts/ssh/ssh' },
          { label: '会话', path: '/hosts/ssh/session' },
          { label: '登录日志', path: '/hosts/ssh/log' }
        ]
      }
    ]
  },
  {
    title: '终端',
    groups: [
      {
        title: '终端',
        links: [
          { label: '终端', path: '/terminal' },
          { label: '主机', path: '/terminal' },
          { label: '快速命令', path: '/terminal' },
          { label: '配置', path: '/terminal' }
        ]
      }
    ]
  },
  {
    title: '计划任务',
    groups: [
      {
        title: '计划任务',
        links: [
          { label: '计划任务', path: ONEPANEL_CRONJOBS_PATH },
          { label: '脚本库', path: ONEPANEL_CRON_LIBRARY_PATH }
        ]
      }
    ]
  },
  {
    title: '工具箱',
    groups: [
      {
        title: '工具箱',
        links: [
          { label: '快速设置', path: '/toolbox/device' },
          { label: '缓存清理', path: '/toolbox/clean' },
          { label: '进程守护', path: '/toolbox/supervisor' },
          { label: '病毒扫描', path: '/toolbox/clam' },
          { label: 'FTP', path: '/toolbox/ftp' },
          { label: 'Fail2ban', path: '/toolbox/fail2ban' }
        ]
      }
    ]
  },
  {
    title: '高级功能',
    groups: [
      {
        title: '高级功能',
        links: [
          { label: 'APP', path: '/xpack/app' },
          { label: '网站防篡改', path: '/xpack/tamper' },
          { label: '文件对传', path: '/xpack/exchange/file' },
          { label: '界面设置', path: '/xpack/setting' }
        ]
      },
      {
        title: 'WAF',
        links: [
          { label: '概览', path: '/xpack/waf/dashboard' },
          { label: '黑白名单', path: '/xpack/waf/blackwhite' },
          { label: '网站设置', path: '/xpack/waf/websites' },
          { label: '全局设置', path: '/xpack/waf/global' }
        ]
      },
      {
        title: '多机管理',
        links: [
          { label: '概览', path: '/xpack/node/dashboard' },
          { label: '节点管理', path: '/xpack/node' },
          { label: '面板管理', path: '/xpack/simple-node' }
        ]
      },
      {
        title: '网站监测',
        links: [{ label: '概览', path: '/xpack/monitor/dashboard' }]
      },
      {
        title: '应用高可用',
        links: [
          { label: 'MySQL', path: '/xpack/cluster/mysql' },
          { label: 'PostgresSQL', path: '/xpack/cluster/postgres' },
          { label: 'Redis', path: '/xpack/cluster/redis' }
        ]
      }
    ]
  },
  {
    title: '日志审计',
    groups: [
      {
        title: '日志',
        links: [
          { label: '面板日志', path: '/logs/operation' },
          { label: '登录日志', path: '/logs/ssh' },
          { label: '网站日志', path: '/logs/website' }
        ]
      }
    ]
  },
  {
    title: '面板设置',
    groups: [
      {
        title: '设置',
        links: [
          { label: '面板', path: '/settings/panel' },
          { label: '安全', path: '/settings/safe' },
          { label: '告警通知', path: '/settings/alert' },
          { label: '备份账号', path: '/settings/backupaccount' },
          { label: '快照', path: '/settings/snapshot' },
          { label: '许可证', path: '/settings/license' },
          { label: '关于', path: '/settings/about' }
        ]
      }
    ]
  }
];

/**
 * 函数：归一化 1Panel 根域名。
 *
 * 当输入为空或非法时，回落默认根域名，并统一保留结尾斜杠。
 *
 * @param {string} value 原始输入值
 * @return {string} 归一化后的 1Panel 根域名
 */
export const onepanelPanelBaseNormalize = (value: string): string => {
  const raw = String(value || '').trim();
  const fallback = new URL(ONEPANEL_PANEL_BASE_DEFAULT).toString();

  if (!raw) {
    return fallback;
  }

  try {
    const normalized = new URL(raw).toString();
    return normalized.endsWith('/') ? normalized : `${normalized}/`;
  } catch {
    return fallback;
  }
};

/**
 * 函数：拼接 1Panel 页面地址。
 *
 * @param {string} panelBase 1Panel 根域名
 * @param {string} path 目标路径
 * @return {string} 完整地址
 */
export const onepanelLinkBuild = (panelBase: string, path: string): string => {
  const base = onepanelPanelBaseNormalize(panelBase);
  return new URL(path.replace(/^\//, ''), base).toString();
};
