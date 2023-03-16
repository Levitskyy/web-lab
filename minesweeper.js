const CELL_SIZE = 40;
const NUM_ROWS = 10;
const NUM_COLS = 10;
const NUM_MINES = 20;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let SAFE_CELLS = 0;
let board = [];
let cell_status = [];
let is_flagged = [];

let GAME_LOST = false;

// initialize the game board
function initBoard() {
   SAFE_CELLS = NUM_ROWS * NUM_COLS - NUM_MINES;
   // create empty board
   board = new Array(NUM_ROWS);
   cell_status = new Array(NUM_ROWS);
   is_flagged = new Array(NUM_ROWS);
   for (let row = 0; row < NUM_ROWS; row++) {
      board[row] = new Array(NUM_COLS).fill(null);
      cell_status[row] = new Array(NUM_COLS).fill(false);
      is_flagged[row] = new Array(NUM_COLS).fill(false);
   }

   // place mines
   let numMinesPlaced = 0;
   while (numMinesPlaced < NUM_MINES) {
      const row = Math.floor(Math.random() * NUM_ROWS);
      const col = Math.floor(Math.random() * NUM_COLS);
      if (board[row][col] !== "mine") {
         board[row][col] = "mine";
         numMinesPlaced++;
      }
   }

   // calculate numbers
   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
         if (board[row][col] !== "mine") {
            let numMines = 0;
            for (let i = -1; i <= 1; i++) {
               for (let j = -1; j <= 1; j++) {
                  const r = row + i;
                  const c = col + j;
                  if (
                     r >= 0 &&
                     r < NUM_ROWS &&
                     c >= 0 &&
                     c < NUM_COLS &&
                     board[r][c] === "mine"
                  ) {
                     numMines++;
                  }
               }
            }
            board[row][col] = numMines;
         }
      }
   }
}

// reveal a cell
function revealCell(row, col) {
   if (board[row][col] != "mine") {
      --SAFE_CELLS;
      if (!SAFE_CELLS && !GAME_LOST) {
         alert("You win!");
         revealBoard();
         return;
      }
   }
   cell_status[row][col] = true;
   if (board[row][col] == 0) {
      for (let r = -1; r <= 1; ++r) {
         for (let c = -1; c <= 1; ++c) {
            const temp_r = row + r;
            const temp_c = col + c;
            if (
               temp_r >= 0 &&
               temp_r < NUM_ROWS &&
               temp_c >= 0 &&
               temp_c < NUM_COLS &&
               cell_status[temp_r][temp_c] == false
            )
               revealCell(temp_r, temp_c);
         }
      }
   }
}

// toggle a flag on a cell
function toggleFlag(row, col) {
   if (cell_status[row][col] == false) {
      if (!is_flagged[row][col]) {
         is_flagged[row][col] = true;
      } else {
         is_flagged[row][col] = false;
      }
      drawBoard();
   }
}

// reveal the entire board
function revealBoard() {
   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
         revealCell(row, col);
      }
   }
   drawBoard();
}

// draw the game board
function drawBoard() {
   context.clearRect(0, 0, canvas.width, canvas.height);

   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
         const cell = board[row][col];
         const isCellOpened = cell_status[row][col];
         const isCellFlagged = is_flagged[row][col];
         if (isCellOpened) {
            if (cell === null || cell === "flag") {
               context.fillStyle = "#ccc";
            } else if (cell === "mine") {
               context.fillStyle = "red";
            } else {
               context.fillStyle = "white";
            }

            context.fillRect(
               col * CELL_SIZE,
               row * CELL_SIZE,
               CELL_SIZE,
               CELL_SIZE
            );

            if (typeof cell === "number") {
               context.fillStyle = "black";
               context.font = "bold 16px Arial";
               context.fillText(
                  cell.toString(),
                  col * CELL_SIZE + CELL_SIZE / 3,
                  row * CELL_SIZE + (CELL_SIZE * 2) / 3
               );
            }
         } else {
            if (isCellFlagged) {
               context.fillStyle = "green";
               context.fillRect(
                  col * CELL_SIZE,
                  row * CELL_SIZE,
                  CELL_SIZE,
                  CELL_SIZE
               );
               context.fillStyle = "black";
               context.font = "bold 16px Arial";
               context.fillText(
                  "F",
                  col * CELL_SIZE + CELL_SIZE / 3,
                  row * CELL_SIZE + (CELL_SIZE * 2) / 3
               );
            } else {
               context.fillStyle = "white";
               context.fillRect(
                  col * CELL_SIZE,
                  row * CELL_SIZE,
                  CELL_SIZE,
                  CELL_SIZE
               );
               context.fillStyle = "black";
               context.fillRect(
                  col * CELL_SIZE,
                  row * CELL_SIZE,
                  CELL_SIZE - 2,
                  CELL_SIZE - 2
               );
            }
         }
      }
   }
}

// handle mouse down event
function handleMouseDown(event) {
   const row = Math.floor(event.clientY / CELL_SIZE);
   const col = Math.floor(event.clientX / CELL_SIZE);

   if (event.button === 0) {
      // left-click
      if (board[row][col] === "mine") {
         GAME_LOST = true;
         revealBoard();
         alert("Game Over");
         return;
      }
      revealCell(row, col);
   } else if (event.button === 1) {
      // right-click
      toggleFlag(row, col);
   }

   drawBoard();
}

// initialize the game board and canvas
function init() {
   initBoard();

   canvas.width = NUM_COLS * CELL_SIZE;
   canvas.height = NUM_ROWS * CELL_SIZE;

   canvas.addEventListener("mousedown", handleMouseDown);

   drawBoard();
}

init();
