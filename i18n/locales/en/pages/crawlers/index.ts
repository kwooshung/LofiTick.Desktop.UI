export const crawlers = {
  title: 'Crawlers',
  search: {
    header: {
      title: 'Search Crawlers',
      startLabel: 'Click to search crawlers',
      conditions: 'Search conditions set'
    },
    body: {
      keyword: {
        placeholder: 'Search site name or description'
      },
      enabled: {
        placeholder: 'Filter enabled status'
      }
    }
  },
  targets: {
    title: 'Sites',
    add: 'Add Site',
    edit: 'Edit Site',
    addTask: 'Add Task',
    menu: {
      open: 'Open Site',
      copyDomain: 'Copy Domain',
      copyBaseUrl: 'Copy Site URL'
    },
    empty: {
      title: 'No Target Sites',
      description: 'No crawler target sites have been added. Click the button above to add one.'
    },
    form: {
      name: {
        label: 'Site Name',
        placeholder: 'Enter site name',
        verify: {
          required: 'Site name is required',
          length: 'Site name cannot exceed 255 characters'
        }
      },
      domain: {
        label: 'Domain',
        placeholder: 'Enter domain, e.g. weibo.com',
        verify: {
          required: 'Domain is required',
          length: 'Domain cannot exceed 255 characters',
          pattern: 'Invalid domain format'
        }
      },
      baseUrl: {
        label: 'Base URL',
        placeholder: 'Enter site domain, e.g. weibo.com',
        verify: {
          required: 'Base URL is required',
          length: 'Base URL must not exceed 255 characters',
          pattern: 'Invalid URL format'
        }
      },
      description: {
        label: 'Description',
        placeholder: 'Enter description'
      },
      isEnabled: {
        label: 'Enabled'
      },
      unique: {
        checking: 'Checking uniqueness...',
        domainExists: 'This domain already exists'
      }
    }
  },
  blueprint: {
    drawer: {
      title: 'Crawler Logic',
      description: 'Pick nodes on the left and assemble the crawler flow on the right.'
    },
    nodes: {
      groups: {
        recent: {
          title: 'Recent Nodes',
          description: 'Quick access to recently inserted nodes.'
        },
        flow: {
          title: 'Flow Control',
          description: 'Build the entry point, branching, and execution order.'
        },
        request: {
          title: 'Network Requests',
          description: 'Send requests and handle responses.'
        },
        parser: {
          title: 'Data Parsing',
          description: 'Extract content from pages and structured data.'
        },
        variable: {
          title: 'Variables & Data',
          description: 'Use booleans, numbers, strings, and variable reads/writes.'
        },
        compare: {
          title: 'Comparison',
          description: 'Compare values for size, equality, and inequality.'
        },
        logicOp: {
          title: 'Logical Operations',
          description: 'Use AND, OR, NOT, and nullish coalescing.'
        },
        logic: {
          title: 'Condition & Loop',
          description: 'Use branching, condition switching, and loop execution.'
        },
        debug: {
          title: 'Debug & Utilities',
          description: 'Use logs, previews, and retry helpers.'
        },
        array: {
          title: 'Array Operations',
          description: 'Add, remove, query, and sort arrays.'
        },
        string: {
          title: 'String Operations',
          description: 'Slice, replace, and format strings.'
        },
        object: {
          title: 'Object Operations',
          description: 'Read, write, and merge object properties.'
        },
        math: {
          title: 'Math Operations',
          description: 'Use numeric calculations and random values.'
        },
        convert: {
          title: 'Type Conversion',
          description: 'Convert between different data types.'
        },
        function: {
          title: 'Function Nodes',
          description: 'Define, call, and return functions.'
        },
        storage: {
          title: 'Data Storage',
          description: 'Write files and submit data.'
        },
        delay: {
          title: 'Delay & Wait',
          description: 'Use fixed, random, and conditional waits.'
        },
        antiBot: {
          title: 'Anti-Bot Handling',
          description: 'Use request disguise and challenge detection.'
        },
        helper: {
          title: 'Helpers',
          description: 'Common utilities for time, IDs, and hashes.'
        },
        browser: {
          title: 'WebView2 Automation',
          description: 'Control navigation, clicks, screenshots, and tabs, prioritizing WebView2 atomic actions.'
        },
        element: {
          title: 'Element Interaction',
          description: 'Click, type, drag, and scroll elements.'
        },
        elementWait: {
          title: 'Element Wait & Checks',
          description: 'Wait for, inspect, and read element state.'
        },
        form: {
          title: 'Form Handling',
          description: 'Fill, submit, and validate forms.'
        },
        context: {
          title: 'Browser Context',
          description: 'Control tabs, frames, and dialogs.'
        },
        cookie: {
          title: 'Cookie & Storage',
          description: 'Read and write cookies and local storage.'
        },
        network: {
          title: 'Network & Interception',
          description: 'Intercept, modify, and inspect network requests.'
        },
        js: {
          title: 'Execute JavaScript',
          description: 'Run and inject page scripts.'
        }
      },
      nodes: {
        flow: {
          start: {
            title: 'Start Node',
            description: 'Blueprint entry point with initial parameters.'
          },
          end: {
            title: 'End Node',
            description: 'Blueprint exit point that returns the final result.'
          },
          sequence: {
            title: 'Sequence',
            description: 'Connect multiple child flows in order.'
          },
          branch: {
            title: 'Branch Selection',
            description: 'Switch execution branches by condition.'
          },
          parallel: {
            title: 'Parallel Execution',
            description: 'Run multiple child flows at the same time.'
          }
        },
        request: {
          get: {
            title: 'GET Request',
            description: 'Send an HTTP GET request.'
          },
          post: {
            title: 'POST Request',
            description: 'Send an HTTP POST request.'
          },
          config: {
            title: 'Request Config',
            description: 'Set headers, cookies, and proxies.'
          },
          parse: {
            title: 'Response Parsing',
            description: 'Parse JSON, HTML, or XML responses.'
          },
          put: {
            title: 'PUT Request',
            description: 'Send an HTTP PUT request.'
          },
          delete: {
            title: 'DELETE Request',
            description: 'Send an HTTP DELETE request.'
          },
          download: {
            title: 'Download File',
            description: 'Download a file locally.'
          },
          upload: {
            title: 'Upload File',
            description: 'Upload a file to the server.'
          },
          session: {
            title: 'Session Management',
            description: 'Keep login state and manage cookies.'
          }
        },
        parser: {
          css: {
            title: 'CSS Selector',
            description: 'Extract elements from HTML.'
          },
          json: {
            title: 'JSON Parsing',
            description: 'Pull fields from JSON data.'
          },
          list: {
            title: 'List Extraction',
            description: 'Handle pagination and expand list items.'
          },
          attr: {
            title: 'Attribute Extraction',
            description: 'Extract src, href, and other attributes.'
          },
          xpath: {
            title: 'XPath Selector',
            description: 'Extract XML / HTML data with XPath.'
          },
          regex: {
            title: 'Regular Expression',
            description: 'Extract text with regex matching.'
          },
          text: {
            title: 'HTML to Text',
            description: 'Convert HTML into plain text.'
          },
          table: {
            title: 'Table Parsing',
            description: 'Parse HTML table data.'
          }
        },
        logic: {
          boolean: {
            title: 'Boolean',
            description: 'Boolean value node.'
          },
          string: {
            title: 'String',
            description: 'String value node.'
          },
          ifElse: {
            title: 'if-else',
            description: 'Two-way conditional branch.'
          },
          loop: {
            title: 'for',
            description: 'Iterate over items or counts.'
          },
          integer: {
            title: 'Integer',
            description: 'Integer value node.'
          },
          float: {
            title: 'Float',
            description: 'Floating-point value node.'
          },
          array: {
            title: 'Array',
            description: 'Array node.'
          },
          object: {
            title: 'Object',
            description: 'Object node.'
          },
          null: {
            title: 'Null',
            description: 'Null value node.'
          },
          get: {
            title: 'Get Variable',
            description: 'Read a variable value.'
          },
          set: {
            title: 'Set Variable',
            description: 'Write a variable value.'
          },
          if: {
            title: 'if',
            description: 'Single-branch conditional.'
          },
          switch: {
            title: 'switch',
            description: 'Multi-branch selection.'
          }
        },
        debug: {
          log: {
            title: 'Log Output',
            description: 'Print debugging information.'
          },
          preview: {
            title: 'Data Preview',
            description: 'Preview the current node output.'
          },
          breakpoint: {
            title: 'Breakpoint Debugging',
            description: 'Pause execution at a specific point and inspect runtime data.'
          },
          error: {
            title: 'Error Capture',
            description: 'Capture execution errors and handle them consistently.'
          },
          retry: {
            title: 'Retry Logic',
            description: 'Retry automatically after failures.'
          }
        },
        array: {
          push: {
            title: 'push',
            description: 'Append an element to the end of the array.'
          },
          pop: {
            title: 'pop',
            description: 'Remove the last array element.'
          },
          slice: {
            title: 'slice',
            description: 'Extract a slice of the array.'
          },
          concat: {
            title: 'concat',
            description: 'Merge arrays.'
          },
          join: {
            title: 'join',
            description: 'Convert array to string.'
          },
          get: {
            title: 'get',
            description: 'Get an element by index.'
          },
          indexOf: {
            title: 'indexOf',
            description: 'Find the index of an element.'
          },
          includes: {
            title: 'includes',
            description: 'Check whether the element exists.'
          },
          find: {
            title: 'find',
            description: 'Find the first matching element.'
          },
          filter: {
            title: 'filter',
            description: 'Filter array items.'
          },
          map: {
            title: 'map',
            description: 'Map array items.'
          },
          reduce: {
            title: 'reduce',
            description: 'Reduce the array.'
          },
          sort: {
            title: 'sort',
            description: 'Sort the array.'
          },
          length: {
            title: 'length',
            description: 'Get the array length.'
          }
        },
        string: {
          charAt: {
            title: 'charAt',
            description: 'Get the character at the specified position.'
          },
          includes: {
            title: 'includes',
            description: 'Check whether the string contains a substring.'
          },
          slice: {
            title: 'slice',
            description: 'Extract a slice of the string.'
          },
          split: {
            title: 'split',
            description: 'Split the string into an array.'
          },
          replace: {
            title: 'replace',
            description: 'Replace text in the string.'
          },
          trim: {
            title: 'trim',
            description: 'Remove leading and trailing whitespace.'
          },
          toLowerCase: {
            title: 'toLowerCase',
            description: 'Convert to lower case.'
          },
          toUpperCase: {
            title: 'toUpperCase',
            description: 'Convert to upper case.'
          },
          repeat: {
            title: 'repeat',
            description: 'Repeat the string.'
          },
          padStart: {
            title: 'padStart',
            description: 'Pad at the start.'
          },
          padEnd: {
            title: 'padEnd',
            description: 'Pad at the end.'
          },
          length: {
            title: 'length',
            description: 'Get the string length.'
          }
        },
        object: {
          get: {
            title: 'Get Property',
            description: 'Read an object property.'
          },
          set: {
            title: 'Set Property',
            description: 'Write an object property.'
          },
          delete: {
            title: 'Delete Property',
            description: 'Delete an object property.'
          },
          keys: {
            title: 'keys',
            description: 'Get the key list.'
          },
          values: {
            title: 'values',
            description: 'Get the value list.'
          },
          entries: {
            title: 'entries',
            description: 'Get the key-value list.'
          },
          assign: {
            title: 'assign',
            description: 'Merge objects.'
          },
          hasOwnProperty: {
            title: 'hasOwnProperty',
            description: 'Check own properties.'
          },
          create: {
            title: 'Create Object',
            description: 'Create a new object.'
          }
        },
        math: {
          add: {
            title: 'Addition (+)',
            description: 'Add numeric values.'
          },
          subtract: {
            title: 'Subtraction (-)',
            description: 'Subtract numeric values.'
          },
          multiply: {
            title: 'Multiplication (*)',
            description: 'Multiply numeric values.'
          },
          divide: {
            title: 'Division (/)',
            description: 'Divide numeric values.'
          },
          mod: {
            title: 'Remainder (%)',
            description: 'Perform modulo calculation.'
          },
          pow: {
            title: 'Exponentiation (**)',
            description: 'Perform exponentiation.'
          },
          random: {
            title: 'Math.random',
            description: 'Generate a random number.'
          },
          max: {
            title: 'Math.max',
            description: 'Get the maximum value.'
          },
          min: {
            title: 'Math.min',
            description: 'Get the minimum value.'
          }
        },
        convert: {
          parseInt: {
            title: 'parseInt',
            description: 'Convert string to integer.'
          },
          parseFloat: {
            title: 'parseFloat',
            description: 'Convert string to float.'
          },
          number: {
            title: 'Number',
            description: 'Convert to number.'
          },
          string: {
            title: 'String',
            description: 'Convert to string.'
          },
          boolean: {
            title: 'Boolean',
            description: 'Convert to boolean.'
          },
          toString: {
            title: 'toString',
            description: 'Convert object to string.'
          },
          typeof: {
            title: 'typeof',
            description: 'Get the type.'
          },
          instanceof: {
            title: 'instanceof',
            description: 'Check the type.'
          }
        },
        compare: {
          eq: {
            title: '==',
            description: 'Loose equality.'
          },
          eqStrict: {
            title: '===',
            description: 'Strict equality of value and type.'
          },
          ne: {
            title: '!=',
            description: 'Not equal.'
          },
          neStrict: {
            title: '!==',
            description: 'Value or type not equal.'
          },
          gt: {
            title: '>',
            description: 'Greater than comparison.'
          },
          gte: {
            title: '>=',
            description: 'Greater than or equal.'
          },
          lt: {
            title: '<',
            description: 'Less than comparison.'
          },
          lte: {
            title: '<=',
            description: 'Less than or equal.'
          }
        },
        logicOp: {
          and: {
            title: '&&',
            description: 'Logical AND.'
          },
          or: {
            title: '||',
            description: 'Logical OR.'
          },
          not: {
            title: '!',
            description: 'Logical NOT.'
          },
          nullish: {
            title: '??',
            description: 'Nullish coalescing.'
          },
          optional: {
            title: '?.',
            description: 'Optional chaining.'
          }
        },
        function: {
          define: {
            title: 'Define Function',
            description: 'function declarations or arrow functions.'
          },
          call: {
            title: 'Call Function',
            description: 'Execute a function.'
          },
          return: {
            title: 'Return Value',
            description: 'Return the result.'
          },
          params: {
            title: 'Parameter Passing',
            description: 'Pass function parameters.'
          },
          arrow: {
            title: 'Arrow Function',
            description: 'Arrow function.'
          }
        },
        storage: {
          writeFile: {
            title: 'Write File',
            description: 'Write data to a temporary file.'
          },
          readFile: {
            title: 'Read File',
            description: 'Read local file data.'
          },
          submit: {
            title: 'Submit Data',
            description: 'Submit data to the backend through the API.'
          }
        },
        delay: {
          fixed: {
            title: 'Fixed Delay',
            description: 'Wait for a fixed duration.'
          },
          random: {
            title: 'Random Delay',
            description: 'Wait for a random duration (anti-bot).'
          },
          element: {
            title: 'Wait for Element',
            description: 'Wait for a page element to appear.'
          },
          condition: {
            title: 'Wait for Condition',
            description: 'Wait until a condition is met.'
          }
        },
        antiBot: {
          ua: {
            title: 'User-Agent Setting',
            description: 'Set a random User-Agent.'
          },
          proxy: {
            title: 'Proxy Setting',
            description: 'Use a proxy IP.'
          },
          challenge: {
            title: 'Challenge Detection',
            description: 'Detect Cloudflare, reCAPTCHA, hCaptcha, and Turnstile.'
          },
          headers: {
            title: 'Header Masking',
            description: 'Mask browser request headers.'
          },
          referer: {
            title: 'Referer Setting',
            description: 'Set the request source.'
          }
        },
        helper: {
          comment: {
            title: 'Comment',
            description: 'Add a comment.'
          },
          subflow: {
            title: 'Subflow',
            description: 'Wrap a reusable subflow.'
          },
          timestamp: {
            title: 'Timestamp',
            description: 'Get the current timestamp.'
          },
          uuid: {
            title: 'UUID Generation',
            description: 'Generate a unique ID.'
          },
          hash: {
            title: 'Hash Calculation',
            description: 'Calculate MD5, SHA, and other hashes.'
          }
        },
        browser: {
          launch: {
            title: 'Launch Browser',
            description: 'Launch Chrome, Firefox, or Edge.'
          },
          close: {
            title: 'Close Browser',
            description: 'Close the browser instance.'
          },
          openPage: {
            title: 'Open Page',
            description: 'Open a page by URL.'
          },
          closePage: {
            title: 'Close Page',
            description: 'Close the current page.'
          },
          navigate: {
            title: 'Page Navigation',
            description: 'Navigate to a new URL in the current page.'
          },
          waitLoad: {
            title: 'Wait for Load',
            description: 'Wait until the page is fully loaded.'
          },
          waitIdle: {
            title: 'Wait for Network Idle',
            description: 'Wait until network requests complete.'
          },
          screenshot: {
            title: 'Screenshot',
            description: 'Capture a screenshot of the current page.'
          },
          html: {
            title: 'Get Page HTML',
            description: 'Get the full HTML of the page.'
          },
          url: {
            title: 'Get Page URL',
            description: 'Get the current page URL.'
          },
          refresh: {
            title: 'Refresh Page',
            description: 'Refresh the current page.'
          },
          back: {
            title: 'Go Back',
            description: 'Navigate back in the browser.'
          },
          forward: {
            title: 'Go Forward',
            description: 'Navigate forward in the browser.'
          }
        },
        element: {
          click: {
            title: 'Click Element',
            description: 'Click a page element.'
          },
          input: {
            title: 'Type Text',
            description: 'Type text into an input field.'
          },
          clear: {
            title: 'Clear Input',
            description: 'Clear input content.'
          },
          select: {
            title: 'Select Dropdown',
            description: 'Select an option from a dropdown.'
          },
          checkbox: {
            title: 'Toggle Checkbox',
            description: 'Check or uncheck a checkbox.'
          },
          radio: {
            title: 'Select Radio',
            description: 'Select a radio button.'
          },
          upload: {
            title: 'File Upload',
            description: 'Upload a file into a file input.'
          },
          hover: {
            title: 'Hover Element',
            description: 'Hover the mouse over an element.'
          },
          drag: {
            title: 'Drag Element',
            description: 'Drag an element to a target position.'
          },
          scrollToElement: {
            title: 'Scroll to Element',
            description: 'Scroll the page to the element position.'
          },
          scrollToPosition: {
            title: 'Scroll to Position',
            description: 'Scroll to the specified coordinates.'
          },
          rightClick: {
            title: 'Right Click',
            description: 'Right-click an element.'
          },
          doubleClick: {
            title: 'Double Click',
            description: 'Double-click an element.'
          },
          setValue: {
            title: 'Set Value',
            description: 'Set a generic element value.'
          },
          trigger: {
            title: 'Trigger Event',
            description: 'Trigger a generic element event.'
          }
        },
        elementWait: {
          appear: {
            title: 'Wait for Element to Appear',
            description: 'Wait for an element to appear in the DOM.'
          },
          disappear: {
            title: 'Wait for Element to Disappear',
            description: 'Wait for an element to disappear from the DOM.'
          },
          visible: {
            title: 'Wait for Visible Element',
            description: 'Wait for an element to become visible.'
          },
          hidden: {
            title: 'Wait for Hidden Element',
            description: 'Wait for an element to become hidden.'
          },
          clickable: {
            title: 'Wait for Clickable Element',
            description: 'Wait for an element to become clickable.'
          },
          exists: {
            title: 'Check Element Exists',
            description: 'Check whether the element exists.'
          },
          visibleCheck: {
            title: 'Check Element Visible',
            description: 'Check whether the element is visible.'
          },
          clickableCheck: {
            title: 'Check Element Clickable',
            description: 'Check whether the element is clickable.'
          },
          text: {
            title: 'Get Element Text',
            description: 'Get the element text content.'
          },
          attr: {
            title: 'Get Element Attribute',
            description: 'Get the element attribute value.'
          },
          style: {
            title: 'Get Element Style',
            description: 'Get the element CSS style.'
          },
          count: {
            title: 'Get Element Count',
            description: 'Get the number of matched elements.'
          }
        },
        form: {
          fill: {
            title: 'Fill Form',
            description: 'Fill form fields in batch.'
          },
          submit: {
            title: 'Submit Form',
            description: 'Submit the form.'
          },
          reset: {
            title: 'Reset Form',
            description: 'Reset the form to its initial state.'
          },
          validate: {
            title: 'Form Validation',
            description: 'Validate form fields.'
          }
        },
        context: {
          switchTab: {
            title: 'Switch Tab',
            description: 'Switch to a different browser tab.'
          },
          openTab: {
            title: 'Open New Tab',
            description: 'Open a new tab.'
          },
          closeTab: {
            title: 'Close Tab',
            description: 'Close the current tab.'
          },
          switchFrame: {
            title: 'Switch Frame',
            description: 'Switch to an iframe.'
          },
          switchMainFrame: {
            title: 'Switch to Main Frame',
            description: 'Switch back to the main document.'
          },
          switchDialog: {
            title: 'Switch Dialog',
            description: 'Switch to a browser dialog.'
          },
          acceptDialog: {
            title: 'Accept Dialog',
            description: 'Accept alert / confirm.'
          },
          dismissDialog: {
            title: 'Dismiss Dialog',
            description: 'Dismiss confirm.'
          },
          promptText: {
            title: 'Enter Dialog Text',
            description: 'Enter text in prompt.'
          }
        },
        cookie: {
          get: {
            title: 'Get Cookie',
            description: 'Get page cookies.'
          },
          set: {
            title: 'Set Cookie',
            description: 'Set cookies.'
          },
          delete: {
            title: 'Delete Cookie',
            description: 'Delete cookies.'
          },
          localGet: {
            title: 'Get LocalStorage',
            description: 'Get LocalStorage data.'
          },
          localSet: {
            title: 'Set LocalStorage',
            description: 'Set LocalStorage data.'
          },
          sessionGet: {
            title: 'Get SessionStorage',
            description: 'Get SessionStorage data.'
          },
          sessionSet: {
            title: 'Set SessionStorage',
            description: 'Set SessionStorage data.'
          }
        },
        network: {
          intercept: {
            title: 'Intercept Request',
            description: 'Intercept network requests.'
          },
          modifyRequest: {
            title: 'Modify Request',
            description: 'Modify request content.'
          },
          interceptResponse: {
            title: 'Intercept Response',
            description: 'Intercept network responses.'
          },
          modifyResponse: {
            title: 'Modify Response',
            description: 'Modify response content.'
          },
          mock: {
            title: 'Mock Response',
            description: 'Mock response data.'
          },
          list: {
            title: 'Get Request List',
            description: 'Get all network requests.'
          },
          wait: {
            title: 'Wait for Request',
            description: 'Wait for a specific request to finish.'
          }
        },
        js: {
          exec: {
            title: 'Run Page Script',
            description: 'Run page scripts only when WebView2 atomic actions are not enough.'
          },
          execReturn: {
            title: 'Run Script and Return',
            description: 'Run page scripts and get the return value only when needed.'
          },
          inject: {
            title: 'Inject Page Script',
            description: 'Inject an external script file only when needed.'
          },
          listen: {
            title: 'Add Event Listener',
            description: 'Add a page event listener only when needed.'
          }
        }
      }
    }
  },
  executions: {
    title: 'Execution Records',
    status: {
      pending: 'Pending',
      running: 'Running',
      success: 'Success',
      failed: 'Failed',
      stopped: 'Stopped'
    },
    duration: 'Duration {ms}ms',
    records: '{count} records',
    empty: {
      title: 'No Execution Records',
      description: 'No execution records yet.'
    }
  },
  spider: {
    title: 'Spider',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: 'Music'
      }
    }
  },
  execute: {}
};
