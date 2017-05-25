class GameManager
{
	constructor(game)
	{
		this.is_debug = false;
		this.debug_time = 0;
		this.player = [];
		this.weapon_list = [];
		this.weapon_group = game.add.group();
		this.weapon_group.enableBody = true;
		this.win_or_lose_dir = 0; // -1 направление влево, 1 вправо, 0 - никуда
		this.current_winner_label; // Phaser.Text, сюда выводим GO и направление
		this.gravity = 800; // Гравитация всех объектов
		this.camera = null; 
		this.bounce = 0;  // Отскок от земли
		this.platforms = game.add.group(); // Phaser.Group Платформы 
		this.platforms.enableBody = true;
		this.map = new Map(this.platforms, game);
		this.map.InitFromList(map1);
		//this.lvl = 3;//	| 0 | 1 | 2 | 3 | 4 | 5 | 6 |
					 // |___|___|___|___|___|___|___|
		//this.lvl_length = game.world.width/7;
		this.end_lvl_timer = 0;
		this.win = -1;
		this.back = [];
		this.anim = [];

		this.input = {
			cursors: null,
			esc: null,
			wasd: null,
			player1: null,
			player2: null
		}

		this.input.cursors = game.input.keyboard.createCursorKeys();
		this.input.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		this.input.esc.onDown.add(() =>
			{
				var me = this,
					layout = document.getElementById("pause");
				if (game.paused) {
					game.paused = false;
					layout.classList.add("hidden");
				} else {
					game.paused = true;
					layout.classList.remove("hidden");
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
			throw_weapon: game.input.keyboard.addKey(Phaser.Keyboard.U),
			jump: game.input.keyboard.addKey(Phaser.Keyboard.I),
			attack_simple: game.input.keyboard.addKey(Phaser.Keyboard.U),
			debug: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};

		this.input.player2 = {
			up: _input.wasd.up,
			down: _input.wasd.down,
			left: _input.wasd.left,
			right: _input.wasd.right,
			take: game.input.keyboard.addKey(Phaser.Keyboard.E),
			throw_weapon: game.input.keyboard.addKey(Phaser.Keyboard.X),
			jump: game.input.keyboard.addKey(Phaser.Keyboard.Z),
			attack_simple: game.input.keyboard.addKey(Phaser.Keyboard.X),
			debug: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		}

		this.initEvents();
	}
  
	initEvents()
	{
		// fires when menu item is selected
		document.addEventListener("menuHit", function(e) {
			if (e.detail.action === "game") {
				document.getElementById("menu").classList.add("hidden");
			}
		});
	}

	addPlayer(game, pos, tname, color, dir)
	{
		this.player.push( new Player(game, {x:pos.x, y:pos.y}, color,
			tname, this.bounce, this.gravity, dir));
	}

	cameraInit(game, t)
	{
		this.camera = game.add.sprite(game.world.centerX, 0, t);
		game.physics.arcade.enable(this.camera);
		this.camera.height = game.world.height;
		this.camera.width = 32;
		this.camera.anchor.setTo(0.5,0);
		game.camera.follow(this.camera);
		
		this.camera.move = function(d, s)   
		{
			if(this.position.x >= game.width/2
			&& this.position.x <= game.world.width - game.width/2)
				this.body.velocity.x = d * s;
			else
				this.body.velocity.x = 0;
		};
		
		this.camera.position.x = (this.player[0].body.sprite.position.x +
			this.player[1].body.sprite.position.x)/2;
	}

	cameraUpdate(game)
	{
		if (this.win_or_lose_dir != 0) {
			if (!this.player[0].flags.is_dead && !this.player[1].flags.is_dead){
				this.camera.position.x = (this.player[0].body.sprite.position.x +
									 this.player[1].body.sprite.position.x)/2;
		   }
	
		if (this.player[0].flags.is_dead){
			if (this.player[1].body.sprite.position.x < this.camera.position.x)
			   this.camera.move(-1, 200 - this.player[1].body.sprite.body.velocity.x);
           else
			   if (this.player[1].body.sprite.position.x - 150 > this.camera.position.x
		        && this.player[1].body.sprite.body.velocity.x <= 0){
			       this.camera.move(-1, -this.player[1].body.sprite.body.velocity.x);
			}

			if (this.player[0].flags.is_dead){
				if (this.player[1].body.sprite.position.x < this.camera.position.x)
					this.camera.move(-1, 200 + this.player[1].body.sprite.body.velocity.x);
				else
					if (this.player[1].body.sprite.position.x - 150 > this.camera.position.x
						&& this.player[1].body.sprite.body.velocity.x <= 0){
						this.camera.move(-1, this.player[1].body.sprite.body.velocity.x);
					}
			}

			if (this.player[1].flags.is_dead){
				if (this.player[0].body.sprite.position.x > this.camera.position.x)
					this.camera.move(1, 200 + this.player[0].body.sprite.body.velocity.x);
				else 
					if (this.player[0].body.sprite.position.x + 150 > this.camera.position.x
						&& this.player[0].body.sprite.body.velocity.x >= 0){
						this.camera.move(1, this.player[0].body.sprite.body.velocity.x);
					}
			}

			for (var i = 0; i < this.player.length; i++)
				if (this.player[i].body.sprite.position.x > this.camera.position.x + 600 ||
					this.player[i].body.sprite.position.x < this.camera.position.x - 600) {
					if (this.player[i].body.sprite.position.x > this.camera.position.x) {
						this.player[i].body.sprite.body.velocity.x = 
							-this.player[i].velocities.horizontal_velocity;
					} else {
						this.player[i].body.sprite.body.velocity.x = 
							this.player[i].velocities.horizontal_velocity;
					}
				}
			if (this.win_or_lose_dir == 1
				&& this.camera.position.x
				> this.player[1].body.sprite.position.x + 550) {
				this.player[1].die();
			}
			if (this.win_or_lose_dir == -1
				&& this.camera.position.x
				< this.player[0].body.sprite.position.x - 550) {
				this.player[0].die();
			}
	   if (this.win_or_lose_dir == 1 && this.camera.position.x > this.player[1].body.sprite.position.x + 550)
            this.player[1].body.sprite.position.x = this.player[0].body.sprite.position.x + 600;
       if (this.win_or_lose_dir == -1 && this.camera.position.x < this.player[0].body.sprite.position.x - 550)
            this.player[0].body.sprite.position.x = this.player[1].body.sprite.position.x - 600;
		
		if (this.camera.position.x > game.world.width)
			this.camera.position.x = game.world.width;
		if (this.camera.position.x < 0)
			this.camera.position.x = 0;
		}
	}

	updateMoveLabels()
	{
		var pl_label= document.getElementById('player-left');
		var pr_label= document.getElementById('player-right');
		switch (this.win_or_lose_dir) {
			case -1:
				pl_label.classList.remove('hidden');
				pr_label.classList.add('hidden');
			break;
			case 1:
				pr_label.classList.remove('hidden');
				pl_label.classList.add('hidden');
			break;
			default:
				pl_label.classList.remove('hidden');
				pr_label.classList.remove('hidden');
		}

	spawnWeapon(position, dir)
	{
		this.weapon_list.push( 
			new Weapon(this.weapon_group, "weaponTextureRotate",
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

		// Приседание с задержкой
		if (control.down.isDown) {
			this.player[index].is_seat = true;
		} else if (control.down.isUp) {
			this.player[index].is_seat = false;
			this.player[index].stay();
		}
		if (this.player[index].is_seat) {
			this.player[index].times.down_time +=4;
		} else {
			this.player[index].times.down_time = 0;
		}
		if (this.player[index].times.down_time > 70 &&
			this.player[index].body.sprite.body.velocity.x == 0
			&& !this.player[index].flags.is_seat) {
			this.player[index].body.sprite.position.y -= 50;
			this.player[index].seat();
			this.player[index].times.down_time = 0;
		}

		if (control.jump.isDown) this.player[index].jump(); 

		if (control.left.isDown) {
				this.player[index].left(this.win_or_lose_dir, this.camera.position.x);
			if(!this.player[index].flags.on_ground)
				this.player[index].setAnimation("jump");
		} else if (control.right.isDown) {
				this.player[index].right(this.win_or_lose_dir, this.camera.position.x);
			if(!this.player[index].flags.on_ground)
				this.player[index].setAnimation("jump");
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
		if (control.attack_simple.isDown) { //Неработающая атака
			this.player[index].attackSimple();
		}

		if (control.throw_weapon.isDown) 
			if (this.player[index].weapon != null)
				this.player[index].attackThrow();
		// Поднятие/Опускание шпаги
		if (control.up.isDown && this.player[index].flags.on_ground)
			this.player[index].upDownArm(-1);
		else
			if (control.down.isDown && this.player[index].flags.on_ground)
				this.player[index].upDownArm(1);
        this.player[index].update();	
        //Обновляем положение шпаги
        if (this.player[index].weapon != null) {
            //Если стоит
            if (this.player[index].body.sprite.body.velocity.x == 0) {
				if (!this.player[index].weapon.flags.is_attack) {
                this.player[index].weapon.sprite.position.x =
                    this.player[index].body.sprite.position.x+
                        10*this.player[index].dirrection;
				}
                this.player[index].weapon.sprite.alpha = 1;
                this.player[index].weapon.sprite.body.enable = true;
            }
            else {
            // Если бежит
                this.player[index].weapon.sprite.alpha = 0;
				this.player[index].weapon.sprite.position.x =
                this.player[index].body.sprite.position.x-
                        50 * this.player[index].dirrection;
				this.player[index].weapon.sprite.position.y =
                this.player[index].body.sprite.position.y-20;
            }
            this.player[index].weapon.doReflection(this.player[index].dirrection);
        }


		if (control.debug.isDown) {
			if(this.debug_time < game.time.now) {
				this.debug_time = game.time.now + 100;
				this.is_debug = !this.is_debug;
			}
		}
    }
    
	weaponsUpdate(game)
	{
		for (var i = 0; i < this.weapon_list.length; i++) {
			this.weapon_list[i].update();
		}
	}

	playersUpdate(game, win)
	{
		if (this.player[0].body.sprite.body.position.x > game.world.width - 50){
			this.win = 0;
		}
		if (this.player[1].body.sprite.body.position.x < 50){
			this.win = 1;
		}
		
		if (this.win != -1){
			var winImage = game.add.image(0, 0, win);
			winImage.scale.set(0.7);
			winImage.smoothed = false;
			winImage.position.y = 100;
			
			if (this.win == 0)
			{
				this.player[0].body.sprite.body.position.x = game.world.width - game.width/2;
				winImage.position.x = game.world.width - game.width/2 - 224;		//320 = ширина картинки/2; 224 = 320*scale;
			}
			else
			{
				this.player[1].body.sprite.body.position.x = game.width/2;
				winImage.position.x = game.width/2 - 224;
			}
		}
	}
	
	playerPlayerEffects(game)
	{
		// Отталкивание двух игроков друг от друга
		if (this.player[0].weapon != null && this.player[1].weapon != null) {
			if (game.physics.arcade.intersects(this.player[0].weapon.sprite.body,
			 this.player[1].weapon.sprite.body)) {
				let power = 900;
				this.player[0].body.sprite.body.velocity.x = -this.player[0].dirrection*power;
				this.player[1].body.sprite.body.velocity.x = -this.player[1].dirrection*power;
			 }
		}
	}

	playersWeaponsUpdate(game)
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
			if (c){
				this.win_or_lose_dir = -1;
				this.player[1].die();
			}
		}
		// Убийство шпагой в руках
		if (this.player[1].weapon != null && !this.player[0].flags.is_dead) {
			let c = game.physics.arcade.collide(
				this.player[0].body.sprite, this.player[1].weapon.sprite);
			if (c){
				this.win_or_lose_dir = 1;
				this.player[0].die();
			}
		}
		//Убийства летящими шпагами
		for (var i = 0; i < this.weapon_list.length; i++) {
			if (this.weapon_list[i].flags.is_fly) {
                if (game.physics.arcade.collide(this.player[1].body.sprite,
                    this.weapon_list[i].sprite)) {
                        this.player[1].die();
						this.win_or_lose_dir = -1;
                        this.weapon_list[i].dropWeapon();
                }
				 if (game.physics.arcade.collide(this.player[0].body.sprite,
                    this.weapon_list[i].sprite)) {
                        this.player[0].die();
						this.win_or_lose_dir = 1;
                        this.weapon_list[i].dropWeapon();
                }
            }
        }
        // Столкновения летящих шпаг  
        for (var i = 0; i < this.weapon_list.length; i++)
            if (this.weapon_list[i].flags.is_fly)
                for (var j = 0; j < this.weapon_list.length; j++)
                    if (this.weapon_list[i].flags.is_fly && i != j)
                        if (game.physics.arcade.collide(this.weapon_list[i].sprite,
                            this.weapon_list[j].sprite)) {
                                if(!this.weapon_list[i].flags.is_used)
                                    this.weapon_list[i].dropWeapon();
                                if(!this.weapon_list[j].flags.is_used)
                                    this.weapon_list[j].dropWeapon();
                }

        /*if (this.player[0].flags.is_dead && game.time.now > this.player[0].times.death && this.win == -1) {
				this.player[0].spawn( {x: this.camera.position.x - game.width/2 + 200, y: 200}, 1,  game);
				this.win_or_lose_dir = -1;
		}
		else
        if (this.player[1].flags.is_dead && game.time.now > this.player[1].times.death && this.win == -1) {
				this.player[1].spawn( {x: this.camera.position.x + game.width / 2 - 200, y: 200}, -1,  game);
				this.win_or_lose_dir = 1;
		}
		else if (this.player[1].flags.is_dead && this.player[0].flags.is_dead &&
		game.time.now > this.player[0].times.death && game.time.now > this.player[1].times.death && this.win == -1) {
			this.player[0].spawn( {x: this.camera.position.x - game.width/2 + 200, y: 200}, 1,  game);
			this.player[1].spawn( {x: this.camera.position.x + game.width / 2 - 200, y: 200}, -1,  game);
			this.win_or_lose_dir = 0;
		}*/

		if (this.player[0].flags.is_dead && game.time.now > this.player[0].times.death && this.win == -1)
			this.player[0].spawn( {x: this.camera.position.x - game.width/2 + 200, y: 200}, 1,  game);
		if (this.player[1].flags.is_dead && game.time.now > this.player[1].times.death && this.win == -1)
			this.player[1].spawn( {x: this.camera.position.x + game.width / 2 - 200, y: 200}, -1,  game);
	}

	collidePlayerPlatforms(game)
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
	
	mapInit(bg)
	{
		for (var i = 0; i < 5; i++){
			this.back[i] = game.add.image(0, 0, bg);
			this.back[i].scale.set(1.2);
			this.back[i].smoothed = false;
			//this.back[i].position.x = 15400 + i*960;
			this.back[i].position.x = i*960;
			this.anim[i] = this.back[i].animations.add('play');
			this.anim[i].play(3, true);
		}
	}
}
