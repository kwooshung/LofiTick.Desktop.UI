export const ads = {
  title: '廣告',
  filters: {
    allEditions: '全部欄目',
    allPlatforms: '全部平台',
    allStatuses: '全部狀態',
    keywordPlaceholder: '搜尋廣告標題',
    enabled: '啟用',
    disabled: '停用'
  },
  actions: {
    create: '新增廣告'
  },
  hotsearch: {
    table: {
      total: '共 {total} 條',
      id: '編號',
      summary: '廣告資訊',
      title: '標題',
      editionScope: '欄目',
      morning: '早報',
      evening: '晚報',
      platform: '平台',
      priority: '優先級',
      delivery: '投放',
      type: '類型',
      materialType: '素材',
      frameType: '畫幅',
      placementType: '位置',
      price: '價格',
      time: '時間',
      effectiveRange: '生效/失效',
      auditTime: '更新/建立',
      startAt: '生效時間',
      endAt: '失效時間',
      updatedAt: '更新時間',
      createdAt: '建立時間',
      enabled: '啟用',
      actions: '操作',
      untitled: '未命名廣告'
    },
    status: {
      enabled: '啟用中',
      disabled: '已停用'
    },
    labels: {
      presentation: {
        voice: '口播',
        pip: '畫中畫',
        montage: '拼接'
      },
      placement: {
        opening: '開頭',
        closing: '結尾',
        openingAd: '開頭廣告',
        closingAd: '結尾廣告'
      },
      material: {
        none: '無',
        image: '圖片',
        video: '影片'
      },
      frame: {
        none: '無',
        landscape: '橫屏',
        portrait: '豎屏',
        landscapeShort: '橫版',
        portraitShort: '豎版'
      },
      edition: {
        morning: '早報',
        evening: '晚報',
        both: '早報、晚報'
      },
      platform: {
        landscape: 'B站/頭條/西瓜視頻/微博/皮皮蝦/YouTube',
        portrait: '抖音/小紅書/快手',
        audio: '音訊平台'
      },
      voice: {
        male: '男聲',
        female: '女聲',
        random: '隨機'
      }
    },
    editor: {
      createTitle: '新增廣告',
      editTitle: '修改廣告',
      createDisabled: '儲存不啟用',
      createEnabled: '儲存並啟用',
      editDisabled: '修改但不啟用',
      editEnabled: '修改並啟用',
      adTitle: '廣告內容',
      adDescription: '這裡用於編輯廣告文案，支援逐句編輯與拖拽排序。',
      emptyTitle: '尚無廣告內容',
      emptyDescription: '先新增一段廣告文案，再依播報順序拖拽調整。',
      contentPlaceholder: '輸入廣告播報內容'
    },
    detail: {
      description: '熱搜播客廣告素材',
      mainAsset: '主素材',
      editionScope: '適用欄目',
      materialType: '素材類型',
      startAt: '生效時間',
      endAt: '失效時間',
      updatedAt: '更新時間',
      createdAt: '建立時間'
    },
    form: {
      title: '廣告標題',
      titlePlaceholder: '請輸入廣告標題',
      editionScopes: '適用欄目',
      placementType: '廣告位置',
      presentationType: '呈現方式',
      materialType: '素材類型',
      frameType: '畫幅類型',
      platformIds: '投放平台',
      platformPlaceholder: '請選擇投放平台',
      price: '價格',
      priority: '優先級',
      startAt: '生效日期',
      endAt: '失效日期',
      notes: '備註',
      notesPlaceholder: '記錄合作說明、播客插入提示或排期備註。'
    },
    picker: {
      selectDate: '請選擇日期',
      selectImageTitle: '選擇圖片素材',
      selectVideoTitle: '選擇影片素材',
      imageFile: '圖片檔案',
      videoFile: '影片檔案'
    },
    validation: {
      titleRequired: '請填寫廣告標題',
      titleTooLong: '廣告標題不能超過 120 個字元',
      editionScopesRequired: '請至少選擇一個適用欄目',
      platformIdsRequired: '請至少選擇一個投放平台',
      priceMin: '價格必須大於等於 0',
      priorityInteger: '優先級必須是整數',
      assetOriginalNameRequired: '請選擇素材檔案',
      assetMimeInvalid: '素材類型不正確',
      assetFileExtRequired: '素材副檔名不能為空',
      assetFileSizePositive: '素材大小必須大於 0',
      notesTooLong: '備註不能超過 500 個字元',
      startAtRequired: '請選擇生效時間',
      startAtInvalid: '生效時間格式不正確',
      endAtRequired: '請選擇失效時間',
      endAtInvalid: '失效時間格式不正確',
      voiceMaterialMustBeNone: '口播呈現方式的素材類型必須為無素材',
      nonVoiceMaterialRequired: '非口播呈現方式必須選擇圖片或影片素材',
      noneMaterialFrameMustBeNone: '無素材廣告的畫幅類型必須是不區分',
      materialFrameRequired: '圖片或影片素材必須指定畫幅類型',
      assetRequired: '請選擇對應的圖片或影片素材',
      imageAssetRequired: '圖片廣告必須上傳圖片素材',
      videoAssetRequired: '影片廣告必須上傳影片素材',
      endAtAfterStartAt: '失效時間必須大於等於生效時間',
      platformKindMismatch: '投放平台必須匹配目前的口播或畫幅類型',
      adLineRequired: '請至少填寫一句廣告文案',
      uploadAssetRequired: '請選擇要上傳的素材檔案'
    },
    materialPreview: {
      image: '圖片素材',
      video: '影片素材',
      voice: '口播素材'
    },
    actions: {
      view: '查看',
      chooseAsset: '選擇素材',
      reupload: '重新上傳',
      deleteAsset: '刪除素材',
      addSegment: '新增片段',
      cancel: '取消',
      deleteConfirm: '確認刪除這條廣告？此操作無法撤銷。',
      confirmDelete: '確認刪除'
    },
    toast: {
      imageOnly: '目前僅支援圖片素材',
      videoOnly: '目前僅支援影片素材',
      assetUploadFailed: '素材上傳失敗',
      tauriWriteUnsupported: '目前環境不支援寫入附件目錄',
      assetSignUrlFailed: '取得廣告素材簽名地址失敗',
      detailLoadFailed: '讀取廣告詳情失敗',
      updateFailed: '廣告修改失敗',
      deleteFailed: '廣告刪除失敗',
      deleteSuccess: '廣告已刪除',
      saveFailed: '廣告儲存失敗',
      previewLoadFailed: '載入廣告素材預覽失敗'
    },
    preview: {
      mainAsset: '主素材',
      portraitHint: '豎屏 9:16 預覽區域',
      landscapeHint: '橫屏 16:9 預覽區域',
      selecting: '正在讀取所選素材...',
      loading: '正在載入素材...',
      emptyPreview: '暫無可預覽素材',
      pathLabel: '素材路徑：{path}',
      imageDropLabel: '把圖片拖到這裡',
      videoDropLabel: '把影片拖到這裡',
      imageDropDescription: '支援常見圖片格式，建議提前準備清晰主視覺。',
      videoDropDescription: '支援常見影片格式，建議先裁切到最終投放片段。'
    }
  }
};
