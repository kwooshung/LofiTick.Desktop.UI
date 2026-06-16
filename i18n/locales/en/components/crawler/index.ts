export const crawler = {
  blueprint: {
    title: 'Crawler Blueprint',
    groups: {
      navigation: {
        title: 'Navigation and Page Control',
        description: 'Browser navigation, forward, and back.'
      },
      wait: {
        title: 'Wait and Sync',
        description: 'Wait for elements, text, conditions, or time.'
      },
      interaction: {
        title: 'Interaction and Input',
        description: 'Clicking, typing, selection, and keyboard input.'
      },
      mouse: {
        title: 'Human Mouse Simulation',
        description: 'Simulate a more natural mouse movement path.'
      },
      scroll: {
        title: 'Scroll and View',
        description: 'Control page scrolling and visibility.'
      },
      extract: {
        title: 'Extract and Query',
        description: 'Read text, attributes, HTML, and script results.'
      },
      http: {
        title: 'HTTP Request',
        description: 'Run raw HTTP requests and handle cookies.'
      },
      detect: {
        title: 'Detection and Protection',
        description: 'Detect verification and common protection pages.'
      },
      system: {
        title: 'System and Window',
        description: 'Read screen, window, and clipboard data.'
      },
      variable: {
        title: 'Data Processing - Variables',
        description: 'Store and read shared variables between nodes.'
      },
      logic: {
        title: 'Data Processing - Logic',
        description: 'Comparison, boolean, and empty-value checks.'
      },
      math: {
        title: 'Data Processing - Math',
        description: 'Basic arithmetic, random numbers, and rounding.'
      },
      string: {
        title: 'Data Processing - Strings',
        description: 'Substring, replace, concat, and regex.'
      },
      arrayObject: {
        title: 'Data Processing - Arrays and Objects',
        description: 'Filter, merge, split, and index lookup.'
      },
      typeConvert: {
        title: 'Data Processing - Type Conversion',
        description: 'String, number, boolean, and JSON conversion.'
      },
      controlFlow: {
        title: 'Control Flow',
        description: 'Looping, branching, and switch control.'
      },
      output: {
        title: 'Output',
        description: 'Send, log, and screenshot outputs.'
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
        }
      },
      navigation: {
        goto: {
          title: 'Go to Page',
          description: 'Open the specified URL.'
        },
        refresh: {
          title: 'Refresh Page',
          description: 'Refresh the current page.'
        },
        back: {
          title: 'Back',
          description: 'Go back in browser history.'
        },
        forward: {
          title: 'Forward',
          description: 'Go forward in browser history.'
        }
      },
      wait: {
        element: {
          title: 'Wait for Element',
          description: 'Wait for a target element to appear.'
        },
        time: {
          title: 'Wait Time',
          description: 'Wait a fixed number of milliseconds.'
        },
        random: {
          title: 'Random Wait',
          description: 'Wait randomly within a min/max range.'
        },
        loadState: {
          title: 'Wait for Load State',
          description: 'Wait until the page reaches a load state.'
        },
        condition: {
          title: 'Wait for Condition',
          description: 'Wait for a custom JS condition to become true.'
        },
        text: {
          title: 'Wait for Text',
          description: 'Wait for a specific text to appear.'
        },
        delay: {
          title: 'Delay',
          description: 'Pure delay wait.'
        }
      },
      interaction: {
        clickElement: {
          title: 'Click Element',
          description: 'Click a target element.'
        },
        doubleClickElement: {
          title: 'Double Click Element',
          description: 'Double-click a target element.'
        },
        hoverElement: {
          title: 'Hover Element',
          description: 'Hover the mouse over an element.'
        },
        inputText: {
          title: 'Input Text',
          description: 'Type text character by character.'
        },
        fillContent: {
          title: 'Fill Content',
          description: 'Fill a form value directly.'
        },
        selectOption: {
          title: 'Select Option',
          description: 'Select an item from a dropdown.'
        },
        checkBox: {
          title: 'Check Box',
          description: 'Check a checkbox.'
        },
        uncheckBox: {
          title: 'Uncheck Box',
          description: 'Uncheck a checkbox.'
        },
        focusElement: {
          title: 'Focus Element',
          description: 'Focus an element.'
        },
        dispatchEvent: {
          title: 'Dispatch Event',
          description: 'Dispatch a custom event.'
        },
        pressKey: {
          title: 'Press Key',
          description: 'Simulate key presses or key combos.'
        }
      },
      mouse: {
        move: {
          title: 'Move Mouse',
          description: 'Move the mouse to a target coordinate.'
        },
        curve: {
          title: 'Mouse Curve',
          description: 'Add a curved path to mouse movement.'
        },
        accel: {
          title: 'Mouse Acceleration',
          description: 'Add acceleration and deceleration to movement.'
        },
        jitter: {
          title: 'Mouse Jitter',
          description: 'Add random jitter to movement.'
        },
        duration: {
          title: 'Mouse Move Duration',
          description: 'Set the total duration for the move.'
        }
      },
      scroll: {
        toPosition: {
          title: 'Scroll to Position',
          description: 'Scroll to a coordinate or element.'
        },
        intoView: {
          title: 'Scroll into View',
          description: 'Bring an element into view.'
        },
        infinite: {
          title: 'Infinite Scroll',
          description: 'Keep scrolling to load more content.'
        }
      },
      extract: {
        getText: {
          title: 'Get Text',
          description: 'Read element text content.'
        },
        getAttribute: {
          title: 'Get Attribute',
          description: 'Read a specific attribute from an element.'
        },
        getHtml: {
          title: 'Get HTML',
          description: 'Read innerHTML or outerHTML.'
        },
        getValue: {
          title: 'Get Value',
          description: 'Read a form field value.'
        },
        queryElement: {
          title: 'Query Element',
          description: 'Query a single element.'
        },
        queryAllElements: {
          title: 'Query All Elements',
          description: 'Query multiple elements and return a list.'
        },
        executeScript: {
          title: 'Execute Script',
          description: 'Run custom JS and return the result.'
        }
      },
      http: {
        request: {
          title: 'HTTP Request',
          description: 'Send raw GET / POST / etc. requests.'
        },
        getCookies: {
          title: 'Get Cookies',
          description: 'Read current cookies.'
        },
        setCookies: {
          title: 'Set Cookies',
          description: 'Write cookies.'
        }
      },
      detect: {
        verification: {
          title: 'Detect Verification',
          description: 'Detect whether a verification page appears.'
        }
      },
      system: {
        screenSize: {
          title: 'Get Screen Size',
          description: 'Read the system screen width and height.'
        },
        windowSize: {
          title: 'Get Window Size',
          description: 'Read the WebView window size.'
        },
        mousePosition: {
          title: 'Set Mouse Position',
          description: 'Set the initial mouse position.'
        },
        readClipboard: {
          title: 'Read Clipboard',
          description: 'Read system clipboard content.'
        },
        writeClipboard: {
          title: 'Write Clipboard',
          description: 'Write content to the system clipboard.'
        }
      },
      variable: {
        set: {
          title: 'Set Variable',
          description: 'Store data in a variable.'
        },
        get: {
          title: 'Get Variable',
          description: 'Read a variable value.'
        }
      },
      logic: {
        equal: {
          title: 'Equal',
          description: 'Check whether two values are equal.'
        },
        notEqual: {
          title: 'Not Equal',
          description: 'Check whether two values are not equal.'
        },
        greaterThan: {
          title: 'Greater Than',
          description: 'Check whether a > b.'
        },
        lessThan: {
          title: 'Less Than',
          description: 'Check whether a < b.'
        },
        greaterThanOrEqual: {
          title: 'Greater Than or Equal',
          description: 'Check whether a ≥ b.'
        },
        lessThanOrEqual: {
          title: 'Less Than or Equal',
          description: 'Check whether a ≤ b.'
        },
        and: {
          title: 'AND',
          description: 'Logical AND between two boolean values.'
        },
        or: {
          title: 'OR',
          description: 'Logical OR between two boolean values.'
        },
        not: {
          title: 'NOT',
          description: 'Logical NOT, or inversion.'
        },
        isEmpty: {
          title: 'Is Empty',
          description: 'Check whether a value is empty (null/undefined/empty string/empty array).'
        },
        exists: {
          title: 'Exists',
          description: 'Check whether a value exists (not null/undefined).'
        }
      },
      math: {
        add: {
          title: 'Add',
          description: 'Add two numbers.'
        },
        subtract: {
          title: 'Subtract',
          description: 'Subtract two numbers.'
        },
        multiply: {
          title: 'Multiply',
          description: 'Multiply two numbers.'
        },
        divide: {
          title: 'Divide',
          description: 'Divide two numbers.'
        },
        round: {
          title: 'Round',
          description: 'Round down, up, or to nearest.'
        },
        random: {
          title: 'Random Number',
          description: 'Generate a random number in a range.'
        },
        absolute: {
          title: 'Absolute Value',
          description: 'Get the absolute value.'
        },
        modulo: {
          title: 'Modulo',
          description: 'Compute the remainder of a % b.'
        },
        power: {
          title: 'Power',
          description: 'Compute a to the power of b.'
        }
      },
      string: {
        substring: {
          title: 'Substring',
          description: 'Extract a part of a string.'
        },
        replace: {
          title: 'Replace String',
          description: 'Replace content in a string.'
        },
        concat: {
          title: 'Concatenate Strings',
          description: 'Join multiple strings.'
        },
        regexMatch: {
          title: 'Regex Match',
          description: 'Match using a regular expression.'
        },
        regexReplace: {
          title: 'Regex Replace',
          description: 'Replace using a regular expression.'
        },
        split: {
          title: 'Split String',
          description: 'Split a string by separator.'
        },
        length: {
          title: 'String Length',
          description: 'Read the length of a string.'
        },
        uppercase: {
          title: 'Uppercase',
          description: 'Convert to uppercase.'
        },
        lowercase: {
          title: 'Lowercase',
          description: 'Convert to lowercase.'
        },
        trim: {
          title: 'Trim Spaces',
          description: 'Remove leading and trailing spaces.'
        }
      },
      arrayObject: {
        filter: {
          title: 'Filter Data',
          description: 'Filter an array.'
        },
        merge: {
          title: 'Merge Data',
          description: 'Merge multiple data sources.'
        },
        split: {
          title: 'Split Data',
          description: 'Split data into multiple branches.'
        },
        length: {
          title: 'Array Length',
          description: 'Read the array length.'
        },
        item: {
          title: 'Array Index',
          description: 'Read a value at a given array index.'
        }
      },
      typeConvert: {
        string: {
          title: 'To String',
          description: 'Convert to string type.'
        },
        number: {
          title: 'To Number',
          description: 'Convert to number type.'
        },
        boolean: {
          title: 'To Boolean',
          description: 'Convert to boolean type.'
        },
        json: {
          title: 'To JSON',
          description: 'Convert to a JSON string.'
        },
        parseJson: {
          title: 'Parse JSON',
          description: 'Parse a JSON string.'
        }
      },
      controlFlow: {
        loop: {
          title: 'Loop',
          description: 'ForEach / While loop.'
        },
        condition: {
          title: 'Condition',
          description: 'If / Else branch.'
        },
        switch: {
          title: 'Multi-Branch',
          description: 'Switch multi-branch control.'
        }
      },
      output: {
        sendToApi: {
          title: 'Send to API',
          description: 'Send data to your dedicated API.'
        },
        printLog: {
          title: 'Print Log',
          description: 'Output debug information.'
        },
        screenshot: {
          title: 'Screenshot',
          description: 'Capture a page or element.'
        }
      }
    }
  }
};
