const inputslider = document.querySelector("[ data-length-slider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");

const passwordDisplay = document.querySelector(" [data-password]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[copymsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*(){}[]+-=|//><,./?''";

let password = "";
let passwordLength = 10;
let checkCount = 0;
//set strength circle color to gray
handleSlider();
//sets the length of the password
setIndicator("#ccc");

function handleSlider() {
  inputslider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = "0px 0px 12px 1px ${color}";
  const min = inputslider.min;
  const max = inputslider.max;
  inputslider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";

  //shadow
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}
function generateSymbol() {
  const rand = getRandomInteger(0, symbols.length);
  return symbols.charAt(rand);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 0) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 0
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function handleboxcheckchange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleboxcheckchange);
});

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copymsg.innerText = "copied";
  } catch (e) {
    copymsg.innerText = "failed!";
  }

  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

inputslider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copybtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent(); //if(passworsLength.length >0) copycontent();
});

generateBtn.addEventListener("click", () => {
  // none of the check box are selected
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  console.log("initial paswoer");
  //remove old password
  password = "";

  // lets put the stuff mentioned by checkboxes
  //   if (upperCaseCheck.checked) {
  //     password += generateUpperCase();
  //   }
  //   if (lowerCaseCheck.checked) {
  //     password += generateLowerCase();
  //   }
  //   if (numberCheck.checked) {
  //     password += getRandomNumber();
  //   }
  //   if (symbolCheck.checked) {
  //     password += generateSymbol();
  //   }

  let funcArr = [];

  if (upperCaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowerCaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numberCheck.checked) {
    funcArr.push(getRandomNumber);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbol);
  }

  //compulsory addition

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("compulsory additon");

  // remaining element

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIdx = getRandomInteger(0, funcArr.length);
    console.log("randidx" + randIdx);
    password += funcArr[randIdx]();
  }
  console.log("rremeinif additon");
  //sufflethe password

  password = shufflePassword(Array.from(password));

  console.log("suffling the password");
  //show in UI

  passwordDisplay.value = password;
  console.log("ui addition done");
  //calulate strength

  calcStrength();
});
