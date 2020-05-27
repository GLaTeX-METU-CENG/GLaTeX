var serverURL = "http://localhost:8001/";

var darkMode;
var isDocs;
var $ = jQuery;
chrome.tabs.query({
		active: true,
      	currentWindow: true
    }, function(tabs){

		var tabId = tabs[0].id;
		var docs = document.getElementById("docs");
		var error = document.getElementById("error");
		chrome.tabs.sendMessage(tabId, {"message": "dark", "command": "status"}, function(response){
			
			if( response ){
				docs.style = "display: block";
				error.style = "display: none";
				if( response.response === "true" ){
					darkMode = "true";
					document.body.style.backgroundColor = "#333";
			    	document.getElementById("darkText").style.color = "#ccc";
		    		document.getElementById("darkButton").checked = true;
				}
				else{
					darkMode = "false";
					document.body.style.backgroundColor = "#ccc";
			    	document.getElementById("darkText").style.color = "#000";
			    	document.getElementById("darkButton").checked = false;
				}
			}
			else{
				console.log("Something happened");
				docs.style = "display: none";
				error.style = "display: black";
				chrome.tabs.executeScript(tabId, {file: "content.js"}, function(response){
					if(response){
						docs.style = "display: block";
						error.style = "display: none";
					}
					else{
						console.log("Content error");
					}

					if(chrome.runtime.lastError) {
						console.log("Error: "+chrome.runtime.lastError.message);
					}
				});
			}

			if(chrome.runtime.lastError) {
				console.log("Error: "+chrome.runtime.lastError.message);
			}
		});


	    $('#darkButton').click(function () {

	    	if ( darkMode === "false" ){
	    		document.body.style.backgroundColor = "#333";
	    		document.getElementById("darkText").style.color = "#ccc";
	    		chrome.tabs.sendMessage(tabId, {"message": "dark", "command": "on"});
	    		darkMode = "true";
	    	}
	    	else{
	    		document.body.style.backgroundColor = "#ccc";
	    		document.getElementById("darkText").style.color = "#000";
	    		chrome.tabs.sendMessage(tabId, {"message": "dark", "command": "off"});
	    		darkMode = "false";

	    	}
	    });
	}
);