/**
 * 函数：编码爬虫蓝图 nodes 传输值。
 * @param {unknown} nodes 蓝图图数据。
 * @returns {string} URI 编码后的 JSON 文本。
 */
export const crawlerBlueprintNodesTransportEncode = (nodes: unknown): string => {
  const normalizedNodes = nodes && typeof nodes === 'object' && !Array.isArray(nodes) ? nodes : {};

  return encodeURIComponent(JSON.stringify(normalizedNodes));
};
