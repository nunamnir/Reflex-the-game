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

// переделать звуки из млюбимой игры вставить
function playSound(string) {
	switch(string) {
		case 'intro':
			var soundIntro = new Audio();
			soundIntro.src = "audio/icq-intro.wav";    
			// soundIntro.play();
			break;
		case 'hit':
			var soundHit = new Audio(); // Создаём новый элемент Audio
			soundHit.src = "audio/blaster-shot.mp3"; // Указываем путь к звуку "клика"
			soundHit.play();
			break;
		case 'miss':
			var soundMiss = new Audio(); // Создаём новый элемент Audio
			soundMiss.src = "audio/miss-shot.mp3"; // Указываем путь к звуку "клика"
			soundMiss.play();
			break;
		case 'stat':
			var soundStat = new Audio();
			soundStat.src = "audio/game-stats.mp3";      
			// soundStat.play();
			break;
	}
}

// Фаза 1
function useLoginWindow() {	
	console.log("Фаза 1");
	$("#login-sheet").css("display", "flex");
	$("#gamezone").css("display", "none");
	$("#stats-sheet").css("display", "none");
	$(document).on("keydown", startEnter);

	var hideInterval;
	switchState();

	function hideShow() {
  	$("#push-button").toggleClass("blink");
	};

	function switchState() {
    hideInterval = setInterval(function() {
  		hideShow();
		}, 800);
		return;
	};

	function startEnter(event) {
		// console.log(event);
		if(event.key == "Enter") {
			$(document).off("keydown", startEnter);
			clearInterval(hideInterval);
			setScenario("game_scenario");
		}
	}
}

// Фаза 2
function useGameWindow() {
	console.log("Фаза 2");
	$("#login-sheet").css("display", "none");
	$("#gamezone").css("display", "block");
	$("#stats-sheet").css("display", "none");

	// var playground = document.getElementById("playground");
	// playground.addEventListener("click", destroyObj);
	$("#playground").on("click", destroyObj);

	var max_width = (playground.clientWidth) - 80;
	var max_height = (playground.clientHeight) - 80;

	count = 0; 	// обнуляем счетчик
	hit = 0; 		// обнуляем счетчик
	miss = 0; 	// обнуляем счетчик
	accuracy = 0;
	
	displayStatus();

	var start = Date.now();	// инициализируем время
	var gameTime = setInterval(function() {
		addCircle();
		if (Date.now() - start > 60000) {
			playground.innerHTML = null;
			clearInterval(gameTime);
			clearInterval(curTime);
			setScenario("stat_scenario");  
			return;
		}
	}, 2000);

	var curTime = setInterval(function () {
		var counter = Date.now() - start;
		// console.warn(counter);
		timeLeft(counter);
		function timeLeft(count) {
			$("#timer").css("width", (100 * ((60000 - count) / 60000) + '%'));
			if(count >= 59000) {
				$("#timer").css("width", "0%");
			}
		}
	}, 1000);

	function addCircle() {
		var circle = document.createElement("div");
		circle.className = "circle";
		
		setCircleRotate();
		setCircleStyle();
		setCircleSize();
		displayStatus();

		function setCircleRotate() {
		  circle.style.animation = 'rotation' + getRandValue(1, 2) + ' ' + getRandValue(10, 60) + 's linear infinite';
		}

		function setCircleStyle() {
			circle.style.backgroundImage = 'url(img/planets/planet-' + getRandValue(1, 34) + '.png)';
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

	function destroyObj(event) {
		if(event.target.className == "circle") {
			// console.log("clientX" + event.clientX);
			// console.log("clientY" + event.clientY);
			event.stopPropagation();

			$("<div>", {
   		 class: "hitBlast"
			}).appendTo("#playground");
			$(".hitBlast").css("top", (event.clientY - 65) + "px");
			$(".hitBlast").css("left", (event.clientX - 53) + "px");
			// playground.appendChild(newAnimation);
			setTimeout(function () {
				$(".hitBlast").remove();
			}, 500);

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
} // конец Фазы 2

// Фаза 3
function useStatWindow() {
	// playSound('stat');
	console.log("Фаза 3");
	$("#login-sheet").css("display", "none");
	$("#gamezone").css("display", "none");
	$("#stats-sheet").css("display", "flex");

	$("#login-stat").html(name);
	$("#score-stat").html(count);
	$("#hit-stat").html(hit);
	$("#miss-stat").html(miss);
	$("#accur-stat").html((calcAccuracy() + "%"));
	$("#restart-game-button").on("click", restartGame);

	var showInterval;
	switchState();

	function hideShow() {
  	$("#button-text").toggleClass("blink");
	};

	function switchState() {
    showInterval = setInterval(function() {
  		hideShow();
		}, 500);
		return;
	};

	function restartGame() {		
		$("#restart-game-button").off("click", restartGame);
		clearInterval(showInterval);
		setScenario("game_scenario");
	}
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