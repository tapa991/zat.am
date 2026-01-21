// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    addDoc, 
    collection,
    increment} 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let username = "";

function promptForUsername() {
  let name = "";

  while (!name) {
    name = prompt("Enter your name:");

    if (name === null) {
      alert("You must enter a name to play.");
      name = "";
    } else {
      name = name.trim();
    }
  }

  username = name;
  console.log("Playing as:", username);
}


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAwqOOawElTcsBIAmJQIkZYs-W-h8kJx7A",
  authDomain: "temporary-db-e9ace.firebaseapp.com",
  projectId: "temporary-db-e9ace",
  storageBucket: "temporary-db-e9ace.firebasestorage.app",
  messagingSenderId: "810939107125",
  appId: "1:810939107125:web:25edc649d354c1ca0bee7c"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Game variables
let musicOn = true;
let userScore = 0;
let computerScore = 0;

const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");
const musicelements = document.getElementsByTagName("audio");
const musicNode = document.getElementById('music');

const gameName = "Rock Paper Scissors";

// logic functions
function computerChoice() {
    const choices = ['r','p','s'];
    return choices[Math.floor(Math.random() * 3)];
}

function win(userInput, compChoice) {
    userScore++;
    showResult(userInput, compChoice, "Win");
}

function lose(userInput, compChoice) {
    computerScore++;
    showResult(userInput, compChoice, "Lose");
}

function draw(userInput, compChoice) {
    showResult(userInput, compChoice, "Draw");
}

//adding result to UI
function showResult(userInput, compChoice, outcome) {
    const choiceNames = { r: "शिलाखण्डः ⬛", p: "पत्रम् 📜", s: "कर्तरी ✂" };
    const compChoiceName = choiceNames[compChoice];

    if (outcome === "Win") {
        result_p.innerHTML = `यन्त्रम् chose ${compChoiceName}. You Win ✅🎉`;
        document.getElementById(userInput).classList.add('win');
        setTimeout(() => document.getElementById(userInput).classList.remove('win'), 350);
        sendScoreToFirebase(1);
    } else if (outcome === "Lose") {
        result_p.innerHTML = `यन्त्रम् chose ${compChoiceName}. You Lost ❌`;
        document.getElementById(userInput).classList.add('lose');
        setTimeout(() => document.getElementById(userInput).classList.remove('lose'), 350);
        sendScoreToFirebase(0);
    } else {
        result_p.innerHTML = `यन्त्रम् chose ${compChoiceName}. It's a Draw.`;
        document.getElementById(userInput).classList.add('draw');
        setTimeout(() => document.getElementById(userInput).classList.remove('draw'), 350);
        sendScoreToFirebase(0);
    }

    updateScoreboard();
}

// Update score UI
function updateScoreboard() {
    const en2devanagari = (n) => n.toString().replace(/0/g,"०").replace(/1/g,"१").replace(/2/g,"२")
                                         .replace(/3/g,"३").replace(/4/g,"४").replace(/5/g,"५")
                                         .replace(/6/g,"६").replace(/7/g,"७").replace(/8/g,"८").replace(/9/g,"९");
    userScore_span.innerHTML = en2devanagari(userScore);
    computerScore_span.innerHTML = en2devanagari(computerScore);
}

//firebase interaction
async function sendScoreToFirebase(score) {
    const currentDate = Date.now();
    try {
        //updating score per player per game
        await setDoc(
            doc(db, "zat-am", gameName, 
                "players", username),
            { totalScore: 
                increment(score), 
                lastPlayed: currentDate },
            { merge: true }
        );

        //add round history
        await addDoc(
            collection(db, "zat-am", gameName,"gameHistory"),
            { username, timestamp: currentDate, score }
        );

        //update global leaderboard
        await setDoc(
            doc(db, "zat-am", "Global", 
                "players", username),
            { totalScore: increment(score), 
                lastPlayed: currentDate },
            { merge: true }
        );
    } catch (err) {
        console.error("Firebase error:", err);
    }
}

// user input handling (checks for username)
function game(userInput) {
    if (!username) return;

    const compChoice = computerChoice();
    const UserChoice = userInput + compChoice;

    if (["rs","pr","sp"].includes(UserChoice)) win(userInput, compChoice);
    else if (["rp","ps","sr"].includes(UserChoice)) lose(userInput, compChoice);
    else draw(userInput, compChoice);

    playSound(userInput);
}


//sound control
function playSound(evtId) {
    let inp = evtId === 'r' ? 0 : evtId === 'p' ? 1 : 2;
    Array.from(musicelements).forEach(e => e.pause());
    if (musicOn) musicelements[inp].play();
}

musicNode.onclick = () => {
    musicOn = !musicOn;
    musicNode.innerHTML = musicOn ? "Sound On" : "Sound Off";
};

//main
rock_div.addEventListener('click', () => game('r'));
paper_div.addEventListener('click', () => game('p'));
scissors_div.addEventListener('click', () => game('s'));

window.onload = () => {
  promptForUsername();
};
