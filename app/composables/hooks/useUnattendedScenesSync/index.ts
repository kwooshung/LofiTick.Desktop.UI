import type { IUnattendedScenesSyncChoice, IUnattendedScenesSyncEntriesBuildArgs, IUnattendedScenesSyncEntry, IUnattendedScenesSyncPayload, TUnattendedScenesSyncStatus } from '@/composables/hooks/useUnattendedScenesSync/index.types';

/**
 * 函数：创建空本地场景副本。
 *
 * # Returns
 *
 * 返回空副本。
 */
export const unattendedScenesLocalStateCreate = (): ISettingsUnattendedScenesLocal => ({
  updatedAt: '',
  items: []
});

/**
 * 函数：规范化场景条目列表。
 *
 * # Arguments
 *
 * * `items` - 原始条目列表。
 *
 * # Returns
 *
 * 返回规范化后的条目列表。
 */
export const unattendedScenesItemsNormalize = (items: unknown): IPageSettingsUnattendedScenesItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const src = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : {};
    const args = Array.isArray(src.args) ? src.args.map((value) => String(value ?? '')) : [];

    return {
      id: String(src.id ?? '').trim(),
      sceneName: String(src.sceneName ?? '').trim(),
      sourceExecPath: String(src.sourceExecPath ?? '').trim(),
      execPath: String(src.execPath ?? '').trim(),
      args,
      enabled: Boolean(src.enabled)
    };
  });
};

/**
 * 函数：规范化本地场景副本。
 *
 * # Arguments
 *
 * * `input` - 原始输入。
 *
 * # Returns
 *
 * 返回规范化后的本地场景副本。
 */
export const unattendedScenesLocalNormalize = (input: unknown): ISettingsUnattendedScenesLocal => {
  const src = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};

  return {
    updatedAt: String(src.updatedAt ?? '').trim(),
    items: unattendedScenesItemsNormalize(src.items)
  };
};

/**
 * 函数：按本地优先合并场景条目。
 *
 * # Arguments
 *
 * * `localItems` - 本地条目。
 * * `remoteItems` - 远程条目。
 *
 * # Returns
 *
 * 返回合并结果。
 */
export const unattendedScenesMergePreferLocal = (localItems: IPageSettingsUnattendedScenesItem[], remoteItems: IPageSettingsUnattendedScenesItem[]): IPageSettingsUnattendedScenesItem[] => {
  const merged = new Map<string, IPageSettingsUnattendedScenesItem>();

  for (const item of remoteItems) {
    const id = String(item?.id ?? '').trim();
    if (!id) {
      continue;
    }
    merged.set(id, item);
  }

  for (const item of localItems) {
    const id = String(item?.id ?? '').trim();
    if (!id) {
      continue;
    }
    merged.set(id, item);
  }

  return Array.from(merged.values());
};

/**
 * 函数：构建场景同步对比条目。
 *
 * # Arguments
 *
 * * `args.local` - 本地场景副本。
 * * `args.remote` - 远程场景配置。
 * * `args.execExistsByPath` - 路径存在性映射。
 *
 * # Returns
 *
 * 返回按重要性排序的对比条目。
 */
export const unattendedScenesSyncEntriesBuild = (args: IUnattendedScenesSyncEntriesBuildArgs): IUnattendedScenesSyncEntry[] => {
  const localItems = unattendedScenesItemsNormalize(args.local.items);
  const remoteItems = unattendedScenesItemsNormalize(args.remote?.items);

  const localMap = new Map(localItems.map((item) => [String(item.id || '').trim(), item]));
  const remoteMap = new Map(remoteItems.map((item) => [String(item.id || '').trim(), item]));
  const ids = Array.from(new Set([...localMap.keys(), ...remoteMap.keys()])).filter((id) => id !== '');

  const statusWeight: Record<TUnattendedScenesSyncStatus, number> = {
    conflict: 0,
    'local-only': 1,
    'remote-only': 2,
    same: 3
  };

  return ids
    .map((id) => {
      const local = localMap.get(id);
      const remote = remoteMap.get(id);

      let status: TUnattendedScenesSyncStatus = 'conflict';
      if (local && remote) {
        status = JSON.stringify(local) === JSON.stringify(remote) ? 'same' : 'conflict';
      } else if (local) {
        status = 'local-only';
      } else {
        status = 'remote-only';
      }

      return {
        sceneId: id,
        sceneName: String(local?.sceneName || remote?.sceneName || '').trim(),
        status,
        local,
        remote,
        localExecExists: local ? Boolean(args.execExistsByPath[String(local.execPath || '').trim()]) : undefined,
        remoteExecExists: remote ? Boolean(args.execExistsByPath[String(remote.execPath || '').trim()]) : undefined
      } satisfies IUnattendedScenesSyncEntry;
    })
    .sort((left, right) => {
      const weight = statusWeight[left.status] - statusWeight[right.status];
      if (weight !== 0) {
        return weight;
      }

      return String(left.sceneName || left.sceneId).localeCompare(String(right.sceneName || right.sceneId), 'zh-CN');
    });
};

let resolveCurrent: ((choice: IUnattendedScenesSyncChoice) => void) | null = null;

/**
 * Hook：无人值守场景同步弹窗。
 *
 * # Returns
 *
 * 返回弹窗状态与控制方法。
 */
export const useUnattendedScenesSyncDialog = () => {
  const stateOpen = useState<boolean>('unattended-scenes-sync-open', () => false);
  const statePayload = useState<IUnattendedScenesSyncPayload | null>('unattended-scenes-sync-payload', () => null);

  /**
   * 函数：请求用户做同步决策。
   *
   * # Arguments
   *
   * * `payload` - 弹窗载荷。
   *
   * # Returns
   *
   * 返回用户最终选择。
   */
  const request = async (payload: IUnattendedScenesSyncPayload): Promise<IUnattendedScenesSyncChoice> => {
    statePayload.value = payload;
    stateOpen.value = true;

    return await new Promise<IUnattendedScenesSyncChoice>((resolve) => {
      resolveCurrent = resolve;
    });
  };

  /**
   * 函数：结束本次弹窗流程。
   *
   * # Arguments
   *
   * * `choice` - 用户选择。
   */
  const settle = (choice: IUnattendedScenesSyncChoice): void => {
    stateOpen.value = false;

    const current = resolveCurrent;
    resolveCurrent = null;
    current?.(choice);
  };

  return {
    stateOpen,
    statePayload,
    request,
    settle
  };
};
