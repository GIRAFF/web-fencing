class GameManager
{
    constructor ( game )
    {
        this.is_debug = true;
        this.game_states = {
		MENU: 0,
		CONFIG: 1,
		PAUSE: 2,
		GAME: 3
	    };
        this.styles = 
        [
            { font: "20px UnifrakturMaguntia", fill: "#fac" },
            { font: "100px UnifrakturMaguntia", fill: "#ff3" }
        ];
        this.game_current_state = this.game_states.GAME;
        this.player = [];
        this.weapon_list = [];
        this.weapon_group = game.add.group();
	    this.weapon_group.enableBody = true;
        this.win_or_lose_dir = 0;
        this.current_winner_label;
        this.gravity = 800;
        this.camera = null; 
        this.bounce = 0;
        this.platforms = game.add.group();
	    this.platforms.enableBody = true;
	    let ground = this.platforms.create(-1000, game.height-20, "a");
	    ground.scale.setTo(100, 1);
        ground.body.immovable = true;


        this.input = {
            cursors: null,
            esc: null,
            wasd: null,
            player1: null,
            player2: null
        }

        this.input.cursors = game.input.keyboard.createCursorKeys();
        this.input.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.input.esc.onDown.add(function()
		{
			// TODO fade
			switch (curr_state) {
			case game_state.GAME:
				curr_state = game_state.PAUSE;
				pause_label = game.add.text(game.world.centerX - 200,
					game.world.centerY,
					"Press ESC to contunue",
					styles[0]);
				pause_label.anchor.setTo(0.5, 0.5);
				game.paused = true;
			break;
			case game_state.PAUSE:
				curr_state = game_state.GAME;
				pause_label.destroy();
				game.paused = false;
			break;
			}
		});
        let _input = this.input;
        this.input.wasd = {
             up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		     down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		     left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		     right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };
        this.input.player1 = {
            up: _input.cursors.up,
            down: _input.cursors.down,
            left: _input.cursors.left,
            right: _input.cursors.right,
            take: game.input.keyboard.addKey(Phaser.Keyboard.L),
            throw_weapon: game.input.keyboard.addKey(Phaser.Keyboard.J),
            jump: game.input.keyboard.addKey(Phaser.Keyboard.I),
            attack_simple: game.input.keyboard.addKey(Phaser.Keyboard.U)
        };
        this.input.player2 = {
                up: _input.wasd.up,
                down: _input.wasd.down,
                left: _input.wasd.left,
                right: _input.wasd.right,
                take: game.input.keyboard.addKey(Phaser.Keyboard.E),
                throw_weapon: game.input.keyboard.addKey(Phaser.Keyboard.R),
                jump: game.input.keyboard.addKey(Phaser.Keyboard.Z),
                attack_simple: game.input.keyboard.addKey(Phaser.Keyboard.X)
        }

    }

    addPlayer(game, pos, tname, color, dir)
    {
        this.player.push( new Player(game, {x:pos.x, y:pos.y}, color,
		    tname, this.bounce, this.gravity, dir));
    }

    cameraInit(game)
    {
        this.camera = game.add.sprite(game.world.centerX, 0,"X");
        game.physics.arcade.enable(this.camera);
        this.camera.height = game.world.height;
        this.camera.anchor.setTo(0.5,0);
        game.camera.follow(this.camera);
    }

    cameraUpdate(game)
    {
       // НЕ РАБОТАЕТ ! ИНТЕРСЕКТС ЛОВИТ ТОЛЬКО СЛЕВА НА ПРАВО
       // Здесь двигаем камеру
       // Если какой то игрок задел камеру, смещаем её в направлении игрока
       for (var i = 0; i < this.player.length; i++) {
           //this.camera.scale.setTo(this.player[i].dirrection);
           let a = game.physics.arcade.intersects(this.player[i].body.sprite,
                    this.camera); 
            if (a) {
                console.log("PX =" + this.player[i].body.sprite.position.x +
                    "CX = " + this.camera.x);
                this.camera.x = this.player[i].body.sprite.position.x +
                     10*this.player[i].dirrection;
            }
       }
    }
    spawnWeapon(position, dir)
    {
        this.weapon_list.push( 
            new Weapon(this.weapon_group, "weaponTexture", 
            this.gravity, this.bounce, position));

       this.weapon_group.add(this.weapon_list[this.weapon_list.length-1].sprite);
       this.weapon_list[this.weapon_list.length-1].doReflection(dir);
    }

    controlInput(game, index, control)
    {

        // Контроль передвижения
        if (!(control.right.isDown &&
            control.left.isDown &&
            control.up.isDown &&
            control.down.isDown )) {
            this.player[index].body.sprite.body.velocity.x = 0;
            }

        if (control.jump.isDown) this.player[index].jump(); 

        if (control.left.isDown) {
            this.player[index].left();
        } else if (control.right.isDown) {
            this.player[index].right(); 
        }

        // Подбор оружия
        if (control.down.isDown)
            if (this.player[index].weapon == null) 
            for(var i = 0; i < this.weapon_group.children.length; i++)
            {	
                let c = this.weapon_group.children[i].body.enable;
                this.weapon_group.children[i].body.enable = true;
                if (game.physics.arcade.intersects(
                    this.player[index].body.sprite.body,
                    this.weapon_group.children[i].body))
                    this.player[index].takeWeapon(this.weapon_list[i]);
                else
                    this.weapon_group.children[i].body.enable = c;
            }	
            
        // Атака
        if (control.throw_weapon.isDown) 
            if (this.player[index].weapon != null) 	this.player[index].attackThrow();
        // Поднятие/Опускание шпаги
        if (control.up.isDown)
                this.player[index].upDownArm(-1);
        else
        if (control.down.isDown)
                this.player[index].upDownArm(1);

        this.player[index].update();	
        //Обновляем положение шпаги
        if (this.player[index].weapon != null) {
            //Если стоит
            if (this.player[index].body.sprite.body.velocity.x == 0) {
                this.player[index].weapon.sprite.position.x =
                    this.player[index].body.sprite.position.x+
                        10*this.player[index].dirrection;
                this.player[index].weapon.sprite.alpha = 1;
                this.player[index].weapon.sprite.body.enable = true;
            }
            else {
            // Если бежит
                this.player[index].weapon.sprite.alpha = 0;
                this.player[index].weapon.sprite.body.enable = false;
            }
            this.player[index].weapon.doReflection(this.player[index].dirrection);
        }
    }

    weaponsUpdate( game )
    {
        for (var i = 0; i < this.weapon_list.length; i++) {
            this.weapon_list[i].update();
        }
    }

    playersWeaponsUpdate( game )
    {
        // Вертикальное положение шпаги
        for (var i = 0; i < this.player.length; i++) {
            if (this.player[i].weapon != null) {
                this.player[i].weapon.setPositionY( "p" +
                    this.player[i].weapon_position, 
                      this.player[i].body.sprite.body.position.y);
                this.player[i].weapon.doReflection(
                    this.player[i].dirrection);
            }
        }
        // Шпага со шпагой
        if (this.player[0].weapon != null && this.player[1].weapon != null) {
            game.physics.arcade.collide(this.player[0].weapon.sprite, 
                this.player[1].weapon.sprite);
        }
        // Убийство шпагой в руках
        if (this.player[0].weapon != null && !this.player[1].flags.is_dead) {
            let c = game.physics.arcade.collide(
				this.player[1].body.sprite, this.player[0].weapon.sprite);
			if (c) this.player[1].die();
        }
        // Убийство шпагой в руках
        if (this.player[1].weapon != null && !this.player[0].flags.is_dead) {
            let c = game.physics.arcade.collide(
				this.player[0].body.sprite, this.player[1].weapon.sprite);
			if (c) this.player[0].die();
        }
        //Убийства летящими шпагами
        for (var i = 0; i < this.weapon_list.length; i++) {
            if (this.weapon_list[i].flags.is_fly) {
                
                if (game.physics.arcade.collide(this.player[0].body.sprite,
                    this.weapon_list[i].sprite)) {
                        this.player[0].die();
                        this.weapon_list[i].dropWeapon();
                }

                if (game.physics.arcade.collide(this.player[1].body.sprite,
                    this.weapon_list[i].sprite)) {
                        this.player[1].die();
                        this.weapon_list[i].dropWeapon();
                }
            }
        }

        if (this.player[0].flags.is_dead && game.time.now > this.player[0].times.death)
				this.player[0].spawn(this.player[0].body.sprite.position, 1);
        if (this.player[1].flags.is_dead && game.time.now > this.player[1].times.death)
				this.player[1].spawn(this.player[1].body.sprite.position, -1);
    }

    collidePlayerPlatforms( game )
    {
        for (var i = 0; i < this.player.length; i++) {
            this.player[i].flags.on_ground = game.physics.arcade.collide(
                this.player[i].body.sprite, this.platforms);
        }
    }

    collideWeaponsPlatform( game )
    {

     for (var i = 0; i < this.weapon_list.length; i++) {
            this.weapon_list[i].flags.on_ground = game.physics.arcade.collide(
                this.weapon_list[i].sprite, this.platforms);
     }
    }

}