export const hotsearch = {
  title: 'Trending',
  description: 'Browse hot topics by date, podcast scripts, and generated media assets.',
  layout: {
    updatedAt: 'Updated',
    dates: {
      title: 'Date archive',
      description: 'Review hotsearch batches by date like an email sidebar.',
      total: 'Hotsearch {value}',
      newCount: 'New {value}',
      podcastCount: 'Podcast {value}'
    }
  },
  sections: {
    data: {
      title: 'Data'
    },
    podcast: {
      title: 'Podcast'
    },
    music: {
      title: 'BGM'
    }
  },
  actions: {
    resetFilters: 'Reset filters',
    openSource: 'Open source'
  },
  categories: {
    social: 'Society',
    politics: 'Politics',
    legal: 'Legal & Safety',
    finance: 'Finance',
    tech: 'Tech',
    auto: 'Auto & Mobility',
    sports: 'Sports',
    entertainment: 'Entertainment',
    filmTv: 'Film & TV',
    games: 'Games & Esports',
    anime: 'Anime & ACG',
    lifestyle: 'Lifestyle',
    health: 'Health',
    history: 'History & Culture'
  },
  data: {
    description: 'Filter hotsearch records by platform and keyword with a clear table view.',
    searchPlaceholder: 'Search title, summary, or keyword',
    searchAction: 'Search',
    platformsTitle: 'Platforms',
    platformsDescription: 'Use the vertical platform list to narrow the table quickly.',
    allPlatforms: 'All platforms',
    allTags: 'All tags',
    variants: {
      content: 'Content',
      tags: 'Tags',
      platforms: 'Platforms'
    },
    cards: {
      totalRows: 'Total records',
      newRows: 'New records',
      podcastRows: 'Podcast-ready'
    },
    table: {
      rank: 'No.',
      title: 'Title / Summary',
      platform: 'Platform',
      popularity: 'Popularity',
      publishedAt: 'Captured at',
      actions: 'Actions',
      detail: 'Detail'
    },
    status: {
      new: 'New',
      podcastReady: 'Podcast ready',
      pending: 'Pending'
    },
    empty: {
      title: 'No hotsearch records match the current filters',
      description: 'Try another date, platform, or clear the keyword.'
    }
  },
  tags: {
    table: {
      tag: 'Tag',
      count: 'Count'
    }
  },
  platforms: {
    table: {
      platform: 'Platform',
      count: 'Count'
    }
  },
  podcast: {
    description: 'Switch between morning/evening and short/long podcast variants with assets.',
    enterVariant: 'Open variant',
    scriptTitle: 'Sentence timeline',
    scriptDescription: 'Play the script sentence by sentence with waveform seeking.',
    playAll: 'Play all',
    pause: 'Pause',
    stop: 'Stop',
    openVideoModal: 'Full video',
    openAudioModal: 'Full audio',
    nowPlaying: 'Now playing: {text}',
    previousSentence: 'Previous',
    nextSentence: 'Next',
    totalSentences: 'Total sentences',
    currentSentence: 'Current sentence',
    totalDuration: 'Total duration',
    totalDurationDescription: 'Summed from all sentences in this script.',
    sentenceNumber: 'Audio no.',
    speaker: 'Speaker',
    notStarted: 'Idle',
    currentSentenceDescriptionIdle: 'Playback has not started yet.',
    fullMediaTitle: 'Full media files',
    fullMediaDescription: 'Preview the available full-length audio or video assets below.',
    emptyAssets: {
      title: 'No full media file for this platform yet',
      description: 'It will appear here once the platform-specific ad version is ready.'
    },
    variants: {
      morningShort: {
        title: 'Morning short',
        description: 'A lightweight morning version for fast-paced platforms.'
      },
      morningLong: {
        title: 'Morning long',
        description: 'A longer morning edition for audio and long-form video platforms.'
      },
      eveningShort: {
        title: 'Evening short',
        description: 'A short evening edition for evening publishing.'
      },
      eveningLong: {
        title: 'Evening long',
        description: 'A longer evening edition for audio and long-form video platforms.'
      }
    }
  },
  music: {
    description: 'Background music will be linked to the music table later.',
    empty: {
      title: 'Background music is not connected yet',
      description: 'This area will support library selection, preview, and binding later.'
    },
    moods: {
      calm: 'Calm',
      tense: 'Tense',
      warm: 'Warm'
    },
    status: {
      pending: 'Pending'
    },
    reserved: {
      ambientPiano: {
        title: 'Morning piano ambience',
        description: 'A light background option for the general morning edition.'
      },
      newsPulse: {
        title: 'News pulse rhythm',
        description: 'A faster background option for short video editions.'
      },
      nightWrap: {
        title: 'Night wrap ambience',
        description: 'A softer ending layer for the evening long edition.'
      }
    }
  },
  mediaPlatforms: {
    general: 'General',
    bilibili: 'Bilibili',
    toutiao: 'Toutiao',
    ixigua: 'Xigua',
    douyin: 'Douyin',
    xiaohongshu: 'Xiaohongshu',
    kuaishou: 'Kuaishou',
    weibo: 'Weibo',
    shengbo: 'Shengbo',
    youtube: 'YouTube',
    ximalaya: 'Ximalaya',
    qingtingfm: 'Qingting FM',
    wangyiPodcast: 'NetEase Podcast',
    pipixia: 'Pipixia',
    pipigaoxiao: 'Pipigaoxiao'
  }
};
