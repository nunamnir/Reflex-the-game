var count, hit, miss, accuracy, name; // объявляем переменные
var timeRotate;

function setScenario(string) {
	switch(string) {
		case "login_scenario":
			useLoginWindow();
			break;
		case "game_scenario":
			useGameWindow();
			break;
		case "stat_scenario":
			useStatWindow();
			break;
		default:
			alert("Я не знаю такого сценария");
			break;
	}
}

function getRandValue (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayStatus() {
	document.getElementById("player-count").innerHTML = count;
	document.getElementById("player-hit").innerHTML = hit;
	document.getElementById("player-miss").innerHTML = miss;  
	document.getElementById("player-accur").innerHTML = calcAccuracy() + "%";
	// document.getElementById("player-name").innerHTML = name;
}

function playSound(string) {
	switch(string) {
		case 'intro':
			var soundIntro = new Audio();
			soundIntro.src = "audio/icq-intro.wav";    
			// soundIntro.play();
			break;
		case 'hit':
			var soundHit = new Audio(); // Создаём новый элемент Audio
			soundHit.src = "audio/icq-hit.wav"; // Указываем путь к звуку "клика"
			soundHit.play();
			break;
		case 'miss':
			var soundMiss = new Audio(); // Создаём новый элемент Audio
			soundMiss.src = "audio/icq-miss.wav"; // Указываем путь к звуку "клика"
			soundMiss.play();
			break;
		case 'stat':
			var soundStat = new Audio();
			soundStat.src = "audio/game-stats.mp3";      
			// soundStat.play();
			break;
	}
}

function useLoginWindow() {
	playSound('intro');
	document.getElementsByClassName('cover-div')[0].style.display = 'block';
	document.getElementsByClassName('login-window')[0].style.display = 'flex';
	document.getElementsByClassName('stats-window')[0].style.display = 'none';

	var submitEvent = document.getElementById('submit-button');
	submitEvent.addEventListener("click", start);
}

function useGameWindow() {
	var playground = document.getElementById("playground");
	playground.addEventListener("click", destroyObj);

	var max_width = (playground.clientWidth) - 80;
	var max_height = (playground.clientHeight) - 80;

	count = 0; 	// обнуляем счетчик
	hit = 0; 		// обнуляем счетчик
	miss = 0; 	// обнуляем счетчик
	accuracy = 0;
	
	displayStatus();

	var start = Date.now();	// инициализируем время
	var Interval = setInterval(function() {
		addCircle();
		if (Date.now() - start > 60000) {
			playground.innerHTML = null;
			clearInterval(Interval);
			clearInterval(Time);
			setScenario('stat_scenario');  
			return;
		}
	}, 2000);

	var Time = setInterval(function () {
		var counter = Date.now() - start;
		console.warn(counter);
		timeLeft(counter);
			function timeLeft(counter) {    
			var timer = document.getElementById("timer");
			timer.style.width = (100 * ((60000 - counter) / 60000)) + '%';
			// console.warn(timer.style.width);
			if(counter >= 59000) {
				timer.style.width = 0 + '%';
			}
		}
	}, 1000);

	function destroyObj(event) {
		if(event.target.className == "circle") {
			event.stopPropagation();
			var width = event.target.clientWidth;

			switch(true) {
				// case (width === 20):
				// 	count+=5;
				// 	break;
				case (width <= 30):
					count+=4;
					break;
				case (width <= 40):
					count+=3;
					break;
				case (width <= 50):
					count+=2;
					break;
				default:
					count+=1;
					break;  
			}

			playSound('hit');
			hit++;
			playground.removeChild(event.target);
			displayStatus();
			addCircle();

		} else {
			playSound('miss');
			miss++;
			displayStatus();
		}
	}

	function addCircle() {
		var circle = document.createElement("div");
		circle.className = "circle";
		
		setCircleRotate();
		setCircleStyle();
		setCircleSize();
		displayStatus();

		function setCircleRotate() {
			// animation: rotation 20s linear infinite;
		  circle.style.animation = 'rotation ' + getRandValue(10, 60) + 's linear infinite';
		}

		function setCircleStyle() {
			circle.style.backgroundImage = 'url(img/planets/planet-' + getRandValue(1, 30) + '.png)';
			// console.warn(circle.style.backgroundImage);
		}

		function setCircleSize() {
			var size = getRandValue(30, 60);
			circle.style.height = size + "px";
			circle.style.width = size + "px";
		}

		circle.style.left = getRandValue(1, max_width) + 'px';
		circle.style.top = getRandValue(1, max_height) + 'px';
		playground.appendChild(circle);
	}
}

function useStatWindow() {
	// playSound('stat');
	document.getElementsByClassName('cover-div')[0].style.display = 'block';
	document.getElementsByClassName('stats-window')[0].style.display = 'flex';
	document.getElementsByClassName('login-window')[0].style.display = 'none';

	document.getElementById("login-stat").innerHTML = name;
	document.getElementById("score-stat").innerHTML = count;
	document.getElementById("hit-stat").innerHTML = hit;
	document.getElementById("miss-stat").innerHTML = miss;
	document.getElementById("accur-stat").innerHTML = calcAccuracy() + "%";

	var restartEvent = document.getElementById('restart-button');
	restartEvent.addEventListener("click", restart);
}

function start() {
	name = document.getElementById('get-name').value;
	document.getElementById("login-stat").innerHTML = name;
	document.getElementsByClassName('cover-div')[0].style.display = 'none';
	document.getElementsByClassName('stats-window')[0].style.display = 'none';
	setScenario('game_scenario');
}

function restart() {
	document.getElementsByClassName('cover-div')[0].style.display = 'none';
	document.getElementsByClassName('stats-window')[0].style.display = 'none';
	setScenario('login_scenario');
}

function calcAccuracy() {
	accuracy = (hit / (hit + miss)) * 100;
	if(hit == 0) {
		accuracy = 0;
	}
	if(hit == 1 && miss == 0) {
		accuracy = 100;
	}
	if(hit == 0 && miss == 1) {
		accuracy = 0;
	}
	return accuracy.toFixed(1);
}

window.onload = function() {
	setScenario('login_scenario');
	// setScenario('game_scenario');
	// setScenario('stat_scenario');
}