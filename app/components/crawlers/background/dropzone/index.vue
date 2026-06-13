<template>
  <div class="dropzone-background relative h-full w-full">
    <Background :size="2" :gap="20" pattern-color="var(--ui-text-muted)" />

    <div class="overlay pointer-events-none absolute inset-0 z-1 flex h-full w-full items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Background } from '@vue-flow/background';
</script>
