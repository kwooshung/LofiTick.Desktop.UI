export const crawler = {
  blueprint: {
    title: 'Crawler Blueprint',
    groups: {
      navigation: {
        title: 'Navigation and Page Control',
        description: 'Browser navigation, forward, and back'
      },
      wait: {
        title: 'Wait and Sync',
        description: 'Wait for elements, text, conditions, or time'
      },
      interaction: {
        title: 'Interaction and Input',
        description: 'Clicking, typing, selection, and keyboard input'
      },
      scroll: {
        title: 'Scroll and View',
        description: 'Control page scrolling and visibility'
      },
      extract: {
        title: 'Extract and Query',
        description: 'Read text, attributes, HTML, and script results'
      },
      http: {
        title: 'HTTP Request',
        description: 'Run raw HTTP requests and handle cookies'
      },
      system: {
        title: 'System and Window',
        description: 'Read screen, window, and clipboard data'
      },
      variable: {
        title: 'Data Processing - Variables',
        description: 'Store and read shared variables between nodes'
      },
      constant: {
        title: 'Data Processing - Constants',
        description: 'Read built-in system constants'
      },
      logic: {
        title: 'Data Processing - Logic',
        description: 'Comparison, boolean, and empty-value checks'
      },
      math: {
        title: 'Data Processing - Math',
        description: 'Basic arithmetic, random numbers, and rounding'
      },
      string: {
        title: 'Data Processing - Strings',
        description: 'Substring, replace, concat, and regex'
      },
      dateTime: {
        title: 'Data Processing - Date & Time',
        description: 'Handle current time and timestamp formats'
      },
      arrayObject: {
        title: 'Data Processing - Arrays and Objects',
        description: 'Filter, merge, split, and index lookup'
      },
      typeConvert: {
        title: 'Data Processing - Type Conversion',
        description: 'String, number, boolean, and JSON conversion'
      },
      controlFlow: {
        title: 'Control Flow',
        description: 'Looping, branching, and switch control'
      },
      output: {
        title: 'Output',
        description: 'Send, log, and screenshot outputs'
      }
    },
    nodes: {
      common: {
        start: {
          title: 'Start',
          description: 'Entry node that triggers crawler execution',
          form: {
            crawlerTitle: 'Crawler title (required)',
            crawlerTitlePlaceholder: 'Enter crawler title',
            crawlerTitleRequired: 'Crawler title is required before saving the blueprint.',
            crawlerDescription: 'Crawler description',
            crawlerDescriptionPlaceholder: 'Enter crawler description (optional)'
          }
        },
        end: {
          title: 'End',
          description: 'Terminal node that ends crawler execution'
        },
        function: {
          start: {
            title: 'Function Start',
            suffix: 'Start',
            description: 'Entry node for function logic and execution flow',
            fields: {
              parameterLabel: 'Parameter',
              parameterDescription: 'Parameter value output by the function start node'
            },
            actions: {
              add: 'Add parameter'
            },
            empty: {
              title: 'No parameters yet',
              description: 'Add parameters to let the function receive values from the outside.',
              domainMismatch: 'Domain mismatch: expected "{expected}"\n, actual "{actual}"'
            }
          },
          waitReady: {
            label: 'Wait for page ready'
          },
          timeoutMs: {
            label: 'Timeout (ms)'
          },
          windowWidth: {
            label: 'Window Width'
          },
          windowHeight: {
            label: 'Window Height'
          },
          windowPositionMode: {
            label: 'Position Mode',
            options: {
              preset: 'Preset position',
              custom: 'Custom coordinates'
            }
          },
          windowPositionPreset: {
            label: 'Preset Position',
            options: {
              topLeft: 'Top Left',
              topCenter: 'Top Center',
              topRight: 'Top Right',
              centerLeft: 'Middle Left',
              center: 'Center',
              centerRight: 'Middle Right',
              bottomLeft: 'Bottom Left',
              bottomCenter: 'Bottom Center',
              bottomRight: 'Bottom Right'
            }
          },
          windowX: {
            label: 'Window X'
          },
          windowY: {
            label: 'Window Y'
          },
          showWebview: {
            label: 'Show WebView'
          }
        }
      },
      refresh: {
        title: 'Refresh Page',
        description: 'Refresh the current page',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether the refresh succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when refresh fails'
        },
        fields: {
          timeoutMs: {
            label: 'Timeout (毫秒)'
          },
          waitReady: {
            label: 'Wait for page ready'
          },
          hardReload: {
            label: 'Hard reload'
          }
        }
      },
      back: {
        title: 'Back',
        description: 'Go back in browser history',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether the back navigation succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when back navigation fails'
        },
        fields: {
          steps: {
            label: 'Steps'
          },
          waitReady: {
            label: 'Wait for page ready'
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          },
          allowNoHistory: {
            label: 'Ignore when no history'
          }
        }
      },
      forward: {
        title: 'Forward',
        description: 'Go forward in browser history',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether the forward navigation succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when forward navigation fails'
        },
        fields: {
          steps: {
            label: 'Steps'
          },
          waitReady: {
            label: 'Wait for page ready'
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          },
          allowNoHistory: {
            label: 'Ignore when no history'
          }
        }
      },
      closePage: {
        title: 'Close Page',
        description: 'Close the current page session',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether closing the page succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when closing the page fails'
        },
        fields: {
          endFlowAfterClose: {
            label: 'End flow after closing'
          }
        }
      }
    },
    wait: {
      element: {
        title: 'Wait for Element',
        description: 'Wait for a target element to appear',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether waiting for element succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when waiting for element fails'
        },
        fields: {
          selector: {
            label: 'Selector',
            placeholder: 'Enter selector, e.g. .news-item'
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          }
        }
      },
      time: {
        title: 'Wait Time',
        description: 'Wait a fixed number of milliseconds',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether wait time succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when wait time fails'
        },
        fields: {
          durationMs: {
            label: 'Duration (毫秒)'
          }
        }
      },
      random: {
        title: 'Random Wait',
        description: 'Wait randomly within a min/max range',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether random wait succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when random wait fails'
        },
        fields: {
          minMs: {
            label: 'Min (毫秒)'
          },
          maxMs: {
            label: 'Max (毫秒)'
          }
        }
      },
      loadState: {
        title: 'Wait for Load State',
        description: 'Wait until the page reaches a load state',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether waiting for load state succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when waiting for load state fails'
        },
        fields: {
          state: {
            label: 'Load State',
            description: 'Choose the load phase to wait for before continuing',
            options: {
              load: 'load (all resources loaded)',
              domcontentloaded: 'domcontentloaded (DOM is ready)',
              networkidle: 'networkidle (network is idle)'
            }
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          }
        }
      },
      condition: {
        title: 'Wait for Condition',
        description: 'Wait for a custom JS condition to become true',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether waiting for condition succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when waiting for condition fails'
        },
        fields: {
          expression: {
            label: 'Condition Expression',
            description: 'Write a JS expression that returns true/false. Flow continues when it returns true',
            placeholder: "Example: window.location.href.includes('/news')"
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          }
        }
      },
      text: {
        title: 'Wait for Text',
        description: 'Wait for a specific text to appear',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether waiting for text succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when waiting for text fails'
        },
        fields: {
          text: {
            label: 'Target Text',
            placeholder: 'Enter the text to wait for'
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          }
        }
      },
      delay: {
        title: 'Delay',
        description: 'Pure delay wait',
        outputs: {
          success: 'Success',
          fail: 'Fail',
          boolean: 'Result',
          booleanDescription: 'Whether delay wait succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when delay wait fails'
        },
        fields: {
          durationMs: {
            label: 'Delay (毫秒)'
          }
        }
      }
    },
    interaction: {
      common: {
        outputs: {
          boolean: 'Result',
          booleanDescription: 'Whether interaction execution succeeded',
          message: 'Info',
          messageDescription: 'Error or exception details when interaction fails'
        },
        pinDescriptions: {
          elementInput: 'Target element output by an element query node'
        },
        fields: {
          selector: {
            label: 'Selector',
            placeholder: 'e.g. #login-btn or .form input[name="email"]'
          },
          timeoutMs: {
            label: 'Timeout (毫秒)'
          },
          button: {
            label: 'Mouse Button',
            options: {
              left: 'Left',
              middle: 'Middle',
              right: 'Right'
            }
          },
          clickCount: {
            label: 'Click Count'
          },
          hoverDelayMs: {
            label: 'Hover Delay',
            input: {
              prefix: 'Fixed'
            }
          },
          randomHoverDelay: {
            label: 'Random Hover Delay'
          },
          hoverDelayMinMs: {
            label: 'Min Hover Delay (毫秒)',
            input: {
              prefix: 'Min'
            }
          },
          hoverDelayMaxMs: {
            label: 'Max Hover Delay (毫秒)',
            input: {
              prefix: 'Max'
            }
          },
          text: {
            label: 'Text',
            placeholder: 'Enter text to type'
          },
          content: {
            label: 'Content',
            placeholder: 'Enter content to fill'
          },
          typeMode: {
            label: 'Input Mode',
            options: {
              type: 'Type Character by Character',
              fill: 'Fill Directly'
            }
          },
          inputIntervalMs: {
            label: 'Input Interval',
            input: {
              prefix: 'Fixed',
              unit: '毫秒'
            }
          },
          randomInputInterval: {
            label: 'Random Interval'
          },
          inputIntervalMinMs: {
            label: 'Min Interval (毫秒)',
            input: {
              prefix: 'Min',
              unit: '毫秒'
            }
          },
          inputIntervalMaxMs: {
            label: 'Max Interval (毫秒)',
            input: {
              prefix: 'Max',
              unit: '毫秒'
            }
          },
          clearBefore: {
            label: 'Clear Before Input'
          },
          optionMode: {
            label: 'Option Match Mode',
            options: {
              text: 'By Text',
              value: 'By Value',
              index: 'By Index'
            }
          },
          optionValue: {
            label: 'Option Target',
            placeholder: 'Enter target text / value / index'
          },
          skipIfAlreadyState: {
            label: 'Skip If Already In Target State'
          },
          eventName: {
            label: 'Event Name',
            placeholder: 'Select an event to dispatch',
            options: {
              click: 'Click',
              dblclick: 'Double Click',
              mousedown: 'Mouse Down',
              mouseup: 'Mouse Up',
              mouseenter: 'Mouse Enter',
              mouseleave: 'Mouse Leave',
              mousemove: 'Mouse Move',
              input: 'Input',
              change: 'Change',
              focus: 'Focus',
              blur: 'Blur',
              keydown: 'Key Down',
              keyup: 'Key Up',
              keypress: 'Key Press',
              submit: 'Submit'
            }
          },
          bubbles: {
            label: 'Bubbles'
          },
          cancelable: {
            label: 'Cancelable'
          },
          key: {
            label: 'Key',
            addPart: 'Add Key Part',
            removePart: 'Remove',
            preview: 'Current Combo',
            options: {
              enter: 'Enter',
              tab: 'Tab',
              shiftTab: 'Shift + Tab',
              escape: 'Escape',
              space: 'Space',
              backspace: 'Backspace',
              delete: 'Delete',
              insert: 'Insert',
              home: 'Home',
              end: 'End',
              pageUp: 'PageUp',
              pageDown: 'PageDown',
              arrowUp: 'ArrowUp',
              arrowDown: 'ArrowDown',
              arrowLeft: 'ArrowLeft',
              arrowRight: 'ArrowRight',
              f1: 'F1',
              f2: 'F2',
              f3: 'F3',
              f4: 'F4',
              f5: 'F5',
              f6: 'F6',
              f7: 'F7',
              f8: 'F8',
              f9: 'F9',
              f10: 'F10',
              f11: 'F11',
              f12: 'F12',
              ctrlA: 'Ctrl + A (Select All)',
              ctrlC: 'Ctrl + C (Copy)',
              ctrlV: 'Ctrl + V (Paste)',
              ctrlX: 'Ctrl + X (Cut)',
              ctrlZ: 'Ctrl + Z (Undo)',
              ctrlY: 'Ctrl + Y (Redo)',
              ctrlS: 'Ctrl + S (Save)',
              ctrlP: 'Ctrl + P (Print)',
              ctrlF: 'Ctrl + F (Find)',
              ctrlR: 'Ctrl + R (Refresh)',
              ctrlL: 'Ctrl + L (Address Bar)',
              ctrlT: 'Ctrl + T (New Tab)',
              ctrlW: 'Ctrl + W (Close Tab)',
              ctrlShiftT: 'Ctrl + Shift + T (Restore Tab)',
              ctrlShiftN: 'Ctrl + Shift + N (Incognito Window)',
              altTab: 'Alt + Tab (Switch Window)',
              altF4: 'Alt + F4 (Close Window)',
              shiftEnter: 'Shift + Enter',
              metaC: 'Meta + C (Copy on macOS)',
              metaV: 'Meta + V (Paste on macOS)',
              metaS: 'Meta + S (Save on macOS)',
              metaZ: 'Meta + Z (Undo on macOS)'
            }
          },
          repeatCount: {
            label: 'Repeat Count'
          },
          pressDurationMs: {
            label: 'Press Duration (毫秒)'
          },
          simulateNativeInput: {
            label: 'Simulate Native Input'
          }
        }
      },
      clickElement: {
        title: 'Click Element',
        description: 'Click a target element'
      },
      doubleClickElement: {
        title: 'Double Click Element',
        description: 'Double-click a target element'
      },
      hoverElement: {
        title: 'Hover Element',
        description: 'Hover the mouse over an element'
      },
      inputText: {
        title: 'Input Text',
        description: 'Type text character by character'
      },
      fillContent: {
        title: 'Fill Content',
        description: 'Fill a form value directly'
      },
      selectOption: {
        title: 'Select Option',
        description: 'Select an item from a dropdown'
      },
      checkBox: {
        title: 'Check Box',
        description: 'Check a checkbox'
      },
      uncheckBox: {
        title: 'Uncheck Box',
        description: 'Uncheck a checkbox'
      },
      focusElement: {
        title: 'Focus Element',
        description: 'Focus an element'
      },
      dispatchEvent: {
        title: 'Dispatch Event',
        description: 'Dispatch a custom event'
      },
      pressKey: {
        title: 'Press Key',
        description: 'Simulate key presses or key combos'
      }
    },
    mouse: {
      move: {
        title: 'Move Mouse',
        description: 'Move cursor from start to end with human-like parameters',
        fields: {
          startX: {
            label: 'Start X',
            description: 'Start X coordinate'
          },
          startY: {
            label: 'Start Y',
            description: 'Start Y coordinate'
          },
          endX: {
            label: 'End X',
            description: 'Target X coordinate'
          },
          endY: {
            label: 'End Y',
            description: 'Target Y coordinate'
          },
          curveType: {
            label: 'Curve Type',
            options: {
              linear: 'Linear',
              bezier: 'Bezier',
              spline: 'Spline'
            }
          },
          curveStrength: {
            label: 'Curve Strength',
            description: 'How strong the path curvature is'
          },
          randomCurveStrength: {
            label: 'Random Curve Strength'
          },
          curveStrengthMin: {
            label: 'Min Curve Strength'
          },
          curveStrengthMax: {
            label: 'Max Curve Strength'
          },
          speedProfile: {
            label: 'Speed Profile',
            options: {
              linear: 'Linear',
              easeIn: 'Ease In',
              easeOut: 'Ease Out',
              easeInOut: 'Ease In-Out'
            }
          },
          randomDuration: {
            label: 'Random Duration'
          },
          durationMs: {
            label: 'Duration',
            description: 'Fixed move duration'
          },
          durationMinMs: {
            label: 'Min Duration'
          },
          durationMaxMs: {
            label: 'Max Duration'
          },
          enableJitter: {
            label: 'Enable Jitter'
          },
          jitterAmplitude: {
            label: 'Jitter Amplitude',
            description: 'Maximum offset per jitter'
          },
          randomJitterAmplitude: {
            label: 'Random Jitter Amplitude'
          },
          jitterAmplitudeMin: {
            label: 'Min Jitter Amplitude'
          },
          jitterAmplitudeMax: {
            label: 'Max Jitter Amplitude'
          },
          jitterFrequency: {
            label: 'Jitter Frequency'
          },
          randomJitterFrequency: {
            label: 'Random Jitter Frequency'
          },
          jitterFrequencyMin: {
            label: 'Min Jitter Frequency'
          },
          jitterFrequencyMax: {
            label: 'Max Jitter Frequency'
          }
        },
        outputs: {
          endX: {
            label: 'Final X',
            description: 'Final cursor X coordinate'
          },
          endY: {
            label: 'Final Y',
            description: 'Final cursor Y coordinate'
          },
          path: {
            label: 'Path Points',
            description: 'Full cursor path coordinates'
          }
        }
      }
    },
    scroll: {
      toPosition: {
        title: 'Scroll to Position',
        description: 'Scroll to a coordinate or element',
        fields: {
          mode: {
            label: 'Scroll Target',
            options: {
              position: 'Coordinate',
              element: 'Element'
            }
          },
          x: {
            label: 'Target X'
          },
          y: {
            label: 'Target Y'
          },
          behavior: {
            label: 'Scroll Behavior',
            options: {
              auto: 'Auto',
              smooth: 'Smooth'
            }
          },
          randomOffset: {
            label: 'Enable Random Offset'
          },
          offsetMin: {
            label: 'Min Offset'
          },
          offsetMax: {
            label: 'Max Offset'
          },
          timeoutMs: {
            label: 'Timeout (ms)'
          }
        }
      },
      intoView: {
        title: 'Scroll into View',
        description: 'Bring an element into view',
        fields: {
          behavior: {
            label: 'Scroll Behavior',
            options: {
              auto: 'Auto',
              smooth: 'Smooth'
            }
          },
          block: {
            label: 'Vertical Align'
          },
          inline: {
            label: 'Horizontal Align'
          },
          alignOptions: {
            start: 'Start',
            center: 'Center',
            end: 'End',
            nearest: 'Nearest'
          },
          ensureVisible: {
            label: 'Ensure Final Visibility'
          },
          timeoutMs: {
            label: 'Timeout (ms)'
          }
        }
      },
      infinite: {
        title: 'Infinite Scroll',
        description: 'Keep scrolling to load more content',
        fields: {
          maxIterations: {
            label: 'Max Iterations'
          },
          stepPx: {
            label: 'Step Pixels'
          },
          intervalMs: {
            label: 'Interval (ms)'
          },
          behavior: {
            label: 'Scroll Behavior',
            options: {
              auto: 'Auto',
              smooth: 'Smooth'
            }
          },
          stopWhenNoChange: {
            label: 'Stop When Content Unchanged'
          },
          maxNoChangeCount: {
            label: 'Max No-change Count'
          }
        },
        outputs: {
          iterationCount: {
            label: 'Iteration Count',
            description: 'Actual number of scroll iterations'
          }
        }
      }
    },
    extract: {
      getText: {
        title: 'Get Text',
        description: 'Read element text content',
        fields: {
          textMode: {
            label: 'Text Source',
            options: {
              innerText: 'innerText (visible text)',
              textContent: 'textContent (raw text)'
            }
          },
          trim: {
            label: 'Trim Leading/Trailing Spaces'
          },
          normalizeWhitespace: {
            label: 'Normalize Repeated Whitespace'
          }
        },
        outputs: {
          text: {
            label: 'Text Result',
            description: 'Extracted text content'
          },
          lengthDescription: 'Length of extracted text',
          existsDescription: 'Whether text exists and is non-empty'
        }
      },
      getAttribute: {
        title: 'Get Attribute',
        description: 'Read a specific attribute from an element',
        fields: {
          attributeName: {
            label: 'Attribute Name',
            placeholder: 'e.g. href / src / data-id'
          },
          commonAttribute: {
            label: 'Common Attributes',
            options: {
              custom: 'Custom Input'
            }
          },
          defaultValue: {
            label: 'Default Value',
            placeholder: 'Returned when attribute is missing (optional)'
          }
        },
        outputs: {
          value: {
            label: 'Attribute Value',
            description: 'Extracted attribute value'
          },
          existsDescription: 'Whether attribute exists'
        }
      },
      getHtml: {
        title: 'Get HTML',
        description: 'Read innerHTML or outerHTML',
        fields: {
          htmlType: {
            label: 'HTML Type',
            options: {
              outerHTML: 'outerHTML (with element tag)',
              innerHTML: 'innerHTML (children only)'
            }
          },
          normalizeWhitespace: {
            label: 'Normalize Repeated Whitespace'
          }
        },
        outputs: {
          html: {
            label: 'HTML Result',
            description: 'Extracted HTML string'
          },
          lengthDescription: 'Length of HTML string'
        }
      },
      getValue: {
        title: 'Get Value',
        description: 'Read a form field value',
        fields: {
          valueType: {
            label: 'Value Type',
            options: {
              value: 'value (input value)',
              checked: 'checked (checkbox state)',
              text: 'text (text content)'
            }
          },
          trim: {
            label: 'Trim Leading/Trailing Spaces'
          },
          parseNumber: {
            label: 'Try Parse as Number'
          }
        },
        outputs: {
          value: {
            label: 'Raw Result',
            description: 'Raw extracted result based on selected type'
          },
          stringValue: {
            label: 'String Result',
            description: 'Result as string'
          },
          numberValue: {
            label: 'Number Result',
            description: 'Result parsed as number'
          }
        }
      },
      queryElement: {
        title: 'Element Selector (Single)',
        description: 'Locate and output a single element by selector',
        pinDescriptions: {
          element: 'Queried single element object',
          exists: 'Whether an element was found'
        }
      },
      queryAllElements: {
        title: 'Element Selector (Multiple)',
        description: 'Locate and output an element list by selector',
        pinDescriptions: {
          elements: 'Matched element array',
          length: 'Matched element count'
        }
      },
      queryBlocked: {
        title: 'Blocked Page Check',
        description: 'Detect whether the current page is a Cloudflare-style blocked or verification page and output a boolean',
        fields: {
          mode: {
            label: 'Block mode',
            options: {
              auto: 'Auto detect',
              cloudflare: 'Cloudflare blocked'
            }
          }
        },
        pinDescriptions: {
          blocked: 'Whether a blocked page was detected'
        }
      },
      executeScript: {
        title: 'Execute Script',
        description: 'Run custom JS and return the result',
        pinDescriptions: {
          script: 'Script text input (overrides editor content)',
          result: 'Script execution result',
          resultArray: 'When result is an array, can connect to loop/length nodes',
          resultLength: 'Length when result is an array or string'
        },
        fields: {
          script: {
            label: 'JavaScript Script',
            placeholder: 'Example: return document.title;'
          }
        }
      }
    },
    http: {
      request: {
        title: 'HTTP Request',
        description: 'Send raw GET / POST / etc. requests',
        fields: {
          method: {
            label: 'Method'
          },
          url: {
            label: 'Request URL',
            placeholder: 'e.g. https://api.example.com/v1/items'
          },
          query: {
            label: 'Query Params',
            placeholder: 'e.g. page=1&size=20',
            form: {
              keyPlaceholder: 'Param Name',
              valuePlaceholder: 'Param Value',
              add: 'Add Param',
              remove: 'Remove'
            }
          },
          headers: {
            label: 'Headers',
            placeholder: 'e.g. Authorization: Bearer xxx',
            form: {
              keyPlaceholder: 'Header Name',
              valuePlaceholder: 'Header Value',
              add: 'Add Header',
              remove: 'Remove'
            },
            presets: {
              authorizationBearer: 'Preset: Authorization Bearer',
              contentTypeJson: 'Preset: Content-Type JSON',
              contentTypeFormUrlencoded: 'Preset: Content-Type Form',
              acceptJson: 'Preset: Accept JSON',
              acceptLanguageZhCn: 'Preset: Accept-Language Chinese',
              cacheControlNoCache: 'Preset: Cache-Control No-Cache',
              xRequestedWith: 'Preset: X-Requested-With Ajax',
              userAgentBrowser: 'Preset: User-Agent Browser'
            }
          },
          referer: {
            label: 'Referer',
            placeholder: 'e.g. https://www.example.com/list'
          },
          cookie: {
            label: 'Cookie String',
            placeholder: 'e.g. session_id=abc123; theme=dark'
          },
          bodyType: {
            label: 'Body Type',
            options: {
              none: 'None',
              json: 'JSON',
              form: 'Form',
              text: 'Text'
            }
          },
          body: {
            label: 'Body',
            placeholder: 'Fill body content by selected body type',
            jsonInvalid: 'Invalid JSON format. Please check and try again.',
            actions: {
              validate: 'Validate JSON',
              format: 'Format JSON'
            },
            form: {
              keyPlaceholder: 'Field Name',
              valuePlaceholder: 'Field Value',
              add: 'Add Field',
              remove: 'Remove'
            }
          },
          timeoutMs: {
            label: 'Timeout (ms)'
          },
          retryCount: {
            label: 'Retry Count'
          },
          followRedirect: {
            label: 'Follow Redirects'
          }
        },
        outputs: {
          response: {
            label: 'Response',
            description: 'Response body payload'
          },
          statusCode: {
            label: 'Status Code',
            description: 'HTTP status code'
          },
          ok: {
            label: 'OK',
            description: 'Whether status is 2xx'
          },
          headers: {
            label: 'Response Headers',
            description: 'Response headers object'
          }
        }
      },
      getCookies: {
        title: 'Get Cookies',
        description: 'Read current cookies',
        fields: {
          scope: {
            label: 'Scope',
            options: {
              current: 'Current page',
              domain: 'Specific domain',
              all: 'All'
            }
          },
          domain: {
            label: 'Domain',
            placeholder: 'e.g. example.com'
          },
          path: {
            label: 'Path',
            placeholder: 'e.g. /account'
          },
          includeHttpOnly: {
            label: 'Include HttpOnly'
          },
          includeSessionOnly: {
            label: 'Include Session Cookies'
          },
          asString: {
            label: 'Output as string'
          },
          timeoutMs: {
            label: 'Timeout (ms)'
          }
        },
        inputs: {
          contextDescription: 'Upstream context may include page, domain, or current session info'
        },
        outputs: {
          cookies: {
            label: 'Cookies List',
            description: 'List of cookie objects'
          },
          cookieString: {
            label: 'Cookie String',
            description: 'Cookie string joined by semicolons'
          },
          count: {
            label: 'Count',
            description: 'Number of cookies'
          }
        }
      },
      setCookies: {
        title: 'Set Cookies',
        description: 'Set or update cookies',
        inputs: {
          cookieDescription: 'When an upstream node outputs a single cookie string, it can directly replace the editor content'
        },
        fields: {
          mode: {
            label: 'Edit Mode',
            options: {
              single: 'Single string',
              pairs: 'Multiple cookies'
            }
          },
          cookie: {
            label: 'Cookie String',
            placeholder: 'e.g. session_id=abc123; theme=dark'
          },
          pairs: {
            label: 'Cookie List',
            nameLabel: 'Cookie Name',
            namePlaceholder: 'Cookie Name',
            valueLabel: 'Cookie Value',
            valuePlaceholder: 'Cookie Value',
            domainLabel: 'Domain',
            domainPlaceholder: 'e.g. example.com',
            pathLabel: 'Path',
            pathPlaceholder: 'e.g. /',
            add: 'Add Cookie',
            remove: 'Remove',
            preset: {
              httpOnly: 'HttpOnly',
              secure: 'Secure',
              domain: 'Domain',
              path: 'Path',
              maxAge: 'Max-Age'
            }
          },
          scope: {
            label: 'Scope',
            options: {
              current: 'Current page',
              domain: 'Specific domain',
              all: 'All'
            }
          },
          domain: {
            label: 'Domain',
            placeholder: 'e.g. example.com'
          },
          path: {
            label: 'Path',
            placeholder: 'e.g. /'
          },
          sameSite: {
            label: 'SameSite',
            options: {
              lax: 'Lax',
              strict: 'Strict',
              none: 'None'
            }
          },
          expiresAt: {
            label: 'Expires At',
            placeholder: 'Choose date and time'
          },
          flags: {
            label: 'Additional Flags'
          },
          httpOnly: {
            label: 'HttpOnly'
          },
          secure: {
            label: 'Secure'
          },
          persistent: {
            label: 'Persistent'
          }
        }
      }
    },
    system: {
      screenSize: {
        title: 'Get Screen Size',
        description: 'Read the system screen width and height',
        outputs: {
          width: {
            label: 'Screen Width',
            description: 'System screen width in pixels'
          },
          height: {
            label: 'Screen Height',
            description: 'System screen height in pixels'
          },
          size: {
            label: 'Screen Size Object',
            description: 'Object containing screen width and height'
          }
        }
      },
      windowSize: {
        title: 'Get Window Size',
        description: 'Read the WebView window size',
        outputs: {
          width: {
            label: 'Window Width',
            description: 'WebView window width in pixels'
          },
          height: {
            label: 'Window Height',
            description: 'WebView window height in pixels'
          },
          size: {
            label: 'Window Size Object',
            description: 'Object containing window width and height'
          }
        }
      },
      mousePosition: {
        title: 'Get Mouse Position',
        description: 'Read mouse coordinates in both WebView and screen spaces',
        fields: {
          outputScope: {
            label: 'Output Coordinate Scope',
            options: {
              both: 'Output WebView + Screen',
              webview: 'WebView coordinates only',
              screen: 'Screen coordinates only'
            }
          }
        },
        outputs: {
          webviewX: {
            label: 'WebView X',
            description: 'Mouse X relative to WebView top-left'
          },
          webviewY: {
            label: 'WebView Y',
            description: 'Mouse Y relative to WebView top-left'
          },
          screenX: {
            label: 'Screen X',
            description: 'Mouse X relative to screen top-left'
          },
          screenY: {
            label: 'Screen Y',
            description: 'Mouse Y relative to screen top-left'
          },
          webviewPoint: {
            label: 'WebView Point',
            description: 'Object containing WebView-relative coordinates'
          },
          screenPoint: {
            label: 'Screen Point',
            description: 'Object containing screen absolute coordinates'
          }
        }
      },
      elementPosition: {
        title: 'Get Element Position',
        description: 'Read element coordinates in both WebView and screen spaces',
        fields: {
          anchorPoint: {
            label: 'Anchor Point',
            options: {
              topLeft: 'Top-left',
              center: 'Center'
            }
          },
          outputScope: {
            label: 'Output Coordinate Scope',
            options: {
              both: 'Output WebView + Screen',
              webview: 'WebView coordinates only',
              screen: 'Screen coordinates only'
            }
          }
        },
        outputs: {
          exists: {
            label: 'Element Exists',
            description: 'Whether the target element is found'
          },
          webviewX: {
            label: 'WebView X',
            description: 'Element X in WebView coordinates'
          },
          webviewY: {
            label: 'WebView Y',
            description: 'Element Y in WebView coordinates'
          },
          screenX: {
            label: 'Screen X',
            description: 'Element X in screen coordinates'
          },
          screenY: {
            label: 'Screen Y',
            description: 'Element Y in screen coordinates'
          },
          rectWebview: {
            label: 'WebView Rect',
            description: 'Element rectangle object in WebView coordinates'
          },
          rectScreen: {
            label: 'Screen Rect',
            description: 'Element rectangle object in screen coordinates'
          }
        }
      },
      readClipboard: {
        title: 'Read Clipboard',
        description: 'Read system clipboard content',
        outputs: {
          text: {
            label: 'Clipboard Text',
            description: 'Text content read from clipboard'
          },
          length: {
            label: 'Text Length',
            description: 'Length of clipboard text'
          },
          hasText: {
            label: 'Has Text',
            description: 'Whether clipboard contains text content'
          }
        }
      },
      writeClipboard: {
        title: 'Write Clipboard',
        description: 'Write content to the system clipboard',
        inputs: {
          text: {
            label: 'Input Text',
            description: 'Upstream text input will be written to clipboard directly'
          }
        },
        fields: {
          text: {
            label: 'Text to Write',
            placeholder: 'Enter text to write to clipboard'
          }
        },
        outputs: {
          text: {
            label: 'Written Text',
            description: 'Text content written to clipboard in this step'
          }
        }
      }
    },
    variable: {
      common: {
        dataTypes: {
          string: 'String',
          number: 'Number',
          boolean: 'Boolean',
          array: 'Array',
          object: 'Object'
        }
      },
      set: {
        title: 'Set Variable',
        description: 'Define shared variables for the current canvas and expose their values',
        empty: {
          title: 'No variables defined yet',
          description: 'After you add a variable, it will get its own input pin and output pin.',
          action: 'Add the first variable'
        },
        inputs: {
          value: {
            label: 'Input Value',
            description: 'Upstream input overrides the default value for this variable'
          }
        },
        outputs: {
          value: {
            label: 'Variable Value',
            description: 'Outputs the latest value of this variable'
          }
        },
        fields: {
          name: {
            label: 'Variable Name',
            placeholder: 'Example: username'
          },
          type: {
            label: 'Data Type'
          },
          defaultValue: {
            label: 'Default Value',
            stringPlaceholder: 'Enter default text',
            jsonPlaceholder: 'Enter valid JSON as the default value'
          },
          connectedHint: {
            label: 'An upstream input is connected. Runtime execution will use the input value first.',
            description: 'This variable will prefer the connected input pin during execution instead of the default value.'
          }
        },
        actions: {
          add: 'Add Variable'
        },
        dialogs: {
          changeType: {
            title: 'Confirm Variable Type Change',
            description: 'Variable "{name}" currently has {count} linked edge(s). Changing its type will disconnect those edges. Continue?',
            confirm: 'Change Type',
            cancel: 'Cancel'
          }
        },
        validations: {
          nameRequired: 'Variable name cannot be empty',
          nameDuplicate: 'This variable name is already defined on the current canvas',
          arrayInvalid: 'Default value must be valid array JSON',
          objectInvalid: 'Default value must be valid object JSON'
        }
      },
      get: {
        title: 'Get Variable',
        description: 'Select defined variables on the current canvas and output their values',
        empty: {
          title: 'No readable variables on this canvas yet',
          description: 'Add a Set Variable node first and define at least one variable.'
        },
        fields: {
          variables: {
            label: 'Select Variables',
            placeholder: 'Select defined variables',
            description: 'Multiple selection is supported, and each variable creates its own typed output pin.'
          }
        },
        inputs: {
          value: {
            description: 'Input overrides the current value of the selected variable ({type})'
          }
        },
        outputs: {
          value: {
            description: 'Outputs the current value of the selected variable ({type})'
          }
        }
      }
    },
    constant: {
      get: {
        title: 'Constant',
        description: 'Output built-in constant values',
        pinDescriptions: {
          constantKey: 'Constant key input'
        },
        outputs: {
          value: {
            description: 'Resolved value for the selected constant'
          },
          constantKey: {
            label: 'Constant Key',
            description: 'Matched constant key name'
          }
        },
        fields: {
          constantKey: {
            label: 'Constant Key',
            options: {
              attachmentDir: 'Attachment Directory (attachmentDir)'
            }
          }
        }
      }
    },
    logic: {
      equal: {
        title: 'Equal',
        description: 'Check whether two values are equal',
        pinDescriptions: {
          operand: 'Compare value {label}',
          result: 'Comparison result'
        }
      },
      notEqual: {
        title: 'Not Equal',
        description: 'Check whether two values are not equal',
        pinDescriptions: {
          operand: 'Compare value {label}',
          result: 'Comparison result'
        }
      },
      greaterThan: {
        title: 'Greater Than',
        description: 'Check whether a > b',
        pinDescriptions: {
          valueA: 'Numeric value A',
          valueB: 'Numeric value B',
          result: 'Comparison result'
        }
      },
      lessThan: {
        title: 'Less Than',
        description: 'Check whether a < b',
        pinDescriptions: {
          valueA: 'Numeric value A',
          valueB: 'Numeric value B',
          result: 'Comparison result'
        }
      },
      greaterThanOrEqual: {
        title: 'Greater Than or Equal',
        description: 'Check whether a ≥ b',
        pinDescriptions: {
          valueA: 'Numeric value A',
          valueB: 'Numeric value B',
          result: 'Comparison result'
        }
      },
      lessThanOrEqual: {
        title: 'Less Than or Equal',
        description: 'Check whether a ≤ b',
        pinDescriptions: {
          valueA: 'Numeric value A',
          valueB: 'Numeric value B',
          result: 'Comparison result'
        }
      },
      and: {
        title: 'AND',
        description: 'Logical AND between two boolean values',
        pinDescriptions: {
          valueA: 'Boolean value A',
          valueB: 'Boolean value B',
          result: 'Logical operation result'
        }
      },
      or: {
        title: 'OR',
        description: 'Logical OR between two boolean values',
        pinDescriptions: {
          valueA: 'Boolean value A',
          valueB: 'Boolean value B',
          result: 'Logical operation result'
        }
      },
      not: {
        title: 'NOT',
        description: 'Logical NOT, or inversion',
        pinDescriptions: {
          value: 'Boolean input value',
          result: 'Logical operation result'
        }
      },
      isEmpty: {
        title: 'Is Empty',
        description: 'Check whether a value is empty (null/undefined/empty string/empty array)',
        pinDescriptions: {
          value: 'Value to check',
          result: 'Check result'
        }
      },
      exists: {
        title: 'Exists',
        description: 'Check whether a value exists (not null/undefined)',
        pinDescriptions: {
          value: 'Value to check',
          result: 'Check result'
        }
      }
    },
    math: {
      add: {
        title: 'Add',
        description: 'Add two numbers'
      },
      subtract: {
        title: 'Subtract',
        description: 'Subtract two numbers'
      },
      multiply: {
        title: 'Multiply',
        description: 'Multiply two numbers'
      },
      divide: {
        title: 'Divide',
        description: 'Divide two numbers'
      },
      round: {
        title: 'Round',
        description: 'Round down, up, or to nearest',
        fields: {
          mode: {
            label: 'Rounding Mode',
            options: {
              round: 'Round to Nearest',
              ceil: 'Round Up',
              floor: 'Round Down'
            }
          }
        }
      },
      random: {
        title: 'Random Number',
        description: 'Generate a random number in a range',
        fields: {
          numberType: {
            label: 'Random Type',
            options: {
              float: 'Float',
              integer: 'Integer'
            }
          },
          intervalType: {
            label: 'Interval Type',
            options: {
              leftClosedRightOpen: '[min, max)',
              leftOpenRightClosed: '(min, max]',
              open: '(min, max)',
              closed: '[min, max]'
            },
            descriptions: {
              leftClosedRightOpen: 'Include min, exclude max',
              leftOpenRightClosed: 'Exclude min, include max',
              open: 'Exclude both min and max',
              closed: 'Include both min and max'
            }
          },
          min: {
            label: 'Minimum (min)'
          },
          max: {
            label: 'Maximum (max)'
          }
        }
      },
      absolute: {
        title: 'Absolute Value',
        description: 'Get the absolute value'
      },
      modulo: {
        title: 'Modulo',
        description: 'Compute the remainder of a % b'
      },
      power: {
        title: 'Power',
        description: 'Compute a to the power of b'
      }
    },
    string: {
      common: {
        connectedInputHint: 'Input connected, using linked value'
      },
      substring: {
        title: 'Substring',
        description: 'Extract substring from specified position',
        pinDescriptions: {
          text: 'Source text to extract from',
          start: 'Start index (0-based)',
          length: 'Extraction length',
          result: 'Substring result'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter source text'
          },
          start: {
            label: 'Start Position'
          },
          length: {
            label: 'Extract Length'
          }
        }
      },
      replace: {
        title: 'Replace',
        description: 'Find and replace text content (replace all)',
        pinDescriptions: {
          text: 'Source text',
          search: 'Search string (replace all)',
          replacement: 'Replacement text',
          result: 'Replacement result'
        },
        fields: {
          text: {
            label: 'Source Text',
            placeholder: 'Enter source text'
          },
          search: {
            label: 'Find',
            placeholder: 'Enter text to find'
          },
          replacement: {
            label: 'Replace With',
            placeholder: 'Enter replacement content'
          }
        }
      },
      concat: {
        title: 'Concatenate',
        description: 'Concatenate multiple text segments',
        pinDescriptions: {
          segment: 'Text segment {label}',
          result: 'Concatenation result'
        },
        fields: {
          segment: {
            label: 'Text {label}',
            placeholder: 'Text segment {label}',
            count: '{count} segments'
          }
        }
      },
      regexMatch: {
        title: 'Regex Match',
        description: 'Extract matches using regex pattern',
        pinDescriptions: {
          text: 'Text to match',
          pattern: 'Regex pattern',
          flags: 'Flags (g/i/m, etc.)',
          result: 'Match results array'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter text to match'
          },
          pattern: {
            label: 'Regex Pattern',
            placeholder: 'Enter regex (e.g. \\d+)'
          },
          flags: {
            label: 'Flags',
            placeholder: 'Enter flags (e.g. g, i, m)'
          }
        }
      },
      regexReplace: {
        title: 'Regex Replace',
        description: 'Find and replace using regex pattern',
        pinDescriptions: {
          text: 'Source text',
          pattern: 'Regex pattern',
          replacement: 'Replacement text (capture groups supported)',
          flags: 'Flags (g/i/m, etc.)',
          result: 'Replacement result'
        },
        fields: {
          text: {
            label: 'Source Text',
            placeholder: 'Enter source text'
          },
          pattern: {
            label: 'Regex Pattern',
            placeholder: 'Enter regex pattern'
          },
          replacement: {
            label: 'Replace With',
            placeholder: 'Enter replacement (use $1, $2 for capture groups)'
          },
          flags: {
            label: 'Flags',
            placeholder: 'Enter flags (e.g. g, i, m)'
          }
        }
      },
      split: {
        title: 'Split',
        description: 'Split text by separator into array',
        pinDescriptions: {
          text: 'Text to split',
          separator: 'Separator',
          result: 'Split result array'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter text to split'
          },
          separator: {
            label: 'Separator',
            placeholder: 'Enter separator (e.g. , or |)'
          }
        }
      },
      length: {
        title: 'String Length',
        description: 'Get the character count of text',
        pinDescriptions: {
          text: 'Text to calculate length',
          result: 'Character length of text'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter text to calculate length'
          }
        }
      },
      uppercase: {
        title: 'Uppercase',
        description: 'Convert text to uppercase',
        pinDescriptions: {
          text: 'Text to convert to uppercase',
          result: 'Uppercase result'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter text to convert to uppercase'
          }
        }
      },
      lowercase: {
        title: 'Lowercase',
        description: 'Convert text to lowercase',
        pinDescriptions: {
          text: 'Text to convert to lowercase',
          result: 'Lowercase result'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter text to convert to lowercase'
          }
        }
      },
      trim: {
        title: 'Trim Whitespace',
        description: 'Remove whitespace characters from text',
        pinDescriptions: {
          text: 'Text to trim whitespace',
          result: 'Trimmed text result'
        },
        fields: {
          text: {
            label: 'Text',
            placeholder: 'Enter text to trim whitespace'
          },
          direction: {
            label: 'Trim Direction'
          },
          whitespaceTypes: {
            label: 'Whitespace Types'
          }
        },
        options: {
          directionBoth: 'Both Sides',
          directionStart: 'Start (Left)',
          directionEnd: 'End (Right)',
          directionAll: 'All',
          whitespaceSpace: 'Space',
          whitespaceTab: 'Tab',
          whitespaceNewline: 'Newline',
          whitespaceCarriageReturn: 'Carriage Return',
          whitespaceVerticalTab: 'Vertical Tab',
          whitespaceFormFeed: 'Form Feed'
        }
      }
    },
    dateTime: {
      now: {
        title: 'Current Time',
        description: 'Generate current time in multiple formats',
        pinDescriptions: {
          outputMode: 'Output mode input'
        },
        outputs: {
          iso: {
            label: 'UTC ISO',
            description: 'UTC ISO 8601 string'
          },
          timestamp: {
            label: 'Timestamp',
            description: 'Unix timestamp in milliseconds'
          },
          mode: {
            label: 'Output Mode',
            description: 'Currently selected output mode'
          }
        },
        fields: {
          outputMode: {
            label: 'Output Mode',
            options: {
              isoUtc: 'UTC ISO string',
              timestampMs: 'Millisecond timestamp'
            }
          }
        }
      },
      format: {
        title: 'Date Time Format',
        description: 'Format a time value with a custom pattern',
        pinDescriptions: {
          value: 'Time value to format',
          sourceMode: 'Source mode input',
          formatPattern: 'Format pattern input'
        },
        outputs: {
          formatted: {
            label: 'Formatted result',
            description: 'Time string formatted by the pattern'
          },
          sourceMode: {
            label: 'Source mode',
            description: 'The currently active source mode'
          }
        },
        fields: {
          sourceMode: {
            label: 'Source',
            options: {
              current: 'Current time',
              input: 'Input value'
            }
          },
          formatPattern: {
            label: 'Format pattern',
            placeholder: 'e.g. YYYY-MM-DD HH:mm:ss'
          }
        }
      }
    },
    arrayObject: {
      filter: {
        title: 'Filter Data',
        description: 'Filter an array',
        pinLabels: {
          removed: 'Removed'
        },
        pinDescriptions: {
          array: 'Input array to filter',
          path: 'Optional: object field path used during filtering',
          result: 'Filtered array result',
          removed: 'Number of items removed'
        },
        fields: {
          mode: {
            label: 'Filter Mode'
          },
          path: {
            label: 'Filter Path',
            placeholder: 'Optional: object field path, e.g. data.value'
          }
        },
        options: {
          modeTruthy: 'Keep truthy items',
          modeNonEmpty: 'Remove empty items',
          modeDistinct: 'Distinct (stable order)'
        }
      },
      merge: {
        title: 'Merge Data',
        description: 'Merge multiple data sources',
        pinDescriptions: {
          source: 'Input source {label}',
          result: 'Merged result (array or object)'
        },
        fields: {
          mode: {
            label: 'Merge Mode'
          },
          source: {
            label: 'Source {label}',
            placeholder: 'Optional: JSON source input (array or object)',
            count: '{count} sources'
          }
        },
        options: {
          modeSmart: 'Smart merge (auto detect)',
          modeArrayConcat: 'Array concat',
          modeObjectAssign: 'Object assign (later wins)'
        }
      },
      split: {
        title: 'Split Data',
        description: 'Split data into multiple branches',
        pinLabels: {
          size: 'Chunk',
          chunks: 'Chunks',
          first: 'First',
          rest: 'Rest'
        },
        pinDescriptions: {
          array: 'Input array to split',
          size: 'Chunk size input (overrides panel setting)',
          chunks: 'Array of chunks after split',
          first: 'First item of the array',
          rest: 'Remaining array without the first item'
        },
        fields: {
          size: {
            label: 'Chunk Size'
          }
        }
      },
      length: {
        title: 'Array Length',
        description: 'Read the array length',
        pinDescriptions: {
          array: 'Input array and output its length',
          length: 'Array length'
        }
      },
      item: {
        title: 'Array Index',
        description: 'Read a value at a given array index',
        pinDescriptions: {
          array: 'Input array',
          index: 'Input index (overrides panel default index)',
          item: 'Item value at the index',
          exists: 'Whether this index exists'
        },
        fields: {
          index: {
            label: 'Index',
            placeholder: 'Enter the array index to read'
          }
        }
      }
    },
    typeConvert: {
      string: {
        title: 'To String',
        description: 'Convert to string type',
        hint: 'Convert data of any type to its string representation',
        inputs: {
          input: {
            description: 'Data to be converted (any type)'
          }
        },
        outputs: {
          result: {
            description: 'Converted string'
          }
        },
        fields: {
          treatNullAsEmpty: {
            label: 'Treat null as empty string'
          }
        }
      },
      number: {
        title: 'To Number',
        description: 'Convert to number type',
        hint: 'Convert data of any type to a number, returns default value on conversion failure',
        inputs: {
          input: {
            description: 'Data to be converted (any type)'
          }
        },
        outputs: {
          result: {
            description: 'Converted number'
          }
        },
        fields: {
          defaultValue: {
            label: 'Default value (on conversion failure)'
          }
        }
      },
      boolean: {
        title: 'To Boolean',
        description: 'Convert to boolean type',
        hint: 'Convert data of any type to boolean based on custom rules',
        inputs: {
          input: {
            description: 'Data to be converted (any type)'
          }
        },
        outputs: {
          result: {
            description: 'Converted boolean'
          }
        },
        fields: {
          truthyValues: {
            label: 'Truthy values (comma-separated)',
            placeholder: 'true,1,"yes","on"'
          }
        }
      },
      json: {
        title: 'To JSON',
        description: 'Convert to a JSON string',
        hint: 'Serialize data of any type to a JSON string',
        inputs: {
          input: {
            description: 'Data to be converted (any type)'
          }
        },
        outputs: {
          result: {
            description: 'Serialized JSON string'
          },
          message: {
            description: 'Error message when conversion fails'
          }
        },
        fields: {
          indent: {
            label: 'Indent width (0 for no indent)'
          },
          handleCircular: {
            label: 'Handle circular references'
          }
        }
      },
      parseJson: {
        title: 'Parse JSON',
        description: 'Parse a JSON string',
        hint: 'Deserialize a JSON string to a data object, returns fallback value on failure',
        inputs: {
          input: {
            description: 'JSON string to be parsed'
          }
        },
        outputs: {
          result: {
            description: 'Parsed data object'
          },
          message: {
            description: 'Error message when parsing fails'
          }
        },
        fields: {
          fallbackValue: {
            label: 'Fallback value (on parse failure)',
            placeholder: 'null'
          }
        }
      }
    },
    controlFlow: {
      loop: {
        title: 'Loop',
        description: 'ForEach / While loop',
        pinDescriptions: {
          array: 'Array input for ForEach mode',
          condition: 'Continue condition input for While mode',
          mode: 'Loop mode input (forEach / while)',
          limitIterations: 'Whether to limit max iterations',
          maxIterations: 'Max iterations input',
          breakOnError: 'Whether to break on error'
        },
        outputs: {
          item: {
            description: 'Current loop item'
          },
          index: {
            label: 'Index',
            description: 'Current loop index'
          }
        },
        fields: {
          mode: {
            label: 'Loop mode',
            options: {
              forEach: 'ForEach (iterate array items)',
              while: 'While (iterate by condition)'
            }
          },
          maxIterations: {
            label: 'Max iterations'
          },
          limitIterations: {
            label: 'Limit max iterations',
            switchLabel: 'Enable limit',
            unlimited: 'Unlimited'
          },
          breakOnError: {
            label: 'Break on error'
          }
        }
      },
      condition: {
        title: 'Condition',
        description: 'Branch on a boolean input into True / False',
        pinDescriptions: {
          condition: 'Boolean condition input'
        },
        outputs: {
          true: {
            label: 'True branch',
            description: 'Output when condition is true'
          },
          false: {
            label: 'False branch',
            description: 'Output when condition is false'
          }
        },
        fields: {
          invert: {
            label: 'Invert',
            hint: 'Invert the condition result (when enabled, true becomes false)'
          }
        }
      },
      switch: {
        title: 'Multi-Branch',
        description: 'Switch multi-branch control',
        pinDescriptions: {
          value: 'Input value to match',
          matchMode: 'Match mode input (strict / loose)',
          cases: 'Case list input (line-separated)',
          useDefaultBranch: 'Whether default branch is enabled'
        },
        outputs: {
          case: {
            description: 'Output when branch {label} is matched'
          },
          default: {
            label: 'Default branch',
            description: 'Output when no branch is matched'
          }
        },
        fields: {
          matchMode: {
            label: 'Match mode',
            options: {
              strict: 'Strict match (===)',
              loose: 'Loose match (==)'
            }
          },
          cases: {
            label: 'Branches (one per line)',
            placeholder: 'case_1\ncase_2'
          },
          useDefaultBranch: {
            label: 'Enable default branch'
          }
        }
      }
    },
    output: {
      saveData: {
        title: 'Save Data',
        description: 'Save data into a selected resource type',
        pinDescriptions: {
          value: 'Data value to save',
          saveType: 'Save type input'
        },
        outputs: {
          savedType: {
            label: 'Saved Type',
            description: 'Actual type used for this save action'
          }
        },
        fields: {
          saveType: {
            label: 'Save Type',
            options: {
              music: 'Music',
              image: 'Image'
            }
          }
        }
      },
      printLog: {
        title: 'Print Log',
        description: 'Output debug information',
        pinDescriptions: {
          value: 'Log value to output',
          level: 'Log level input',
          template: 'Log template input'
        },
        fields: {
          level: {
            label: 'Log level',
            options: {
              debug: 'Debug',
              info: 'Info',
              warn: 'Warn',
              error: 'Error'
            }
          },
          template: {
            label: 'Log template',
            placeholder: 'e.g. [crawler] current value: ${value}'
          }
        }
      },
      playSound: {
        title: 'Play Sound',
        description: 'Play a fixed status prompt tone',
        pinDescriptions: {
          kind: 'Prompt tone type input'
        },
        outputs: {
          kind: {
            label: 'Prompt tone type',
            description: 'Prompt tone type actually played'
          }
        },
        fields: {
          kind: {
            label: 'Prompt tone type',
            options: {
              info: 'Info',
              success: 'Success',
              warning: 'Warning',
              error: 'Error'
            }
          }
        }
      },
      sendEmail: {
        title: 'Send Email',
        description: 'Reuse the existing desktop email endpoint to send mail',
        pinDescriptions: {
          to: 'Recipient input',
          subject: 'Email subject input',
          text: 'Email body input'
        },
        outputs: {
          count: {
            label: 'Recipient count',
            description: 'Actual number of recipients reached'
          }
        },
        fields: {
          to: {
            label: 'Recipients',
            placeholder: 'Enter email addresses, multiple values supported via new lines or commas'
          },
          subject: {
            label: 'Subject',
            placeholder: 'Enter email subject'
          },
          text: {
            label: 'Content',
            placeholder: 'Enter email body'
          }
        }
      },
      screenshot: {
        title: 'Screenshot',
        description: 'Capture a page or element',
        pinDescriptions: {
          element: 'Target element (element mode)',
          targetMode: 'Capture target mode input',
          path: 'Screenshot save path input',
          fullPage: 'Full-page switch input'
        },
        outputs: {
          path: {
            label: 'Screenshot path',
            description: 'Screenshot file path or URL'
          }
        },
        fields: {
          targetMode: {
            label: 'Capture target',
            options: {
              page: 'Page screenshot',
              element: 'Element screenshot'
            }
          },
          path: {
            label: 'Save path',
            placeholder: 'e.g. /screenshots/news-item.png'
          },
          fullPage: {
            label: 'Full-page screenshot'
          }
        }
      }
    }
  }
};
