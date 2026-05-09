export const zodI18n = {
  errors: {
    custom: '輸入格式不正確',
    invalid_arguments: '函式參數格式不正確',
    invalid_date: '日期格式不正確',
    invalid_enum_value: "列舉值 '{received}' 無效，請從 {options} 中選擇。",
    invalid_intersection_types: '交集型別的結果無法正確合併',
    invalid_literal: '常值不正確，預期為 {expected}',
    invalid_return_type: '函式回傳值格式不正確',
    invalid_string: {
      cuid: '{validation} 格式不正確',
      datetime: '{validation} 格式不正確',
      email: '{validation} 格式不正確',
      endsWith: '文字必須以「{endsWith}」結尾',
      regex: '格式不正確',
      startsWith: '文字必須以「{startsWith}」開頭',
      url: '{validation} 格式不正確',
      uuid: '{validation} 格式不正確'
    },
    invalid_type: '預期輸入為 {expected}，實際收到 {received}',
    invalid_type_received_undefined: '此欄位為必填',
    invalid_union: '輸入內容未符合任何聯集型別的選項',
    invalid_union_discriminator: '無法辨識的識別值，請從 {options} 中選擇。',
    not_finite: '數值必須為有限數',
    not_multiple_of: '數值必須為 {multipleOf} 的倍數',
    required: '此欄位為必填',
    too_big: {
      array: {
        exact: '陣列元素必須剛好 {maximum} 個',
        inclusive: '陣列元素不得多於 {maximum} 個',
        not_inclusive: '陣列元素必須少於 {maximum} 個'
      },
      date: {
        exact: '日期必須為 {maximum}',
        inclusive: '日期不得晚於 {maximum}',
        not_inclusive: '日期必須早於 {maximum}'
      },
      number: {
        exact: '數值必須為 {maximum}',
        inclusive: '數值不得大於 {maximum}',
        not_inclusive: '數值必須小於 {maximum}'
      },
      set: {
        exact: '輸入格式不正確',
        inclusive: '輸入格式不正確',
        not_inclusive: '輸入格式不正確'
      },
      string: {
        exact: '文字長度必須剛好 {maximum} 個字元',
        inclusive: '文字長度不得多於 {maximum} 個字元',
        not_inclusive: '文字長度必須少於 {maximum} 個字元'
      }
    },
    too_small: {
      array: {
        exact: '陣列元素必須剛好 {minimum} 個',
        inclusive: '陣列元素不得少於 {minimum} 個',
        not_inclusive: '陣列元素必須多於 {minimum} 個'
      },
      date: {
        exact: '日期必須為 {minimum}',
        inclusive: '日期不得早於 {minimum}',
        not_inclusive: '日期必須晚於 {minimum}'
      },
      number: {
        exact: '數值必須為 {minimum}',
        inclusive: '數值不得小於 {minimum}',
        not_inclusive: '數值必須大於 {minimum}'
      },
      set: {
        exact: '輸入格式不正確',
        inclusive: '輸入格式不正確',
        not_inclusive: '輸入格式不正確'
      },
      string: {
        exact: '文字長度必須剛好 {minimum} 個字元',
        inclusive: '文字長度不得少於 {minimum} 個字元',
        not_inclusive: '文字長度必須多於 {minimum} 個字元'
      }
    },
    unrecognized_keys: '物件中包含無法識別的鍵：{keys}'
  },
  types: {
    array: '陣列',
    bigint: '大整數',
    boolean: '布林值',
    date: '日期',
    float: '浮點數',
    function: '函式',
    integer: '整數',
    map: '對映 (Map)',
    nan: '非數值 (NaN)',
    never: 'never',
    null: 'null',
    number: '數字',
    object: '物件',
    promise: 'Promise',
    set: '集合 (Set)',
    string: '字串',
    symbol: '符號',
    undefined: 'undefined',
    unknown: '未知',
    void: 'void'
  },
  validations: {
    cuid: 'CUID',
    datetime: '日期時間',
    email: '電子郵件',
    regex: '正規表示式',
    url: '網址',
    uuid: 'UUID'
  }
};
