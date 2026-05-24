export const home = {
  title: 'ホーム',
  voicePreview: {
    title: '音声サンプル生成',
    description: '文案を入力してボタンを押すと、現在サポートされている全音色の試聴サンプルをまとめて生成します。',
    generate: '全音色サンプルを生成',
    supportedCount: '現在の結果数: {count}',
    input: {
      label: 'サンプル文案',
      description: 'この文案はデスクトップシェルへ渡され、サポート中の各音色ごとに音声サンプルが生成されます。',
      placeholder: '例: 本日は現在サポート中のロフィ音色を順番に試聴していきます。'
    },
    empty: {
      title: 'まだ音声サンプルがありません',
      description: '先に文案を入力してから、生成ボタンを押してください。'
    },
    result: {
      errorTitle: '生成失敗',
      itemErrorTitle: 'この音色の生成に失敗しました',
      error: '音声サンプルの生成に失敗しました。サービス認証情報またはデスクトップシェルの応答を確認してください。',
      notTauri: '現在の実行環境は Tauri ではないため、音声サンプルを直接生成できません。'
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
