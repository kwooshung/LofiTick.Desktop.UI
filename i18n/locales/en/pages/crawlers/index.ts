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
    empty: {
      title: 'The canvas is still empty',
      description: 'Drag a blueprint node from the left into the canvas to start building the crawler flow.'
    },
    drag: {
      title: 'Release to place the node',
      description: 'The current blueprint node will be inserted at the mouse position.'
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
