<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div class="flex w-full flex-1 gap-1">
        <div class="flex-1">
          <UTable
            :columns="columns"
            :data="computedQqGroupDatas"
            :loading="loading"
            class="shrink-0"
            sticky
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
              td: 'border-b border-default',
              separator: 'h-0'
            }"
          />
        </div>
      </div>
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="muted text-sm">{{ t('pages.socials.qq.groups.result.footer.total', { total: Number(datas?.total ?? 0) }) }}</div>
        <div class="flex items-center gap-1.5">
          <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
        </div>
      </div>
    </div>
    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="stateEditor.id ? t('pages.socials.qq.groups.edit') : t('pages.socials.qq.groups.add')" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm id="qqGroupEditorForm" :schema="schema" :state="stateEditor" class="w-full max-w-none space-y-4" @submit="onSubmit">
          <UFormField required name="name" :label="t('pages.socials.qq.groups.form.name.label')" :help="computedUniqueNameHelp" :error="computedUniqueNameError" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UInput v-model="stateEditor.name" class="z-1 w-full" :placeholder="t('pages.socials.qq.groups.form.name.placeholder')" />
            <template #error="{ error }">
              <p v-if="error">{{ error }}</p>
            </template>
          </UFormField>
          <UFormField required name="number" :label="t('pages.socials.qq.groups.form.number.label')" :help="computedUniqueNumberHelp" :error="computedUniqueNumberError" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UInput v-model="stateEditor.number" class="z-1 w-full" :placeholder="t('pages.socials.qq.groups.form.number.placeholder')" />
            <template #error="{ error }">
              <p v-if="error">{{ error }}</p>
            </template>
          </UFormField>
          <UFormField required name="size" :label="t('pages.socials.qq.groups.form.size.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USelect v-model="stateEditor.size" class="w-full" :items="sizeSelectItems" value-key="value" :placeholder="t('pages.socials.qq.groups.form.size.placeholder')" />
          </UFormField>
          <UFormField required name="url" :label="t('pages.socials.qq.groups.form.url.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UTextarea v-model="stateEditor.url" class="w-full" :rows="3" autoresize :placeholder="t('pages.socials.qq.groups.form.url.placeholder')" />
          </UFormField>
          <UFormField name="full" :label="t('pages.socials.qq.groups.result.table.full')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USwitch v-model="stateEditor.full" />
          </UFormField>
          <UFormField name="enabled" :label="t('pages.socials.qq.groups.result.table.enabled')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USwitch v-model="stateEditor.enabled" />
          </UFormField>
        </UForm>
      </template>
      <template #footer="{ close }">
        <UButton type="button" color="neutral" variant="outline" @click="close">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="submit" form="qqGroupEditorForm" icon="i-lucide-save" color="primary" :disabled="!computedCanSubmit">{{ t('common.actions.save') }}</UButton>
      </template>
    </UModal>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui';
import { z } from 'zod';


/**
 * 计算属性：表单是否可提交
 */
const computedCanSubmit = computed(() => schema.safeParse({ ...stateEditor.value }).success && !stateUniqueNameExists.value && !stateUniqueNumberExists.value);

/**
 * 状态：编辑器开关
 */
const stateEditorOpen = ref(false);

/**
 * 状态：编辑器表单
 */
const stateEditor = ref<IPageQqGroupForm>({
  id: 0,
  name: '',
  number: '',
  size: 20,
  url: '',
  full: false,
  enabled: true
});

/**
 * 事件：点击新增
 */
const handleCreate = () => {
  stateEditor.value = {
    id: 0,
    name: '',
    number: '',
    size: 20,
    url: '',
    full: false,
    enabled: true
  };
  stateEditorOpen.value = true;
};

/**
 * 监听：查重接口返回
 */
watch(
  stateUniqueDatas,
  (val) => {
    stateUniqueNameExists.value = Boolean(val?.nameExists);
    stateUniqueNumberExists.value = Boolean(val?.numberExists);
  },
  { immediate: true }
);

watch(stateUniqueLoading, (isLoading) => {
  if (!isLoading) {
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
  }
});

/**
 * 监听：编辑器打开/输入变化时触发查重（防抖）
 */
watch([stateEditorOpen, () => stateEditor.value.id, () => stateEditor.value.name, () => stateEditor.value.number], ([isOpen]) => {
  if (!isOpen) {
    stateUniqueNameExists.value = false;
    stateUniqueNumberExists.value = false;
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
    return;
  }

  const id = Number(stateEditor.value.id ?? 0);
  const name = String(stateEditor.value.name ?? '').trim();
  const number = String(stateEditor.value.number ?? '').trim();

  if (!name && !number) {
    stateUniqueNameExists.value = false;
    stateUniqueNumberExists.value = false;
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
    return;
  }

  const shouldCheckName = !!name && schema.pick({ name: true }).safeParse({ name }).success;
  const shouldCheckNumber = !!number && schema.pick({ number: true }).safeParse({ number }).success;

  // 字段不合法时，清掉旧的查重结果，避免残留“重复”提示
  if (!shouldCheckName) {
    stateUniqueNameExists.value = false;
  }
  if (!shouldCheckNumber) {
    stateUniqueNumberExists.value = false;
  }

  if (!shouldCheckName && !shouldCheckNumber) {
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
    return;
  }

  stateUniqueCheckingName.value = shouldCheckName;
  stateUniqueCheckingNumber.value = shouldCheckNumber;

  refreshUniqueDebounced({
    datas: {
      id: Number.isFinite(id) && id > 0 ? id : undefined,
      name: shouldCheckName ? name : undefined,
      number: shouldCheckNumber ? number : undefined
    }
  });
});

