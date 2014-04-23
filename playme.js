var game = new Phaser.Game(600, 540, Phaser.AUTO, 'canvas');

var menu = {
    create: function() {
        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startKey.onDown.add(this.start, this);

        var style = { font: "25px Comic Sans MS", fill: "#ffffff", align: "center"};
        var x = game.world.width / 2;
        var y = game.world.height / 2;

        var text = game.add.text(x, y-50, "Press SPACE to start game\n\nPress F \nto flap that graduate!", style);
        text.anchor.setTo(0.5, 0.5); 
    },

    start: function() {
        this.game.state.start('gameplay');
    }
};

var initial = {
    preload: function() { 
        game.stage.backgroundColor = "#71c5cf";
        game.load.image('grad', 'grad.png');
        game.load.image('pipe', 'pipe.png');
    },

    create: function() { 
        this.grad = game.add.sprite(70, 80, 'grad');
        this.grad.width = 60;
        this.grad.height = 60;
        this.grad.anchor.setTo(-0.1, 0.3);
        this.grad.body.gravity.y = 1000;

        var fkey = game.input.keyboard.addKey(Phaser.Keyboard.F);
        fkey.onDown.add(this.jump, this);

        this.pipe = game.add.group();
        this.pipe.createMultiple(2, 'pipe');

        this.pipe2 = game.add.group();
        this.pipe2.createMultiple(2, 'pipe');

        this.timer = game.time.events.loop(2150, this.addPipe, this);

        this.score = 0;
        var style = {font: "57px Arial Black", fill: "#ffffff"};
        this.scoreText = game.add.text(270, 50, "0", style);
    },

    jump: function() {
        if(this.grad.alive == false) {
            return;
        }

        this.grad.body.velocity.y = -340;

        //rotating animation
        var animated = game.add.tween(this.grad);
        animated.to({angle: -25}, 200);
        animated.start();
    },

    restart: function() {
        if(this.grad.alive == false) {
            return;
        }

        this.grad.alive = false;
        game.time.events.remove(this.timer);

        this.pipe.forEachAlive(function(p) {
            p.body.velocity.x = 0;
        }, this);

        this.pipe2.forEachAlive(function(p2) {
            p2.body.velocity.x = 0;
        }, this);
    },

    addPipe: function() {
        //------- 1st pipe ---------
        var upperPipe = this.pipe.getAt(0);
        upperPipe.reset(500, 0);

        var h = Math.floor(Math.random() * 420);
        upperPipe.height = h;

        upperPipe.body.velocity.x = -400;

        var lowerPipe = this.pipe.getAt(1);
        lowerPipe.reset(500, upperPipe.height + 115);
        lowerPipe.height = 540 - lowerPipe.y;

        lowerPipe.body.velocity.x = -400;

        //------- 2nd pipe ---------
        var upperPipe2 = this.pipe2.getAt(0);
        upperPipe2.reset(500+300, 0);

        var h2 = Math.floor(Math.random() * 420);
        upperPipe2.height = h2;

        upperPipe2.body.velocity.x = -400;

        var lowerPipe2 = this.pipe2.getAt(1);
        lowerPipe2.reset(500+300, upperPipe2.height + 115);
        lowerPipe2.height = 540 - lowerPipe2.y;

        lowerPipe2.body.velocity.x = -400;
    },

    restart_menu: function() {
        game.time.events.remove(this.timer);
        game.state.start('menu');
    },


    update: function() {
        if(this.grad.inWorld == false) {
            this.restart_menu();
        }

        if((this.pipe.getAt(0).x < 100 && this.pipe.getAt(0).x > 94) ||
            (this.pipe2.getAt(0).x < 100 && this.pipe2.getAt(0).x > 94)) {
                this.score += 1;
                this.scoreText.content = this.score;
        }

        game.physics.overlap(this.grad, this.pipe, this.restart, null, this);
        game.physics.overlap(this.grad, this.pipe2, this.restart, null, this);

        if(this.grad.angle < 20) {
            this.grad.angle += 1;
        }
    },
};

game.state.add('gameplay', initial);  
game.state.add('menu', menu);
game.state.start('menu'); 









