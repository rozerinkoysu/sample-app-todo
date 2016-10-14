/* globals lang */

include("libs/polyfill.js");
include('i18n/i18n.js');
include("libs/require.js");

Application.onUnhandledError = Application_OnError;
Application.onStart 		 = Application_OnStart;
function checkforUpdate() {
	//Checks if there is a valid update. If yes returns result object.     
	Application.checkUpdate(function(err, result) {
		if (err) {
			//Checking for update is failed
			//alert("check update error: " + err);
		}
		else {
			//Update is successful. We can show the meta info to inform our app user.
			if (result.meta) {
				var isMandatory = (result.meta.isMandatory && result.meta.isMandatory === true) ? true : false;
				var updateTitle = (result.meta.title) ? result.meta.title : 'A new update is ready!';
				var updateMessage = "Version " + result.newVersion + " is ready to install.\n\n" +
					"What's new?:\n" + JSON.stringify(result.meta.update) +
					"\n\n"
				//adding mandatory status	
				updateMessage += (isMandatory) ? "This update is mandatory!" : "Do you want to update?";
				//Function will run on users' approve
				function onFirstButtonPressed() {
					if (result.meta.redirectURL && result.meta.redirectURL.length != 0) {
						//RaU wants us to open a URL, most probably core/player updated and binary changed. 
						SMF.Net.browseOut(result.meta.redirectURL);
					}
					else {
						//There is an update waiting to be downloaded. Let's download it.
						result.download(function(err, result) {
							if (err) {
								//Download failed
								alert("Autoupdate download failed: " + err);
							}
							else {
								//All files are received, we'll trigger an update.
								result.updateAll(function(err) {
									if (err) {
										//Updating the app with downloaded files failed
										alert("Autoupdate update failed: " + err);
									}
									else {
										//After that the app will be restarted automatically to apply the new updates
										Application.restart();
									}
								});
							}
						});
					}
				}
				//We will do nothing on cancel for the timebeing.
				function onSecondButtonPressed() {
					//do nothing
				}
				//if Update is mandatory we will show only Update now button.
				if (isMandatory) {
					alert({
						title: updateTitle,
						message: updateMessage,
						firstButtonText: "Update now",
						onFirstButtonPressed: onFirstButtonPressed
					});
				}
				else {
					alert({
						title: updateTitle,
						message: updateMessage,
						firstButtonText: "Update now",
						secondButtonText: "Later",
						onFirstButtonPressed: onFirstButtonPressed,
						onSecondButtonPressed: onSecondButtonPressed
					});
				}
			}
		}
	});
}
/**
 * Triggered when application is started.
 * @param {EventArguments} e Returns some attributes about the specified functions
 * @this Application
 */
function Application_OnStart(e) {
	checkforUpdate();
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
