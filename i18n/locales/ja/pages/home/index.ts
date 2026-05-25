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
    badges: {
      morning: '朝間',
      evening: '晚間',
      short: '短編',
      long: '長編'
    },
    result: {
      title: '生成結果',
      description: '返却構造は、そのまま Doubao Podcast エンジンへ渡せる speaker + text の行配列です。',
      emptyTitle: 'まだ台本が生成されていません',
      emptyDescription: '先に原稿を調整してから、上の 4 つの生成ボタンを押してください。'
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
