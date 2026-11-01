// ===================================
// Stage（作戦盤の画面）作成
// ===================================

// オールコート用の画像を作成
const fullCourtImg = new Image();

// ハーフコート用の画像を作成
const halfCourtImg = new Image();

// オールコート画像の読み込みが完了したときの処理
window.addEventListener("load", function () {
    drawCourt();



});

// オールコート画像の読み込み先を指定
fullCourtImg.src = "バスケコート.png";

// ハーフコート画像の読み込み先を指定
halfCourtImg.src = "ハーフコート.png";



// ===================================
// KonvaのStageを作成
// ===================================

// Konvaの描画領域を作成
const stage = new Konva.Stage({

    // HTML側のcontainer要素に表示
    container: 'container',

    // 画面の横幅に合わせる
    width: window.innerWidth,

    // 画面の縦幅に合わせる
    height: window.innerHeight

});


// 作戦盤全体の幅
const stageWidth = 2150;

// 作戦盤全体の高さ
const stageHeight = 950;

// ベンチ部分の幅
const benchWidth = 70;

// 表示サイズに合わせる倍率と余白
let boardScale = 1;
let boardOffsetX = 0;
let boardOffsetY = 0;

// 作戦線を保存する配列
let lines = [];


// ===================================
// レイヤー作成
// ===================================

// コート上の選手・ベンチ枠を描画するレイヤー
const courtLayer = new Konva.Layer();

// ベンチの控え選手を描画するレイヤー
const benchLayer = new Konva.Layer();

// 作戦線・消しゴムを描画するレイヤー
const drawLayer = new Konva.Layer();

// レイヤーをステージに追加
stage.add(courtLayer);
stage.add(benchLayer);
stage.add(drawLayer);

// ===================================
// PC・iPad画面に合わせて作戦盤を縮尺調整
// 座標系は 1930 × 950 のまま維持する
// ===================================
function resizeBoard() {
    const container = document.getElementById("container");
    const menu = document.querySelector(".menu");
    if (!container) return;

    const menuHeight = menu
        ? menu.getBoundingClientRect().height
        : 0;

    const availableHeight = Math.max(
        220,
        window.innerHeight - menuHeight
    );

    container.style.height = availableHeight + "px";

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (containerWidth <= 0 || containerHeight <= 0) return;

    // PC・iPad共通で、縦横の画面内に収まる倍率を計算
    boardScale = Math.min(
        containerWidth / stageWidth,
        containerHeight / stageHeight
    );

    boardOffsetX = (containerWidth - stageWidth * boardScale) / 2;
    boardOffsetY = (containerHeight - stageHeight * boardScale) / 2;

    stage.width(containerWidth);
    stage.height(containerHeight);

    [courtLayer, benchLayer, drawLayer].forEach(layer => {
        layer.scale({ x: boardScale, y: boardScale });
        layer.position({ x: boardOffsetX, y: boardOffsetY });
        layer.batchDraw();
    });

    stage.batchDraw();
}

// 画面座標を作戦盤の論理座標（1930 × 950）に変換
function getBoardPointerPosition() {
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    return {
        x: (pointer.x - boardOffsetX) / boardScale,
        y: (pointer.y - boardOffsetY) / boardScale
    };
}

resizeBoard();
window.addEventListener("resize", resizeBoard);
window.addEventListener("orientationchange", () => setTimeout(resizeBoard, 250));


// ===================================
// データ
// ===================================

// 現在選択されているスポーツ
// basketball = バスケットボール
let currentSport = "basketball";

// 現在表示しているコート
// full = オールコート
// half = ハーフコート
let currentCourt = "full";

// ..
// 用のコマ位置
let fullCourtPositions = [];

// ハーフコート用のコマ位置
let halfCourtPositions = [];

// 作成された選手を保存する配列
let players = [];

// 作成されたボールを保存する変数
let ball = null;

// Undoで使用する移動履歴
let history = [];

// フォーメーション保存データ
let formations = [];

// 録画した選手の動きを保存する配列
let recordings = [];

// 録画中かどうかを管理
let isRecording = false;

// 現在選択されている選手
let selectedPlayer = null;

// 線描画モードがONかどうか
let drawMode = false;

// 消しゴムモードがONかどうか
let eraseMode = false;


// ===================================
// 選手移動開始時の座標
// ===================================

// 移動開始時のX座標
let startX = 0;

// 移動開始時のY座標
let startY = 0;


// ===================================
// ベンチ関連のデータ
// ===================================

// 味方ベンチのY座標
let myBenchY = 100;

// 相手ベンチのY座標
let enemyBenchY = 100;

// 味方の控え選手を保存
let myBenchPlayers = [];

