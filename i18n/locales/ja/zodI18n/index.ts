export const zodI18n = {
  errors: {
    custom: '入力形式が正しくありません',
    invalid_arguments: '関数の引数形式が正しくありません',
    invalid_date: '日付形式が正しくありません',
    invalid_enum_value: "列挙値 '{received}' が正しくありません。{options} を入力してください",
    invalid_intersection_types: '交差型の結果をマージできません',
    invalid_literal: 'リテラル値が正しくありません。{expected} を入力してください',
    invalid_return_type: '関数の戻り値の型が正しくありません',
    invalid_string: {
      cuid: '{validation} 形式が正しくありません',
      datetime: '{validation} 形式が正しくありません',
      email: '{validation} 形式が正しくありません',
      endsWith: '"{endsWith}" で終わる必要があります',
      regex: '形式が正しくありません',
      startsWith: '"{startsWith}" で始まる必要があります',
      url: '{validation} 形式が正しくありません',
      uuid: '{validation} 形式が正しくありません'
    },
    invalid_type: '{expected} が必要ですが、{received} が入力されました',
    invalid_type_received_undefined: '必須',
    invalid_union: 'ユニオン型のいずれのオプションにも一致しません',
    invalid_union_discriminator: '識別値が認識できません。{options} を入力してください',
    not_finite: '有限の数値を入力してください',
    not_multiple_of: '{multipleOf} の倍数を入力してください',
    required: '必須',
    too_big: {
      array: { exact: '配列要素は {maximum} 個である必要があります', inclusive: '配列要素は {maximum} 個以下にしてください', not_inclusive: '配列要素は {maximum} 個未満にしてください' },
      date: { exact: '日付は {maximum} である必要があります', inclusive: '日付は {maximum} 以前にしてください', not_inclusive: '日付は {maximum} より前にしてください' },
      number: { exact: '値は {maximum} である必要があります', inclusive: '値は {maximum} 以下にしてください', not_inclusive: '値は {maximum} 未満にしてください' },
      set: { exact: '入力形式が正しくありません', inclusive: '入力形式が正しくありません', not_inclusive: '入力形式が正しくありません' },
      string: { exact: 'テキストは {maximum} 文字である必要があります', inclusive: 'テキストは {maximum} 文字以内にしてください', not_inclusive: 'テキストは {maximum} 文字未満にしてください' }
    },
    too_small: {
      array: { exact: '配列要素は {minimum} 個である必要があります', inclusive: '配列要素は {minimum} 個以上にしてください', not_inclusive: '配列要素は {minimum} 個より多くしてください' },
      date: { exact: '日付は {minimum} である必要があります', inclusive: '日付は {minimum} 以降にしてください', not_inclusive: '日付は {minimum} より後にしてください' },
      number: { exact: '値は {minimum} である必要があります', inclusive: '値は {minimum} 以上にしてください', not_inclusive: '値は {minimum} より大きくしてください' },
      set: { exact: '入力形式が正しくありません', inclusive: '入力形式が正しくありません', not_inclusive: '入力形式が正しくありません' },
      string: { exact: 'テキストは {minimum} 文字である必要があります', inclusive: 'テキストは {minimum} 文字以上にしてください', not_inclusive: 'テキストは {minimum} 文字より長くしてください' }
    },
    unrecognized_keys: 'オブジェクトに認識できないキーがあります：{keys}'
  },
  types: {
    array: '配列',
    bigint: '大整数',
    boolean: '真偽値',
    date: '日付',
    float: '浮動小数点数',
    function: '関数',
    integer: '整数',
    map: 'マップ',
    nan: '非数',
    never: '存在しない',
    null: 'null',
    number: '数値',
    object: 'オブジェクト',
    promise: 'Promise',
    set: 'セット',
    string: '文字列',
    symbol: 'シンボル',
    undefined: '未定義',
    unknown: '不明',
    void: '空'
  },
  validations: {
    cuid: 'CUID',
    datetime: '日時',
    email: 'メール',
    regex: '正規表現',
    url: 'URL',
    uuid: 'UUID'
  }
};
