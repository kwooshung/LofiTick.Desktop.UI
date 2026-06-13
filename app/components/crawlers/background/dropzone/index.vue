<template>
  <div class="dropzone-background">
    <Background :size="2" :gap="20" pattern-color="var(--ui-text-muted)" />

    <div class="overlay">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Background } from '@vue-flow/background';
</script>
