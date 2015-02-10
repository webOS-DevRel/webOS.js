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
 * APIs for accessibility VoiceReadout
 * @namespace webOS.voicereadout
 */

webOS.voicereadout = {

	/**
	 * Read alert text when accessibility VoiceReadout enabled.
	 * @param {string} s - String to voice readout.
	 */
	readAlert: function(s) {
		if(webOS && webOS.platform && webOS.platform.watch) {

			/**
			* Check VoiceReadOut talkback is enabled or not.
			*
			* @private
			*/
			var checkVoiceReadOut = function() {
				webOS.service.request("luna://com.webos.settingsservice", {
					method: "getSystemSettings",
					parameters: {"category":"VoiceReadOut"},
					onSuccess: function(inResponse) {
						if (inResponse && inResponse.settings.talkbackEnable) {
							getLocaleInfo();
						}
					},
					onFailure: function(inError) {
						console.error("Failed to get system VoiceReadOut settings: " + JSON.stringify(inError));
					}
				});
			};

			/**
			* Get current locale info.
			*
			* @private
			*/
			var getLocaleInfo = function() {
				webOS.service.request("luna://com.webos.settingsservice", {
					method: "getSystemSettings",
					parameters: {"keys": ["localeInfo"]},
					onSuccess: function(inResponse) {
						readAlertMessage(inResponse);
					},
					onFailure: function(inError) {
						console.error("Failed to get system localeInfo settings: " + JSON.stringify(inError));
					}
				});
			};

			/**
			* Read alert message using TTS api.
			*
			* @private
			*/
			var readAlertMessage = function(inResponse) {
				var locale;

				if (inResponse && inResponse.settings.localeInfo) {
					locale = inResponse.settings.localeInfo.locales.TTS;
					webOS.service.request("luna://com.lge.service.tts", {
						method: "speak",
						parameters: {"locale":locale, "text":s}
					});
				}
			}

			checkVoiceReadOut();

		}
	}
};
