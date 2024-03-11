'use strict';

var activePBRButton;
var screenshotKey = false;
var playbackSpeedButtons = false;
var screenshotFunctionality = 0;
var screenshotFormat = "png";
var extension = 'png';

function formatTime(timeInSeconds) {
	const pad = (num) => (num < 10 ? '0' : '') + num;
	let hours = Math.floor(timeInSeconds / 3600);
	let minutes = Math.floor((timeInSeconds % 3600) / 60);
	let seconds = Math.floor(timeInSeconds % 60);

	return `${pad(hours)}-${pad(minutes)}-${pad(seconds)}`;
}

function CaptureScreenshot() {
	var player = document.querySelector('video');
	if (!player) {
		console.log("No video player found.");
		return;
	}

	var canvas = document.createElement('canvas');
	canvas.width = player.videoWidth;
	canvas.height = player.videoHeight;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
	var dataURL = canvas.toDataURL('image/png');

	updateScreenshotContainer();
	var container = document.getElementById('customScreenshotContainer');

	var imgWrapper = document.createElement('div');
	imgWrapper.style.marginBottom = '10px';

	// Create a text element for the time record
	var timeText = document.createElement('p');
	var currentTime = formatTime(player.currentTime); // Assuming formatTime function is defined as before
	timeText.innerText = "Time: " + currentTime;
	timeText.style.color = 'white'; // Ensure the text is visible on your background
	timeText.style.textAlign = 'left'; // Center the time above the image
	imgWrapper.appendChild(timeText); // Append the time record above the image

	// Create a flex container for image and caption
	var flexContainer = document.createElement('div');
	flexContainer.style.display = 'flex';
	flexContainer.style.alignItems = 'center';

	var img = new Image();
	img.src = dataURL;
	img.style.maxWidth = '70%'; // Adjust image size as necessary
	img.style.display = 'block';
	img.style.cursor = 'pointer';

	// Text section for captions or any additional information
	var textSection = document.createElement('div');
	textSection.style.flex = '1'; // Take up the remaining space
	textSection.style.marginLeft = '10px'; // Add some space between the image and text

	// Example of adding some text, can be replaced with dynamic content
	var captionText = document.createElement('p');
	captionText.innerText = "Your caption here";
	captionText.style.color = 'white'; // Adjust the styling as needed
	textSection.appendChild(captionText);

	// Append image and text section to the flex container
	flexContainer.appendChild(img);
	flexContainer.appendChild(textSection);

	// Append the flex container to the wrapper
	imgWrapper.appendChild(flexContainer);

	// Add event listener for removing on click
	img.addEventListener('click', function () {
		imgWrapper.parentNode.removeChild(imgWrapper);
	});

	container.appendChild(imgWrapper);
}



function updateScreenshotContainer() {
	let target = document.getElementById('secondary');
	if (!target) {
		console.log("YouTube secondary column not found.");
		return;
	}

	let container = document.getElementById('customScreenshotContainer');
	if (!container) {
		container = document.createElement('div');
		container.id = 'customScreenshotContainer';
		container.style.maxWidth = '350px';
		container.style.marginTop = '16px';
		container.innerHTML = '<h3 style="color:white">My Screenshots</h3>';
		target.insertBefore(container, target.firstChild);
	}
}

// To ensure the container is initialized and monitored for YouTube's dynamic content changes,
// include the observeYouTubeChanges function from the previous example here.

// Example usage (you might call this function on a button click or key press event)
// CaptureScreenshot();



