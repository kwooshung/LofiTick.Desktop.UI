import type { IVariableDefinitionData, TVariableValueDataType } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 接口：设置变量节点中的变量编辑项。
 */
export interface IVariableSetEditorItem extends IVariableDefinitionData {
  /**
   * 属性：数组或对象类型使用的 JSON 编辑文本。
   */
  jsonText: string;
}

/**
 * 接口：变量类型改动待确认状态。
 */
export interface IVariableSetTypeChangePendingState {
  /**
   * 属性：目标变量 ID。
   */
  variableId: string;

  /**
   * 属性：修改前的数据类型。
   */
  previousType: TVariableValueDataType;

  /**
   * 属性：修改后的数据类型。
   */
  nextType: TVariableValueDataType;

  /**
   * 属性：会被断开的连线 ID 列表。
   */
  affectedEdgeIds: string[];
}
