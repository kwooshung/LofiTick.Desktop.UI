<template>
  <div class="relative flex size-full overflow-hidden">
    <slot v-if="$slots['panel-left']" name="panel-left" />
    <section class="relative flex h-full w-dvw flex-col overflow-hidden">
      <div
        v-if="$slots.toolbar || $slots['toolbar-left'] || $slots['toolbar-right']"
        class="bg-default/75 border-default after:border-default relative flex h-12.25 shrink-0 items-center justify-between gap-1.5 overflow-hidden px-4 after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:block after:w-full after:border-b after:content-[''] sm:px-6"
      >
        <div v-if="$slots.toolbar" class="relative z-10 w-full">
          <slot name="toolbar" />
        </div>
        <div v-else-if="$slots['toolbar-left'] || $slots['toolbar-right']" class="relative z-10 flex w-full items-center justify-between gap-1.5">
          <div class="flex items-center justify-start gap-1.5">
            <slot name="toolbar-left" />
          </div>
          <div class="flex items-center justify-end gap-1.5">
            <slot name="toolbar-right" />
          </div>
        </div>
      </div>
      <slot />
    </section>
    <slot v-if="$slots['panel-right']" name="panel-right" />
  </div>
</template>
