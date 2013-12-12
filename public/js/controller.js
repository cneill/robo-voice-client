var r;
var recording = false;
var complete_transcript = '';

var root = 'http://r.inventropy.us/'; // root url for our api
var resolve_url = root + 'resolve/'; // resolve words to commands
var interrupt_url = root + 'interrupt/'; // process interim results for halt
var halt_url = root + 'halt/'; // halt any executing command

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
	r.continuous = true; // don't stop after user stops talking
	r.interimResults = true; // get preliminary results with imperfect 
	r.lang = "en-US";

    // triggered by r.start()
	r.onstart = function () {
		recording = true;
	};

    // triggered by r.end()
	r.onend = function () {
		recording = false;
	}

    // when we get a result from Google
	r.onresult = function (e) {
		if (typeof e.results == 'undefined') {
			r.onend = null;
			r.stop();
			return;
		}
		$.each(e.results, function (i, result) {
			if(result.isFinal) { // if this is a final result
				complete_transcript += result[0].transcript;
                var raw = $('.raw-result').val() + "\n" + result[0].transcript;
                $('.raw-result').val(raw);
                /*
                $.get(resolve_url + encodeURIComponent(result[0].transcript), function (data) {
                    console.log(data);  
                });
                */
                $.post(resolve_url, {raw: result[0].transcript}, function (data, text_stat, xhr) {
                    console.log(data);
                });

			} else if (is_interrupt(result[0].transcript)) { // process interim results for interrupts
                alert("Interrupt received. Halting execution.");
            }
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

// check to see if we got a "stop" or "more" command
var is_interrupt = function(transcript) {
    $.post(interrupt_url, {raw:transcript}, function (data, text_stat, xhr) {
        console.log("Interrupt reply: " + data);
    }, 'json');
            
};
