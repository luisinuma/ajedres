let score = 0;
let currentQuestion = {};
let selectedPiece = null;
let canMove = false;
let currentLevel = 1;
let currentPlayer = 1;
const pieces = {
    r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
    R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙'
};

let initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let board = JSON.parse(JSON.stringify(initialBoard));

function startGame() {
    score = 0;
    currentLevel = 1;
    currentPlayer = 1;
    document.getElementById('feedback').innerText = '';
    canMove = false;
    createChessboard();
    generateQuestion();
    speak("Comienza el jugador número uno.");
}

function resetGame() {
    board = JSON.parse(JSON.stringify(initialBoard));
    startGame();
}

function nextLevel() {
    if (currentLevel < 10) {
        currentLevel++;
        generateQuestion();
    } else {
        alert("Has completado todos los niveles. ¡Buen trabajo!");
        speak("Has completado todos los niveles. ¡Buen trabajo!");
    }
}

function createChessboard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((i + j) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = i;
            square.dataset.col = j;

            if (board[i][j]) {
                square.innerText = pieces[board[i][j]];
            }

            square.addEventListener('click', () => handleSquareClick(i, j));
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (selectedPiece) {
        movePiece(row, col);
    } else {
        selectPiece(row, col);
    }
}

function selectPiece(row, col) {
    if (!canMove) return;
    if (board[row][col] !== '') {
        if (selectedPiece) {
            document.querySelector(`.square[data-row="${selectedPiece.row}"][data-col="${selectedPiece.col}"]`).classList.remove('selected');
        }
        selectedPiece = { row, col };
        document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
    }
}

function movePiece(row, col) {
    if (!canMove || !selectedPiece) return;

    if (board[row][col] === '') {
        board[row][col] = board[selectedPiece.row][selectedPiece.col];
        board[selectedPiece.row][selectedPiece.col] = '';
        selectedPiece = null;
        canMove = false;
        createChessboard();
        generateQuestion();
        speak("Pieza movida. Responde la siguiente pregunta.");
        togglePlayer();
    } else {
        document.querySelector(`.square[data-row="${selectedPiece.row}"][data-col="${selectedPiece.col}"]`).classList.remove('selected');
        selectedPiece = null;
    }
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let question, answer;
    switch (operation) {
        case '+':
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
            break;
        case '*':
            question = `${num1} * ${num2}`;
            answer = num1 * num2;
            break;
        case '/':
            question = `${num1} / ${num2}`;
            answer = parseFloat((num1 / num2).toFixed(2)); // Redondeado a 2 decimales
            break;
    }

    currentQuestion = { question, answer };
    document.getElementById('question').innerText = `Nivel ${currentLevel}: ${question}`;
    document.getElementById('answer').value = '';
    speak(`Nivel ${currentLevel}: ${num1} ${operation} ${num2}`);
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const feedback = document.getElementById('feedback');

    if (userAnswer === currentQuestion.answer) {
        score++;
        feedback.innerText = '¡Correcto! Puedes mover una pieza.';
        canMove = true;
        speak("¡Correcto! Puedes mover una pieza.");
    } else {
        feedback.innerText = `Incorrecto. La respuesta correcta es ${currentQuestion.answer}. Intenta otra vez.`;
        speak(`Incorrecto. La respuesta correcta es ${currentQuestion.answer}. Intenta otra vez.`);
    }

    document.getElementById('score').innerText = 'Puntuación: ' + score;
    if (!canMove) generateQuestion();
}

function togglePlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    speak(`Le toca al jugador número ${currentPlayer}.`);
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
}

// Inicializar el juego al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    startGame();
});
