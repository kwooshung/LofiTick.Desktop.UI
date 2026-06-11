import type { ICrawlersListGroup } from '@/components/crawlers/list/index.types';

import type { ICrawlersBlueprintGroupDefinition } from '@/composables/hooks/useCrawlerBlueprint/index.types';

/**
 * 常量：爬虫蓝图分组定义。
 */
const crawlerBlueprintGroupDefinitions: ICrawlersBlueprintGroupDefinition[] = [
  {
    labelKey: 'pages.crawlers.blueprint.groups.navigation.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.navigation.description',
    iconName: 'i-lucide:compass',
    nodes: [
      {
        key: 'navigation.go-to-page',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.goToPage.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.goToPage.description'
      },
      {
        key: 'navigation.refresh-page',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.refreshPage.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.refreshPage.description'
      },
      {
        key: 'navigation.back',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.back.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.back.description'
      },
      {
        key: 'navigation.forward',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.forward.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.forward.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.wait.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.wait.description',
    iconName: 'i-lucide:clock-3',
    nodes: [
      {
        key: 'wait.wait-element',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.waitElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.waitElement.description'
      },
      {
        key: 'wait.wait-time',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.waitTime.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.waitTime.description'
      },
      {
        key: 'wait.random-wait',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.randomWait.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.randomWait.description'
      },
      {
        key: 'wait.wait-load-state',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.waitLoadState.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.waitLoadState.description'
      },
      {
        key: 'wait.wait-condition',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.waitCondition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.waitCondition.description'
      },
      {
        key: 'wait.wait-text',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.waitText.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.waitText.description'
      },
      {
        key: 'wait.delay',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.delay.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.delay.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.interaction.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.interaction.description',
    iconName: 'i-lucide:mouse-pointer-click',
    nodes: [
      {
        key: 'interaction.click-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.clickElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.clickElement.description'
      },
      {
        key: 'interaction.double-click-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.doubleClickElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.doubleClickElement.description'
      },
      {
        key: 'interaction.hover-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.hoverElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.hoverElement.description'
      },
      {
        key: 'interaction.input-text',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.inputText.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.inputText.description'
      },
      {
        key: 'interaction.fill-content',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.fillContent.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.fillContent.description'
      },
      {
        key: 'interaction.select-option',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.selectOption.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.selectOption.description'
      },
      {
        key: 'interaction.check-box',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.checkBox.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.checkBox.description'
      },
      {
        key: 'interaction.uncheck-box',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.uncheckBox.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.uncheckBox.description'
      },
      {
        key: 'interaction.focus-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.focusElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.focusElement.description'
      },
      {
        key: 'interaction.dispatch-event',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.dispatchEvent.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.dispatchEvent.description'
      },
      {
        key: 'interaction.press-key',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.pressKey.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.pressKey.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.mouse.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.mouse.description',
    iconName: 'i-lucide:mouse-pointer-2',
    nodes: [
      {
        key: 'mouse.move',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.move.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.move.description'
      },
      {
        key: 'mouse.curve',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.curve.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.curve.description'
      },
      {
        key: 'mouse.accel',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.accel.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.accel.description'
      },
      {
        key: 'mouse.jitter',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.jitter.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.jitter.description'
      },
      {
        key: 'mouse.duration',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.duration.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.duration.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.scroll.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.scroll.description',
    iconName: 'i-lucide:move-vertical',
    nodes: [
      {
        key: 'scroll.to-position',
        labelKey: 'pages.crawlers.blueprint.nodes.scroll.toPosition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.scroll.toPosition.description'
      },
      {
        key: 'scroll.into-view',
        labelKey: 'pages.crawlers.blueprint.nodes.scroll.intoView.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.scroll.intoView.description'
      },
      {
        key: 'scroll.infinite',
        labelKey: 'pages.crawlers.blueprint.nodes.scroll.infinite.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.scroll.infinite.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.extract.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.extract.description',
    iconName: 'i-lucide:scan-search',
    nodes: [
      {
        key: 'extract.get-text',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getText.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getText.description'
      },
      {
        key: 'extract.get-attribute',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getAttribute.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getAttribute.description'
      },
      {
        key: 'extract.get-html',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getHtml.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getHtml.description'
      },
      {
        key: 'extract.get-value',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getValue.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getValue.description'
      },
      {
        key: 'extract.query-element',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.queryElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.queryElement.description'
      },
      {
        key: 'extract.query-all-elements',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.queryAllElements.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.queryAllElements.description'
      },
      {
        key: 'extract.execute-script',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.executeScript.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.executeScript.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.http.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.http.description',
    iconName: 'i-lucide:globe',
    nodes: [
      {
        key: 'http.request',
        labelKey: 'pages.crawlers.blueprint.nodes.http.request.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.http.request.description'
      },
      {
        key: 'http.get-cookies',
        labelKey: 'pages.crawlers.blueprint.nodes.http.getCookies.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.http.getCookies.description'
      },
      {
        key: 'http.set-cookies',
        labelKey: 'pages.crawlers.blueprint.nodes.http.setCookies.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.http.setCookies.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.detect.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.detect.description',
    iconName: 'i-lucide:shield-check',
    nodes: [
      {
        key: 'detect.verification',
        labelKey: 'pages.crawlers.blueprint.nodes.detect.verification.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.detect.verification.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.system.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.system.description',
    iconName: 'i-lucide:monitor-cog',
    nodes: [
      {
        key: 'system.screen-size',
        labelKey: 'pages.crawlers.blueprint.nodes.system.screenSize.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.screenSize.description'
      },
      {
        key: 'system.window-size',
        labelKey: 'pages.crawlers.blueprint.nodes.system.windowSize.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.windowSize.description'
      },
      {
        key: 'system.mouse-position',
        labelKey: 'pages.crawlers.blueprint.nodes.system.mousePosition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.mousePosition.description'
      },
      {
        key: 'system.read-clipboard',
        labelKey: 'pages.crawlers.blueprint.nodes.system.readClipboard.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.readClipboard.description'
      },
      {
        key: 'system.write-clipboard',
        labelKey: 'pages.crawlers.blueprint.nodes.system.writeClipboard.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.writeClipboard.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.variable.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.variable.description',
    iconName: 'i-lucide:variable',
    nodes: [
      {
        key: 'variable.set',
        labelKey: 'pages.crawlers.blueprint.nodes.variable.set.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.variable.set.description'
      },
      {
        key: 'variable.get',
        labelKey: 'pages.crawlers.blueprint.nodes.variable.get.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.variable.get.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.math.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.math.description',
    iconName: 'i-lucide:square-function',
    nodes: [
      {
        key: 'math.add',
        labelKey: 'pages.crawlers.blueprint.nodes.math.add.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.add.description'
      },
      {
        key: 'math.subtract',
        labelKey: 'pages.crawlers.blueprint.nodes.math.subtract.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.subtract.description'
      },
      {
        key: 'math.multiply',
        labelKey: 'pages.crawlers.blueprint.nodes.math.multiply.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.multiply.description'
      },
      {
        key: 'math.divide',
        labelKey: 'pages.crawlers.blueprint.nodes.math.divide.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.divide.description'
      },
      {
        key: 'math.round',
        labelKey: 'pages.crawlers.blueprint.nodes.math.round.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.round.description'
      },
      {
        key: 'math.random',
        labelKey: 'pages.crawlers.blueprint.nodes.math.random.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.random.description'
      },
      {
        key: 'math.absolute',
        labelKey: 'pages.crawlers.blueprint.nodes.math.absolute.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.absolute.description'
      },
      {
        key: 'math.modulo',
        labelKey: 'pages.crawlers.blueprint.nodes.math.modulo.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.modulo.description'
      },
      {
        key: 'math.power',
        labelKey: 'pages.crawlers.blueprint.nodes.math.power.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.power.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.string.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.string.description',
    iconName: 'i-lucide:regex',
    nodes: [
      {
        key: 'string.substring',
        labelKey: 'pages.crawlers.blueprint.nodes.string.substring.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.substring.description'
      },
      {
        key: 'string.replace',
        labelKey: 'pages.crawlers.blueprint.nodes.string.replace.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.replace.description'
      },
      {
        key: 'string.concat',
        labelKey: 'pages.crawlers.blueprint.nodes.string.concat.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.concat.description'
      },
      {
        key: 'string.regex-match',
        labelKey: 'pages.crawlers.blueprint.nodes.string.regexMatch.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.regexMatch.description'
      },
      {
        key: 'string.regex-replace',
        labelKey: 'pages.crawlers.blueprint.nodes.string.regexReplace.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.regexReplace.description'
      },
      {
        key: 'string.split',
        labelKey: 'pages.crawlers.blueprint.nodes.string.split.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.split.description'
      },
      {
        key: 'string.length',
        labelKey: 'pages.crawlers.blueprint.nodes.string.length.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.length.description'
      },
      {
        key: 'string.uppercase',
        labelKey: 'pages.crawlers.blueprint.nodes.string.uppercase.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.uppercase.description'
      },
      {
        key: 'string.lowercase',
        labelKey: 'pages.crawlers.blueprint.nodes.string.lowercase.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.lowercase.description'
      },
      {
        key: 'string.trim',
        labelKey: 'pages.crawlers.blueprint.nodes.string.trim.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.trim.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.arrayObject.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.arrayObject.description',
    iconName: 'i-lucide:braces',
    nodes: [
      {
        key: 'array-object.filter',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.filter.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.filter.description'
      },
      {
        key: 'array-object.merge',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.merge.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.merge.description'
      },
      {
        key: 'array-object.split',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.split.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.split.description'
      },
      {
        key: 'array-object.length',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.length.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.length.description'
      },
      {
        key: 'array-object.item',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.item.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.item.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.typeConvert.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.typeConvert.description',
    iconName: 'i-lucide:replace',
    nodes: [
      {
        key: 'type-convert.string',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.string.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.string.description'
      },
      {
        key: 'type-convert.number',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.number.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.number.description'
      },
      {
        key: 'type-convert.boolean',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.boolean.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.boolean.description'
      },
      {
        key: 'type-convert.json',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.json.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.json.description'
      },
      {
        key: 'type-convert.parse-json',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.parseJson.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.parseJson.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.controlFlow.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.controlFlow.description',
    iconName: 'i-lucide:git-branch',
    nodes: [
      {
        key: 'control-flow.loop',
        labelKey: 'pages.crawlers.blueprint.nodes.controlFlow.loop.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.controlFlow.loop.description'
      },
      {
        key: 'control-flow.condition',
        labelKey: 'pages.crawlers.blueprint.nodes.controlFlow.condition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.controlFlow.condition.description'
      },
      {
        key: 'control-flow.switch',
        labelKey: 'pages.crawlers.blueprint.nodes.controlFlow.switch.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.controlFlow.switch.description'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.output.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.output.description',
    iconName: 'i-lucide:send',
    nodes: [
      {
        key: 'output.send-to-api',
        labelKey: 'pages.crawlers.blueprint.nodes.output.sendToApi.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.output.sendToApi.description'
      },
      {
        key: 'output.print-log',
        labelKey: 'pages.crawlers.blueprint.nodes.output.printLog.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.output.printLog.description'
      },
      {
        key: 'output.screenshot',
        labelKey: 'pages.crawlers.blueprint.nodes.output.screenshot.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.output.screenshot.description'
      }
    ]
  }
];

/**
 * 函数：构建爬虫蓝图分组。
 *
 * 将文档中的原子节点清单转换为侧边栏可直接渲染的分组数据。
 *
 * # Arguments
 *
 * * `translate` - 翻译函数。
 *
 * # Returns
 *
 * 返回蓝图分组列表。
 */
export const crawlerBlueprintGroupsBuild = (translate: (key: string) => string): ICrawlersListGroup[] =>
  crawlerBlueprintGroupDefinitions.map((group) => ({
    label: translate(group.labelKey),
    description: translate(group.descriptionKey),
    iconName: group.iconName,
    crawlers: group.nodes.map((node) => ({
      key: node.key,
      name: translate(node.labelKey),
      description: translate(node.descriptionKey)
    }))
  }));

/**
 * Hook：爬虫蓝图。
 *
 * 将文档中的原子节点清单转换为侧边栏可直接渲染的分组数据。
 *
 * # Returns
 *
 * 返回蓝图分组列表。
 */
export const useCrawlerBlueprint = () => {
  /**
   * Hook：国际化。
   */
  const { t } = useI18n();

  /**
   * 计算属性：蓝图分组。
   */
  const groups = computed<ICrawlersListGroup[]>(() => crawlerBlueprintGroupsBuild(t));

  return {
    groups
  };
};

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('crawlerBlueprintGroupsBuild', () => {
    it('builds all groups and keeps node keys', () => {
      const groups = crawlerBlueprintGroupsBuild((key) => key);

      expect(groups).toHaveLength(16);
      expect(groups[0]?.label).toBe('pages.crawlers.blueprint.groups.navigation.title');
      expect(groups[0]?.crawlers[0]?.key).toBe('navigation.go-to-page');
    });
  });
}
