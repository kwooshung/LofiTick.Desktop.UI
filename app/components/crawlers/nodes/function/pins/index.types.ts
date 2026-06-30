import type { IVariableDefinitionData } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 接口：函数节点引脚编辑器属性。
 */
export interface ICrawlersNodesFunctionPinsProps {
  /**
   * 属性：当前引脚定义列表。
   */
  modelValue: IVariableDefinitionData[];

  /**
   * 属性：节点 ID。
   */
  nodeId: string;

  /**
   * 属性：引脚方向。
   */
  direction: 'input' | 'output';

  /**
   * 属性：空态标题。
   */
  emptyTitle: string;

  /**
   * 属性：空态说明。
   */
  emptyDescription: string;

  /**
   * 属性：空态操作按钮文案。
   */
  emptyActionLabel: string;

  /**
   * 属性：列表下方新增按钮文案。
   */
  addActionLabel: string;

  /**
   * 属性：引脚名称占位文案。
   */
  namePlaceholder: string;

  /**
   * 属性：字符串默认值占位文案。
   */
  stringPlaceholder: string;

  /**
   * 属性：JSON 默认值占位文案。
   */
  jsonPlaceholder: string;

  /**
   * 属性：是否显示默认值编辑区。
   */
  showDefaultValue?: boolean;
}

/**
 * 接口：函数节点引脚编辑项。
 */
export interface ICrawlersNodesFunctionPinsEditorItem extends IVariableDefinitionData {
  /**
   * 属性：数组或对象类型使用的 JSON 编辑文本。
   */
  jsonText: string;
}
