import type { TBasicSidePinDataType } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：变量可用的数据类型。
 */
export type TVariableValueDataType = Exclude<TBasicSidePinDataType, 'any' | 'exec'>;

/**
 * 接口：变量定义数据。
 */
export interface IVariableDefinitionData {
  /**
   * 属性：变量唯一标识。
   */
  id: string;

  /**
   * 属性：变量名称。
   */
  name: string;

  /**
   * 属性：变量数据类型。
   */
  dataType: TVariableValueDataType;

  /**
   * 属性：变量默认值。
   */
  defaultValue: unknown;
}

/**
 * 接口：设置变量节点数据。
 */
export interface IVariableSetNodeData {
  /**
   * 属性：变量定义列表。
   */
  variables?: IVariableDefinitionData[];
}

/**
 * 接口：获取变量节点数据。
 */
export interface IVariableGetNodeData {
  /**
   * 属性：已选择的变量 ID 列表。
   */
  selectedVariableIds?: string[];
}

/**
 * 接口：画布中的变量目录项。
 */
export interface IVariableCatalogItem extends IVariableDefinitionData {
  /**
   * 属性：所属节点 ID。
   */
  nodeId: string;

  /**
   * 属性：设置变量输入引脚 ID。
   */
  inputHandleId: string;

  /**
   * 属性：设置变量输出引脚 ID。
   */
  outputHandleId: string;

  /**
   * 属性：获取变量输入引脚 ID。
   */
  getterInputHandleId: string;

  /**
   * 属性：获取变量输出引脚 ID。
   */
  getterOutputHandleId: string;
}

/**
 * 接口：最小化的画布节点结构。
 */
interface IVariableCanvasNodeLike {
  id?: string;
  type?: string;
  data?: unknown;
}

/**
 * 接口：最小化的画布连线结构。
 */
interface IVariableCanvasEdgeLike {
  id?: string;
  source?: string | null;
  sourceHandle?: string | null;
  target?: string | null;
  targetHandle?: string | null;
}

/**
 * 常量：变量可选数据类型列表。
 */
const VARIABLE_VALUE_DATA_TYPES: TVariableValueDataType[] = ['string', 'number', 'boolean', 'array', 'object'];

/**
 * 函数：创建变量唯一标识。
 *
 * @returns {string} 新的变量唯一标识。
 */
export const variableDefinitionIdCreate = (): string => {
  return crypto.randomUUID();
};

/**
 * 函数：获取变量可选数据类型列表。
 *
 * @returns {TVariableValueDataType[]} 类型列表副本。
 */
export const variableValueDataTypesGet = (): TVariableValueDataType[] => {
  return [...VARIABLE_VALUE_DATA_TYPES];
};

/**
 * 函数：规范化变量名称。
 *
 * @param {string} name 变量名称。
 * @returns {string} 去除首尾空白后的变量名称。
 */
export const variableDefinitionNameNormalize = (name: string): string => {
  return String(name ?? '').trim();
};

/**
 * 函数：创建数据类型对应的默认值。
 *
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @returns {unknown} 对应的默认值。
 */
export const variableDefaultValueCreate = (dataType: TVariableValueDataType): unknown => {
  switch (dataType) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    case 'string':
    default:
      return '';
  }
};

/**
 * 函数：判断变量值是否与类型匹配。
 *
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @param {unknown} value 待校验的值。
 * @returns {boolean} 匹配返回 true，否则返回 false。
 */
export const variableValueMatchesDataType = (dataType: TVariableValueDataType, value: unknown): boolean => {
  switch (dataType) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    default:
      return false;
  }
};

/**
 * 函数：将变量值规范化为目标类型。
 *
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @param {unknown} value 原始值。
 * @returns {unknown} 规范化后的值。
 */
export const variableValueNormalize = (dataType: TVariableValueDataType, value: unknown): unknown => {
  if (variableValueMatchesDataType(dataType, value)) {
    return value;
  }

  return variableDefaultValueCreate(dataType);
};

/**
 * 函数：将对象或数组默认值格式化为 JSON 文本。
 *
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @param {unknown} value 变量值。
 * @returns {string} 可编辑的 JSON 文本。
 */
export const variableJsonTextGet = (dataType: TVariableValueDataType, value: unknown): string => {
  if (dataType !== 'array' && dataType !== 'object') {
    return '';
  }

  const normalizedValue = variableValueNormalize(dataType, value);

  return JSON.stringify(normalizedValue, null, 2);
};

/**
 * 函数：解析 JSON 编辑文本并校验变量类型。
 *
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @param {string} jsonText JSON 文本。
 * @returns {unknown | null} 解析成功返回值，失败返回 null。
 */
