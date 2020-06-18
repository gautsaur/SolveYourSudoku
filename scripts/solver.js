var board = [];

var backTrack = 0;
$(document).ready(function () {
  generateTable();
  $('#go').on('click', function () {
    fillBoard();
    solve(false);
  });

  $('#reset').on('click', function () {
    emptyTable();
    document.getElementById('tryAgain').innerText = 'Check if the puzzle is valid or not.';
    document.getElementById('tryAgain').parentNode.parentNode.style.display = 'block';
    document.getElementById('solveText').style.display = 'none';
  });

  $('#generate').on('click', function () {
    generateSudoku(document.getElementById('level').value);
  });

  $('#checkValidity').on('click', function () {
    if (isGivenBoardValid() == false) {
      document.getElementById('tryAgain').innerText = 'The board is not valid. Try changing the arrangement.';
    } else {
      document.getElementById('tryAgain').parentNode.parentNode.style.display = 'none';
      document.getElementById('solveText').style.display = 'block';
    };
  });
});

function solve(generateOrNot) {
  var row = -1;
  var col = -1;
  var find = findEmpty();
  if (find == null) {
    return true;
  } else {
    row = find[0];
    col = find[1];
  }
  var set = possibleSet(board, row, col);
  if (generateOrNot == true) {
    set = shuffleArray(set);
  }
  for (var i = 0; i < set.length; i++) {
    if (isValid(board, set[i], [row, col])) {
      board[row][col] = set[i];
      var id = document.getElementById(row + "_" + col);
      id.value = set[i];
      if (solve()) {
        return true;
      }
      board[row][col] = 0;
      id.value = 0;
    }
  }
  return false;
}

function isValid(givenBorad, num, position) {
  var row = position[0];
  var col = position[1];
  //check rows
  for (var i = 0; i < givenBorad[0].length; i++) {
    if (givenBorad[row][i] == num && col != i) {
      return false;
    }
  }

  //check columns
  for (var i = 0; i < givenBorad.length; i++) {
    if (givenBorad[i][col] == num && row != i) {
      return false;
    }
  }

  //check square boxes
  var boxCol = col - col % 3;
  var boxRow = row - row % 3;


  for (var i = boxRow; i < boxRow + 3; i++) {
    for (var j = boxCol; j < boxCol + 3; j++) {
      if (givenBorad[i][j] == num && i != row && col != j) {
        return false;
      }
    }
  }

  return true;
}

function generateTable() {
  var table = document.getElementById('sudokuTable');
  for (var i = 0; i < 9; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 9; j++) {
      var td = document.createElement('td');
      var textBox = document.createElement('input');
      textBox.type = 'number';
      textBox.id = i + '_' + j;
      td.appendChild(textBox);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  emptyTable();
}

function fillBoard() {
  board = [];
  for (var i = 0; i < 9; i++) {
    var a = [];
    for (var j = 0; j < 9; j++) {
      var num = document.getElementById(i + '_' + j).value;
      if (num == "" || num == null) {
        num = 0;
      }
      a.push(num);
    }
    board.push(a);
  }
}

function generateSudoku(difficultyLevel) {
  emptyTable();
  solve(true);
  var count = 1;
  while (count < difficultyLevel) {
    var i = getRandomInt(0, 9);
    var j = getRandomInt(0, 9);
    var num = document.getElementById(i + "_" + j);
    if (num.value != "") {
      board[i][j] = 0;
      num.value = "";
      count++;
    }
  }
}

function possibleSet(givenBoard, row, column) {
  var vals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (var i = 0; i < givenBoard[row].length; i++) {
    if (vals.includes(givenBoard[row][i])) {
      var a = vals.indexOf(givenBoard[row][i]);
      if (a != -1) {
        vals.splice(a, 1);
      }
    }
  }

  for (var i = 0; i < givenBoard[column].length; i++) {
    if (vals.includes(givenBoard[i][column])) {
      var a = vals.indexOf(givenBoard[i][column]);
      if (a != -1) {
        vals.splice(a, 1);
      }
    }
  }

  var boxCol = column - column % 3;
  var boxRow = row - row % 3;


  for (var i = boxRow; i < boxRow + 3; i++) {
    for (var j = boxCol * 3; j < boxCol + 3; j++) {
      if (vals.includes(givenBoard[i][j])) {
        var a = vals.indexOf(givenBoard[i][j]);
        if (a != -1) {
          vals.splice(a, 1);
        }
      }
    }
  }
  return vals;
}

//Mozill Web CDN
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function emptyTable() {
  var ab = document.querySelectorAll('input');
  for (var i = 0; i < ab.length; i++) {
    ab[i].value = "";
  }
  fillBoard();
}

function isGivenBoardValid() {
  fillBoard();
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] != 0 && isValid(board, board[i][j], [i, j]) == false) {
        return false;
      }
    }
  }
  return true;
}

function findEmpty() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] == 0)
        return [i, j]
    }
  }
  return null;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}
