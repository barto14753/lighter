const lighterRadius = 50;
const lightGranularity = 15;
const wallMargin = 100;
const wallWidth = 500;
const wallHeight = 50;

let lighter = [window.innerWidth / 2, window.innerHeight / 2];
let walls = [
  [wallMargin, wallMargin, wallWidth, wallHeight],
  [
    window.innerWidth - wallWidth - wallMargin,
    wallMargin,
    wallWidth,
    wallHeight,
  ],
  [
    wallMargin,
    window.innerHeight - wallHeight - wallMargin,
    wallWidth,
    wallHeight,
  ],
  [
    window.innerWidth - wallWidth - wallMargin,
    window.innerHeight - wallHeight - wallMargin,
    wallWidth,
    wallHeight,
  ],
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(24);
  drawLighter();
  drawWalls();
  drawLight();
}

function drawLighter() {
  if (!wallCollision(mouseX, mouseY)) {
    console.log(mouseX, mouseY);
    lighter = [mouseX, mouseY];
  }
  fill(255, 255, 255);
  ellipse(lighter[0], lighter[1], lighterRadius, lighterRadius);
}

function drawWalls() {
  fill(0, 255, 0);
  for (const wall of walls) {
    rect(wall[0], wall[1], wall[2], wall[3]);
  }
}

function drawLight() {
  stroke(255);
  for (let i = 0; i < window.innerWidth; i += lightGranularity) {
    for (let j = 0; j < window.innerHeight; j += lightGranularity) {
      drawLine(lighter[0], lighter[1], i, 0);
      drawLine(lighter[0], lighter[1], 0, j);
      drawLine(lighter[0], lighter[1], i, window.innerHeight);
      drawLine(lighter[0], lighter[1], window.innerWidth, j);
    }
  }
}

function drawLine(from_x, from_y, to_x, to_y) {
  let x = calculateLineX(from_x, from_y, to_x, to_y);
  let y = calculateLineY(from_x, from_y, to_x, to_y);

  let nearest_x = to_x;
  let nearest_y = to_y;
  let nearest_dist = calculateDist(from_x, from_y, to_x, to_y);

  for (const wall of walls) {
    // x
    _left = wall[0];
    _right = wall[0] + wall[2];

    // y
    _top = wall[1];
    _bottom = wall[1] + wall[3];

    point_left = x(_left);
    point_right = x(_right);
    point_top = y(_top);
    point_bottom = y(_bottom);

    for (const point of [
      [_left, point_left],
      [_right, point_right],
      [point_top, _top],
      [point_bottom, _bottom],
    ]) {
      if (
        point[0] >= _left &&
        point[0] <= _right &&
        point[1] >= _top &&
        point[1] <= _bottom
      ) {
        let x = point[0];
        let y = point[1];
        let dist = calculateDist(from_x, from_y, x, y);
        let isSameDirection = sameDirection(from_x, from_y, to_x, to_y, x, y);
        if (dist < nearest_dist && isSameDirection) {
          nearest_dist = dist;
          nearest_x = x;
          nearest_y = y;
        }
      }
    }
  }
  line(from_x, from_y, nearest_x, nearest_y);
}

function sameDirection(from_x, from_y, to_x, to_y, x, y) {
  return (
    (to_x - from_x) * (x - from_x) >= 0 && (to_y - from_y) * (y - from_y) >= 0
  );
}

function wallCollision(x, y) {
  for (const wall of walls) {
    // x
    _left = wall[0];
    _right = wall[0] + wall[2];

    // y
    _top = wall[1];
    _bottom = wall[1] + wall[3];
    if (x > _left && x < _right && y > _top && y < _bottom) {
      return true;
    }
  }
  return false;
}
function calculateDist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function calculateLineX(x1, y1, x2, y2) {
  let m = (y2 - y1) / (x2 - x1);
  return (x) => m * (x - x1) + y1;
}

function calculateLineY(x1, y1, x2, y2) {
  let m = (y2 - y1) / (x2 - x1);
  return (y) => (y - y1) / m + x1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
