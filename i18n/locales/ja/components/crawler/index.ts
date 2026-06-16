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
      mouse: {
        title: '人間らしいマウス操作',
        description: 'より自然なマウス移動軌跡を再現します'
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
      detect: {
        title: '検出と防御',
        description: '検証ページや一般的な保護ページを検出します'
      },
      system: {
        title: 'システムとウィンドウ',
        description: '画面、ウィンドウ、クリップボード情報を読み取ります'
      },
      variable: {
        title: 'データ処理 - 変数',
        description: 'ノード間で共有する変数を保存・取得します'
      },
      logic: {
        title: 'データ処理 - ロジック',
        description: '比較、真偽値、空判定を行います'
      },
      math: {
        title: 'データ処理 - 数学',
        description: '基本計算、乱数、丸め処理です'
      },
      string: {
        title: 'データ処理 - 文字列',
        description: '文字列の切り出し、置換、結合、正規表現です'
      },
      arrayObject: {
        title: 'データ処理 - 配列とオブジェクト',
        description: 'フィルタ、マージ、分割、インデックス取得です'
      },
      typeConvert: {
        title: 'データ処理 - 型変換',
        description: '文字列、数値、真偽値、JSON 変換です'
      },
      controlFlow: {
        title: '制御フロー',
        description: 'ループ、条件分岐、複数分岐です'
      },
      output: {
        title: '出力',
        description: '送信、ログ、スクリーンショットの出力です'
      }
    },
    nodes: {
      common: {
        start: {
          title: '開始',
          description: 'クローラーの実行を開始する入口ノード'
        },
        end: {
          title: '終了',
          description: 'クローラーの実行を終了する終端ノード'
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
              placeholder: '遷移先パスを入力（例: /news/123）'
            },
            waitReady: {
              label: 'ページ準備完了を待機'
            },
            timeoutMs: {
              label: 'タイムアウト（ms）'
            }
          }
        },
        refresh: {
          title: 'ページを更新',
          description: '現在のページを更新します',
          fields: {
            waitReady: {
              label: 'ページ準備完了を待機'
            },
            timeoutMs: {
              label: 'タイムアウト（ms）'
            },
            hardReload: {
              label: 'ハードリロード'
            }
          }
        },
        back: {
          title: '戻る',
          description: 'ブラウザ履歴を戻ります',
          fields: {
            steps: {
              label: '戻るステップ数'
            },
            waitReady: {
              label: 'ページ準備完了を待機'
            },
            timeoutMs: {
              label: 'タイムアウト（ms）'
            },
            allowNoHistory: {
              label: '履歴なしエラーを無視'
            }
          }
        },
        forward: {
          title: '進む',
          description: 'ブラウザ履歴を進みます',
          fields: {
            steps: {
              label: '進むステップ数'
            },
            waitReady: {
              label: 'ページ準備完了を待機'
            },
            timeoutMs: {
              label: 'タイムアウト（ms）'
            },
            allowNoHistory: {
              label: '履歴なしエラーを無視'
            }
          }
        },
        closePage: {
          title: 'ページを閉じる',
          description: '現在のページセッションを閉じます',
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
          description: '対象要素の出現を待ちます'
        },
        time: {
          title: '時間待機',
          description: '指定ミリ秒だけ待機します'
        },
        random: {
          title: 'ランダム待機',
          description: '最小値と最大値の間でランダムに待機します'
        },
        loadState: {
          title: '読み込み状態を待機',
          description: 'ページの読み込み状態を待機します'
        },
        condition: {
          title: '条件を待機',
          description: 'カスタム JS 条件が成立するまで待機します'
        },
        text: {
          title: 'テキストを待機',
          description: '指定テキストの出現を待ちます'
        },
        delay: {
          title: 'ディレイ',
          description: '純粋な遅延待機です'
        }
      },
      interaction: {
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
          description: '指定座標へマウスを移動します'
        },
        curve: {
          title: 'マウス曲線',
          description: '移動に曲線軌跡を追加します'
        },
        accel: {
          title: 'マウス加減速',
          description: '移動に加速・減速を追加します'
        },
        jitter: {
          title: 'マウスジッター',
          description: 'ランダムな揺らぎを追加します'
        },
        duration: {
          title: 'マウス移動時間',
          description: '移動の総時間を設定します'
        }
      },
      scroll: {
        toPosition: {
          title: '位置へスクロール',
          description: '指定座標や要素へスクロールします'
        },
        intoView: {
          title: '表示領域へスクロール',
          description: '要素を表示領域へ入れます'
        },
        infinite: {
          title: '無限スクロール',
          description: '継続スクロールで追加内容を読み込みます'
        }
      },
      extract: {
        getText: {
          title: 'テキスト取得',
          description: '要素のテキストを取得します'
        },
        getAttribute: {
          title: '属性取得',
          description: '要素の指定属性を取得します'
        },
        getHtml: {
          title: 'HTML 取得',
          description: 'innerHTML または outerHTML を取得します'
        },
        getValue: {
          title: '値取得',
          description: 'フォーム要素の値を取得します'
        },
        queryElement: {
          title: '要素検索',
          description: '単一要素を検索します'
        },
        queryAllElements: {
          title: '全要素検索',
          description: '複数要素を検索して一覧で返します'
        },
        executeScript: {
          title: 'スクリプト実行',
          description: 'カスタム JS を実行して結果を返します'
        }
      },
      http: {
        request: {
          title: 'HTTP リクエスト',
          description: 'GET / POST などの純 HTTP を送信します'
        },
        getCookies: {
          title: 'Cookie を取得',
          description: '現在の Cookie を取得します'
        },
        setCookies: {
          title: 'Cookie を設定',
          description: 'Cookie を設定します'
        }
      },
      detect: {
        verification: {
          title: '検証を検出',
          description: '検証ページの表示を検出します'
        }
      },
      system: {
        screenSize: {
          title: '画面サイズ取得',
          description: '画面の幅と高さを取得します'
        },
        windowSize: {
          title: 'ウィンドウサイズ取得',
          description: 'WebView のウィンドウサイズを取得します'
        },
        mousePosition: {
          title: 'マウス位置設定',
          description: 'マウスの初期位置を設定します'
        },
        readClipboard: {
          title: 'クリップボードを読む',
          description: 'システムのクリップボード内容を読み取ります'
        },
        writeClipboard: {
          title: 'クリップボードへ書き込む',
          description: '内容をシステムのクリップボードに書き込みます'
        }
      },
      variable: {
        set: {
          title: '変数を設定',
          description: 'データを変数に保存します'
        },
        get: {
          title: '変数を取得',
          description: '変数の値を読み取ります'
        }
      },
      logic: {
        equal: {
          title: '等しい',
          description: '2 つの値が等しいかを判定します'
        },
        notEqual: {
          title: '等しくない',
          description: '2 つの値が等しくないかを判定します'
        },
        greaterThan: {
          title: 'より大きい',
          description: 'a > b を判定します'
        },
        lessThan: {
          title: 'より小さい',
          description: 'a < b を判定します'
        },
        greaterThanOrEqual: {
          title: '以上',
          description: 'a ≥ b を判定します'
        },
        lessThanOrEqual: {
          title: '以下',
          description: 'a ≤ b を判定します'
        },
        and: {
          title: 'AND',
          description: '2 つの真偽値の論理積です'
        },
        or: {
          title: 'OR',
          description: '2 つの真偽値の論理和です'
        },
        not: {
          title: 'NOT',
          description: '論理否定（反転）です'
        },
        isEmpty: {
          title: '空かどうか',
          description: '値が空かどうかを判定します（null/undefined/空文字/空配列）'
        },
        exists: {
          title: '存在するか',
          description: '値が存在するかを判定します（null/undefined ではない）'
        }
      },
      math: {
        add: {
          title: '加算',
          description: '2 つの数値を足します'
        },
        subtract: {
          title: '減算',
          description: '2 つの数値を引きます'
        },
        multiply: {
          title: '乗算',
          description: '2 つの数値を掛けます'
        },
        divide: {
          title: '除算',
          description: '2 つの数値を割ります'
        },
        round: {
          title: '丸め',
          description: '切り下げ、切り上げ、四捨五入を行います'
        },
        random: {
          title: '乱数',
          description: '指定範囲の乱数を生成します'
        },
        absolute: {
          title: '絶対値',
          description: '数値の絶対値を取得します'
        },
        modulo: {
          title: '剰余',
          description: 'a % b の余りを計算します'
        },
        power: {
          title: '累乗',
          description: 'a の b 乗を計算します'
        }
      },
      string: {
        substring: {
          title: '文字列切り出し',
          description: '文字列の一部を切り出します'
        },
        replace: {
          title: '文字列置換',
          description: '文字列の内容を置き換えます'
        },
        concat: {
          title: '文字列結合',
          description: '複数の文字列を結合します'
        },
        regexMatch: {
          title: '正規表現マッチ',
          description: '正規表現でマッチします'
        },
        regexReplace: {
          title: '正規表現置換',
          description: '正規表現で置き換えます'
        },
        split: {
          title: '文字列分割',
          description: '区切り文字で文字列を分割します'
        },
        length: {
          title: '文字列長',
          description: '文字列の長さを取得します'
        },
        uppercase: {
          title: '大文字化',
          description: '大文字に変換します'
        },
        lowercase: {
          title: '小文字化',
          description: '小文字に変換します'
        },
        trim: {
          title: '空白除去',
          description: '文字列の前後空白を除去します'
        }
      },
      arrayObject: {
        filter: {
          title: 'データフィルタ',
          description: '配列をフィルタします'
        },
        merge: {
          title: 'データマージ',
          description: '複数のデータソースを結合します'
        },
        split: {
          title: 'データ分割',
          description: 'データを複数の枝に分けます'
        },
        length: {
          title: '配列長',
          description: '配列の長さを取得します'
        },
        item: {
          title: '配列インデックス',
          description: '指定インデックスの値を取得します'
        }
      },
      typeConvert: {
        string: {
          title: '文字列へ変換',
          description: '文字列型に変換します'
        },
        number: {
          title: '数値へ変換',
          description: '数値型に変換します'
        },
        boolean: {
          title: '真偽値へ変換',
          description: '真偽値型に変換します'
        },
        json: {
          title: 'JSON へ変換',
          description: 'JSON 文字列に変換します'
        },
        parseJson: {
          title: 'JSON を解析',
          description: 'JSON 文字列を解析します'
        }
      },
      controlFlow: {
        loop: {
          title: 'ループ',
          description: 'ForEach / While ループです'
        },
        condition: {
          title: '条件分岐',
          description: 'If / Else 分岐です'
        },
        switch: {
          title: '多分岐',
          description: 'Switch の多分岐制御です'
        }
      },
      output: {
        sendToApi: {
          title: 'API へ送信',
          description: 'データを専用 API に送信します'
        },
        printLog: {
          title: 'ログ出力',
          description: 'デバッグ情報を出力します'
        },
        screenshot: {
          title: 'スクリーンショット',
          description: 'ページや要素をキャプチャします'
        }
      }
    }
  }
};
