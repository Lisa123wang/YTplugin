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
	imgWrapper.style.marginBottom = '20px'; // Space between this and next image wrapper

	var timeText = document.createElement('p');
	var currentTime = formatTime(player.currentTime);
	timeText.innerText = "Time: " + currentTime;
	timeText.style.color = 'white';
	timeText.style.textAlign = 'left';
	imgWrapper.appendChild(timeText);
	/*
	var img = new Image();
	img.src = dataURL;
	img.style.maxWidth = '100%';
	img.style.display = 'block';
	img.style.cursor = 'pointer';
	// Set the alt attribute to the image caption
	img.alt = "Screenshot of a Python program running in PyScripter, showing a class definition and instantiation.";
	*/
	//img open ai api
	var img = new Image();
	img.src = dataURL;
	img.style.maxWidth = '100%';
	img.style.display = 'block';
	img.style.cursor = 'pointer';

	// Placeholder function to get caption from OpenAI API
	async function getCaptionForImage(imageData) {
		// This is a placeholder for making an API call to your server, which then calls OpenAI's API.
		// The function should return a caption based on the image data provided.
		// Example: return fetch('/api/generate-caption', { method: 'POST', body: JSON.stringify({ imageData })})
		//             .then(response => response.text());
		return "Generated caption based on the image.";
	}

	// Use the async function to set the alt attribute dynamically
	getCaptionForImage(dataURL).then(caption => {
		img.alt = caption;
	});



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

	// Placeholder function to get OCR text from an image
	async function getOcrTextFromImage(imageData) {
		// This is a placeholder for making an API call to your server, which then calls an OCR API.
		// The function should return extracted text based on the image data provided.
		// Example: return fetch('/api/extract-text', { method: 'POST', body: JSON.stringify({ imageData })})
		//             .then(response => response.json())
		//             .then(data => data.text);
		return "Extracted text from the image.";
	}

	// Use the async function to set the OCR text dynamically
	getOcrTextFromImage(dataURL).then(ocrTextContent => {
		var ocrText = document.createElement('p');
		ocrText.innerText = ocrTextContent.trim();
		ocrSection.appendChild(ocrText);
	});


	imgWrapper.appendChild(ocrSection);

	container.appendChild(imgWrapper);
	//download image
	var appendixTitle = "screenshot." + extension;

	var title;

	var headerEls = document.querySelectorAll("h1.title.ytd-video-primary-info-renderer");

	function SetTitle() {
		if (headerEls.length > 0) {
			title = headerEls[0].innerText.trim();
			return true;
		} else {
			return false;
		}
	}

	if (SetTitle() == false) {
		headerEls = document.querySelectorAll("h1.watch-title-container");

		if (SetTitle() == false)
			title = '';
	}

	var player = document.getElementsByClassName("video-stream")[0];

	//var time = player.currentTime;

	title += " ";
	/*
	let minutes = Math.floor(time / 60)

	time = Math.floor(time - (minutes * 60));

	if (minutes > 60) {
		let hours = Math.floor(minutes / 60)
		minutes -= hours * 60;
		title += hours + "-";
	}
	*/
	title += currentTime ;

	title += " " + appendixTitle;

	var canvas = document.createElement("canvas");
	canvas.width = player.videoWidth;
	canvas.height = player.videoHeight;
	canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height);

	var downloadLink = document.createElement("a");
	downloadLink.download = title;

	function DownloadBlob(blob) {
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.click();
	}

	async function ClipboardBlob(blob) {
		const clipboardItemInput = new ClipboardItem({ "image/png": blob });
		await navigator.clipboard.write([clipboardItemInput]);
	}

	// If clipboard copy is needed generate png (clipboard only supports png)
	if (screenshotFunctionality == 1 || screenshotFunctionality == 2) {
		canvas.toBlob(async function (blob) {
			await ClipboardBlob(blob);
			// Also download it if it's needed and it's in the correct format
			if (screenshotFunctionality == 2 && screenshotFormat === 'png') {
				DownloadBlob(blob);
			}
		}, 'image/png');
	}

	// Create and download image in the selected format if needed
	if (screenshotFunctionality == 0 || (screenshotFunctionality == 2 && screenshotFormat !== 'png')) {
		canvas.toBlob(async function (blob) {
			DownloadBlob(blob);
		}, 'image/' + screenshotFormat);
	}
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
		var videoTitle = getVideoTitle();
		container.innerHTML = `<h3 style="color:white">${videoTitle}</h3>`;
		target.insertBefore(container, target.firstChild);
	}
}

function getVideoTitle() {
	var title;
	var headerEls = document.querySelectorAll("h1.title.ytd-video-primary-info-renderer");

	function SetTitle() {
		if (headerEls.length > 0) {
			title = headerEls[0].innerText.trim();
			return true;
		} else {
			return false;
		}
	}

	if (!SetTitle()) {
		headerEls = document.querySelectorAll("h1.watch-title-container");

		if (!SetTitle()) title = "Video Screenshot"; // Fallback title if none is found
	}

	return title;
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
