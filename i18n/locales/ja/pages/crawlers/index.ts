export const crawlers = {
  title: 'クローラー',
  search: {
    header: {
      title: 'クローラーを検索',
      startLabel: 'クリックしてクローラーを検索',
      conditions: '検索条件が設定されています'
    },
    body: {
      keyword: {
        placeholder: 'サイト名または説明を検索'
      },
      enabled: {
        placeholder: '有効状態で絞り込む'
      }
    }
  },
  targets: {
    title: 'サイト',
    add: 'サイトを追加',
    edit: 'サイトを編集',
    addTask: 'タスクを追加',
    menu: {
      open: 'サイトを開く',
      copyDomain: 'ドメインをコピー',
      copyBaseUrl: 'サイトURLをコピー'
    },
    empty: {
      title: '対象サイトがありません',
      description: 'クローラー対象サイトが追加されていません。上のボタンをクリックして追加してください。'
    },
    form: {
      name: {
        label: 'サイト名',
        placeholder: 'サイト名を入力',
        verify: {
          required: 'サイト名は必須です',
          length: 'サイト名は255文字以内で入力してください'
        }
      },
      domain: {
        label: 'ドメイン',
        placeholder: 'ドメインを入力（例：weibo.com）',
        verify: {
          required: 'ドメインは必須です',
          length: 'ドメインは255文字以内で入力してください',
          pattern: 'ドメイン形式が不正です'
        }
      },
      baseUrl: {
        label: 'ベースURL',
        placeholder: 'サイトのドメインを入力（例：weibo.com）',
        verify: {
          required: 'ベースURLは必須です',
          length: 'ベースURLは255文字以内です',
          pattern: 'URL形式が不正です'
        }
      },
      description: {
        label: '説明',
        placeholder: '説明を入力'
      },
      isEnabled: {
        label: '有効'
      },
      unique: {
        checking: '一意性を確認中...',
        domainExists: 'このドメインは既に存在します'
      }
    }
  },
  blueprint: {
    drawer: {
      title: 'クローラーロジック',
      description: '左側でノードを選び、右側でクローラーフローを組み立てます。'
    },
    nodes: {
      groups: {
        recent: {
          title: '最近使用したノード',
          description: '最近挿入したノードへすばやくアクセスします。'
        },
        flow: {
          title: 'フロー制御',
          description: '開始点、分岐、実行順を組み立てます。'
        },
        request: {
          title: 'ネットワークリクエスト',
          description: 'リクエスト送信とレスポンス処理を行います。'
        },
        parser: {
          title: 'データ解析',
          description: 'ページや構造化データから内容を抽出します。'
        },
        logic: {
          title: 'ロジックと変数',
          description: '条件分岐、型ノード、ループを使います。'
        },
        debug: {
          title: 'デバッグと補助',
          description: 'ログ、プレビュー、再試行を使います。'
        },
        array: {
          title: '配列操作',
          description: '配列の追加、削除、検索、並び替えを行います。'
        },
        string: {
          title: '文字列操作',
          description: '文字列の切り出し、置換、整形を行います。'
        },
        object: {
          title: 'オブジェクト操作',
          description: 'オブジェクトのプロパティ読み書きと結合を行います。'
        },
        math: {
          title: '数学演算',
          description: '数値計算とランダム処理を行います。'
        },
        convert: {
          title: '型変換',
          description: '異なるデータ型の相互変換を行います。'
        },
        compare: {
          title: '比較演算',
          description: '大小、等価、不等価の比較を行います。'
        },
        logicOp: {
          title: '論理演算',
          description: 'AND、OR、NOT、null 合体演算を行います。'
        },
        function: {
          title: '関数ノード',
          description: '関数の定義、呼び出し、戻り値を扱います。'
        },
        storage: {
          title: 'データ保存',
          description: 'ファイル書き込みとデータ送信を行います。'
        },
        delay: {
          title: '遅延と待機',
          description: '固定待機、ランダム待機、条件待機を行います。'
        },
        antiBot: {
          title: '反ボット処理',
          description: 'リクエスト偽装とチャレンジページ検出を行います。'
        },
        helper: {
          title: '補助機能',
          description: '時刻、ID、ハッシュなどの共通機能を扱います。'
        },
        browser: {
          title: 'ブラウザ自動化',
          description: 'ページ遷移、スクリーンショット、タブ制御を行います。'
        },
        element: {
          title: '要素操作',
          description: 'クリック、入力、ドラッグ、スクロールを行います。'
        },
        elementWait: {
          title: '要素の待機と検出',
          description: '要素の待機、判定、状態取得を行います。'
        },
        form: {
          title: 'フォーム処理',
          description: 'フォームの入力、送信、検証を行います。'
        },
        context: {
          title: 'ブラウザコンテキスト',
          description: 'タブ、Frame、ダイアログを制御します。'
        },
        cookie: {
          title: 'Cookie とストレージ',
          description: 'Cookie とローカルストレージの読み書きを行います。'
        },
        network: {
          title: 'ネットワークと遮断',
          description: 'ネットワークリクエストの遮断、変更、確認を行います。'
        },
        js: {
          title: 'JavaScript 実行',
          description: 'ページスクリプトの実行と注入を行います。'
        }
      },
      nodes: {
        flow: {
          start: {
            title: '開始ノード',
            description: '初期パラメータを持つ実行入口です。'
          },
          end: {
            title: '終了ノード',
            description: '最終結果を返す実行終点です。'
          },
          sequence: {
            title: '順次実行',
            description: '複数の子フローを順番に接続します。'
          },
          branch: {
            title: '分岐選択',
            description: '条件に応じて実行分岐を切り替えます。'
          },
          parallel: {
            title: '並列実行',
            description: '複数の子フローを同時に実行します。'
          }
        },
        request: {
          get: {
            title: 'GET リクエスト',
            description: 'HTTP GET リクエストを送信します。'
          },
          post: {
            title: 'POST リクエスト',
            description: 'HTTP POST リクエストを送信します。'
          },
          config: {
            title: 'リクエスト設定',
            description: 'ヘッダー、Cookie、プロキシを設定します。'
          },
          parse: {
            title: 'レスポンス解析',
            description: 'JSON、HTML、XML のレスポンスを解析します。'
          },
          put: {
            title: 'PUT リクエスト',
            description: 'HTTP PUT リクエストを送信します。'
          },
          delete: {
            title: 'DELETE リクエスト',
            description: 'HTTP DELETE リクエストを送信します。'
          },
          download: {
            title: 'ファイルダウンロード',
            description: 'ファイルをローカルにダウンロードします。'
          },
          upload: {
            title: 'ファイルアップロード',
            description: 'ファイルをサーバーへアップロードします。'
          },
          session: {
            title: 'セッション管理',
            description: 'ログイン状態と Cookie を管理します。'
          }
        },
        parser: {
          css: {
            title: 'CSS セレクタ',
            description: 'HTML から要素を抽出します。'
          },
          json: {
            title: 'JSON 解析',
            description: 'JSON データからフィールドを取得します。'
          },
          list: {
            title: 'リスト抽出',
            description: 'ページング処理を含めてリストを展開します。'
          },
          attr: {
            title: '属性抽出',
            description: 'src、href などの属性を抽出します。'
          },
          xpath: {
            title: 'XPath セレクタ',
            description: 'XPath で XML / HTML データを抽出します。'
          },
          regex: {
            title: '正規表現',
            description: '正規表現で文字列を抽出します。'
          },
          text: {
            title: 'HTML をテキスト化',
            description: 'HTML をプレーンテキストに変換します。'
          },
          table: {
            title: 'テーブル解析',
            description: 'HTML テーブルデータを解析します。'
          }
        },
        logic: {
          boolean: {
            title: 'Boolean',
            description: '真偽値ノードです。'
          },
          string: {
            title: 'String',
            description: '文字列ノードです。'
          },
          ifElse: {
            title: 'if-else',
            description: '2 分岐の条件判定です。'
          },
          loop: {
            title: 'for',
            description: '要素数や集合を繰り返し処理します。'
          },
          integer: {
            title: 'Integer',
            description: '整数値ノードです。'
          },
          float: {
            title: 'Float',
            description: '浮動小数点値ノードです。'
          },
          array: {
            title: 'Array',
            description: '配列ノードです。'
          },
          object: {
            title: 'Object',
            description: 'オブジェクトノードです。'
          },
          null: {
            title: 'Null',
            description: 'null 値ノードです。'
          },
          get: {
            title: '変数取得',
            description: '変数の値を読み取ります。'
          },
          set: {
            title: '変数設定',
            description: '変数の値を書き込みます。'
          },
          if: {
            title: 'if',
            description: '単分岐の条件判定です。'
          },
          switch: {
            title: 'switch',
            description: '多分岐の選択です。'
          }
        },
        debug: {
          log: {
            title: 'ログ出力',
            description: 'デバッグ情報を出力します。'
          },
          preview: {
            title: 'データプレビュー',
            description: '現在のノード出力を確認します。'
          },
          retry: {
            title: '再試行機構',
            description: '失敗時に自動で再試行します。'
          }
        },
        array: {
          push: {
            title: 'push',
            description: '配列の末尾に要素を追加します。'
          },
          pop: {
            title: 'pop',
            description: '配列の最後の要素を削除します。'
          },
          slice: {
            title: 'slice',
            description: '配列の一部を切り出します。'
          },
          concat: {
            title: 'concat',
            description: '配列を結合します。'
          },
          join: {
            title: 'join',
            description: '配列を文字列に変換します。'
          },
          get: {
            title: 'get',
            description: 'インデックスで要素を取得します。'
          },
          indexOf: {
            title: 'indexOf',
            description: '要素のインデックスを検索します。'
          },
          includes: {
            title: 'includes',
            description: '要素の存在を確認します。'
          },
          find: {
            title: 'find',
            description: '条件に一致する要素を検索します。'
          },
          filter: {
            title: 'filter',
            description: '配列要素を絞り込みます。'
          },
          map: {
            title: 'map',
            description: '配列要素を変換します。'
          },
          reduce: {
            title: 'reduce',
            description: '配列を集約計算します。'
          },
          sort: {
            title: 'sort',
            description: '配列を並び替えます。'
          },
          length: {
            title: 'length',
            description: '配列の長さを取得します。'
          }
        },
        string: {
          charAt: {
            title: 'charAt',
            description: '指定位置の文字を取得します。'
          },
          includes: {
            title: 'includes',
            description: '部分文字列を含むか確認します。'
          },
          slice: {
            title: 'slice',
            description: '文字列の一部を切り出します。'
          },
          split: {
            title: 'split',
            description: '文字列を配列に分割します。'
          },
          replace: {
            title: 'replace',
            description: '文字列を置換します。'
          },
          trim: {
            title: 'trim',
            description: '前後の空白を削除します。'
          },
          toLowerCase: {
            title: 'toLowerCase',
            description: '小文字に変換します。'
          },
          toUpperCase: {
            title: 'toUpperCase',
            description: '大文字に変換します。'
          },
          repeat: {
            title: 'repeat',
            description: '文字列を繰り返します。'
          },
          padStart: {
            title: 'padStart',
            description: '先頭を埋めます。'
          },
          padEnd: {
            title: 'padEnd',
            description: '末尾を埋めます。'
          },
          length: {
            title: 'length',
            description: '文字列の長さを取得します。'
          }
        },
        object: {
          get: {
            title: 'プロパティ取得',
            description: 'オブジェクトのプロパティを読み取ります。'
          },
          set: {
            title: 'プロパティ設定',
            description: 'オブジェクトのプロパティを書き込みます。'
          },
          delete: {
            title: 'プロパティ削除',
            description: 'オブジェクトのプロパティを削除します。'
          },
          keys: {
            title: 'keys',
            description: 'キー一覧を取得します。'
          },
          values: {
            title: 'values',
            description: '値一覧を取得します。'
          },
          entries: {
            title: 'entries',
            description: 'キーと値の一覧を取得します。'
          },
          assign: {
            title: 'assign',
            description: 'オブジェクトを結合します。'
          },
          hasOwnProperty: {
            title: 'hasOwnProperty',
            description: '自身のプロパティか確認します。'
          },
          create: {
            title: 'オブジェクト作成',
            description: '新しいオブジェクトを作成します。'
          }
        },
        math: {
          add: {
            title: '加算 (+)',
            description: '数値を加算します。'
          },
          subtract: {
            title: '減算 (-)',
            description: '数値を減算します。'
          },
          multiply: {
            title: '乗算 (*)',
            description: '数値を乗算します。'
          },
          divide: {
            title: '除算 (/)',
            description: '数値を除算します。'
          },
          mod: {
            title: '剰余 (%)',
            description: '剰余計算を行います。'
          },
          pow: {
            title: 'べき乗 (**)',
            description: '指数計算を行います。'
          },
          random: {
            title: 'Math.random',
            description: '乱数を生成します。'
          },
          max: {
            title: 'Math.max',
            description: '最大値を取得します。'
          },
          min: {
            title: 'Math.min',
            description: '最小値を取得します。'
          }
        },
        convert: {
          parseInt: {
            title: 'parseInt',
            description: '文字列を整数に変換します。'
          },
          parseFloat: {
            title: 'parseFloat',
            description: '文字列を小数に変換します。'
          },
          number: {
            title: 'Number',
            description: '数値に変換します。'
          },
          string: {
            title: 'String',
            description: '文字列に変換します。'
          },
          boolean: {
            title: 'Boolean',
            description: '真偽値に変換します。'
          },
          toString: {
            title: 'toString',
            description: 'オブジェクトを文字列に変換します。'
          },
          typeof: {
            title: 'typeof',
            description: '型を取得します。'
          },
          instanceof: {
            title: 'instanceof',
            description: '型を確認します。'
          }
        },
        compare: {
          eq: {
            title: '==',
            description: '値が等しい（緩い比較）'
          },
          eqStrict: {
            title: '===',
            description: '値と型が等しい'
          },
          ne: {
            title: '!=',
            description: '値が等しくない'
          },
          neStrict: {
            title: '!==',
            description: '値または型が等しくない'
          },
          gt: {
            title: '>',
            description: 'より大きい比較'
          },
          gte: {
            title: '>=',
            description: '以上の比較'
          },
          lt: {
            title: '<',
            description: 'より小さい比較'
          },
          lte: {
            title: '<=',
            description: '以下の比較'
          }
        },
        logicOp: {
          and: {
            title: '&&',
            description: '論理 AND'
          },
          or: {
            title: '||',
            description: '論理 OR'
          },
          not: {
            title: '!',
            description: '論理 NOT'
          },
          nullish: {
            title: '??',
            description: 'null 合体演算'
          },
          optional: {
            title: '?.',
            description: 'オプショナルチェーン'
          }
        },
        function: {
          define: {
            title: '関数定義',
            description: 'function 宣言またはアロー関数'
          },
          call: {
            title: '関数呼び出し',
            description: '関数を実行します。'
          },
          return: {
            title: '戻り値',
            description: 'return で結果を返します。'
          },
          params: {
            title: '引数受け渡し',
            description: '関数の引数を渡します。'
          },
          arrow: {
            title: 'アロー関数',
            description: 'アロー関数です。'
          }
        },
        storage: {
          writeFile: {
            title: 'ファイル書き込み',
            description: 'データを一時ファイルに書き込みます。'
          },
          readFile: {
            title: 'ファイル読み込み',
            description: 'ローカルファイルのデータを読み込みます。'
          },
          submit: {
            title: 'データ送信',
            description: 'API 経由でバックエンドへ送信します。'
          }
        },
        delay: {
          fixed: {
            title: '固定遅延',
            description: '一定時間待機します。'
          },
          random: {
            title: 'ランダム遅延',
            description: 'ランダム時間待機します（反ボット対策）。'
          },
          element: {
            title: '要素待機',
            description: 'ページ要素の出現を待ちます。'
          },
          condition: {
            title: '条件待機',
            description: '条件が満たされるまで待ちます。'
          }
        },
        antiBot: {
          ua: {
            title: 'User-Agent 設定',
            description: 'ランダムな User-Agent を設定します。'
          },
          proxy: {
            title: 'プロキシ設定',
            description: 'プロキシ IP を使用します。'
          },
          challenge: {
            title: 'チャレンジ検出',
            description: 'Cloudflare、reCAPTCHA、hCaptcha、Turnstile を検出します。'
          },
          headers: {
            title: 'ヘッダー偽装',
            description: 'ブラウザのリクエストヘッダーを偽装します。'
          },
          referer: {
            title: 'Referer 設定',
            description: 'リクエスト元を設定します。'
          }
        },
        helper: {
          comment: {
            title: 'コメント',
            description: 'コメントを追加します。'
          },
          subflow: {
            title: 'サブフロー',
            description: '再利用可能なサブフローをまとめます。'
          },
          timestamp: {
            title: 'タイムスタンプ',
            description: '現在のタイムスタンプを取得します。'
          },
          uuid: {
            title: 'UUID 生成',
            description: '一意の ID を生成します。'
          },
          hash: {
            title: 'ハッシュ計算',
            description: 'MD5、SHA などのハッシュを計算します。'
          }
        },
        browser: {
          launch: {
            title: 'ブラウザ起動',
            description: 'Chrome/Firefox/Edge を起動します。'
          },
          close: {
            title: 'ブラウザ終了',
            description: 'ブラウザインスタンスを閉じます。'
          },
          openPage: {
            title: 'ページを開く',
            description: '指定 URL のページを開きます。'
          },
          closePage: {
            title: 'ページを閉じる',
            description: '現在のページを閉じます。'
          },
          navigate: {
            title: 'ページ遷移',
            description: '現在のページで新しい URL に移動します。'
          },
          waitLoad: {
            title: '読み込み待機',
            description: 'ページの完全読み込みを待ちます。'
          },
          waitIdle: {
            title: '通信待機',
            description: 'ネットワークリクエストの完了を待ちます。'
          },
          screenshot: {
            title: 'スクリーンショット',
            description: '現在のページを撮影します。'
          },
          html: {
            title: 'ページ HTML 取得',
            description: 'ページの完全な HTML を取得します。'
          },
          url: {
            title: 'ページ URL 取得',
            description: '現在のページ URL を取得します。'
          },
          refresh: {
            title: 'ページ更新',
            description: '現在のページを更新します。'
          },
          back: {
            title: '戻る',
            description: 'ブラウザで戻ります。'
          },
          forward: {
            title: '進む',
            description: 'ブラウザで進みます。'
          }
        },
        element: {
          click: {
            title: '要素クリック',
            description: 'ページ要素をクリックします。'
          },
          input: {
            title: '文字入力',
            description: '入力欄に文字を入力します。'
          },
          clear: {
            title: '入力クリア',
            description: '入力欄の内容をクリアします。'
          },
          select: {
            title: 'ドロップダウン選択',
            description: 'ドロップダウン項目を選択します。'
          },
          checkbox: {
            title: 'チェックボックス切替',
            description: 'チェックボックスをオン/オフします。'
          },
          radio: {
            title: 'ラジオ選択',
            description: 'ラジオボタンを選択します。'
          },
          upload: {
            title: 'ファイルアップロード',
            description: 'ファイル入力にファイルをアップロードします。'
          },
          hover: {
            title: '要素ホバー',
            description: '要素の上にマウスを乗せます。'
          },
          drag: {
            title: '要素ドラッグ',
            description: '要素を目的位置へドラッグします。'
          },
          scrollToElement: {
            title: '要素までスクロール',
            description: 'ページを要素位置までスクロールします。'
          },
          scrollToPosition: {
            title: '位置までスクロール',
            description: '指定座標までスクロールします。'
          },
          rightClick: {
            title: '右クリック',
            description: '要素を右クリックします。'
          },
          doubleClick: {
            title: 'ダブルクリック',
            description: '要素をダブルクリックします。'
          },
          setValue: {
            title: '値を設定',
            description: '汎用的に要素の値を設定します。'
          },
          trigger: {
            title: 'イベント発火',
            description: '汎用的に要素イベントを発火します。'
          }
        },
        elementWait: {
          appear: {
            title: '要素の出現待機',
            description: 'DOM 上に要素が現れるのを待ちます。'
          },
          disappear: {
            title: '要素の消失待機',
            description: 'DOM から要素が消えるのを待ちます。'
          },
          visible: {
            title: '要素の表示待機',
            description: '要素が表示されるのを待ちます。'
          },
          hidden: {
            title: '要素の非表示待機',
            description: '要素が非表示になるのを待ちます。'
          },
          clickable: {
            title: '要素のクリック可能待機',
            description: '要素がクリック可能になるのを待ちます。'
          },
          exists: {
            title: '要素存在確認',
            description: '要素が存在するか確認します。'
          },
          visibleCheck: {
            title: '要素表示確認',
            description: '要素が表示されているか確認します。'
          },
          clickableCheck: {
            title: '要素クリック可能確認',
            description: '要素がクリック可能か確認します。'
          },
          text: {
            title: '要素テキスト取得',
            description: '要素のテキスト内容を取得します。'
          },
          attr: {
            title: '要素属性取得',
            description: '要素の属性値を取得します。'
          },
          style: {
            title: '要素スタイル取得',
            description: '要素の CSS スタイルを取得します。'
          },
          count: {
            title: '要素数取得',
            description: '一致した要素の数を取得します。'
          }
        },
        form: {
          fill: {
            title: 'フォーム入力',
            description: 'フォーム項目を一括入力します。'
          },
          submit: {
            title: 'フォーム送信',
            description: 'フォームを送信します。'
          },
          reset: {
            title: 'フォームリセット',
            description: 'フォームを初期状態に戻します。'
          },
          validate: {
            title: 'フォーム検証',
            description: 'フォーム項目を検証します。'
          }
        },
        context: {
          switchTab: {
            title: 'タブ切り替え',
            description: '別のブラウザタブへ切り替えます。'
          },
          openTab: {
            title: '新しいタブを開く',
            description: '新しいタブを開きます。'
          },
          closeTab: {
            title: 'タブを閉じる',
            description: '現在のタブを閉じます。'
          },
          switchFrame: {
            title: 'Frame 切り替え',
            description: 'iframe に切り替えます。'
          },
          switchMainFrame: {
            title: '主 Frame に切り替え',
            description: '主文書へ戻します。'
          },
          switchDialog: {
            title: 'ダイアログ切り替え',
            description: 'ブラウザのダイアログへ切り替えます。'
          },
          acceptDialog: {
            title: 'ダイアログ स्वीकार',
            description: 'alert / confirm を受け入れます。'
          },
          dismissDialog: {
            title: 'ダイアログ拒否',
            description: 'confirm を拒否します。'
          },
          promptText: {
            title: 'ダイアログ文字入力',
            description: 'prompt に文字を入力します。'
          }
        },
        cookie: {
          get: {
            title: 'Cookie 取得',
            description: 'ページの Cookie を取得します。'
          },
          set: {
            title: 'Cookie 設定',
            description: 'Cookie を設定します。'
          },
          delete: {
            title: 'Cookie 削除',
            description: 'Cookie を削除します。'
          },
          localGet: {
            title: 'LocalStorage 取得',
            description: 'LocalStorage のデータを取得します。'
          },
          localSet: {
            title: 'LocalStorage 設定',
            description: 'LocalStorage のデータを設定します。'
          },
          sessionGet: {
            title: 'SessionStorage 取得',
            description: 'SessionStorage のデータを取得します。'
          },
          sessionSet: {
            title: 'SessionStorage 設定',
            description: 'SessionStorage のデータを設定します。'
          }
        },
        network: {
          intercept: {
            title: 'リクエスト遮断',
            description: 'ネットワークリクエストを遮断します。'
          },
          modifyRequest: {
            title: 'リクエスト変更',
            description: 'リクエスト内容を変更します。'
          },
          interceptResponse: {
            title: 'レスポンス遮断',
            description: 'ネットワークレスポンスを遮断します。'
          },
          modifyResponse: {
            title: 'レスポンス変更',
            description: 'レスポンス内容を変更します。'
          },
          mock: {
            title: 'レスポンス模擬',
            description: 'Mock レスポンスデータを返します。'
          },
          list: {
            title: 'リクエスト一覧取得',
            description: '全ネットワークリクエストを取得します。'
          },
          wait: {
            title: '特定リクエスト待機',
            description: '指定したリクエストの完了を待ちます。'
          }
        },
        js: {
          exec: {
            title: 'JS 実行',
            description: 'ページ内で JavaScript を実行します。'
          },
          execReturn: {
            title: 'JS 実行して返却',
            description: 'JS を実行して戻り値を取得します。'
          },
          inject: {
            title: 'スクリプト注入',
            description: '外部スクリプトファイルを注入します。'
          },
          listen: {
            title: 'イベントリスナー追加',
            description: 'イベントリスナーを追加します。'
          }
        }
      }
    }
  },
  executions: {
    title: '実行記録',
    status: {
      pending: '待機中',
      running: '実行中',
      success: '成功',
      failed: '失敗',
      stopped: '停止済み'
    },
    duration: '所要時間 {ms}ms',
    records: '{count} 件を取得',
    empty: {
      title: '実行記録がありません',
      description: 'まだ実行記録がありません'
    }
  },
  spider: {
    title: 'スパイダー',
    websites: {
      pixabay: {
        title: 'Pixabay',
        music: '音楽'
      }
    }
  },
  execute: {}
};
