<template>
  <div v-if="disabled" ref="refRootEl" class="group pointer-events-none size-39.5 rounded-lg opacity-60 outline-none select-none" :class="cursorPointer ? 'cursor-pointer' : 'cursor-default'">
    <div class="relative w-full">
      <div class="pointer-events-none absolute inset-0 rounded-md" />
      <div class="relative z-10 flex flex-col items-center gap-4 p-4">
        <FolderIcon :bg-color="bgColor" :fg-color="fgColor" :icon-name="iconName" />
        <div class="mt-1 w-full px-1 text-center">
          <div class="line-clamp-2 text-[13px] leading-5 wrap-break-word">
            {{ label }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <UContextMenu v-bind="contextMenuProps" :disabled="computedNotMenu" @select="handleMenuSelect">
    <div
      ref="refRootEl"
      class="group size-39.5 rounded-lg outline-none select-none"
      :class="[disabled ? 'pointer-events-none opacity-60' : cursorPointer || to ? 'cursor-pointer' : 'cursor-default']"
      :aria-selected="computedIsSelected"
      role="option"
      tabindex="0"
      @click.stop="onClick"
      @keydown.stop="handleKeydown"
      @pointerdown.stop="onPointerDown"
      @pointerup.stop="onPointerUp"
      @pointermove.passive="throttledPointerMove"
    >
      <div class="relative w-full">
        <div class="pointer-events-none absolute inset-0 rounded-md transition-colors" :class="[computedIsSelected ? 'bg-primary-100/60 dark:bg-primary-900/30 ring-primary-400/60 ring-1 ring-inset' : 'group-hover:bg-neutral-100/60 dark:group-hover:bg-neutral-800/60']" />

        <div class="relative z-10 flex flex-col items-center gap-4 p-4">
          <FolderIcon :bg-color="bgColor" :fg-color="fgColor" :icon-name="iconName" />

          <div class="mt-1 w-full px-1 text-center">
            <div v-if="!stateIsRenaming" ref="refLabelEl" class="line-clamp-2 text-[13px] leading-5 wrap-break-word">
              {{ displayLabel }}
            </div>
            <div v-else ref="refRelabelWrapEl" class="w-full">
              <UInput :model-value="stateDraftLabel" variant="ghost" @update:model-value="handleRelabelInputUpdate" @keyup.prevent="handleRelabelInputKeyup" @blur="handleInputBlur" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui';
import { useThrottleFn } from '@vueuse/core';

import type { IFolderEmits, IFolderProps } from '@/components/folder/index.types';

/**
 * 属性
 */
const {
  label,
  to,
  defaultLabel,
  bgColor = 'bg-primary-500',
  fgColor = 'bg-primary-400',
  selected,
  selectable = true,
  unselectOnOutside = true,
  dblclickDelay = 250,
  clickMoveTolerance = 4,
  relabel = false,
  relabelOnSecondClick = true,
  relabelDelay = 30,
  relabelOnly = false,
  contextMenuProps,
  disabled = false,
  cursorPointer = false,
  iconName
} = defineProps<IFolderProps>();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 事件
 */
const emit = defineEmits<IFolderEmits>();

/**
 * 变量：双击时间戳与上次点击位置
 */
let lastClickTime = 0;

/**
 * 变量：上次点击位置（用于区分拖拽与点击）
 */
let lastClickPos = { x: 0, y: 0 };

/**
 * 变量：指针移动，起始位置与是否超出容差（用于区分拖拽与点击）
 */
let pointerDownPos = { x: 0, y: 0 };

/**
 * 变量：指针移动是否超出容差（用于区分拖拽与点击）
 */
let movedBeyondTolerance = false;

/**
 * 变量：抑制下一次单击触发重命名（用于处理 blur/click 竞争与拖拽释放）
 */
let suppressNextClickRelabel = false;

/**
 * 变量：输入框 blur 延迟取消标记与计时器句柄（避免与根节点 click 冲突）
 */
let pendingBlurClose = false;

/**
 * 变量：离开输入框后延迟取消重命名的计时器句柄
 */
const { start: startBlurCloseTimer, stop: stopBlurCloseTimer } = useTimeoutFn(
  () => {
    if (pendingBlurClose) {
      cancelRelabel();
      suppressNextClickRelabel = true;
    }
    pendingBlurClose = false;
  },
  0,
  { immediate: false }
);

/**
 * 引用：根元素与重命名输入框元素引用
 */
const stateRefRootEl = ref<HTMLElement | null>(null);

/**
 * 引用：重命名输入框外层元素引用
 */
const stateRefRelabelWrapEl = ref<HTMLElement | null>(null);

/**
 * 引用：名称元素引用
 */
const stateRefLabelEl = ref<HTMLElement | null>(null);

/**
 * 状态：内部选中状态（受控/非受控）
 */
const stateInnerSelected = ref(selected !== undefined ? selected : false);

/**
 * 状态：重命名状态
 */
const stateIsRenaming = ref(false);

/**
 * 状态：重命名草稿
 */
const stateDraftLabel = ref<string>('');

/**
 * 状态：重命名延迟计时器句柄
 */
const { start: startRelabelTimer, stop: stopRelabelTimer } = useTimeoutFn(
  () => {
    startRelabel();
  },
  relabelDelay,
  { immediate: false }
);

/**
 * 计算属性：是否无右键菜单
 */
const computedNotMenu = computed(() => !(Array.isArray(contextMenuProps?.items) && (contextMenuProps?.items as ContextMenuItem[]).length > 0));

/**
 * 计算属性：是否选中
 */
const computedIsSelected = computed({
  get: () => selected ?? stateInnerSelected.value,
  set: (v: boolean) => {
    if (!selectable) {
      return;
    }

    if (selected === undefined) {
      stateInnerSelected.value = v;
    }

    if (!v) {
      stopRelabelTimer();
    }

    emit('update:selected', v);
  }
});

/**
 * 计算属性：默认名称（从语言包读取，缺失时回退为“新建文件夹”）
 */
const defaultFolderLabel = computed<string>(() => {
  if (defaultLabel && defaultLabel.trim().length > 0) {
    return defaultLabel;
  }

  /**
   * 常量：key。
   */
  const key = 'components.folder.newFolder';
  /**
   * 常量：translated。
   */
  const translated = t(key) as unknown as string;
  return translated === key ? 'new folder' : translated;
});

/**
 * 计算属性：用于展示的名称（外部 name 优先，否则取默认名称）
 */
const displayLabel = computed<string>(() => label ?? defaultFolderLabel.value);

/**
 * 函数：获取当前重命名输入框元素
 * @return {HTMLInputElement | null} 输入框元素
 */
const getRelabelInputEl = (): HTMLInputElement | null => {
  /**
   * 常量：wrap。
   */
  const wrap = stateRefRelabelWrapEl.value;
  if (!wrap) {
    return null;
  }
  return wrap.querySelector('input');
};

/**
 * 函数：进入重命名
 */
const startRelabel = () => {
  if (!relabel) {
    return;
  }

  stateIsRenaming.value = true;

  emit('relabel-start');

  nextTick(() => {
    /**
     * 常量：input。
     */
    const input = getRelabelInputEl();
    if (input) {
      input.focus();
      // 自动全选（兼容部分浏览器需先 focus 再 select）
      input.select();
    }
  });
};

/**
 * 函数：延迟进入重命名
 */
const delayedStartRelabel = () => {
  stopRelabelTimer();
  startRelabelTimer();
};

/**
 * 函数：确认重命名
 */
const confirmRelabel = () => {
  /**
   * 常量：draftLabel。
   */
  const draftLabel = stateDraftLabel.value?.trim() ?? '';

  if (draftLabel && draftLabel !== displayLabel.value) {
    // 支持 v-model:label 与重命名回调
    emit('update:label', draftLabel);
    emit('relabel-done', draftLabel);
  }

  stateIsRenaming.value = false;
};

/**
 * 函数：取消重命名（保持选中则继续等待第二次单击进入重命名）
 */
const cancelRelabel = () => {
  stateDraftLabel.value = displayLabel.value;
  stateIsRenaming.value = false;
  stopRelabelTimer();
  emit('relabel-cancel');
};

/**
 * 事件：输入框 ESC（避免与 blur/click 竞争）
 */
const onInputEsc = () => {
  pendingBlurClose = false;
  stopBlurCloseTimer();
  cancelRelabel();
  suppressNextClickRelabel = true;
};

/**
 * 事件：重命名输入框键盘抬起。
 * @param {KeyboardEvent} e 键盘事件。
 */
const handleRelabelInputKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmRelabel();
    return;
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    onInputEsc();
  }
};

