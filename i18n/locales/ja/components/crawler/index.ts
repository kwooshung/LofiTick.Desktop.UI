export const crawler = {
  blueprint: {
    title: 'クローラーブループリント',
    groups: {
      navigation: {
        title: 'ナビゲーションとページ制御',
        description: 'ブラウザの遷移、戻る、進むを制御します'
      },
      wait: {
        title: '待機と同期',
        description: '要素、テキスト、条件、時間の待機です'
      },
      interaction: {
        title: '操作と入力',
        description: 'クリック、入力、選択、キーボード操作です'
      },
      scroll: {
        title: 'スクロールと表示',
        description: 'ページスクロールと表示領域を制御します'
      },
      extract: {
        title: '取得と検索',
        description: 'テキスト、属性、HTML、スクリプト結果を取得します'
      },
      http: {
        title: 'HTTP リクエスト',
        description: '生の HTTP リクエストと Cookie を扱います'
      },
      system: {
        title: 'システムとウィンドウ'
      }
    },
      nodes: {
        common: {
          start: {
            actions: {
              add: '入口パラメータを追加'
            },
            empty: {
              title: '入口パラメータはまだありません',
              description: 'パラメータを追加すると、ブループリント実行時にパスやキーワードなどの外部値を受け取れます。',
              action: '入口パラメータを追加'
            }
          },
          function: {
            start: {
              fields: {
                parameterLabel: 'パラメータ',
                parameterDescription: '開始ノードから出力される入口パラメータ値'
              }
            },
            pins: {
              connectedHint: '接続済み、接続値を使用します',
              namePlaceholder: 'ピン名',
              stringPlaceholder: 'デフォルト値を入力',
              jsonPlaceholder: 'JSON のデフォルト値を入力'
            }
          }
        },
        navigation: {
          goto: {
            inputs: {
              path: '遷移先パス',
              pathDescription: '上流入力のパスは、遷移先パスが空の場合に使用されます'
            },
            fields: {
              path: {
                label: '遷移先パス',
                placeholder: '遷移先パスを入力（例: /news/slug）。変数プレースホルダーは英字の波括弧で囲みます'
              },
              pathVariables: {
                label: 'パス変数',
                placeholder: '変数名（例: slug）',
                fallbackLabel: '変数 {index}',
                pinDescription: '遷移先パス内の同名変数プレースホルダーを置換します',
                actions: {
                  add: '変数を追加'
                },
                empty: {
                  title: 'パス変数はまだありません',
                  description: '変数を追加すると、遷移先パス内で変数プレースホルダーを使って動的なパスを組み立てられます。'
                }
              }
            }
          }
        },
        variable: {
          common: {
            dataTypes: {
              string: 'テキスト',
              number: '数値',
              boolean: '真偽値',
              array: '配列',
              object: 'オブジェクト'
            }
          }
        },
        parameter: {
          get: {
            title: 'パラメータを取得',
            description: '開始ノードで定義した入口パラメータを読み取り、値を出力します',
            empty: {
              title: 'このブループリントにはまだ入口パラメータがありません',
              description: '先に開始ノードで入口パラメータを追加してください。'
            },
            fields: {
              parameters: {
                label: 'パラメータを選択',
                placeholder: '入口パラメータを選択',
                description: '複数選択に対応します。単一選択では値を、複数選択ではオブジェクトを出力します。'
              }
            },
            outputs: {
              value: {
                description: '選択した入口パラメータの現在値を出力します（{type}）'
              }
            }
          }
        }
      },
    units: {
      millisecond: 'ミリ秒',
      count: '回',
      item: '項',
      char: '文字',
      pixel: 'px',
      percent: '%',
      indent: 'スペース'
    },
    pinLabels: {
      input: '入力',
      element: '要素',
      elements: '要素一覧',
      exists: '存在',
      context: 'コンテキスト',
      text: 'テキスト',
      pattern: 'パターン',
      replacement: '置換',
      search: '検索',
      flags: 'フラグ',
      value: '値',
      a: 'A',
      b: 'B',
      min: '最小',
      max: '最大',
      base: '底数',
      exp: '指数',
      start: '開始',
      separator: '区切り',
      result: '結果',
      matches: '一致',
      message: 'メッセージ',
      array: '配列',
      length: '長さ',
      index: 'インデックス',
      item: '項目'
    },
    connectedInputHint: '入力が接続されています。接続値を使用します',
    operandInputLabel: '入力 {label}',
    operandCount: '{count}項',
    selectorInput: {
      mode: {
        options: {
          xpath: 'XPath',
          css: 'CSS'
        }
      },
      invalidHint: '選択した種類とセレクタ構文が一致しない可能性があります。'
    }
  },
  navigation: {
    goto: {
      title: 'ページへ移動',
      description: '指定 URL を開きます',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '遷移が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        path: {
          label: '遷移先パス',
          placeholder: '遷移先パスを入力（例: /news/123）',
          validation: {
            empty: 'パスは空にできません',
            invalidFormat: 'パスは「/」で始まるか、完全な URL である必要があります',
            invalidUrl: '無効な URL 形式です',
            extracted: 'URL "{domain}" からパスを抽出しました：{path}',
            domainMismatch: 'ドメイン不一致：期待 "{expected}"\n、実際 "{actual}"'
          }
        },
        waitReady: {
          label: 'ページ準備完了を待機'
        },
        timeoutMs: {
          label: 'タイムアウト（ms）'
        },
        windowWidth: {
          label: 'ウィンドウ幅'
        },
        windowHeight: {
          label: 'ウィンドウ高さ'
        },
        windowPositionMode: {
          label: '位置モード',
          options: {
            preset: 'プリセット位置',
            custom: 'カスタム座標'
          }
        },
        windowPositionPreset: {
          label: 'プリセット位置',
          options: {
            topLeft: '左上',
            topCenter: '上中',
            topRight: '右上',
            centerLeft: '左中',
            center: '中央',
            centerRight: '右中',
            bottomLeft: '左下',
            bottomCenter: '下中',
            bottomRight: '右下'
          }
        },
        windowX: {
          label: 'ウィンドウ X'
        },
        windowY: {
          label: 'ウィンドウ Y'
        },
        showWebview: {
          label: 'WebView を表示'
        }
      }
    },
    refresh: {
      title: 'ページを更新',
      description: '現在のページを更新します',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '更新が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        },
        waitReady: {
          label: 'ページ準備完了を待機'
        },
        hardReload: {
          label: 'ハードリロード'
        }
      }
    },
    back: {
      title: '戻る',
      description: 'ブラウザ履歴を戻ります',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '戻る操作が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        steps: {
          label: '戻るステップ数'
        },
        waitReady: {
          label: 'ページ準備完了を待機'
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        },
        allowNoHistory: {
          label: '履歴なしエラーを無視'
        }
      }
    },
    forward: {
      title: '進む',
      description: 'ブラウザ履歴を進みます',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '進む操作が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        steps: {
          label: '進むステップ数'
        },
        waitReady: {
          label: 'ページ準備完了を待機'
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        },
        allowNoHistory: {
          label: '履歴なしエラーを無視'
        }
      }
    },
    closePage: {
      title: 'ページを閉じる',
      description: '現在のページセッションを閉じます',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: 'ページを閉じる操作が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        endFlowAfterClose: {
          label: '閉じた後にフローを終了'
        }
      }
    }
  },
  wait: {
    element: {
      title: '要素を待機',
      description: '対象要素の出現を待ちます',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '要素待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        selector: {
          label: 'セレクター',
          placeholder: 'セレクターを入力（例: .news-item）'
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        }
      }
    },
    time: {
      title: '時間待機',
      description: '指定ミリ秒だけ待機します',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '時間待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        durationMs: {
          label: '待機時間（毫秒）'
        }
      }
    },
    random: {
      title: 'ランダム待機',
      description: '最小値と最大値の間でランダムに待機します',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: 'ランダム待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        minMs: {
          label: '最小（毫秒）'
        },
        maxMs: {
          label: '最大（毫秒）'
        }
      }
    },
    loadState: {
      title: '読み込み状態を待機',
      description: 'ページの読み込み状態を待機します',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '読み込み状態待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        state: {
          label: '読み込み状態',
          description: '次へ進む前に待機する読み込み段階を選択します',
          options: {
            load: 'load（ページ資源の読み込み完了）',
            domcontentloaded: 'domcontentloaded（DOM 構造の準備完了）',
            networkidle: 'networkidle（ネットワーク通信が待機状態）'
          }
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        }
      }
    },
    condition: {
      title: '条件を待機',
      description: 'カスタム JS 条件が成立するまで待機します',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '条件待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        expression: {
          label: '条件式',
          description: 'true/false を返す JS 式を入力してください。true で次へ進みます',
          placeholder: "例：window.location.href.includes('/news')"
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        }
      }
    },
    text: {
      title: 'テキストを待機',
      description: '指定テキストの出現を待ちます',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: 'テキスト待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        text: {
          label: '対象テキスト',
          placeholder: '待機するテキストを入力'
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        }
      }
    },
    delay: {
      title: 'ディレイ',
      description: '純粋な遅延待機です',
      outputs: {
        success: '成功',
        fail: '失敗',
        boolean: '結果',
        booleanDescription: '遅延待機が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      fields: {
        durationMs: {
          label: '遅延（毫秒）'
        }
      }
    }
  },
  interaction: {
    common: {
      outputs: {
        boolean: '結果',
        booleanDescription: '操作実行が成功したかどうかを示します',
        message: '情報',
        messageDescription: '失敗時のエラー情報または例外内容'
      },
      pinDescriptions: {
        elementInput: '要素クエリノードが出力した対象要素'
      },
      fields: {
        selector: {
          label: 'セレクター',
          placeholder: '例：#login-btn または .form input[name="email"]'
        },
        timeoutMs: {
          label: 'タイムアウト（毫秒）'
        },
        button: {
          label: 'マウスボタン',
          options: {
            left: '左',
            middle: '中',
            right: '右'
          }
        },
        clickCount: {
          label: 'クリック回数'
        },
        hoverDelayMs: {
          label: 'ホバー後遅延',
          input: {
            prefix: '固定'
          }
        },
        randomHoverDelay: {
          label: 'ランダムホバー遅延'
        },
        hoverDelayMinMs: {
          label: '最小ホバー遅延（毫秒）',
          input: {
            prefix: '最小'
          }
        },
        hoverDelayMaxMs: {
          label: '最大ホバー遅延（毫秒）',
          input: {
            prefix: '最大'
          }
        },
        text: {
          label: 'テキスト',
          placeholder: '入力するテキストを入力'
        },
        content: {
          label: '入力内容',
          placeholder: '埋め込む内容を入力'
        },
        typeMode: {
          label: '入力モード',
          options: {
            type: '逐次入力',
            fill: '直接入力'
          }
        },
        inputIntervalMs: {
          label: '入力間隔',
          input: {
            prefix: '固定',
            unit: '毫秒'
          }
        },
        randomInputInterval: {
          label: 'ランダム間隔'
        },
        inputIntervalMinMs: {
          label: '最小間隔（毫秒）',
          input: {
            prefix: '最小',
            unit: '毫秒'
          }
        },
        inputIntervalMaxMs: {
          label: '最大間隔（毫秒）',
          input: {
            prefix: '最大',
            unit: '毫秒'
          }
        },
        clearBefore: {
          label: '入力前にクリア'
        },
        optionMode: {
          label: '選択一致モード',
          options: {
            text: '表示テキスト',
            value: 'value',
            index: 'インデックス'
          }
        },
        optionValue: {
          label: '選択対象値',
          placeholder: '対象テキスト / value / インデックスを入力'
        },
        skipIfAlreadyState: {
          label: '既に目標状態ならスキップ'
        },
        eventName: {
          label: 'イベント名',
          placeholder: '発火するイベントを選択',
          options: {
            click: 'クリック click',
            dblclick: 'ダブルクリック dblclick',
            mousedown: '押下 mousedown',
            mouseup: '離す mouseup',
            mouseenter: '進入 mouseenter',
            mouseleave: '離脱 mouseleave',
            mousemove: '移動 mousemove',
            input: '入力 input',
            change: '変更 change',
            focus: 'フォーカス focus',
            blur: 'ブラー blur',
            keydown: 'キー押下 keydown',
            keyup: 'キー離し keyup',
            keypress: 'キー入力 keypress',
            submit: '送信 submit'
          }
        },
        bubbles: {
          label: 'バブリングを許可'
        },
        cancelable: {
          label: 'キャンセル可能'
        },
        key: {
          label: 'キー',
          addPart: 'キーを追加',
          removePart: '削除',
          preview: '現在の組み合わせ',
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
            ctrlA: 'Ctrl + A（すべて選択）',
            ctrlC: 'Ctrl + C（コピー）',
            ctrlV: 'Ctrl + V（貼り付け）',
            ctrlX: 'Ctrl + X（切り取り）',
            ctrlZ: 'Ctrl + Z（元に戻す）',
            ctrlY: 'Ctrl + Y（やり直し）',
            ctrlS: 'Ctrl + S（保存）',
            ctrlP: 'Ctrl + P（印刷）',
            ctrlF: 'Ctrl + F（検索）',
            ctrlR: 'Ctrl + R（再読み込み）',
            ctrlL: 'Ctrl + L（アドレスバー）',
            ctrlT: 'Ctrl + T（新しいタブ）',
            ctrlW: 'Ctrl + W（タブを閉じる）',
            ctrlShiftT: 'Ctrl + Shift + T（タブ復元）',
            ctrlShiftN: 'Ctrl + Shift + N（シークレットウィンドウ）',
            altTab: 'Alt + Tab（ウィンドウ切替）',
            altF4: 'Alt + F4（ウィンドウを閉じる）',
            shiftEnter: 'Shift + Enter',
            metaC: 'Meta + C（macOS コピー）',
            metaV: 'Meta + V（macOS 貼り付け）',
            metaS: 'Meta + S（macOS 保存）',
            metaZ: 'Meta + Z（macOS 元に戻す）'
          }
        },
        repeatCount: {
          label: '繰り返し回数'
        },
        pressDurationMs: {
          label: '押下時間（毫秒）'
        },
        simulateNativeInput: {
          label: '実機入力をシミュレート'
        }
      }
    },
    clickElement: {
      title: '要素をクリック',
      description: '対象要素をクリックします'
    },
    doubleClickElement: {
      title: '要素をダブルクリック',
      description: '対象要素をダブルクリックします'
    },
    hoverElement: {
      title: '要素にホバー',
      description: '要素上にマウスを置きます'
    },
    inputText: {
      title: 'テキスト入力',
      description: '文字ごとにテキストを入力します'
    },
    fillContent: {
      title: '内容を入力',
      description: 'フォーム値を直接入力します'
    },
    selectOption: {
      title: '選択肢を選択',
      description: 'ドロップダウンから選択します'
    },
    checkBox: {
      title: 'チェックボックスをオン',
      description: 'checkbox をオンにします'
    },
    uncheckBox: {
      title: 'チェックボックスをオフ',
      description: 'checkbox をオフにします'
    },
    focusElement: {
      title: '要素にフォーカス',
      description: '要素にフォーカスを当てます'
    },
    dispatchEvent: {
      title: 'イベント発火',
      description: '指定イベントを発火します'
    },
    pressKey: {
      title: 'キー入力',
      description: 'キーや組み合わせキーを再現します'
    }
  },
  mouse: {
    move: {
      title: 'マウス移動',
      description: '人間らしいパラメータで始点から終点へマウスを移動します',
      fields: {
        startX: {
          label: '開始 X',
          description: '開始位置の X 座標'
        },
        startY: {
          label: '開始 Y',
          description: '開始位置の Y 座標'
        },
        endX: {
          label: '終了 X',
          description: '目標位置の X 座標'
        },
        endY: {
          label: '終了 Y',
          description: '目標位置の Y 座標'
        },
        curveType: {
          label: '軌道カーブ',
          options: {
            linear: '直線',
            bezier: 'ベジェ',
            spline: 'スプライン'
          }
        },
        curveStrength: {
          label: 'カーブ強度',
          description: '軌道の曲がり具合'
        },
        randomCurveStrength: {
          label: 'カーブ強度をランダム化'
        },
        curveStrengthMin: {
          label: '最小カーブ強度'
        },
        curveStrengthMax: {
          label: '最大カーブ強度'
        },
        speedProfile: {
          label: '速度プロファイル',
          options: {
            linear: '一定速度',
            easeIn: '徐々に加速',
            easeOut: '徐々に減速',
            easeInOut: '加速後に減速'
          }
        },
        randomDuration: {
          label: '移動時間をランダム化'
        },
        durationMs: {
          label: '移動時間',
          description: '固定の移動時間'
        },
        durationMinMs: {
          label: '最短時間'
        },
        durationMaxMs: {
          label: '最長時間'
        },
        enableJitter: {
          label: '揺らぎを有効化'
        },
        jitterAmplitude: {
          label: '揺らぎ幅',
          description: '1 回あたりの最大オフセット'
        },
        randomJitterAmplitude: {
          label: '揺らぎ幅をランダム化'
        },
        jitterAmplitudeMin: {
          label: '最小揺らぎ幅'
        },
        jitterAmplitudeMax: {
          label: '最大揺らぎ幅'
        },
        jitterFrequency: {
          label: '揺らぎ頻度'
        },
        randomJitterFrequency: {
          label: '揺らぎ頻度をランダム化'
        },
        jitterFrequencyMin: {
          label: '最小揺らぎ頻度'
        },
        jitterFrequencyMax: {
          label: '最大揺らぎ頻度'
        }
      },
      outputs: {
        endX: {
          label: '最終 X',
          description: '移動完了時の X 座標'
        },
        endY: {
          label: '最終 Y',
          description: '移動完了時の Y 座標'
        },
        path: {
          label: '軌道ポイント',
          description: '完全な移動軌道の座標配列'
        }
      }
    }
  },
  scroll: {
    toPosition: {
      title: '位置へスクロール',
      description: '指定座標や要素へスクロールします',
      fields: {
        mode: {
          label: 'スクロール対象',
          options: {
            position: '座標位置',
            element: '対象要素'
          }
        },
        x: {
          label: '目標 X'
        },
        y: {
          label: '目標 Y'
        },
        behavior: {
          label: 'スクロール挙動',
          options: {
            auto: '自動',
            smooth: 'スムーズ'
          }
        },
        randomOffset: {
          label: 'ランダムオフセットを有効化'
        },
        offsetMin: {
          label: '最小オフセット'
        },
        offsetMax: {
          label: '最大オフセット'
        },
        timeoutMs: {
          label: 'タイムアウト（ミリ秒）'
        }
      }
    },
    intoView: {
      title: '表示領域へスクロール',
      description: '要素を表示領域へ入れます',
      fields: {
        behavior: {
          label: 'スクロール挙動',
          options: {
            auto: '自動',
            smooth: 'スムーズ'
          }
        },
        block: {
          label: '垂直位置'
        },
        inline: {
          label: '水平位置'
        },
        alignOptions: {
          start: '開始',
          center: '中央',
          end: '終了',
          nearest: '最近'
        },
        ensureVisible: {
          label: '最終的に可視状態を保証'
        },
        timeoutMs: {
          label: 'タイムアウト（ミリ秒）'
        }
      }
    },
    infinite: {
      title: '無限スクロール',
      description: '継続スクロールで追加内容を読み込みます',
      fields: {
        maxIterations: {
          label: '最大スクロール回数'
        },
        stepPx: {
          label: '1 回あたりのスクロール量'
        },
        intervalMs: {
          label: 'スクロール間隔（ミリ秒）'
        },
        behavior: {
          label: 'スクロール挙動',
          options: {
            auto: '自動',
            smooth: 'スムーズ'
          }
        },
        stopWhenNoChange: {
          label: '内容変化なしで早期停止'
        },
        maxNoChangeCount: {
          label: '最大無変化回数'
        }
      },
      outputs: {
        iterationCount: {
          label: '実スクロール回数',
          description: '今回実行で行われたスクロール回数'
        }
      }
    }
  },
  extract: {
    getText: {
      title: 'テキスト取得',
      description: '要素のテキストを取得します',
      fields: {
        textMode: {
          label: 'テキスト取得元',
          options: {
            innerText: 'innerText（可視テキスト）',
            textContent: 'textContent（生テキスト）'
          }
        },
        trim: {
          label: '前後の空白を除去'
        },
        normalizeWhitespace: {
          label: '連続空白を正規化'
        }
      },
      outputs: {
        text: {
          label: 'テキスト結果',
          description: '抽出されたテキスト内容'
        },
        lengthDescription: 'テキスト長',
        existsDescription: 'テキストが存在し空でないか'
      }
    },
    getAttribute: {
      title: '属性取得',
      description: '要素の指定属性を取得します',
      fields: {
        attributeName: {
          label: '属性名',
          placeholder: '例: href / src / data-id'
        },
        commonAttribute: {
          label: 'よく使う属性',
          options: {
            custom: 'カスタム入力'
          }
        },
        defaultValue: {
          label: 'デフォルト値',
          placeholder: '属性が無い場合に返す値（任意）'
        }
      },
      outputs: {
        value: {
          label: '属性値',
          description: '抽出された属性値'
        },
        existsDescription: '属性が存在するか'
      }
    },
    getHtml: {
      title: 'HTML 取得',
      description: 'innerHTML または outerHTML を取得します',
      fields: {
        htmlType: {
          label: 'HTML 種類',
          options: {
            outerHTML: 'outerHTML（自身タグを含む）',
            innerHTML: 'innerHTML（内部内容のみ）'
          }
        },
        normalizeWhitespace: {
          label: '連続空白を正規化'
        }
      },
      outputs: {
        html: {
          label: 'HTML 結果',
          description: '抽出された HTML 文字列'
        },
        lengthDescription: 'HTML 文字列の長さ'
      }
    },
    getValue: {
      title: '値取得',
      description: 'フォーム要素の値を取得します',
      fields: {
        valueType: {
          label: '値タイプ',
          options: {
            value: 'value（入力値）',
            checked: 'checked（チェック状態）',
            text: 'text（テキスト内容）'
          }
        },
        trim: {
          label: '前後の空白を除去'
        },
        parseNumber: {
          label: '数値として解析を試行'
        }
      },
      outputs: {
        value: {
          label: '生結果',
          description: '選択タイプに基づく生の抽出結果'
        },
        stringValue: {
          label: '文字列結果',
          description: '文字列としての結果'
        },
        numberValue: {
          label: '数値結果',
          description: '数値解析後の結果'
        }
      }
    },
    queryElement: {
      title: '要素セレクター（単体）',
      description: 'セレクターで単一要素を特定して出力します',
      pinDescriptions: {
        element: '取得した単一要素オブジェクト',
        exists: '要素を取得できたか'
      }
    },
    queryAllElements: {
      title: '要素セレクター（複数）',
      description: 'セレクターで要素一覧を特定して出力します',
      pinDescriptions: {
        elements: '一致した要素配列',
        length: '一致した要素数'
      }
    },
    queryBlocked: {
      title: 'ブロックページ判定',
      description: '現在のページが Cloudflare などのブロック/検証ページかどうかを判定してブール値を出力します',
      fields: {
        mode: {
          label: '判定方式',
          options: {
            auto: '自動判定',
            cloudflare: 'Cloudflare ブロック'
          }
        }
      },
      pinDescriptions: {
        blocked: 'ブロックページを検出したか'
      }
    },
    executeScript: {
      title: 'スクリプト実行',
      description: 'カスタム JS を実行して結果を返します',
      pinDescriptions: {
        script: 'スクリプト文字列の入力（下の入力欄を上書き）',
        result: 'スクリプトの実行結果',
        resultArray: '結果が配列ならループ/長さノードへ直接接続可能',
        resultLength: '結果が配列または文字列のときの長さ'
      },
      fields: {
        script: {
          label: 'JavaScript スクリプト',
          placeholder: '例：return document.title;'
        }
      }
    }
  },
  http: {
    request: {
      title: 'HTTP リクエスト',
      description: 'GET / POST などの純 HTTP を送信します',
      fields: {
        method: {
          label: 'リクエストメソッド'
        },
        url: {
          label: 'リクエスト URL',
          placeholder: '例: https://api.example.com/v1/items'
        },
        query: {
          label: 'クエリパラメータ',
          placeholder: '例：page=1&size=20',
          form: {
            keyPlaceholder: 'パラメータ名',
            valuePlaceholder: 'パラメータ値',
            add: 'パラメータ追加',
            remove: '削除'
          }
        },
        headers: {
          label: 'ヘッダー',
          placeholder: '例：Authorization: Bearer xxx',
          form: {
            keyPlaceholder: 'ヘッダー名',
            valuePlaceholder: 'ヘッダー値',
            add: 'ヘッダー追加',
            remove: '削除'
          },
          presets: {
            authorizationBearer: '定番: Authorization Bearer',
            contentTypeJson: '定番: Content-Type JSON',
            contentTypeFormUrlencoded: '定番: Content-Type Form',
            acceptJson: '定番: Accept JSON',
            acceptLanguageZhCn: '定番: Accept-Language Chinese',
            cacheControlNoCache: '定番: Cache-Control No-Cache',
            xRequestedWith: '定番: X-Requested-With Ajax',
            userAgentBrowser: '定番: User-Agent Browser'
          }
        },
        referer: {
          label: 'Referer',
          placeholder: '例: https://www.example.com/list'
        },
        cookie: {
          label: 'Cookie 文字列',
          placeholder: '例: session_id=abc123; theme=dark'
        },
        bodyType: {
          label: 'ボディタイプ',
          options: {
            none: 'なし',
            json: 'JSON',
            form: 'Form',
            text: 'Text'
          }
        },
        body: {
          label: 'リクエストボディ',
          placeholder: '選択したボディタイプに応じて入力',
          jsonInvalid: 'JSON 形式が不正です。内容を確認してください。',
          actions: {
            validate: 'JSON を検証',
            format: 'JSON を整形'
          },
          form: {
            keyPlaceholder: '項目名',
            valuePlaceholder: '項目値',
            add: '項目を追加',
            remove: '削除'
          }
        },
        timeoutMs: {
          label: 'タイムアウト（ミリ秒）'
        },
        retryCount: {
          label: 'リトライ回数'
        },
        followRedirect: {
          label: 'リダイレクトを追従'
        }
      },
      outputs: {
        response: {
          label: 'レスポンス結果',
          description: 'レスポンスボディデータ'
        },
        statusCode: {
          label: 'ステータスコード',
          description: 'HTTP ステータスコード'
        },
        ok: {
          label: '成功判定',
          description: 'ステータスが 2xx かどうか'
        },
        headers: {
          label: 'レスポンスヘッダー',
          description: 'レスポンスヘッダーオブジェクト'
        }
      }
    },
    getCookies: {
      title: 'Cookie を取得',
      description: '現在の Cookie を取得します',
      fields: {
        scope: {
          label: '取得範囲',
          options: {
            current: '現在のページ',
            domain: '指定ドメイン',
            all: 'すべて'
          }
        },
        domain: {
          label: 'ドメイン',
          placeholder: '例: example.com'
        },
        path: {
          label: 'パス',
          placeholder: '例: /account'
        },
        includeHttpOnly: {
          label: 'HttpOnly を含める'
        },
        includeSessionOnly: {
          label: 'Session Cookie を含める'
        },
        asString: {
          label: '文字列で出力'
        },
        timeoutMs: {
          label: 'タイムアウト（ミリ秒）'
        }
      },
      inputs: {
        contextDescription: '上流コンテキストにはページ、ドメイン、または現在のセッション情報を含められます'
      },
      outputs: {
        cookies: {
          label: 'Cookie 一覧',
          description: 'Cookie オブジェクトの一覧'
        },
        cookieString: {
          label: 'Cookie 文字列',
          description: 'セミコロン区切りの Cookie 文字列'
        },
        count: {
          label: '件数',
          description: 'Cookie の件数'
        }
      }
    },
    setCookies: {
      title: 'Cookie を設定',
      description: 'Cookie を設定または更新します',
      inputs: {
        cookieDescription: '上流ノードが単一の Cookie 文字列を出力する場合、編集欄の内容を直接置き換えられます'
      },
      fields: {
        mode: {
          label: '編集方式',
          options: {
            single: '単一文字列',
            pairs: '複数 Cookie'
          }
        },
        cookie: {
          label: 'Cookie 文字列',
          placeholder: '例: session_id=abc123; theme=dark'
        },
        pairs: {
          label: 'Cookie 一覧',
          nameLabel: 'Cookie 名',
          namePlaceholder: 'Cookie 名',
          valueLabel: 'Cookie 値',
          valuePlaceholder: 'Cookie 値',
          domainLabel: 'ドメイン',
          domainPlaceholder: '例: example.com',
          pathLabel: 'パス',
          pathPlaceholder: '例: /',
          add: 'Cookie を追加',
          remove: '削除',
          preset: {
            httpOnly: 'HttpOnly',
            secure: 'Secure',
            domain: 'Domain',
            path: 'Path',
            maxAge: 'Max-Age'
          }
        },
        scope: {
          label: '適用範囲',
          options: {
            current: '現在のページ',
            domain: '指定ドメイン',
            all: 'すべて'
          }
        },
        domain: {
          label: 'ドメイン',
          placeholder: '例: example.com'
        },
        path: {
          label: 'パス',
          placeholder: '例: /'
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
          label: '有効期限',
          placeholder: '日付と時刻を選択'
        },
        flags: {
          label: '追加フラグ'
        },
        httpOnly: {
          label: 'HttpOnly'
        },
        secure: {
          label: 'Secure'
        },
        persistent: {
          label: '永続化'
        }
      }
    }
  },
  system: {
    screenSize: {
      title: '画面サイズ取得',
      description: '画面の幅と高さを取得します',
      outputs: {
        width: {
          label: '画面幅',
          description: 'システム画面の幅（px）'
        },
        height: {
          label: '画面高',
          description: 'システム画面の高さ（px）'
        },
        size: {
          label: '画面サイズオブジェクト',
          description: '幅と高さを含む画面サイズオブジェクト'
        }
      }
    },
    windowSize: {
      title: 'ウィンドウサイズ取得',
      description: 'WebView のウィンドウサイズを取得します',
      outputs: {
        width: {
          label: 'ウィンドウ幅',
          description: 'WebView ウィンドウの幅（px）'
        },
        height: {
          label: 'ウィンドウ高',
          description: 'WebView ウィンドウの高さ（px）'
        },
        size: {
          label: 'ウィンドウサイズオブジェクト',
          description: '幅と高さを含むウィンドウサイズオブジェクト'
        }
      }
    },
    mousePosition: {
      title: 'マウス位置取得',
      description: 'マウス座標を WebView と画面の両方で取得します',
      fields: {
        outputScope: {
          label: '出力座標範囲',
          options: {
            both: 'WebView + 画面を同時出力',
            webview: 'WebView 座標のみ',
            screen: '画面座標のみ'
          }
        }
      },
      outputs: {
        webviewX: {
          label: 'WebView X',
          description: 'WebView 左上基準のマウス X 座標'
        },
        webviewY: {
          label: 'WebView Y',
          description: 'WebView 左上基準のマウス Y 座標'
        },
        screenX: {
          label: '画面 X',
          description: '画面左上基準のマウス X 座標'
        },
        screenY: {
          label: '画面 Y',
          description: '画面左上基準のマウス Y 座標'
        },
        webviewPoint: {
          label: 'WebView 座標オブジェクト',
          description: 'WebView 相対座標を含むオブジェクト'
        },
        screenPoint: {
          label: '画面座標オブジェクト',
          description: '画面絶対座標を含むオブジェクト'
        }
      }
    },
    elementPosition: {
      title: '要素位置取得',
      description: '要素位置を WebView と画面の両方で取得します',
      fields: {
        anchorPoint: {
          label: 'アンカーポイント',
          options: {
            topLeft: '左上',
            center: '中心'
          }
        },
        outputScope: {
          label: '出力座標範囲',
          options: {
            both: 'WebView + 画面を同時出力',
            webview: 'WebView 座標のみ',
            screen: '画面座標のみ'
          }
        }
      },
      outputs: {
        exists: {
          label: '要素存在',
          description: '対象要素が見つかったか'
        },
        webviewX: {
          label: 'WebView X',
          description: 'WebView 座標系での要素 X'
        },
        webviewY: {
          label: 'WebView Y',
          description: 'WebView 座標系での要素 Y'
        },
        screenX: {
          label: '画面 X',
          description: '画面座標系での要素 X'
        },
        screenY: {
          label: '画面 Y',
          description: '画面座標系での要素 Y'
        },
        rectWebview: {
          label: 'WebView 矩形',
          description: 'WebView 座標系の要素矩形オブジェクト'
        },
        rectScreen: {
          label: '画面矩形',
          description: '画面座標系の要素矩形オブジェクト'
        }
      }
    },
    readClipboard: {
      title: 'クリップボードを読む',
      description: 'システムのクリップボード内容を読み取ります',
      outputs: {
        text: {
          label: 'クリップボード文字列',
          description: '読み取ったクリップボード文字列'
        },
        length: {
          label: '文字数',
          description: 'クリップボード文字列の長さ'
        },
        hasText: {
          label: '文字列有無',
          description: 'クリップボードに文字列があるか'
        }
      }
    },
    writeClipboard: {
      title: 'クリップボードへ書き込む',
      description: '内容をシステムのクリップボードに書き込みます',
      inputs: {
        text: {
          label: '入力テキスト',
          description: '上流入力のテキストをそのままクリップボードへ書き込みます'
        }
      },
      fields: {
        text: {
          label: '書き込みテキスト',
          placeholder: 'クリップボードへ書き込むテキストを入力'
        }
      },
      outputs: {
        text: {
          label: '書き込み済みテキスト',
          description: '今回クリップボードへ書き込んだテキスト'
        }
      }
    }
  },
  variable: {
    common: {
      dataTypes: {
        string: '文字列',
        number: '数値',
        boolean: '真偽値',
        array: '配列',
        object: 'オブジェクト'
      }
    },
    set: {
      title: '変数を設定',
      description: '現在のキャンバスで共有する変数を定義し、その値を出力します',
      empty: {
        title: 'まだ変数が定義されていません',
        description: '変数を追加すると、それぞれに専用の入力ピンと出力ピンが作成されます。',
        action: '最初の変数を追加'
      },
      inputs: {
        value: {
          label: '入力値',
          description: '上流入力がこの変数のデフォルト値を上書きします'
        }
      },
      outputs: {
        value: {
          label: '変数値',
          description: 'この変数の最新値を出力します'
        }
      },
      fields: {
        name: {
          label: '変数名',
          placeholder: '例：username'
        },
        type: {
          label: 'データ型'
        },
        defaultValue: {
          label: 'デフォルト値',
          stringPlaceholder: 'デフォルトの文字列を入力',
          jsonPlaceholder: '有効な JSON をデフォルト値として入力'
        },
        connectedHint: {
          label: '上流入力が接続されているため、実行時は入力値が優先されます。',
          description: 'この変数は実行時に接続された入力ピンを優先し、デフォルト値は使用しません。'
        }
      },
      actions: {
        add: '変数を追加'
      },
      dialogs: {
        changeType: {
          title: '変数型の変更確認',
          description: '変数「{name}」には現在 {count} 本の関連エッジがあります。型を変更するとそれらの接続が切断されます。続行しますか？',
          confirm: '型を変更',
          cancel: 'キャンセル'
        }
      },
      validations: {
        nameRequired: '変数名は必須です',
        nameDuplicate: 'この変数名は現在のキャンバスですでに定義されています',
        arrayInvalid: 'デフォルト値は有効な配列 JSON である必要があります',
        objectInvalid: 'デフォルト値は有効なオブジェクト JSON である必要があります'
      }
    },
    get: {
      title: '変数を取得',
      description: '現在のキャンバスで定義済みの変数を選び、その値を出力します',
      empty: {
        title: 'このキャンバスにはまだ読み取れる変数がありません',
        description: '先に「変数を設定」ノードを配置して、少なくとも 1 つの変数を定義してください。'
      },
      fields: {
        variables: {
          label: '変数を選択',
          placeholder: '定義済みの変数を選択',
          description: '複数選択に対応しており、変数ごとに対応する型の出力ピンが生成されます。'
        }
      },
      inputs: {
        value: {
          description: '入力は選択した変数の現在値を上書きします（{type}）'
        }
      },
      outputs: {
        value: {
          description: '選択した変数の現在値を出力します（{type}）'
        }
      }
    }
  },
  constant: {
    get: {
      title: '定数',
      description: 'システム内蔵の定数値を出力します',
      pinDescriptions: {
        constantKey: '定数キー入力'
      },
      outputs: {
        value: {
          description: '選択した定数に対応する値'
        },
        constantKey: {
          label: '定数キー',
          description: '今回参照した定数キー名'
        }
      },
      fields: {
        constantKey: {
          label: '定数キー',
          options: {
            attachmentDir: '添付ディレクトリ（attachmentDir）'
          }
        }
      }
    }
  },
  logic: {
    equal: {
      title: '等しい',
      description: '2 つの値が等しいかを判定します',
      pinDescriptions: {
        operand: '比較値 {label}',
        result: '比較結果'
      }
    },
    notEqual: {
      title: '等しくない',
      description: '2 つの値が等しくないかを判定します',
      pinDescriptions: {
        operand: '比較値 {label}',
        result: '比較結果'
      }
    },
    greaterThan: {
      title: 'より大きい',
      description: 'a > b を判定します',
      pinDescriptions: {
        valueA: '数値 A',
        valueB: '数値 B',
        result: '比較結果'
      }
    },
    lessThan: {
      title: 'より小さい',
      description: 'a < b を判定します',
      pinDescriptions: {
        valueA: '数値 A',
        valueB: '数値 B',
        result: '比較結果'
      }
    },
    greaterThanOrEqual: {
      title: '以上',
      description: 'a ≥ b を判定します',
      pinDescriptions: {
        valueA: '数値 A',
        valueB: '数値 B',
        result: '比較結果'
      }
    },
    lessThanOrEqual: {
      title: '以下',
      description: 'a ≤ b を判定します',
      pinDescriptions: {
        valueA: '数値 A',
        valueB: '数値 B',
        result: '比較結果'
      }
    },
    and: {
      title: 'AND',
      description: '2 つの真偽値の論理積です',
      pinDescriptions: {
        valueA: '真偽値 A',
        valueB: '真偽値 B',
        result: '論理演算結果'
      }
    },
    or: {
      title: 'OR',
      description: '2 つの真偽値の論理和です',
      pinDescriptions: {
        valueA: '真偽値 A',
        valueB: '真偽値 B',
        result: '論理演算結果'
      }
    },
    not: {
      title: 'NOT',
      description: '論理否定（反転）です',
      pinDescriptions: {
        value: '真偽値入力',
        result: '論理演算結果'
      }
    },
    isEmpty: {
      title: '空かどうか',
      description: '値が空かどうかを判定します（null/undefined/空文字/空配列）',
      pinDescriptions: {
        value: '判定対象の値',
        result: '判定結果'
      }
    },
    exists: {
      title: '存在するか',
      description: '値が存在するかを判定します（null/undefined ではない）',
      pinDescriptions: {
        value: '判定対象の値',
        result: '判定結果'
      }
    }
  },
  math: {
    add: {
      title: '加算',
      description: '2 つの数値を足します',
      pinDescriptions: {
        operand: '加数 {label}',
        result: '加算結果'
      }
    },
    subtract: {
      title: '減算',
      description: '2 つの数値を引きます',
      pinDescriptions: {
        operand: '減数 {label}',
        result: '減算結果'
      }
    },
    multiply: {
      title: '乗算',
      description: '2 つの数値を掛けます',
      pinDescriptions: {
        operand: '乗数 {label}',
        result: '乗算結果'
      }
    },
    divide: {
      title: '除算',
      description: '2 つの数値を割ります',
      pinDescriptions: {
        operand: '除数 {label}',
        result: '除算結果'
      }
    },
    round: {
      title: '丸め',
      description: '切り下げ、切り上げ、四捨五入を行います',
      pinDescriptions: {
        input: '丸め対象の値',
        result: '丸め結果'
      },
      fields: {
        value: {
          label: '入力値'
        },
        mode: {
          label: '丸めモード',
          options: {
            round: '四捨五入',
            ceil: '切り上げ',
            floor: '切り下げ'
          }
        }
      }
    },
    random: {
      title: '乱数',
      description: '指定範囲の乱数を生成します',
      pinDescriptions: {
        min: '乱数の下限',
        max: '乱数の上限',
        result: '乱数結果'
      },
      fields: {
        numberType: {
          label: '乱数タイプ',
          options: {
            float: '小数',
            integer: '整数'
          }
        },
        intervalType: {
          label: '区間タイプ',
          options: {
            leftClosedRightOpen: '[min, max)',
            leftOpenRightClosed: '(min, max]',
            open: '(min, max)',
            closed: '[min, max]'
          },
          descriptions: {
            leftClosedRightOpen: '最小値を含み、最大値を含みません',
            leftOpenRightClosed: '最小値を含まず、最大値を含みます',
            open: '最小値と最大値の両方を含みません',
            closed: '最小値と最大値の両方を含みます'
          }
        },
        min: {
          label: '最小値（min）'
        },
        max: {
          label: '最大値（max）'
        }
      }
    },
    absolute: {
      title: '絶対値',
      description: '数値の絶対値を取得します',
      pinDescriptions: {
        input: '絶対値を求める入力値',
        result: '絶対値結果'
      },
      fields: {
        value: {
          label: '入力値'
        }
      }
    },
    modulo: {
      title: '剰余',
      description: 'a % b の余りを計算します',
      pinDescriptions: {
        valueA: '被除数 A',
        valueB: '除数 B',
        result: '剰余結果'
      },
      fields: {
        valueA: {
          label: '入力 A'
        },
        valueB: {
          label: '入力 B'
        }
      }
    },
    power: {
      title: '累乗',
      description: 'a の b 乗を計算します',
      pinDescriptions: {
        base: '底数',
        exp: '指数',
        result: '累乗結果'
      },
      fields: {
        base: {
          label: '底数 (base)'
        },
        exp: {
          label: '指数 (exp)'
        }
      }
    }
  },
  string: {
    common: {
      connectedInputHint: '入力が接続されています。接続値を使用します'
    },
    substring: {
      title: '部分文字列',
      description: '指定した位置からテキストを抽出する',
      pinDescriptions: {
        text: '抽出対象のテキスト',
        start: '開始位置（0始まり）',
        length: '抽出長',
        result: '抽出結果'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: 'ソーステキストを入力してください'
        },
        start: {
          label: '開始位置'
        },
        length: {
          label: '抽出長'
        }
      }
    },
    replace: {
      title: '置換',
      description: 'テキスト内の指定内容を検索して置換する（すべて置換）',
      pinDescriptions: {
        text: '元テキスト',
        search: '検索文字列（すべて置換）',
        replacement: '置換先',
        result: '置換結果'
      },
      fields: {
        text: {
          label: 'ソーステキスト',
          placeholder: 'ソーステキストを入力してください'
        },
        search: {
          label: '検索',
          placeholder: '検索するテキストを入力してください'
        },
        replacement: {
          label: '置換先',
          placeholder: '置換内容を入力してください'
        }
      }
    },
    concat: {
      title: '結合',
      description: '複数のテキストセグメントを結合する',
      pinDescriptions: {
        segment: 'テキストセグメント {label}',
        result: '結合結果'
      },
      fields: {
        segment: {
          label: 'テキスト {label}',
          placeholder: 'テキストセグメント {label}',
          count: '{count}段'
        }
      }
    },
    regexMatch: {
      title: '正規表現マッチ',
      description: '正規表現パターンを使用してテキストから一致を抽出する',
      pinDescriptions: {
        text: 'マッチ対象のテキスト',
        pattern: '正規表現パターン',
        flags: 'フラグ（g/i/m など）',
        result: 'マッチ結果配列'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: 'マッチするテキストを入力してください'
        },
        pattern: {
          label: '正規表現パターン',
          placeholder: '正規表現を入力してください（例: \\d+）'
        },
        flags: {
          label: 'フラグ',
          placeholder: 'フラグを入力してください（例: g、i、m）'
        }
      }
    },
    regexReplace: {
      title: '正規表現置換',
      description: '正規表現パターンを使用してテキストを検索して置換する',
      pinDescriptions: {
        text: '元テキスト',
        pattern: '正規表現パターン',
        replacement: '置換先（キャプチャグループ利用可）',
        flags: 'フラグ（g/i/m など）',
        result: '置換結果'
      },
      fields: {
        text: {
          label: 'ソーステキスト',
          placeholder: 'ソーステキストを入力してください'
        },
        pattern: {
          label: '正規表現パターン',
          placeholder: '正規表現パターンを入力してください'
        },
        replacement: {
          label: '置換先',
          placeholder: '置換内容を入力してください（キャプチャグループ $1、$2 などを使用可能）'
        },
        flags: {
          label: 'フラグ',
          placeholder: 'フラグを入力してください（例: g、i、m）'
        }
      }
    },
    split: {
      title: '分割',
      description: 'テキストを区切り文字で分割して配列にする',
      pinDescriptions: {
        text: '分割対象のテキスト',
        separator: '区切り文字',
        result: '分割結果配列'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: '分割するテキストを入力してください'
        },
        separator: {
          label: '区切り文字',
          placeholder: '区切り文字を入力してください（例: , または |）'
        }
      }
    },
    length: {
      title: '文字列の長さ',
      description: 'テキストの文字数を取得する',
      pinDescriptions: {
        text: '長さを計算するテキスト',
        result: 'テキストの文字数'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: '長さを計算するテキストを入力してください'
        }
      }
    },
    uppercase: {
      title: '大文字に変換',
      description: 'テキストを大文字に変換する',
      pinDescriptions: {
        text: '大文字に変換するテキスト',
        result: '大文字変換結果'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: '大文字に変換するテキストを入力してください'
        }
      }
    },
    lowercase: {
      title: '小文字に変換',
      description: 'テキストを小文字に変換する',
      pinDescriptions: {
        text: '小文字に変換するテキスト',
        result: '小文字変換結果'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: '小文字に変換するテキストを入力してください'
        }
      }
    },
    trim: {
      title: '空白を削除',
      description: 'テキストから空白文字を削除する',
      pinDescriptions: {
        text: '空白を削除するテキスト',
        result: '空白削除結果'
      },
      fields: {
        text: {
          label: 'テキスト',
          placeholder: '空白を削除するテキストを入力してください'
        },
        direction: {
          label: '削除方向'
        },
        whitespaceTypes: {
          label: '空白タイプ'
        }
      },
      options: {
        directionBoth: '両側',
        directionStart: '開始（左）',
        directionEnd: '終了（右）',
        directionAll: 'すべて',
        whitespaceSpace: 'スペース',
        whitespaceTab: 'タブ',
        whitespaceNewline: '改行',
        whitespaceCarriageReturn: 'キャリッジリターン',
        whitespaceVerticalTab: '垂直タブ',
        whitespaceFormFeed: 'フォームフィード'
      }
    }
  },
  dateTime: {
    now: {
      title: '現在時刻',
      description: '現在時刻を複数フォーマットで出力します',
      pinDescriptions: {
        outputMode: '出力モード入力'
      },
      outputs: {
        iso: {
          label: 'UTC ISO',
          description: 'UTC ISO 8601 文字列'
        },
        timestamp: {
          label: 'タイムスタンプ',
          description: 'Unix タイムスタンプ（ミリ秒）'
        },
        mode: {
          label: '出力モード',
          description: '現在選択されている出力モード'
        }
      },
      fields: {
        outputMode: {
          label: '出力モード',
          options: {
            isoUtc: 'UTC ISO 文字列',
            timestampMs: 'ミリ秒タイムスタンプ'
          }
        }
      }
    },
    format: {
      title: '日時の書式設定',
      description: '時刻値を指定形式で出力します',
      pinDescriptions: {
        value: '書式設定する時刻値',
        sourceMode: '入力元モード',
        formatPattern: '書式パターン入力'
      },
      outputs: {
        formatted: {
          label: '書式結果',
          description: 'パターンに従って整形した時刻文字列'
        },
        sourceMode: {
          label: '入力元モード',
          description: '現在有効な入力元モード'
        }
      },
      fields: {
        sourceMode: {
          label: '入力元',
          options: {
            current: '現在時刻',
            input: '入力値'
          }
        },
        formatPattern: {
          label: '書式パターン',
          placeholder: '例: YYYY-MM-DD HH:mm:ss'
        }
      }
    }
  },
  arrayObject: {
    filter: {
      title: 'データフィルタ',
      description: '配列をフィルタします',
      pinLabels: {
        removed: '除外数'
      },
      pinDescriptions: {
        array: 'フィルタ対象の配列を入力',
        path: '任意：フィルタに使うオブジェクトのフィールドパス',
        result: 'フィルタ後の配列結果',
        removed: '除外された項目数'
      },
      fields: {
        mode: {
          label: 'フィルタモード'
        },
        path: {
          label: 'フィルタパス',
          placeholder: '任意：フィールドパスを入力（例: data.value）'
        }
      },
      options: {
        modeTruthy: '真値のみ保持',
        modeNonEmpty: '空値を除外',
        modeDistinct: '重複除去（順序維持）'
      }
    },
    merge: {
      title: 'データマージ',
      description: '複数のデータソースを結合します',
      pinDescriptions: {
        source: 'データソース {label} を入力',
        result: '結合後の結果（配列またはオブジェクト）'
      },
      fields: {
        mode: {
          label: 'マージモード'
        },
        source: {
          label: 'データソース {label}',
          placeholder: '任意：JSON データを入力（配列またはオブジェクト）',
          count: '{count} 件のデータソース'
        }
      },
      options: {
        modeSmart: 'スマートマージ（自動判定）',
        modeArrayConcat: '配列連結',
        modeObjectAssign: 'オブジェクト上書き（後勝ち）'
      }
    },
    split: {
      title: 'データ分割',
      description: 'データを複数の枝に分けます',
      pinLabels: {
        size: 'チャンク',
        chunks: 'チャンク配列',
        first: '先頭項目',
        rest: '残り項目'
      },
      pinDescriptions: {
        array: '分割対象の配列を入力',
        size: 'チャンクサイズ入力（パネル設定を上書き）',
        chunks: 'チャンク単位に分割した配列結果',
        first: '配列の先頭項目',
        rest: '先頭を除いた残りの配列'
      },
      fields: {
        size: {
          label: 'チャンクサイズ'
        }
      }
    },
    length: {
      title: '配列長',
      description: '配列の長さを取得します',
      pinDescriptions: {
        array: '配列を入力して長さを出力',
        length: '配列の長さ'
      }
    },
    item: {
      title: '配列インデックス',
      description: '指定インデックスの値を取得します',
      pinDescriptions: {
        array: '配列を入力',
        index: 'インデックスを入力（パネル既定値を上書き）',
        item: 'インデックスに対応する値',
        exists: 'そのインデックスが存在するか'
      },
      fields: {
        index: {
          label: 'インデックス',
          placeholder: '取得する配列インデックスを入力してください'
        }
      }
    }
  },
  typeConvert: {
    string: {
      title: '文字列へ変換',
      description: '文字列型に変換します',
      hint: '任意の型のデータを文字列表現に変換します',
      inputs: {
        input: {
          description: '変換するデータ（任意の型）'
        }
      },
      outputs: {
        result: {
          description: '変換後の文字列'
        }
      },
      fields: {
        treatNullAsEmpty: {
          label: 'null を空文字列として扱う'
        }
      }
    },
    number: {
      title: '数値へ変換',
      description: '数値型に変換します',
      hint: '任意の型のデータを数値に変換します。変換に失敗した場合はデフォルト値を返します',
      inputs: {
        input: {
          description: '変換するデータ（任意の型）'
        }
      },
      outputs: {
        result: {
          description: '変換後の数値'
        }
      },
      fields: {
        defaultValue: {
          label: 'デフォルト値（変換失敗時）'
        }
      }
    },
    boolean: {
      title: '真偽値へ変換',
      description: '真偽値型に変換します',
      hint: '任意の型のデータをカスタムルールに基づいて真偽値に変換します',
      inputs: {
        input: {
          description: '変換するデータ（任意の型）'
        }
      },
      outputs: {
        result: {
          description: '変換後の真偽値'
        }
      },
      fields: {
        truthyValues: {
          label: '真値リスト（カンマ区切り）',
          placeholder: 'true,1,"yes","on"'
        }
      }
    },
    json: {
      title: 'JSON へ変換',
      description: 'JSON 文字列に変換します',
      hint: '任意の型のデータを JSON 文字列にシリアライズします',
      inputs: {
        input: {
          description: '変換するデータ（任意の型）'
        }
      },
      outputs: {
        result: {
          description: 'シリアライズされた JSON 文字列'
        },
        message: {
          description: '変換に失敗したときのエラーメッセージ'
        }
      },
      fields: {
        indent: {
          label: 'インデント幅（0 でインデントなし）'
        },
        handleCircular: {
          label: '循環参照を処理する'
        }
      }
    },
    parseJson: {
      title: 'JSON を解析',
      description: 'JSON 文字列を解析します',
      hint: 'JSON 文字列をデータオブジェクトにデシリアライズします。失敗時はフォールバック値を返します',
      inputs: {
        input: {
          description: '解析する JSON 文字列'
        }
      },
      outputs: {
        result: {
          description: '解析後のデータオブジェクト'
        },
        message: {
          description: '解析に失敗したときのエラーメッセージ'
        }
      },
      fields: {
        fallbackValue: {
          label: 'フォールバック値（解析失敗時）',
          placeholder: 'null'
        }
      }
    }
  },
  controlFlow: {
    loop: {
      title: 'ループ',
      description: 'ForEach / While ループです',
      pinDescriptions: {
        array: 'ForEach モードの配列入力',
        condition: 'While モードの継続条件入力',
        mode: 'ループモード入力（forEach / while）',
        limitIterations: '最大ループ回数を制限するか',
        maxIterations: '最大ループ回数入力',
        breakOnError: 'エラー時に中断するか'
      },
      outputs: {
        item: {
          description: '現在のループ項目'
        },
        index: {
          label: 'インデックス',
          description: '現在のループインデックス'
        }
      },
      fields: {
        mode: {
          label: 'ループモード',
          options: {
            forEach: 'ForEach（配列を順番に処理）',
            while: 'While（条件で繰り返し）'
          }
        },
        maxIterations: {
          label: '最大ループ回数'
        },
        limitIterations: {
          label: '最大ループ回数を制限',
          switchLabel: '制限を有効化',
          unlimited: '無制限'
        },
        breakOnError: {
          label: 'エラー時に中断する'
        }
      }
    },
    condition: {
      title: '条件分岐',
      description: '真偽値入力に応じて True / False に分岐します',
      pinDescriptions: {
        condition: '真偽値条件入力'
      },
      outputs: {
        true: {
          label: 'True 分岐',
          description: '条件が true のとき出力'
        },
        false: {
          label: 'False 分岐',
          description: '条件が false のとき出力'
        }
      },
      fields: {
        invert: {
          label: '反転',
          hint: '条件結果を反転します（有効時は true が false に変わります）'
        }
      }
    },
    switch: {
      title: '多分岐',
      description: 'Switch の多分岐制御です',
      pinDescriptions: {
        value: '一致判定する入力値',
        matchMode: '一致モード入力（strict / loose）',
        cases: '分岐リスト入力（改行区切り）',
        useDefaultBranch: 'デフォルト分岐を有効にするか'
      },
      outputs: {
        case: {
          description: '分岐 {label} が一致したとき出力'
        },
        default: {
          label: 'デフォルト分岐',
          description: 'どの分岐にも一致しないとき出力'
        }
      },
      fields: {
        matchMode: {
          label: '一致モード',
          options: {
            strict: '厳密一致（===）',
            loose: '緩い一致（==）'
          }
        },
        cases: {
          label: '分岐リスト（1 行 1 件）',
          placeholder: 'case_1\ncase_2'
        },
        useDefaultBranch: {
          label: 'デフォルト分岐を有効化'
        }
      }
    }
  },
  output: {
    saveData: {
      title: 'データ保存',
      description: 'データを指定タイプの保存先へ保存します',
      pinDescriptions: {
        value: '保存対象のデータ値',
        saveType: '保存タイプ入力'
      },
      outputs: {
        savedType: {
          label: '保存タイプ',
          description: '今回実際に保存したタイプ'
        }
      },
      fields: {
        saveType: {
          label: '保存タイプ',
          options: {
            music: '音楽',
            image: '画像'
          }
        }
      }
    },
    printLog: {
      title: 'ログ出力',
      description: 'デバッグ情報を出力します',
      pinDescriptions: {
        value: '出力するログ値',
        level: 'ログレベル入力',
        template: 'ログテンプレート入力'
      },
      fields: {
        level: {
          label: 'ログレベル',
          options: {
            debug: 'デバッグ',
            info: '情報',
            warn: '警告',
            error: 'エラー'
          }
        },
        template: {
          label: 'ログテンプレート',
          placeholder: '例：[crawler] 現在値：${value}'
        }
      }
    },
    playSound: {
      title: '通知音を再生',
      description: '固定の状態通知音を再生します',
      pinDescriptions: {
        kind: '通知音タイプ入力'
      },
      outputs: {
        kind: {
          label: '通知音タイプ',
          description: '実際に再生した通知音タイプ'
        }
      },
      fields: {
        kind: {
          label: '通知音タイプ',
          options: {
            info: '情報',
            success: '成功',
            warning: '警告',
            error: 'エラー'
          }
        }
      }
    },
    sendEmail: {
      title: 'メール送信',
      description: '既存のデスクトップメール API を再利用して送信します',
      pinDescriptions: {
        to: '宛先入力',
        subject: '件名入力',
        text: '本文入力'
      },
      outputs: {
        count: {
          label: '宛先数',
          description: '実際に送信された宛先数'
        }
      },
      fields: {
        to: {
          label: '宛先',
          placeholder: 'メールアドレスを入力してください。複数指定は改行またはカンマ区切りです'
        },
        subject: {
          label: '件名',
          placeholder: 'メールの件名を入力してください'
        },
        text: {
          label: '本文',
          placeholder: 'メール本文を入力してください'
        }
      }
    },
    screenshot: {
      title: 'スクリーンショット',
      description: 'ページや要素をキャプチャします',
      pinDescriptions: {
        element: '対象要素（element モード）',
        targetMode: '撮影対象モード入力',
        path: '保存先パス入力',
        fullPage: 'フルページ撮影スイッチ入力'
      },
      outputs: {
        path: {
          label: '保存パス',
          description: 'スクリーンショットの保存パスまたは URL'
        }
      },
      fields: {
        targetMode: {
          label: '撮影対象',
          options: {
            page: 'ページ全体',
            element: '要素'
          }
        },
        path: {
          label: '保存先パス',
          placeholder: '例：/screenshots/news-item.png'
        },
        fullPage: {
          label: 'フルページ撮影'
        }
      }
    }
  }
};
