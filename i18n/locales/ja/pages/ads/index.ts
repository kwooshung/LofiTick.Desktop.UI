export const ads = {
  title: '広告',
  filters: {
    allEditions: 'すべての欄目',
    allPlatforms: 'すべての配信先',
    allStatuses: 'すべての状態',
    searchTitle: '検索と絞り込み',
    searchDescription: 'タイトル、欄目、配信先、状態を組み合わせて広告一覧を絞り込みます。',
    triggerDefault: '広告を検索',
    triggerFiltered: '{count} 件の条件で絞り込み中',
    keywordPlaceholder: '広告タイトルを検索',
    enabled: '有効',
    disabled: '無効'
  },
  actions: {
    create: '広告を追加'
  },
  hotsearch: {
    table: {
      total: '合計 {total} 件',
      id: 'ID',
      summary: '広告情報',
      title: 'タイトル',
      editionScope: '欄目',
      morning: '朝刊',
      evening: '夕刊',
      platform: 'プラットフォーム',
      priority: '優先度',
      delivery: '配信',
      type: 'タイプ',
      materialType: '素材',
      frameType: '画角',
      placementType: '位置',
      price: '価格',
      time: '時間',
      effectiveRange: '開始 / 終了',
      auditTime: '更新 / 作成',
      startAt: '開始時刻',
      endAt: '終了時刻',
      updatedAt: '更新時刻',
      createdAt: '作成時刻',
      enabled: '有効',
      actions: '操作',
      untitled: '名称未設定の広告'
    },
    status: {
      enabled: '有効中',
      disabled: '無効'
    },
    labels: {
      presentation: {
        voice: '音声',
        pip: 'ピクチャーインピクチャー',
        montage: 'モンタージュ'
      },
      placement: {
        opening: '冒頭',
        closing: '末尾',
        openingAd: '冒頭広告',
        closingAd: '末尾広告'
      },
      material: {
        none: 'なし',
        image: '画像',
        video: '動画'
      },
      frame: {
        none: 'なし',
        landscape: '横長',
        portrait: '縦長',
        landscapeShort: '横版',
        portraitShort: '縦版'
      },
      edition: {
        morning: '朝刊',
        evening: '夕刊',
        both: '朝刊・夕刊'
      },
      platform: {
        landscape: 'Bilibili / Toutiao / Xigua / Weibo / YouTube',
        portrait: 'Douyin / Xiaohongshu / Kuaishou',
        audio: '音声プラットフォーム'
      },
      voice: {
        male: '男性',
        female: '女性',
        random: 'ランダム'
      }
    },
    editor: {
      createTitle: '広告を追加',
      editTitle: '広告を編集',
      createDisabled: '無効のまま保存',
      createEnabled: '保存して有効化',
      editDisabled: '更新して無効のまま',
      editEnabled: '更新して有効化',
      adTitle: '広告内容',
      adDescription: '広告原稿を行ごとに編集し、ドラッグで並べ替えできます。',
      emptyTitle: '広告内容がありません',
      emptyDescription: 'まず広告原稿を追加し、読み上げ順に並べ替えてください。',
      contentPlaceholder: '広告ナレーションを入力'
    },
    detail: {
      description: 'ホットサーチポッドキャスト広告素材',
      mainAsset: 'メイン素材',
      editionScope: '適用欄目',
      materialType: '素材タイプ',
      startAt: '開始時刻',
      endAt: '終了時刻',
      updatedAt: '更新時刻',
      createdAt: '作成時刻'
    },
    form: {
      title: '広告タイトル',
      titlePlaceholder: '広告タイトルを入力',
      editionScopes: '適用欄目',
      placementType: '広告位置',
      presentationType: '表示方式',
      materialType: '素材タイプ',
      frameType: '画角タイプ',
      platformIds: '配信プラットフォーム',
      platformPlaceholder: '配信先を選択',
      price: '価格',
      priority: '優先度',
      startAt: '開始日',
      endAt: '終了日',
      notes: 'メモ',
      notesPlaceholder: 'コラボ説明、挿入ヒント、配信メモを記録します。'
    },
    picker: {
      selectDate: '日付を選択',
      selectImageTitle: '画像素材を選択',
      selectVideoTitle: '動画素材を選択',
      imageFile: '画像ファイル',
      videoFile: '動画ファイル'
    },
    validation: {
      titleRequired: '広告タイトルを入力してください',
      titleTooLong: '広告タイトルは 120 文字以内で入力してください',
      editionScopesRequired: '少なくとも 1 つの欄目を選択してください',
      platformIdsRequired: '少なくとも 1 つの配信先を選択してください',
      priceMin: '価格は 0 以上である必要があります',
      priorityInteger: '優先度は整数である必要があります',
      assetOriginalNameRequired: '素材ファイルを選択してください',
      assetMimeInvalid: '素材タイプが正しくありません',
      assetFileExtRequired: '素材の拡張子は必須です',
      assetFileSizePositive: '素材サイズは 0 より大きい必要があります',
      notesTooLong: 'メモは 500 文字以内で入力してください',
      startAtRequired: '開始時刻を選択してください',
      startAtInvalid: '開始時刻の形式が正しくありません',
      endAtRequired: '終了時刻を選択してください',
      endAtInvalid: '終了時刻の形式が正しくありません',
      voiceMaterialMustBeNone: '音声表示では素材タイプをなしにする必要があります',
      nonVoiceMaterialRequired: '音声以外の表示では画像または動画素材が必要です',
      noneMaterialFrameMustBeNone: '素材なし広告では画角タイプをなしにする必要があります',
      materialFrameRequired: '画像または動画素材では画角タイプの指定が必要です',
      assetRequired: '対応する画像または動画素材を選択してください',
      imageAssetRequired: '画像広告では画像素材をアップロードする必要があります',
      videoAssetRequired: '動画広告では動画素材をアップロードする必要があります',
      endAtAfterStartAt: '終了時刻は開始時刻以上である必要があります',
      platformKindMismatch: '配信先は現在の音声または画角タイプに一致する必要があります',
      adLineRequired: '少なくとも 1 行の広告原稿を入力してください',
      uploadAssetRequired: 'アップロードする素材ファイルを選択してください'
    },
    materialPreview: {
      image: '画像素材',
      video: '動画素材',
      voice: '音声素材'
    },
    actions: {
      view: '表示',
      chooseAsset: '素材を選択',
      reupload: '再アップロード',
      deleteAsset: '素材を削除',
      addSegment: 'セグメントを追加',
      cancel: 'キャンセル',
      deleteConfirm: 'この広告を削除しますか？この操作は元に戻せません。',
      confirmDelete: '削除を確認'
    },
    toast: {
      imageOnly: 'ここでは画像素材のみ対応しています',
      videoOnly: 'ここでは動画素材のみ対応しています',
      assetUploadFailed: '素材のアップロードに失敗しました',
      tauriWriteUnsupported: '現在の環境では添付ディレクトリへ書き込めません',
      assetSignUrlFailed: '広告素材の署名付き URL の取得に失敗しました',
      detailLoadFailed: '広告詳細の読み込みに失敗しました',
      updateFailed: '広告の更新に失敗しました',
      deleteFailed: '広告の削除に失敗しました',
      deleteSuccess: '広告を削除しました',
      saveFailed: '広告の保存に失敗しました',
      previewLoadFailed: '広告素材プレビューの読み込みに失敗しました'
    },
    preview: {
      mainAsset: 'メイン素材',
      portraitHint: '縦型 9:16 プレビュー領域',
      landscapeHint: '横型 16:9 プレビュー領域',
      selecting: '選択した素材を読み込み中...',
      loading: '素材を読み込み中...',
      emptyPreview: 'プレビュー可能な素材がありません',
      pathLabel: '素材パス：{path}',
      imageDropLabel: 'ここに画像をドロップ',
      videoDropLabel: 'ここに動画をドロップ',
      imageDropDescription: '一般的な画像形式に対応しています。鮮明なメインビジュアルを事前に用意してください。',
      videoDropDescription: '一般的な動画形式に対応しています。最終配信用のクリップを先にトリミングしてください。'
    }
  }
};
