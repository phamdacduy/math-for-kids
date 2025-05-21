import { convertEquationToWords } from './utils.js';
export const successSounds = [
  'Good job!',
  'Well done!',
  'Excellent!',
  'You did it!',
  'Great work!',
  'Awesome!',
  'Fantastic!',
  'Super!',
  'Nice one!',
  'Way to go!',
  'That’s amazing!',
  'Bravo!',
  'Keep it up!',
  'High five!',
  'You rock!',
  'Superstar!',
  'Brilliant!',
  'Yay! That’s right!',
];

export const errorSounds = ['Oh oh!', 'Try again!'];

export function speak(text) {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    speechSynthesis.speak(utterance);
  });
}

export async function sayCalculation(a, b, result, operator) {
  // convert the numbers to words
  const text = convertEquationToWords(a, b, result, operator);
  // speak
  await speak(text);
}
