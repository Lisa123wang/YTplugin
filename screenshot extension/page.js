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

	// Trigger download
	triggerDownload(dataURL);

	updateScreenshotContainer();
	var container = document.getElementById('customScreenshotContainer');

	var imgWrapper = document.createElement('div');
	imgWrapper.style.marginBottom = '20px'; // Space between this and next image wrapper

	var timeText = document.createElement('p');
	var currentTime = formatTime(player.currentTime);
	timeText.innerText = "Time: " + currentTime;
	timeText.style.color = 'white';
	timeText.style.textAlign = 'left';
	imgWrapper.appendChild(timeText);

	var img = new Image();
	img.src = dataURL;
	img.style.maxWidth = '100%';
	img.style.display = 'block';
	img.style.cursor = 'pointer';
	// Set the alt attribute to the image caption
	img.alt = "Screenshot of a Python program running in PyScripter, showing a class definition and instantiation.";
	imgWrapper.appendChild(img);

	var captionSection = document.createElement('div');
	captionSection.style.border = '1px solid white';
	captionSection.style.marginTop = '10px';
	captionSection.style.padding = '10px';

	// Instead of appending the captionText to the captionSection, use it as an alt attribute for the image
	// Therefore, this section can now be used for any additional information or removed if not needed

	var ocrSection = document.createElement('div');
	ocrSection.style.border = '1px solid white';
	ocrSection.style.marginTop = '10px';
	ocrSection.style.padding = '10px';
	ocrSection.style.backgroundColor = '#282c34';
	ocrSection.style.color = '#abb2bf';
	ocrSection.style.fontFamily = 'Consolas, "Courier New", monospace';
	ocrSection.style.whiteSpace = 'pre';

	var ocrTextContent = `
class Employee:
    def __init__(self, first, last, pay):
        self.first = first
        self.last = last
        self.pay = pay
        self.email = first + '.' + last + '@company.com'

    def fullName(self):
        return '{} {}'.format(self.first, self.last)

emp_1 = Employee('Corey', 'Schafer', 50000)
emp_2 = Employee('Test', 'User', 60000)
`;

	var ocrText = document.createElement('p');
	ocrText.innerText = ocrTextContent.trim();
	ocrSection.appendChild(ocrText);

	imgWrapper.appendChild(ocrSection);

	container.appendChild(imgWrapper);
}

function triggerDownload(dataURL) {
	var downloadLink = document.createElement('a');
	downloadLink.href = dataURL; // Set href to the data URL
	downloadLink.download = 'screenshot_' + getFormattedDate() + '.png'; // Set the download filename

	// This part is important for triggering the download
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink); // Remove the link when done
}

function getFormattedDate() {
	var now = new Date();
	return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '_' +
		now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
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
		container.style.maxWidth = '500px';
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
	// Check if Ctrl is pressed and the key is '6'
	if (e.ctrlKey && e.key === '6') {
		CaptureScreenshot();
		e.preventDefault(); // Prevent the default action of the key press
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
