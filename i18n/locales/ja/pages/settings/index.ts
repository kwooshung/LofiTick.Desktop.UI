export const settings = {
  title: '設定',
  general: {
    title: '一般設定',
    description: 'アプリの基本的な動作や言語など、共通の設定を行います。',
    closeBehavior: {
      label: 'ウィンドウを閉じるとき',
      description: 'メインウィンドウを閉じたときの既定の動作です。',
      options: {
        unset: '毎回確認する',
        minimizeToTray: 'トレイに最小化',
        exit: 'アプリを終了'
      }
    },
    language: {
      label: '表示言語',
      description: '現在 {count} 種類の言語に対応しています。'
    },
    rememberWindowState: {
      label: 'ウィンドウ状態を記憶',
      description: 'ウィンドウ位置とサイズを常に記録し、このスイッチで起動時に復元するかどうかを決めます。'
    },
    appDirectory: {
      label: 'アプリの場所',
      description: 'アプリの実行ファイルがあるフォルダーを開きます。',
      open: 'フォルダーを開く'
    },
    userDataDirectory: {
      label: 'ユーザーデータの場所',
      description: 'userData フォルダー（設定やキャッシュなど）を開きます。',
      open: 'フォルダーを開く'
    },
    storage: {
      label: 'データ保存先',
      description: 'データファイルを保存するディレクトリです。現在のパス：',
      dialogTitle: '添付ファイルの保存先を選択',
      choose: 'フォルダーを選択',
      reselect: '再選択',
      unset: '未設定'
    },
    devtools: {
      label: '開発者ツール',
      description: '開発者ツールを開きます（閉じる場合は DevTools ウィンドウ側で手動で閉じてください）。',
      toggle: 'DevTools を開く'
    },
    multiOpen: {
      label: '複数起動',
      description: 'アプリを複数同時に起動できるようにします。'
    }
  },
  ui: {
    title: '外観',
    description: 'テーマ、ライト／ダークモード、レイアウトなどの外観設定です。',
    colorMode: {
      label: 'カラーモード',
      description: '外観をライト/ダークにするか、またはコンピューターの設定に合わせて調整します。',
      options: {
        system: 'システムに合わせる',
        light: 'ライト',
        dark: 'ダーク'
      }
    },
    primary: {
      label: 'アクセントカラー',
      description: 'ボタンやリンクなど、強調表示に使用される色です。',
      colors: {
        black: 'ブラック',
        red: 'レッド',
        orange: 'オレンジ',
        amber: 'アンバー',
        yellow: 'イエロー',
        lime: 'ライム',
        green: 'グリーン',
        emerald: 'エメラルド',
        teal: 'ティール',
        cyan: 'シアン',
        sky: 'スカイ',
        blue: 'ブルー',
        indigo: 'インディゴ',
        violet: 'バイオレット',
        purple: 'パープル',
        fuchsia: 'フューシャ',
        pink: 'ピンク',
        rose: 'ローズ'
      }
    },
    neutral: {
      label: 'ニュートラルカラー',
      description: '主にテキスト、背景、ボーダーなどに使用される補助的な色です。',
      colors: {
        ink: 'インク',
        slate: 'スレート',
        gray: 'グレー',
        zinc: 'ジンク',
        neutral: 'ニュートラル',
        stone: 'ストーン',
        taupe: 'トープ',
        mauve: 'モーブ',
        mist: 'ミスト',
        olive: 'オリーブ'
      }
    },
    radius: {
      label: '角丸',
      description: 'UI 要素の角丸の大きさです。'
    }
  },
  playback: {
    title: '再生設定',
    description: 'オーディオ再生に関する各種パラメータです。',
    fade: {
      label: 'フェードイン／アウト',
      description: '音声のフェードイン／アウト時間をミリ秒単位で設定します。',
      labels: {
        in: 'フェードイン',
        out: 'フェードアウト'
      },
      unit: {
        ms: 'ミリ秒'
      }
    },
    normalization: {
      label: 'ラウドネス正規化',
      description: '有効にすると、再生時の音量を自動調整し、急な音量差を防ぎます。',
      unit: 'LUFS',
      lufs: {
        '-14': 'YouTube / bilibili / Spotify / Tidal / NetEase / QQ 音楽',
        '-16': 'Apple Music / WeChat 公式アカウント / Weibo / Podcast',
        '-24': 'テレビ / 映画 / Netflix / Disney+ / HBO Max'
      }
    }
  },
  power: {
    title: '電源設定',
    description: '省電力のため、アプリの電源管理オプションを調整します。',
    startup: {
      enabled: {
        label: '起動時に自動起動',
        description: 'システム起動時にアプリを自動的に起動します。'
      }
    },
    system: {
      label: 'システムスリープ',
      description: 'ブロックすると、ダウンロードやクロール、再生などの長時間タスクが中断されないよう、システムがスリープしなくなります。'
    },
    display: {
      label: 'ディスプレイスリープ',
      description: 'ブロックすると、ダウンロードやクロール、再生などのタスクを実行しながら、いつでも状態を確認できるようディスプレイがスリープしなくなります。'
    },
    options: {
      never: 'ブロックしない',
      always: '常にブロック',
      crawling: 'クロール中のみブロック',
      playing: '再生中のみブロック'
    }
  },
  unattended: {
    title: '無人値守',
    header: {
      description: '無人値守モードおよび心拍監視に関する設定を調整します。',
      enter: '無人値守ページへ移動'
    },
    dialogs: {
      restart: {
        title: '再起動が必要です',
        description: '無人値守の切り替えが変更されました。後で手動で再起動するか、今すぐ再起動して変更を反映できます。',
        actions: {
          cancel: 'キャンセル',
          later: '後で手動で再起動',
          now: '今すぐ再起動'
        },
        toast: {
          later: '保存しました。再起動後に反映されます。'
        }
      }
    },
    tooltips: {
      copyToClipboard: 'クリックしてクリップボードにコピー',
      openLink: 'リンクを開く'
    },
    analysis: {
      title: '分析時間',
      empty: 'データがありません',
      button: '時間分析',
      fields: {
        crashDecision: 'クラッシュ判定',
        restartDelay: '再起動遅延',
        restartCooldown: '再起動クールダウン',
        restartEpisodeWorst: '連続再起動（最悪）',
        restartEpisodeWithCooldownWorst: '連続再起動＋冷却（最悪）',
        burstWorst: 'バースト（最悪）',
        burstCooldown: 'バースト冷却',
        worstTotal: '最悪合計時間'
      }
    },
    form: {
      enabled: {
        label: '有効化',
        line1: {
          prefix: 'オンにすると無人値守モードが有効になり、',
          middle: 'ただしこれらの設定自体を明示的に変更するわけではなく、'
        },
        badges: {
          force: '強制',
          preventSystemSleep: 'システムスリープを禁止',
          enableStartup: '起動時自動起動を強制有効化',
          restoreOnClose: 'オフで元に戻す'
        },
        line2: {
          prefix: '有効化後、次回起動時に',
          middle: 'モードで開始し、次回再起動後も自動起動して',
          suffix: 'モードに入ります'
        },
        line3: {
          prefix: '右上のボタンから直接',
          suffix: 'モードに入ることもできます'
        }
      },
      startBehavior: {
        label: '起動時の表示',
        description: 'アプリ起動後のウィンドウ表示方法',
        options: {
          normal: 'デフォルト',
          minimize: '最小化',
          minimizeToTray: 'トレイに最小化'
        }
      },
      machineName: {
        label: 'マシン名',
        description: '混乱を避けるため、各PCで一意の名前を推奨します'
      },
      machineCode: {
        label: 'マシンID',
        description: '各PCを識別する一意のIDです'
      },
      machineCodeConsistent: {
        label: 'マシンコード一致',
        description: '空または一致なら変更なしと判断します'
      }
    },
    sections: {
      sentinel: {
        title: '哨兵',
        description: '無人値守モードでの心拍監視関連設定を調整します。',
        actions: {
          sync: '設定を同期',
          reset: '既定に戻す'
        },
        runtime: {
          states: {
            idle: '判定待ち',
            online: 'シーンオンライン',
            offline: 'シーンオフライン',
            error: '異常'
          },
          summary: 'ここで示すのは、このマシンで有効なシーンアプリの心拍状態だけであり、デスクトップシェル本体のオンライン状態ではありません。',
          reasons: {
            awaitingSnapshot: 'デスクトップシェルから現在の哨兵状態を取得中です。',
            unattendedDisabled: '現在は無人値守モードが無効です。',
            machineCodeMissing: 'マシンコードがないため、哨兵判定を開始できません。',
            noEnabledScenes: 'このマシンではまだ監護対象のシーンが有効になっていません。',
            heartbeatMissing: 'このマシンのシーン心拍がまだリモートに届いていません。',
            heartbeatTimeout: '心拍がオンライン判定時間を超えたため、このマシンはオフライン扱いです。',
            remoteFetchFailed: '現在このマシンのシーン状態をリモートから取得できません。',
            lastSeenInvalid: 'リモートが返した最後の心拍時刻の形式が不正です。',
            settingsUnavailable: 'デスクトップシェルがローカル設定を読み取れません。'
          },
          fields: {
            enabledScenes: '有効なシーン {count} 件',
            onlineWindow: 'オンライン判定と更新間隔 {count} 秒',
            lastSeenAt: '最後の心拍 {value}',
            staleFor: '{count} 秒タイムアウト中',
            recoveryIdle: '復旧キュー待機中',
            recoveryPending: '復旧判定を進行中',
            recoveryCooldown: '復旧クールダウン中',
            recoveryStopped: 'バースト上限に達したため自動再起動を停止',
            recoveryAttempts: '現在ラウンドで {count} 回再起動',
            recoveryEpisodes: '現在のバースト枠で {count} ラウンド完了',
            recoveryBurstCount: '累計バースト {count} 回',
            recoveryNextAttemptAt: '次回再試行可能時刻 {value}'
          }
        },
        form: {
          startup: {
            label: '起動時に自動起動',
            enableDescription: 'オン：配信シーン監護時に推奨。起動後に哨兵が自動起動します。',
            disablePrefix: 'オフ：このアプリも常駐が必要ならオフ推奨。',
            disableMiddle: ' モードが有効なため、自動起動でこのアプリが起動し、',
            disableSuffix: ' も起動します。'
          },
          onlineWindow: {
            label: 'オンライン判定と更新間隔',
            description: 'オフライン判定の時間幅と、マシン最終オンライン時刻の更新周期の両方に使われます。',
            value: '{seconds} 秒'
          },
          requestUrl: {
            label: 'リクエストURL',
            description: '状態などの情報をリモートサーバーに同期して集中管理します。',
            placeholder: 'api.v1.lofitick.com/system/unattended/heartbeat'
          }
        }
      },
      ue5: {
        title: 'UE5 連携',
        description: 'デスクトップの localhost ブリッジへ接続する入口アドレスです。個別のリクエストは一覧で確認します。',
        actions: {
          requests: 'リクエスト一覧を見る'
        },
        form: {
          endpoint: {
            label: 'ローカル接続先',
            description: 'ハートビートや情報取得などの UE5 ブリッジ要求は、このローカルアドレスから展開されます。'
          },
          upstreamHost: {
            description: '上流アドレスは UE5 のローカルブリッジが最終的に転送する先のリモート URL です。'
          }
        },
        modal: {
          title: 'ローカル接続リクエスト',
          description: '現在利用できる localhost ブリッジ要求をこのページに直接表示します。',
          errorTitle: 'ローカル接続リクエストを取得できません',
          requestListTitle: '現在利用できるリクエスト',
          actions: {
            close: '閉じる',
            refresh: '更新'
          },
          summary: {
            accessBase: 'ローカル接続先',
            upstreamHost: '上流ドメイン'
          },
          requests: {
            access: {
              title: 'ローカル接続情報',
              description: 'デスクトップ側が UE5 に公開している現在のブリッジ情報を取得します。'
            },
            heartbeat: {
              title: 'シーンのハートビート送信',
              description: 'このマシンの最新ハートビート時刻を書き込み、オンライン時間とオフライン判定を更新します。'
            }
          },
          empty: {
            title: '利用できるリクエストがありません',
            description: '現在、UE5 が呼び出せる localhost ブリッジ要求はありません。'
          }
        }
      },
      scenes: {
        title: 'シーン監護',
        description: 'Unreal Engine製の配信シーンアプリを主に監護します。',
        form: {
          onlineWindow: {
            label: 'オンライン判定と更新間隔',
            short: 'オンライン判定と更新間隔',
            unit: '秒'
          }
        }
      },
      logs: {
        title: 'ログ概要',
        description: 'マシンごとに最近の哨兵ログを確認します。この表示は今後オンラインマシン一覧やホーム画面にも再利用できます。',
        actions: {
          refresh: 'ログを更新'
        }
      }
    },
    labels: {
      thisApp: 'このアプリ'
    }
  }
};
