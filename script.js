//Przykładowe włączenie serwera http nasłuchującego na porcie 4200 za pomocą pythona - python -m http.server 4200
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
  //wczytanie obrazów/animacji
  this.load.image("background", "assets/amogus map1.png");
  this.load.image("venticon", "assets/venticon.png");
  this.load.image("killicon", "assets/killicon.png");
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
  "Did you sabotage O2?",
  "We can power the whole ship",
  "We can do it togehter !!!",
  "Where is the body?",
  "I want to watch you at Security",
  "Somebody call an emergency meeting",
  "You're sabotaging my O2 levels",
];
//very quality code
let scoreText;
var lost;
let killicon;
let venticon;
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
let checkIfChancePassed = false;
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
    fontSize: "30px",
    fill: "#000000",
    backgroundColor: "#999999",
  });
  player.setBounce(0);
  player.setCollideWorldBounds(true);
  player.body.gravity.y = 500;
  player.setScale(1.0).refreshBody();
  cursors = this.input.keyboard.createCursorKeys();
  //przygotowanie animacji
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
  //przycisk
  buton = this.physics.add.staticGroup();
  buton
    .create(2700, 110, "buton")
    .setScale(0.2)
    .setOrigin(0)
    .refreshBody()
    .setVisible(false);
  amogus = this.physics.add.group({
    key: "amogus1",
    repeat: 10,
    setXY: { x: 100, y: 300, stepX: 300 },
  });
  amogus.children.iterate((child) => {
    //ustawienia przeciwników
    child.setBounce(1);
    child.body.gravity.y = 500;
    child.setScale(1.0).refreshBody();
    child.setCollideWorldBounds(true);
    child.setVelocityX(Phaser.Math.FloatBetween(-100, 100));
    //ustawienie animacji
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
    //kill
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
        killicon.setVisible(false);
      }
    });
    //kill-icon
    this.physics.add.overlap(player, child, function () {
      if (!isInVents && Math.round(Date.now() / 1000) - killingDate > 2) {
        killicon.setVisible(true);
        checkIfChancePassed = true;
      }
    });
    //button-przegrana
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
    //dialog-hołownia
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
  //rozłożenie ventów
  vents = this.physics.add.staticGroup();
  vents.create(30, 200, "vent");
  vents.create(1520, 200, "vent");
  vents.create(2890, 200, "vent");
  vents.create(5790, 200, "vent");
  vents.children.iterate((child) => {
    child.setScale(1).setOrigin(0).refreshBody();
    child.setVisible(false);
  });
  //wyczuwanie gracza koło ventów
  this.physics.add.overlap(vents, player, function () {
    inZone = true;
  });
  //przygotowanie ikon
  venticon = this.add.image(850, 250, "venticon");
  venticon.setScale(0.1, 0.1).setScrollFactor(0);
  venticon.setVisible(false);
  killicon = this.add.image(750, 250, "killicon");
  killicon.setScale(0.1, 0.1).setScrollFactor(0);
  killicon.setVisible(false);
}
let ventIsVisible = false;
let killIsVisible = false;
function update() {
  if (!checkIfChancePassed) killicon.setVisible(false);
  //napis pod player
  scoreText.setText("Enemies : " + howManyToKill);
  scoreText.x = player.body.position.x;
  //ikonka venta
  if (inZone && !ventIsVisible) {
    venticon.setVisible(true);
    ventIsVisible = true;
  } else if (inZone && ventIsVisible) {
  } else {
    venticon.setVisible(false);
    ventIsVisible = false;
  }
  //venty
  if (inZone && cursors.down.isDown&&!isInVents) {
    isInVents = true;
    susSituation = true;
  } else if (inZone && cursors.up.isDown&&isInVents) {
    isInVents = false;
    susSituation = true;
  }
  //poruszanie się player(vent albo nie)
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
  //animacje player
  if (cursors.left.isDown) {
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.anims.play("right", true);
  } else {
    player.anims.play("front");
  }
  //wygrana
  if (howManyToKill == 0 || drip == true) {
    let winned = this.add.tileSprite(0, 0, 900, 300, "win");
    winned.setOrigin(0);
    player.x = 0;
    player.y = 0;
    drip = true;
    venticon.setVisible(false);
    killicon.setVisible(false);
  }
  //pętla po przeciwnikach
  amogus.children.iterate((child) => {
    //wartość by sprawdzić jak blisko jest przeciwnik
    let x = Math.abs(player.x - child.x);
    //gdy przeciwnik przestanie rozmawiać nadana jest mu prędkość
    if (child.body.velocity.x == 0 && !talking)
      child.setVelocityX(Phaser.Math.FloatBetween(-100, 100));
    //zakończenie rozmowy
    if (talking && Math.round(Date.now() / 1000) - talkingDate > 3) {
      talking = false;
      textDialog.setVisible(false);
    }
    //czy przeciwnik zauważył, że jesteś SUS
    if (susSituation && x < 450) {
      if (player.x - child.x > 0 && child.body.velocity.x >= 0) {
        child.setVelocityX(-400);
        textDialog.setVisible(false);
      } else if (player.x - child.x < 0 && child.body.velocity.x <= 0) {
        child.setVelocityX(400);
        textDialog.setVisible(false);
      }
    }
    //przeciwnicy klatki animacji
    if (child.body.velocity.x < 0) {
      child.anims.play("left1", true);
    } else if (child.body.velocity.x > 0) {
      child.anims.play("right1", true);
    } else {
      child.anims.play("front1");
    }
  });
  //przegrana
  if (przegrana == true) {
    lost.setOrigin(0);
    lost.setVisible(true);
    player.x = 0;
    player.y = 0;
    player.setVisible(false);
    amogus.setVisible(false);
    scoreText.setVisible(false);
    venticon.setVisible(false);
    killicon.setVisible(false);
  }
  inZone = false;
  rangeToKill = false;
  susSituation = false;
  checkIfChancePassed = false;
}
