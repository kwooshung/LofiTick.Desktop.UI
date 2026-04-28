export default defineAppConfig({
  toaster: {
    position: 'top-center' as const,
    expand: false,
    duration: 3000
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false
  },
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'sky',
      info: 'teal',
      success: 'green',
      warning: 'amber',
      error: 'red',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: ['cursor-pointer']
      }
    },
    link: {
      variants: {
        active: {
          false: 'text-primary'
        }
      },
      compoundVariants: [
        {
          class: ['hover:text-primary', 'transition-colors', 'border-b border-transparent hover:border-primary']
        }
      ]
    },
    toast: {
      slots: {
        root: 'relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 focus:outline-none no-drag'
      }
    },
    modal: {
      slots: {
        overlay: 'no-drag',
        content: 'no-drag',
        header: 'no-drag',
        body: 'no-drag',
        footer: 'no-drag',
        close: 'no-drag'
      }
    },
    drawer: {
      slots: {
        overlay: 'no-drag',
        content: 'no-drag',
        container: 'no-drag',
        header: 'no-drag',
        body: 'no-drag',
        footer: 'no-drag'
      }
    },
    slideover: {
      slots: {
        overlay: 'no-drag',
        content: 'no-drag',
        header: 'no-drag',
        body: 'no-drag',
        footer: 'no-drag',
        close: 'no-drag'
      }
    },
    popover: {
      slots: {
        content: 'no-drag'
      }
    },
    tooltip: {
      slots: {
        content: 'z-60 bg-stone-800 ring-stone-800 dark:bg-neutral-600 dark:ring-neutral-600 text-white',
        arrow: 'fill-stone-800 dark:fill-neutral-600'
      }
    },
    icons: {
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-copy-check'
    }
  }
});
