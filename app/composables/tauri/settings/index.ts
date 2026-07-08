import { invoke } from '@tauri-apps/api/core';

/**
 * Hook：Tauri 设置
 * 描述：封装 Desktop 壳侧的 settings_get/settings_update。
 * @returns {object} 设置方法
 */

/**
 * 接口：本地路径存在性检查结果
 */
interface ITauriSettingsPathExistsItem {
  /**
   * 路径
   */
  path: string;

  /**
   * 是否存在
   */
  exists: boolean;
}

/**
 * 接口：场景受管副本结果
 */
interface ITauriManagedSceneExeResult {
  /**
   * 原始可执行文件路径
   */
  sourceExecPath: string;

  /**
   * 受管副本运行路径
   */
  execPath: string;
}

/**
 * 接口：热搜播客固定开头音乐路径。
 */
interface ITauriHotsearchPodcastHeadMusicPaths {
  /**
   * 附件根目录。
   */
  attachmentsDir: string;

  /**
   * 固定目录路径。
   */
  directoryPath: string;

  /**
   * 普通版固定文件路径。
   */
  normalPath: string;

  /**
   * VIP 版固定文件路径。
   */
  vipPath: string;
}

/**
 * 接口：热搜广告素材本地路径结果。
 */
interface ITauriHotsearchAdAssetPathResult {
  /** 附件根目录。 */
  attachmentsDir: string;

  /** 相对文件键。 */
  relativePath: string;

  /** 绝对文件路径。 */
  filePath: string;
}

/**
 * 接口：爬虫浏览器资料目录信息。
 */
interface ITauriCrawlerBrowserProfilesDirInfo {
  /** 当前生效路径。 */
  directoryPath: string;

  /** 目录是否存在。 */
  exists: boolean;
}

/**
 * 接口：爬虫浏览器资料目录体积。
 */
interface ITauriCrawlerBrowserProfilesDirSizeInfo {
  /** 目录占用字节数。 */
  sizeBytes: number;
}

/**
 * 接口：爬虫浏览器站点目录信息。
 */
interface ITauriCrawlerBrowserSiteDirInfo {
  /** 当前生效路径。 */
  directoryPath: string;

  /** 目录是否存在。 */
  exists: boolean;
}

/**
 * 类型：爬虫浏览器资料目录范围。
 */
type TCrawlerBrowserProfilesDirScope = 'root' | 'edge' | 'chrome' | 'chromium';

/**
 * 类型：爬虫浏览器站点目录浏览器范围。
 */
type TCrawlerBrowserSiteDirBrowser = 'edge' | 'chrome' | 'chromium';

