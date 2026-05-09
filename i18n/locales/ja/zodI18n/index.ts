export const zodI18n = {
  errors: {
    custom: '入力形式が正しくありません',
    invalid_arguments: '関数の引数の形式が正しくありません',
    invalid_date: '日付の形式が正しくありません',
    invalid_enum_value: "列挙値 '{received}' は無効です。{options} のいずれかを入力してください。",
    invalid_intersection_types: '交差型の結果をマージできませんでした',
    invalid_literal: 'リテラル値が正しくありません。{expected} を入力してください。',
    invalid_return_type: '関数の戻り値の形式が正しくありません',
    invalid_string: {
      cuid: '{validation} の形式が正しくありません',
      datetime: '{validation} の形式が正しくありません',
      email: '{validation} の形式が正しくありません',
      endsWith: 'テキストは「{endsWith}」で終わる必要があります',
      regex: '形式が正しくありません',
      startsWith: 'テキストは「{startsWith}」で始まる必要があります',
      url: '{validation} の形式が正しくありません',
      uuid: '{validation} の形式が正しくありません'
    },
    invalid_type: '期待された型は {expected} ですが、{received} が渡されました',
    invalid_type_received_undefined: '必須項目です',
    invalid_union: 'いずれのユニオン型の条件も満たしていません',
    invalid_union_discriminator: '識別用の値が判別できません。{options} のいずれかを指定してください。',
    not_finite: '有限の数値を入力してください',
    not_multiple_of: '{multipleOf} の倍数である必要があります',
    required: '必須項目です',
    too_big: {
      array: {
        exact: '要素数は {maximum} 個でなければなりません',
        inclusive: '要素数は {maximum} 個以下でなければなりません',
        not_inclusive: '要素数は {maximum} 個未満でなければなりません'
      },
      date: {
        exact: '日付は {maximum} でなければなりません',
        inclusive: '日付は {maximum} 以前でなければなりません',
        not_inclusive: '日付は {maximum} より前でなければなりません'
      },
      number: {
        exact: '値は {maximum} でなければなりません',
        inclusive: '値は {maximum} 以下でなければなりません',
        not_inclusive: '値は {maximum} 未満でなければなりません'
      },
      set: {
        exact: '入力形式が正しくありません',
        inclusive: '入力形式が正しくありません',
        not_inclusive: '入力形式が正しくありません'
      },
      string: {
        exact: '文字数は {maximum} 文字ちょうどでなければなりません',
        inclusive: '文字数は {maximum} 文字以下でなければなりません',
        not_inclusive: '文字数は {maximum} 文字未満でなければなりません'
      }
    },
    too_small: {
      array: {
        exact: '要素数は {minimum} 個でなければなりません',
        inclusive: '要素数は {minimum} 個以上でなければなりません',
        not_inclusive: '要素数は {minimum} 個より多くなければなりません'
      },
      date: {
        exact: '日付は {minimum} でなければなりません',
        inclusive: '日付は {minimum} 以降でなければなりません',
        not_inclusive: '日付は {minimum} より後でなければなりません'
      },
      number: {
        exact: '値は {minimum} でなければなりません',
        inclusive: '値は {minimum} 以上でなければなりません',
        not_inclusive: '値は {minimum} より大きくなければなりません'
      },
      set: {
        exact: '入力形式が正しくありません',
        inclusive: '入力形式が正しくありません',
        not_inclusive: '入力形式が正しくありません'
      },
      string: {
        exact: '文字数は {minimum} 文字ちょうどでなければなりません',
        inclusive: '文字数は {minimum} 文字以上でなければなりません',
        not_inclusive: '文字数は {minimum} 文字より多くなければなりません'
      }
    },
    unrecognized_keys: 'オブジェクト内に認識できないキーがあります: {keys}'
  },
  types: {
    array: '配列',
    bigint: 'BigInt',
    boolean: '真偽値',
    date: '日付',
    float: '浮動小数点数',
    function: '関数',
    integer: '整数',
    map: 'マップ',
    nan: 'NaN',
    never: 'never',
    null: 'null',
    number: '数値',
    object: 'オブジェクト',
    promise: 'Promise',
    set: 'セット',
    string: '文字列',
    symbol: 'シンボル',
    undefined: 'undefined',
    unknown: '不明',
    void: 'void'
  },
  validations: {
    cuid: 'CUID',
    datetime: '日時',
    email: 'メールアドレス',
    regex: '正規表現',
    url: 'URL',
    uuid: 'UUID'
  }
};