function AddScreenshotButton() {
	var ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0];
	if (ytpRightControls) {
		ytpRightControls.prepend(screenshotButton);
	}

	chrome.storage.sync.get('playbackSpeedButtons', function(result) {
		if (result.playbackSpeedButtons) {
			ytpRightControls.prepend(speed3xButton);
			ytpRightControls.prepend(speed25xButton);
			ytpRightControls.prepend(speed2xButton);
			ytpRightControls.prepend(speed15xButton);
			ytpRightControls.prepend(speed1xButton);

			var playbackRate = document.getElementsByTagName('video')[0].playbackRate;
			switch (playbackRate) {
				case 1:
					speed1xButton.classList.add('SYTactive');
					activePBRButton = speed1xButton;
					break;
				case 2:
					speed2xButton.classList.add('SYTactive');
					activePBRButton = speed2xButton;
					break;
				case 2.5:
					speed25xButton.classList.add('SYTactive');
					activePBRButton = speed25xButton;
					break;
				case 3:
					speed3xButton.classList.add('SYTactive');
					activePBRButton = speed3xButton;
					break;
			}
		}
	});
}
// Initialize playback speed buttons and add them to the interface...

chrome.storage.sync.get(['screenshotKey', 'playbackSpeedButtons', 'screenshotFunctionality', 'screenshotFileFormat'], function (result) {
	screenshotKey = result.screenshotKey;
	playbackSpeedButtons = result.playbackSpeedButtons;
	screenshotFormat = result.screenshotFileFormat || 'png';
	screenshotFunctionality = result.screenshotFunctionality || 0;
	extension = screenshotFormat === 'jpeg' ? 'jpg' : screenshotFormat;
});

document.addEventListener('keydown', function (e) {
	// Key event listeners for playback speed adjustments and screenshot capture...

	if (screenshotKey && e.key === 'p') {
		CaptureScreenshot();
		e.preventDefault();
		return false;
	}
});
var screenshotButton = document.createElement("button");
screenshotButton.className = "screenshotButton ytp-button";
screenshotButton.style.width = "auto";
screenshotButton.innerHTML = "Screenshot";
screenshotButton.style.cssFloat = "left";
screenshotButton.onclick = CaptureScreenshot;

var speed1xButton = document.createElement("button");
speed1xButton.className = "ytp-button SYText";
speed1xButton.innerHTML = "1×";
speed1xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 1;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed15xButton = document.createElement("button");
speed15xButton.className = "ytp-button SYText";
speed15xButton.innerHTML = "1.5×";
speed15xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 1.5;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed2xButton = document.createElement("button");
speed2xButton.className = "ytp-button SYText";
speed2xButton.innerHTML = "2×";
speed2xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 2;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed25xButton = document.createElement("button");
speed25xButton.className = "ytp-button SYText";
speed25xButton.innerHTML = "2.5×";
speed25xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 2.5;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed3xButton = document.createElement("button");
speed3xButton.className = "ytp-button SYText";
speed3xButton.innerHTML = "3×";
speed3xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 3;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

activePBRButton = speed1xButton;

chrome.storage.sync.get(['screenshotKey', 'playbackSpeedButtons', 'screenshotFunctionality', 'screenshotFileFormat'], function(result) {
	screenshotKey = result.screenshotKey;
	playbackSpeedButtons = result.playbackSpeedButtons;
	if (result.screenshotFileFormat === undefined) {
		screenshotFormat = 'png'
	} else {
		screenshotFormat = result.screenshotFileFormat
	}

	if (result.screenshotFunctionality === undefined) {
		screenshotFunctionality = 0;
	} else {
    	screenshotFunctionality = result.screenshotFunctionality;
	}

	if (screenshotFormat === 'jpeg') {
		extension = 'jpg';
	} else {
		extension = screenshotFormat;
	}
});

document.addEventListener('keydown', function(e) {
	if (document.activeElement.contentEditable === 'true' || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.contentEditable === 'plaintext')
		return true;

	if (playbackSpeedButtons) {
		switch (e.key) {
			case 'q':
				speed1xButton.click();
				e.preventDefault();
				return false;
			case 's':
				speed15xButton.click();
				e.preventDefault();
				return false;
			case 'w':
				speed2xButton.click();
				e.preventDefault();
				return false;
			case 'e':
				speed25xButton.click();
				e.preventDefault();
				return false;
			case 'r':
				speed3xButton.click();
				e.preventDefault();
				return false;
		}
	}

	if (screenshotKey && e.key === 'p') {
		CaptureScreenshot();
		e.preventDefault();
		return false;
	}
});

AddScreenshotButton();
