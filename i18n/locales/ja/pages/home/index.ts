export const home = {
  title: 'ホーム',
  podcastScript: {
    title: 'ポッドキャスト台本テスト',
    description: 'このページでは音声サンプルを生成しません。ホットサーチ原稿を Doubao 向け台本へ組み立てるための一時テスト画面です。',
    editorDescription: '初期値は「設定 > ホットサーチ」から読み込みます。ここでの変更は今回のテストだけに使われ、自動保存されません。',
    templateCount: 'テンプレート片数: {count}',
    body: {
      label: 'ポッドキャスト本文',
      description: '本文セグメントを1件ずつ追加します。ここは常に本文エディタなので、原稿・話者・セグメント種別だけを決めれば十分です。',
      placeholder: 'このセグメントで読み上げる本文を入力してください',
      add: '本文セグメントを追加',
      emptyTitle: '本文セグメントがまだありません',
      emptyDescription: '先に本文セグメントを追加してから、話者ロールとセグメント種別を選んでください。'
    },
    adOpening: {
      label: '冒頭広告文案',
      description: '今回のホーム画面テストだけに反映されます。冒頭テンプレートに広告プレースホルダーがある場合は、この文案を優先して差し込みます。',
      placeholder: '今回のテストで差し込む冒頭広告文案を入力してください',
      add: '冒頭広告セグメントを追加',
      emptyTitle: '冒頭広告セグメントがまだありません',
      emptyDescription: '先に冒頭広告セグメントを追加してから、話者と文案の順番を調整してください。'
    },
    adClosing: {
      label: '締め広告文案',
      description: '今回のホーム画面テストだけに反映されます。締めテンプレートに広告プレースホルダーがある場合は、この文案を優先して差し込みます。',
      placeholder: '今回のテストで差し込む締め広告文案を入力してください',
      add: '締め広告セグメントを追加',
      emptyTitle: '締め広告セグメントがまだありません',
      emptyDescription: '先に締め広告セグメントを追加してから、話者と文案の順番を調整してください。'
    },
    names: {
      maleLabel: '男性話者名',
      femaleLabel: '女性話者名',
      morningLabel: '朝報名',
      eveningLabel: '晚報名',
      vipMorningLabel: '長編朝報名',
      vipEveningLabel: '長編晚報名'
    },
    actions: {
      title: '生成モード',
      morningShort: '朝報を生成（短編）',
      morningLong: '朝報を生成（長編）',
      eveningShort: '晚報を生成（短編）',
      eveningLong: '晚報を生成（長編）',
      tip: 'このホームは台本テスト専用で、最終的なホーム画面デザインではありません。'
    },
    scope: {
      label: '生成スコープ',
      commonDescription: '現在は common 版を生成します。広告は常に除外され、共通本文と共通の冒頭・締めだけを生成します。',
      bilibiliDescription: '現在は bilibili 版を生成します。広告文案がある場合は、プラットフォーム用の冒頭・締めを生成し、common 本文と結合します。'
    },
    badges: {
      morning: '朝間',
      evening: '晚間',
      short: '短編',
      long: '長編',
      common: 'Common',
      bilibili: 'Bilibili'
    },
    result: {
      title: '生成結果',
      description: '返却構造は、そのまま Doubao Podcast エンジンへ渡せる speaker + text の行配列です。',
      emptyTitle: 'まだ台本が生成されていません',
      emptyDescription: '先に原稿を調整してから、上の 4 つの生成ボタンを押してください。',
      audio: {
        generate: 'ポッドキャスト音声を生成',
        openDirectory: '出力フォルダを開く',
        defaultHint: '生成後の音声は添付ディレクトリ配下のホットサーチ用ポッドキャスト保存先へ保存されます。',
        statusTitle: '音声生成ステータス',
        errorTitle: '音声生成に失敗しました',
        errorFallback: 'ポッドキャスト音声の生成に失敗しました。添付ディレクトリと Volc 音声認証情報を確認してください。',
        errorVolcRedisNil: 'Volc ポッドキャストサービスが redis: nil を返しました。これは現在の AppID、AccessToken、resourceId、speaker code の組み合わせが対応能力と一致していない場合に起こることが多く、ローカル Redis の欠如を意味するものではありません。元のエラー: {raw}',
        statusIdle: '台本結果の準備ができました。実際のポッドキャスト音声を生成できます。',
        statusAccepted: 'タスクは受理されました。デスクトップシェルが Doubao ポッドキャスト接続を準備しています。',
        statusRunning: '音声を生成中です。現在の段階: {phase}。',
        statusSucceeded: '音声の生成が完了し、次の場所へ保存されました: {path}',
        statusFailed: '音声生成に失敗しました: {message}',
        statusCanceled: '音声生成タスクはキャンセルされました。',
        phases: {
          queued: '待機中',
          connecting: '接続中',
          sessionStarting: 'セッション開始中',
          generating: '生成中',
          finalizing: '仕上げ中',
          completed: '完了',
          failed: '失敗',
          canceled: 'キャンセル済み'
        }
      }
    }
  },
  welcomeEmail: {
    description: 'ボタンを押すと、歓迎メールの内容を生成し、現在の送信先メールアドレスへ送信します。',
    target: '既定の送信先: {email}',
    send: '歓迎メールを送信',
    result: {
      successTitle: '送信成功',
      errorTitle: '送信失敗',
      success: '歓迎メールを {email} に送信しました。実際の送信先数: {count}。',
      error: '歓迎メールの送信に失敗しました。メール設定またはバックエンド応答を確認してください。'
    }
  }
};
