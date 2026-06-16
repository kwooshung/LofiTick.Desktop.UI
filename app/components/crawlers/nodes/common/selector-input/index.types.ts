export type TCrawlersNodesCommonSelectorType = 'xpath' | 'css';

export interface ICrawlersNodesCommonSelectorInputProps {
  modelValue: string;
  selectorType?: TCrawlersNodesCommonSelectorType;
  placeholder: string;
}
