// ===================================
// 最初からいる選手を保存する配列
// ===================================
let initialMyPlayers = {};
let initialEnemyPlayers = {};

// ===================================
// 初期選手配置処理
// 味方5人、相手5人、ボールを生成
// ===================================



function drawPlayers() {

  // iPad用かPC用かを判定
  const isIPad = window.innerWidth <= 1100;

  let myPositions;
  let enemyPositions;

  // ===================================
  // オールコートの初期配置
  // ===================================
  if (currentCourt === "full") {

    if (isIPad) {
      // iPad用：味方
      myPositions = [
        { x: 790, y: 440 }, // 味方1
        { x: 650, y: 200 }, // 味方2
        { x: 650, y: 750 }, // 味方3
        { x: 200, y: 60 }, // 味方4
        { x: 200, y: 890 }  // 味方5
      ];

      // iPad用：相手
      enemyPositions = [
        { x: 700, y: 440 }, // 相手1
        { x: 590, y: 250 }, // 相手2
        { x: 590, y: 700 }, // 相手3
        { x: 200, y: 140 }, // 相手4
        { x: 200, y: 800 }  // 相手5
      ];

    } else {
      // PC用：味方
      myPositions = [
        { x: 780, y: 460 }, // 味方1
        { x: 600, y: 200 }, // 味方2
        { x: 600, y: 750 }, // 味方3
        { x: 210, y: 110 }, // 味方4
        { x: 210, y: 830 }  // 味方5
      ];

      // PC用：相手
      enemyPositions = [
        { x: 700, y: 460 }, // 相手1
        { x: 560, y: 265 }, // 相手2
        { x: 560, y: 680 }, // 相手3
        { x: 210, y: 190 }, // 相手4
        { x: 210, y: 750 }  // 相手5
      ];
    }

  } else {

    // ===================================
    // ハーフコートの初期配置
    // ===================================
    if (isIPad) {
      // iPad用：味方
      myPositions = [
        { x: 1050, y: 280 },
        { x: 620, y: 390 },
        { x: 1500, y: 390 },
        { x: 300, y: 830 },
        { x: 1840, y: 830 }
      ];

      // iPad用：相手
      enemyPositions = [
        { x: 1050, y: 350 },
        { x: 650, y: 450 },
        { x: 1470, y: 460 },
        { x: 400, y: 830 },
        { x: 1750, y: 830 }
      ];

    } else {
      // PC用：味方
      myPositions = [
        { x: 1050, y: 300 },
        { x: 620, y: 390 },
        { x: 1500, y: 390 },
        { x: 280, y: 790 },
        { x: 1850, y: 790 }
      ];

      // PC用：相手
      enemyPositions = [
        { x: 1050, y: 370 },
        { x: 660, y: 450 },
        { x: 1470, y: 450 },
        { x: 370, y: 790 },
        { x: 1770, y: 790 }
      ];
    }
  }


  // ===================================
  // 味方選手を個別に配置
  // ===================================
  for (let i = 0; i < 5; i++) {

    const player = createPlayer(
      myPositions[i].x,
      myPositions[i].y,
      i + 1,
      "自" + (i + 1),
      "#ea580c"
    );

    player.setAttr("initialPlayer", true);
    player.setAttr("initialNumber", i + 1);
    player.setAttr("team", "my");

    initialMyPlayers[i + 1] = player;
  }

  // ===================================
  // 相手選手を個別に配置
  // ===================================
  for (let i = 0; i < 5; i++) {

    // 選手を作成して変数に保存
    const player = createPlayer(
      enemyPositions[i].x,
      enemyPositions[i].y,
      i + 1,
      "相" + (i + 1),
      "#2563eb"
    );

    // 最初からいる選手として登録
    player.setAttr("initialPlayer", true);
    player.setAttr("initialNumber", i + 1);
    player.setAttr("team", "enemy");

    // 初期選手を番号ごとに保存
    initialEnemyPlayers[i + 1] = player;
  }


  // ===================================
  // ボールの初期配置
  // ===================================

  // PC用・iPad用の位置を設定
  let ballX;
  let ballY;

  // オールコート
  if (currentCourt === "full") {

    if (isIPad) {
      // iPad用：オールコート
      ballX = 770;
      ballY = 395;
    } else {
      // PC用：オールコート
      ballX = 750;
      ballY = 415;
    }

  } else {

    // ハーフコート
    if (isIPad) {
      // iPad用：ハーフコート
      ballX = 1000;
      ballY = 300;
    } else {
      // PC用：ハーフコート
      ballX = 1000;
      ballY = 320;
    }
  }

  // バスケットボールを作成
  ball = new Konva.Circle({
    x: ballX,
    y: ballY,
    radius: 15,
    fill: "orange",
    stroke: "black",
    strokeWidth: 2,
    draggable: true
  });

  // コートレイヤーに追加
  courtLayer.add(ball);
}




