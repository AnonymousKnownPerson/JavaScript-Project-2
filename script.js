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
let amogus;
let vent;
let isInVents = false;
let inZone = false;
let rangeToKill = false;
function create() {
  let back = this.add.tileSprite(0, 0, 6000, 300, "background");
  back.setOrigin(0);
  player = this.physics.add.sprite(50, 100, "player", 2);
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
  // Do przemka, wiem że da radę to lepiej zrobić więc to popraw XDD
  //YandereDEV

  //amogus = this.physics.add.sprite(50, 100, "amogus1", 2);
  amogus = this.physics.add.group({
    key: "amogus1",
    repeat: 10,
    setXY: { x: 100, y: 300, stepX: 300 },
  });
  //amogus.create(200, 100, "amogus1", 2);
  amogus.children.iterate((child) => {
    child.setBounce(1);
    child.body.gravity.y = 500;
    child.setScale(1.0).refreshBody();
    child.setCollideWorldBounds(true);
    child.setVelocityX(Phaser.Math.FloatBetween(-100, 100));
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("amogus1", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "front",
      frames: [{ key: "amogus1", frame: 2 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("amogus1", { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    child.body.setEnable();
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
  // this.physics.add.overlap(
  //   this.player,
  //   this.amogus,  
  //   function (player, amogs) {
  //   if (!isInVents && cursors.space.isDown) {
  //     amogs.destroy();
  //   }
  // });
}
function update() {
  
  if (inZone && cursors.down.isDown) {
    isInVents = true;
  } else if (inZone && cursors.up.isDown) {
    isInVents = false;
  }
  if (isInVents) {
    player.setVisible(false);
    if (cursors.left.isDown) {
      player.setVelocityX(-700);
    } else if (cursors.right.isDown) {
      player.setVelocityX(700);
    } else {
      player.setVelocityX(0);
    }
  } else {
    player.setVisible(true);
    if (cursors.left.isDown) {
      player.setVelocityX(-150);
    } else if (cursors.right.isDown) {
      player.setVelocityX(150);
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

  if (typeof amogus.body !== "undefined") {
    if (amogus.body.velocity.x < 0) {
      amogus.anims.play("left", true);
      amogus.setScale(1).refreshBody();
    } else if (amogus.body.velocity.x > 0) {
      amogus.anims.play("right", true);
      amogus.setScale(1).refreshBody();
    } else {
      amogus.anims.play("front");
      amogus.setScale(1).refreshBody();
    }
  }
  inZone = false;
  rangeToKill = false;
}