export const useTauriSettings = () => {
  /**
   * 函数：获取完整设置
   * @returns {Promise<Record<string, unknown>>} 设置 JSON
   */
  const get = async (): Promise<Record<string, unknown>> => {
    /**
     * 常量：v。
     */
    const v = await invoke<unknown>('settings_get');
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }

    return {};
  };

  /**
   * 函数：更新设置（深合并）
   * @param {Record<string, unknown>} patch 部分更新补丁
   * @returns {Promise<Record<string, unknown>>} 更新后的完整设置
   */
  const update = async (patch: Record<string, unknown>): Promise<Record<string, unknown>> => {
    /**
     * 常量：v。
     */
    const v = await invoke<unknown>('settings_update', { patch });
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }

    return {};
  };

  /**
   * 函数：选择并设置数据存放目录（attachmentsDir）
   * @param {string} title 对话框标题
   * @param {string} current 当前目录
   * @returns {Promise<string | null>} 选择结果
   */
  const setAttachmentsDir = async (title: string, current: string): Promise<string | null> => {
    return invoke<string | null>('settings_set_attachments_dir', { title, current });
  };

  /**
   * 函数：获取爬虫浏览器资料目录信息。
   * @returns {Promise<ITauriCrawlerBrowserProfilesDirInfo>} 目录信息。
   */
  const crawlerBrowserProfilesDirGet = async (): Promise<ITauriCrawlerBrowserProfilesDirInfo> => {
    return invoke<ITauriCrawlerBrowserProfilesDirInfo>('settings_crawler_browser_profiles_dir_get');
  };

  /**
   * 函数：获取爬虫浏览器资料目录占用体积。
   * @param {TCrawlerBrowserProfilesDirScope} scope 目录范围。
   * @returns {Promise<number>} 目录占用字节数。
   */
  const crawlerBrowserProfilesDirSizeGet = async (scope: TCrawlerBrowserProfilesDirScope): Promise<number> => {
    const result = await invoke<ITauriCrawlerBrowserProfilesDirSizeInfo>('settings_crawler_browser_profiles_dir_size_get', { scope });
    return result.sizeBytes;
  };

  /**
   * 函数：清空爬虫浏览器资料目录缓存。
   * @param {TCrawlerBrowserProfilesDirScope} scope 目录范围。
   * @returns {Promise<void>} 无返回值。
   */
  const crawlerBrowserProfilesDirClear = async (scope: TCrawlerBrowserProfilesDirScope): Promise<void> => {
    await invoke('settings_crawler_browser_profiles_dir_clear', { scope });
  };

  /**
   * 函数：获取爬虫浏览器站点 profile 目录信息。
   * @param {TCrawlerBrowserSiteDirBrowser} browser 浏览器范围。
   * @param {string} site 站点域名。
   * @returns {Promise<ITauriCrawlerBrowserSiteDirInfo>} 目录信息。
   */
  const crawlerBrowserProfileDirGet = async (browser: TCrawlerBrowserSiteDirBrowser, site: string): Promise<ITauriCrawlerBrowserSiteDirInfo> => {
    return invoke<ITauriCrawlerBrowserSiteDirInfo>('settings_crawler_browser_profile_dir_get', { browser, site });
  };

  /**
   * 函数：获取爬虫浏览器站点 profile 目录占用体积。
   * @param {TCrawlerBrowserSiteDirBrowser} browser 浏览器范围。
   * @param {string} site 站点域名。
   * @returns {Promise<number>} 目录占用字节数。
   */
  const crawlerBrowserProfileDirSizeGet = async (browser: TCrawlerBrowserSiteDirBrowser, site: string): Promise<number> => {
    const result = await invoke<ITauriCrawlerBrowserProfilesDirSizeInfo>('settings_crawler_browser_profile_dir_size_get', { browser, site });
    return result.sizeBytes;
  };

  /**
   * 函数：清空爬虫浏览器站点 profile 目录。
   * @param {TCrawlerBrowserSiteDirBrowser} browser 浏览器范围。
   * @param {string} site 站点域名。
   * @returns {Promise<void>} 无返回值。
   */
  const crawlerBrowserProfileDirClear = async (browser: TCrawlerBrowserSiteDirBrowser, site: string): Promise<void> => {
    await invoke('settings_crawler_browser_profile_dir_clear', { browser, site });
  };

  /**
   * 函数：获取爬虫浏览器站点匹配记录目录信息。
   * @param {TCrawlerBrowserSiteDirBrowser} browser 浏览器范围。
   * @param {string} site 站点域名。
   * @returns {Promise<ITauriCrawlerBrowserSiteDirInfo>} 目录信息。
   */
  const crawlerBrowserMatchesDirGet = async (browser: TCrawlerBrowserSiteDirBrowser, site: string): Promise<ITauriCrawlerBrowserSiteDirInfo> => {
    return invoke<ITauriCrawlerBrowserSiteDirInfo>('settings_crawler_browser_matches_dir_get', { browser, site });
  };

  /**
   * 函数：获取爬虫浏览器站点匹配记录目录占用体积。
   * @param {TCrawlerBrowserSiteDirBrowser} browser 浏览器范围。
   * @param {string} site 站点域名。
   * @returns {Promise<number>} 目录占用字节数。
   */
  const crawlerBrowserMatchesDirSizeGet = async (browser: TCrawlerBrowserSiteDirBrowser, site: string): Promise<number> => {
    const result = await invoke<ITauriCrawlerBrowserProfilesDirSizeInfo>('settings_crawler_browser_matches_dir_size_get', { browser, site });
    return result.sizeBytes;
  };

  /**
   * 函数：清空爬虫浏览器站点匹配记录目录。
   * @param {TCrawlerBrowserSiteDirBrowser} browser 浏览器范围。
   * @param {string} site 站点域名。
   * @returns {Promise<void>} 无返回值。
   */
  const crawlerBrowserMatchesDirClear = async (browser: TCrawlerBrowserSiteDirBrowser, site: string): Promise<void> => {
    await invoke('settings_crawler_browser_matches_dir_clear', { browser, site });
  };

  /**
   * 函数：获取热搜播客固定开头音乐路径。
   * @returns {Promise<ITauriHotsearchPodcastHeadMusicPaths>} 固定路径信息
   */
  const hotsearchPodcastHeadMusicPathsGet = async (): Promise<ITauriHotsearchPodcastHeadMusicPaths> => {
    return invoke<ITauriHotsearchPodcastHeadMusicPaths>('settings_hotsearch_podcast_head_music_paths_get');
  };

  /**
   * 函数：写入热搜播客固定开头音乐文件。
   * @param {'normal' | 'vip'} kind 文件类型
   * @param {number[]} bytes MP3 字节数组
   * @returns {Promise<string>} 固定文件路径
   */
  const hotsearchPodcastHeadMusicWrite = async (kind: 'normal' | 'vip', bytes: number[]): Promise<string> => {
    return invoke<string>('settings_hotsearch_podcast_head_music_write', { kind, bytes });
  };

  /**
   * 函数：下载热搜播客固定开头音乐并写入固定文件。
   * @param {'normal' | 'vip'} kind 文件类型
   * @param {string} url 已签名下载地址
   * @returns {Promise<string>} 固定文件路径
   */
  const hotsearchPodcastHeadMusicDownload = async (kind: 'normal' | 'vip', url: string): Promise<string> => {
    return invoke<string>('settings_hotsearch_podcast_head_music_download', { kind, url });
  };

  /**
   * 函数：写入热搜广告素材到附件目录。
   * @param {string} relativePath 相对文件键。
   * @param {number[]} bytes 文件字节。
   * @returns {Promise<ITauriHotsearchAdAssetPathResult>} 本地路径结果。
   */
  const hotsearchAdAssetWrite = async (relativePath: string, bytes: number[]): Promise<ITauriHotsearchAdAssetPathResult> => {
    return invoke<ITauriHotsearchAdAssetPathResult>('settings_hotsearch_ad_asset_write', { relativePath, bytes });
  };

  /**
   * 函数：在本地缺失时下载热搜广告素材。
   * @param {string} relativePath 相对文件键。
   * @param {string} url 已签名下载地址。
   * @returns {Promise<ITauriHotsearchAdAssetPathResult>} 本地路径结果。
   */
  const hotsearchAdAssetEnsureDownloaded = async (relativePath: string, url: string): Promise<ITauriHotsearchAdAssetPathResult> => {
    return invoke<ITauriHotsearchAdAssetPathResult>('settings_hotsearch_ad_asset_ensure_downloaded', { relativePath, url });
  };

  /**
   * 函数：删除热搜广告素材本地缓存，并回收空目录。
   * @param {string} relativePath 相对文件键。
   * @returns {Promise<void>} 无返回值。
   */
  const hotsearchAdAssetDelete = async (relativePath: string): Promise<void> => {
    await invoke('settings_hotsearch_ad_asset_delete', { relativePath });
  };

  /**
   * 函数：获取本机网络快照
   * @returns {Promise<{ interfaces: Array<{ name: string; ips: string[] }> }>} 网络信息
   */
  const machineNetworkGet = async (): Promise<{ interfaces: Array<{ name: string; ips: string[] }> }> => {
    return invoke<{ interfaces: Array<{ name: string; ips: string[] }> }>('settings_machine_network_get');
  };

  /**
   * 函数：获取本机默认计算机名称
   * @returns {Promise<string>} 计算机名称（失败或不可用时为空字符串）
   */
  const machineHostnameGet = async (): Promise<string> => {
    return invoke<string>('settings_machine_hostname_get');
  };

  /**
   * 函数：批量检查本地路径是否存在
   * @param {string[]} paths 路径列表
   * @returns {Promise<ITauriSettingsPathExistsItem[]>} 检查结果
   */
  const pathsExistGet = async (paths: string[]): Promise<ITauriSettingsPathExistsItem[]> => {
    return invoke<ITauriSettingsPathExistsItem[]>('settings_paths_exist', { paths });
  };

  /**
   * 函数：创建或修复场景受管副本 exe
   * @param {string} sceneId 场景 ID
   * @param {string} sceneName 场景名称
   * @param {string} sourceExecPath 原始 exe 路径
   * @returns {Promise<ITauriManagedSceneExeResult>} 原始路径与受管副本路径
   */
  const sceneManagedExeMaterialize = async (sceneId: string, sceneName: string, sourceExecPath: string): Promise<ITauriManagedSceneExeResult> => {
    return invoke<ITauriManagedSceneExeResult>('settings_scene_managed_exe_materialize', { sceneId, sceneName, sourceExecPath });
  };

  /**
   * 函数：删除场景受管副本 exe
   * @param {string} execPath 受管副本路径
   * @param {string} sourceExecPath 原始 exe 路径
   * @returns {Promise<void>} 无返回值
   */
  const sceneManagedExeRemove = async (execPath: string, sourceExecPath: string): Promise<void> => {
    await invoke('settings_scene_managed_exe_remove', { execPath, sourceExecPath });
  };

  /**
   * 函数：获取 UE5 本地接入地址
   * @returns {Promise<string>} UE5 接入地址
   */
  const ue5BridgeAccessUrlGet = async (): Promise<string> => {
    return invoke<string>('ue5_bridge_access_url_get');
  };

  /**
   * 函数：获取 UE5 本地接入详情
   * @returns {Promise<IPageSettingsUnattendedUe5BridgeDetail>} UE5 接入详情
   */
  const ue5BridgeAccessDetailGet = async (): Promise<IPageSettingsUnattendedUe5BridgeDetail> => {
    return invoke<IPageSettingsUnattendedUe5BridgeDetail>('ue5_bridge_access_detail_get');
  };

  return {
    get,
    update,
    setAttachmentsDir,
    crawlerBrowserProfilesDirGet,
    crawlerBrowserProfilesDirSizeGet,
    crawlerBrowserProfilesDirClear,
    crawlerBrowserProfileDirGet,
    crawlerBrowserProfileDirSizeGet,
    crawlerBrowserProfileDirClear,
    crawlerBrowserMatchesDirGet,
    crawlerBrowserMatchesDirSizeGet,
    crawlerBrowserMatchesDirClear,
    hotsearchPodcastHeadMusicPathsGet,
    hotsearchPodcastHeadMusicWrite,
    hotsearchPodcastHeadMusicDownload,
    hotsearchAdAssetWrite,
    hotsearchAdAssetEnsureDownloaded,
    hotsearchAdAssetDelete,
    machineNetworkGet,
    machineHostnameGet,
    pathsExistGet,
    sceneManagedExeMaterialize,
    sceneManagedExeRemove,
    ue5BridgeAccessUrlGet,
    ue5BridgeAccessDetailGet
  };
};
