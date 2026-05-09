/**
 * 签名密钥种子（隐藏零宽字符以防泄露）
 * const originalSeed = '686ecbf4342589d5027fb2bc6a8fdda04b62d9a33378729fd221e7f0e15334b3';
 * https://www.jshaman.com/#free
 */

// const parts = ['686e', 'cbf4', '3425', '89d5', '027f', 'b2bc', '6a8f', 'dda0', '4b62', 'd9a3', '3378', '729f', 'd221', 'e7f0', 'e153', '34b3'];

const parts = [
  '\u0036\u0038\u0036\u0065',
  '4fbc'.split('').reverse().join(''),
  '5243'.split('').reverse().join(''),
  '\u0038\u0039\u0064\u0035',
  '\u0030\u0032\u0037\u0066',
  '\u0062\u0032\u0062\u0063',
  '\u0036\u0061\u0038\u0066',
  '0add'.split('').reverse().join(''),
  '\u0034\u0062\u0036\u0032',
  '\u0064\u0039\u0061\u0033',
  '\u0033\u0033\u0037\u0038',
  'f927'.split('').reverse().join(''),
  '122d'.split('').reverse().join(''),
  '\u0065\u0037\u0066\u0030',
  '\u0065\u0031\u0035\u0033',
  '\u0033\u0034\u0062\u0033'
];

export const SEED = parts.join('');
