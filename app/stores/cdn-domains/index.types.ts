/**
 * 接口：CDN
 */
export interface IStoresCdnDomains {
  /**
   * mail CDN 地址
   */
  mails: string;

  /**
   * 资源 CDN 地址
   */
  assets: string;

  /**
   * 文件 CDN 地址
   */
  files: string;

  /**
   * 下载 CDN 地址
   */
  downloads: string;
}
