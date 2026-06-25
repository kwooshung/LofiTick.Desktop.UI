<template>
  <div class="nodrag flex shrink-0 flex-col gap-2 pt-1">
    <div v-for="branch in branches" :key="branch.id" class="relative flex min-h-6 items-center justify-end gap-2">
      <div class="grow text-right">
        <UTooltip :text="branch.description" :content="{ side: 'top' }">
          <span class="block truncate text-right text-sm leading-5 font-medium">{{ branch.label }}</span>
        </UTooltip>
      </div>

      <Handle
        :id="branch.id"
        type="source"
        :position="Position.Right"
        :is-valid-connection="isValidConnection"
        class="h-5! w-4! cursor-crosshair! rounded-none! border-0! bg-amber-400 shadow-sm [clip-path:polygon(0_0,100%_50%,0_100%)]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Connection } from '@vue-flow/core';
import { Handle, Position } from '@vue-flow/core';

import type { IControlFlowBranchRailItem } from './index.types';

/**
 * Props：组件入参。
 */
const { branches, isValidConnection } = defineProps<{
  branches: IControlFlowBranchRailItem[];
  isValidConnection: (connection: Connection) => boolean;
}>();
</script>