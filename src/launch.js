/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

// Emulates the "webOSLaunch" and webOSRelaunch" document events for legacy webOS devices
// and Open webOS, then sets the stage as ready.

if((webOS.platform.legacy || webOS.platform.open) && !window.cordova) {
	var fireDocumentEvent = function(type, data) {
		var evt = document.createEvent('Events');
		evt.initEvent(type, false, false);
		for(var i in data) {
			evt[i] = data[i];
		}
		document.dispatchEvent(evt);
	};
	// create global Mojo object if it does not exist
	Mojo = window.Mojo || {};
	//emulate new webOS launch/relaunch events on old devices
	var lp = JSON.parse(PalmSystem.launchParams || "{}") || {};
	fireDocumentEvent("webOSLaunch", {type:"webOSLaunch", detail:lp});

	// LunaSysMgr calls this whenever an app is "launched;"
	window.Mojo.relaunch = function(e) {
		var lp = JSON.parse(PalmSystem.launchParams || "{}") || {};
		if(lp['palm-command'] && lp['palm-command'] == 'open-app-menu') {
			fireDocumentEvent("menubutton", {});
			return true;
		} else {
			fireDocumentEvent("webOSRelaunch", {type:"webOSRelaunch", detail:lp});
		}
	};

	//set the application to ready
	if(window.PalmSystem) {
		window.PalmSystem.stageReady();
	}
}
