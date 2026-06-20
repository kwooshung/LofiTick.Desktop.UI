import { crawler } from '@@/i18n/locales/ja/components/crawler';

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
  editor: {
    title: 'クローラーロジック',
    sidebar: {
      tabs: {
        nodes: 'ノード',
        siteFunctions: 'サイト関数',
        globalFunctions: 'グローバル関数'
      },
      loading: '関数リストを読み込み中',
      row: {
        id: 'ID: {id}',
        reference: '参照 {count}',
        target: 'サイト #{id}'
      },
      empty: {
        siteMissingTarget: '現在のサイト情報が不足しているため、サイト関数を読み込めません。',
        siteNoData: '現在のサイトには関数がありません。',
        globalNoData: 'グローバル関数はまだありません。',
        defaultDescription: '項目がありません',
        siteTitle: 'サイト関数がありません',
        globalTitle: 'グローバル関数がありません',
        defaultTitle: '項目がありません'
      },
      actions: {
        createSiteFunction: 'サイト関数を作成',
        createGlobalFunction: 'グローバル関数を作成'
      },
      createModal: {
        titleSite: 'サイト関数を作成',
        titleGlobal: 'グローバル関数を作成',
        scopeLabel: 'スコープ',
        scopeSite: 'サイト関数',
        scopeGlobal: 'グローバル関数',
        nameLabel: '関数名',
        namePlaceholder: '関数名を入力してください',
        descriptionLabel: '説明',
        descriptionPlaceholder: '関数の説明を入力してください（任意）',
        siteTargetRequired: '現在のサイトコンテキストが不足しているため、サイト関数を作成できません。'
      }
    },
    empty: {
      title: 'キャンバスにまだノードがありません',
      description: '左側からブループリントノードをキャンバスへドラッグして、クローラーフローを作成してください。'
    },
    drag: {
      title: 'マウスを離すとノードを配置します',
      description: '現在のブループリントノードはマウス位置に挿入されます。'
    },
    actions: {
      restore: 'リセット',
      zoomIn: '拡大',
      zoomOut: '縮小',
      autoLayout: '自動レイアウト',
      redo: 'やり直し',
      undo: '元に戻す'
    },
    draft: {
      saved: '下書きを自動保存しました'
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
  blueprint: crawler.blueprint
};
