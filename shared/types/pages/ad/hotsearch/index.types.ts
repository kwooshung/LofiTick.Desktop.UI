/**
 * 接口：热搜广告主素材。
 */
export interface IHotsearchAdMaterialAsset {
  /** 素材路径 */
  path: string;

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

  /** 裁剪开始时间（毫秒） */
  clipStartMs: number;

  /** 裁剪结束时间（毫秒） */
  clipEndMs: number;

  /** 横向位移比例 */
  posXRatio: number;

  /** 纵向位移比例 */
  posYRatio: number;

  /** 宽度缩放比例 */
  widthRatio: number;

  /** 高度缩放比例 */
  heightRatio: number;

  /** 图层顺序 */
  zIndex: number;
}

/**
 * 接口：热搜广告物料列表行。
 */
export interface IHotsearchAdMaterialSummaryRow {
  /** 主键 ID */
  id: number;

  /** 广告标题 */
  title: string;

  /** 呈现方式 */
  presentationType: string;

  /** 素材类型 */
  materialType: string;

  /** 画幅类型 */
  frameType: string;

  /** 栏目范围 */
  editionScope: string;

  /** 广告位置 */
  placementType: string;

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
 * 接口：热搜广告文案行。
 */
export interface IHotsearchAdMaterialLine {
  /** 行序号 */
  lineNo: number;

  /** 播报角色 */
  voiceKey: string;

  /** 文案内容 */
  content: string;
}

/**
 * 接口：热搜广告物料详情。
 */
export interface IHotsearchAdMaterialDetail extends IHotsearchAdMaterialSummaryRow {
  /** 广告文案行 */
  lines: IHotsearchAdMaterialLine[];

  /** 备注 */
  notes: string;

  /** 软删除时间 */
  deletedAt?: string | null;
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

  /** 呈现方式 */
  presentationType: 'voice' | 'pip' | 'montage';

  /** 素材类型 */
  materialType: 'none' | 'image' | 'video';

  /** 画幅类型 */
  frameType: 'none' | 'landscape' | 'portrait';

  /** 栏目范围 */
  editionScopes: Array<'morning' | 'evening'>;

  /** 广告位置 */
  placementType: 'opening' | 'closing';

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
  /** 远端素材路径 */
  path?: string;

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

  /** 裁剪开始时间（毫秒） */
  clipStartMs: number;

  /** 裁剪结束时间（毫秒） */
  clipEndMs: number;

  /** 横向位移比例 */
  posXRatio: number;

  /** 纵向位移比例 */
  posYRatio: number;

  /** 宽度缩放比例 */
  widthRatio: number;

  /** 高度缩放比例 */
  heightRatio: number;

  /** 图层顺序 */
  zIndex: number;

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

  /** 呈现方式 */
  presentationType: string;

  /** 素材类型 */
  materialType: string;

  /** 画幅类型 */
  frameType: string;

  /** 栏目范围 */
  editionScope: string;

  /** 广告位置 */
  placementType: string;

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

  /** 创建时间 */
  createdAt: string;
}
