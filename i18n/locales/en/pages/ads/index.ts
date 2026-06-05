export const ads = {
  title: 'Ads',
  filters: {
    allEditions: 'All Editions',
    allPlatforms: 'All Platforms',
    allStatuses: 'All Statuses',
    searchTitle: 'Search & Filters',
    searchDescription: 'Filter the ad list by title, edition, platform, and status.',
    triggerDefault: 'Search Ads',
    triggerFiltered: '{count} Filters Applied',
    keywordPlaceholder: 'Search ad title',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  actions: {
    create: 'Add Ad'
  },
  hotsearch: {
    table: {
      total: '{total} total',
      id: 'ID',
      summary: 'Ad Info',
      title: 'Title',
      editionScope: 'Edition',
      morning: 'Morning',
      evening: 'Evening',
      platform: 'Platform',
      priority: 'Priority',
      delivery: 'Delivery',
      type: 'Type',
      materialType: 'Material',
      frameType: 'Frame',
      placementType: 'Placement',
      price: 'Price',
      time: 'Time',
      effectiveRange: 'Start / End',
      auditTime: 'Updated / Created',
      startAt: 'Start Time',
      endAt: 'End Time',
      updatedAt: 'Updated At',
      createdAt: 'Created At',
      enabled: 'Enabled',
      actions: 'Actions',
      untitled: 'Untitled Ad'
    },
    status: {
      enabled: 'Enabled',
      disabled: 'Disabled'
    },
    labels: {
      presentation: {
        voice: 'Voice',
        pip: 'Picture in Picture',
        montage: 'Montage'
      },
      placement: {
        opening: 'Opening',
        closing: 'Closing',
        openingAd: 'Opening Ad',
        closingAd: 'Closing Ad'
      },
      material: {
        none: 'None',
        image: 'Image',
        video: 'Video'
      },
      frame: {
        none: 'None',
        landscape: 'Landscape',
        portrait: 'Portrait',
        landscapeShort: 'Wide',
        portraitShort: 'Tall'
      },
      edition: {
        morning: 'Morning',
        evening: 'Evening',
        both: 'Morning, Evening'
      },
      platform: {
        landscape: 'Bilibili / Toutiao / Xigua / Weibo / Pipixia / YouTube',
        portrait: 'Douyin / Xiaohongshu / Kuaishou',
        audio: 'Audio Platforms'
      },
      voice: {
        male: 'Male',
        female: 'Female',
        random: 'Random'
      }
    },
    editor: {
      createTitle: 'Add Ad',
      editTitle: 'Edit Ad',
      createDisabled: 'Save Disabled',
      createEnabled: 'Save and Enable',
      editDisabled: 'Update Disabled',
      editEnabled: 'Update and Enable',
      adTitle: 'Ad Content',
      adDescription: 'Edit ad copy line by line and reorder it by drag and drop.',
      emptyTitle: 'No Ad Content Yet',
      emptyDescription: 'Add one line of ad copy first, then reorder it by playback sequence.',
      contentPlaceholder: 'Enter ad narration'
    },
    detail: {
      description: 'Hotsearch podcast ad asset',
      mainAsset: 'Main Asset',
      assetName: 'Asset File',
      editionScope: 'Edition',
      platform: 'Platform',
      presentation: 'Presentation',
      materialType: 'Material Type',
      startAt: 'Start Time',
      endAt: 'End Time',
      updatedAt: 'Updated At',
      createdAt: 'Created At'
    },
    form: {
      title: 'Ad Title',
      titlePlaceholder: 'Enter ad title',
      editionScopes: 'Editions',
      placementType: 'Placement',
      presentationType: 'Presentation',
      materialType: 'Material Type',
      frameType: 'Frame Type',
      platformIds: 'Platforms',
      platformPlaceholder: 'Select platforms',
      price: 'Price',
      priority: 'Priority',
      startAt: 'Start Date',
      endAt: 'End Date',
      notes: 'Notes',
      notesPlaceholder: 'Record collaboration notes, podcast insertion hints, or scheduling remarks.'
    },
    picker: {
      selectDate: 'Select a date',
      selectImageTitle: 'Choose image asset',
      selectVideoTitle: 'Choose video asset',
      imageFile: 'Image Files',
      videoFile: 'Video Files'
    },
    validation: {
      titleRequired: 'Please enter an ad title',
      titleTooLong: 'The ad title must be 120 characters or fewer',
      editionScopesRequired: 'Select at least one edition',
      platformIdsRequired: 'Select at least one delivery platform',
      priceMin: 'Price must be greater than or equal to 0',
      priorityInteger: 'Priority must be an integer',
      assetOriginalNameRequired: 'Please choose an asset file',
      assetMimeInvalid: 'Invalid asset type',
      assetFileExtRequired: 'The asset extension is required',
      assetFileSizePositive: 'The asset size must be greater than 0',
      notesTooLong: 'Notes must be 500 characters or fewer',
      startAtRequired: 'Please select a start time',
      startAtInvalid: 'Invalid start time format',
      endAtRequired: 'Please select an end time',
      endAtInvalid: 'Invalid end time format',
      voiceMaterialMustBeNone: 'Voice presentation requires no asset material',
      nonVoiceMaterialRequired: 'Non-voice presentation requires an image or video asset',
      noneMaterialFrameMustBeNone: 'Ads without assets must use the none frame type',
      materialFrameRequired: 'Image or video assets must specify a frame type',
      assetRequired: 'Please select the matching image or video asset',
      imageAssetRequired: 'Image ads must upload an image asset',
      videoAssetRequired: 'Video ads must upload a video asset',
      endAtAfterStartAt: 'End time must be greater than or equal to start time',
      platformKindMismatch: 'Delivery platforms must match the current voice or frame type',
      adLineRequired: 'Please enter at least one line of ad copy',
      uploadAssetRequired: 'Please choose an asset file to upload'
    },
    materialPreview: {
      image: 'Image Asset',
      video: 'Video Asset',
      voice: 'Voice Asset'
    },
    actions: {
      view: 'View',
      chooseAsset: 'Choose Asset',
      reupload: 'Reupload',
      deleteAsset: 'Delete Asset',
      addSegment: 'Add Segment',
      cancel: 'Cancel',
      deleteConfirm: 'Delete this ad? This action cannot be undone.',
      confirmDelete: 'Confirm Delete'
    },
    toast: {
      imageOnly: 'Only image assets are supported here',
      videoOnly: 'Only video assets are supported here',
      assetUploadFailed: 'Asset upload failed',
      tauriWriteUnsupported: 'The current environment cannot write to the attachments directory',
      assetSignUrlFailed: 'Failed to get a signed ad asset URL',
      detailLoadFailed: 'Failed to load the ad details',
      updateFailed: 'Failed to update the ad',
      deleteFailed: 'Failed to delete the ad',
      deleteSuccess: 'The ad has been deleted',
      saveFailed: 'Failed to save the ad',
      previewLoadFailed: 'Failed to load the ad asset preview'
    },
    preview: {
      mainAsset: 'Main Asset',
      portraitHint: 'Portrait 9:16 preview area',
      landscapeHint: 'Landscape 16:9 preview area',
      selecting: 'Reading selected asset...',
      loading: 'Loading asset...',
      emptyPreview: 'No preview available',
      pathLabel: 'Asset Path: {path}',
      imageDropLabel: 'Drop image here',
      videoDropLabel: 'Drop video here',
      imageDropDescription: 'Common image formats are supported. Prepare a clear main visual in advance.',
      videoDropDescription: 'Common video formats are supported. Trim the final delivery clip first.'
    }
  }
};
