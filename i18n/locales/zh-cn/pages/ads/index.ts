export const ads = {
  title: '广告',
  filters: {
    allEditions: '全部栏目',
    allPlatforms: '全部平台',
    allStatuses: '全部状态',
    searchTitle: '搜索与筛选',
    searchDescription: '按标题、栏目、平台和状态组合筛选广告列表。',
    triggerDefault: '搜索广告',
    triggerFiltered: '已筛选 {count} 项',
    keywordPlaceholder: '搜索广告标题',
  },
  actions: {
    create: '添加广告'
  },
  hotsearch: {
    table: {
      total: '共 {total} 条',
      id: '编号',
      summary: '广告信息',
      title: '标题',
      editionScope: '栏目',
      morning: '早报',
      evening: '晚报',
      platform: '平台',
      priority: '优先级',
      delivery: '投放',
      type: '类型',
      materialType: '素材',
      frameType: '画幅',
      placementType: '位置',
      price: '价格',
      time: '时间',
      effectiveRange: '生效/失效',
      auditTime: '更新/创建',
      startAt: '生效时间',
      endAt: '失效时间',
      enabled: '启用',
      actions: '操作',
      untitled: '未命名广告'
    },
    status: {
      enabled: '启用中',
      disabled: '已停用'
    },
    labels: {
      presentation: {
        voice: '口播',
        pip: '画中画',
        montage: '拼接'
      },
      placement: {
        opening: '开头',
        closing: '结尾',
        openingAd: '开头广告',
        closingAd: '结尾广告'
      },
      material: {
        none: '无',
        image: '图片',
        video: '视频'
      },
      frame: {
        none: '无',
        landscape: '横屏',
        portrait: '竖屏',
        landscapeShort: '横版',
        portraitShort: '竖版'
      },
      edition: {
        morning: '早报',
        evening: '晚报',
        both: '早报、晚报'
      },
      platform: {
        landscape: 'B站/头条/西瓜视频/微博/皮皮虾/皮皮搞笑/YouTube',
        portrait: '抖音/小红书/快手',
        audio: '音频平台'
      },
      voice: {
        male: '男声',
        female: '女声',
        random: '随机'
      }
    },
    editor: {
      createTitle: '添加广告',
      editTitle: '修改广告',
      createDisabled: '保存不启用',
      createEnabled: '保存并启用',
      editDisabled: '修改但不启用',
      editEnabled: '修改并启用',
      adTitle: '广告内容',
      adDescription: '这部分用于编辑广告内容，支持逐句编辑和拖拽排序。',
      emptyTitle: '还没有广告内容',
      emptyDescription: '先添加一段广告文案，再按播报顺序拖拽调整。',
      contentPlaceholder: '输入广告播报内容'
    },
    detail: {
      description: '热搜播客广告物料',
      mainAsset: '主素材',
      assetName: '素材文件',
      copyTitle: '广告文案',
      copyDescription: '查看实际播报内容和备注，确认这条广告在播客里会如何被读出来。',
      copyCount: '共 {count} 句',
      copyIndexLabel: '稿',
      copyEmptyTitle: '还没有广告文案',
      copyEmptyDescription: '这条广告暂时没有可展示的播报内容。',
      emptyLine: '暂无文案内容',
      notes: '备注',
      editionScope: '适用栏目',
      platform: '投放平台',
      presentation: '呈现方式',
      materialType: '素材类型',
      startAt: '生效时间',
      endAt: '失效时间',
    },
    form: {
      title: '广告标题',
      titlePlaceholder: '请输入广告标题',
      editionScopes: '适用栏目',
      placementType: '广告位置',
      presentationType: '呈现方式',
      materialType: '素材类型',
      frameType: '画幅类型',
      platformIds: '投放平台',
      platformPlaceholder: '请选择投放平台',
      price: '价格',
      priority: '优先级',
      startAt: '生效日期',
      endAt: '失效日期',
      notes: '备注',
      notesPlaceholder: '记录合作说明、播客插入提示或排期备注。'
    },
    picker: {
      selectDate: '请选择日期',
      selectImageTitle: '选择图片素材',
      selectVideoTitle: '选择视频素材',
      imageFile: '图片文件',
      videoFile: '视频文件'
    },
    validation: {
      titleRequired: '请填写广告标题',
      titleTooLong: '广告标题不能超过 120 个字符',
      editionScopesRequired: '请至少选择一个适用栏目',
      platformIdsRequired: '请至少选择一个投放平台',
      priceMin: '价格必须大于等于 0',
      priorityInteger: '优先级必须是整数',
      assetOriginalNameRequired: '请选择素材文件',
      assetMimeInvalid: '素材类型不正确',
      assetFileExtRequired: '素材扩展名不能为空',
      assetFileSizePositive: '素材大小必须大于 0',
      notesTooLong: '备注不能超过 500 个字符',
      startAtRequired: '请选择生效时间',
      startAtInvalid: '生效时间格式不正确',
      endAtRequired: '请选择失效时间',
      endAtInvalid: '失效时间格式不正确',
      voiceMaterialMustBeNone: '口播呈现方式的素材类型必须是无素材',
      nonVoiceMaterialRequired: '非口播呈现方式必须选择图片或视频素材',
      noneMaterialFrameMustBeNone: '无素材广告的画幅类型必须是不区分',
      materialFrameRequired: '图片或视频素材必须指定画幅类型',
      assetRequired: '请选择对应的图片或视频素材',
      imageAssetRequired: '图片广告必须上传图片素材',
      videoAssetRequired: '视频广告必须上传视频素材',
      endAtAfterStartAt: '失效时间必须大于等于生效时间',
      platformKindMismatch: '投放平台必须匹配当前口播或画幅类型',
      adLineRequired: '请至少填写一句广告文案',
      uploadAssetRequired: '请选择要上传的素材文件'
    },
    materialPreview: {
      image: '图片素材',
      video: '视频素材',
      voice: '口播素材'
    },
    actions: {
      view: '查看',
      chooseAsset: '选择素材',
      reupload: '重新上传',
      deleteAsset: '删除素材',
      addSegment: '添加片段',
      cancel: '取消',
      deleteConfirm: '确认删除这条广告？此操作无法撤销。',
      confirmDelete: '确认删除'
    },
    toast: {
      imageOnly: '当前仅支持图片素材',
      videoOnly: '当前仅支持视频素材',
      assetUploadFailed: '素材上传失败',
      tauriWriteUnsupported: '当前环境不支持写入附件目录',
      assetSignUrlFailed: '获取广告素材签名地址失败',
      detailLoadFailed: '读取广告详情失败',
      updateFailed: '广告修改失败',
      deleteFailed: '广告删除失败',
      deleteSuccess: '广告已删除',
      saveFailed: '广告保存失败',
      previewLoadFailed: '加载广告素材预览失败'
    },
    preview: {
      mainAsset: '主素材',
      portraitHint: '竖屏 9:16 预览区域',
      landscapeHint: '横屏 16:9 预览区域',
      selecting: '正在读取所选素材...',
      loading: '正在加载素材...',
      emptyPreview: '暂无可预览素材',
      pathLabel: '素材路径：{path}',
      imageDropLabel: '把图片拖到这里',
      videoDropLabel: '把视频拖到这里',
      imageDropDescription: '支持常见图片格式，建议提前准备清晰主视觉。',
      videoDropDescription: '支持常见视频格式，建议先裁切到最终投放片段。'
    }
  }
};
