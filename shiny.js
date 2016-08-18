//shiny.js, written by raimondi1337//////////////////////////////////
//settings you can play with/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
var settings = {};
settings.maxNodeCount = 50; //controls length of line
settings.backgroundColor = "#202520";
settings.logFPS = false; //enabling reduces fps...

settings.lineColor = "#00FF00";//use null for random color!
settings.particleColor = null;//use null for random colors!

window.settings.particlesPerFrame = 2;
settings.bloomMultiplier = 2;

settings.particleMaxVelocityLeft = 40; 
settings.particleMaxVelocityRight = 40; 
settings.particleMaxVelocityUp = 40; 
settings.particleMaxVelocityDown = 40; 

settings.lineWidth = 0.75;

settings.particleMaxAge = 100; //maximum age of particles in frames
settings.particleMinAge = 10; //minimum age of particles in frames

settings.particleMaxSize = 2;
settings.particleMinSize = 1;

settings.maxFPS = 60; //not tested above 60, my 144hz monitor is back in NY
settings.minFPS = 12; //minimum desired FPS
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

var dt;//deltatime so that the animation 'moves faster' instead of locking up under heavy load
var nodes = new Array();//nodes for line drawing
var particles = new Array();//particles for... particle effects
var canvas;//the canvas on the splash screen
var ctx;//drawing context of canvas
var bloom = false;//used to change particles while hovering advance link
var browser; //type of browser detected
var mouse = {//relays mouse position
    x: 0,
    y: 0
};

window.onload = init;//starts script

function init() {
	//create canvas and context
    canvas = document.querySelector('canvas');
	canvas.id="canvas";
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	
	//determine if you're hovering the advance link so the particles can react
	document.querySelector(".bloom").addEventListener("mouseover", function(){bloom=true;});
	document.querySelector(".bloom").addEventListener("mouseout", function(){bloom=false;});
	
	//record mouse position on page
    document.addEventListener("mousemove", function (event) {
        mouse = {
            x: event.pageX,
            y: event.pageY
        };
    });
	
	//remove cursor
    document.body.style.cursor = "none";
	
	//find the browser
	detectBrowser();
	
	//prime background color
	ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
			
	//run animation
    animate();
}

//updates the drawing nodes every ms instead of every frame for slightly smoother lines
window.setInterval(updateNodes,1);

//detect which browser is in use via feature detection, rather than user agent, for performance considerations
function detectBrowser(){
	var isFirefox = typeof InstallTrigger !== 'undefined';   // detect Firefox 1.0+
	var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	
	if(isFirefox){
		browser = "firefox";
	}
	else if(isIE){
		browser = "ie";
	}else{
		browser = "other";
	}
	
	console.log("Browser Detected: " + browser);
}

//recursively redraws the screen forever
function animate() {
    dt = calculateDeltaTime();
    clearBackground();
    updateNodes();
	if(nodes.length>1){//this if keeps things from being drawn at (0,0) on first load
    	updateParticles(dt);
		drawLine();
		drawParticles();
	}

    window.requestAnimFrame(animate);
}

//clears the background with the highest performing method within each browser
function clearBackground() {	
	if(browser=="firefox" || browser=="ie"){//different methods of clearing the canvas perform very differently in differnt browsers
			ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	else{
			ctx.fillStyle = settings.backgroundColor;
    		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	ctx.restore;
}

function updateNodes() {
    var point = new Object();
    point.x = mouse.x;
    point.y = mouse.y;

    if (nodes.length == 0) {//always enter the first node
        nodes.push(point);
    } else if (point.x != nodes[0].x && point.y != nodes[0].y) {//only add nodes if the cursor moves
        nodes.push(point);
    }

    if (nodes.length > settings.maxNodeCount) {//limit node array size to 10 nodes, add more nodes to make longer lines
        nodes.splice(0, 1);
    }
}

function drawLine() {//draw line between all existing nodes
    ctx.lineWidth = settings.lineWidth;
    ctx.strokeStyle = settings.lineColor || randomColor();
    ctx.beginPath();
	ctx.moveTo(nodes[1].x, nodes[1].y);
	for (var i = 2; i < nodes.length; i++) {
		ctx.lineTo(nodes[i].x, nodes[i].y);
	}
	ctx.stroke();
}

function createParticle(){
	var particle = new Object();
    particle.color = settings.particleColor || randomColor();
    particle.x = mouse.x;
    particle.y = mouse.y;
    particle.velX = getRandom(-settings.particleMaxVelocityLeft, settings.particleMaxVelocityRight);
    particle.velY = getRandom(-settings.particleMaxVelocityUp, settings.particleMaxVelocityDown);
    particle.age = 0;
    particle.maxAge = getRandom(settings.particleMinAge, settings.particleMaxAge);
    particle.size = getRandom(settings.particleMinSize, settings.particleMaxSize);
	return(particle);
}

function updateParticles() {
	//create new particles
	if(bloom){
		for (var i = 0; i < settings.particlesPerFrame * settings.bloomMultiplier; i++){
			particles.push(createParticle());
		}
	} else {
		for (var i = 0; i < settings.particlesPerFrame; i++){
			particles.push(createParticle());
		}
	}
	

    //move particles
    for (var i = 0; i < particles.length; i++) {
		if(bloom){//move twice as fast if blooming
        	particles[i].x += particles[i].velX * dt * 2;
        	particles[i].y += particles[i].velY * dt * 2;
		}else{
			particles[i].x += particles[i].velX * dt;
        	particles[i].y += particles[i].velY * dt;
		}
    }

    //destroy particles
    for (var i = 0; i < particles.length; i++) {
        particles[i].age++;
        if (particles[i].age > particles[i].maxAge) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
        ctx.fillStyle = particles[i].color;
        ctx.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
    }
}

//utilities
var lastTime=0;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

window.requestAnimFrame = (function(){ 
  return  window.requestAnimationFrame       ||  
          window.webkitRequestAnimationFrame ||  
          window.mozRequestAnimationFrame    ||  
          window.oRequestAnimationFrame      ||  
          window.msRequestAnimationFrame     ||  
          function( callback ){ 
            window.setTimeout(callback, 1000 / 60); 
          }; 
})(); 

function clamp(val, min, max){
    return Math.max(min, Math.min(max, val));
}

function calculateDeltaTime(){
	var now, fps;
	now = (+new Date);
	fps = 1000/(now - lastTime);
	fps = clamp(fps,settings.minFPS,settings.maxFPS);
	if (settings.logFPS) { console.log(fps) };
	lastTime=now;
	return 1/fps;
}

function randomColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function updateForm(name, value, placeholder) {
	settings[name] = value || placeholder;
}