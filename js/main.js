/* main.js */

// for our Phaser.Game
var isdebug = true,
	game,
	game_state = {
		MENU: 0,
		CONFIG: 1,
		PAUSE: 2,
		GAME: 3
	},
	curr_state = game_state.GAME,
	text,
	createText,
	sound,
	camera, 
	styles = //styles for different text
	[
		{ font: "20px UnifrakturMaguntia", fill: "#fac" },
		{ font: "100px UnifrakturMaguntia", fill: "#ff3" }
	],
	//use it for all the keyboard input
	input =
	{
		cursors: null,
		esc: null
	}, 
	player = [], //players  Phaser.game.sprite
	platforms, //platforms  Phaser.game.sprite
	gravity = 300, //global player gravity
	wasd = {},
	weapons, // all weapons
	line1, line2, line3, line4; // for DEBUG !!!

// script for loading fonts from google fonts.
WebFontConfig = {
	active: function()
	{
		console.log("active");
		game.time.events.add(Phaser.Timer.SECOND, function()
			{
				console.log("loading correct");
			}, this);
	},
	google: {
		families: ["UnifrakturMaguntia"]
	},
	loading: function(){ console.log("loading"); }
};

function init()
{
	game = new Phaser.Game(800, 600, Phaser.CANVAS, "game", {
		preload: preload,
		create: create,
		update: update,
		render: render
	});
}

function preload()
{
	// loading font from google fonts too long loading !!!
	game.load.script('webfont',
		'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	// load weapon texture
	game.load.spritesheet("weaponTexture",
		"assets/rapire.png", 81, 9, 1, 0, 0); // sword
	// load player texture
	/*game.load.spritesheet("player1",
		"assets/AnimationRun_v1_1.png", 98, 107, 10, 6, 6);//player
*/

game.load.spritesheet("player1",
		"assets/pr00.png", 130, 163, 22, 6, 6);//player

game.load.spritesheet("player2",
		"assets/pr01.png", 130, 163, 22, 6, 6);//player


	/*game.load.audio("sound",
		"assets/MainThemev2.wav", true);*/
	//game.load.image("test1", "assets/test1_v2.0.png");
}

function create()
{
	line1 = new Phaser.Line(0,0,1,1);
	line2 = new Phaser.Line(0,0,1,1);
	line3 = new Phaser.Line(0,0,1,1);
	line4 = new Phaser.Line(0,0,1,1);

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#000";
	
	// keyboard control
    input.cursors = game.input.keyboard.createCursorKeys();
	input.wasd = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		take_player0: game.input.keyboard.addKey(Phaser.Keyboard.L),
		take_player1: game.input.keyboard.addKey(Phaser.Keyboard.E),
		throw_player0: game.input.keyboard.addKey(Phaser.Keyboard.K),
		throw_player1: game.input.keyboard.addKey(Phaser.Keyboard.Q),
		throw_weapon_into_face0: game.input.keyboard.addKey(Phaser.Keyboard.J),
		throw_weapon_into_face1: game.input.keyboard.addKey(Phaser.Keyboard.R),
		jump_player0: game.input.keyboard.addKey(Phaser.Keyboard.I),
		jump_player1: game.input.keyboard.addKey(Phaser.Keyboard.Z),
		attack_player0: game.input.keyboard.addKey(Phaser.Keyboard.U),
		attack_player1: game.input.keyboard.addKey(Phaser.Keyboard.X),
	};
	input.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	// pause
	input.esc.onDown.add(function()
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

	// earth
	platforms = game.add.group();
	platforms.enableBody = true;
	var ground = platforms.create(-1000, game.height-20, "a");
	ground.scale.setTo(100, 1);
    ground.body.immovable = true;

	// add_weapon
	weapons = game.add.group();
	weapons.enableBody = true;
	weapons.checkArea =  function(size)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			if(this.children[i].position.x <= 0 ||
			   this.children[i].position.x >= size.w ||
			   this.children[i].position.y <= 0 ||
			   this.children[i].position.y >= size.h)
			   		console.log("WARNING");
		}
	};
	createWeapon(weapons, "weaponTexture", 1000, { x:100, y:0});
	createWeapon(weapons, "weaponTexture", 1000, { x:500, y:500});
	
	// for game world size more than screen size
	game.world.setBounds( -1000, 0, 2000, 600);
	//game.world.setBounds(0, 0, 800, 600);

	text = game.add.text(game.world.centerX,
		game.world.centerY,
		"this game",
		styles[1]);

	// Player 1 init
	player.push(createPlayer(game, {x:-100, y:100}, "#fac",
	 "player1", 800, 0.1, -1));
			
	// Player 2 init	
	player.push(createPlayer(game, {x:-500, y:200}, "#fac",
		"player2" , 800, 0.1, 1));


	//player[0].takeWeapon(weapons.children[0]);
	//player[1].takeWeapon(weapons.children[1]);
	// Music Need host
	//sound = game.add.audio("sound", 1, false, true);

		// Object for camera
	camera = game.add.sprite(
		(player[0].body.sprite.position.x-player[1].body.sprite.position.x)/2, 
		game.world.centerY,
		"a");

	camera.anchor.setTo(0.5,0.5);
	game.camera.follow(camera);
}

