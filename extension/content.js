var hostName = "com.glatex.compile";
var myTimer;
var $body = document.querySelector('body');
var darkMode;

var vis = (function(){
    var stateKey, 
        eventKey, 
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in window.top.document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) window.top.document.addEventListener(eventKey, c);
        return !window.top.document[stateKey];
    }
})();

vis(function(){
					
    if(vis()){   
		setTimeout(function(){ 
			chrome.extension.sendMessage({"message":"logo","command":"on"});
		},300);
        
    } else {
		chrome.extension.sendMessage({"message":"logo","command":"off"});
         
    }
});

chrome.extension.sendMessage({"message":"logo","command":"on"});

myTimer = setInterval(function() {
	if (window.top.document.getElementsByClassName("script-application-sidebar")[0]) {
		window.top.document.getElementsByClassName("script-application-sidebar")[0].style.width='600px';
		chrome.extension.sendMessage({"message":"special"});
		clearInterval(myTimer);
	}
}, 1000);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var responseMessage = "message received";
		if( request.message === "clicked_browser_action" ) {
			chrome.extension.sendMessage({"message":"special"});
		}
		else if ( request.message === 'dark' ){
			if (request.command === 'on') {
				darkMode = "true";
				$body.classList.add('darkdocs');
				localStorage.setItem('darkMode',darkMode);

			} else if (request.command === 'off') {
				darkMode = "false";
				$body.classList.remove('darkdocs');
				localStorage.setItem('darkMode',darkMode);
			}
			else if ( request.command === 'status' ){
				responseMessage = darkMode;
			}
		}
		sendResponse({
	        response: responseMessage
	    });
		
	}
);


window.onload = function () {
	darkMode = localStorage.getItem('darkMode');
	if ( darkMode === null){
		darkMode = 'false';
		localStorage.setItem('darkMode',darkMode);
	}

	if ( darkMode === 'false' ){
		$body.classList.remove('darkdocs');
	}
	else{
		$body.classList.add('darkdocs');
	}
}

window.onbeforeunload = function () {
	chrome.extension.sendMessage({"message":"logo","command":"off"});
};