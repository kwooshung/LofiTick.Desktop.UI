export const crawlers = {
  title: 'Crawlers',
  targets: {
    addTask: 'Add task',
    edit: 'Edit',
    empty: {
      title: 'No folders yet',
      description: 'There are no crawler folders to show right now.'
    },
    menu: {
      open: 'Open',
      copyDomain: 'Copy domain',
      copyBaseUrl: 'Copy base URL'
    }
  },
  task: {
    actions: {
      execute: 'Run task',
      browserSessionShow: 'Show window',
      browserSessionHide: 'Hide window',
      pause: 'Pause task',
      resume: 'Resume task',
      stop: 'Stop task',
      stopConfirmTitle: 'Stop the current task?',
      stopConfirmDescription: 'Stopping will close the crawler window and clear its running state.',
      stopCancel: 'Cancel',
      stopConfirm: 'Stop'
    },
    filters: {
      all: 'All'
    },
    footer: {
      total: '{total} tasks'
    },
    progress: {
      indeterminate: 'Calculating',
      percent: '{value}%'
    },
    status: {
      pending: 'Pending',
      resolving: 'Resolving',
      crawling: 'Crawling',
      downloading: 'Downloading',
      paused: 'Paused',
      completed: 'Completed',
      failed: 'Failed',
      stopped: 'Stopped'
    },
    table: {
      task: 'Task',
      name: 'Name',
      status: 'Status',
      progress: 'Progress',
      transfer: 'Transfer',
      speed: 'Speed',
      size: 'Size',
      downloaded: 'Transferred',
      time: 'Time',
      elapsed: 'Elapsed',
      remaining: 'Remaining',
      items: 'Items',
      updatedAt: 'Updated',
      actions: 'Actions'
    },
    unsupported: {
      name: 'Unknown crawler',
      title: 'Crawler not supported yet',
      description: 'This provider does not have a crawler console yet.'
    }
  },
  spider: {
    title: 'Spider',
    websites: {
      pixabay: {
        name: 'Pixabay',
        page: {
          description: 'Manage Pixabay crawl tasks, execution mode, and collected results.',
          actions: {
            create: 'New crawl'
          },
          tasks: {
            empty: {
              title: 'No Pixabay tasks yet',
              description: 'There are no Pixabay crawl tasks yet. The task list will appear here later.'
            }
          }
        },
        dialog: {
          title: 'Choose a Pixabay address',
          description: 'Enter a keyword first, optionally add a page number, and preview the final URL below.',
          keywordLabel: 'Keyword',
          keywordPlaceholder: 'Enter a keyword',
          keywordPreview: 'keyword',
          pageLabel: 'Page',
          typeLabel: 'Address',
          urlLabel: 'URL preview',
          submit: 'Confirm',
          cancel: 'Cancel',
          types: {
            photos: 'Images: Photos',
            illustrations: 'Images: Illustrations',
            vectors: 'Images: Vectors',
            videos: 'Videos: Videos',
            gifs: 'GIFs: GIFs',
            threeDModels: 'Images: 3D models',
            music: 'Audio: Music',
            soundEffects: 'Audio: Sound effects'
          }
        }
      },
      suno: {
        name: 'Suno',
        dialog: {
          title: 'Run Suno task',
          description: 'Suno task execution settings are not connected yet. They will appear here later.',
          close: 'Close'
        },
        page: {
          description: 'Manage Suno crawl tasks, execution mode, and collected results.',
          tasks: {
            empty: {
              title: 'No Suno tasks yet',
              description: 'There are no Suno crawl tasks yet. The task list will appear here later.'
            }
          }
        }
      }
    }
  }
};