export const variableJsonTextParse = (dataType: TVariableValueDataType, jsonText: string): unknown | null => {
  if (dataType !== 'array' && dataType !== 'object') {
    return null;
  }

  try {
    const parsedValue = JSON.parse(String(jsonText ?? ''));

    return variableValueMatchesDataType(dataType, parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

/**
 * 函数：解析未知来源的变量定义列表。
 *
 * @param {unknown} value 未知来源的变量定义数据。
 * @returns {IVariableDefinitionData[]} 规范化后的变量定义列表。
 */
export const variableDefinitionsParse = (value: unknown): IVariableDefinitionData[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (item === null || typeof item !== 'object') {
        return null;
      }

      const rawItem = item as Record<string, unknown>;
      const rawType = String(rawItem.dataType ?? 'string');
      const dataType = VARIABLE_VALUE_DATA_TYPES.includes(rawType as TVariableValueDataType) ? (rawType as TVariableValueDataType) : 'string';

      return {
        id: String(rawItem.id ?? variableDefinitionIdCreate()),
        name: String(rawItem.name ?? ''),
        dataType,
        defaultValue: variableValueNormalize(dataType, rawItem.defaultValue)
      } satisfies IVariableDefinitionData;
    })
    .filter((item): item is IVariableDefinitionData => item !== null);
};

/**
 * 函数：获取设置变量输入引脚 ID。
 *
 * @param {string} variableId 变量 ID。
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @returns {string} 输入引脚 ID。
 */
export const variableInputHandleIdGet = (variableId: string, dataType: TVariableValueDataType): string => {
  return `variable-input-${variableId}-${dataType}`;
};

/**
 * 函数：获取设置变量输出引脚 ID。
 *
 * @param {string} variableId 变量 ID。
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @returns {string} 输出引脚 ID。
 */
export const variableOutputHandleIdGet = (variableId: string, dataType: TVariableValueDataType): string => {
  return `variable-output-${variableId}-${dataType}`;
};

/**
 * 函数：获取获取变量节点的输出引脚 ID。
 *
 * @param {string} variableId 变量 ID。
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @returns {string} 获取变量节点输出引脚 ID。
 */
export const variableGetOutputHandleIdGet = (variableId: string, dataType: TVariableValueDataType): string => {
  return `variable-selected-output-${variableId}-${dataType}`;
};

/**
 * 函数：获取获取变量节点的输入引脚 ID。
 *
 * @param {string} variableId 变量 ID。
 * @param {TVariableValueDataType} dataType 变量数据类型。
 * @returns {string} 获取变量节点输入引脚 ID。
 */
export const variableGetInputHandleIdGet = (variableId: string, dataType: TVariableValueDataType): string => {
  return `variable-selected-input-${variableId}-${dataType}`;
};

/**
 * 函数：收集当前画布中已定义的变量目录。
 *
 * @param {IVariableCanvasNodeLike[]} canvasNodes 当前画布节点列表。
 * @returns {IVariableCatalogItem[]} 变量目录列表。
 */
export const variableCatalogCollect = (canvasNodes: IVariableCanvasNodeLike[]): IVariableCatalogItem[] => {
  return canvasNodes.flatMap((canvasNode) => {
    if (String(canvasNode.type ?? '') !== 'variable-set') {
      return [];
    }

    return variableDefinitionsParse((canvasNode.data as IVariableSetNodeData | undefined)?.variables).map((variableDefinition) => {
      return {
        ...variableDefinition,
        nodeId: String(canvasNode.id ?? ''),
        inputHandleId: variableInputHandleIdGet(variableDefinition.id, variableDefinition.dataType),
        outputHandleId: variableOutputHandleIdGet(variableDefinition.id, variableDefinition.dataType),
        getterInputHandleId: variableGetInputHandleIdGet(variableDefinition.id, variableDefinition.dataType),
        getterOutputHandleId: variableGetOutputHandleIdGet(variableDefinition.id, variableDefinition.dataType)
      } satisfies IVariableCatalogItem;
    });
  });
};

/**
 * 函数：收集变量改类型时需要断开的连线 ID。
 *
 * @param {IVariableCanvasNodeLike[]} canvasNodes 当前画布节点列表。
 * @param {IVariableCanvasEdgeLike[]} canvasEdges 当前画布连线列表。
 * @param {string} setNodeId 设置变量节点 ID。
 * @param {string} variableId 变量 ID。
 * @param {TVariableValueDataType} previousType 变量修改前的数据类型。
 * @returns {string[]} 需要移除的连线 ID 列表。
 */
export const variableTypeChangeAffectedEdgeIdsCollect = (canvasNodes: IVariableCanvasNodeLike[], canvasEdges: IVariableCanvasEdgeLike[], setNodeId: string, variableId: string, previousType: TVariableValueDataType): string[] => {
  const inputHandleId = variableInputHandleIdGet(variableId, previousType);
  const outputHandleId = variableOutputHandleIdGet(variableId, previousType);
  const getterNodeIds = canvasNodes
    .filter((canvasNode) => String(canvasNode.type ?? '') === 'variable-get')
    .filter((canvasNode) => {
      const selectedIds = (canvasNode.data as IVariableGetNodeData | undefined)?.selectedVariableIds;

      return Array.isArray(selectedIds) && selectedIds.includes(variableId);
    })
    .map((canvasNode) => String(canvasNode.id ?? ''));
  const getterInputHandleId = variableGetInputHandleIdGet(variableId, previousType);
  const getterOutputHandleId = variableGetOutputHandleIdGet(variableId, previousType);

  return canvasEdges
    .filter((canvasEdge) => {
      return (
        (String(canvasEdge.target ?? '') === setNodeId && String(canvasEdge.targetHandle ?? '') === inputHandleId) ||
        (String(canvasEdge.source ?? '') === setNodeId && String(canvasEdge.sourceHandle ?? '') === outputHandleId) ||
        (getterNodeIds.includes(String(canvasEdge.target ?? '')) && String(canvasEdge.targetHandle ?? '') === getterInputHandleId) ||
        (getterNodeIds.includes(String(canvasEdge.source ?? '')) && String(canvasEdge.sourceHandle ?? '') === getterOutputHandleId)
      );
    })
    .map((canvasEdge) => String(canvasEdge.id ?? ''))
    .filter((edgeId) => edgeId !== '');
};
