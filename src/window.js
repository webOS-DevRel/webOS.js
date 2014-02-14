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
 * @namespace webOS.window
 */

webOS.window = {
	/**
	 * Returns the current launch parameters for the app
	 * @param {object} [inWindow=window] - A window object to reference from, otherwise current window.
	 * @return {object} Launch parameters
	 */
	launchParams: function(inWindow) {
		inWindow = inWindow || window;
		if(inWindow.PalmSystem) {
			return JSON.parse(inWindow.PalmSystem.launchParams || "{}") || {};
		}
		return {};
	},

	/**
	 * Whether a window is activated or not. Not supported on webOS TV platform.
	 * @param {object} [inWindow=window] - A window object to reference from; if omitted, uses current window.
	 * @return {boolean} Activated status
	 */
	isActivated: function(inWindow) {
		inWindow = inWindow || window;
		if(inWindow.PalmSystem) {
			return inWindow.PalmSystem.isActivated;
		}
		return false;
	},

	/**
	 * Tell webOS to activate the current page of your app, bringing it into focus. Not supported on webOS TV platform.
	 * @param {object} [inWindow=window] - A window object to reference from; if omitted, uses current window.
	 */
	activate: function(inWindow) {
		inWindow = inWindow || window;
		if(inWindow.PalmSystem) {
			inWindow.PalmSystem.activate();
		}
	},

	/**
	 * Tell webOS to deactivate your app. Not supported on webOS TV platform.
	 * @param {object} [inWindow=window] - A window object to reference from; if omitted, uses current window.
	 */
	deactivate: function(inWindow) {
		inWindow = inWindow || window;
		if(inWindow.PalmSystem) {
			inWindow.PalmSystem.deactivate();
		}
	},

	/**
	 * Creates a child window in a new card.
	 * @param {string} [url] - URL for an HTML file to be loaded into the new card.
	 * @param {string} [html] - HTML code to inject into the new card's window.
	 * @return {object} Window object of the child window for the new card
	 */
	newCard: function(url, html) {
		if(!url && !(webOS.platform.legacy || webOS.platform.open)) {
			url = "about:blank";
		}
		var child = window.open(url);
		if(html) {
			child.document.write(html);
		}
		if(child.PalmSystem) {
			child.PalmSystem.stageReady();
		}
		return child;
	},

	/**
	 * Enable or disable full screen display. Not supported on webOS TV platform, as all apps there are fullscreen.
	 * @param {boolean} state - Whether to enable or disable full screen mode
	 */
	setFullScreen: function(state) {
		// valid state values are: true or false
		if(window.PalmSystem && PalmSystem.enableFullScreenMode) {
			PalmSystem.enableFullScreenMode(state);
		}
	},

	/**
	 * Used to set the window properties of the WebOS application. Generally should not be needed by developers directly. Not supported on webOS TV platform.
	 * @param {object} inWindow=window] - A window object to reference from; if omitted, uses current window.
	 * @param {object} inProps - Properties to apply to the app window. Valid properties include:
	 * @param {boolean} [inProps.blockScreenTimeout] - If true, the screen will not dim or turn off in the absence of user activity. If false, the timeout behavior will be reinstated.
	 * @param {boolean} [inProps.setSubtleLightbar] - If true, the light bar will be made somewhat dimmer than normal. If false, it will return to normal.
	 * @param {boolean} [inProps.fastAccelerometer] - If true, the accelerometer rate will increase to 30 hz; false by default, rate is at 4 hz. Note fast rate is active only for apps when maximized.
	 */
	setWindowProperties: function(inWindow, inProps) {
		if(arguments.length==1) {
			inProps = inWindow;
			inWindow = window;
		}
		if(inWindow.PalmSystem && inWindow.PalmSystem.setWindowProperties) {
			inWindow.webOS.window.properties = inProps = inProps || {};
			inWindow.PalmSystem.setWindowProperties(inProps);
		}
	},

	/**
	 * Used to get the window properties of the WebOS app. Generally should not be needed by developers directly.
	 * @param {object} [inWindow=window] - A window object to reference from; if omitted, uses current window.
	 * @return {object} Application window properties that have been set thus far.
	 */
	getWindowProperties: function(inWindow) {
		inWindow = inWindow || window;
		inWindow.webOS.window.properties = inWindow.webOS.window.properties || {};
		return inWindow.webOS.window.properties;
	},

	/**
	 * Enable or disable screen timeout. When enabled, the device screen will not dim. Not supported on webOS TV platform.
	 * @param {boolean} state - Whether or not to block screen timeout
	 */
	blockScreenTimeout: function(state) {
		webOS.window.properties.blockScreenTimeout = state;
		this.setWindowProperties(navigator.windowProperties);
	},

	/**
	 * Sets the lightbar to be a little dimmer for screen locked notifications. Not supported on webOS TV platform.
	 * @param {boolean} state - Whether or not to dim the lightbar
	 */
	setSubtleLightbar: function(state) {
		webOS.window.properties.setSubtleLightbar = state;
		this.setWindowProperties(webOS.window.properties);
	},
	
	/**
	 * Enable/disable fast accelerometer update rates. Not supported on webOS TV platform.
	 * @param {boolean} state - When false, accelerometer updates at 4Hz; when enabled, updates at 30Hz
	 */
	setFastAccelerometer: function(state) {
		webOS.window.properties.fastAccelerometer = state;
		this.setWindowProperties(webOS.window.properties);
	}
};
