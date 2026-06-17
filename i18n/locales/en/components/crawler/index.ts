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
      mouse: {
        title: 'Human-like Mouse Move',
        description: 'Simulate realistic mouse movement with curve, speed, and jitter'
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
      detect: {
        title: 'Detection and Protection',
        description: 'Detect verification and common protection pages'
      },
      system: {
        title: 'System and Window',
        description: 'Read screen, window, and clipboard data'
      },
      variable: {
        title: 'Data Processing - Variables',
        description: 'Store and read shared variables between nodes'
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
          description: 'Entry node that triggers crawler execution'
        },
        end: {
          title: 'End',
          description: 'Terminal node that ends crawler execution'
        },
        units: {
          millisecond: '毫秒',
          count: 'Times',
          pixel: 'px',
          percent: '%'
        },
        pinLabels: {
          element: 'Element',
          elements: 'Elements',
          exists: 'Exists',
          context: 'Context',
          result: 'Result',
          array: 'Array',
          length: 'Length',
          index: 'Index',
          item: 'Item'
        },
        selectorInput: {
          mode: {
            options: {
              xpath: 'XPath',
              css: 'CSS'
            }
          },
          invalidHint: 'Selector does not match the selected type. Please verify XPath/CSS syntax.'
        }
      },
      navigation: {
        goto: {
          title: 'Go to Page',
          description: 'Open the specified URL',
          outputs: {
            success: 'Success',
            fail: 'Fail',
            boolean: 'Result',
            booleanDescription: 'Whether the navigation succeeded',
            message: 'Info',
            messageDescription: 'Error or exception details when navigation fails'
          },
          fields: {
            path: {
              label: 'Target Path',
              placeholder: 'Enter target path, e.g. /news/123'
            },
            waitReady: {
              label: 'Wait for page ready'
            },
            timeoutMs: {
              label: 'Timeout (毫秒)'
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
          description: 'Locate and output a single element by selector'
        },
        queryAllElements: {
          title: 'Element Selector (Multiple)',
          description: 'Locate and output an element list by selector'
        },
        executeScript: {
          title: 'Execute Script',
          description: 'Run custom JS and return the result',
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
      detect: {
        verification: {
          title: 'Detect Verification',
          description: 'Detect whether a verification page appears'
        }
      },
      system: {
        screenSize: {
          title: 'Get Screen Size',
          description: 'Read the system screen width and height'
        },
        windowSize: {
          title: 'Get Window Size',
          description: 'Read the WebView window size'
        },
        mousePosition: {
          title: 'Set Mouse Position',
          description: 'Set the initial mouse position'
        },
        readClipboard: {
          title: 'Read Clipboard',
          description: 'Read system clipboard content'
        },
        writeClipboard: {
          title: 'Write Clipboard',
          description: 'Write content to the system clipboard'
        }
      },
      variable: {
        set: {
          title: 'Set Variable',
          description: 'Store data in a variable'
        },
        get: {
          title: 'Get Variable',
          description: 'Read a variable value'
        }
      },
      logic: {
        equal: {
          title: 'Equal',
          description: 'Check whether two values are equal'
        },
        notEqual: {
          title: 'Not Equal',
          description: 'Check whether two values are not equal'
        },
        greaterThan: {
          title: 'Greater Than',
          description: 'Check whether a > b'
        },
        lessThan: {
          title: 'Less Than',
          description: 'Check whether a < b'
        },
        greaterThanOrEqual: {
          title: 'Greater Than or Equal',
          description: 'Check whether a ≥ b'
        },
        lessThanOrEqual: {
          title: 'Less Than or Equal',
          description: 'Check whether a ≤ b'
        },
        and: {
          title: 'AND',
          description: 'Logical AND between two boolean values'
        },
        or: {
          title: 'OR',
          description: 'Logical OR between two boolean values'
        },
        not: {
          title: 'NOT',
          description: 'Logical NOT, or inversion'
        },
        isEmpty: {
          title: 'Is Empty',
          description: 'Check whether a value is empty (null/undefined/empty string/empty array)'
        },
        exists: {
          title: 'Exists',
          description: 'Check whether a value exists (not null/undefined)'
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
          description: 'Round down, up, or to nearest'
        },
        random: {
          title: 'Random Number',
          description: 'Generate a random number in a range'
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
        substring: {
          title: 'Substring',
          description: 'Extract a part of a string'
        },
        replace: {
          title: 'Replace String',
          description: 'Replace content in a string'
        },
        concat: {
          title: 'Concatenate Strings',
          description: 'Join multiple strings'
        },
        regexMatch: {
          title: 'Regex Match',
          description: 'Match using a regular expression'
        },
        regexReplace: {
          title: 'Regex Replace',
          description: 'Replace using a regular expression'
        },
        split: {
          title: 'Split String',
          description: 'Split a string by separator'
        },
        length: {
          title: 'String Length',
          description: 'Read the length of a string'
        },
        uppercase: {
          title: 'Uppercase',
          description: 'Convert to uppercase'
        },
        lowercase: {
          title: 'Lowercase',
          description: 'Convert to lowercase'
        },
        trim: {
          title: 'Trim Spaces',
          description: 'Remove leading and trailing spaces'
        }
      },
      arrayObject: {
        filter: {
          title: 'Filter Data',
          description: 'Filter an array'
        },
        merge: {
          title: 'Merge Data',
          description: 'Merge multiple data sources'
        },
        split: {
          title: 'Split Data',
          description: 'Split data into multiple branches'
        },
        length: {
          title: 'Array Length',
          description: 'Read the array length'
        },
        item: {
          title: 'Array Index',
          description: 'Read a value at a given array index',
          fields: {
            index: {
              label: 'Index'
            }
          }
        }
      },
      typeConvert: {
        string: {
          title: 'To String',
          description: 'Convert to string type'
        },
        number: {
          title: 'To Number',
          description: 'Convert to number type'
        },
        boolean: {
          title: 'To Boolean',
          description: 'Convert to boolean type'
        },
        json: {
          title: 'To JSON',
          description: 'Convert to a JSON string'
        },
        parseJson: {
          title: 'Parse JSON',
          description: 'Parse a JSON string'
        }
      },
      controlFlow: {
        loop: {
          title: 'Loop',
          description: 'ForEach / While loop'
        },
        condition: {
          title: 'Condition',
          description: 'If / Else branch'
        },
        switch: {
          title: 'Multi-Branch',
          description: 'Switch multi-branch control'
        }
      },
      output: {
        sendToApi: {
          title: 'Send to API',
          description: 'Send data to your dedicated API'
        },
        printLog: {
          title: 'Print Log',
          description: 'Output debug information'
        },
        screenshot: {
          title: 'Screenshot',
          description: 'Capture a page or element'
        }
      }
    }
  }
};
