let N;
let data;
let map = [];
let view = 1;			//plane view
let level = 0;
let number_level;
let margin = 20;

let player = [0, 0, 0]; 	//player coordinates

let p, e, x, o;
let wall = 'w';
let target = 'o';
//empty = ' '

let win = 0;
let frame = [];

let d = 300;

function preload()
{
	data = loadStrings('assets/levels.txt')
}

function setup() {
	createCanvas(3*d + margin*4, d + margin*2 + 80);
	colorMode(RGB, 100);
	//stroke(1,1,1);
	//frameRate(2);
	//background(0,0,0);
	
	//d = width/3;

	N = parseInt(data[0], 10);
	number_level = data.length/(N*N+1);

	p = color(0,50,100);	//player color


	e = color(0,0,0);		//' ' = empty cell
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
	}
}

function draw() {
	background(10);
	
	noStroke();
	show_yz(margin, margin);
	axes_yz(margin, margin);
	show_zx(d + 2*margin, margin);
	axes_zx(d + 2*margin, margin);
	show_xy(2*d + 3*margin, margin);
	axes_xy(2*d + 3*margin, margin);
	

	//fill(100,100,100,25);
	//rect((view-1)*d, 0, d, height);
	
	noStroke();
	
	textSize(25);
	
	fill(p);
	rect(20, height - 80, 30, 30);
	fill(o);
	rect(width/2, height - 80, 30, 30);
	
	fill(80);
	text('player', 70, height - 58);
	text('goal', width/2 + 50, height - 58);
	text('level = '+ (level + 1), width - 200, height - 58);
	text('1, 2, 3 = change active plane		arrows = move in the active plane		0 = restart', 20, height - 20);

	if (map[level][player[0]][player[1]][player[2]] == 'o')
		win = 1;

	if (win == 1)
		victory();
	
}

function keyPressed() {
	if ((key == 1) || (key == 2) || (key == 3))
		view = key;
	if (view == 1) {
		if (keyCode === RIGHT_ARROW)
			move_z(1);
		else if (keyCode === LEFT_ARROW)
			move_z(-1);
		else if (keyCode === UP_ARROW)
			move_y(-1);
		else if (keyCode === DOWN_ARROW)
			move_y(1);
	}
	else if (view == 2) {
		if (keyCode === RIGHT_ARROW)
			move_z(1);
		else if (keyCode === LEFT_ARROW)
			move_z(-1);
		else if (keyCode === UP_ARROW)
			move_x(-1);
		else if (keyCode === DOWN_ARROW)
			move_x(1);
	}
	else if (view == 3) {
		if (keyCode === RIGHT_ARROW)
			move_x(1);
		else if (keyCode === LEFT_ARROW)
			move_x(-1);
		else if (keyCode === UP_ARROW)
			move_y(-1);
		else if (keyCode === DOWN_ARROW)
			move_y(1);
	}
	
	//if (key == 'p')
	//	start_newlevel();
	
	if (key == 0)
		player = [0, 0, 0];
	
	if (win == 1)
		start_newlevel();

	return false;
}

function move_x(n) {
	while ((map[level][player[0] + n][player[1]][player[2]] != 'w') && (player[0]+n >= 0) && (player[0]+n < N))
		player[0] += n;
}


function move_y(n) {
	while ((map[level][player[0]][player[1] + n][player[2]] != 'w') && (player[1]+n >= 0) && (player[1]+n < N))
		player[1] += n;
}

function move_z(n) {
	while ((map[level][player[0]][player[1]][player[2] + n] != 'w') && (player[2]+n >= 0) && (player[2]+n < N))
		player[2] += n;
}

function show_yz(offset_x, offset_y) {
	var y, z;
	var x = player[0];

	noStroke();
	fill(0);
	rect(offset_x, offset_y, d, d);
	
	for (y=0; y<N; y++)
		for (z=0; z<N; z++) {
			if ((z == player[2]) && (y == player[1]))
				fill(p);
			else if (map[level][x][y][z] == 'o')
				fill(o);
			else if (map[level][x][y][z] == 'w')
				fill(w);
			else
				noFill();
			
			rect(z*d/N+offset_x, y*d/N+offset_y, d/N, d/N);
	}
	
	if (view == 1) {
		fill(100,100,100,25);
		rect(offset_x, offset_y, d, d);
	}
}

function show_zx(offset_x, offset_y) {

	var z, x;
	var y = player[1];

	noStroke();
	fill(0);
	rect(offset_x, offset_y, d, d);
	
	for (z=0; z<N; z++)
		for (x=0; x<N; x++) {
			if ((z == player[2]) && (x == player[0]))
				fill(p);
			else if (map[level][x][y][z] == 'o')
				fill(o);
			else if (map[level][x][y][z] == 'w')
				fill(w);
			else
				noFill();
			
			rect(z*d/N+offset_x, x*d/N+offset_y, d/N, d/N);
	}
	
	if (view == 2) {
		fill(100,100,100,25);
		rect(offset_x, offset_y, d, d);
	}
}

function show_xy(offset_x, offset_y) {
	var x, y;
	var z = player[2];

	noStroke();
	fill(0);
	rect(offset_x, offset_y, d, d);
	
	for (x=0; x<N; x++)
		for (y=0; y<N; y++) {
			if ((x == player[0]) && (y == player[1]))
				fill(p);
			else if (map[level][x][y][z] == 'o')
				fill(o);
			else if (map[level][x][y][z] == 'w')
				fill(w);
			else
				noFill();
			
			rect(x*d/N+offset_x, y*d/N+offset_y, d/N, d/N);
	}
	
	if (view == 3) {
		fill(100,100,100,25);
		rect(offset_x, offset_y, d, d);
	}
}

function axes_yz(offset_x, offset_y) {

	fill(0,0,0);
	//rect(offset_x*d, 0, d, d);

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

	fill(0,0,0);
	//rect(offset_x*d, 0, d, d);

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
	
	fill(0,0,0);
	//rect(offset_x*d, 0, d, d);

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
	rect(0,0, width, height);
	textSize(30);
	fill(0,0,0);
	text('Hai finito il livello ' + (level+1), d/6, height/2);
}

function start_newlevel() {
	//bug = (100,0,0);
	if (level+1 < number_level) {
		win = 0;
		level++;
		player = [0,0,0];
		view = 1;
	}
}
