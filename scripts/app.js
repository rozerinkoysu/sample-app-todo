/* globals lang */

include("libs/polyfill.js");
include('i18n/i18n.js');
include("libs/require.js");

Application.onUnhandledError = Application_OnError;
Application.onStart 		 = Application_OnStart;

/**
 * Triggered when application is started.
 * @param {EventArguments} e Returns some attributes about the specified functions
 * @this Application
 */
function Application_OnStart(e) {
	//initializes require
	initRequire("./main.js");
}

function Application_OnError(e) {
	switch (e.type) {
		case "Server Error":
		case "Size Overflow":
			alert(lang.networkError);
			break;
		default:
			//change the following code for desired generic error messsage
			alert({
				title: lang.applicationError,
				message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
			});
			
			break;
	}
}
