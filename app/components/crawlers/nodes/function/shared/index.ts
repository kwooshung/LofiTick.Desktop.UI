import type { IVariableDefinitionData, TVariableValueDataType } from '@/components/crawlers/nodes/variable/shared/index';
import { variableDefaultValueCreate, variableDefinitionIdCreate, variableDefinitionNameNormalize, variableDefinitionsParse, variableJsonTextGet, variableValueDataTypesGet } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 类型：函数节点数据负载。
 */
export interface IFunctionNodeMetaData {
  /**
   * 属性：函数名称。
   */
  functionName?: string;

  /**
   * 属性：函数描述。
   */
  functionDescription?: string;

  /**
   * 属性：函数参数定义列表。
   */
  functionParameters?: unknown;

  /**
   * 属性：函数返回值定义列表。
   */
  functionReturns?: unknown;
}

/**
 * 类型：函数节点参数定义。
 */
export interface IFunctionNodePinDefinition extends IVariableDefinitionData {}

/**
 * 函数：创建函数节点引脚定义。
 *
 * # Arguments
 *
 * * `pinDefinition` - 原始引脚定义。
 *
 * # Returns
 *
 * 返回一个完整的引脚定义，包含默认值与规范化名称。
 */
export const functionNodePinDefinitionCreate = (pinDefinition?: Partial<IVariableDefinitionData>): IFunctionNodePinDefinition => {
  /**
   * 常量：dataType。
   */
  const dataType = variableValueDataTypesGet().includes(String(pinDefinition?.dataType ?? '') as TVariableValueDataType) ? (String(pinDefinition?.dataType ?? '') as TVariableValueDataType) : 'string';
  /**
   * 常量：defaultValue。
   */
  const defaultValue = pinDefinition?.defaultValue ?? variableDefaultValueCreate(dataType);

  return {
    id: String(pinDefinition?.id ?? variableDefinitionIdCreate()),
    name: variableDefinitionNameNormalize(String(pinDefinition?.name ?? '')),
    dataType,
    defaultValue
  };
};

/**
 * 函数：解析函数节点引脚定义列表。
 *
 * # Arguments
 *
 * * `value` - 未知来源的引脚列表。
 *
 * # Returns
 *
 * 返回规范化后的函数节点引脚定义列表。
 */
export const functionNodePinDefinitionsParse = (value: unknown): IFunctionNodePinDefinition[] => {
  return variableDefinitionsParse(value).map((item) => functionNodePinDefinitionCreate(item));
};

/**
 * 函数：将函数节点引脚定义列表序列化为稳定签名。
 *
 * # Arguments
 *
 * * `pinDefinitions` - 引脚定义列表。
 *
 * # Returns
 *
 * 返回一个稳定签名，用于比较引脚结构变化。
 */
export const functionNodePinSignatureGet = (pinDefinitions: IFunctionNodePinDefinition[]): string => {
  return pinDefinitions.map((item) => `${item.id}:${item.dataType}:${item.name}`).join('|');
};

/**
 * 函数：解析函数节点元数据。
 *
 * # Arguments
 *
 * * `value` - 未知来源的节点数据。
 *
 * # Returns
 *
 * 返回标准化后的函数节点元数据。
 */
export const functionNodeMetaParse = (value: unknown): IFunctionNodeMetaData & { functionParameters: IFunctionNodePinDefinition[]; functionReturns: IFunctionNodePinDefinition[] } => {
  /**
   * 常量：data。
   */
  const data = value as Record<string, unknown> | undefined;

  return {
    functionName: String(data?.functionName ?? '').trim(),
    functionDescription: String(data?.functionDescription ?? '').trim(),
    functionParameters: functionNodePinDefinitionsParse(data?.functionParameters),
    functionReturns: functionNodePinDefinitionsParse(data?.functionReturns)
  };
};

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('functionNode helpers', () => {
    it('parses function node metadata into normalized values', () => {
      expect(
        functionNodeMetaParse({
          functionName: '  Demo  ',
          functionDescription: '  Flow  ',
          functionParameters: [{ id: 'a', name: '  foo  ', dataType: 'number', defaultValue: 3 }],
          functionReturns: [{ id: 'b', name: ' bar ', dataType: 'string', defaultValue: 'x' }]
        })
      ).toEqual({
        functionName: 'Demo',
        functionDescription: 'Flow',
        functionParameters: [{ id: 'a', name: 'foo', dataType: 'number', defaultValue: 3 }],
        functionReturns: [{ id: 'b', name: 'bar', dataType: 'string', defaultValue: 'x' }]
      });
    });

    it('creates stable signatures for pin collections', () => {
      expect(
        functionNodePinSignatureGet([
          { id: 'a', name: 'foo', dataType: 'string', defaultValue: '' },
          { id: 'b', name: 'bar', dataType: 'number', defaultValue: 0 }
        ])
      ).toBe('a:string:foo|b:number:bar');
    });
  });
}
