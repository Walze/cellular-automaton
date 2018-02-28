const APP = new PIXI.Application(800, 600);
document.body.appendChild(APP.view);

document.addEventListener('contextmenu', event => event.preventDefault())

function make2DArray(cols, rows) {
  let arr = new Array(cols)

  for (let i = 0; i < arr.length; i++)
    arr[i] = new Array(rows)

  return arr
}


const RESO = 40
let cols = APP.view.width / RESO
let rows = APP.view.height / RESO
let grid = make2DArray(cols, rows)
let counter = 0

for (let i = 0; i < cols; i++)
  for (let j = 0; j < rows; j++) {
    let x = i * RESO
    let y = j * RESO

    grid[i][j] = new Cell({
      x,
      y,
      w: RESO - 1,
      h: RESO - 1,
      col: i,
      row: j
    })

    APP.stage.addChild(grid[i][j])

    counter++
  }


APP.ticker.add(function (delta) {

  // faster than .map()
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {

      let cell = grid[i][j]

      let state = cell.visible

      // count live neightbours
      let numNeightbours = countNeightbours(grid, cell.col, cell.row)


      if (true)
        growConditions(state, numNeightbours, cell);
      else
        notGrowConditions(state, numNeightbours, cell);
    }


});















function notGrowConditions(state, numNeightbours, cell) {
  if (!state && numNeightbours == 4) {
    cell.visible = true;
  }
  else if (state && (numNeightbours < 4 || numNeightbours > 6))
    cell.visible = false;
  else
    cell.visible = state;
}

function growConditions(state, numNeightbours, cell) {
  if (!state && numNeightbours == 3) {
    cell.visible = true;
  }
  // else if (state && (numNeightbours == 0)) {
  //   neightbours(grid, cell.col, cell.row, (neiX, neiY) => grid[neiX][neiY].visible = true);
  //   state = false;
  // }
  else if (state && (numNeightbours < 2 || numNeightbours > 3))
    cell.visible = false;
  else
    cell.visible = state;
}

function mousePressed(e) {
  const Target = e.target

  if (Target == canvas) {
    const Col = floor(e.pageX / RESO)
    const Row = floor(e.pageY / RESO)

    const Cell = grid[Col][Row]
    console.log(Cell)
    Cell.visible = !Cell.visible
  }
}


function countNeightbours(grid, x, y) {
  let sum = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols
      let row = (y + j + rows) % rows

      sum += grid[col][row].visible
    }
  }

  sum -= grid[x][y].visible
  return sum
}

function neightbours(grid, x, y, cb) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols
      let row = (y + j + rows) % rows

      cb(col, row)
    }
  }
}