const colorDark = '#1f0c2c';
const colorBright = '#8c36b4';

let windowWidth,
	windowHeight,
	windowSemiWidth,
	windowSemiHeight,
	planetRadius,
	pathRadius;

const renewWindowProps = () => {
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
	windowSemiWidth = Math.floor(windowWidth/2);
	windowSemiHeight = Math.floor(windowHeight/2);
	const newPlanetRadius = Math.floor(Math.min(windowWidth, windowHeight) / 10) || 100;
	setPlanetRadius(newPlanetRadius);
	pathRadius = Math.floor(newPlanetRadius * 3.5);
}

const setPlanetRadius = (r) => {
	planetRadius = r;
	const planets = document.querySelectorAll('.planet');
	for (var i = 0; i < planets.length; i++) {
		const planet = planets[i];
		planet.style.width = planet.style.height = 2 * r + 'px';
	}
}

window.addEventListener('resize', () => {
	renewWindowProps();
});
renewWindowProps();


const levels = [
	// lvl0
	{
		scale: 0.125,
		lightAngle: Math.PI / 5
	},
	// lvl1
	{
		scale: 0.25,
		lightAngle: Math.PI / 4
	},
	// lvl2
	{
		scale: 0.5,
		lightAngle: Math.PI / 3
	},
	// lvl3
	{
		scale: 1,
		lightAngle: Math.PI / 1.5
	},
	// lvl4, semi-hidden
	{
		scale: 3.8,
		lightAngle: Math.PI
	},
	// lvl5, hidden
	{
		scale: 20,
		lightAngle: Math.PI
	},
	// lvl6, hidden
	{
		scale: 21,
		lightAngle: Math.PI
	}
];

const planets = [{
	node: document.getElementById('planet-4'),
	phase: 0,
	level: 0,
	scale: levels[0].scale,
	lightAngle: levels[0].lightAngle
}, {
	node: document.getElementById('planet-3'),
	phase: Math.PI / 2,
	level: 1,
	scale: levels[1].scale,
	lightAngle: levels[1].lightAngle
}, {
	node: document.getElementById('planet-2'),
	phase: Math.PI,
	level: 2,
	scale: levels[2].scale,
	lightAngle: levels[2].lightAngle
}, {
	node: document.getElementById('planet-1'),
	phase: Math.PI * 1.5,
	level: 3,
	scale: levels[3].scale,
	lightAngle: levels[3].lightAngle
}];


const getGradient = (t, a) => {
	// t - light angle in zy plane
	// a - light angle in xy plane
	if (Math.abs(Math.cos(t)) < 0.1) {
		let mid = Math.sqrt((Math.tan(a)**2) + 1) * planetRadius;
		res = `linear-gradient(${(-a+Math.PI/2)/(Math.PI*2)}turn, ${colorDark} 50%, ${colorBright} ${mid+planetRadius*3}px)`;
	} else {
		const e = t - Math.PI / 2;
		const s = Math.sin(e)*planetRadius;
		const r = (s*s + planetRadius*planetRadius)/(2*s);
		if (Math.cos(t) > 0) {
			res = `radial-gradient(circle at ${planetRadius + (s-r) * Math.cos(a)}px ${planetRadius - (s-r) * Math.sin(a)}px, ${colorBright} ${Math.abs(r)-planetRadius*3}px, ${colorDark} ${(Math.abs(r))}px)`;
		} else {
			res = `radial-gradient(circle at ${planetRadius + (s-r) * Math.cos(a)}px ${planetRadius - (s-r) * Math.sin(a)}px, ${colorDark} ${(Math.abs(r))}px, ${colorBright} ${(Math.abs(r)+planetRadius*3)}px)`;
		}
	}
	return res;
};


// move-rotate planets, add lighting

let start;
let isScrollMoveRunning = false;

// Optimization: draw background not every frame
const backgroundDrawingPeriod = 50; //ms
let lastBackgroundDrawingTime = performance.now();
let isTimeToDrawBackground = true;

const animate = (timestamp) => {
	
	if (!start) start = timestamp;
	const	elapsed = timestamp - start;
	
	if (performance.now() - lastBackgroundDrawingTime >= backgroundDrawingPeriod) {
			lastBackgroundDrawingTime = performance.now();
			isTimeToDrawBackground = true;
	}
	
	planets.forEach(planet => {
		const planetRadiusScaled = planetRadius * planet.scale;
		const pathRadiusScaled = pathRadius * planet.scale;
		
		const t = ((elapsed/2000) + planet.phase + 1) % (2*Math.PI);
		
		const planetCenterX = windowSemiWidth + pathRadiusScaled * Math.cos(t);
		const planetCenterY = windowSemiHeight - pathRadiusScaled * Math.sin(t);
		const planetCornerX = planetCenterX - planetRadiusScaled;
		const planetCornerY = planetCenterY - planetRadiusScaled;
		
		planet.node.style.transform = `translate(${planetCornerX}px, ${planetCornerY}px) scale(${planet.scale})`;
		
		const xyAngle = Math.atan((planetCenterY-windowSemiHeight)/(windowWidth-planetCenterX));
		
		if (isTimeToDrawBackground) {
			planet.node.style.background = getGradient(planet.lightAngle, xyAngle);
		}
		
	});
	
	isTimeToDrawBackground = false;
	
	if (!isScrollMoveRunning) {
		window.requestAnimationFrame(animate);
	}
};

window.requestAnimationFrame(animate);


// move planets forward/backwards

let currentLevel = 0;

const setPlanetsLevel = (level) => {
	// TODO: stop animation and run new animation
	
	if (!Number.isInteger(level) || level < 0 || level > 3 || level == currentLevel) return;
	currentLevel = level;
	
	let raiseSteps = 30;
	const animationBuffer = [];
	
	planets.forEach((planet, planetIndex) => {
		
		planet.level = planetIndex + level;
		
		if (planet.level == 3) {
			planet.node.classList.add('active');
		} else {
			planet.node.classList.remove('active');
		}
		
		const scaleStep = (levels[planet.level].scale - planet.scale)/raiseSteps;
		const lightAngleStep = (levels[planet.level].lightAngle - planet.lightAngle)/raiseSteps;
		
		let steps = 0;
		const raiseAnimation = () => {
			planet.scale += scaleStep;
			planet.lightAngle += lightAngleStep;
			steps += 1;
			if (steps < raiseSteps) {
				animationBuffer.push(raiseAnimation);
			}
		};
		animationBuffer.push(raiseAnimation);
	});
	
	const frameFunc = (timestamp) => {
		const bufferLength = 10;
		const frameFuncs = animationBuffer.slice(0, bufferLength);
		animationBuffer.splice(0, bufferLength);
		if (frameFuncs.length) {
			frameFuncs.forEach((func) => func());
			animate(timestamp);
			window.requestAnimationFrame(frameFunc);
		} else {
			isScrollMoveRunning = false;
			window.requestAnimationFrame(animate);
		}
	}
	isScrollMoveRunning = true;
	window.requestAnimationFrame(frameFunc);
};
