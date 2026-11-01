// ===================================
// ベンチスクロール用の変数
// ===================================

// 味方ベンチのスクロール量
let myBenchScrollY = 0;

// 相手ベンチのスクロール量
let enemyBenchScrollY = 0;

// 選手同士の間隔
const benchScrollSpeed = 55;

// ベンチの一番上の位置
const benchTopY = 45;

// ベンチに表示できる人数
const benchVisiblePlayers = 100;

// ===================================
// 味方控え選手の表示位置を上に移動
// ===================================
function scrollBenchUp() {

  // 表示開始位置が0より大きい場合
  // 表示する選手の位置を1つ上に移動する
  if (myBenchStart > 0) {
    myBenchStart--;
  }

  // ベンチの選手表示を更新する
  updateBench();
}


// ===================================
// 味方控え選手の表示位置を下に移動
// ===================================
function scrollBenchDown() {

  // まだ下に表示できる選手がいる場合
  // 表示する選手の位置を1つ下に移動する
  if (myBenchStart < myBenchPlayers.length - visibleCount) {
    myBenchStart++;
  }

  // ベンチの選手表示を更新する
  updateBench();
}


// ===================================
// ベンチの選手表示を更新
// ===================================
function updateBench() {

  // ベンチ選手の位置を更新する
  updateBenchScroll();

  // 画面を更新する
  courtLayer.draw();
}

// ===================================
// ベンチ選手の位置と表示状態を更新
// ===================================


function updateBenchScroll() {

  // ===================================
  // ベンチの表示範囲
  // ===================================

  const benchTop = 0;
  const benchHeight = 950;
  const playerRadius = 15;

  // コマ全体がベンチ内に収まる範囲
  const minY = benchTop + playerRadius;
  const maxY = benchTop + benchHeight - playerRadius;

  // コマを表示できる範囲の高さ
  const visibleHeight = maxY - minY;

  // ===================================
  // ベンチのスクロール位置を調整
  // ===================================

  const maxMyScroll = Math.max(
    0,
    (myBenchPlayers.length - 1) * benchScrollSpeed
    - visibleHeight
  );

  const maxEnemyScroll = Math.max(
    0,
    (enemyBenchPlayers.length - 1) * benchScrollSpeed
    - visibleHeight
  );

  // スクロール量が範囲外にならないようにする
  myBenchScrollY = Math.max(
    -maxMyScroll,
    Math.min(0, myBenchScrollY)
  );

  enemyBenchScrollY = Math.max(
    -maxEnemyScroll,
    Math.min(0, enemyBenchScrollY)
  );

  // ===================================
  // 味方ベンチ
  // ===================================


  myBenchPlayers.forEach((player, index) => {

    const y =
      benchTopY +
      index * benchScrollSpeed +
      myBenchScrollY;

    player.position({
      x: 40,
      y: y
    });

    // ベンチの範囲内だけ表示
    player.visible(y >= minY && y <= maxY);
  });


  // ===================================
  // 相手ベンチ
  // ===================================

  enemyBenchPlayers.forEach((player, index) => {

    let y =
      benchTopY +
      index * benchScrollSpeed +
      enemyBenchScrollY;



    player.position({
      x: 2115,
      y: y
    });

    // ベンチの範囲内だけ表示
    player.visible(y >= minY && y <= maxY);
  });

  // 再描画
  courtLayer.batchDraw();
  benchLayer.batchDraw();
}



// ========================================
// ベンチのスクロール処理
// 左右のベンチをそれぞれ独立してスクロールする
// ========================================

stage.on("wheel", function (e) {

  // マウスの現在位置を取得
  const pointer = getBoardPointerPosition();

  // 座標が取得できなかった場合は終了
  if (!pointer) {
    return;
  }


  // ========================================
  // 左側の味方ベンチ
  // ========================================
  if (pointer.x >= 0 && pointer.x <= 100) {

    if (myBenchPlayers.length > 20) {

      if (e.evt.deltaY > 0) {
        myBenchScrollY -= benchScrollSpeed;
      } else {
        myBenchScrollY += benchScrollSpeed;
      }

      updateBenchScroll();

      courtLayer.batchDraw();
      benchLayer.batchDraw();

      e.evt.preventDefault();
    }
  }

  // ========================================
  // 右側の相手ベンチ
  // ========================================
  if (pointer.x >= 1800 && pointer.x <= 1950) {

    if (enemyBenchPlayers.length > 15) {

      if (e.evt.deltaY > 0) {
        enemyBenchScrollY -= benchScrollSpeed;
      } else {
        enemyBenchScrollY += benchScrollSpeed;
      }

      updateBenchScroll();

      courtLayer.batchDraw();
      benchLayer.batchDraw();

      e.evt.preventDefault();
    }
  }


});

