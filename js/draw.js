
// ===================================
// 作戦線描画機能
// マウス・タッチ操作に対応
// ===================================

let isDrawing = false;
let eraseDrawing = false;

let eraserLine = null;

// 現在描画している線
let line = null;

// ===================================
// 作戦盤内部の座標を取得
// ===================================

function getDrawPosition() {
  // 描画レイヤーを基準に座標を取得する
  // コートの拡大縮小や位置調整にも対応
  return drawLayer.getRelativePointerPosition();
}

// ===================================
// 描画開始
// ===================================

stage.on("pointerdown", () => {

  const pos = getDrawPosition();

  // 座標を取得できなかった場合は終了
  if (!pos) return;

  // 消しゴムモード
  if (eraseMode) {

    eraseDrawing = true;

    eraserLine = new Konva.Line({
      points: [pos.x, pos.y],
      stroke: "black",
      strokeWidth: 25,
      lineCap: "round",
      lineJoin: "round",
      globalCompositeOperation: "destination-out",
      listening: false
    });

    drawLayer.add(eraserLine);
    drawLayer.batchDraw();

    return;
  }

  // 線描画モードでなければ終了
  if (!drawMode) return;

  // 新しい線を描画
  isDrawing = true;

  line = new Konva.Line({
    points: [pos.x, pos.y],
    stroke: "red",
    strokeWidth: 4,
    lineCap: "round",
    lineJoin: "round",
    listening: true
  });

  // 消しゴムモード中に線をタップしたら削除
  line.on("click tap", () => {
    if (!eraseMode) return;

    line.destroy();
  });

  drawLayer.add(line);
  lines.push(line);

  drawLayer.batchDraw();
});

// ===================================
// 描画中
// ===================================

stage.on("pointermove", () => {

  const pos = getDrawPosition();

  if (!pos) return;

  // 消しゴムで描画中
  if (eraseMode && eraseDrawing && eraserLine) {

    const points = eraserLine.points().concat([
      pos.x,
      pos.y
    ]);

    eraserLine.points(points);

    drawLayer.batchDraw();

    return;
  }

  // 通常の線を描画中
  if (!drawMode || !isDrawing || !line) return;

  const points = line.points().concat([
    pos.x,
    pos.y
  ]);

  line.points(points);

  drawLayer.batchDraw();
});

// ===================================
// 描画終了
// ===================================

stage.on("pointerup pointercancel", () => {

  isDrawing = false;
  eraseDrawing = false;

  line = null;
  eraserLine = null;

});

// ===================================
// 線描画モードのON/OFF
// ===================================

function toggleDrawMode() {

  drawMode = !drawMode;

  if (drawMode) {
    // 線描画と消しゴムは同時に使わない
    eraseMode = false;
    alert("線描画モード ON");
  } else {
    alert("線描画モード OFF");
  }
}

// ===================================
// 最後に描いた線を削除
// ===================================

function eraseLine() {

  const lastLine = lines.pop();

  if (lastLine) {
    lastLine.destroy();
    drawLayer.batchDraw();
  }
}

// ===================================
// すべての作戦線を削除
// ===================================

function clearLines() {

  lines.forEach(line => {
    line.destroy();
  });

  lines = [];

  drawLayer.batchDraw();
}

// ===================================
// 消しゴムモードのON/OFF
// ===================================

function toggleEraseMode() {

  eraseMode = !eraseMode;

  if (eraseMode) {
    drawMode = false;
    alert("消しゴムモード ON");
  } else {
    alert("消しゴムモード OFF");
  }
}
