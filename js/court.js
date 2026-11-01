// ===================================
// コート描画に関する変数
// ===================================

// 現在表示しているコートを入れる変数
let court;

// コートの大きさを変更するためのTransformer
let courtTransformer;

// コート編集モードがONかOFFかを管理する変数
let courtEditMode = false;


// ===================================
// コート描画
// ===================================

function drawCourt() {

  // ===================================
  // コート画像を切り替える
  // ===================================

  if (currentCourt === "full") {

    document.getElementById("container").style.backgroundImage =
      'url("バスケコート.png")';

  } else if (currentCourt === "half") {

    document.getElementById("container").style.backgroundImage =
      'url("ハーフコート.png")';

  }


  // drawCourt関数が実行されたことを確認
  console.log("drawCourtが実行されました");


  // ===================================
  // コートレイヤーを初期化
  // ===================================

  // removeChildren()を使うことで
  // ベンチ選手そのものは削除せず、
  // 一度レイヤーから外すだけにする
  courtLayer.removeChildren();


  // ===================================
  // 古い選手の配列を空にする
  // ===================================

  // ここが重要
  // 新しい選手を作る前にplayersを空にする
  players = [];


  // ===================================
  // ベンチを作成
  // ===================================

  // 左ベンチ
  courtLayer.add(new Konva.Rect({

    x: 5,
    y: 0,
    width: 70,
    height: 950,
    fill: "#eeeeee",
    stroke: "black"

  }));


  // 右ベンチ
  courtLayer.add(new Konva.Rect({

    x: 2080,
    y: 0,
    width: 70,
    height: 950,
    fill: "#eeeeee",
    stroke: "black"

  }));


  // ===================================
  // 選手を初期配置
  // ===================================
  drawPlayers();

  // ===================================
  // コートごとの保存位置を取得
  // ===================================

  let savedPositions;

  if (currentCourt === "full") {

    savedPositions = fullCourtPositions;

  } else {

    savedPositions = halfCourtPositions;

  }


  // ===================================
  // 保存した位置を選手に適用
  // ===================================

  if (savedPositions && savedPositions.length > 0) {

    // コート上の10人に保存位置を適用する
    players.slice(0, 10).forEach((player, i) => {

      if (savedPositions[i]) {

        player.position({

          x: savedPositions[i].x,
          y: savedPositions[i].y

        });

      }

    });

  }


  // ===================================
  // ベンチ選手を元に戻す
  // ===================================

  // 一度removeChildren()で外した
  // 味方ベンチ選手をレイヤーに戻す
  myBenchPlayers.forEach(player => {

    benchLayer.add(player);

    // players配列にも戻す
    players.push(player);

  });

  // 一度removeChildren()で外した
  // 相手ベンチ選手をレイヤーに戻す
  enemyBenchPlayers.forEach(player => {

    benchLayer.add(player);

    // players配列にも戻す
    players.push(player);

  });

  // ベンチ選手が表示範囲からはみ出さないようにする
  benchLayer.clip({
    x: 0,
    y: 80,
    width: stageWidth,
    height: 760
  });

  // ===================================
  // 再描画
  // ===================================

  courtLayer.draw();
  benchLayer.draw();
  drawLayer.draw();

}


// ===================================
// コート編集モードの切り替え
// ===================================

function toggleCourtEdit() {

  // コート編集モードをON/OFF切り替える
  courtEditMode = !courtEditMode;


  // 編集モードがONの場合
  if (courtEditMode) {

    // コートをマウスで移動できるようにする
    court.draggable(true);

    // コートをTransformerの対象にする
    courtTransformer.nodes([court]);


    // 編集モードがOFFの場合
  } else {

    // コートをマウスで移動できないようにする
    court.draggable(false);

    // Transformerの選択を解除する
    courtTransformer.nodes([]);
  }


  // 変更した内容を画面に反映する
  courtLayer.draw();
}


// ===================================
// コート切替
// ===================================

