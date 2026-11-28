const debugConsole = document.getElementById("debug-console");
const consoleInput = document.getElementById("console-input");
const consoleLog = document.getElementById("console-log");
let isConsoleOpen = false;

const COMMANDLIST = ["spawn","clear","heal","speed","score","flagspawn","invincible","damage","dead","hitbox"];
const COMMAND_DESC= [" [タイプ] [x]","","[] or [数値]","[タイプ] [数値] ","[数値]","[] or [status]","","[] or [数値]","","[on|off]"];
// ログを画面に出力する関数
function logConsole(text) {
  const line = document.createElement("div");
  line.textContent = `> ${text}`;
  consoleLog.appendChild(line);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

// 「/」キーまたは「@」キーでコンソールを開閉
window.addEventListener("keydown", (e) => {
  if (e.key === "@" || e.key === "/") {
    e.preventDefault();
    e.stopPropagation();
    if (e.repeat) return;
    isConsoleOpen = !isConsoleOpen;
    debugConsole.style.display = isConsoleOpen ? "block" : "none";
    if (isConsoleOpen) {
      consoleInput.focus();
    } else {
      consoleInput.blur();
    }
  }
}, true);

// Enterキーでコマンドを実行
consoleInput.addEventListener("keydown", (e) => {
  // ゲーム側のキー操作（ジャンプや移動など）に反応しないようにイベントを止める
  e.stopPropagation();

  if (e.key === "Enter") {
    const commandText = consoleInput.value.trim();
    if (commandText) {
      executeCommand(commandText);
      consoleInput.value = "";
    }
  }
});

// コマンドの解析と実行
function executeCommand(input) {
  logConsole(input);
  const args = input.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  switch (cmd) {
    case COMMANDLIST[0]: {
      // 例: spawn flyly 300
      const type = args[1] || "default";
      const x = Number(args[2]) || player.x + 150;
      if (statuses.includes(type)) {
        enemies.push(createEnemy(x, -80, type));
        logConsole(`${type} を x=${x} に出現させました`);
      } else {
        logConsole(`エラー: 不明な敵タイプ (${statuses.join(", ")})`);
      }
      break;
    }

    case COMMANDLIST[1]: {
      // 画面上の敵をすべて消す
      enemies = [];
      logConsole("すべての敵を削除しました");
      break;
    }

    case COMMANDLIST[2]: {
      // プレイヤーのHPを回復
      const amount = Number(args[1]) || CONFIG.MAX_HP;
      for(let i = 0; i < amount ; i++){
        if(player.hp < CONFIG.MAX_HP){
            player.hp ++;
        }else{
            break;
        }
      }
      logConsole(`HPを ${amount} 回復しました (現在: ${player.hp})`);
      break;
    }

    case COMMANDLIST[3]: {
      // 例: speed flyly 200
      const type = args[1];
      const newSpeed = Number(args[2]);
      if (ENEMY_SPEED[type] !== undefined && !isNaN(newSpeed)) {
        ENEMY_SPEED[type] = newSpeed;
        logConsole(`${type} の速度を ${newSpeed} に変更しました`);
      } else {
        logConsole("使い方: speed [敵タイプ] [数値]");
      }
      break;
    }

    case COMMANDLIST[4]:{
        const addscore = Number(args[1]);
        if(!isNaN(addscore)){
          
          score += addscore;
        }else{
            score += 0;
            logConsole("使い方: score [数値]");
        }
         
        break;
    }

    case COMMANDLIST[5]:{
       const line = args[1];
       if(line === "status"){
            logConsole("現在のSpawnFlag : "+ SpawnFlag);
       } else {
         SpawnFlag = !SpawnFlag;
        logConsole("SpawnFlag : "+ !SpawnFlag +" -> " + SpawnFlag);
       }
       break;
    }

    case COMMANDLIST[6]:{

       
         player.invincible = !player.invincible;
        logConsole("invincible : "+ !player.invincible +" -> " + player.invincible);
        if(player.invincible){
            logConsole("無敵です!");
        }else{
            
            logConsole("ダメージを受けます");
        }
       
       break;
    } 

    case COMMANDLIST[7]:{
         const amount = Number(args[1]) || CONFIG.MAX_HP-1;
         const dhp = player.hp-1;

         for(let i = 0; i < amount ; i++){
        if(dhp > 0){
            player.hp --;
        }else{
            break;
        }
      }
      logConsole(`HPを ${amount} ダメージを受けました (現在: ${player.hp})`);
      break;
    }
    case COMMANDLIST[8]:{
        player.hp = 0;
      logConsole(`playerは死にました`);
      break;
    }
    case "hitbox": {
      const mode = args[1]?.toLowerCase();
      if (args.length > 2 || (mode !== undefined && mode !== "on" && mode !== "off")) {
        logConsole("使い方: hitbox [on|off]");
        break;
      }
      showHitboxes = mode === undefined ? !showHitboxes : mode === "on";
      logConsole(`当たり判定の表示: ${showHitboxes ? "ON" : "OFF"}`);
      break;
    }
    case "help": {
        let commanddesctext = "";
        for(let i = 0; i < COMMANDLIST.length; i++ ){
            commanddesctext += COMMANDLIST[i];
            commanddesctext += " ";
            commanddesctext += COMMAND_DESC[i];
            commanddesctext += " , ";
        }
      logConsole("コマンド一覧: "+ commanddesctext);

      break;
    }

    default:
      logConsole(`不明なコマンドです。"help" で一覧を表示します。`);
  }
}