/**
 * 事件：重命名输入框内容更新。
 * @param {string | number} value 新输入值。
 */
const handleRelabelInputUpdate = (value: string | number) => {
  stateDraftLabel.value = String(value ?? '');
};

/**
 * 事件：输入框 blur（延迟取消，若根 click 先处理将清理该定时）
 */
const handleInputBlur = () => {
  pendingBlurClose = true;
  startBlurCloseTimer();
};

/**
 * 事件：键盘按下
 * @param {KeyboardEvent} e 键盘事件
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (disabled) {
    return;
  }

  // 重命名态下不拦截默认输入行为
  if (stateIsRenaming.value) {
    return;
  }

  if (e.key === 'F2' && computedIsSelected.value && relabel) {
    e.preventDefault();
    delayedStartRelabel();
    return;
  }

  if (e.key === ' ' && selectable) {
    e.preventDefault();
    computedIsSelected.value = !computedIsSelected.value;
    return;
  }

  if (e.key === 'Enter' && computedIsSelected.value) {
    // 仅保留双击行为
    e.preventDefault();
    emit('dblclick', new MouseEvent('dblclick'));
  }
};

/**
 * 事件：指针按下
 * @param {PointerEvent} e 指针事件
 */
const onPointerDown = (e: PointerEvent) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  movedBeyondTolerance = false;

  if (e.button === 2) {
    if (selectable && !computedIsSelected.value) {
      computedIsSelected.value = true;
    }
    if (stateIsRenaming.value) {
      cancelRelabel();
    }
  }
};

