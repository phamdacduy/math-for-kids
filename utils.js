export function getOperatorWord(operator) {
  let operatorStr = '';
  switch (operator) {
    case '+':
      operatorStr = 'plus';
      break;
    case '-':
      operatorStr = 'minus';
      break;
    case '*':
      operatorStr = 'times';
      break;
    case '/':
      operatorStr = 'divided by';
      break;
  }
  return operatorStr;
}

export function convertEquationToWords(a, b, result, operator) {
  const operatorWord = getOperatorWord(operator);
  const aWord = numberToWords(a);
  const bWord = numberToWords(b);
  const resultWord = numberToWords(result);
  return `${aWord} ${operatorWord} ${bWord} is ${resultWord}`;
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

export function calculate(a, b, op) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b !== 0 ? a / b : -1;
  }
}

export function numberToWords(num) {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  let numString = num.toString();

  if (num < 0) throw new Error('Negative numbers are not supported.');

  if (num === 0) return 'zero';

  //the case of 1 - 20
  if (num < 20) {
    return ones[num];
  }

  if (numString.length === 2) {
    return tens[numString[0]] + ' ' + ones[numString[1]];
  }

  //100 and more
  if (numString.length == 3) {
    if (numString[1] === '0' && numString[2] === '0')
      return ones[numString[0]] + ' hundred';
    else
      return (
        ones[numString[0]] +
        ' hundred and ' +
        numberToWords(+(numString[1] + numString[2]))
      );
  }

  if (numString.length === 4) {
    let end = +(numString[1] + numString[2] + numString[3]);
    if (end === 0) return ones[numString[0]] + ' thousand';
    if (end < 100)
      return ones[numString[0]] + ' thousand and ' + numberToWords(end);
    return ones[numString[0]] + ' thousand ' + numberToWords(end);
  }
}
