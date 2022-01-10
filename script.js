var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
    },
  },
  scene: { preload, create, update },
};
var game = new Phaser.Game(config);
function preload() {
  this.load.image("background", "assets/amogus map1.png");
  this.load.image("buton", "assets/block1.png");
  this.load.image("win", "assets/win.png");
  this.load.image("lost", "assets/lost.png");
  this.load.image("vent", "assets/vent.png");
  this.load.spritesheet("player", "assets/redSUS.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  this.load.spritesheet("amogus1", "assets/amogus.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
}
let textToDialog = [
  "Red Sus",
  "White is Kinda Sus",
  "Amogus",
  "Zus",
  "Gus",
  "nothing happened in tiananmen square",
  "¿Cuáles son sus objetivos profesionales a largo plazo?",
];
let scoreText;
var lost;
let amogus;
let textDialog;
let vent;
let buton;
let isInVents = false;
let inZone = false;
let rangeToKill = false;
let howManyToKill = 11;
let drip = false;
let sus = true;
let talking = false;
let przegrana = false;
let susSituation = false;
let killingDate = Math.round(Date.now() / 1000);
let talkingDate = Math.round(Date.now() / 1000);
function create() {
  let back = this.add.tileSprite(0, 0, 6000, 300, "background");
  lost = this.add.tileSprite(0, 0, 900, 300, "lost");
  lost.setVisible(false);
  back.setOrigin(0);
  player = this.physics.add.sprite(50, 100, "player", 2);
  scoreText = this.add.text(0, 270, "score: 0", {
    fontSize: "32px",
    fill: "#420",
  });
  textDialog = this.add.text(0, 50, "", {
    fontSize: "45px",
    fill: "#999",
  });
  player.setBounce(0);
  player.setCollideWorldBounds(true);
  player.body.gravity.y = 500;
  player.setScale(1.0).refreshBody();
  cursors = this.input.keyboard.createCursorKeys();
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "front",
    frames: [{ key: "player", frame: 2 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player", { start: 3, end: 4 }),
    frameRate: 10,
    repeat: -1,
  });
  this.cameras.main.setBounds(0, 0, 6000, 300);
  this.physics.world.setBounds(0, 0, 6000, 300);
  this.cameras.main.startFollow(player);
  amogus = this.physics.add.group({
    key: "amogus1",
    repeat: 10,
    setXY: { x: 100, y: 300, stepX: 300 },
  });
  buton = this.physics.add.staticGroup();
  buton
    .create(2700, 110, "buton")
    .setScale(0.2)
    .setOrigin(0)
    .refreshBody()
    .setVisible(false);
  amogus.children.iterate((child) => {
    child.setBounce(1);
    child.body.gravity.y = 500;
    child.setScale(1.0).refreshBody();
    child.setCollideWorldBounds(true);
    child.setVelocityX(Phaser.Math.FloatBetween(-100, 100));
    this.anims.create({
      key: "left1",
      frames: this.anims.generateFrameNumbers("amogus1", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "front1",
      frames: [{ key: "amogus1", frame: 2 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right1",
      frames: this.anims.generateFrameNumbers("amogus1", { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    child.body.setEnable();
    this.physics.add.overlap(player, child, function () {
      if (
        !isInVents &&
        cursors.space.isDown &&
        Math.round(Date.now() / 1000) - killingDate > 2
      ) {
        child.destroy();
        howManyToKill--;
        susSituation = true;
        killingDate = Math.round(Date.now() / 1000);
        scoreText.setText("Enemies : " + howManyToKill);
      }
    });
    this.physics.add.overlap(buton, child, function () {
      if (
        przegrana ||
        child.body.velocity.x > 399 ||
        child.body.velocity.x < -399
      ) {
        przegrana = true;
        player.setVisible(false);
      }
    });
  });
  vents = this.physics.add.staticGroup();
  vents.create(30, 200, "vent");
  vents.create(1520, 200, "vent");
  vents.create(2890, 200, "vent");
  vents.create(5790, 200, "vent");
  vents.children.iterate((child) => {
    child.setScale(1).setOrigin(0).refreshBody();
    child.setVisible(false);
  });
  this.physics.add.overlap(vents, player, function () {
    inZone = true;
  });
}
function update() {
  scoreText.setText("Enemies : " + howManyToKill);
  scoreText.x = player.body.position.x;
  if (inZone && cursors.down.isDown) {
    isInVents = true;
    susSituation = true;
  } else if (inZone && cursors.up.isDown) {
    isInVents = false;
    susSituation = true;
  }
  if (isInVents) {
    player.setVisible(false);
    if (cursors.left.isDown) {
      player.setVelocityX(-1000);
    } else if (cursors.right.isDown) {
      player.setVelocityX(1000);
    } else {
      player.setVelocityX(0);
    }
  } else {
    player.setVisible(true);
    if (cursors.left.isDown) {
      player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      player.setVelocityX(300);
    } else {
      player.setVelocityX(0);
    }
  }

  if (cursors.left.isDown) {
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.anims.play("right", true);
  } else {
    player.anims.play("front");
  }
  if (howManyToKill == 0 || drip == true) {
    let winned = this.add.tileSprite(0, 0, 900, 300, "win");
    winned.setOrigin(0);
    player.x = 0;
    player.y = 0;
    drip = true;
  }
  amogus.children.iterate((child) => {
    let x = Math.abs(player.x - child.x);
    if (child.body.velocity.x == 0 && !talking)
      child.setVelocityX(Phaser.Math.FloatBetween(-100, 100));
    if (talking && Math.round(Date.now() / 1000) - talkingDate > 3) {
      talking = false;
      textDialog.setVisible(false);
    } else {
    }
    if (susSituation && x < 450) {
      if (player.x - child.x > 0 && (child.body.velocity.x > 0 || talking)) {
        child.setVelocityX(-400);
        textDialog.setVisible(false);
      } else if (
        player.x - child.x < 0 &&
        (child.body.velocity.x < 0 || talking)
      ) {
        child.setVelocityX(400);
        textDialog.setVisible(false);
      }
    }
    if (child.body.velocity.x < 0) {
      child.anims.play("left1", true);
    } else if (child.body.velocity.x > 0) {
      child.anims.play("right1", true);
    } else {
      child.anims.play("front1");
    }
    this.physics.add.overlap(player, child, function () {
      if (
        !isInVents &&
        cursors.shift.isDown &&
        Math.round(Date.now() / 1000) - talkingDate > 3 &&
        child.body.velocity.x < 399 &&
        child.body.velocity.x > -399
      ) {
        talking = true;
        talkingDate = Math.round(Date.now() / 1000);
        textDialog.x = child.body.position.x;
        textDialog.setText(textToDialog[Math.floor(Math.random() * 7)]);
        textDialog.setVisible(true);
        child.setVelocityX(0);
      }
    });
  });
  if (przegrana == true) {
    lost.setOrigin(0);
    lost.setVisible(true);
    player.x = 0;
    player.y = 0;
    player.setVisible(false);
    amogus.setVisible(false);
    scoreText.setVisible(false);
  }
  inZone = false;
  rangeToKill = false;
  susSituation = false;
}

function dialog() {}
