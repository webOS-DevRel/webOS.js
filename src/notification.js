/*
 * Copyright (c) 2013-2015 LG Electronics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
	 * @param {string} params.message - Message to display (upto 60 characters)
	 * @param {string} [params.icon] - Icon url for the notification (80x80 png format)
	 * @param {string} [params.appId] - AppID of app to launch when toast is clicked. Only needed to specific a different appID than current app.
	 * @param {object} [params.appParams] - Launch parameters to send when clicked.
	 * @param {string} [params.target] - A target filepath to open; must be a valid webOS mimetype. An alternative to appId and params.
	 * @param {boolean} [params.noaction] - If clicking the toast should do nothing.
	 * @param {boolean} [params.stale] - If true, it's not actively displayed as a new notification.
	 * @param {webOS.notification~toastCallback} [callback] - The function to call once the toast notification is initialized.
	 */
	showToast: function(params, callback) {
		var message = params.message || "";
		var icon = params.icon || "";
		var source = webOS.fetchAppId();
		var appId = params.appId || source;
		var toastParams = params.appParams || {};
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
