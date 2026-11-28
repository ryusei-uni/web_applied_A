const MAX_BULLET = 200;
const BULLET_RADIUS = 5;
const bulletStatus = ["default", "wedge", "tracker", "random", "line"];
const SHOT_DAMAGE = {
    default: 0.5,
    wedge: 0.5,
    random: 0.25,
    tracker: 0.5,
    laser: 1,
    slash: 0.75
};
const GROUND_SLASH = { count: 3, interval: 0.19, speed: 240, w: 30, h: 16 };

let bullets = []; // 弾を管理する配列


const lasers = [];
const LASER_DEFAULTS = {
    warning: 0.65,
    duration: 0.75,
    range: 360,
    width: 12,
    lockTime: 0.2,
    turnSpeed: Math.PI
};

const TRACKER_LIFETIME = 2.8;
const TRACKER_TURN_SPEED = Math.PI / 2;

// 弾のオブジェクトを生成
function createBullet(vx, vy, enemy, status) {
    return {
        x: enemy.x + enemy.w / 2,
        y: enemy.y + enemy.h / 2,
        vx: vx,
        vy: vy,
        status: status
    };
}

// 扇状（くさび形）に弾を生成して配列に追加
function wedgeBullet(enemy, target, count,spreadDegrees, speed) {
     if (count <= 0) return;

  const aim = aimFromEnemy(enemy, target);
  const spread = degToRad(spreadDegrees);

  // 全体の扇の半分の角度を計算し、左端（または上端）の開始角度を求める
  const startAngle = aim - (spread * (count - 1)) / 2;

  for (let i = 0; i < count; i++) {
    if (bullets.length >= MAX_BULLET) break;

    const angle = startAngle + spread * i;
    bullets.push(
      createBullet(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        enemy,
        bulletStatus[1]
      )
    );
  }
}

function randomBarrage(enemy, target, speed) {
    const aim = aimFromEnemy(enemy, target);
    for (let i = 0; i < 8 && bullets.length < MAX_BULLET; i++) {
        const angle = aim + (Math.random() - 0.5) * Math.PI * 0.8;
        const shotSpeed = speed * (0.7 + Math.random() * 0.5);
        bullets.push(createBullet(Math.cos(angle) * shotSpeed, Math.sin(angle) * shotSpeed, enemy, bulletStatus[3]));
    }
}

function aimFromEnemy(enemy, target) {
    return Math.atan2(
        target.y + target.h / 2 - (enemy.y + enemy.h / 2),
        target.x + target.w / 2 - (enemy.x + enemy.w / 2)
    );
}

function trackingBarrage(enemy, target, speed) {
    const aim = aimFromEnemy(enemy, target);
    for (const offset of [-0.5, 0, 0.5]) {
        if (bullets.length >= MAX_BULLET) break;
        const angle = aim + offset;
        const bullet = createBullet(Math.cos(angle) * speed, Math.sin(angle) * speed, enemy, "tracker");
        bullet.lifetime = TRACKER_LIFETIME;
        bullets.push(bullet);
    }
}

function groundSlashBarrage(enemy, target) {
    const origin = enemy.x + enemy.w / 2;
    const direction = target.x + target.w / 2 < origin ? -1 : 1;
    for (let i = 0; i < GROUND_SLASH.count && bullets.length < MAX_BULLET; i++) {
        bullets.push({
            x: origin - GROUND_SLASH.w / 2,
            y: floor.y - GROUND_SLASH.h,
            w: GROUND_SLASH.w,
            h: GROUND_SLASH.h,
            vx: GROUND_SLASH.speed * direction,
            delay: i * GROUND_SLASH.interval,
            status: "slash"
        });
    }
}

