var r;
var recording = false;
var complete_transcript = '';

window.onload = function () {
	setup_controls();
	setup_recorder();
};

var setup_controls = function () {
	// start recording
	$('.record .start').click(function () {
		if(!recording) {
			r.start();	
		}
	});

	// stop recording
	$('.record .stop').click(function () {
		if(recording) {
			r.stop();	
		}
	});

	// clear the current transcript
	$('.record .clear').click(function () {
		$('.record .result').val('');
		complete_transcript = '';
	});
}


var setup_recorder = function () {
	if (!('webkitSpeechRecognition' in window)) {
	  alert("You need a new version of Chrome");
	  return;
	}

	r = new webkitSpeechRecognition();
	r.continuous = false;
	r.interimResults = true;
	r.lang = "en-US";

	r.onstart = function () {
		recording = true;
	};

	r.onend = function () {
		recording = false;
	}

	r.onresult = function (e) {
		if (typeof e.results == 'undefined') {
			r.onend = null;
			r.stop();
			return;
		}
		$.each(e.results, function (i, result) {
			if(result.isFinal) {
				complete_transcript += result[0].transcript;
			}
		});
		if (complete_transcript){
			console.log("End result: " + complete_transcript);
            var raw = $('.raw-result').val() + "<br />" + complete_transcript;
			$('.raw-result').val(raw);
            var resolve_url = 'inventropy.us:5000/resolve/' +
                encodeURIComponent(complete_transcript);
            $.get(resolve_url, function (data) {
                console.log(data);
            });
	};

	r.onerror = function (e) {
		switch(e.error) {
			case 'no-speech':
				alert("No speech recorded");
				break;
			case 'audio-capture':
				alert("Audio capture error");
				break;
			case 'not-allowed':
				alert("Blocked by browser");
				break;
			default:
				alert("Other error: " + e.error);
				return;
		}
	};
};
