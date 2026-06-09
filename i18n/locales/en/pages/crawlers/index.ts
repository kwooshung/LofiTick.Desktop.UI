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
  blueprint: {
    drawer: {
      title: 'Crawler Logic',
      description: 'Pick nodes on the left and assemble the crawler flow on the right.'
    },
    logic: {
      title: 'Crawler Logic',
      description: 'Canvas, property inspector, and execution preview will live here.',
      badge: 'Placeholder',
      empty: {
        title: 'Crawler logic workspace',
        description: 'This area will later hold the canvas, node inspector, and run preview.',
        badges: {
          canvas: 'Canvas',
          inspector: 'Inspector',
          preview: 'Preview'
        }
      }
    },
    nodes: {
      title: 'Node Library',
      description: 'Grouped nodes ready for future drag-and-drop editing.',
      groups: {
        flow: {
          title: 'Flow Control',
          description: 'Build the entry point, branching, and execution order.'
        },
        request: {
          title: 'Network Requests',
          description: 'Send requests and handle responses.'
        },
        parser: {
          title: 'Data Parsing',
          description: 'Extract content from pages and structured data.'
        },
        logic: {
          title: 'Logic & Variables',
          description: 'Use conditions, typed nodes, and loops.'
        },
        debug: {
          title: 'Debug & Utilities',
          description: 'Use logs, previews, and retry helpers.'
        }
      },
      nodes: {
        flow: {
          start: {
            title: 'Start Node',
            description: 'Blueprint entry point with initial parameters.'
          },
          end: {
            title: 'End Node',
            description: 'Blueprint exit point that returns the final result.'
          },
          sequence: {
            title: 'Sequence',
            description: 'Connect multiple child flows in order.'
          },
          branch: {
            title: 'Branch Selection',
            description: 'Switch execution branches by condition.'
          }
        },
        request: {
          get: {
            title: 'GET Request',
            description: 'Send an HTTP GET request.'
          },
          post: {
            title: 'POST Request',
            description: 'Send an HTTP POST request.'
          },
          config: {
            title: 'Request Config',
            description: 'Set headers, cookies, and proxies.'
          },
          parse: {
            title: 'Response Parsing',
            description: 'Parse JSON, HTML, or XML responses.'
          }
        },
        parser: {
          css: {
            title: 'CSS Selector',
            description: 'Extract elements from HTML.'
          },
          json: {
            title: 'JSON Parsing',
            description: 'Pull fields from JSON data.'
          },
          list: {
            title: 'List Extraction',
            description: 'Handle pagination and expand list items.'
          },
          attr: {
            title: 'Attribute Extraction',
            description: 'Extract src, href, and other attributes.'
          }
        },
        logic: {
          boolean: {
            title: 'Boolean',
            description: 'Boolean value node.'
          },
          string: {
            title: 'String',
            description: 'String value node.'
          },
          ifElse: {
            title: 'if-else',
            description: 'Two-way conditional branch.'
          },
          loop: {
            title: 'for',
            description: 'Iterate over items or counts.'
          }
        },
        debug: {
          log: {
            title: 'Log Output',
            description: 'Print debugging information.'
          },
          preview: {
            title: 'Data Preview',
            description: 'Preview the current node output.'
          },
          retry: {
            title: 'Retry Logic',
            description: 'Retry automatically after failures.'
          }
        }
      }
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
  execute: {}
};