function drawGroundSlash(ctx, slash) {
    ctx.save();
    ctx.translate(slash.x + (slash.vx < 0 ? slash.w : 0), slash.y);
    ctx.scale(slash.vx < 0 ? -1 : 1, 1);
    ctx.beginPath();
    ctx.moveTo(0, slash.h);
    ctx.quadraticCurveTo(slash.w * 0.62, slash.h * 0.68, slash.w, 0);
    ctx.quadraticCurveTo(slash.w * 0.92, slash.h * 0.9, slash.w * 0.52, slash.h);
    ctx.closePath();
    ctx.fillStyle = "#56e4cf";
    ctx.fill();
    ctx.strokeStyle = "#e4fff3";
    ctx.stroke();
    ctx.restore();
}

function drawProjectileHitboxes(ctx) {
    ctx.strokeStyle = "#ffd166";
    drawLasers(ctx, true);
    for (const bullet of bullets) {
        if (bullet.status === "slash") {
            if (bullet.delay === 0) ctx.strokeRect(bullet.x, bullet.y, bullet.w, bullet.h);
            continue;
        }
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BULLET_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function fireLaser(enemy, target, options = {}) {
    lasers.push({
        ...LASER_DEFAULTS,
        damage: SHOT_DAMAGE.laser,
        ...options,
        x: enemy.x + enemy.w / 2,
        y: enemy.y + enemy.h / 2,
        angle: aimFromEnemy(enemy, target),
        age: 0
    });
}

function drawLasers(ctx, hitboxesOnly = false) {
    for (const laser of lasers) {
        const warning = laser.age < laser.warning;
        if (warning && hitboxesOnly) continue;
        const top = -laser.width / 2;
        ctx.save();
        ctx.translate(laser.x, laser.y);
        ctx.rotate(laser.angle);
        if (hitboxesOnly) {
            ctx.strokeStyle = "#ffd166";
            ctx.strokeRect(0, top, laser.range, laser.width);
        } else if (warning) {
            ctx.strokeStyle = "#ffb1c2";
            ctx.setLineDash([7, 5]);
            ctx.strokeRect(0, top, laser.range, laser.width);
        } else {
            ctx.fillStyle = "#ff527f";
            ctx.fillRect(0, top, laser.range, laser.width);
            ctx.fillStyle = "#fff2de";
            const coreWidth = Math.min(2, laser.width);
            ctx.fillRect(0, -coreWidth / 2, laser.range, coreWidth);
        }
        ctx.restore();
    }
}

function laserHitsHurtbox(laser, hurtbox) {
    const cos = Math.cos(laser.angle);
    const sin = Math.sin(laser.angle);
    const absCos = Math.abs(cos);
    const absSin = Math.abs(sin);
    const halfLength = laser.range / 2;
    const halfHeight = laser.width / 2;
    const halfWidthBox = hurtbox.w / 2;
    const halfHeightBox = hurtbox.h / 2;
    const dx = hurtbox.x + halfWidthBox - (laser.x + cos * halfLength);
    const dy = hurtbox.y + halfHeightBox - (laser.y + sin * halfLength);

    // 水平・垂直とレーザー自身の2軸に投影して、矩形の重なりを判定する。
    return Math.abs(dx) < halfWidthBox + absCos * halfLength + absSin * halfHeight &&
        Math.abs(dy) < halfHeightBox + absSin * halfLength + absCos * halfHeight &&
        Math.abs(dx * cos + dy * sin) < halfLength + absCos * halfWidthBox + absSin * halfHeightBox &&
        Math.abs(-dx * sin + dy * cos) < halfHeight + absSin * halfWidthBox + absCos * halfHeightBox;
}

function turnToward(angle, targetAngle, maxTurn) {
    const difference = targetAngle - angle;
    const turn = Math.atan2(Math.sin(difference), Math.cos(difference));
    return angle + Math.max(-maxTurn, Math.min(turn, maxTurn));
}

function damagePlayerFromShot(status) {
    const damage = SHOT_DAMAGE[status] ?? SHOT_DAMAGE.default;
    if (damage <= 0 || player.hittimer > 0 || player.invincible) return false;
    player.hp = Math.max(0, player.hp - damage);
    player.hittimer = CONFIG.HIT_TIME;
    return true;
}

function updateLasers(dt, hurtbox) {
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        const trackingTime = Math.min(dt, laser.warning - laser.lockTime - laser.age);
        if (trackingTime > 0) {
            const aim = Math.atan2(
                hurtbox.y + hurtbox.h / 2 - laser.y,
                hurtbox.x + hurtbox.w / 2 - laser.x
            );
            laser.angle = turnToward(laser.angle, aim, laser.turnSpeed * trackingTime);
        }
        const activeEnd = laser.warning + laser.duration;
        const nextAge = laser.age + dt;
        // 予告から照射に切り替わるフレームも、照射中の時間だけを数える。
        const activeTime = Math.min(nextAge, activeEnd) - Math.max(laser.age, laser.warning);
        if (activeTime > 0 && player.hittimer <= 0 && !player.invincible && laserHitsHurtbox(laser, hurtbox)) {
            const damage = Math.max(0, laser.damage) * activeTime / laser.duration;
            const remainingHp = player.hp - damage;
            player.hp = remainingHp > 1e-9 ? remainingHp : 0;
        }
        laser.age = nextAge;
        if (laser.age >= activeEnd) {
            lasers.splice(i, 1);
        }
    }
}

// 弾の描画処理（Canvasのコンテキスト ctx を想定）
function drawBullet(ctx) {
    drawLasers(ctx);
    for (const b of bullets) {
        if (b.status === "slash") {
            if (b.delay === 0) drawGroundSlash(ctx, b);
            continue;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = b.status === "tracker" ? "#c698ff" :
            b.status === "random" ? "#ffbb72" : "#ff766d";
        ctx.fill();
        ctx.strokeStyle = "#fff2de";
        ctx.stroke();
    }
}

// 弾の位置更新処理
function updateBullet(dt) {
    const hurtbox = getPlayerHurtbox();
    updateLasers(dt, hurtbox);
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (b.status === "slash") {
            const travelTime = Math.max(0, dt - b.delay);
            b.delay = Math.max(0, b.delay - dt);
            if (b.delay > 0) continue;
            b.x += b.vx * travelTime;
            if (b.x + b.w <= 0 || b.x >= canvas.width) {
                bullets.splice(i, 1);
            } else if (aabb(b, hurtbox)) {
                bullets.splice(i, 1);
                damagePlayerFromShot(b.status);
            }
            continue;
        }
        if (b.status === "tracker") {
            b.lifetime -= dt;
            if (b.lifetime <= 0) {
                bullets.splice(i, 1);
                continue;
            }
            const currentAngle = Math.atan2(b.vy, b.vx);
            const targetAngle = Math.atan2(
                hurtbox.y + hurtbox.h / 2 - b.y,
                hurtbox.x + hurtbox.w / 2 - b.x
            );
            const angle = turnToward(currentAngle, targetAngle, TRACKER_TURN_SPEED * dt);
            const speed = Math.hypot(b.vx, b.vy);
            b.vx = Math.cos(angle) * speed;
            b.vy = Math.sin(angle) * speed;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        const outside = b.x < -BULLET_RADIUS || b.x > canvas.width + BULLET_RADIUS ||
            b.y < -BULLET_RADIUS || b.y > canvas.height + BULLET_RADIUS;
        if (outside) {
            bullets.splice(i, 1);
            continue;
        }

        const nearestX = Math.max(hurtbox.x, Math.min(b.x, hurtbox.x + hurtbox.w));
        const nearestY = Math.max(hurtbox.y, Math.min(b.y, hurtbox.y + hurtbox.h));
        if (Math.hypot(b.x - nearestX, b.y - nearestY) <= BULLET_RADIUS) {
            bullets.splice(i, 1);
            damagePlayerFromShot(b.status);
        }
    }
}
