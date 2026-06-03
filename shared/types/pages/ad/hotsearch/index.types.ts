/**
 * 接口：热搜广告主素材。
 */
export interface IHotsearchAdMaterialAsset {
  /** 存储桶 */
  storageBucket: string;

  /** 文件键 */
  fileKey: string;

  /** 原始文件名 */
  originalName: string;

  /** MIME 类型 */
  mimeType: string;

  /** 文件扩展名 */
  fileExt: string;

  /** 文件大小（字节） */
  fileSizeBytes: number;

  /** 宽度 */
  width: number;

  /** 高度 */
  height: number;

  /** 时长（毫秒） */
  durationMs: number;
}

/**
 * 接口：热搜广告物料列表行。
 */
export interface IHotsearchAdMaterialSummaryRow {
  /** 主键 ID */
  id: number;

  /** 广告标题 */
  title: string;

  /** 广告类型 */
  adType: string;

  /** 素材类型 */
  materialType: string;

  /** 画幅类型 */
  frameType: string;

  /** 栏目范围 */
  editionScope: string;

  /** 价格 */
  price: number;

  /** 优先级 */
  priority: number;

  /** 是否启用 */
  isEnabled: boolean;

  /** 生效时间 */
  startAt: string;

  /** 失效时间 */
  endAt: string;

  /** 更新时间 */
  updatedAt: string;

  /** 创建时间 */
  createdAt: string;

  /** 主素材 */
  asset?: IHotsearchAdMaterialAsset | null;
}

/**
 * 接口：热搜广告物料分页结果。
 */
export interface IHotsearchAdMaterialPage {
  /** 行列表 */
  rows: IHotsearchAdMaterialSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：热搜广告物料保存结果。
 */
export interface IHotsearchAdMaterialSaveResult {
  /** 主键 ID */
  id: number;

  /** 是否新建 */
  created: boolean;
}

/**
 * 接口：热搜广告页属性。
 */
export interface IPageAdHotsearchProps {
  /** 创建 nonce */
  createNonce: number;
}

/**
 * 接口：热搜广告编辑表单。
 */
export interface IPageAdHotsearchEditorForm {
  /** 主键 ID */
  id: number;

  /** 标题 */
  title: string;

  /** 广告类型 */
  adType: 'oral' | 'picture_in_picture' | 'montage';

  /** 素材类型 */
  materialType: 'none' | 'image' | 'video';

  /** 画幅类型 */
  frameType: 'none' | 'landscape' | 'portrait';

  /** 栏目范围 */
  editionScopes: Array<'morning' | 'evening'>;

  /** 价格 */
  price: number;

  /** 优先级 */
  priority: number;

  /** 主素材 */
  asset: IPageAdHotsearchEditorAsset | null;

  /** 备注 */
  notes: string;

  /** 是否启用 */
  isEnabled: boolean;

  /** 生效时间 */
  startAt: string;

  /** 失效时间 */
  endAt: string;
}

/**
 * 接口：热搜广告编辑器主素材。
 */
export interface IPageAdHotsearchEditorAsset {
  /** 原始文件名 */
  originalName: string;

  /** MIME 类型 */
  mimeType: string;

  /** 文件扩展名 */
  fileExt: string;

  /** 文件大小（字节） */
  fileSizeBytes: number;

  /** 宽度 */
  width: number;

  /** 高度 */
  height: number;

  /** 时长（毫秒） */
  durationMs: number;

  /** 本地预览地址 */
  previewUrl: string;
}

/**
 * 接口：热搜广告列表表格行。
 */
export interface IPageTableColumnHotsearchAdMaterial {
  /** 主键 ID */
  id: number;

  /** 标题 */
  title: string;

  /** 广告类型 */
  adType: string;

  /** 素材类型 */
  materialType: string;

  /** 画幅类型 */
  frameType: string;

  /** 栏目范围 */
  editionScope: string;

  /** 价格文本 */
  priceText: string;

  /** 优先级 */
  priority: number;

  /** 是否启用 */
  isEnabled: boolean;

  /** 生效时间 */
  startAt: string;

  /** 失效时间 */
  endAt: string;

  /** 更新时间 */
  updatedAt: string;
}