function inScreen(p_pos, c_pos, c_width)
{
	return ( Math.abs(p_pos.x) <= Math.abs(c_pos.x) + c_width );
}

function update()
{
	//Save dirrection player for scale
	var temp_dir = [];
		for(var i = 0; i < player.lengthl; i++)
			temp_dir.push(player[i].dirrection);

	switch (curr_state) {
	case game_state.GAME:
	// Check different collisions
		for(var i = 0; i < weapons.length; i++)
		{
			weapons.children[i].updateRect();
			if(weapons.children[i].is_fly) {
				 if(game.physics.arcade.collide(
					weapons.children[i], platforms)) {
					weapons.children[i].body.velocity.x = 0;
					weapons.children[i].is_used = false;
					weapons.children[i].is_fly = false;
					}
				 if(game.physics.arcade.collide(
					weapons.children[i], player[0].body.sprite.body)) {
					weapons.children[i].body.velocity.x = 0;
					weapons.children[i].is_used = false;
					weapons.children[i].is_fly = false;
					}
				 if(game.physics.arcade.collide(
					weapons.children[i], player[1].body.sprite.body)) {
					weapons.children[i].body.velocity.x = 0;
					weapons.children[i].is_used = false;
					weapons.children[i].is_fly = false;
					}
			}
		}
			//for check collision of players
			game.physics.arcade.collide(
				player[0].body.sprite,player[1].body.sprite);

			//Each weapons on earth    bug
			for (var i = 0; i < weapons.children.length; i++) {
				weapons.children[i].on_ground = game.physics.arcade.collide(
					weapons.children[i], platforms);
			}
      
		if(player[0].weapon != null && player[1].weapon != null) {
			var t = game.physics.arcade.collide(
					player[0].weapon, player[1].weapon);
					if(t) {
						player[0].weapon.tint = 0xFFFF00;
						player[1].weapon.tint = 0xFFFF00;
					} else {
						player[0].weapon.tint = 0xFFFFFF;
						player[1].weapon.tint = 0xFFFFFF;
					}
		}

		// for event die
		if (player[1].weapon != null) {
			let c = game.physics.arcade.collide(
				player[0].body.sprite, player[1].weapon);

			if (c) player[0].die();

		}

		if (player[0].weapon != null) {
			let c = game.physics.arcade.collide(
				player[1].body.sprite, player[0].weapon);

			if (c)	player[1].die();
		}
			for (var i = 0; i < player.length; i++)	{
				// Player with platforms collide
				player[i].on_ground =  game.physics.arcade.collide(
					player[i].body.sprite, platforms);

				//for update position head,legs and arms
				if (player[i].dirrection != temp_dir[i]) {
					player[i].doReflection();
				}
			}

			// Commands input
			if (!(input.cursors.right.isDown &&
				input.cursors.left.isDown &&
				input.cursors.up.isDown &&
				input.cursors.down.isDown )) {
				player[0].body.sprite.body.velocity.x = 0;
			}

			if (!(input.wasd.right.isDown &&
				input.wasd.left.isDown &&
				input.wasd.up.isDown &&
				input.wasd.down.isDown )) {
				player[1].body.sprite.body.velocity.x = 0;	
			}

		if (input.wasd.jump_player0.isDown)	player[0].jump(); 

		if (input.cursors.left.isDown) {
		//	if (inScreen(player[0].body.sprite.position,camera.position, 320))
					player[0].left(); 
		//	else { /*Если текущий игрок победитель раунда, то меняем уровень влево*/ }
		} else if (input.cursors.right.isDown) {
		//	if (inScreen(player[0].body.sprite.position, camera.position, 320))
					player[0].right(); 
		//	else { /*Если текущий игрок победитель раунда, то меняем уровень вправо*/ }
		}
			
		if (input.wasd.jump_player1.isDown) player[1].jump();

		if (input.wasd.left.isDown) {
		//	if (inScreen(player[1].body.sprite.position,camera.position, 320))
					player[1].left();
		//	else { /*Если текущий игрок победитель раунда, то меняем уровень влево*/ }
		} else if (input.wasd.right.isDown) {
		//	if (inScreen(player[1].body.sprite.position,camera.position, 320))
					player[1].right();
		//	else { /*Если текущий игрок победитель раунда, то меняем уровень вправо*/ }
		}
	
		
		if (input.wasd.down.isDown && player[1].weapon == null) {
			if(player[1].weapon == null)
				for(var i = 0; i < weapons.children.length; i++)
				{	
					let c = weapons.children[i].body.enable;
						weapons.children[i].body.enable = true;
						if(game.physics.arcade.intersects(
							player[1].body.sprite.body,
							weapons.children[i].body))
							player[1].takeWeapon(weapons.children[i]);
						else
							weapons.children[i].body.enable = c;
					}	
			}

		if(input.cursors.down.isDown && player[0].weapon == null) {
			if(player[0].weapon == null)
				for(var i = 0; i < weapons.children.length; i++)
				{	
					let c = weapons.children[i].body.enable;
						weapons.children[i].body.enable = true;
						if (game.physics.arcade.intersects(
							player[0].body.sprite.body,
							weapons.children[i].body))
							player[0].takeWeapon(weapons.children[i]);
						else
							weapons.children[i].body.enable = c;
					}	
			}

		if(input.wasd.throw_weapon_into_face0.isDown) {
			if (player[0].weapon != null) 	player[0].attackThrow();
		}

		
		if(input.wasd.throw_weapon_into_face1.isDown) {
			if (player[1].weapon != null) 	player[1].attackThrow();
		}
			if (input.wasd.up.isDown && player[1].weapon != null)
				player[1].weaponPositionUpdate(-1);
			if (input.wasd.down.isDown && player[1].weapon != null)
				player[1].weaponPositionUpdate(1);	
			if (input.cursors.up.isDown && player[0].weapon != null)
				player[0].weaponPositionUpdate(-1);
			if (input.cursors.down.isDown && player[0].weapon != null)
				player[0].weaponPositionUpdate(1);	
			
			if (input.wasd.attack_player0.isDown)	player[0].attackSimple();
			if (input.wasd.attack_player1.isDown)	player[1].attackSimple();

			if (player[0].is_dead &&  game.time.now > player[0].death_time)
				player[0].respawn(player[1].body.sprite.position, 1);
			if (player[1].is_dead &&  game.time.now > player[1].death_time)
				player[1].respawn(player[0].body.sprite.position, -1);

			player[0].updateBodyPartsPosition();	
			player[1].updateBodyPartsPosition();	
			weapons.checkArea({w: game.world.width, h: game.world.height});

			// camera
	
			camera.position.x = (player[0].body.sprite.position.x +
								player[1].body.sprite.position.x)/2; 

			
			break;
		case game_state.PAUSE:
			break;
		default: break;	
	}
}

