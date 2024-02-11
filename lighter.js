let lighter = [window.innerWidth / 2, window.innerHeight / 2];
let walls = [
  [100, 100, 500, 50],
  [800, 100, 500, 50],
  [100, 450, 500, 50],
  [800, 450, 500, 50],
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
  fill(255, 255, 0);
  ellipse(lighter[0], lighter[1], 50, 50);
}

function drawWalls() {
  fill(0, 255, 0);
  for (const wall of walls) {
    rect(wall[0], wall[1], wall[2], wall[3]);
  }
}

function drawLight() {
  //stroke(250);
  //strokeWeight(150);
  for (let i = 0; i < window.innerWidth; i += 25) {
    for (let j = 0; j < window.innerHeight; j += 25) {
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

  if (x(from_y) !== from_x) {
    //console.log(x(from_y), from_x);
  }

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

    //console.log(_left, _right, _top, _bottom);

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
        let dist = calculateDist(from_x, from_y, point[0], point[1]);
        if (dist < nearest_dist) {
          nearest_dist = dist;
          nearest_x = point[1];
          nearest_y = point[0];
        }
      }
    }
  }
  line(from_x, from_y, nearest_x, nearest_y);
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
