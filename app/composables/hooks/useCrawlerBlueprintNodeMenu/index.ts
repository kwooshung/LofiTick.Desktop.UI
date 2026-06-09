import type { ContextMenuItem } from '@nuxt/ui';

import type { ICrawlerBlueprintNodeMenuGroup, ICrawlerBlueprintNodeMenuItem } from '@/composables/hooks/useCrawlerBlueprintNodeMenu/index.types';

/**
 * Hook：爬虫蓝图节点右键菜单。
 *
 * 提供按功能分组的节点菜单，并维护最近使用节点顺序。
 *
 * # Returns
 *
 * 返回构建右键菜单与记录最近节点的能力。
 */
export const useCrawlerBlueprintNodeMenu = () => {
  /**
   * Hook：国际化。
   */
  const { t: rawT } = useI18n();

  /**
   * 函数：翻译蓝图节点文案。
   *
   * 分组文案沿用现有路径，节点项文案自动补齐缺失的 `nodes` 层级。
   *
   * # Arguments
   *
   * * `key` - 翻译 key。
   *
   * # Returns
   *
   * 返回对应语言文案；缺失时由 i18n 保持原 key 兜底。
   */
  const t = (key: string): string => {
    if (key.startsWith('pages.crawlers.blueprint.nodes.groups.')) {
      return rawT(key);
    }

    return rawT(key.replace('pages.crawlers.blueprint.nodes.', 'pages.crawlers.blueprint.nodes.nodes.'));
  };

  /**
   * 状态：最近使用节点 key 列表。
   */
  const stateRecentNodeKeys = useState<string[]>('crawlers-blueprint-recent-node-keys', () => []);

  /**
   * 常量：最近使用节点上限。
   */
  const recentLimit = 15;

  /**
   * 常量：蓝图分组显示顺序。
   */
  const catalogGroupOrder = [
    'variable',
    'flow',
    'request',
    'parser',
    'compare',
    'logic-op',
    'logic',
    'function',
    'array',
    'string',
    'object',
    'math',
    'convert',
    'storage',
    'delay',
    'anti-bot',
    'debug',
    'helper',
    'browser',
    'element',
    'element-wait',
    'form',
    'context',
    'cookie',
    'network',
    'js'
  ] as const;

  /**
   * 常量：需要显式整理的分组节点顺序。
   */
  const catalogItemOrder = new Map<string, readonly string[]>([['variable', ['logic.set', 'logic.get', 'logic.boolean', 'logic.integer', 'logic.float', 'logic.string', 'logic.array', 'logic.object', 'logic.null']]]);

  /**
   * 函数：按学习顺序归一化节点目录。
   *
   * 会同时去除重复节点项，避免菜单中出现重复入口。
   *
   * # Arguments
   *
   * * `groups` - 原始节点分组。
   *
   * # Returns
   *
   * 返回按预设顺序排序后的节点分组。
   */
  const normalizeCrawlerBlueprintCatalog = (groups: ICrawlerBlueprintNodeMenuGroup[]): ICrawlerBlueprintNodeMenuGroup[] => {
    const groupOrderMap = new Map<string, number>(catalogGroupOrder.map((key, index) => [key, index]));

    return groups
      .map((group, groupIndex) => {
        const seenItemKeys = new Set<string>();
        const dedupedItems = group.items.filter((item) => {
          if (seenItemKeys.has(item.key)) {
            return false;
          }

          seenItemKeys.add(item.key);
          return true;
        });

        const itemOrder = catalogItemOrder.get(group.key) ?? [];
        const itemOrderMap = new Map<string, number>(itemOrder.map((key, index) => [key, index]));

        return {
          ...group,
          items: dedupedItems
            .map((item, itemIndex) => ({ item, itemIndex }))
            .sort((left, right) => {
              const leftOrder = itemOrderMap.get(left.item.key) ?? Number.MAX_SAFE_INTEGER;
              const rightOrder = itemOrderMap.get(right.item.key) ?? Number.MAX_SAFE_INTEGER;

              if (leftOrder !== rightOrder) {
                return leftOrder - rightOrder;
              }

              return left.itemIndex - right.itemIndex;
            })
            .map(({ item }) => item),
          groupIndex
        };
      })
      .sort((left, right) => {
        const leftOrder = groupOrderMap.get(left.key) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = groupOrderMap.get(right.key) ?? Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return left.groupIndex - right.groupIndex;
      })
      .map(({ groupIndex: _groupIndex, ...group }) => group);
  };

  /**
   * 常量：蓝图节点目录。
   */
  const catalogRaw: ICrawlerBlueprintNodeMenuGroup[] = [
    {
      key: 'flow',
      label: t('pages.crawlers.blueprint.nodes.groups.flow.title'),
      icon: 'i-lucide:workflow',
      items: [
        { key: 'flow.start', label: t('pages.crawlers.blueprint.nodes.flow.start.title'), description: t('pages.crawlers.blueprint.nodes.flow.start.description'), icon: 'i-lucide:play', group: 'flow' },
        { key: 'flow.end', label: t('pages.crawlers.blueprint.nodes.flow.end.title'), description: t('pages.crawlers.blueprint.nodes.flow.end.description'), icon: 'i-lucide:square', group: 'flow' },
        { key: 'flow.sequence', label: t('pages.crawlers.blueprint.nodes.flow.sequence.title'), description: t('pages.crawlers.blueprint.nodes.flow.sequence.description'), icon: 'i-lucide:arrow-right-left', group: 'flow' },
        { key: 'flow.branch', label: t('pages.crawlers.blueprint.nodes.flow.branch.title'), description: t('pages.crawlers.blueprint.nodes.flow.branch.description'), icon: 'i-lucide:git-branch', group: 'flow' },
        { key: 'flow.parallel', label: t('pages.crawlers.blueprint.nodes.flow.parallel.title'), description: t('pages.crawlers.blueprint.nodes.flow.parallel.description'), icon: 'i-lucide:layers-3', group: 'flow' }
      ]
    },
    {
      key: 'request',
      label: t('pages.crawlers.blueprint.nodes.groups.request.title'),
      icon: 'i-lucide:send',
      items: [
        { key: 'request.get', label: t('pages.crawlers.blueprint.nodes.request.get.title'), description: t('pages.crawlers.blueprint.nodes.request.get.description'), icon: 'i-lucide:download', group: 'request' },
        { key: 'request.post', label: t('pages.crawlers.blueprint.nodes.request.post.title'), description: t('pages.crawlers.blueprint.nodes.request.post.description'), icon: 'i-lucide:send', group: 'request' },
        { key: 'request.put', label: t('pages.crawlers.blueprint.nodes.request.put.title'), description: t('pages.crawlers.blueprint.nodes.request.put.description'), icon: 'i-lucide:refresh-cw', group: 'request' },
        { key: 'request.delete', label: t('pages.crawlers.blueprint.nodes.request.delete.title'), description: t('pages.crawlers.blueprint.nodes.request.delete.description'), icon: 'i-lucide:trash-2', group: 'request' },
        { key: 'request.config', label: t('pages.crawlers.blueprint.nodes.request.config.title'), description: t('pages.crawlers.blueprint.nodes.request.config.description'), icon: 'i-lucide:sliders-horizontal', group: 'request' },
        { key: 'request.parse', label: t('pages.crawlers.blueprint.nodes.request.parse.title'), description: t('pages.crawlers.blueprint.nodes.request.parse.description'), icon: 'i-lucide:file-search', group: 'request' },
        { key: 'request.download', label: t('pages.crawlers.blueprint.nodes.request.download.title'), description: t('pages.crawlers.blueprint.nodes.request.download.description'), icon: 'i-lucide:download', group: 'request' },
        { key: 'request.upload', label: t('pages.crawlers.blueprint.nodes.request.upload.title'), description: t('pages.crawlers.blueprint.nodes.request.upload.description'), icon: 'i-lucide:upload', group: 'request' },
        { key: 'request.session', label: t('pages.crawlers.blueprint.nodes.request.session.title'), description: t('pages.crawlers.blueprint.nodes.request.session.description'), icon: 'i-lucide:shield-check', group: 'request' }
      ]
    },
    {
      key: 'parser',
      label: t('pages.crawlers.blueprint.nodes.groups.parser.title'),
      icon: 'i-lucide:file-search',
      items: [
        { key: 'parser.css', label: t('pages.crawlers.blueprint.nodes.parser.css.title'), description: t('pages.crawlers.blueprint.nodes.parser.css.description'), icon: 'i-lucide:square-mouse-pointer', group: 'parser' },
        { key: 'parser.xpath', label: t('pages.crawlers.blueprint.nodes.parser.xpath.title'), description: t('pages.crawlers.blueprint.nodes.parser.xpath.description'), icon: 'i-lucide:route', group: 'parser' },
        { key: 'parser.regex', label: t('pages.crawlers.blueprint.nodes.parser.regex.title'), description: t('pages.crawlers.blueprint.nodes.parser.regex.description'), icon: 'i-lucide:regex', group: 'parser' },
        { key: 'parser.json', label: t('pages.crawlers.blueprint.nodes.parser.json.title'), description: t('pages.crawlers.blueprint.nodes.parser.json.description'), icon: 'i-lucide:file-json-2', group: 'parser' },
        { key: 'parser.text', label: t('pages.crawlers.blueprint.nodes.parser.text.title'), description: t('pages.crawlers.blueprint.nodes.parser.text.description'), icon: 'i-lucide:file-text', group: 'parser' },
        { key: 'parser.table', label: t('pages.crawlers.blueprint.nodes.parser.table.title'), description: t('pages.crawlers.blueprint.nodes.parser.table.description'), icon: 'i-lucide:table', group: 'parser' },
        { key: 'parser.list', label: t('pages.crawlers.blueprint.nodes.parser.list.title'), description: t('pages.crawlers.blueprint.nodes.parser.list.description'), icon: 'i-lucide:layout-list', group: 'parser' },
        { key: 'parser.attr', label: t('pages.crawlers.blueprint.nodes.parser.attr.title'), description: t('pages.crawlers.blueprint.nodes.parser.attr.description'), icon: 'i-lucide:link-2', group: 'parser' }
      ]
    },
    {
      key: 'variable',
      label: t('pages.crawlers.blueprint.nodes.groups.variable.title'),
      icon: 'i-lucide:variable',
      items: [
        { key: 'logic.boolean', label: t('pages.crawlers.blueprint.nodes.logic.boolean.title'), description: t('pages.crawlers.blueprint.nodes.logic.boolean.description'), icon: 'i-lucide:toggle-left', group: 'variable' },
        { key: 'logic.integer', label: t('pages.crawlers.blueprint.nodes.logic.integer.title'), description: t('pages.crawlers.blueprint.nodes.logic.integer.description'), icon: 'i-lucide:hash', group: 'variable' },
        { key: 'logic.float', label: t('pages.crawlers.blueprint.nodes.logic.float.title'), description: t('pages.crawlers.blueprint.nodes.logic.float.description'), icon: 'i-lucide:circle-dot', group: 'variable' },
        { key: 'logic.string', label: t('pages.crawlers.blueprint.nodes.logic.string.title'), description: t('pages.crawlers.blueprint.nodes.logic.string.description'), icon: 'i-lucide:type', group: 'variable' },
        { key: 'logic.array', label: t('pages.crawlers.blueprint.nodes.logic.array.title'), description: t('pages.crawlers.blueprint.nodes.logic.array.description'), icon: 'i-lucide:list', group: 'variable' },
        { key: 'logic.object', label: t('pages.crawlers.blueprint.nodes.logic.object.title'), description: t('pages.crawlers.blueprint.nodes.logic.object.description'), icon: 'i-lucide:box', group: 'variable' },
        { key: 'logic.null', label: t('pages.crawlers.blueprint.nodes.logic.null.title'), description: t('pages.crawlers.blueprint.nodes.logic.null.description'), icon: 'i-lucide:minus', group: 'variable' },
        { key: 'logic.get', label: t('pages.crawlers.blueprint.nodes.logic.get.title'), description: t('pages.crawlers.blueprint.nodes.logic.get.description'), icon: 'i-lucide:corner-down-left', group: 'variable' },
        { key: 'logic.set', label: t('pages.crawlers.blueprint.nodes.logic.set.title'), description: t('pages.crawlers.blueprint.nodes.logic.set.description'), icon: 'i-lucide:corner-up-right', group: 'variable' }
      ]
    },
    {
      key: 'array',
      label: t('pages.crawlers.blueprint.nodes.groups.array.title'),
      icon: 'i-lucide:list',
      items: [
        { key: 'array.push', label: 'push', description: t('pages.crawlers.blueprint.nodes.array.push.description'), icon: 'i-lucide:plus-circle', group: 'array' },
        { key: 'array.pop', label: 'pop', description: t('pages.crawlers.blueprint.nodes.array.pop.description'), icon: 'i-lucide:minus-circle', group: 'array' },
        { key: 'array.slice', label: 'slice', description: t('pages.crawlers.blueprint.nodes.array.slice.description'), icon: 'i-lucide:scissors', group: 'array' },
        { key: 'array.concat', label: 'concat', description: t('pages.crawlers.blueprint.nodes.array.concat.description'), icon: 'i-lucide:layers-3', group: 'array' },
        { key: 'array.join', label: 'join', description: t('pages.crawlers.blueprint.nodes.array.join.description'), icon: 'i-lucide:link-2', group: 'array' },
        { key: 'array.get', label: 'get', description: t('pages.crawlers.blueprint.nodes.array.get.description'), icon: 'i-lucide:arrow-right', group: 'array' },
        { key: 'array.indexOf', label: 'indexOf', description: t('pages.crawlers.blueprint.nodes.array.indexOf.description'), icon: 'i-lucide:search', group: 'array' },
        { key: 'array.includes', label: 'includes', description: t('pages.crawlers.blueprint.nodes.array.includes.description'), icon: 'i-lucide:check', group: 'array' },
        { key: 'array.find', label: 'find', description: t('pages.crawlers.blueprint.nodes.array.find.description'), icon: 'i-lucide:radar', group: 'array' },
        { key: 'array.filter', label: 'filter', description: t('pages.crawlers.blueprint.nodes.array.filter.description'), icon: 'i-lucide:funnel', group: 'array' },
        { key: 'array.map', label: 'map', description: t('pages.crawlers.blueprint.nodes.array.map.description'), icon: 'i-lucide:arrow-left-right', group: 'array' },
        { key: 'array.reduce', label: 'reduce', description: t('pages.crawlers.blueprint.nodes.array.reduce.description'), icon: 'i-lucide:sigma', group: 'array' },
        { key: 'array.sort', label: 'sort', description: t('pages.crawlers.blueprint.nodes.array.sort.description'), icon: 'i-lucide:sort-asc', group: 'array' },
        { key: 'array.length', label: 'length', description: t('pages.crawlers.blueprint.nodes.array.length.description'), icon: 'i-lucide:ruler', group: 'array' }
      ]
    },
    {
      key: 'string',
      label: t('pages.crawlers.blueprint.nodes.groups.string.title'),
      icon: 'i-lucide:type',
      items: [
        { key: 'string.charAt', label: 'charAt', description: t('pages.crawlers.blueprint.nodes.string.charAt.description'), icon: 'i-lucide:heading-1', group: 'string' },
        { key: 'string.includes', label: 'includes', description: t('pages.crawlers.blueprint.nodes.string.includes.description'), icon: 'i-lucide:search', group: 'string' },
        { key: 'string.slice', label: 'slice', description: t('pages.crawlers.blueprint.nodes.string.slice.description'), icon: 'i-lucide:scissors', group: 'string' },
        { key: 'string.split', label: 'split', description: t('pages.crawlers.blueprint.nodes.string.split.description'), icon: 'i-lucide:split-square-horizontal', group: 'string' },
        { key: 'string.replace', label: 'replace', description: t('pages.crawlers.blueprint.nodes.string.replace.description'), icon: 'i-lucide:replace', group: 'string' },
        { key: 'string.trim', label: 'trim', description: t('pages.crawlers.blueprint.nodes.string.trim.description'), icon: 'i-lucide:eraser', group: 'string' },
        { key: 'string.toLowerCase', label: 'toLowerCase', description: t('pages.crawlers.blueprint.nodes.string.toLowerCase.description'), icon: 'i-lucide:case-lower', group: 'string' },
        { key: 'string.toUpperCase', label: 'toUpperCase', description: t('pages.crawlers.blueprint.nodes.string.toUpperCase.description'), icon: 'i-lucide:case-sensitive', group: 'string' },
        { key: 'string.repeat', label: 'repeat', description: t('pages.crawlers.blueprint.nodes.string.repeat.description'), icon: 'i-lucide:repeat', group: 'string' },
        { key: 'string.padStart', label: 'padStart', description: t('pages.crawlers.blueprint.nodes.string.padStart.description'), icon: 'i-lucide:arrow-left-to-line', group: 'string' },
        { key: 'string.padEnd', label: 'padEnd', description: t('pages.crawlers.blueprint.nodes.string.padEnd.description'), icon: 'i-lucide:arrow-right-to-line', group: 'string' },
        { key: 'string.length', label: 'length', description: t('pages.crawlers.blueprint.nodes.string.length.description'), icon: 'i-lucide:ruler', group: 'string' }
      ]
    },
    {
      key: 'object',
      label: t('pages.crawlers.blueprint.nodes.groups.object.title'),
      icon: 'i-lucide:box',
      items: [
        { key: 'object.get', label: 'get', description: t('pages.crawlers.blueprint.nodes.object.get.description'), icon: 'i-lucide:corner-down-left', group: 'object' },
        { key: 'object.set', label: 'set', description: t('pages.crawlers.blueprint.nodes.object.set.description'), icon: 'i-lucide:corner-up-right', group: 'object' },
        { key: 'object.delete', label: 'delete', description: t('pages.crawlers.blueprint.nodes.object.delete.description'), icon: 'i-lucide:trash-2', group: 'object' },
        { key: 'object.keys', label: 'keys', description: t('pages.crawlers.blueprint.nodes.object.keys.description'), icon: 'i-lucide:key-round', group: 'object' },
        { key: 'object.values', label: 'values', description: t('pages.crawlers.blueprint.nodes.object.values.description'), icon: 'i-lucide:list-tree', group: 'object' },
        { key: 'object.values', label: 'values', description: t('pages.crawlers.blueprint.nodes.object.values.description'), icon: 'i-lucide:list-tree', group: 'object' },
        { key: 'object.entries', label: 'entries', description: t('pages.crawlers.blueprint.nodes.object.entries.description'), icon: 'i-lucide:table-2', group: 'object' },
        { key: 'object.assign', label: 'assign', description: t('pages.crawlers.blueprint.nodes.object.assign.description'), icon: 'i-lucide:layers-3', group: 'object' },
        { key: 'object.hasOwnProperty', label: 'hasOwnProperty', description: t('pages.crawlers.blueprint.nodes.object.hasOwnProperty.description'), icon: 'i-lucide:badge-check', group: 'object' },
        { key: 'object.create', label: 'create', description: t('pages.crawlers.blueprint.nodes.object.create.description'), icon: 'i-lucide:badge-plus', group: 'object' }
      ]
    },
    {
      key: 'math',
      label: t('pages.crawlers.blueprint.nodes.groups.math.title'),
      icon: 'i-lucide:calculator',
      items: [
        { key: 'math.add', label: '加法 (+)', description: t('pages.crawlers.blueprint.nodes.math.add.description'), icon: 'i-lucide:plus', group: 'math' },
        { key: 'math.subtract', label: '减法 (-)', description: t('pages.crawlers.blueprint.nodes.math.subtract.description'), icon: 'i-lucide:minus', group: 'math' },
        { key: 'math.multiply', label: '乘法 (*)', description: t('pages.crawlers.blueprint.nodes.math.multiply.description'), icon: 'i-lucide:x', group: 'math' },
        { key: 'math.divide', label: '除法 (/)', description: t('pages.crawlers.blueprint.nodes.math.divide.description'), icon: 'i-lucide:slash', group: 'math' },
        { key: 'math.mod', label: '取余 (%)', description: t('pages.crawlers.blueprint.nodes.math.mod.description'), icon: 'i-lucide:percent', group: 'math' },
        { key: 'math.pow', label: '幂运算 (**)', description: t('pages.crawlers.blueprint.nodes.math.pow.description'), icon: 'i-lucide:triangle-right', group: 'math' },
        { key: 'math.random', label: 'Math.random', description: t('pages.crawlers.blueprint.nodes.math.random.description'), icon: 'i-lucide:dice-5', group: 'math' },
        { key: 'math.max', label: 'Math.max', description: t('pages.crawlers.blueprint.nodes.math.max.description'), icon: 'i-lucide:arrow-up', group: 'math' },
        { key: 'math.min', label: 'Math.min', description: t('pages.crawlers.blueprint.nodes.math.min.description'), icon: 'i-lucide:arrow-down', group: 'math' }
      ]
    },
    {
      key: 'convert',
      label: t('pages.crawlers.blueprint.nodes.groups.convert.title'),
      icon: 'i-lucide:arrow-left-right',
      items: [
        { key: 'convert.parseInt', label: 'parseInt', description: t('pages.crawlers.blueprint.nodes.convert.parseInt.description'), icon: 'i-lucide:hash', group: 'convert' },
        { key: 'convert.parseFloat', label: 'parseFloat', description: t('pages.crawlers.blueprint.nodes.convert.parseFloat.description'), icon: 'i-lucide:circle-dot', group: 'convert' },
        { key: 'convert.number', label: 'Number', description: t('pages.crawlers.blueprint.nodes.convert.number.description'), icon: 'i-lucide:calculator', group: 'convert' },
        { key: 'convert.string', label: 'String', description: t('pages.crawlers.blueprint.nodes.convert.string.description'), icon: 'i-lucide:type', group: 'convert' },
        { key: 'convert.boolean', label: 'Boolean', description: t('pages.crawlers.blueprint.nodes.convert.boolean.description'), icon: 'i-lucide:toggle-right', group: 'convert' },
        { key: 'convert.toString', label: 'toString', description: t('pages.crawlers.blueprint.nodes.convert.toString.description'), icon: 'i-lucide:text-cursor-input', group: 'convert' },
        { key: 'convert.typeof', label: 'typeof', description: t('pages.crawlers.blueprint.nodes.convert.typeof.description'), icon: 'i-lucide:scan-text', group: 'convert' },
        { key: 'convert.instanceof', label: 'instanceof', description: t('pages.crawlers.blueprint.nodes.convert.instanceof.description'), icon: 'i-lucide:badge-check', group: 'convert' }
      ]
    },
    {
      key: 'compare',
      label: t('pages.crawlers.blueprint.nodes.groups.compare.title'),
      icon: 'i-lucide:ratio',
      items: [
        { key: 'compare.eq', label: '==', description: t('pages.crawlers.blueprint.nodes.compare.eq.description'), icon: 'i-lucide:equal', group: 'compare' },
        { key: 'compare.eqStrict', label: '===', description: t('pages.crawlers.blueprint.nodes.compare.eqStrict.description'), icon: 'i-lucide:equal-not', group: 'compare' },
        { key: 'compare.ne', label: '!=', description: t('pages.crawlers.blueprint.nodes.compare.ne.description'), icon: 'i-lucide:equal-not', group: 'compare' },
        { key: 'compare.neStrict', label: '!==', description: t('pages.crawlers.blueprint.nodes.compare.neStrict.description'), icon: 'i-lucide:circle-slash', group: 'compare' },
        { key: 'compare.gt', label: '>', description: t('pages.crawlers.blueprint.nodes.compare.gt.description'), icon: 'i-lucide:chevron-right', group: 'compare' },
        { key: 'compare.gte', label: '>=', description: t('pages.crawlers.blueprint.nodes.compare.gte.description'), icon: 'i-lucide:chevron-right-square', group: 'compare' },
        { key: 'compare.lt', label: '<', description: t('pages.crawlers.blueprint.nodes.compare.lt.description'), icon: 'i-lucide:chevron-left', group: 'compare' },
        { key: 'compare.lte', label: '<=', description: t('pages.crawlers.blueprint.nodes.compare.lte.description'), icon: 'i-lucide:chevron-left-square', group: 'compare' }
      ]
    },
    {
      key: 'logic-op',
      label: t('pages.crawlers.blueprint.nodes.groups.logicOp.title'),
      icon: 'i-lucide:binary',
      items: [
        { key: 'logicOp.and', label: '&&', description: t('pages.crawlers.blueprint.nodes.logicOp.and.description'), icon: 'i-lucide:between-horizontal-end', group: 'logic-op' },
        { key: 'logicOp.or', label: '||', description: t('pages.crawlers.blueprint.nodes.logicOp.or.description'), icon: 'i-lucide:between-horizontal-start', group: 'logic-op' },
        { key: 'logicOp.not', label: '!', description: t('pages.crawlers.blueprint.nodes.logicOp.not.description'), icon: 'i-lucide:ban', group: 'logic-op' },
        { key: 'logicOp.nullish', label: '??', description: t('pages.crawlers.blueprint.nodes.logicOp.nullish.description'), icon: 'i-lucide:circle-help', group: 'logic-op' },
        { key: 'logicOp.optional', label: '?.', description: t('pages.crawlers.blueprint.nodes.logicOp.optional.description'), icon: 'i-lucide:link-2', group: 'logic-op' }
      ]
    },
    {
      key: 'logic',
      label: t('pages.crawlers.blueprint.nodes.groups.logic.title'),
      icon: 'i-lucide:git-branch',
      items: [
        { key: 'logic.if', label: t('pages.crawlers.blueprint.nodes.logic.if.title'), description: t('pages.crawlers.blueprint.nodes.logic.if.description'), icon: 'i-lucide:git-branch', group: 'logic' },
        { key: 'logic.ifElse', label: t('pages.crawlers.blueprint.nodes.logic.ifElse.title'), description: t('pages.crawlers.blueprint.nodes.logic.ifElse.description'), icon: 'i-lucide:waypoints', group: 'logic' },
        { key: 'logic.switch', label: t('pages.crawlers.blueprint.nodes.logic.switch.title'), description: t('pages.crawlers.blueprint.nodes.logic.switch.description'), icon: 'i-lucide:split', group: 'logic' },
        { key: 'logic.loop', label: t('pages.crawlers.blueprint.nodes.logic.loop.title'), description: t('pages.crawlers.blueprint.nodes.logic.loop.description'), icon: 'i-lucide:repeat', group: 'logic' }
      ]
    },
    {
      key: 'logic',
      label: t('pages.crawlers.blueprint.nodes.groups.logic.title'),
      icon: 'i-lucide:git-branch',
      items: [
        { key: 'logic.if', label: t('pages.crawlers.blueprint.nodes.logic.if.title'), description: t('pages.crawlers.blueprint.nodes.logic.if.description'), icon: 'i-lucide:git-branch', group: 'logic' },
        { key: 'logic.ifElse', label: t('pages.crawlers.blueprint.nodes.logic.ifElse.title'), description: t('pages.crawlers.blueprint.nodes.logic.ifElse.description'), icon: 'i-lucide:waypoints', group: 'logic' },
        { key: 'logic.switch', label: t('pages.crawlers.blueprint.nodes.logic.switch.title'), description: t('pages.crawlers.blueprint.nodes.logic.switch.description'), icon: 'i-lucide:split', group: 'logic' },
        { key: 'logic.loop', label: t('pages.crawlers.blueprint.nodes.logic.loop.title'), description: t('pages.crawlers.blueprint.nodes.logic.loop.description'), icon: 'i-lucide:repeat', group: 'logic' }
      ]
    },
    {
      key: 'function',
      label: t('pages.crawlers.blueprint.nodes.groups.function.title'),
      icon: 'i-lucide:function-square',
      items: [
        { key: 'function.define', label: '定义函数', description: t('pages.crawlers.blueprint.nodes.function.define.description'), icon: 'i-lucide:function-square', group: 'function' },
        { key: 'function.call', label: '调用函数', description: t('pages.crawlers.blueprint.nodes.function.call.description'), icon: 'i-lucide:play', group: 'function' },
        { key: 'function.return', label: '返回值', description: t('pages.crawlers.blueprint.nodes.function.return.description'), icon: 'i-lucide:corner-down-left', group: 'function' },
        { key: 'function.params', label: '参数传递', description: t('pages.crawlers.blueprint.nodes.function.params.description'), icon: 'i-lucide:move-right', group: 'function' },
        { key: 'function.arrow', label: '箭头函数', description: t('pages.crawlers.blueprint.nodes.function.arrow.description'), icon: 'i-lucide:arrow-right', group: 'function' }
      ]
    },
    {
      key: 'storage',
      label: t('pages.crawlers.blueprint.nodes.groups.storage.title'),
      icon: 'i-lucide:database',
      items: [
        { key: 'storage.writeFile', label: '写入文件', description: t('pages.crawlers.blueprint.nodes.storage.writeFile.description'), icon: 'i-lucide:file-up', group: 'storage' },
        { key: 'storage.readFile', label: '读取文件', description: t('pages.crawlers.blueprint.nodes.storage.readFile.description'), icon: 'i-lucide:file-down', group: 'storage' },
        { key: 'storage.submit', label: '提交数据', description: t('pages.crawlers.blueprint.nodes.storage.submit.description'), icon: 'i-lucide:cloud-upload', group: 'storage' }
      ]
    },
    {
      key: 'delay',
      label: t('pages.crawlers.blueprint.nodes.groups.delay.title'),
      icon: 'i-lucide:hourglass',
      items: [
        { key: 'delay.fixed', label: '固定延迟', description: t('pages.crawlers.blueprint.nodes.delay.fixed.description'), icon: 'i-lucide:timer', group: 'delay' },
        { key: 'delay.random', label: '随机延迟', description: t('pages.crawlers.blueprint.nodes.delay.random.description'), icon: 'i-lucide:dice-6', group: 'delay' },
        { key: 'delay.element', label: '等待元素', description: t('pages.crawlers.blueprint.nodes.delay.element.description'), icon: 'i-lucide:mouse-pointer-click', group: 'delay' },
        { key: 'delay.condition', label: '等待条件', description: t('pages.crawlers.blueprint.nodes.delay.condition.description'), icon: 'i-lucide:badge-check', group: 'delay' }
      ]
    },
    {
      key: 'anti-bot',
      label: t('pages.crawlers.blueprint.nodes.groups.antiBot.title'),
      icon: 'i-lucide:shield-check',
      items: [
        { key: 'antiBot.ua', label: 'User-Agent 设置', description: t('pages.crawlers.blueprint.nodes.antiBot.ua.description'), icon: 'i-lucide:monitor', group: 'anti-bot' },
        { key: 'antiBot.proxy', label: '代理设置', description: t('pages.crawlers.blueprint.nodes.antiBot.proxy.description'), icon: 'i-lucide:route', group: 'anti-bot' },
        { key: 'antiBot.challenge', label: '验证码/挑战页检测', description: t('pages.crawlers.blueprint.nodes.antiBot.challenge.description'), icon: 'i-lucide:shield-question', group: 'anti-bot' },
        { key: 'antiBot.headers', label: '请求头伪装', description: t('pages.crawlers.blueprint.nodes.antiBot.headers.description'), icon: 'i-lucide:ghost', group: 'anti-bot' },
        { key: 'antiBot.referer', label: 'Referer 设置', description: t('pages.crawlers.blueprint.nodes.antiBot.referer.description'), icon: 'i-lucide:link-2', group: 'anti-bot' }
      ]
    },
    {
      key: 'debug',
      label: t('pages.crawlers.blueprint.nodes.groups.debug.title'),
      icon: 'i-lucide:bug-play',
      items: [
        { key: 'debug.log', label: '日志输出', description: t('pages.crawlers.blueprint.nodes.debug.log.description'), icon: 'i-lucide:log-in', group: 'debug' },
        { key: 'debug.breakpoint', label: '断点调试', description: t('pages.crawlers.blueprint.nodes.debug.breakpoint.description'), icon: 'i-lucide:pause-circle', group: 'debug' },
        { key: 'debug.preview', label: '数据预览', description: t('pages.crawlers.blueprint.nodes.debug.preview.description'), icon: 'i-lucide:eye', group: 'debug' },
        { key: 'debug.error', label: '错误捕获', description: t('pages.crawlers.blueprint.nodes.debug.error.description'), icon: 'i-lucide:triangle-alert', group: 'debug' },
        { key: 'debug.retry', label: '重试机制', description: t('pages.crawlers.blueprint.nodes.debug.retry.description'), icon: 'i-lucide:refresh-cw', group: 'debug' }
      ]
    },
    {
      key: 'helper',
      label: t('pages.crawlers.blueprint.nodes.groups.helper.title'),
      icon: 'i-lucide:sparkles',
      items: [
        { key: 'helper.comment', label: '注释', description: t('pages.crawlers.blueprint.nodes.helper.comment.description'), icon: 'i-lucide:message-square-quote', group: 'helper' },
        { key: 'helper.subflow', label: '子流程', description: t('pages.crawlers.blueprint.nodes.helper.subflow.description'), icon: 'i-lucide:workflow', group: 'helper' },
        { key: 'helper.timestamp', label: '时间戳', description: t('pages.crawlers.blueprint.nodes.helper.timestamp.description'), icon: 'i-lucide:calendar-clock', group: 'helper' },
        { key: 'helper.uuid', label: 'UUID 生成', description: t('pages.crawlers.blueprint.nodes.helper.uuid.description'), icon: 'i-lucide:hash', group: 'helper' },
        { key: 'helper.hash', label: '哈希计算', description: t('pages.crawlers.blueprint.nodes.helper.hash.description'), icon: 'i-lucide:hash', group: 'helper' }
      ]
    },
    {
      key: 'browser',
      label: t('pages.crawlers.blueprint.nodes.groups.browser.title'),
      icon: 'i-lucide:monitor-play',
      items: [
        { key: 'browser.launch', label: '启动浏览器', description: t('pages.crawlers.blueprint.nodes.browser.launch.description'), icon: 'i-lucide:monitor-play', group: 'browser' },
        { key: 'browser.close', label: '关闭浏览器', description: t('pages.crawlers.blueprint.nodes.browser.close.description'), icon: 'i-lucide:monitor-off', group: 'browser' },
        { key: 'browser.openPage', label: '打开页面', description: t('pages.crawlers.blueprint.nodes.browser.openPage.description'), icon: 'i-lucide:external-link', group: 'browser' },
        { key: 'browser.closePage', label: '关闭页面', description: t('pages.crawlers.blueprint.nodes.browser.closePage.description'), icon: 'i-lucide:square-x', group: 'browser' },
        { key: 'browser.navigate', label: '页面导航', description: t('pages.crawlers.blueprint.nodes.browser.navigate.description'), icon: 'i-lucide:arrow-right-left', group: 'browser' },
        { key: 'browser.waitLoad', label: '等待页面加载', description: t('pages.crawlers.blueprint.nodes.browser.waitLoad.description'), icon: 'i-lucide:hourglass', group: 'browser' },
        { key: 'browser.waitIdle', label: '等待网络空闲', description: t('pages.crawlers.blueprint.nodes.browser.waitIdle.description'), icon: 'i-lucide:wifi-off', group: 'browser' },
        { key: 'browser.screenshot', label: '截图', description: t('pages.crawlers.blueprint.nodes.browser.screenshot.description'), icon: 'i-lucide:camera', group: 'browser' },
        { key: 'browser.html', label: '获取页面 HTML', description: t('pages.crawlers.blueprint.nodes.browser.html.description'), icon: 'i-lucide:file-code-2', group: 'browser' },
        { key: 'browser.url', label: '获取页面 URL', description: t('pages.crawlers.blueprint.nodes.browser.url.description'), icon: 'i-lucide:link-2', group: 'browser' },
        { key: 'browser.refresh', label: '页面刷新', description: t('pages.crawlers.blueprint.nodes.browser.refresh.description'), icon: 'i-lucide:rotate-cw', group: 'browser' },
        { key: 'browser.back', label: '页面回退', description: t('pages.crawlers.blueprint.nodes.browser.back.description'), icon: 'i-lucide:arrow-left', group: 'browser' },
        { key: 'browser.forward', label: '页面前进', description: t('pages.crawlers.blueprint.nodes.browser.forward.description'), icon: 'i-lucide:arrow-right', group: 'browser' }
      ]
    },
    {
      key: 'element',
      label: t('pages.crawlers.blueprint.nodes.groups.element.title'),
      icon: 'i-lucide:mouse-pointer-click',
      items: [
        { key: 'element.click', label: '点击元素', description: t('pages.crawlers.blueprint.nodes.element.click.description'), icon: 'i-lucide:mouse-pointer-click', group: 'element' },
        { key: 'element.input', label: '输入文本', description: t('pages.crawlers.blueprint.nodes.element.input.description'), icon: 'i-lucide:keyboard', group: 'element' },
        { key: 'element.clear', label: '清空输入', description: t('pages.crawlers.blueprint.nodes.element.clear.description'), icon: 'i-lucide:eraser', group: 'element' },
        { key: 'element.select', label: '选择下拉框', description: t('pages.crawlers.blueprint.nodes.element.select.description'), icon: 'i-lucide:chevrons-down-up', group: 'element' },
        { key: 'element.checkbox', label: '勾选复选框', description: t('pages.crawlers.blueprint.nodes.element.checkbox.description'), icon: 'i-lucide:square-check-big', group: 'element' },
        { key: 'element.radio', label: '单选按钮选择', description: t('pages.crawlers.blueprint.nodes.element.radio.description'), icon: 'i-lucide:circle-dot', group: 'element' },
        { key: 'element.upload', label: '文件上传', description: t('pages.crawlers.blueprint.nodes.element.upload.description'), icon: 'i-lucide:upload', group: 'element' },
        { key: 'element.hover', label: '悬停元素', description: t('pages.crawlers.blueprint.nodes.element.hover.description'), icon: 'i-lucide:mouse-pointer-2', group: 'element' },
        { key: 'element.drag', label: '拖拽元素', description: t('pages.crawlers.blueprint.nodes.element.drag.description'), icon: 'i-lucide:move', group: 'element' },
        { key: 'element.scrollToElement', label: '滚动到元素', description: t('pages.crawlers.blueprint.nodes.element.scrollToElement.description'), icon: 'i-lucide:arrow-down-to-line', group: 'element' },
        { key: 'element.scrollToPosition', label: '滚动到位置', description: t('pages.crawlers.blueprint.nodes.element.scrollToPosition.description'), icon: 'i-lucide:scroll', group: 'element' },
        { key: 'element.rightClick', label: '右键点击', description: t('pages.crawlers.blueprint.nodes.element.rightClick.description'), icon: 'i-lucide:mouse-pointer-2', group: 'element' },
        { key: 'element.doubleClick', label: '双击', description: t('pages.crawlers.blueprint.nodes.element.doubleClick.description'), icon: 'i-lucide:mouse-pointer-click', group: 'element' },
        { key: 'element.setValue', label: '设置值', description: t('pages.crawlers.blueprint.nodes.element.setValue.description'), icon: 'i-lucide:text-cursor-input', group: 'element' },
        { key: 'element.trigger', label: '触发事件', description: t('pages.crawlers.blueprint.nodes.element.trigger.description'), icon: 'i-lucide:zap', group: 'element' }
      ]
    },
    {
      key: 'element-wait',
      label: t('pages.crawlers.blueprint.nodes.groups.elementWait.title'),
      icon: 'i-lucide:scan-line',
      items: [
        { key: 'elementWait.appear', label: '等待元素出现', description: t('pages.crawlers.blueprint.nodes.elementWait.appear.description'), icon: 'i-lucide:eye', group: 'element-wait' },
        { key: 'elementWait.disappear', label: '等待元素消失', description: t('pages.crawlers.blueprint.nodes.elementWait.disappear.description'), icon: 'i-lucide:eye-off', group: 'element-wait' },
        { key: 'elementWait.visible', label: '等待元素可见', description: t('pages.crawlers.blueprint.nodes.elementWait.visible.description'), icon: 'i-lucide:scan-eye', group: 'element-wait' },
        { key: 'elementWait.hidden', label: '等待元素隐藏', description: t('pages.crawlers.blueprint.nodes.elementWait.hidden.description'), icon: 'i-lucide:scan-face', group: 'element-wait' },
        { key: 'elementWait.clickable', label: '等待元素可点击', description: t('pages.crawlers.blueprint.nodes.elementWait.clickable.description'), icon: 'i-lucide:mouse-pointer-click', group: 'element-wait' },
        { key: 'elementWait.exists', label: '检查元素存在', description: t('pages.crawlers.blueprint.nodes.elementWait.exists.description'), icon: 'i-lucide:badge-check', group: 'element-wait' },
        { key: 'elementWait.visibleCheck', label: '检查元素可见', description: t('pages.crawlers.blueprint.nodes.elementWait.visibleCheck.description'), icon: 'i-lucide:eye', group: 'element-wait' },
        { key: 'elementWait.clickableCheck', label: '检查元素可点击', description: t('pages.crawlers.blueprint.nodes.elementWait.clickableCheck.description'), icon: 'i-lucide:mouse-pointer-click', group: 'element-wait' },
        { key: 'elementWait.text', label: '获取元素文本', description: t('pages.crawlers.blueprint.nodes.elementWait.text.description'), icon: 'i-lucide:file-text', group: 'element-wait' },
        { key: 'elementWait.attr', label: '获取元素属性', description: t('pages.crawlers.blueprint.nodes.elementWait.attr.description'), icon: 'i-lucide:link-2', group: 'element-wait' },
        { key: 'elementWait.style', label: '获取元素样式', description: t('pages.crawlers.blueprint.nodes.elementWait.style.description'), icon: 'i-lucide:palette', group: 'element-wait' },
        { key: 'elementWait.count', label: '获取元素数量', description: t('pages.crawlers.blueprint.nodes.elementWait.count.description'), icon: 'i-lucide:hash', group: 'element-wait' }
      ]
    },
    {
      key: 'form',
      label: t('pages.crawlers.blueprint.nodes.groups.form.title'),
      icon: 'i-lucide:file-pen-line',
      items: [
        { key: 'form.fill', label: '填写表单', description: t('pages.crawlers.blueprint.nodes.form.fill.description'), icon: 'i-lucide:file-pen-line', group: 'form' },
        { key: 'form.submit', label: '提交表单', description: t('pages.crawlers.blueprint.nodes.form.submit.description'), icon: 'i-lucide:send', group: 'form' },
        { key: 'form.reset', label: '重置表单', description: t('pages.crawlers.blueprint.nodes.form.reset.description'), icon: 'i-lucide:rotate-ccw', group: 'form' },
        { key: 'form.validate', label: '表单验证', description: t('pages.crawlers.blueprint.nodes.form.validate.description'), icon: 'i-lucide:badge-check', group: 'form' }
      ]
    },
    {
      key: 'context',
      label: t('pages.crawlers.blueprint.nodes.groups.context.title'),
      icon: 'i-lucide:layers-3',
      items: [
        { key: 'context.switchTab', label: '切换标签页', description: t('pages.crawlers.blueprint.nodes.context.switchTab.description'), icon: 'i-lucide:panel-top-close', group: 'context' },
        { key: 'context.openTab', label: '打开新标签页', description: t('pages.crawlers.blueprint.nodes.context.openTab.description'), icon: 'i-lucide:plus-square', group: 'context' },
        { key: 'context.closeTab', label: '关闭标签页', description: t('pages.crawlers.blueprint.nodes.context.closeTab.description'), icon: 'i-lucide:square-x', group: 'context' },
        { key: 'context.switchFrame', label: '切换 Frame', description: t('pages.crawlers.blueprint.nodes.context.switchFrame.description'), icon: 'i-lucide:frame', group: 'context' },
        { key: 'context.switchMainFrame', label: '切换到主 Frame', description: t('pages.crawlers.blueprint.nodes.context.switchMainFrame.description'), icon: 'i-lucide:frame', group: 'context' },
        { key: 'context.switchDialog', label: '切换弹窗', description: t('pages.crawlers.blueprint.nodes.context.switchDialog.description'), icon: 'i-lucide:messages-square', group: 'context' },
        { key: 'context.acceptDialog', label: '接受弹窗', description: t('pages.crawlers.blueprint.nodes.context.acceptDialog.description'), icon: 'i-lucide:circle-check-big', group: 'context' },
        { key: 'context.dismissDialog', label: '拒绝弹窗', description: t('pages.crawlers.blueprint.nodes.context.dismissDialog.description'), icon: 'i-lucide:circle-x', group: 'context' },
        { key: 'context.promptText', label: '输入弹窗文本', description: t('pages.crawlers.blueprint.nodes.context.promptText.description'), icon: 'i-lucide:text-cursor-input', group: 'context' }
      ]
    },
    {
      key: 'cookie',
      label: t('pages.crawlers.blueprint.nodes.groups.cookie.title'),
      icon: 'i-lucide:database',
      items: [
        { key: 'cookie.get', label: '获取 Cookie', description: t('pages.crawlers.blueprint.nodes.cookie.get.description'), icon: 'i-lucide:cookie', group: 'cookie' },
        { key: 'cookie.set', label: '设置 Cookie', description: t('pages.crawlers.blueprint.nodes.cookie.set.description'), icon: 'i-lucide:circle-plus', group: 'cookie' },
        { key: 'cookie.delete', label: '删除 Cookie', description: t('pages.crawlers.blueprint.nodes.cookie.delete.description'), icon: 'i-lucide:circle-x', group: 'cookie' },
        { key: 'cookie.get', label: '获取 Cookie', description: t('pages.crawlers.blueprint.nodes.cookie.get.description'), icon: 'i-lucide:cookie', group: 'cookie' },
        { key: 'cookie.set', label: '设置 Cookie', description: t('pages.crawlers.blueprint.nodes.cookie.set.description'), icon: 'i-lucide:cookie', group: 'cookie' },
        { key: 'cookie.delete', label: '删除 Cookie', description: t('pages.crawlers.blueprint.nodes.cookie.delete.description'), icon: 'i-lucide:cookie', group: 'cookie' },
        { key: 'cookie.localGet', label: '获取 LocalStorage', description: t('pages.crawlers.blueprint.nodes.cookie.localGet.description'), icon: 'i-lucide:database', group: 'cookie' },
        { key: 'cookie.localSet', label: '设置 LocalStorage', description: t('pages.crawlers.blueprint.nodes.cookie.localSet.description'), icon: 'i-lucide:database-zap', group: 'cookie' },
        { key: 'cookie.sessionGet', label: '获取 SessionStorage', description: t('pages.crawlers.blueprint.nodes.cookie.sessionGet.description'), icon: 'i-lucide:database', group: 'cookie' },
        { key: 'cookie.sessionSet', label: '设置 SessionStorage', description: t('pages.crawlers.blueprint.nodes.cookie.sessionSet.description'), icon: 'i-lucide:database-backup', group: 'cookie' }
      ]
    },
    {
      key: 'network',
      label: t('pages.crawlers.blueprint.nodes.groups.network.title'),
      icon: 'i-lucide:network',
      items: [
        { key: 'network.intercept', label: '拦截请求', description: t('pages.crawlers.blueprint.nodes.network.intercept.description'), icon: 'i-lucide:ban', group: 'network' },
        { key: 'network.modifyRequest', label: '修改请求', description: t('pages.crawlers.blueprint.nodes.network.modifyRequest.description'), icon: 'i-lucide:file-pen-line', group: 'network' },
        { key: 'network.interceptResponse', label: '拦截响应', description: t('pages.crawlers.blueprint.nodes.network.interceptResponse.description'), icon: 'i-lucide:ban', group: 'network' },
        { key: 'network.modifyResponse', label: '修改响应', description: t('pages.crawlers.blueprint.nodes.network.modifyResponse.description'), icon: 'i-lucide:file-pen-line', group: 'network' },
        { key: 'network.mock', label: '模拟响应', description: t('pages.crawlers.blueprint.nodes.network.mock.description'), icon: 'i-lucide:box', group: 'network' },
        { key: 'network.list', label: '获取请求列表', description: t('pages.crawlers.blueprint.nodes.network.list.description'), icon: 'i-lucide:list', group: 'network' },
        { key: 'network.wait', label: '等待特定请求', description: t('pages.crawlers.blueprint.nodes.network.wait.description'), icon: 'i-lucide:clock-3', group: 'network' }
      ]
    },
    {
      key: 'js',
      label: t('pages.crawlers.blueprint.nodes.groups.js.title'),
      icon: 'i-lucide:code-square',
      items: [
        { key: 'js.exec', label: '执行 JS', description: t('pages.crawlers.blueprint.nodes.js.exec.description'), icon: 'i-lucide:code-2', group: 'js' },
        { key: 'js.execReturn', label: '执行 JS 并返回', description: t('pages.crawlers.blueprint.nodes.js.execReturn.description'), icon: 'i-lucide:code-square', group: 'js' },
        { key: 'js.inject', label: '注入脚本', description: t('pages.crawlers.blueprint.nodes.js.inject.description'), icon: 'i-lucide:file-code-2', group: 'js' },
        { key: 'js.listen', label: '添加事件监听', description: t('pages.crawlers.blueprint.nodes.js.listen.description'), icon: 'i-lucide:bell-plus', group: 'js' }
      ]
    }
  ];

  /**
   * 常量：节点索引。
   */
  const catalog = normalizeCrawlerBlueprintCatalog(catalogRaw);

  /**
   * 常量：节点索引。
   */
  const catalogIndex = new Map<string, ICrawlerBlueprintNodeMenuItem>();

  for (const group of catalog) {
    for (const item of group.items) {
      catalogIndex.set(item.key, item);
    }
  }

  /**
   * 函数：记录最近使用节点。
   *
   * # Arguments
   *
   * * `key` - 节点唯一标识。
   */
  const rememberRecentNode = (key: string): void => {
    const normalized = String(key ?? '').trim();
    if (normalized === '' || !catalogIndex.has(normalized)) {
      return;
    }

    const nextKeys = [normalized, ...stateRecentNodeKeys.value.filter((value) => value !== normalized)].slice(0, recentLimit);
    stateRecentNodeKeys.value = nextKeys;
  };

  /**
   * 函数：转换为右键菜单项。
   *
   * # Arguments
   *
   * * `item` - 节点项。
   * * `onSelect` - 节点选择回调。
   *
   * # Returns
   *
   * 返回一个菜单项。
   */
  const createNodeContextMenuItem = (item: ICrawlerBlueprintNodeMenuItem, onSelect?: (node: ICrawlerBlueprintNodeMenuItem) => void): ContextMenuItem => ({
    label: item.label,
    icon: item.icon,
    description: item.description,
    onSelect: () => {
      rememberRecentNode(item.key);
      onSelect?.(item);
    }
  });

  /**
   * 函数：构建爬虫蓝图右键菜单。
   *
   * # Arguments
   *
   * * `onSelect` - 节点选择回调。
   *
   * # Returns
   *
   * 返回分组菜单。
   */
  const buildCrawlerBlueprintContextMenuItems = (onSelect?: (node: ICrawlerBlueprintNodeMenuItem) => void): ContextMenuItem[][] => {
    const recentItems = stateRecentNodeKeys.value
      .map((key) => catalogIndex.get(key))
      .filter((item): item is ICrawlerBlueprintNodeMenuItem => Boolean(item))
      .map((item) => createNodeContextMenuItem(item, onSelect));

    const recentGroup =
      recentItems.length > 0
        ? [
            [
              {
                label: t('pages.crawlers.blueprint.nodes.groups.recent.title'),
                icon: 'i-lucide:history',
                children: [recentItems]
              }
            ]
          ]
        : [];

    return [
      ...recentGroup,
      ...catalog.map((group) => [
        {
          label: group.label,
          icon: group.icon,
          children: [group.items.map((item) => createNodeContextMenuItem(item, onSelect))]
        }
      ])
    ];
  };

  return {
    buildCrawlerBlueprintContextMenuItems,
    rememberRecentNode,
    stateRecentNodeKeys
  };
};
