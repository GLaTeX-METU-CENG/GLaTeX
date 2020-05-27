var port = null;
var hostName = "com.glatex.compile";

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("Installed extension successfully");
        window.open('https://senior.ceng.metu.edu.tr/2020/glatex/#instructions', '_blank');
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from version " + details.previousVersion + " to version " + thisVersion);
    }
});

chrome.runtime.onMessage.addListener(
	function(request, sender){
		if( request.message === "special" ){
			port = chrome.runtime.connectNative(hostName);
		}
		else if( request.message === "logo" ){
			chrome.browserAction.setIcon({path: 'logo_' + request.command + '.png'});
		}
	}
);
