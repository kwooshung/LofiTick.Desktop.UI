export const zodI18n = {
  errors: {
    custom: '輸入格式錯誤',
    invalid_arguments: '函式參數格式錯誤',
    invalid_date: '日期格式錯誤',
    invalid_enum_value: "列舉值 '{received}' 錯誤，請輸入 {options}",
    invalid_intersection_types: '交叉型別結果無法合併',
    invalid_literal: '字面量值錯誤，請輸入 {expected}',
    invalid_return_type: '函式回傳值格式錯誤',
    invalid_string: {
      cuid: '{validation} 格式錯誤',
      datetime: '{validation} 格式錯誤',
      email: '{validation} 格式錯誤',
      endsWith: '文字必須以 "{endsWith}" 結尾',
      regex: '格式錯誤',
      startsWith: '文字必須以 "{startsWith}" 開頭',
      url: '{validation} 格式錯誤',
      uuid: '{validation} 格式錯誤'
    },
    invalid_type: '預期輸入 {expected}，實際輸入 {received}',
    invalid_type_received_undefined: '必填',
    invalid_union: '不符合聯合型別中的任一選項',
    invalid_union_discriminator: '識別值無法區分，請輸入 {options}',
    not_finite: '數值必須是有限數',
    not_multiple_of: '數值必須是 {multipleOf} 的倍數',
    required: '必填',
    too_big: {
      array: { exact: '陣列元素必須為 {maximum} 個', inclusive: '陣列元素不得多於 {maximum} 個', not_inclusive: '陣列元素必須少於 {maximum} 個' },
      date: { exact: '日期必須為 {maximum}', inclusive: '日期不得早於 {maximum}', not_inclusive: '日期必須晚於 {maximum}' },
      number: { exact: '數值必須為 {maximum}', inclusive: '數值不得大於 {maximum}', not_inclusive: '數值必須小於 {maximum}' },
      set: { exact: '輸入格式錯誤', inclusive: '輸入格式錯誤', not_inclusive: '輸入格式錯誤' },
      string: { exact: '文字長度必須為 {maximum} 個字元', inclusive: '文字長度不得多於 {maximum} 個字元', not_inclusive: '文字長度必須少於 {maximum} 個字元' }
    },
    too_small: {
      array: { exact: '陣列元素必須為 {minimum} 個', inclusive: '陣列元素不得少於 {minimum} 個', not_inclusive: '陣列元素必須超過 {minimum} 個' },
      date: { exact: '日期必須為 {minimum}', inclusive: '日期不得晚於 {minimum}', not_inclusive: '日期必須早於 {minimum}' },
      number: { exact: '數值必須為 {minimum}', inclusive: '數值不得小於 {minimum}', not_inclusive: '數值必須大於 {minimum}' },
      set: { exact: '輸入格式錯誤', inclusive: '輸入格式錯誤', not_inclusive: '輸入格式錯誤' },
      string: { exact: '文字長度必須為 {minimum} 個字元', inclusive: '文字長度不得少於 {minimum} 個字元', not_inclusive: '文字長度必須超過 {minimum} 個字元' }
    },
    unrecognized_keys: '物件中無法識別的鍵：{keys}'
  },
  types: {
    array: '陣列',
    bigint: '大整數',
    boolean: '布林值',
    date: '日期',
    float: '浮點數',
    function: '函式',
    integer: '整數',
    map: '字典',
    nan: '非數',
    never: '不存在',
    null: '空物件',
    number: '數字',
    object: '物件',
    promise: 'Promise',
    set: '集合',
    string: '字串',
    symbol: '符號',
    undefined: '未定義',
    unknown: '未知',
    void: '空'
  },
  validations: {
    cuid: 'CUID',
    datetime: '日期時間',
    email: '電子郵件',
    regex: '正規表達式',
    url: '連結',
    uuid: 'UUID'
  }
};