function render()
{
	if(isdebug)
	{
	line1.setTo(player[0].body.sprite.body.position.x,
		player[0].body.sprite.body.position.y,
		player[0].body.sprite.body.position.x +
		player[0].body.sprite.body.width,
		player[0].body.sprite.body.position.y +
		player[0].body.sprite.body.height);

	line2.setTo(player[1].body.sprite.body.position.x,
		player[1].body.sprite.body.position.y,
		player[1].body.sprite.body.position.x +
		player[1].body.sprite.body.width,
		player[1].body.sprite.body.position.y +
		player[1].body.sprite.body.height);

	game.debug.geom(line1);
    game.debug.rectangle(line1);
	game.debug.geom(line2);
    game.debug.rectangle(line2);

	if(player[0].weapon != null) {
		line3.setTo(player[0].weapon.body.position.x,
				     player[0].weapon.body.position.y,
				     player[0].weapon.body.position.x +
					 player[0].weapon.body.width,
					 player[0].weapon.body.position.y +
					 player[0].weapon.body.height);
		game.debug.geom(line3);
    game.debug.rectangle(line3);
	}

	if(player[1].weapon != null) {
		line4.setTo(player[1].weapon.body.position.x,
				     player[1].weapon.body.position.y,
				     player[1].weapon.body.position.x +
					 player[1].weapon.body.width,
					 player[1].weapon.body.position.y +
					 player[1].weapon.body.height);
		game.debug.geom(line4);
    game.debug.rectangle(line4);
	}
	}
}
