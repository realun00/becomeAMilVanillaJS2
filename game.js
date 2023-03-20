"use strict";

const username = document.querySelector(".username_input");
const playButton = document.querySelector(".playButton");
const starterPage = document.querySelector(".container");
const inGame = document.querySelector(".inGame");
const winningsContainer = document.querySelector(".winnings");
const jokerContainer = document.querySelector(".jokerContainer");
const questionBox = document.querySelector(".questionBox");
const answersBox = document.querySelector(".answersBox");
const jkr = document.querySelector(".jkr");
const ffJoker = document.querySelector("#ffJoker");
const callJoker = document.querySelector("#callJoker");
const askJoker = document.querySelector("#askJoker");
let answerCheck;
let winningsList;

const player = {
  name: "",
  currentCorrect: "",
  currentWinnings: 0,
};

const winnings = [
  "100",
  "200",
  "300",
  "500",
  "1,000",
  "2,000",
  "4,000",
  "8,000",
  "16,000",
  "32,000",
  "64,000",
  "125,000",
  "250,000",
  "500,000",
  "1 Million",
];

//--------FUNCTIONS--------//

const getGameData = async () => {
  let answers;
  try {
    const easyResponse = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple");
    const mediumResponse = await fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple");
    const hardResponse = await fetch("https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple");

    let easy = await easyResponse.json();
    let medium = await mediumResponse.json();
    let hard = await hardResponse.json();

    if (easy.results?.length && medium.results?.length && hard.results?.length) {
      answers = [...easy.results, ...medium.results, ...hard.results];
    }
  } catch (err) {
    console.log(err);
  }

  return answers;
};

//save the globalAnswers here
let globalAnswers = [];

async function main() {
  if (!globalAnswers?.length) {
    let answers = await getGameData();
    renderGame(answers);
    globalAnswers = [...answers];
  } else {
    renderGame(globalAnswers);
  }
}

//call main
main();

//Shuffle the array
const shuffleArray = function (arr) {
  arr.sort(() => Math.random() - 0.5);
};

//Adding to grid
const addToGrid = function (arr, correctAnswer) {
  arr.forEach(function (el) {
    let button = document.createElement("button");
    let node = document.createTextNode(el);
    button.className = "grid-item";
    button.appendChild(node);
    answersBox.appendChild(button);
  });
  answerListener(answerCheck, correctAnswer);
};

//Display the winnings
const displayWinnings = function () {
  winnings.forEach(function (winning, i) {
    const html = `
           <li>${i + 1}.&nbsp;&nbsp;&nbsp;&nbsp;€${winning}</li>
          `;

    winningsContainer.insertAdjacentHTML("afterbegin", html);
  });
  winningsList = document.querySelectorAll(".winnings li");
  winningsList[winningsList.length - 1].style.backgroundColor = "#ffd000";
  winningsList[winningsList.length - 1].style.color = "#000";
};

const activeWinnings = function (list) {
  list = document.querySelectorAll(".winnings li");
  for (let i = 1; i < winnings.length; i++) {
    if (i === player.currentWinnings) {
      list[list.length - 1 - i].style.backgroundColor = "#ffd000";
      list[list.length - 1 - i].style.color = "#000";
      list[list.length - 1 - i + 1].style.backgroundColor = "#1d0088";
      list[list.length - 1 - i + 1].style.color = "rgb(255, 102, 0)";
    }
  }
};

//Render the game
const renderGame = function (data) {
  questionBox.innerHTML = "";
  answersBox.innerHTML = "";

  const htmlQuestion = `
        ${data[player.currentWinnings].question}
        `;
  questionBox.insertAdjacentHTML("afterbegin", htmlQuestion);

  let allAnswers = [...data[player.currentWinnings].incorrect_answers, data[player.currentWinnings].correct_answer];

  let correctAnswer = data[player.currentWinnings].correct_answer;

  player.currentCorrect = correctAnswer;

  shuffleArray(allAnswers);

  addToGrid(allAnswers, correctAnswer);
};

//--------Events n Listeners--------//

//What should the "Start game" button do
playButton.addEventListener("click", function (e) {
  e.preventDefault();

  if (username.value === "") {
    alert("Username field is empty");
  } else {
    player.name = username.value;
    starterPage.style.display = "none";
    inGame.style.display = "block";
    displayWinnings();
  }
});

//Adding listener to the clicked answer
function answerListener(getAnswer, correctAnswer) {
  getAnswer = document.querySelectorAll(".grid-item");
  getAnswer.forEach(function (answer) {
    answer.addEventListener("click", function () {
      if (answer.textContent === correctAnswer) {
        if (player.currentWinnings === 14) {
          answer.classList.add("correctAnswer");
          alert(`Congratulations ${player.name}! You've become a millionaire!`);
          location.reload();
        } else {
          player.currentWinnings++;
          answer.classList.add("correctAnswer");
          setTimeout(() => {
            main();
            activeWinnings(winningsList);
          }, 600);
        }
      } else {
        alert(`Sorry ${player.name}, this is a wrong answer! The correct one was ${correctAnswer}!`);
        location.reload();
      }
      jokerContainer.style.visibility = "hidden";
    });
  });
}

//Call a friend JOKER listener
callJoker.addEventListener("click", function callJ() {
  callJoker.removeEventListener("click", callJ);
  callJoker.style.border = "3px solid red";
  jokerContainer.style.visibility = "visible";
  answerCheck = [...document.querySelectorAll(".grid-item")];
  const notEmpty = answerCheck.filter((nempty) => nempty.textContent !== "");
  let randAnswer = notEmpty[Math.floor(Math.random() * notEmpty.length)];
  jkr.textContent = `Your friend thinks that the answer is "${randAnswer.textContent}"`;
});

//Ask the audience JOKER listener
askJoker.addEventListener("click", function askJ() {
  askJoker.removeEventListener("click", askJ);
  askJoker.style.border = "3px solid red";
  jokerContainer.style.visibility = "visible";
  answerCheck = [...document.querySelectorAll(".grid-item")];
  let findCorrect = answerCheck.find((correct) => correct.textContent === player.currentCorrect);
  jkr.textContent = `70% of the guests think that the correct answer is: ${findCorrect.textContent}`;
});

//Fifty-fifty JOKER listener
ffJoker.addEventListener("click", function ffJ() {
  ffJoker.removeEventListener("click", ffJ);
  ffJoker.style.border = "3px solid red";
  answerCheck = [...document.querySelectorAll(".grid-item")];
  const findCorrect = answerCheck.find((correct) => correct.textContent === player.currentCorrect);
  const findIncorrect = answerCheck.filter((incorrect) => incorrect.textContent !== player.currentCorrect);
  const findRandIncorrect = findIncorrect[Math.floor(Math.random() * findIncorrect.length)];
  let fiftyFiftyImp = [findCorrect.textContent, findRandIncorrect.textContent];
  answerCheck.forEach(function (answer) {
    if (answer.textContent === fiftyFiftyImp[0]) {
      answer.textContent = fiftyFiftyImp[0];
    } else if (answer.textContent === fiftyFiftyImp[1]) {
      answer.textContent = fiftyFiftyImp[1];
    } else {
      answer.textContent = "";
    }
  });
});