// 相手の控え選手を保存
let enemyBenchPlayers = [];

// 味方ベンチの表示開始位置
let myBenchStart = 0;

// 相手ベンチの表示開始位置
let enemyBenchStart = 0;

// ベンチに一度に表示する選手数
const visibleCount = 15;


// ===================================
// スポーツ設定
// ===================================

const sportSettings = {

    // バスケットボールの設定
    basketball: {

        // コート上に配置する選手数
        playerCount: 5,

        // 味方選手の色
        color: "#ea580c"

    }

};



// ===================================
// 選手生成処理
// 指定された座標に選手を作成する
//
// x      : X座標
// y      : Y座標
// number : 背番号
// name   : 選手名
// color  : チームカラー
// ===================================

function createPlayer(x, y, number, name, color) {

    // ===================================
    // 選手グループを作成
    // ===================================

    const group = new Konva.Group({

        // 選手のX座標
        x: x,

        // 選手のY座標
        y: y,

        // ドラッグ可能にする
        draggable: true

    });

    // 選手ごとの初期位置を保存
    group.setAttr("initialX", x);
    group.setAttr("initialY", y);

    // 選手のチーム・初期選手かどうかを記録
    group.setAttr("team", color === "#ea580c" ? "my" : "enemy");
    group.setAttr("initialPlayer", false);
    group.setAttr("initialNumber", number);


    // 選手の円の大きさ
    const size = 27;


    // ===================================
    // 選手の丸を作成
    // ===================================

    const circle = new Konva.Circle({

        // 円の半径
        radius: size,

        // チームカラーを設定
        fill: color

    });


    // ===================================
    // 背番号・名前を表示
    // ===================================

    const text = new Konva.Text({

        // 背番号と名前を2行で表示
        text: number + "\n" + name,

        // 文字サイズ
        fontSize: 15,

        // 文字色
        fill: "white",

        // 中央揃え
        align: "center",

        // テキストの幅
        width: size * 2,

        // X座標
        x: 0,

        // Y座標
        y: 0

    });


    // テキストの中央位置を調整
    text.offsetX(size);

    // テキストの縦位置を調整
    text.offsetY(15);


    // ===================================
    // グループへ追加
    // ===================================

    // 選手の丸をグループへ追加
    group.add(circle);

    // 背番号・名前をグループへ追加
    group.add(text);




    // ===================================
    // 選手クリック時の処理
    // ===================================

    group.on("click", () => {

        // 以前選択していた選手の枠線を消す
        players.forEach(p => {

            p.children[0].stroke(null);

        });


        // クリックした選手を選択状態にする
        selectedPlayer = group;


        // 選択中の選手に黄色い枠線を付ける
        circle.stroke("yellow");

        // 枠線の太さを設定
        circle.strokeWidth(4);


        // コートを再描画
        courtLayer.draw();

    });

    // ===================================
    // 選手を右クリックしたときの処理
    // 文字を編集する
    // ===================================

    group.on("contextmenu", (e) => {

        // ブラウザの右クリックメニューを表示しない
        e.evt.preventDefault();


        // ===================================
        // 背番号を入力
        // ===================================

        const newNumber = prompt(
            "新しい背番号を入力してください",
            number
        );

        // キャンセルされた場合は終了
        if (newNumber === null) {
            return;
        }


        // ===================================
        // 名前を入力
        // ===================================

        const newName = prompt(
            "新しい名前を入力してください",
            name
        );

        // キャンセルされた場合は終了
        if (newName === null) {
            return;
        }


        // ===================================
        // 文字を変更
        // ===================================

        text.text(
            newNumber + "\n" + newName
        );


        // ===================================
        // 画面を更新
        // ===================================

        courtLayer.draw();

    });


    // ===================================
    // 選手の移動開始時
    // ===================================
    group.on("dragstart", () => {

        // ドラッグ開始位置を保存
        startX = group.x();
        startY = group.y();

        // Undo用の履歴を保存
        history.push({
            player: group,
            x: startX,
            y: startY
        });

        // 録画中なら開始位置を記録
        if (isRecording) {
            recordings.push({
                player: group,
                x: startX,
                y: startY,
                time: Date.now()
            });
        }
    });


    // ===================================
    // 選手の移動中
    // ===================================
    group.on("dragmove", () => {

        if (isRecording) {
            recordings.push({
                player: group,
                x: group.x(),
                y: group.y(),
                time: Date.now()
            });
        }
    });


    // ===================================
    // 選手の移動終了時
    // ===================================
    group.on("dragend", () => {

        const endX = group.x();
        const endY = group.y();


        // ===================================
        // コート上の選手数を確認
        // ===================================

        // ドラッグ開始時にベンチにいたか確認
        const wasMyBench = myBenchPlayers.includes(group);
        const wasEnemyBench = enemyBenchPlayers.includes(group);

        // コート上にいる選手だけを数える
        const courtPlayers = players.filter(player =>
            !myBenchPlayers.includes(player) &&
            !enemyBenchPlayers.includes(player)
        );


        // ===================================
        // 選手同士の交換相手を探す
        // ===================================
        let targetPlayer = null;

        for (const other of players) {
            if (other === group) continue;

            // ベンチの選手は交換相手にしない
            if (
                myBenchPlayers.includes(other) ||
                enemyBenchPlayers.includes(other)
            ) {
                continue;
            }

            const dx = endX - other.x();
            const dy = endY - other.y();
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
                targetPlayer = other;
                break;
            }
        }

        // ===================================
        // 10人制限
        // 交換相手がいない場合だけ判定する
        // ===================================

        const isMovingFromBench =
            (wasMyBench && endX > 100) ||
            (wasEnemyBench && endX < 1800);

        if (
            !targetPlayer &&
            isMovingFromBench &&
            courtPlayers.length >= 10
        ) {
            group.position({
                x: startX,
                y: startY
            });

            alert("コート上には最大10人までしか配置できません。");

            updateBenchScroll();
            courtLayer.batchDraw();
            benchLayer.batchDraw();

            return;
        }



        // 録画中なら終了位置を記録
        if (isRecording) {
            recordings.push({
                player: group,
                x: endX,
                y: endY,
                time: Date.now()
            });
        }




        // ===================================
        // 交換処理
        // ===================================
        if (targetPlayer) {

            const otherX = targetPlayer.x();
            const otherY = targetPlayer.y();

            // 追加選手が初めてコートに入る場合、
            // 交換相手の位置をリセット位置として保存する
            if (
                !group.getAttr("initialPlayer") &&
                (wasMyBench || wasEnemyBench) &&
                group.getAttr("resetX") === undefined
            ) {
                group.setAttr("resetX", otherX);
                group.setAttr("resetY", otherY);
            }

            // ドラッグした選手を交換相手の位置へ移動
            group.position({
                x: otherX,
                y: otherY
            });

            // 交換相手をドラッグ開始位置へ移動
            targetPlayer.position({
                x: startX,
                y: startY
            });

            // ドラッグした選手をベンチ配列から削除
            myBenchPlayers = myBenchPlayers.filter(
                p => p !== group
            );

            enemyBenchPlayers = enemyBenchPlayers.filter(
                p => p !== group
            );

            // 初期選手とベンチから交換した場合、
            // 初期選手を元のベンチへ戻す
            if (
                targetPlayer.getAttr("initialPlayer") &&
                (wasMyBench || wasEnemyBench)
            ) {
                myBenchPlayers = myBenchPlayers.filter(
                    p => p !== targetPlayer
                );

                enemyBenchPlayers = enemyBenchPlayers.filter(
                    p => p !== targetPlayer
                );

                if (wasMyBench) {
                    myBenchPlayers.push(targetPlayer);
                } else if (wasEnemyBench) {
                    enemyBenchPlayers.push(targetPlayer);
                }
            }

        } else {


            // ===================================
            // ベンチからコートへ移動した場合
            // ===================================

            if (wasMyBench && endX > 100) {
                myBenchPlayers = myBenchPlayers.filter(
                    p => p !== group
                );
            }

            if (wasEnemyBench && endX < 1800) {
                enemyBenchPlayers = enemyBenchPlayers.filter(
                    p => p !== group
                );
            }

            // 追加選手の最初のコート位置を保存
            const isOnBench =
                myBenchPlayers.includes(group) ||
                enemyBenchPlayers.includes(group);

            // ベンチからコートへ移動した追加選手の位置を保存
            if (
                !group.getAttr("initialPlayer") &&
                !isOnBench &&
                group.getAttr("resetX") === undefined
            ) {
                group.setAttr("resetX", endX);
                group.setAttr("resetY", endY);
            }
        }

        // ベンチの位置を更新
        updateBenchScroll();

        // 再描画
        courtLayer.batchDraw();
    });



    // ===================================
    // レイヤーへ追加
    // ===================================

    courtLayer.add(group);


    // ===================================
    // 配列へ保存
    // ===================================

    players.push(group);

    // ===================================
    // 作成した選手を返す
    // ===================================

    return group;

}

// ===================================
// コートの何もない場所をクリックしたら選択解除
// ===================================
stage.on("click", (e) => {

    // コマをクリックした場合は解除しない
    if (e.target === stage) {

        if (selectedPlayer) {
            selectedPlayer.children[0].stroke(null);
            selectedPlayer = null;
            courtLayer.draw();
        }

    }
});
