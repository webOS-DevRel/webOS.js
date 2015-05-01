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
 * Virtual Keyboard APIs. Not supported on webOS TV platform.
 * @namespace webOS.keyboard
 */

var hasVKeyboard = !(webOS.platform.legacy &&
		webOS.device.platformVersionMajor &&
		parseInt(webOS.device.platformVersionMajor)<3);

if(hasVKeyboard) {
	var state = {};
	
	//Mojo LunaSysMgr hook for detecting keyboard shown
	Mojo = window.Mojo || {};
	Mojo.keyboardShown = function(inKeyboardShowing) {
		state.isShowing = inKeyboardShowing;
	};
	
	webOS.keyboard = {
		/**
		 * Virtual keyboard type constants
		 * @readonly
 		 * @enum {number}
		 */
		types: {
			/** Standard default keyboard layout */
			text: 0,
			/** Password-oriented keyboard layout */
			password: 1,
			/** Search-oriented keyboard layout */
			search: 2,
			/** Range-oriented keyboard layout */
			range: 3,
			/** Email-oriented keyboard layout */
			email: 4,
			/** Number-oriented keyboard layout */
			number: 5,
			/** Phone-oriented keyboard layout */
			phone: 6,
			/** URL-oriented keyboard layout */
			url: 7,
			/** Color-oriented keyboard layout */
			color: 8
		},
	
		/**
		 * Returns whether or not the virtual keyboard is currently displayed
		 * @return {boolean} Virtual keyboard visibility.
		 */
		isShowing: function() {
			return state.isShowing || false;
		},
	
		/**
		 * Shows the virtual keyboard
		 * @param {webOS.keyboard.types|number} [type=webOS.keyboard.types.text] - Type of virtual keyboard to display; from webOS.keyboard.types constants.
		 */
		show: function(type){
			if(this.isManualMode() && window.PalmSystem) {
				PalmSystem.keyboardShow(type || 0);
			}
		},
	
		/**
		 * Hides the virtual keyboard
		 */
		hide: function(){
			if(this.isManualMode() && window.PalmSystem) {
				PalmSystem.keyboardHide();
			}
		},
	
		/**
		 * Enables/disables manual mode for the virtual keyboard
		 * @param {boolean} mode - If true, keyboard must be manually forced shown/hidden. If false, it's automatic.
		 */
		setManualMode: function(mode){
			state.manual = mode;
			if(window.PalmSystem) {
				PalmSystem.setManualKeyboardEnabled(mode);
			}
		},
	
		/**
		 * Whether or not manual mode is set for the virtual keyboard
		 * @return {boolean} Manual mode status
		 */
		isManualMode: function(){
			return state.manual || false;
		},
	
		/**
		 * Force the virtual keyboard to show. In the process, enables manual mode.
		 * @param {webOS.keyboard.types|number} [type=webOS.keyboard.types.text] - Type of virtual keyboard to display; from webOS.keyboard.types constants.
		 */
		forceShow: function(inType){
			this.setManualMode(true);
			if(window.PalmSystem) {
				PalmSystem.keyboardShow(inType || 0);
			}
		},
	
		/**
		 * Force the virtual keyboard to hide. In the process, enables manual mode.
		 */
		forceHide: function(){
			this.setManualMode(true);
			if(window.PalmSystem) {
				PalmSystem.keyboardHide();
			}
		}
	};
}
