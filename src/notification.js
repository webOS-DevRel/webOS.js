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

/**
 * @namespace webOS.notification
 */

webOS.notification = {
	/**
	 * @callback webOS.notification~toastCallback
	 * @param {string} toastId - Unique ID of the toast being shown
	 */
	 
	/**
	 * Shows a temporary toast message via the system
	 * @param {object} params - Toast notification parameters, including:
	 * @param {string} params.message - Message to display.
	 * @param {string} [params.icon] - Icon url for the notification.
	 * @param {string} [params.appId] - AppID of app to launch when toast is clicked. Only needed to specific a different appID than current app.
	 *                                  (Does not work on legacy webOS 1.x-3.0.4 and Open webOS)
	 * @param {object} [params.params] - Launch parameters to send when clicked.
	 * @param {string} [params.target] - A valid webOS mime type. An alternative to appId and params.
	 *                                   (Does not work on legacy webOS 1.x-3.0.4 and Open webOS)
	 * @param {boolean} [params.noaction] - If clicking the toast should do nothing.
	 *                                     (Does not work on legacy webOS 1.x-3.0.4 and Open webOS)
	 * @param {boolean} [params.stale] - If true, it's not actively displayed as a new notification.
	 *                                   (Does not work on legacy webOS 1.x-3.0.4 and Open webOS)
	 * @param {string}  [params.soundClass] - System class of sound to play on notification.
	 *                                        (Legacy webOS 1.x-3.0.4 and Open webOS only)
	 * @param {string}  [params.soundFile] - Sound filepath of file to play on notification.
	 *                                       (Legacy webOS 1.x-3.0.4 and Open webOS only)
	 * @param {string}  [params.soundDuration] - Duration for the sound to play on notification.
	 *                                           (Legacy webOS 1.x-3.0.4 and Open webOS only)
	 * @param {webOS.notification~toastCallback} [callback] - The function to call once the toast notification is initialized.
	 */
	showToast: function(params, callback) {
		var message = params.message || "";
		var icon = params.icon || "";
		var source = webOS.fetchAppId();
		var appId = params.appId || source;
		var toastParams = params.params || {};
		var target = params.target;
		var noaction = params.noaction;
		var stale = params.stale || false;
		var soundClass = params.soundClass || "";
		var soundFile = params.soundFile || "";
		var soundDurationMs = params.soundDurationMs || "";

		if(webOS.platform.legacy || webOS.platform.open) { //banner notifications for old webOS
			var response = params.response || {banner: true};
			var id = PalmSystem.addBannerMessage(message, JSON.stringify(toastParams), icon,
				soundClass, soundFile, soundDurationMs);
			callback && callback(id);
		} else {
			if(message.length>60) {
				console.warn("Toast notification message is longer than recommended. May not display as intended");
			}
			var reqParam = {
				sourceId: source,
				message: message,
				stale: stale,
				noaction:noaction
			};
			if(icon && icon.length>0) {
				reqParam.iconUrl = icon
			}
			if(!noaction) {
				if(target) {
					reqParam.onclick = {target:target};
				} else {
					reqParam.onclick = {appId:appId, params:toastParams};
				}
			}
			this.showToastRequest = webOS.service.request("palm://com.webos.notification", {
				method: "createToast",
				parameters: reqParam,
				onSuccess: function(inResponse) {
					callback && callback(inResponse.toastId);
				},
				onFailure: function(inError) {
					console.error("Failed to create toast: " + JSON.stringify(inError));
					callback && callback();
				}
			});

		}
	},

	/**
	 * Removes a toast notification
	 * @param {string} toastId - ID of the toast to remove
	 */
	removeToast: function(toastId) {
		if(webOS.platform.legacy || webOS.platform.open) {
			try {
				PalmSystem.removeBannerMessage(toastId);
			} catch(e) {
			console.warn(e);
			PalmSystem.clearBannerMessage();
			}
		} else {
			this.removeToastRequest = webOS.service.request("palm://com.webos.notification", {
				method: "closeToast",
				parameters: {toastId:toastId}
			});
		}
	},

	/**
	 * Checks whether or not the current device supports creation of dashboard windows.
	 * @return {boolean} - Whether or not dashboard windows are supported.
	 */
	supportsDashboard: function() {
		return (webOS.platform.legacy || webOS.platform.open);
	},

	/**
	 * Creates a dashboard window. (Only works on old webOS and Open webOS)
	 *
	 * @param {string} [url] - URL for an HTML file to be loaded into the dashboard.
	 * @param {string} [html] - HTML code to inject into the dashboard window.
	 * @return {object} Window object of the child window for the dashboard
	 */
	showDashboard: function(url, html) {
		if(webOS.platform.legacy || webOS.platform.open) {
			var dash = window.open(url, "_blank", "attributes={\"window\":\"dashboard\"}");
			if(html) {
				dash.document.write(html);
			}
			if(dash.PalmSystem) {
				dash.PalmSystem.stageReady();
			}
			return dash;
		} else {
			console.warn("Dashboards are not supported on this version of webOS.");
		}
	}
};
