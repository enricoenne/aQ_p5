let N;
//let data;
let data = [];
let map = [];
let level = 0;				//current level
let number_level;			//how many levels
let level_min = []			//min number of moves for each level

let player = [0, 0, 0]; 	//player coordinates
let moves = 0;				//how many moves have been done in the current level
let temp = [0, 0, 0];

let p, e, x, o;
let wall = 'w';
let target = 'o';
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

function preload()
{
	data = loadStrings('assets/levels.txt')
		
	myFont = loadFont('assets/galiver.ttf');
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

	N = parseInt(data[0]);
	number_level = data.length/(N*N+1);

	p = color(0,50,100);	//player color


	e = color(0,0,0);		//' ' = empty cell
	e_active = color(20,20,20)
	w = color(60,60,60);		//'w' = wall
	o = color(100,90,0);		//'o' = target

	frame[0] = color(100,100,100);
	frame[1] = color(100,100,100);
	frame[2] = color(100,100,100);


	for (let l=0; l<number_level; l++){
		map[l] = [];
		for (let i=0; i<N; i++) {
			map[l][i] = [];
			for (let j=0; j<N; j++) {
				map[l][i][j] = [];
				map[l][i][j] = data[l*N*N + l + 1 + i*N + j];	//every level starts with ----------
			}
		}
		level_min[l] = parseInt(data[l*N*N+l]);
	}
	level_min[0] = 3;
	
	a = PI/3.5;
	b = -3*PI/4;
}

function draw() {
	background(30);
	noStroke();
	
	if ((temp[0] != player[0]) ||(temp[1] != player[1]) || (temp[2] != player[2])) {
		for (i=0; i<3; i++)
			temp[i] = player[i];
		moves += 1;
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

	if (map[level][player[0]][player[1]][player[2]] == 'o')
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
	
	//if (key == 'p')
	//	start_newlevel();
	
	if (key == 0) {
		player = [0, 0, 0];
		temp = [0,0,0];
		moves = 0;
	}
	
	if (win == 1)
		start_newlevel();

	return false;
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
	while ((player[0]+n >= 0) && (player[0]+n < N))
		if (map[level][player[0] + n][player[1]][player[2]] != 'w')
			player[0] += n;
		else
			break;
}

function move_y(n) {
	while ((player[1]+n >= 0) && (player[1]+n < N))
		if (map[level][player[0]][player[1] + n][player[2]] != 'w')
			player[1] += n;
		else
			break;
}

function move_z(n) {
	while ((player[2]+n >= 0) && (player[2]+n < N))
		if (map[level][player[0]][player[1]][player[2] + n] != 'w')
			player[2] += n;
		else
			break;
}

function show_yz(offset_x, offset_y) {
	var y, z;
	var x = player[0];
	
	for (y=0; y<N; y++)
		for (z=0; z<N; z++) {
			if ((z == player[2]) && (y == player[1]))
				fill(p);
			else if (map[level][x][y][z] == 'o')
				fill(o);
			else if (map[level][x][y][z] == 'w')
				fill(w);
			else
				fill(e);
			
			rect(z*d/N+offset_x, y*d/N+offset_y, d/N, d/N);
	}

}

function show_zx(offset_x, offset_y) {
	var z, x;
	var y = player[1];
	
	for (z=0; z<N; z++)
		for (x=0; x<N; x++) {
			if ((z == player[2]) && (x == player[0]))
				fill(p);
			else if (map[level][x][y][z] == 'o')
				fill(o);
			else if (map[level][x][y][z] == 'w')
				fill(w);
			else
				fill(e);
			
			rect(z*d/N+offset_x, x*d/N+offset_y, d/N, d/N);
	}
}

function show_xy(offset_x, offset_y) {
	var x, y;
	var z = player[2];
	
	for (x=0; x<N; x++)
		for (y=0; y<N; y++) {
			if ((x == player[0]) && (y == player[1]))
				fill(p);
			else if (map[level][x][y][z] == 'o')
				fill(o);
			else if (map[level][x][y][z] == 'w')
				fill(w);
			else
				fill(e);
			
			rect(x*d/N+offset_x, y*d/N+offset_y, d/N, d/N);
	}
}

function axes_yz(offset_x, offset_y) {
	strokeWeight(3);
	stroke(0,0,100);		//z direction
	line(	offset_x,
		d/(2*N) + player[1]*d/N + offset_y,
		d + offset_x,
		d/(2*N) + player[1]*d/N + offset_y); 
	
	stroke(0,100,0);		//y direction
	line(	d/(2*N) + player[2]*d/N + offset_x,
		offset_y,
		d/(2*N) + player[2]*d/N + offset_x,
		d + offset_y);
}

function axes_zx(offset_x, offset_y) {
	strokeWeight(3);
	stroke(0,0,100);		//z direction
	line(	offset_x,
		d/(2*N) + player[0]*d/N + offset_y,
		d + offset_x,
		d/(2*N) + player[0]*d/N + offset_y); 
	
	stroke(100,0,0);		//x direction
	line(	d/(2*N) + player[2]*d/N + offset_x,
		 + offset_y,
		d/(2*N) + player[2]*d/N + offset_x,
		d + offset_y);

}

function axes_xy(offset_x, offset_y) {
	strokeWeight(3);
	stroke(100,0,0);		//x direction
	line(	offset_x,
		d/(2*N) + player[1]*d/N + offset_y,
		d + offset_x,
		d/(2*N) + player[1]*d/N + offset_y); 
	
	stroke(0,100,0);		//y direction
	line(	d/(2*N) + player[0]*d/N + offset_x,
		offset_y,
		d/(2*N) + player[0]*d/N + offset_x,
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

function doubleClicked() {
	player = [0, 0, 0];
	temp = [0,0,0];
	moves = 0;
}
