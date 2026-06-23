import { crawler } from '@@/i18n/locales/en/components/crawler';

export const crawlers = {
  title: 'Crawlers',
  search: {
    header: {
      title: 'Search Crawlers',
      startLabel: 'Click to search crawlers',
      conditions: 'Search conditions set'
    },
    body: {
      keyword: {
        placeholder: 'Search site name or description'
      },
      enabled: {
        placeholder: 'Filter enabled status'
      }
    }
  },
  targets: {
    title: 'Sites',
    add: 'Add Site',
    edit: 'Edit Site',
    addTask: 'Add Task',
    menu: {
      open: 'Open Site',
      copyDomain: 'Copy Domain',
      copyBaseUrl: 'Copy Site URL'
    },
    empty: {
      title: 'No Target Sites',
      description: 'No crawler target sites have been added. Click the button above to add one.'
    },
    form: {
      name: {
        label: 'Site Name',
        placeholder: 'Enter site name',
        verify: {
          required: 'Site name is required',
          length: 'Site name cannot exceed 255 characters'
        }
      },
      domain: {
        label: 'Domain',
        placeholder: 'Enter domain, e.g. weibo.com',
        verify: {
          required: 'Domain is required',
          length: 'Domain cannot exceed 255 characters',
          pattern: 'Invalid domain format'
        }
      },
      baseUrl: {
        label: 'Base URL',
        placeholder: 'Enter site domain, e.g. weibo.com',
        verify: {
          required: 'Base URL is required',
          length: 'Base URL must not exceed 255 characters',
          pattern: 'Invalid URL format'
        }
      },
      description: {
        label: 'Description',
        placeholder: 'Enter description'
      },
      isEnabled: {
        label: 'Enabled'
      },
      unique: {
        checking: 'Checking uniqueness...',
        domainExists: 'This domain already exists'
      }
    }
  },
  editor: {
    title: 'Crawler Logic',
    sidebar: {
      tabs: {
        nodes: 'Nodes',
        siteFunctions: 'Site Functions',
        globalFunctions: 'Global Functions'
      },
      loading: 'Loading functions',
      row: {
        id: 'ID: {id}',
        reference: 'References {count}',
        target: 'Site #{id}'
      },
      empty: {
        siteMissingTarget: 'Current site information is missing, unable to load site functions.',
        siteNoData: 'No site functions for the current site.',
        globalNoData: 'No global functions yet.',
        defaultDescription: 'No items',
        siteTitle: 'No Site Functions',
        globalTitle: 'No Global Functions',
        defaultTitle: 'No Items'
      },
      actions: {
        createSiteFunction: 'Create Site Function',
        createGlobalFunction: 'Create Global Function',
        editLogic: 'Edit Logic',
        edit: 'Edit',
        delete: 'Delete'
      },
      editModal: {
        title: 'Edit Function Info',
        nameLabel: 'Function Name',
        namePlaceholder: 'Enter function name',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Enter function description (optional)'
      },
      deleteModal: {
        title: 'Delete Function',
        description: 'Are you sure you want to delete function "{name}"? This action cannot be undone.'
      },
      createModal: {
        titleSite: 'Create Site Function',
        titleGlobal: 'Create Global Function',
        scopeLabel: 'Scope',
        scopeSite: 'Site Function',
        scopeGlobal: 'Global Function',
        nameLabel: 'Function Name',
        namePlaceholder: 'Enter function name',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Enter function description (optional)',
        siteTargetRequired: 'Current site context is missing. Cannot create a site function.'
      }
    },
    empty: {
      title: 'The canvas is still empty',
      description: 'Drag a blueprint node from the left into the canvas to start building the crawler flow.'
    },
    drag: {
      title: 'Release to place the node',
      description: 'The current blueprint node will be inserted at the mouse position.'
    },
    actions: {
      restore: 'Restore',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      autoLayout: 'Auto Layout',
      redo: 'Redo',
      undo: 'Undo'
    },
    draft: {
      saved: 'Draft auto-saved'
    },
    saveFeedback: {
      title: 'Function logic save'
    },
    loadSource: {
      title: 'Logic panel loaded',
      loading: 'Loading logic from server...',
      server: 'Loaded the latest logic from server',
      draft: 'Server data is unavailable, restored from local draft',
      default: 'No available logic found, loaded an empty default panel',
      fallbackRequestFailed: 'Server request failed. Local fallback was used.',
      fallbackNoMatchedData: 'Server response did not match current function. Local fallback was used.',
      persistMismatch: 'Save submitted, but server roundtrip does not match local pin data. Please retry or check backend logs.',
      saveSuccess: 'Function logic has been saved to server',
      saveFailed: 'Failed to save function logic',
      saveFailedWithCode: 'Failed to save function logic ({code})',
      saveEchoMissing: 'Save submitted, but latest function detail could not be reloaded'
    }
  },
  executions: {
    title: 'Execution Records',
    status: {
      pending: 'Pending',
      running: 'Running',
      success: 'Success',
      failed: 'Failed',
      stopped: 'Stopped'
    },
    duration: 'Duration {ms}ms',
    records: '{count} records',
    empty: {
      title: 'No Execution Records',
      description: 'No execution records yet.'
    }
  },
  blueprints: {
    empty: {
      title: 'No Crawlers',
      description: 'No crawler has been created for this site yet. Click "Add Task" in the top-right to start.'
    },
    table: {
      name: 'Crawler Name',
      status: 'Execution Status',
      lastRunAt: 'Last Run'
    },
    actions: {
      execute: 'Run',
      deleteConfirm: 'Delete crawler "{name}"? This action cannot be undone.',
      runSuccess: 'Execution has been triggered and is now running.',
      runFailed: 'Failed to trigger execution. Please try again later.',
      deleteSuccess: 'Deleted successfully.',
      deleteFailed: 'Delete failed. Please try again later.'
    }
  },
  spider: {
    title: 'Spider',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: 'Music'
      }
    }
  },
  blueprint: crawler.blueprint
};