// ===================================
// 味方控え選手追加
// 左側のベンチに選手を追加する
// ===================================

function addMyPlayer() {

  // 味方選手の背番号を入力する
  const number = prompt("味方の背番号");

  // 「キャンセル」が押された場合は処理を終了する
  if (number === null) return;


  // 味方選手の名前を入力する
  const name = prompt("味方の名前");

  // 「キャンセル」が押された場合は処理を終了する
  if (name === null) return;


  // ===================================
  // 選手を作成する
  // ===================================

  const player = createPlayer(
    35,          // X座標
    benchTopY - 100,   // Y座標
    number,      // 背番号
    name,        // 名前
    "#ea580c"    // 味方選手の色
  );


  // 味方ベンチの配列に追加する
  myBenchPlayers.push(player);


  // ===================================
  // 15人を超えた場合
  // 一番下の選手が見える位置までスクロールする
  // ===================================

  if (myBenchPlayers.length > benchVisiblePlayers) {

    const maxScroll =
      (myBenchPlayers.length - benchVisiblePlayers) *
      benchScrollSpeed;

    myBenchScrollY = -maxScroll;

  }


  // ===================================
  // ベンチの位置と表示状態を更新
  // ===================================

  updateBenchScroll();


  // 画面を更新する
  courtLayer.draw();

}


// ===================================
// 相手控え選手追加
// 右側ベンチへ追加
// ===================================

function addEnemyPlayer() {

  // 相手選手の背番号を入力してもらう
  const number = prompt("相手の背番号");

  // キャンセルされた場合は処理を終了する
  if (number === null) return;

  // 相手選手の名前を入力してもらう
  const name = prompt("相手の名前");

  // キャンセルされた場合は処理を終了する
  if (name === null) return;

  // PC用かiPad用かを判定
  const isIPad = window.innerWidth <= 1100;

  // 選手を追加する位置
  const playerX = isIPad ? 2115 : 2115;

  // 入力された情報を使って相手選手を作成する
  const player = createPlayer(
    playerX,        // 選手のX座標
    enemyBenchY, // 現在の相手ベンチのY座標
    number,      // 入力された背番号
    name,        // 入力された名前
    "#2563eb"    // 相手の色
  );

  // 相手ベンチ選手の配列に保存
  enemyBenchPlayers.push(player);

  // 次に追加する選手の位置を50下にずらす
  enemyBenchY += 50;

  // 15人を超えた場合は一番下までスクロールする
  if (enemyBenchPlayers.length > 15) {

    const maxScroll =
      (enemyBenchPlayers.length - 15) * benchScrollSpeed;

    enemyBenchScrollY = -maxScroll;

  }

  // ベンチ選手の位置を更新
  updateBenchScroll();

  // 作戦盤を再描画する
  courtLayer.draw();

}


// ===================================
// 選択中の選手削除
// ===================================

function deleteSelectedPlayer() {

  // 選手が選択されていない場合
  if (selectedPlayer == null) {

    // 選手を選択するようにメッセージを表示する
    alert("選手を選択してください");

    // 処理を終了する
    return;
  }

  // -----------------------------------
  // ベンチ選手の場合はベンチ配列からも削除する
  // -----------------------------------

  // 味方ベンチから削除
  myBenchPlayers = myBenchPlayers.filter(
    player => player !== selectedPlayer
  );

  // 相手ベンチから削除
  enemyBenchPlayers = enemyBenchPlayers.filter(
    player => player !== selectedPlayer
  );

  // -----------------------------------
  // players配列から削除
  // -----------------------------------

  players = players.filter(
    player => player !== selectedPlayer
  );

  // -----------------------------------
  // 作戦盤から削除
  // -----------------------------------

  selectedPlayer.destroy();

  // 選択中の選手を解除
  selectedPlayer = null;

  // -----------------------------------
  // ベンチの表示位置を詰める
  // -----------------------------------

  myBenchPlayers.forEach((player, index) => {
    player.position({
      x: 35,
      y: 100 + (index * 50)
    });
  });

  enemyBenchPlayers.forEach((player, index) => {
    player.position({
      x: 1880,
      y: 100 + (index * 50)
    });
  });

  // ベンチの位置を更新
  myBenchY = 100 + (myBenchPlayers.length * 50);
  enemyBenchY = 100 + (enemyBenchPlayers.length * 50);

  // 作戦盤を再描画
  courtLayer.draw();

  // ベンチ表示を更新
  updateBench();
}


