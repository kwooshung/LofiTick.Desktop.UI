import type { ICrawlersListGroup } from '@/components/crawlers/list/index.types';

/**
 * 常量：爬虫蓝图分组定义。
 */
const crawlerBlueprintGroupDefinitions: ICrawlersBlueprintGroupDefinition[] = [
  {
    labelKey: 'pages.crawlers.blueprint.groups.navigation.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.navigation.description',
    iconName: 'i-lucide-compass',
    nodes: [
      {
        key: 'navigation-goto',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.goto.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.goto.description',
        iconName: 'i-lucide-external-link'
      },
      {
        key: 'navigation-refresh',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.refresh.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.refresh.description',
        iconName: 'i-lucide-refresh-cw'
      },
      {
        key: 'navigation-back',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.back.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.back.description',
        iconName: 'i-lucide-arrow-left'
      },
      {
        key: 'navigation-forward',
        labelKey: 'pages.crawlers.blueprint.nodes.navigation.forward.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.navigation.forward.description',
        iconName: 'i-lucide-arrow-right'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.wait.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.wait.description',
    iconName: 'i-lucide-clock-3',
    nodes: [
      {
        key: 'wait-element',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.element.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.element.description',
        iconName: 'i-lucide-scan-search'
      },
      {
        key: 'wait-time',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.time.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.time.description',
        iconName: 'i-lucide-clock-3'
      },
      {
        key: 'wait-random',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.random.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.random.description',
        iconName: 'i-lucide-shuffle'
      },
      {
        key: 'wait-load-state',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.loadState.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.loadState.description',
        iconName: 'i-lucide-loader-circle'
      },
      {
        key: 'wait-condition',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.condition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.condition.description',
        iconName: 'i-lucide-braces'
      },
      {
        key: 'wait-text',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.text.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.text.description',
        iconName: 'i-lucide-text-search'
      },
      {
        key: 'wait-delay',
        labelKey: 'pages.crawlers.blueprint.nodes.wait.delay.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.wait.delay.description',
        iconName: 'i-lucide-hourglass'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.interaction.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.interaction.description',
    iconName: 'i-lucide-mouse-pointer-click',
    nodes: [
      {
        key: 'interaction-click-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.clickElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.clickElement.description',
        iconName: 'i-lucide-mouse-pointer-click'
      },
      {
        key: 'interaction-double-click-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.doubleClickElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.doubleClickElement.description',
        iconName: 'i-lucide-mouse-pointer-2'
      },
      {
        key: 'interaction-hover-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.hoverElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.hoverElement.description',
        iconName: 'i-lucide-mouse'
      },
      {
        key: 'interaction-input-text',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.inputText.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.inputText.description',
        iconName: 'i-lucide-text-cursor-input'
      },
      {
        key: 'interaction-fill-content',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.fillContent.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.fillContent.description',
        iconName: 'i-lucide-form-input'
      },
      {
        key: 'interaction-select-option',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.selectOption.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.selectOption.description',
        iconName: 'i-lucide-list-filter'
      },
      {
        key: 'interaction-check-box',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.checkBox.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.checkBox.description',
        iconName: 'i-lucide-check-square'
      },
      {
        key: 'interaction-uncheck-box',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.uncheckBox.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.uncheckBox.description',
        iconName: 'i-lucide-toggle-left'
      },
      {
        key: 'interaction-focus-element',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.focusElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.focusElement.description',
        iconName: 'i-lucide-focus'
      },
      {
        key: 'interaction-dispatch-event',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.dispatchEvent.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.dispatchEvent.description',
        iconName: 'i-lucide-send'
      },
      {
        key: 'interaction-press-key',
        labelKey: 'pages.crawlers.blueprint.nodes.interaction.pressKey.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.interaction.pressKey.description',
        iconName: 'i-lucide-key-round'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.mouse.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.mouse.description',
    iconName: 'i-lucide-mouse-pointer-2',
    nodes: [
      {
        key: 'mouse-move',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.move.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.move.description',
        iconName: 'i-lucide-move'
      },
      {
        key: 'mouse-curve',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.curve.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.curve.description',
        iconName: 'i-lucide-spline'
      },
      {
        key: 'mouse-accel',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.accel.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.accel.description',
        iconName: 'i-lucide-rocket'
      },
      {
        key: 'mouse-jitter',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.jitter.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.jitter.description',
        iconName: 'i-lucide-wand-sparkles'
      },
      {
        key: 'mouse-duration',
        labelKey: 'pages.crawlers.blueprint.nodes.mouse.duration.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.mouse.duration.description',
        iconName: 'i-lucide-timer'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.scroll.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.scroll.description',
    iconName: 'i-lucide-move-vertical',
    nodes: [
      {
        key: 'scroll-to-position',
        labelKey: 'pages.crawlers.blueprint.nodes.scroll.toPosition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.scroll.toPosition.description',
        iconName: 'i-lucide-arrow-down-to-line'
      },
      {
        key: 'scroll-into-view',
        labelKey: 'pages.crawlers.blueprint.nodes.scroll.intoView.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.scroll.intoView.description',
        iconName: 'i-lucide-eye'
      },
      {
        key: 'scroll-infinite',
        labelKey: 'pages.crawlers.blueprint.nodes.scroll.infinite.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.scroll.infinite.description',
        iconName: 'i-lucide-repeat'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.extract.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.extract.description',
    iconName: 'i-lucide-scan-search',
    nodes: [
      {
        key: 'extract-get-text',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getText.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getText.description',
        iconName: 'i-lucide-text-cursor-input'
      },
      {
        key: 'extract-get-attribute',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getAttribute.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getAttribute.description',
        iconName: 'i-lucide-tag'
      },
      {
        key: 'extract-get-html',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getHtml.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getHtml.description',
        iconName: 'i-lucide-code'
      },
      {
        key: 'extract-get-value',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.getValue.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.getValue.description',
        iconName: 'i-lucide-form-input'
      },
      {
        key: 'extract-query-element',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.queryElement.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.queryElement.description',
        iconName: 'i-lucide-search'
      },
      {
        key: 'extract-query-all-elements',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.queryAllElements.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.queryAllElements.description',
        iconName: 'i-lucide-list'
      },
      {
        key: 'extract-execute-script',
        labelKey: 'pages.crawlers.blueprint.nodes.extract.executeScript.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.extract.executeScript.description',
        iconName: 'i-lucide-square-code'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.http.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.http.description',
    iconName: 'i-lucide-globe',
    nodes: [
      {
        key: 'http-request',
        labelKey: 'pages.crawlers.blueprint.nodes.http.request.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.http.request.description',
        iconName: 'i-lucide-globe'
      },
      {
        key: 'http-get-cookies',
        labelKey: 'pages.crawlers.blueprint.nodes.http.getCookies.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.http.getCookies.description',
        iconName: 'i-lucide-cookie'
      },
      {
        key: 'http-set-cookies',
        labelKey: 'pages.crawlers.blueprint.nodes.http.setCookies.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.http.setCookies.description',
        iconName: 'i-lucide-clipboard-plus'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.detect.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.detect.description',
    iconName: 'i-lucide-shield-check',
    nodes: [
      {
        key: 'detect-verification',
        labelKey: 'pages.crawlers.blueprint.nodes.detect.verification.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.detect.verification.description',
        iconName: 'i-lucide-shield-alert'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.system.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.system.description',
    iconName: 'i-lucide-monitor-cog',
    nodes: [
      {
        key: 'system-screen-size',
        labelKey: 'pages.crawlers.blueprint.nodes.system.screenSize.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.screenSize.description',
        iconName: 'i-lucide-maximize'
      },
      {
        key: 'system-window-size',
        labelKey: 'pages.crawlers.blueprint.nodes.system.windowSize.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.windowSize.description',
        iconName: 'i-lucide-app-window'
      },
      {
        key: 'system-mouse-position',
        labelKey: 'pages.crawlers.blueprint.nodes.system.mousePosition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.mousePosition.description',
        iconName: 'i-lucide-target'
      },
      {
        key: 'system-read-clipboard',
        labelKey: 'pages.crawlers.blueprint.nodes.system.readClipboard.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.readClipboard.description',
        iconName: 'i-lucide-clipboard-copy'
      },
      {
        key: 'system-write-clipboard',
        labelKey: 'pages.crawlers.blueprint.nodes.system.writeClipboard.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.system.writeClipboard.description',
        iconName: 'i-lucide-clipboard-plus'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.variable.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.variable.description',
    iconName: 'i-lucide-variable',
    nodes: [
      {
        key: 'variable-set',
        labelKey: 'pages.crawlers.blueprint.nodes.variable.set.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.variable.set.description',
        iconName: 'i-lucide-variable'
      },
      {
        key: 'variable-get',
        labelKey: 'pages.crawlers.blueprint.nodes.variable.get.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.variable.get.description',
        iconName: 'i-lucide-hash'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.logic.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.logic.description',
    iconName: 'i-lucide-git-compare-arrows',
    nodes: [
      {
        key: 'logic-equal',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.equal.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.equal.description',
        iconName: 'i-lucide-equal'
      },
      {
        key: 'logic-not-equal',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.notEqual.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.notEqual.description',
        iconName: 'i-lucide-equal-not'
      },
      {
        key: 'logic-greater-than',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.greaterThan.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.greaterThan.description',
        iconName: 'i-lucide-arrow-up-down'
      },
      {
        key: 'logic-less-than',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.lessThan.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.lessThan.description',
        iconName: 'i-lucide-arrow-down-up'
      },
      {
        key: 'logic-greater-than-or-equal',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.greaterThanOrEqual.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.greaterThanOrEqual.description',
        iconName: 'i-lucide-git-compare-arrows'
      },
      {
        key: 'logic-less-than-or-equal',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.lessThanOrEqual.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.lessThanOrEqual.description',
        iconName: 'i-lucide-git-compare'
      },
      {
        key: 'logic-and',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.and.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.and.description',
        iconName: 'i-lucide-ampersand'
      },
      {
        key: 'logic-or',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.or.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.or.description',
        iconName: 'i-lucide-orbit'
      },
      {
        key: 'logic-not',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.not.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.not.description',
        iconName: 'i-lucide-ban'
      },
      {
        key: 'logic-is-empty',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.isEmpty.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.isEmpty.description',
        iconName: 'i-lucide-circle-question-mark'
      },
      {
        key: 'logic-exists',
        labelKey: 'pages.crawlers.blueprint.nodes.logic.exists.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.logic.exists.description',
        iconName: 'i-lucide-circle-check'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.math.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.math.description',
    iconName: 'i-lucide-square-function',
    nodes: [
      {
        key: 'math-add',
        labelKey: 'pages.crawlers.blueprint.nodes.math.add.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.add.description',
        iconName: 'i-lucide-plus'
      },
      {
        key: 'math-subtract',
        labelKey: 'pages.crawlers.blueprint.nodes.math.subtract.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.subtract.description',
        iconName: 'i-lucide-minus'
      },
      {
        key: 'math-multiply',
        labelKey: 'pages.crawlers.blueprint.nodes.math.multiply.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.multiply.description',
        iconName: 'i-lucide-x'
      },
      {
        key: 'math-divide',
        labelKey: 'pages.crawlers.blueprint.nodes.math.divide.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.divide.description',
        iconName: 'i-lucide-divide'
      },
      {
        key: 'math-round',
        labelKey: 'pages.crawlers.blueprint.nodes.math.round.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.round.description',
        iconName: 'i-lucide-circle-equal'
      },
      {
        key: 'math-random',
        labelKey: 'pages.crawlers.blueprint.nodes.math.random.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.random.description',
        iconName: 'i-lucide-shuffle'
      },
      {
        key: 'math-absolute',
        labelKey: 'pages.crawlers.blueprint.nodes.math.absolute.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.absolute.description',
        iconName: 'i-lucide-axis-3d'
      },
      {
        key: 'math-modulo',
        labelKey: 'pages.crawlers.blueprint.nodes.math.modulo.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.modulo.description',
        iconName: 'i-lucide-percent'
      },
      {
        key: 'math-power',
        labelKey: 'pages.crawlers.blueprint.nodes.math.power.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.math.power.description',
        iconName: 'i-lucide-superscript'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.string.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.string.description',
    iconName: 'i-lucide-regex',
    nodes: [
      {
        key: 'string-substring',
        labelKey: 'pages.crawlers.blueprint.nodes.string.substring.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.substring.description',
        iconName: 'i-lucide-scissors'
      },
      {
        key: 'string-replace',
        labelKey: 'pages.crawlers.blueprint.nodes.string.replace.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.replace.description',
        iconName: 'i-lucide-eraser'
      },
      {
        key: 'string-concat',
        labelKey: 'pages.crawlers.blueprint.nodes.string.concat.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.concat.description',
        iconName: 'i-lucide-link'
      },
      {
        key: 'string-regex-match',
        labelKey: 'pages.crawlers.blueprint.nodes.string.regexMatch.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.regexMatch.description',
        iconName: 'i-lucide-search-code'
      },
      {
        key: 'string-regex-replace',
        labelKey: 'pages.crawlers.blueprint.nodes.string.regexReplace.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.regexReplace.description',
        iconName: 'i-lucide-code'
      },
      {
        key: 'string-split',
        labelKey: 'pages.crawlers.blueprint.nodes.string.split.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.split.description',
        iconName: 'i-lucide-split-square-horizontal'
      },
      {
        key: 'string-length',
        labelKey: 'pages.crawlers.blueprint.nodes.string.length.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.length.description',
        iconName: 'i-lucide-ruler'
      },
      {
        key: 'string-uppercase',
        labelKey: 'pages.crawlers.blueprint.nodes.string.uppercase.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.uppercase.description',
        iconName: 'i-lucide-type'
      },
      {
        key: 'string-lowercase',
        labelKey: 'pages.crawlers.blueprint.nodes.string.lowercase.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.lowercase.description',
        iconName: 'i-lucide-text'
      },
      {
        key: 'string-trim',
        labelKey: 'pages.crawlers.blueprint.nodes.string.trim.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.string.trim.description',
        iconName: 'i-lucide-eraser'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.arrayObject.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.arrayObject.description',
    iconName: 'i-lucide-braces',
    nodes: [
      {
        key: 'array-object-filter',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.filter.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.filter.description',
        iconName: 'i-lucide-list-filter'
      },
      {
        key: 'array-object-merge',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.merge.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.merge.description',
        iconName: 'i-lucide-merge'
      },
      {
        key: 'array-object-split',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.split.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.split.description',
        iconName: 'i-lucide-rows-3'
      },
      {
        key: 'array-object-length',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.length.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.length.description',
        iconName: 'i-lucide-list'
      },
      {
        key: 'array-object-item',
        labelKey: 'pages.crawlers.blueprint.nodes.arrayObject.item.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.arrayObject.item.description',
        iconName: 'i-lucide-hash'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.typeConvert.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.typeConvert.description',
    iconName: 'i-lucide-replace',
    nodes: [
      {
        key: 'type-convert-string',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.string.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.string.description',
        iconName: 'i-lucide-quote'
      },
      {
        key: 'type-convert-number',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.number.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.number.description',
        iconName: 'i-lucide-hash'
      },
      {
        key: 'type-convert-boolean',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.boolean.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.boolean.description',
        iconName: 'i-lucide-toggle-left'
      },
      {
        key: 'type-convert-json',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.json.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.json.description',
        iconName: 'i-lucide-file-braces'
      },
      {
        key: 'type-convert-parse-json',
        labelKey: 'pages.crawlers.blueprint.nodes.typeConvert.parseJson.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.typeConvert.parseJson.description',
        iconName: 'i-lucide-braces'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.controlFlow.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.controlFlow.description',
    iconName: 'i-lucide-git-branch',
    nodes: [
      {
        key: 'control-flow-loop',
        labelKey: 'pages.crawlers.blueprint.nodes.controlFlow.loop.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.controlFlow.loop.description',
        iconName: 'i-lucide-repeat-2'
      },
      {
        key: 'control-flow-condition',
        labelKey: 'pages.crawlers.blueprint.nodes.controlFlow.condition.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.controlFlow.condition.description',
        iconName: 'i-lucide-git-branch'
      },
      {
        key: 'control-flow-switch',
        labelKey: 'pages.crawlers.blueprint.nodes.controlFlow.switch.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.controlFlow.switch.description',
        iconName: 'i-lucide-workflow'
      }
    ]
  },
  {
    labelKey: 'pages.crawlers.blueprint.groups.output.title',
    descriptionKey: 'pages.crawlers.blueprint.groups.output.description',
    iconName: 'i-lucide-send',
    nodes: [
      {
        key: 'output-send-to-api',
        labelKey: 'pages.crawlers.blueprint.nodes.output.sendToApi.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.output.sendToApi.description',
        iconName: 'i-lucide-send'
      },
      {
        key: 'output-print-log',
        labelKey: 'pages.crawlers.blueprint.nodes.output.printLog.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.output.printLog.description',
        iconName: 'i-lucide-logs'
      },
      {
        key: 'output-screenshot',
        labelKey: 'pages.crawlers.blueprint.nodes.output.screenshot.title',
        descriptionKey: 'pages.crawlers.blueprint.nodes.output.screenshot.description',
        iconName: 'i-lucide-camera'
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
      description: translate(node.descriptionKey),
      iconName: node.iconName
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
      const groups = crawlerBlueprintGroupsBuild((key) => key);

      expect(groups).toHaveLength(17);
      expect(groups[0]?.label).toBe('pages.crawlers.blueprint.groups.navigation.title');
      expect(groups[0]?.crawlers[0]?.key).toBe('navigation-goto');
      expect(groups[0]?.crawlers[0]?.iconName).toBe('i-lucide-external-link');
      expect(groups[0]?.crawlers[1]?.iconName).toBe('i-lucide-refresh-cw');
      expect(groups[9]?.crawlers[0]?.iconName).toBe('i-lucide-variable');
      expect(groups[10]?.label).toBe('pages.crawlers.blueprint.groups.logic.title');
      expect(groups[10]?.crawlers[0]?.iconName).toBe('i-lucide-equal');
    });
  });
}
