let level_list = [];
let number_level;			// how many levels
let level_n = [];			// size of each level
let level_min = [];			// min number of moves for each level
let level_name = [];		// name of each level

let level_data = [];

let map = [];

let level = 0;				// current level


let player = [0, 0, 0]; 	// player coordinates
let moves = 0;				// how many moves have been done in the current level
let temp = [0, 0, 0];

let history = [];
history[0] = [0, 0, 0];

let p, e, o;
let wall = '1';
let target = '2';
//empty = ' '

let win = 0;
let frame = [];

let d;				//objects size

let a,b;			//angular position of the cube

let tx_size;		//text size

//swiping variable
let init = [0,0];
let end = [0, 0];
let angle = 0;

let undo_size = [];
let undo_pos = [];
let undo_coord = [];


// TO LOAD FILE USE ONLY preload()
function preload() {
	myFont = loadFont('assets/galiver.ttf');
	
	level_list = loadStrings('assets/levels/level_list.csv', function(data) {			// reading level list
		number_level = level_list.length;												// when this is load, load level files
		for (let l=0; l<number_level; l++){
			split_data = level_list[l].split(',');
			level_n[l] = parseInt(split_data[0]);		// size of each level
			level_min[l] = parseInt(split_data[1]);		// min moves of each level
			level_name[l] = split_data[2] + '.txt';		// file name of each level
			
			level_data[l] = [];
			loadStrings('assets/levels/' + level_name[l], function(l_data) {
				level_data[l] = l_data;
			});
		}
	});
}

function setup() {
	if (displayWidth < windowWidth)							//on mobile
		createCanvas(displayWidth, displayHeight, WEBGL);
	else													//on pc
		createCanvas(windowWidth, windowHeight, WEBGL);
		
	colorMode(RGB, 100);
	smooth();
	
	d = min(width, height)*0.9;
	tx_size = d/50;
	
	textFont(myFont, 36);
	
	p = color(0,50,100);	//player color


	e = color(0,0,0);		//'0' = empty cell
	e_active = color(20,20,20)
	w = color(60,60,60);		//'1' = wall
	o = color(100,90,0);		//'2' = target

	frame[0] = color(100,100,100);
	frame[1] = color(100,100,100);
	frame[2] = color(100,100,100);
	
	// BUTTONS
	
	// drawing: origin is center of the screen
	// when getting the mouse coordinates, origin is top left
	
	undo_size = [d/4, d/9];
	undo_pos = [d/4, -d/1.8];
	undo_coord = [undo_pos[0], undo_pos[0] + undo_size[0], undo_pos[1], undo_pos[1]+undo_size[1]];
	
	
	// levels set up
	for (let l=0; l<number_level; l++){
		map[l] = [];
	
		for (let x=0; x<level_n[l]; x++){
			map[l][x] = [];
			for (let y=0; y<level_n[l]; y++){
				map[l][x][y] = [];
				map[l][x][y] = level_data[l][x*level_n[l]+y].split('');
			}
		}
		
	}
	
	//console.log(map[0][0]);
	
	a = PI/3.5;
	b = -3*PI/4;
}

function draw() {
	background(30);
	noStroke();
	
	if ((temp[0] != player[0]) ||(temp[1] != player[1]) || (temp[2] != player[2])) {
		moves += 1;
		history[moves] = [];
		for (i=0; i<3; i++) {
			temp[i] = player[i];
			history[moves][i] = player[i];
		}
	}
	
	push();
	fill(0);
	textAlign(CENTER, BOTTOM);
	textSize(tx_size*5);
	text((moves) +'/'+ (level_min[level]), d/3, d/2.07);
	textSize(tx_size*2);
	text('MOVES', d/3, d/2.79);
	pop();
	
	push();
	fill(0);
	textAlign(CENTER, BOTTOM);
	textSize(tx_size*5);
	text((level+1), -d/3, d/2.07);
	textSize(tx_size*2);
	text('LEVEL', -d/3, d/2.79);
	pop();
	
	push();
	fill(0);
	textAlign(CENTER, TOP);
	textSize(tx_size*3);
	if (moves == 0)
		fill(40);
	text('undo', d/3, -d/1.9);
	pop();
	
	// undo button
	//noFill();
	//stroke(0);
	//rect(undo_pos[0], undo_pos[1], undo_size[0], undo_size[1]);
	
	push();					//upper face
	translate(0, -d/12, 0);
	rotateX(a);
	rotateZ(b);
	show_yz(0, 0);
	axes_yz(0, 0);
	pop();
	
	push();					//left face
	translate(0, -d/12, 0);
	rotateX(a);
	rotateZ(b + PI/2);
	rotateY(PI/2);
	rotateZ(-PI/2);
	show_zx(0, 0);
	axes_zx(0, 0);
	pop();
	
	push();					//right face
	translate(0, -d/12, 0);
	rotateX(a + PI);
	rotateZ(b + PI/2);
	rotateY(-PI/2);
	show_xy(0, 0);
	axes_xy(0, 0);
	pop();

	if (map[level][player[0]][player[1]][player[2]] == target)
		win = 1;

	if (win == 1)
		victory();
	
	//line(0,0, 100*cos(angle - PI/2 + PI/6), 100*sin(angle - PI/2 + PI/6));
}

