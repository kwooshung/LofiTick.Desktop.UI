export const zodI18n = {
  errors: {
    custom: 'Invalid input format',
    invalid_arguments: 'Invalid function arguments format',
    invalid_date: 'Invalid date format',
    invalid_enum_value: "Invalid enum value '{received}'. Expected one of {options}",
    invalid_intersection_types: 'Intersection result could not be merged',
    invalid_literal: 'Invalid literal value, expected {expected}',
    invalid_return_type: 'Invalid function return type',
    invalid_string: {
      cuid: 'Invalid {validation} format',
      datetime: 'Invalid {validation} format',
      email: 'Invalid {validation} format',
      endsWith: 'Text must end with "{endsWith}"',
      regex: 'Invalid format',
      startsWith: 'Text must start with "{startsWith}"',
      url: 'Invalid {validation} format',
      uuid: 'Invalid {validation} format'
    },
    invalid_type: 'Expected {expected} but received {received}',
    invalid_type_received_undefined: 'Required',
    invalid_union: 'Input does not match any union type options',
    invalid_union_discriminator: 'Discriminator value is not recognized. Expected one of {options}',
    not_finite: 'Value must be a finite number',
    not_multiple_of: 'Value must be a multiple of {multipleOf}',
    required: 'Required',
    too_big: {
      array: {
        exact: 'Array must contain exactly {maximum} items',
        inclusive: 'Array must contain at most {maximum} items',
        not_inclusive: 'Array must contain fewer than {maximum} items'
      },
      date: {
        exact: 'Date must be {maximum}',
        inclusive: 'Date must be on or before {maximum}',
        not_inclusive: 'Date must be before {maximum}'
      },
      number: {
        exact: 'Value must be {maximum}',
        inclusive: 'Value must be at most {maximum}',
        not_inclusive: 'Value must be less than {maximum}'
      },
      set: {
        exact: 'Invalid input format',
        inclusive: 'Invalid input format',
        not_inclusive: 'Invalid input format'
      },
      string: {
        exact: 'Text length must be exactly {maximum} characters',
        inclusive: 'Text length must be at most {maximum} characters',
        not_inclusive: 'Text length must be fewer than {maximum} characters'
      }
    },
    too_small: {
      array: {
        exact: 'Array must contain exactly {minimum} items',
        inclusive: 'Array must contain at least {minimum} items',
        not_inclusive: 'Array must contain more than {minimum} items'
      },
      date: {
        exact: 'Date must be {minimum}',
        inclusive: 'Date must be on or after {minimum}',
        not_inclusive: 'Date must be after {minimum}'
      },
      number: {
        exact: 'Value must be {minimum}',
        inclusive: 'Value must be at least {minimum}',
        not_inclusive: 'Value must be greater than {minimum}'
      },
      set: {
        exact: 'Invalid input format',
        inclusive: 'Invalid input format',
        not_inclusive: 'Invalid input format'
      },
      string: {
        exact: 'Text length must be exactly {minimum} characters',
        inclusive: 'Text length must be at least {minimum} characters',
        not_inclusive: 'Text length must be more than {minimum} characters'
      }
    },
    unrecognized_keys: 'Unrecognized keys in object: {keys}'
  },
  types: {
    array: 'array',
    bigint: 'bigint',
    boolean: 'boolean',
    date: 'date',
    float: 'float',
    function: 'function',
    integer: 'integer',
    map: 'map',
    nan: 'NaN',
    never: 'never',
    null: 'null',
    number: 'number',
    object: 'object',
    promise: 'Promise',
    set: 'set',
    string: 'string',
    symbol: 'symbol',
    undefined: 'undefined',
    unknown: 'unknown',
    void: 'void'
  },
  validations: {
    cuid: 'CUID',
    datetime: 'datetime',
    email: 'email',
    regex: 'regular expression',
    url: 'URL',
    uuid: 'UUID'
  }
};
