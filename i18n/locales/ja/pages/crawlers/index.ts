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
