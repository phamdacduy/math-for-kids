import { emojis } from './emojis.js';
import { successSounds, errorSounds, speak, sayCalculation } from './sound.js';
import { calculate, getRandomInt } from './utils.js';

let allowedOperators = ['+', '-']; // default
let maxResultValue = 10;

const maxA = 10;
const maxB = 10;
const confetti = new JSConfetti();

const correctEl = document.getElementById('correct');
const wrongEl = document.getElementById('wrong');
const questionEl = document.querySelector('.question');
const emojiEl = document.querySelector('.emoji-display');
const keypad = document.querySelector('.keypad');
const answerInput = document.getElementById('answer');
const messageEl = document.querySelector('.message');

let correctCount = 0;
let wrongCount = 0;
let a, b, result;

//
// modal functions
const btnSettings = document.getElementById('settingsBtn');
btnSettings.addEventListener('click', openSettings);

const closeSettingsBtn = document.getElementById('closeSettings');
closeSettingsBtn.addEventListener('click', closeSettings);

const applySettingsBtn = document.getElementById('applySettings');
applySettingsBtn.addEventListener('click', applySettings);

function openSettings() {
  document.getElementById('settingsModal').style.display = 'flex';
}
function closeSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}

function applySettings() {
  // Get checked operators
  allowedOperators = Array.from(
    document.querySelectorAll('#operatorCheckboxes input:checked')
  ).map((input) => input.value);

  // Get max result
  const maxInput = parseInt(document.getElementById('maxResult').value);
  maxResultValue = isNaN(maxInput) ? 10 : maxInput;

  closeSettings();
  generateQuestion();
}

function generateHints(result, operator) {
  if (result <= 20) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    emojiEl.innerHTML = `${emoji.repeat(a)} ${operator} ${emoji.repeat(b)}`;
  }
}
function generateQuestion(maxAttempts = 9999) {
  let attempts = 0;
  let operator;

  do {
    attempts++;
    operator =
      allowedOperators[Math.floor(Math.random() * allowedOperators.length)];

    // Dynamically scale A and B based on operator and maxResultValue
    switch (operator) {
      case '+':
        a = getRandomInt(maxResultValue);
        b = getRandomInt(maxResultValue - a); // a + b <= maxResultValue
        break;
      case '-':
        a = getRandomInt(maxResultValue);
        b = getRandomInt(a); // result won't be negative
        break;
      case '*':
        a = getRandomInt(Math.floor(Math.sqrt(maxResultValue)));
        b = getRandomInt(Math.floor(maxResultValue / (a || 1)));
        break;
      case '/':
        b = getRandomInt(maxResultValue - 1) + 1; // no divide by zero
        result = getRandomInt(Math.floor(maxResultValue));
        a = result * b;
        break;
    }

    result = calculate(a, b, operator);
  } while (
    (result > maxResultValue || result < 0 || !Number.isInteger(result)) &&
    attempts < maxAttempts
  );

  generateHints(result, operator);
  questionEl.textContent = `${a} ${operator} ${b} = ?`;
  answerInput.value = '';
  messageEl.textContent = '';
}

async function checkAnswer() {
  const userAnswer = parseInt(answerInput.value);
  if (userAnswer === result) {
    correctCount++;

    const operator = questionEl.textContent.split(' ')[1];
    correctEl.textContent = correctCount;
    const msg = successSounds[Math.floor(Math.random() * successSounds.length)];
    questionEl.textContent = `${a} ${operator} ${b} = ${result}`;

    confetti.addConfetti();
    await speak(msg);
    await sayCalculation(a, b, result, questionEl.textContent.split(' ')[1]);
    // 👇 Move to next question after speaking is done
    setTimeout(generateQuestion, 1000); // optional delay for clarity
  } else {
    wrongCount++;
    wrongEl.textContent = wrongCount;
    const msg = errorSounds[Math.floor(Math.random() * errorSounds.length)];
    await speak(msg);
    messageEl.textContent = msg;
    answerInput.value = '';
  }
}

function createKeypad() {
  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.className = 'button';
    btn.textContent = i;
    btn.onclick = () => (answerInput.value += i);
    keypad.appendChild(btn);
  }

  const zeroBtn = document.createElement('button');
  zeroBtn.className = 'button  ';
  zeroBtn.textContent = '0';
  zeroBtn.onclick = () => (answerInput.value += '0');
  keypad.appendChild(zeroBtn);

  const clearBtn = document.createElement('button');
  clearBtn.className = 'button style-danger';
  clearBtn.textContent = '⌫';
  clearBtn.onclick = () => (answerInput.value = '');
  keypad.appendChild(clearBtn);

  const enterBtn = document.createElement('button');
  enterBtn.className = 'button enter-btn style-accent';
  enterBtn.textContent = '✓';
  enterBtn.onclick = checkAnswer;
  keypad.appendChild(enterBtn);
}

createKeypad();
generateQuestion();

answerInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkAnswer();
  }
});
