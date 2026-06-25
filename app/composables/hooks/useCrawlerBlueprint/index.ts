import type { ICrawlersListGroup } from '@/components/crawlers/list/index.types';

/**
 * 常量：爬虫蓝图分组定义。
 */
const crawlerBlueprintGroupDefinitions: ICrawlersBlueprintGroupDefinition[] = [
  {
    icon: 'i-lucide-compass',
    title: 'pages.crawlers.blueprint.groups.navigation.title',
    description: 'pages.crawlers.blueprint.groups.navigation.description',
    nodes: [
      {
        key: 'navigation-goto',
        icon: 'i-lucide-external-link',
        title: 'pages.crawlers.blueprint.nodes.navigation.goto.title',
        description: 'pages.crawlers.blueprint.nodes.navigation.goto.description'
      },
      {
        key: 'navigation-refresh',
        icon: 'i-lucide-refresh-cw',
        title: 'pages.crawlers.blueprint.nodes.navigation.refresh.title',
        description: 'pages.crawlers.blueprint.nodes.navigation.refresh.description'
      },
      {
        key: 'navigation-back',
        icon: 'i-lucide-arrow-left',
        title: 'pages.crawlers.blueprint.nodes.navigation.back.title',
        description: 'pages.crawlers.blueprint.nodes.navigation.back.description'
      },
      {
        key: 'navigation-forward',
        icon: 'i-lucide-arrow-right',
        title: 'pages.crawlers.blueprint.nodes.navigation.forward.title',
        description: 'pages.crawlers.blueprint.nodes.navigation.forward.description'
      },
      {
        key: 'navigation-close-page',
        icon: 'i-lucide:monitor-x',
        title: 'pages.crawlers.blueprint.nodes.navigation.closePage.title',
        description: 'pages.crawlers.blueprint.nodes.navigation.closePage.description'
      }
    ]
  },
  {
    icon: 'i-lucide-clock-3',
    title: 'pages.crawlers.blueprint.groups.wait.title',
    description: 'pages.crawlers.blueprint.groups.wait.description',
    nodes: [
      {
        key: 'wait-element',
        icon: 'i-lucide-scan-search',
        title: 'pages.crawlers.blueprint.nodes.wait.element.title',
        description: 'pages.crawlers.blueprint.nodes.wait.element.description'
      },
      {
        key: 'wait-time',
        icon: 'i-lucide-clock-3',
        title: 'pages.crawlers.blueprint.nodes.wait.time.title',
        description: 'pages.crawlers.blueprint.nodes.wait.time.description'
      },
      {
        key: 'wait-random',
        icon: 'i-lucide-shuffle',
        title: 'pages.crawlers.blueprint.nodes.wait.random.title',
        description: 'pages.crawlers.blueprint.nodes.wait.random.description'
      },
      {
        key: 'wait-load-state',
        icon: 'i-lucide-loader-circle',
        title: 'pages.crawlers.blueprint.nodes.wait.loadState.title',
        description: 'pages.crawlers.blueprint.nodes.wait.loadState.description'
      },
      {
        key: 'wait-condition',
        icon: 'i-lucide-braces',
        title: 'pages.crawlers.blueprint.nodes.wait.condition.title',
        description: 'pages.crawlers.blueprint.nodes.wait.condition.description'
      },
      {
        key: 'wait-text',
        icon: 'i-lucide-text-search',
        title: 'pages.crawlers.blueprint.nodes.wait.text.title',
        description: 'pages.crawlers.blueprint.nodes.wait.text.description'
      },
      {
        key: 'wait-delay',
        icon: 'i-lucide-hourglass',
        title: 'pages.crawlers.blueprint.nodes.wait.delay.title',
        description: 'pages.crawlers.blueprint.nodes.wait.delay.description'
      }
    ]
  },
  {
    icon: 'i-lucide-mouse-pointer-click',
    title: 'pages.crawlers.blueprint.groups.interaction.title',
    description: 'pages.crawlers.blueprint.groups.interaction.description',
    nodes: [
      {
        key: 'interaction-click-element',
        icon: 'i-lucide-mouse-pointer-click',
        title: 'pages.crawlers.blueprint.nodes.interaction.clickElement.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.clickElement.description'
      },
      {
        key: 'interaction-double-click-element',
        icon: 'i-lucide-mouse-pointer-2',
        title: 'pages.crawlers.blueprint.nodes.interaction.doubleClickElement.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.doubleClickElement.description'
      },
      {
        key: 'interaction-hover-element',
        icon: 'i-lucide-mouse',
        title: 'pages.crawlers.blueprint.nodes.interaction.hoverElement.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.hoverElement.description'
      },
      {
        key: 'interaction-input-text',
        icon: 'i-lucide-text-cursor-input',
        title: 'pages.crawlers.blueprint.nodes.interaction.inputText.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.inputText.description'
      },
      {
        key: 'interaction-fill-content',
        icon: 'i-lucide-form-input',
        title: 'pages.crawlers.blueprint.nodes.interaction.fillContent.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.fillContent.description'
      },
      {
        key: 'interaction-select-option',
        icon: 'i-lucide-list-filter',
        title: 'pages.crawlers.blueprint.nodes.interaction.selectOption.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.selectOption.description'
      },
      {
        key: 'interaction-check-box',
        icon: 'i-lucide-check-square',
        title: 'pages.crawlers.blueprint.nodes.interaction.checkBox.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.checkBox.description'
      },
      {
        key: 'interaction-uncheck-box',
        icon: 'i-lucide-toggle-left',
        title: 'pages.crawlers.blueprint.nodes.interaction.uncheckBox.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.uncheckBox.description'
      },
      {
        key: 'interaction-focus-element',
        icon: 'i-lucide-focus',
        title: 'pages.crawlers.blueprint.nodes.interaction.focusElement.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.focusElement.description'
      },
      {
        key: 'interaction-dispatch-event',
        icon: 'i-lucide-send',
        title: 'pages.crawlers.blueprint.nodes.interaction.dispatchEvent.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.dispatchEvent.description'
      },
      {
        key: 'interaction-press-key',
        icon: 'i-lucide-key-round',
        title: 'pages.crawlers.blueprint.nodes.interaction.pressKey.title',
        description: 'pages.crawlers.blueprint.nodes.interaction.pressKey.description'
      },
      {
        key: 'mouse-move',
        icon: 'i-lucide-move',
        title: 'pages.crawlers.blueprint.nodes.mouse.move.title',
        description: 'pages.crawlers.blueprint.nodes.mouse.move.description'
      }
    ]
  },
  {
    icon: 'i-lucide-move-vertical',
    title: 'pages.crawlers.blueprint.groups.scroll.title',
    description: 'pages.crawlers.blueprint.groups.scroll.description',
    nodes: [
      {
        key: 'scroll-to-position',
        icon: 'i-lucide-arrow-down-to-line',
        title: 'pages.crawlers.blueprint.nodes.scroll.toPosition.title',
        description: 'pages.crawlers.blueprint.nodes.scroll.toPosition.description'
      },
      {
        key: 'scroll-into-view',
        icon: 'i-lucide-eye',
        title: 'pages.crawlers.blueprint.nodes.scroll.intoView.title',
        description: 'pages.crawlers.blueprint.nodes.scroll.intoView.description'
      },
      {
        key: 'scroll-infinite',
        icon: 'i-lucide-repeat',
        title: 'pages.crawlers.blueprint.nodes.scroll.infinite.title',
        description: 'pages.crawlers.blueprint.nodes.scroll.infinite.description'
      }
    ]
  },
  {
    icon: 'i-lucide-scan-search',
    title: 'pages.crawlers.blueprint.groups.extract.title',
    description: 'pages.crawlers.blueprint.groups.extract.description',
    nodes: [
      {
        key: 'extract-get-text',
        icon: 'i-lucide-text-cursor-input',
        title: 'pages.crawlers.blueprint.nodes.extract.getText.title',
        description: 'pages.crawlers.blueprint.nodes.extract.getText.description'
      },
      {
        key: 'extract-get-attribute',
        icon: 'i-lucide-tag',
        title: 'pages.crawlers.blueprint.nodes.extract.getAttribute.title',
        description: 'pages.crawlers.blueprint.nodes.extract.getAttribute.description'
      },
      {
        key: 'extract-get-html',
        icon: 'i-lucide-code',
        title: 'pages.crawlers.blueprint.nodes.extract.getHtml.title',
        description: 'pages.crawlers.blueprint.nodes.extract.getHtml.description'
      },
      {
        key: 'extract-get-value',
        icon: 'i-lucide-form-input',
        title: 'pages.crawlers.blueprint.nodes.extract.getValue.title',
        description: 'pages.crawlers.blueprint.nodes.extract.getValue.description'
      },
      {
        key: 'extract-query-element',
        icon: 'i-lucide-search',
        title: 'pages.crawlers.blueprint.nodes.extract.queryElement.title',
        description: 'pages.crawlers.blueprint.nodes.extract.queryElement.description'
      },
      {
        key: 'extract-query-all-elements',
        icon: 'i-lucide-list',
        title: 'pages.crawlers.blueprint.nodes.extract.queryAllElements.title',
        description: 'pages.crawlers.blueprint.nodes.extract.queryAllElements.description'
      },
      {
        key: 'extract-execute-script',
        icon: 'i-lucide-square-code',
        title: 'pages.crawlers.blueprint.nodes.extract.executeScript.title',
        description: 'pages.crawlers.blueprint.nodes.extract.executeScript.description'
      }
    ]
  },
  {
    icon: 'i-lucide-globe',
    title: 'pages.crawlers.blueprint.groups.http.title',
    description: 'pages.crawlers.blueprint.groups.http.description',
    nodes: [
      {
        key: 'http-request',
        icon: 'i-lucide-globe',
        title: 'pages.crawlers.blueprint.nodes.http.request.title',
        description: 'pages.crawlers.blueprint.nodes.http.request.description'
      },
      {
        key: 'http-get-cookies',
        icon: 'i-lucide-cookie',
        title: 'pages.crawlers.blueprint.nodes.http.getCookies.title',
        description: 'pages.crawlers.blueprint.nodes.http.getCookies.description'
      },
      {
        key: 'http-set-cookies',
        icon: 'i-lucide-clipboard-plus',
        title: 'pages.crawlers.blueprint.nodes.http.setCookies.title',
        description: 'pages.crawlers.blueprint.nodes.http.setCookies.description'
      }
    ]
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'pages.crawlers.blueprint.groups.detect.title',
    description: 'pages.crawlers.blueprint.groups.detect.description',
    nodes: [
      {
        key: 'detect-verification',
        icon: 'i-lucide-shield-alert',
        title: 'pages.crawlers.blueprint.nodes.detect.verification.title',
        description: 'pages.crawlers.blueprint.nodes.detect.verification.description'
      }
    ]
  },
  {
    icon: 'i-lucide-monitor-cog',
    title: 'pages.crawlers.blueprint.groups.system.title',
    description: 'pages.crawlers.blueprint.groups.system.description',
    nodes: [
      {
        key: 'system-screen-size',
        icon: 'i-lucide-maximize',
        title: 'pages.crawlers.blueprint.nodes.system.screenSize.title',
        description: 'pages.crawlers.blueprint.nodes.system.screenSize.description'
      },
      {
        key: 'system-window-size',
        icon: 'i-lucide-app-window',
        title: 'pages.crawlers.blueprint.nodes.system.windowSize.title',
        description: 'pages.crawlers.blueprint.nodes.system.windowSize.description'
      },
      {
        key: 'system-mouse-position',
        icon: 'i-lucide-target',
        title: 'pages.crawlers.blueprint.nodes.system.mousePosition.title',
        description: 'pages.crawlers.blueprint.nodes.system.mousePosition.description'
      },
      {
        key: 'system-element-position',
        icon: 'i-lucide-locate-fixed',
        title: 'pages.crawlers.blueprint.nodes.system.elementPosition.title',
        description: 'pages.crawlers.blueprint.nodes.system.elementPosition.description'
      },
      {
        key: 'system-read-clipboard',
        icon: 'i-lucide-clipboard-copy',
        title: 'pages.crawlers.blueprint.nodes.system.readClipboard.title',
        description: 'pages.crawlers.blueprint.nodes.system.readClipboard.description'
      },
      {
        key: 'system-write-clipboard',
        icon: 'i-lucide-clipboard-plus',
        title: 'pages.crawlers.blueprint.nodes.system.writeClipboard.title',
        description: 'pages.crawlers.blueprint.nodes.system.writeClipboard.description'
      }
    ]
  },
  {
    icon: 'i-lucide-variable',
    title: 'pages.crawlers.blueprint.groups.variable.title',
    description: 'pages.crawlers.blueprint.groups.variable.description',
    nodes: [
      {
        key: 'variable-set',
        icon: 'i-lucide-variable',
        title: 'pages.crawlers.blueprint.nodes.variable.set.title',
        description: 'pages.crawlers.blueprint.nodes.variable.set.description'
      },
      {
        key: 'variable-get',
        icon: 'i-lucide-hash',
        title: 'pages.crawlers.blueprint.nodes.variable.get.title',
        description: 'pages.crawlers.blueprint.nodes.variable.get.description'
      }
    ]
  },
  {
    icon: 'i-lucide-bookmark',
    title: 'pages.crawlers.blueprint.groups.constant.title',
    description: 'pages.crawlers.blueprint.groups.constant.description',
    nodes: [
      {
        key: 'constant-get',
        icon: 'i-lucide-bookmark-check',
        title: 'pages.crawlers.blueprint.nodes.constant.get.title',
        description: 'pages.crawlers.blueprint.nodes.constant.get.description'
      }
    ]
  },
  {
    icon: 'i-lucide-git-compare-arrows',
    title: 'pages.crawlers.blueprint.groups.logic.title',
    description: 'pages.crawlers.blueprint.groups.logic.description',
    nodes: [
      {
        key: 'logic-equal',
        icon: 'i-lucide-equal',
        title: 'pages.crawlers.blueprint.nodes.logic.equal.title',
        description: 'pages.crawlers.blueprint.nodes.logic.equal.description'
      },
      {
        key: 'logic-not-equal',
        icon: 'i-lucide-equal-not',
        title: 'pages.crawlers.blueprint.nodes.logic.notEqual.title',
        description: 'pages.crawlers.blueprint.nodes.logic.notEqual.description'
      },
      {
        key: 'logic-greater-than',
        icon: 'i-lucide-arrow-up-down',
        title: 'pages.crawlers.blueprint.nodes.logic.greaterThan.title',
        description: 'pages.crawlers.blueprint.nodes.logic.greaterThan.description'
      },
      {
        key: 'logic-less-than',
        icon: 'i-lucide-arrow-down-up',
        title: 'pages.crawlers.blueprint.nodes.logic.lessThan.title',
        description: 'pages.crawlers.blueprint.nodes.logic.lessThan.description'
      },
      {
        key: 'logic-greater-than-or-equal',
        icon: 'i-lucide-git-compare-arrows',
        title: 'pages.crawlers.blueprint.nodes.logic.greaterThanOrEqual.title',
        description: 'pages.crawlers.blueprint.nodes.logic.greaterThanOrEqual.description'
      },
      {
        key: 'logic-less-than-or-equal',
        icon: 'i-lucide-git-compare',
        title: 'pages.crawlers.blueprint.nodes.logic.lessThanOrEqual.title',
        description: 'pages.crawlers.blueprint.nodes.logic.lessThanOrEqual.description'
      },
      {
        key: 'logic-and',
        icon: 'i-lucide-ampersand',
        title: 'pages.crawlers.blueprint.nodes.logic.and.title',
        description: 'pages.crawlers.blueprint.nodes.logic.and.description'
      },
      {
        key: 'logic-or',
        icon: 'i-lucide-orbit',
        title: 'pages.crawlers.blueprint.nodes.logic.or.title',
        description: 'pages.crawlers.blueprint.nodes.logic.or.description'
      },
      {
        key: 'logic-not',
        icon: 'i-lucide-ban',
        title: 'pages.crawlers.blueprint.nodes.logic.not.title',
        description: 'pages.crawlers.blueprint.nodes.logic.not.description'
      },
      {
        key: 'logic-is-empty',
        icon: 'i-lucide-circle-question-mark',
        title: 'pages.crawlers.blueprint.nodes.logic.isEmpty.title',
        description: 'pages.crawlers.blueprint.nodes.logic.isEmpty.description'
      },
      {
        key: 'logic-exists',
        icon: 'i-lucide-circle-check',
        title: 'pages.crawlers.blueprint.nodes.logic.exists.title',
        description: 'pages.crawlers.blueprint.nodes.logic.exists.description'
      }
    ]
  },
  {
    icon: 'i-lucide-square-function',
    title: 'pages.crawlers.blueprint.groups.math.title',
    description: 'pages.crawlers.blueprint.groups.math.description',
    nodes: [
      {
        key: 'math-add',
        icon: 'i-lucide-plus',
        title: 'pages.crawlers.blueprint.nodes.math.add.title',
        description: 'pages.crawlers.blueprint.nodes.math.add.description'
      },
      {
        key: 'math-subtract',
        icon: 'i-lucide-minus',
        title: 'pages.crawlers.blueprint.nodes.math.subtract.title',
        description: 'pages.crawlers.blueprint.nodes.math.subtract.description'
      },
      {
        key: 'math-multiply',
        icon: 'i-lucide-x',
        title: 'pages.crawlers.blueprint.nodes.math.multiply.title',
        description: 'pages.crawlers.blueprint.nodes.math.multiply.description'
      },
      {
        key: 'math-divide',
        icon: 'i-lucide-divide',
        title: 'pages.crawlers.blueprint.nodes.math.divide.title',
        description: 'pages.crawlers.blueprint.nodes.math.divide.description'
      },
      {
        key: 'math-round',
        icon: 'i-lucide-circle-equal',
        title: 'pages.crawlers.blueprint.nodes.math.round.title',
        description: 'pages.crawlers.blueprint.nodes.math.round.description'
      },
      {
        key: 'math-random',
        icon: 'i-lucide-shuffle',
        title: 'pages.crawlers.blueprint.nodes.math.random.title',
        description: 'pages.crawlers.blueprint.nodes.math.random.description'
      },
      {
        key: 'math-absolute',
        icon: 'i-lucide-axis-3d',
        title: 'pages.crawlers.blueprint.nodes.math.absolute.title',
        description: 'pages.crawlers.blueprint.nodes.math.absolute.description'
      },
      {
        key: 'math-modulo',
        icon: 'i-lucide-percent',
        title: 'pages.crawlers.blueprint.nodes.math.modulo.title',
        description: 'pages.crawlers.blueprint.nodes.math.modulo.description'
      },
      {
        key: 'math-power',
        icon: 'i-lucide-superscript',
        title: 'pages.crawlers.blueprint.nodes.math.power.title',
        description: 'pages.crawlers.blueprint.nodes.math.power.description'
      }
    ]
  },
  {
    icon: 'i-lucide-regex',
    title: 'pages.crawlers.blueprint.groups.string.title',
    description: 'pages.crawlers.blueprint.groups.string.description',
    nodes: [
      {
        key: 'string-substring',
        icon: 'i-lucide-scissors',
        title: 'pages.crawlers.blueprint.nodes.string.substring.title',
        description: 'pages.crawlers.blueprint.nodes.string.substring.description'
      },
      {
        key: 'string-replace',
        icon: 'i-lucide-eraser',
        title: 'pages.crawlers.blueprint.nodes.string.replace.title',
        description: 'pages.crawlers.blueprint.nodes.string.replace.description'
      },
      {
        key: 'string-concat',
        icon: 'i-lucide-link',
        title: 'pages.crawlers.blueprint.nodes.string.concat.title',
        description: 'pages.crawlers.blueprint.nodes.string.concat.description'
      },
      {
        key: 'string-regex-match',
        icon: 'i-lucide-search-code',
        title: 'pages.crawlers.blueprint.nodes.string.regexMatch.title',
        description: 'pages.crawlers.blueprint.nodes.string.regexMatch.description'
      },
      {
        key: 'string-regex-replace',
        icon: 'i-lucide-code',
        title: 'pages.crawlers.blueprint.nodes.string.regexReplace.title',
        description: 'pages.crawlers.blueprint.nodes.string.regexReplace.description'
      },
      {
        key: 'string-split',
        icon: 'i-lucide-split-square-horizontal',
        title: 'pages.crawlers.blueprint.nodes.string.split.title',
        description: 'pages.crawlers.blueprint.nodes.string.split.description'
      },
      {
        key: 'string-length',
        icon: 'i-lucide-ruler',
        title: 'pages.crawlers.blueprint.nodes.string.length.title',
        description: 'pages.crawlers.blueprint.nodes.string.length.description'
      },
      {
        key: 'string-uppercase',
        icon: 'i-lucide-type',
        title: 'pages.crawlers.blueprint.nodes.string.uppercase.title',
        description: 'pages.crawlers.blueprint.nodes.string.uppercase.description'
      },
      {
        key: 'string-lowercase',
        icon: 'i-lucide-text',
        title: 'pages.crawlers.blueprint.nodes.string.lowercase.title',
        description: 'pages.crawlers.blueprint.nodes.string.lowercase.description'
      },
      {
        key: 'string-trim',
        icon: 'i-lucide-eraser',
        title: 'pages.crawlers.blueprint.nodes.string.trim.title',
        description: 'pages.crawlers.blueprint.nodes.string.trim.description'
      }
    ]
  },
  {
    icon: 'i-lucide-calendar-clock',
    title: 'pages.crawlers.blueprint.groups.dateTime.title',
    description: 'pages.crawlers.blueprint.groups.dateTime.description',
    nodes: [
      {
        key: 'date-time-now',
        icon: 'i-lucide-calendar-clock',
        title: 'pages.crawlers.blueprint.nodes.dateTime.now.title',
        description: 'pages.crawlers.blueprint.nodes.dateTime.now.description'
      },
      {
        key: 'date-time-format',
        icon: 'i-lucide-calendar-range',
        title: 'pages.crawlers.blueprint.nodes.dateTime.format.title',
        description: 'pages.crawlers.blueprint.nodes.dateTime.format.description'
      }
    ]
  },
  {
    icon: 'i-lucide-braces',
    title: 'pages.crawlers.blueprint.groups.arrayObject.title',
    description: 'pages.crawlers.blueprint.groups.arrayObject.description',
    nodes: [
      {
        key: 'array-object-filter',
        icon: 'i-lucide-list-filter',
        title: 'pages.crawlers.blueprint.nodes.arrayObject.filter.title',
        description: 'pages.crawlers.blueprint.nodes.arrayObject.filter.description'
      },
      {
        key: 'array-object-merge',
        icon: 'i-lucide-merge',
        title: 'pages.crawlers.blueprint.nodes.arrayObject.merge.title',
        description: 'pages.crawlers.blueprint.nodes.arrayObject.merge.description'
      },
      {
        key: 'array-object-split',
        icon: 'i-lucide-rows-3',
        title: 'pages.crawlers.blueprint.nodes.arrayObject.split.title',
        description: 'pages.crawlers.blueprint.nodes.arrayObject.split.description'
      },
      {
        key: 'array-object-length',
        icon: 'i-lucide-list',
        title: 'pages.crawlers.blueprint.nodes.arrayObject.length.title',
        description: 'pages.crawlers.blueprint.nodes.arrayObject.length.description'
      },
      {
        key: 'array-object-item',
        icon: 'i-lucide-hash',
        title: 'pages.crawlers.blueprint.nodes.arrayObject.item.title',
        description: 'pages.crawlers.blueprint.nodes.arrayObject.item.description'
      }
    ]
  },
  {
    icon: 'i-lucide-replace',
    title: 'pages.crawlers.blueprint.groups.typeConvert.title',
    description: 'pages.crawlers.blueprint.groups.typeConvert.description',
    nodes: [
      {
        key: 'type-convert-string',
        icon: 'i-lucide-quote',
        title: 'pages.crawlers.blueprint.nodes.typeConvert.string.title',
        description: 'pages.crawlers.blueprint.nodes.typeConvert.string.description'
      },
      {
        key: 'type-convert-number',
        icon: 'i-lucide-hash',
        title: 'pages.crawlers.blueprint.nodes.typeConvert.number.title',
        description: 'pages.crawlers.blueprint.nodes.typeConvert.number.description'
      },
      {
        key: 'type-convert-boolean',
        icon: 'i-lucide-toggle-left',
        title: 'pages.crawlers.blueprint.nodes.typeConvert.boolean.title',
        description: 'pages.crawlers.blueprint.nodes.typeConvert.boolean.description'
      },
      {
        key: 'type-convert-json',
        icon: 'i-lucide-file-braces',
        title: 'pages.crawlers.blueprint.nodes.typeConvert.json.title',
        description: 'pages.crawlers.blueprint.nodes.typeConvert.json.description'
      },
      {
        key: 'type-convert-parse-json',
        icon: 'i-lucide-braces',
        title: 'pages.crawlers.blueprint.nodes.typeConvert.parseJson.title',
        description: 'pages.crawlers.blueprint.nodes.typeConvert.parseJson.description'
      }
    ]
  },
  {
    icon: 'i-lucide-git-branch',
    title: 'pages.crawlers.blueprint.groups.controlFlow.title',
    description: 'pages.crawlers.blueprint.groups.controlFlow.description',
    nodes: [
      {
        key: 'control-flow-loop',
        icon: 'i-lucide-repeat-2',
        title: 'pages.crawlers.blueprint.nodes.controlFlow.loop.title',
        description: 'pages.crawlers.blueprint.nodes.controlFlow.loop.description'
      },
      {
        key: 'control-flow-condition',
        icon: 'i-lucide-git-branch',
        title: 'pages.crawlers.blueprint.nodes.controlFlow.condition.title',
        description: 'pages.crawlers.blueprint.nodes.controlFlow.condition.description'
      },
      {
        key: 'control-flow-switch',
        icon: 'i-lucide-workflow',
        title: 'pages.crawlers.blueprint.nodes.controlFlow.switch.title',
        description: 'pages.crawlers.blueprint.nodes.controlFlow.switch.description'
      }
    ]
  },
  {
    icon: 'i-lucide-send',
    title: 'pages.crawlers.blueprint.groups.output.title',
    description: 'pages.crawlers.blueprint.groups.output.description',
    nodes: [
      {
        key: 'output-save-data',
        icon: 'i-lucide-save',
        title: 'pages.crawlers.blueprint.nodes.output.saveData.title',
        description: 'pages.crawlers.blueprint.nodes.output.saveData.description'
      },
      {
        key: 'output-print-log',
        icon: 'i-lucide-logs',
        title: 'pages.crawlers.blueprint.nodes.output.printLog.title',
        description: 'pages.crawlers.blueprint.nodes.output.printLog.description'
      },
      {
        key: 'output-play-sound',
        icon: 'i-lucide-bell',
        title: 'pages.crawlers.blueprint.nodes.output.playSound.title',
        description: 'pages.crawlers.blueprint.nodes.output.playSound.description'
      },
      {
        key: 'output-send-email',
        icon: 'i-lucide-mail',
        title: 'pages.crawlers.blueprint.nodes.output.sendEmail.title',
        description: 'pages.crawlers.blueprint.nodes.output.sendEmail.description'
      },
      {
        key: 'output-screenshot',
        icon: 'i-lucide-camera',
        title: 'pages.crawlers.blueprint.nodes.output.screenshot.title',
        description: 'pages.crawlers.blueprint.nodes.output.screenshot.description'
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
    label: translate(group.title),
    description: translate(group.description),
    iconName: group.icon,
    crawlers: group.nodes.map((node) => ({
      key: node.key,
      name: translate(node.title),
      description: translate(node.description),
      iconName: node.icon
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
export const useCrawlerBlueprintNodesMenu = () => {
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
      /**
       * 常量：groups。
       */
      const groups = crawlerBlueprintGroupsBuild((key) => key);

      expect(groups).toHaveLength(18);
      expect(groups[0]?.label).toBe('pages.crawlers.blueprint.groups.navigation.title');
      expect(groups[0]?.crawlers[0]?.key).toBe('navigation-goto');
      expect(groups[0]?.crawlers[0]?.iconName).toBe('i-lucide-external-link');
      expect(groups[0]?.crawlers[1]?.iconName).toBe('i-lucide-refresh-cw');
      expect(groups[8]?.crawlers[0]?.iconName).toBe('i-lucide-variable');
      expect(groups[9]?.label).toBe('pages.crawlers.blueprint.groups.constant.title');
      expect(groups[10]?.label).toBe('pages.crawlers.blueprint.groups.logic.title');
      expect(groups[10]?.crawlers[0]?.iconName).toBe('i-lucide-equal');
      expect(groups[13]?.label).toBe('pages.crawlers.blueprint.groups.dateTime.title');
      expect(groups[17]?.crawlers).toContainEqual(expect.objectContaining({ key: 'output-play-sound', iconName: 'i-lucide-bell' }));
      expect(groups[17]?.crawlers).toContainEqual(expect.objectContaining({ key: 'output-send-email', iconName: 'i-lucide-mail' }));
    });
  });
}