function keyPressed() {
	if ((key == 1) || (key == 2) || (key == 3))
		view = key;
	
	if (keyCode === RIGHT_ARROW)
		move_y(1);
	else if (keyCode === LEFT_ARROW)
		move_y(-1);
	else if (keyCode === UP_ARROW)
		move_x(-1);
	else if (keyCode === DOWN_ARROW)
		move_x(1);
	else if (key == 'd')
		move_z(-1);
	else if (key == 'a')
		move_z(1);
	else if (key == 'w')
		move_x(-1);
	else if (key == 's')
		move_x(1);
	
	if (key == 'u') {				// I have no idea why I have to decrease moves twice
		undo();
	}
	
	if (key == 'p')
		start_newlevel();
	
	if (key == 0) {
		player = [0, 0, 0];
		temp = [0,0,0];
		moves = 0;
	}
	
	if (win == 1)
		start_newlevel();

	return false;
}

function mousePressed() {
	init[0] = mouseX;
	init[1] = mouseY;
	
	if (win == 1)
		start_newlevel();
	

	if (mouseX > width/2 + undo_coord[0] && mouseX < width/2 + undo_coord[1] && mouseY > height/2 + undo_coord[2] && mouseY < height/2 + undo_coord[3])
		undo();
	//rect(d/5, -d/1.8, d/4, d/7);
	console.log(mouseX);
	console.log(mouseY);
}

function mouseReleased() {
	end[0] = mouseX;
	end[1] = mouseY;
	
	angle = Math.atan((end[1]-init[1])/(end[0]-init[0]));
	
	if (end[0] < init[0]) angle += PI;
	angle += PI/2;
	
	if ((angle > PI/6) && (angle < PI/2))
		move_y(1);
	else if ((angle > PI/2) && (angle < 5*PI/6))
		move_z(-1);
	else if ((angle > 5*PI/6) && (angle < 7*PI/6))
		move_x(1);
	else if ((angle > 7*PI/6) && (angle < 3*PI/2))
		move_y(-1);
	else if ((angle > 3*PI/2) && (angle < 11*PI/6))
		move_z(1);
	else if ((angle > 11*PI/6) || (angle < PI/6))
		move_x(-1);
}

function touchStarted() {
	init[0] = mouseX;
	init[1] = mouseY;
	
	if (win == 1)
		start_newlevel();
}

function touchEnded(event) {
	end[0] = mouseX;
	end[1] = mouseY;
	
	angle = Math.atan((end[1]-init[1])/(end[0]-init[0]));
	
	if (end[0] < init[0]) angle += PI;
	angle += PI/2;
	
	if ((angle > PI/6) && (angle < PI/2))
		move_y(1);
	else if ((angle > PI/2) && (angle < 5*PI/6))
		move_z(-1);
	else if ((angle > 5*PI/6) && (angle < 7*PI/6))
		move_x(1);
	else if ((angle > 7*PI/6) && (angle < 3*PI/2))
		move_y(-1);
	else if ((angle > 3*PI/2) && (angle < 11*PI/6))
		move_z(1);
	else if ((angle > 11*PI/6) || (angle < PI/6))
		move_x(-1);
}

function move_x(n) {
	while ((player[0]+n >= 0) && (player[0]+n < level_n[level]))
		if (map[level][player[0] + n][player[1]][player[2]] != wall)
			player[0] += n;
		else
			break;
}

function move_y(n) {
	while ((player[1]+n >= 0) && (player[1]+n < level_n[level]))
		if (map[level][player[0]][player[1] + n][player[2]] != wall)
			player[1] += n;
		else
			break;
}

function move_z(n) {
	while ((player[2]+n >= 0) && (player[2]+n < level_n[level]))
		if (map[level][player[0]][player[1]][player[2] + n] != wall)
			player[2] += n;
		else
			break;
}

