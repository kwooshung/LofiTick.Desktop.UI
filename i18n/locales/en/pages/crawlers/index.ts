export const crawlers = {
  title: 'Crawlers',
  targets: {
    empty: {
      title: 'No folders yet',
      description: 'There are no crawler folders to show right now.'
    }
  },
  provider: {
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
        title: 'Pixabay',
        music: 'Music',
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
        name: 'Suno'
      }
    }
  }
};
