# 夕空ダイブ 仕様書

夕空ダイブは、鳥を操作して敵をヒップドロップで踏み、スコアを伸ばすブラウザーゲームです。ゲームの入口は [index.html](index.html) です。

## 操作と画面の流れ

| 操作 | 動作 |
| --- | --- |
| Enter またはクリック | タイトルから開始、ゲームオーバーからリスタート |
| ← / → | 左右に移動 |
| Space | ジャンプ。空中でもう一度ジャンプできる |
| ↓ | 空中でヒップドロップ |
| P | プレイ中に一時停止、一時停止中に再開 |

開始時のHPは3、スコアは0です。敵との接触で種類に応じたダメージを受け、短時間の無敵時間が入ります。複数の敵に同時接触した場合は、最も高い接触ダメージを1回受けます。HPが0になるとゲームオーバーです。

## ヒップドロップと得点

- 空中で↓を押すと上昇中でも急降下します。キーを離しても、敵に当たるか床・足場に着地するまで続きます。急降下中は軌跡が出て、着地や踏みつけの瞬間に衝撃の輪が出ます。
- 急降下中に足元が敵の上端に達し、横方向にも重なっていれば、踏みつけが成立します。敵のHPが1減り、0になると敵が消えます。鳥は成功するたびに跳ね返り、ジャンプの残り回数が最低1回になります。踏みつけが成立したフレームでは踏みつけが接触ダメージより優先されます。
- 最初の踏みつけは+1点です。前回の成功から2.5秒以内に次の敵を踏むと+2点、さらに続けると+3点と増えます。3連続の合計は6点です。
- 成功するたびに猶予時間が2.5秒に戻ります。時間切れ後の次の成功は+1点です。画面上部に連続回数、直近の獲得点、残り時間が表示されます。一時停止中は猶予時間も止まります。

## 当たり判定の表示

`@` または `/` でデバッグコンソールを開閉できます。`hitbox on` で表示、`hitbox off` で非表示、`hitbox` だけで切り替えます。水色はプレイヤーの被弾範囲、ピンクは敵、黄色は弾と発射中のレーザー、緑は床と足場です。

プレイヤーの被弾範囲は22×24pxで、敵の体や弾との接触判定に使います。移動、着地、踏みつけには従来の32×32pxの範囲を使います。

## ステージと敵

- 描画領域は640×360です。夕焼けの背景、床、中央より右の足場1つがあります。
- 通常開始時に敵は5体います。追加の敵は画面の左右どちらかの端に出現し、通常の出現処理では同時に最大6体です。通常・重量級・射撃型は1秒ずつ移動と停止を繰り返します。地上追跡型と飛行追跡型は範囲内に入ったプレイヤーを追いかけます。
- 敵の種類は通常、重量級、射撃型、地上追跡型、飛行追跡型の5つです。重量級は3HPで、頭上に残りHPが表示されます。ほかの敵は1HPです。
- 射撃型は2.4秒ごとに、扇状弾4発、角度と速度がばらつくランダム弾8発、半追尾レーザー、追尾弾3発、地を這う斬撃3発の順で攻撃します。
- 斬撃はプレイヤーがいる方向へ0.19秒間隔で発生し、床に沿って進みます。ジャンプでかわすことができ、命中すると0.75ダメージです。
- レーザーは0.65秒の予告のうち、最初の0.45秒だけ照準をプレイヤーへ向けて動かします。残り0.2秒で方向が固定され、その向きに0.75秒照射します。射程は発射位置から360px、幅は12pxです。追尾弾は方向を徐々に変えながら、最大2.8秒追尾します。
- 弾は命中するか画面外に出ると消えます。命中1回あたり、扇状弾と追尾弾は0.5、ランダム弾は0.25のダメージを与えます。レーザーは照射中に触れていた時間に比例してHPを減らし、全時間当たり続けると合計1ダメージです。無敵中はダメージを受けません。
- `src/item.js` は空で、アイテム機能は未実装です。

## ファイル別の実装箇所

