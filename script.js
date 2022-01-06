var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 300,
  physics: { default: "arcade" },
  scene: { preload, create, update },
};
var game = new Phaser.Game(config);
function preload() {
  this.load.image("background", "assets/amogus map1.png");
  this.load.spritesheet("player", "assets/redSUS.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
}
function create() {
  let back = this.add.tileSprite(0, 0, 6000, 300, "background");
  back.setOrigin(0);
  player = this.physics.add.sprite(50, 100, "player", 2);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.gravity.y = 500;
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
}
function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-150);
  } else if (cursors.right.isDown) {
    player.setVelocityX(150);
  } else {
    player.setVelocityX(0);
  }
  if (cursors.left.isDown) {
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.anims.play("right", true);
  } else {
    player.anims.play("front");
  }
}
function kill(test){
  test=false;
}
function vent(val){
  val= !val;
}
let amogus1;
let amogus2;
let amogus3;
let amogus4;
let amogus5;