onBeforeUnmount(() => {
  if (stateCopiedNumberTimer) {
    clearTimeout(stateCopiedNumberTimer);
  }
});

watch(
  () => createNonce,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number' && value !== oldValue) {
      handleCreate();
    }
  }
);

/**
 * 事件：点击编辑
 * @param {IPageTableColumnQqGroup} row 行数据
 */
const handleEdit = (row: IPageTableColumnQqGroup) => {
  stateEditor.value = {
    id: row.id,
    name: row.name,
    number: row.number,
    size: row.size,
    url: row.url,
    full: row.full,
    enabled: row.enabled
  };
  stateEditorOpen.value = true;
};

/**
 * 事件：提交表单
 */
const handleSubmit = async (payload: z.output<typeof schema>) => {
  if (stateUniqueNameExists.value || stateUniqueNumberExists.value) {
    return;
  }

  await refreshSave({
    datas: {
      id: payload.id || undefined,
      name: payload.name,
      number: payload.number,
      size: payload.size,
      url: payload.url,
      full: payload.full,
      enabled: payload.enabled
    },
    replace: true
  });

  stateEditorOpen.value = false;
  refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
};

/**
 * 事件：提交表单
 * @param {FormSubmitEvent<z.output<typeof schema>>} e 表单提交事件
 */
const onSubmit = async (e: FormSubmitEvent<z.output<typeof schema>>): Promise<void> => {
  if (schema.safeParse(e.data).success) {
    await handleSubmit(e.data);
  }
};

/**
 * 常量：表格列定义
 */
const columns: TableColumn<IPageTableColumnQqGroup>[] = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-15',
        td: 'w-15'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'id' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.id'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('id') });
    },
    cell: ({ row }) => row.original.id.toString().padStart(5, '0')
  },
  {
    accessorKey: 'name',
    meta: {
      class: {
        th: 'w-auto',
        td: 'w-auto'
      }
    },
    header: t('pages.socials.qq.groups.result.table.name'),
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'number',
    meta: {
      class: {
        th: 'w-auto',
        td: 'w-auto'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'number' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.number'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('number') });
    },
    cell: ({ row }) => {
      const isCopied = stateCopiedNumberId.value === row.original.id;
      const icon = isCopied ? 'i-lucide-copy-check' : 'i-lucide-copy';
      const color = isCopied ? 'success' : 'neutral';

      return h('div', { class: 'flex items-center gap-1' }, [
        h(
          ULink,
          {
            raw: true,
            href: buildGroupLinkUrl(row.original),
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'px-0 no-underline text-primary text-xs hover:underline',
            onClick: (event: MouseEvent) => void handleGroupLinkClick(event, row.original)
          },
          () => row.original.number
        ),
        h(UButton, {
          color,
          variant: 'ghost',
          size: 'xs',
          icon,
          class: '-mx-1 transition-colors',
          'aria-label': 'Copy group id',
          onClick: () => void handleCopyGroupNumber(row.original)
        })
      ]);
    }
  },
  {
    accessorKey: 'size',
    meta: {
      class: {
        th: 'w-20 text-right',
        td: 'w-20 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'size' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.size'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('size') });
    },
    cell: ({ row }) => getSizeLabel(row.original.size * 10)
  },
  {
    accessorKey: 'full',
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20'
      }
    },
    header: t('pages.socials.qq.groups.result.table.full'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.full,
        'onUpdate:modelValue': (value: boolean) => handleToggleFull(row.original, value)
      })
  },
  {
    accessorKey: 'enabled',
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20'
      }
    },
    header: t('pages.socials.qq.groups.result.table.enabled'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.enabled,
        'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value)
      })
  },
  {
    id: 'times',
    accessorKey: 'times',
    meta: {
      class: {
        th: 'w-45 2xl:hidden',
        td: 'w-45 2xl:hidden text-default'
      }
    },
    header: t('common.labels.time'),
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-1.5' }, [
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.socials.qq.groups.result.table.updatedAt')}：`),
          h(Datetime, {
            class: 'w-auto max-w-full',
            datetime: row.original.times.updated,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        ]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.socials.qq.groups.result.table.createdAt')}：`),
          h(Datetime, {
            class: 'w-auto max-w-full',
            datetime: row.original.times.created,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        ])
      ])
  },
  {
    accessorKey: 'timesUpdated',
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-30 text-right',
        td: 'hidden 2xl:table-cell w-30 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'updated' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.updatedAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('updated') });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: row.original.times.updated,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
  },
  {
    accessorKey: 'timesCreated',
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-30 text-right',
        td: 'hidden 2xl:table-cell w-30 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'created' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.createdAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('created') });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: row.original.times.created,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-20 text-center',
        td: 'w-20'
      }
    },
    enableHiding: false,
    header: () => h('div', { class: 'w-full text-center' }, t('pages.socials.qq.groups.result.table.actions')),
    cell: ({ row }) =>
      h(
        UButton,
        {
          color: 'neutral',
          variant: 'ghost',
          label: t('pages.socials.qq.groups.edit'),
          onClick: () => handleEdit(row.original)
        },
        () => t('pages.socials.qq.groups.edit')
      )
  }
];
</script>