| ファイル | 役割 | 主な定義 |
| --- | --- | --- |
| [index.html](index.html) | ページ構成、配色、操作ガイド、Canvas、スクリプトの読み込み | `<style>`、`<canvas id="stage">`、`<script>` |
| [src/main.js](src/main.js) | ゲームの状態管理、スコア、ストリーク、画面表示、ゲームループ | `gameState`、`resetGame()`、`awardStompScore()`、`drawHud()`、`update(dt)`、`loop(now)` |
| [src/player.js](src/player.js) | 鳥の入力、移動、ジャンプ、ヒップドロップ、床・足場の判定、アニメーション | `CONFIG`、`player`、`keydown`、`updataPlayer(dt)`、`collideWithFloor()`、`collideWithplatform()`、`finishHipDrop()`、`drawHipDropEffect()` |
| [src/enemy.js](src/enemy.js) | 敵の生成と移動、種類ごとの配色、踏みつけと接触ダメージ | `statuses`、`resetEnemies()`、`spawnEnemies(dt)`、`updateEnemies(dt)`、`collideWithEnemies(prevBottom)`、`drawEnemies()` |
| [src/bullet.js](src/bullet.js) | 敵の弾の生成、移動、描画、プレイヤーへの命中判定 | `wedgeBullet()`、`updateBullet(dt)`、`drawBullet(ctx)` |
| [src/stage.js](src/stage.js) | Canvasの取得、床・足場の位置、背景の描画 | `canvas`、`ctx`、`floor`、`plat`、`drawScenery()` |
| [src/tools.js](src/tools.js) | 軸に沿った矩形同士の重なり判定 | `aabb(a, b)` |
| [src/mouse.js](src/mouse.js) | ポインターをCanvas内の座標に変換し、照準を描画 | `pointermove`、`pointerleave`、`drawAim()` |
| [src/item.js](src/item.js) | アイテム用の空ファイル | |
| [img/7-3_bird.png](img/7-3_bird.png) | 鳥のスプライトシート | 待機・移動・上昇・落下 |

## 設定を変える場所

| 変えたいこと | 編集箇所 | 現在値 |
| --- | --- | --- |
| ストリークの猶予 | `src/main.js` の `STREAK_WINDOW_SECONDS` | 2.5秒 |
| 踏みつけの加点方法 | `src/main.js` の `awardStompScore()` | 連続回数と同じ点数を加算 |
| 急降下の速さ、踏みつけ後の跳ね返り | `src/player.js` の `CONFIG.HIP_DROP_SPEED`、`CONFIG.HIP_DROP_BOUNCE` | 780、420 px/秒 |
| 鳥の移動速度、ジャンプ回数、最大HP | `src/player.js` の `CONFIG.MOVE_SPEED`、`CONFIG.MAX_JUMPS`、`CONFIG.MAX_HP` | 200 px/秒、2回、3 |
| 鳥の被弾範囲 | `src/player.js` の `CONFIG.HURTBOX_INSET_X`、`CONFIG.HURTBOX_INSET_Y` | 左右各5px、上下各4px内側 |
| 敵の上限、出現間隔 | `src/enemy.js` の `MAX_ENEMIES`、`spawnEnemies(dt)` | 6体、初期値2秒。その後は1〜3秒未満 |
| 敵の種類ごとの初期HP | `src/enemy.js` の `ENEMY_HP` | 重量級3、ほかは1 |
| 敵の種類ごとの接触ダメージ | `src/enemy.js` の `ENEMY_CONTACT_DAMAGE` | 通常1、重量級1.5、射撃型0.5、地上追跡型1、飛行追跡型0.75 |
| 射撃間隔、弾速 | `src/enemy.js` の `CONFIG_ENEMY.SHOOTER_FIRE_INTERVAL`、`CONFIG_ENEMY.SHOOTER_BULLET_SPEED` | 2.4秒、150 px/秒 |
| 攻撃の種類ごとのダメージ | `src/bullet.js` の `SHOT_DAMAGE` | 扇状弾0.5、ランダム弾0.25、追尾弾0.5、レーザーは全照射で1、斬撃0.75 |
| 斬撃の発数、間隔、速度、幅と高さ | `src/bullet.js` の `GROUND_SLASH` | 3発、0.19秒、240 px/秒、30×16px |
| レーザーの共通設定 | `src/bullet.js` の `LASER_DEFAULTS`、`SHOT_DAMAGE.laser` | 射程360px、幅12px、予告0.65秒、照射0.75秒、固定0.2秒、旋回速度180度/秒、全照射で1ダメージ |

### レーザーを発射ごとに調整する

`fireLaser(enemy, player)` は共通設定を使います。第3引数に指定した項目だけ、そのレーザーで上書きできます。

```js
fireLaser(enemy, player, { range: 240, width: 18, duration: 1, damage: 1.5 });
```

`range` と `width` はpx、`warning`、`lockTime`、`duration` は秒です。`turnSpeed` はラジアン/秒で、0にすると予告中の追尾が止まります。`damage` は照射の全時間に触れた場合の合計ダメージです。
| 床や足場の位置、背景 | `src/stage.js` の `floor`、`plat`、`drawScenery()` | 床の上端は y=320、足場の左上は x=300・y=230 |

## 踏みつけ時の処理順

1. `main.js` の `update(dt)` が移動前の鳥の足元の位置を保存し、鳥と敵を更新します。
2. `enemy.js` の `collideWithEnemies(prevBottom)` が、移動前後の足元と敵の上端から踏みつけを判定します。成立したら跳ね返りを設定し、敵のHPを1減らします。HPが0になった敵は `enemies.splice(stompIndex, 1)` で配列から削除します。
3. `main.js` の `awardStompScore()` が連続回数、得点、次の期限を更新し、`drawHud()` が表示に反映します。