function changeCourt(type) {

  // ===================================
  // 現在のコマの位置を保存
  // ===================================

  const positions = players.map(player => ({

    // X座標を保存
    x: player.x(),

    // Y座標を保存
    y: player.y()

  }));


  // ===================================
  // 現在のコートごとに保存
  // ===================================

  if (currentCourt === "full") {

    // オールコートの位置を保存
    fullCourtPositions = positions;

  } else if (currentCourt === "half") {

    // ハーフコートの位置を保存
    halfCourtPositions = positions;

  }


  // ===================================
  // コートを変更
  // ===================================

  currentCourt = type;


  // コートを再描画
  drawCourt();

}


// ===================================
// リセット
// ===================================

function resetBoard() {

  console.log("resetBoardが実行されました");

  // ===================================
  // 作戦線を削除
  // ===================================
  lines.forEach(line => line.destroy());
  lines = [];

  // 履歴をリセット
  history = [];

  // 選択を解除
  if (selectedPlayer) {
    if (selectedPlayer.children[0]) {
      selectedPlayer.children[0].stroke(null);
    }
    selectedPlayer = null;
  }

  // コート編集モードを解除
  courtEditMode = false;

  if (courtTransformer) {
    courtTransformer.nodes([]);
  }

  // ===================================
  // PC・iPadの初期座標を取得
  // ===================================
  const isIPad = window.innerWidth <= 1100;

  let myPositions;
  let enemyPositions;

  if (currentCourt === "full") {

    if (isIPad) {
      myPositions = [
        { x: 790, y: 440 },
        { x: 650, y: 200 },
        { x: 650, y: 750 },
        { x: 200, y: 60 },
        { x: 200, y: 890 }
      ];

      enemyPositions = [
        { x: 700, y: 440 },
        { x: 590, y: 250 },
        { x: 590, y: 700 },
        { x: 200, y: 140 },
        { x: 200, y: 800 }
      ];

    } else {
      myPositions = [
        { x: 780, y: 460 },
        { x: 600, y: 200 },
        { x: 600, y: 750 },
        { x: 210, y: 110 },
        { x: 210, y: 830 }
      ];

      enemyPositions = [
        { x: 700, y: 460 },
        { x: 560, y: 265 },
        { x: 560, y: 680 },
        { x: 210, y: 190 },
        { x: 210, y: 750 }
      ];
    }

  } else {

    if (isIPad) {
      myPositions = [
        { x: 1050, y: 280 },
        { x: 620, y: 390 },
        { x: 1500, y: 390 },
        { x: 300, y: 830 },
        { x: 1840, y: 830 }
      ];

      enemyPositions = [
        { x: 1050, y: 350 },
        { x: 650, y: 450 },
        { x: 1470, y: 460 },
        { x: 400, y: 830 },
        { x: 1750, y: 830 }
      ];

    } else {
      myPositions = [
        { x: 1050, y: 300 },
        { x: 620, y: 390 },
        { x: 1500, y: 390 },
        { x: 280, y: 790 },
        { x: 1850, y: 790 }
      ];

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
  // 初期選手の保存先を用意
  // ===================================
  if (typeof initialMyPlayers === "undefined") {
    initialMyPlayers = {};
  }

  if (typeof initialEnemyPlayers === "undefined") {
    initialEnemyPlayers = {};
  }



  // ===================================
  // コート上にいる追加選手のリセット位置を保存
  // ===================================

  const addedPlayerPositions = players
    .filter(player => !player.getAttr("initialPlayer"))

    // ベンチにいる選手は対象外
    .filter(player =>
      !myBenchPlayers.includes(player) &&
      !enemyBenchPlayers.includes(player)
    )

    // コートに出したときの位置が保存されている選手
    .filter(player =>
      player.getAttr("resetX") !== undefined &&
      player.getAttr("resetY") !== undefined
    )

    .map(player => ({
      player: player,
      x: player.getAttr("resetX"),
      y: player.getAttr("resetY")
    }));
  // ===================================
  // 初期選手10人を復活させる
  // ===================================

  function restoreInitialPlayer(
    savedPlayer,
    team,
    number,
    position
  ) {
    let player = savedPlayer;

    // ベンチにいる初期選手はコートに戻さない
    if (
      player &&
      (
        myBenchPlayers.includes(player) ||
        enemyBenchPlayers.includes(player)
      )
    ) {
      console.log(
        "ベンチにいるため復帰をスキップ:",
        player.getAttr("team"),
        player.getAttr("initialNumber"),
        "味方ベンチ:",
        myBenchPlayers.includes(player),
        "相手ベンチ:",
        enemyBenchPlayers.includes(player)
      );

      return player;
    }

    // 存在しない、または削除済みの場合は作り直す
    if (!player || !player.getStage()) {
      player = createPlayer(
        position.x,
        position.y,
        number,
        (team === "my" ? "自" : "相") + number,
        team === "my" ? "#ea580c" : "#2563eb"
      );
    }

    // 初期選手の属性を設定
    player.setAttr("initialPlayer", true);
    player.setAttr("initialNumber", number);
    player.setAttr("team", team);

    // players配列への重複登録を防ぐ
    if (!players.includes(player)) {
      players.push(player);
    }

    // ベンチ配列からは削除しない
    // コートレイヤーへ追加
    if (player.getLayer() !== courtLayer) {
      player.moveTo(courtLayer);
    }

    // 初期位置へ戻して表示
    player.position(position);
    player.visible(true);

    // 選択枠を解除
    if (player.children[0]) {
      player.children[0].stroke(null);
    }

    return player;
  }


  // 味方5人を復活・配置
  for (let i = 1; i <= 5; i++) {
    initialMyPlayers[i] = restoreInitialPlayer(
      initialMyPlayers[i],
      "my",
      i,
      myPositions[i - 1]
    );
  }

  // 相手5人を復活・配置
  for (let i = 1; i <= 5; i++) {
    initialEnemyPlayers[i] = restoreInitialPlayer(
      initialEnemyPlayers[i],
      "enemy",
      i,
      enemyPositions[i - 1]
    );
  }


  // ===================================
  // 追加選手を保存した位置に戻す
  // ===================================

  addedPlayerPositions.forEach(item => {
    const player = item.player;

    // ベンチにいる選手は対象外
    if (
      myBenchPlayers.includes(player) ||
      enemyBenchPlayers.includes(player)
    ) {
      return;
    }

    // コートレイヤーへ移動
    if (player.getLayer() !== courtLayer) {
      player.moveTo(courtLayer);
    }

    // 保存していた位置を取得
    let targetX = item.x;
    let targetY = item.y;

    // 他のコート上の選手と重なるか確認
    function isOverlapping(x, y) {
      return players.some(other => {
        if (other === player) return false;

        // ベンチの選手は判定しない
        if (
          myBenchPlayers.includes(other) ||
          enemyBenchPlayers.includes(other)
        ) {
          return false;
        }

        const dx = x - other.x();
        const dy = y - other.y();

        return Math.sqrt(dx * dx + dy * dy) < 55;
      });
    }

    // 重なる場合は、周囲の空いている位置を探す
    if (isOverlapping(targetX, targetY)) {
      let found = false;

      for (let radius = 60; radius <= 300 && !found; radius += 60) {
        for (let angle = 0; angle < 360; angle += 30) {
          const radian = angle * Math.PI / 180;

          const x = item.x + Math.cos(radian) * radius;
          const y = item.y + Math.sin(radian) * radius;

          if (!isOverlapping(x, y)) {
            targetX = x;
            targetY = y;
            found = true;
            break;
          }
        }
      }

      // 空き位置が見つからない場合は元の保存位置を使う
      if (!found) {
        console.warn("追加選手の空き位置が見つかりませんでした");
      }
    }

    // 空いている位置へ配置
    player.position({
      x: targetX,
      y: targetY
    });

    player.visible(true);

    // players配列への重複登録を防ぐ
    if (!players.includes(player)) {
      players.push(player);
    }
  });





  // ===================================
  // ボールを初期位置へ戻す
  // ===================================
  if (ball) {
    let ballX;
    let ballY;

    if (currentCourt === "full") {
      ballX = isIPad ? 770 : 750;
      ballY = isIPad ? 395 : 415;
    } else {
      ballX = 1000;
      ballY = isIPad ? 300 : 320;
    }

    ball.position({ x: ballX, y: ballY });
  }

  // ===================================
  // 画面を再描画
  // ===================================
  courtLayer.batchDraw();
  benchLayer.batchDraw();
  drawLayer.batchDraw();
}

