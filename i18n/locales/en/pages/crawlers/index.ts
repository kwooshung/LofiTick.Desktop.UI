export const crawlers = {
  title: 'Crawlers',
  targets: {
    empty: {
      title: 'No folders yet',
      description: 'There are no crawler folders to show right now.'
    }
  },
  spider: {
    title: 'Spider',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: 'Music',
        dialog: {
          title: 'Choose a Pixabay address',
          description: 'Enter a keyword first, optionally add a page number, and preview the final URL below.',
          usernameLabel: 'Username',
          usernamePlaceholder: 'Enter a username',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter a password',
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