// ===================================
// 1つ前の移動状態へ戻す
// ===================================

function undoMove() {

  // 操作履歴から最後の操作を取り出す
  const last = history.pop();

  // 戻す操作が存在する場合
  if (last) {

    // 選手を操作前の位置に戻す
    last.player.position({
      x: last.x, // 操作前のX座標
      y: last.y  // 操作前のY座標
    });

    // 作戦盤を再描画する
    courtLayer.draw();

  }

}


// ===================================
// フォーメーション配置
// あらかじめ登録した位置へ移動
// ===================================

function setFormation() {

  // 選手を配置する位置をあらかじめ設定する
  // [X座標, Y座標]の順番で指定
  const positions = [

    // 味方側の配置位置
    [300, 450],
    [500, 450],
    [700, 450],
    [400, 300],
    [600, 300],

    // 相手側の配置位置
    [300, 200],
    [500, 200],
    [700, 200],
    [400, 100],
    [600, 100]

  ];


  // players配列に入っている選手を順番に処理する
  players.forEach((player, index) => {

    // 選手に対応する配置位置が存在する場合
    if (positions[index]) {

      // 選手を指定された位置へ移動する
      player.position({
        x: positions[index][0], // X座標を設定
        y: positions[index][1]  // Y座標を設定
      });

    }

  });


  // 移動した選手を画面に反映するため再描画する
  courtLayer.draw();

}

// ===================================
// フォーメーション削除
// 登録したフォーメーションを削除する
// ===================================

function deleteFormation() {

  // フォーメーションが1つも登録されていない場合
  if (formations.length === 0) {

    alert("登録されているフォーメーションがありません");

    return;
  }


  // ===================================
  // 削除するフォーメーションを選択
  // ===================================

  let message = "削除するフォーメーションを選択してください\n\n";


  // 登録されているフォーメーションを一覧表示
  formations.forEach((formation, index) => {

    message += (index + 1) + "：" + formation.name + "\n";

  });


  // 削除する番号を入力
  const choice = prompt(message);


  // キャンセルされた場合
  if (choice === null) {

    return;

  }


  // 入力された番号を配列の番号に変換
  const index = Number(choice) - 1;


  // 正しい番号か確認
  if (!formations[index]) {

    alert("正しい番号を入力してください");

    return;

  }


  // ===================================
  // フォーメーションを削除
  // ===================================

  // 削除するフォーメーションの名前を保存
  const name = formations[index].name;


  // formations配列から1つ削除
  formations.splice(index, 1);


  // フォーメーション一覧を更新
  updateFormationList();


  // 削除完了メッセージ
  alert("「" + name + "」を削除しました");

}


// ===================================
// フォーメーション選択
// ===================================

function selectFormation() {

  if (formations.length === 0) {
    alert("登録されているフォーメーションがありません");
    return;
  }

  let message = "フォーメーションを選択してください\n\n";

  formations.forEach((formation, index) => {
    message += (index + 1) + "：" + formation.name + "\n";
  });

  const choice = prompt(message);

  if (choice === null) {
    return;
  }

  const index = Number(choice) - 1;

  if (!formations[index]) {
    alert("正しい番号を入力してください");
    return;
  }

  // 選択したフォーメーション
  const formation = formations[index];

  // 保存した座標に選手を移動
  formation.positions.forEach((position, i) => {
    if (players[i]) {
      players[i].position({
        x: position.x,
        y: position.y
      });
    }
  });

  // ボールを保存した位置へ移動
  if (formation.ballPosition && ball) {
    ball.position({
      x: formation.ballPosition.x,
      y: formation.ballPosition.y
    });
  }

  // 再描画
  courtLayer.batchDraw();
}



// ===================================
// フォーメーション追加
// 現在の選手配置を保存
// ===================================

function addFormation() {

  const name = prompt("フォーメーション名を入力してください");

  if (name === null || name === "") {
    return;
  }

  // 現在の選手位置を保存
  const positions = players.map(player => ({
    x: player.x(),
    y: player.y()
  }));

  // ボールの位置を保存
  const ballPosition = {
    x: ball.x(),
    y: ball.y()
  };

  formations.push({
    name: name,
    positions: positions
  });

  // 一覧を更新
  updateFormationList();

  alert("「" + name + "」を追加しました");

  console.log("追加したフォーメーション：", formations);

}