/**
 * 事件：指针移动
 * @param {PointerEvent} e 指针事件
 */
const onPointerMove = (e: PointerEvent) => {
  /**
   * 常量：dx。
   */
  const dx = Math.abs(e.clientX - pointerDownPos.x);
  /**
   * 常量：dy。
   */
  const dy = Math.abs(e.clientY - pointerDownPos.y);
  /**
   * 常量：moved。
   */
  const moved = Math.hypot(dx, dy);
  // 移动超过容差即判定为拖拽，后续的 click（若产生）将被抑制进入重命名
  if (moved > clickMoveTolerance) {
    movedBeyondTolerance = true;
  }
};

/**
 * 事件：节流指针移动
 */
const throttledPointerMove = useThrottleFn(onPointerMove, 16);

/**
 * 事件：指针抬起
 */
const onPointerUp = () => {
  if (movedBeyondTolerance) {
    // 抑制拖拽释放后的“点击”触发重命名
    suppressNextClickRelabel = true;
  }
};

/**
 * 事件：单击（组件内部）
 * @param {MouseEvent} e 鼠标事件
 */
const onClick = (e: MouseEvent) => {
  if (disabled) {
    return;
  }

  emit('click', e);

  // 存在跳转目标时：仅左键单击触发跳转（不参与选中/重命名判定）
  if (to && e.button === 0) {
    navigateTo(to);
    return;
  }

  /**
   * 常量：now。
   */
  const now = Date.now();
  /**
   * 常量：timeDiff。
   */
  const timeDiff = now - lastClickTime;
  /**
   * 常量：dx。
   */
  const dx = Math.abs(e.clientX - lastClickPos.x);
  /**
   * 常量：dy。
   */
  const dy = Math.abs(e.clientY - lastClickPos.y);
  /**
   * 常量：moved。
   */
  const moved = Math.hypot(dx, dy);

  // 若当前处于重命名态：点击输入框之外但仍在组件内部 -> 退出重命名但保持选中
  if (stateIsRenaming.value) {
    /**
     * 常量：input。
     */
    const input = getRelabelInputEl();
    /**
     * 常量：target。
     */
    const target = e.target as Node | null;

    if (!input || (target && !input.contains(target))) {
      // 由根节点处理取消，避免与 input 的 blur 竞争
      pendingBlurClose = false;
      stopBlurCloseTimer();
      cancelRelabel();
      suppressNextClickRelabel = true;
    }

    lastClickTime = now;
    lastClickPos = { x: e.clientX, y: e.clientY };
    return;
  }

  // 抑制一次点击进入重命名（例如由 blur 或拖拽触发）
  if (suppressNextClickRelabel) {
    suppressNextClickRelabel = false;
    lastClickTime = now;
    lastClickPos = { x: e.clientX, y: e.clientY };
    return;
  }

  // 双击判定：时间与位移均在阈值内
  if (timeDiff <= dblclickDelay && moved <= clickMoveTolerance) {
    emit('dblclick', e);
  } else {
    // 非双击
    if (selectable && !computedIsSelected.value) {
      // 第一次单击：进入选中，等待下一次单击进入重命名
      computedIsSelected.value = true;
    } else if (computedIsSelected.value) {
      // 已选中：第二次单击（非双击）直接进入重命名
      if (relabel && relabelOnSecondClick) {
        if (relabelOnly) {
          /**
           * 常量：target。
           */
          const target = e.target as Node | null;
          /**
           * 常量：nameEl。
           */
          const nameEl = stateRefLabelEl.value;
          if (nameEl && target && nameEl.contains(target)) {
            delayedStartRelabel();
          }
        } else {
          delayedStartRelabel();
        }
      }
    }
  }

  lastClickTime = now;
  lastClickPos = { x: e.clientX, y: e.clientY };
};

/**
 * 事件：右键菜单选中
 * @param {ContextMenuItem} item 选中的菜单项
 */
const handleMenuSelect = (item: ContextMenuItem) => emit('menu-select', item);

/**
 * 事件：组件外点击 -> 取消选中与重命名就绪
 */
onClickOutside(stateRefRootEl, () => {
  if (!unselectOnOutside) {
    return;
  }
  nextTick(() => {
    if (computedIsSelected.value) {
      computedIsSelected.value = false;
    }
  });
});

/**
 * 监听：名称或默认名称变更 -> 同步草稿（立即）
 */
watch(
  [() => label, () => defaultFolderLabel.value],
  ([n, d]) => {
    if (!stateIsRenaming.value) {
      stateDraftLabel.value = n ?? d;
    }
  },
  { immediate: true }
);
</script>