function show_yz(offset_x, offset_y) {
	var y, z;
	var x = player[0];
	
	for (y=0; y<level_n[level]; y++)
		for (z=0; z<level_n[level]; z++) {
			if ((z == player[2]) && (y == player[1]))
				fill(p);
			else if (map[level][x][y][z] == target)
				fill(o);
			else if (map[level][x][y][z] == wall)
				fill(w);
			else
				fill(e);
			
			rect(z*d/level_n[level]+offset_x, y*d/level_n[level]+offset_y, d/level_n[level], d/level_n[level]);
	}

}

function show_zx(offset_x, offset_y) {
	var z, x;
	var y = player[1];
	
	for (z=0; z<level_n[level]; z++)
		for (x=0; x<level_n[level]; x++) {
			if ((z == player[2]) && (x == player[0]))
				fill(p);
			else if (map[level][x][y][z] == target)
				fill(o);
			else if (map[level][x][y][z] == wall)
				fill(w);
			else
				fill(e);
			
			rect(z*d/level_n[level]+offset_x, x*d/level_n[level]+offset_y, d/level_n[level], d/level_n[level]);
	}
}

function show_xy(offset_x, offset_y) {
	var x, y;
	var z = player[2];
	
	for (x=0; x<level_n[level]; x++)
		for (y=0; y<level_n[level]; y++) {
			if ((x == player[0]) && (y == player[1]))
				fill(p);
			else if (map[level][x][y][z] == target)
				fill(o);
			else if (map[level][x][y][z] == wall)
				fill(w);
			else
				fill(e);
			
			rect(x*d/level_n[level]+offset_x, y*d/level_n[level]+offset_y, d/level_n[level], d/level_n[level]);
	}
}

function axes_yz(offset_x, offset_y) {
	strokeWeight(3);
	stroke(0,0,100);		//z direction
	line(	offset_x,
		d/(2*level_n[level]) + player[1]*d/level_n[level] + offset_y,
		d + offset_x,
		d/(2*level_n[level]) + player[1]*d/level_n[level] + offset_y); 
	
	stroke(0,100,0);		//y direction
	line(	d/(2*level_n[level]) + player[2]*d/level_n[level] + offset_x,
		offset_y,
		d/(2*level_n[level]) + player[2]*d/level_n[level] + offset_x,
		d + offset_y);
}

function axes_zx(offset_x, offset_y) {
	strokeWeight(3);
	stroke(0,0,100);		//z direction
	line(	offset_x,
		d/(2*level_n[level]) + player[0]*d/level_n[level] + offset_y,
		d + offset_x,
		d/(2*level_n[level]) + player[0]*d/level_n[level] + offset_y); 
	
	stroke(100,0,0);		//x direction
	line(	d/(2*level_n[level]) + player[2]*d/level_n[level] + offset_x,
		 + offset_y,
		d/(2*level_n[level]) + player[2]*d/level_n[level] + offset_x,
		d + offset_y);

}

function axes_xy(offset_x, offset_y) {
	strokeWeight(3);
	stroke(100,0,0);		//x direction
	line(	offset_x,
		d/(2*level_n[level]) + player[1]*d/level_n[level] + offset_y,
		d + offset_x,
		d/(2*level_n[level]) + player[1]*d/level_n[level] + offset_y); 
	
	stroke(0,100,0);		//y direction
	line(	d/(2*level_n[level]) + player[0]*d/level_n[level] + offset_x,
		offset_y,
		d/(2*level_n[level]) + player[0]*d/level_n[level] + offset_x,
		d + offset_y);

}

function victory() {
	fill(100,90,0);
	noStroke();
	rect(-width/2,-height/2, width, height);
	
	push();
	translate(0, 0, 10);
	fill(0,0,0);
	textAlign(CENTER, CENTER);
	textSize(tx_size*3.5);
	text('YOU COMPLETED LEVEL ' + (level+1) + '/' + (number_level), 0, 0);
	textSize(tx_size*2);
	text('WITH ' + (moves) +'/'+ (level_min[level]) + ' MOVES', 0, d/12);
	pop();
}

function start_newlevel() {
	//bug = (100,0,0);
	if (level+1 < number_level) {
		win = 0;
		level++;
		player = [0,0,0];
		temp = [0,0,0];
		moves = 0;
	}
}

function undo() {
	if (moves != 0) {				// I have no idea why I have to decrease moves twice
		moves --;
		for (i=0; i<3; i++) {
			player[i] = history[moves][i];
		}
		moves --;
	}
}

function doubleClicked() {
	player = [0, 0, 0];
	temp = [0,0,0];
	history = [];
	history[0] = [0, 0, 0];
	moves = 0;
}
