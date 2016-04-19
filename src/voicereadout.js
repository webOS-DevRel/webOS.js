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
 * APIs for accessibility VoiceReadout
 * @namespace webOS.voicereadout
 */

webOS.voicereadout = {

	/**
	 * Read alert text when accessibility VoiceReadout enabled.
	 * @param {string} s - String to voice readout.
	 * @param {boolean} c - Clear optoin for TTS. If true it will cut off previous reading. Valid for TV only
	 */
	readAlert: function(s, c) {
		var clear = (c === undefined)? true : c;

		if(webOS && webOS.platform && webOS.platform.watch) {

			var locale, speechRate;

			/**
			* Check VoiceReadOut talkback is enabled or not.
			*
			* @private
			*/
			var checkVoiceReadOut = function(callback) {
				webOS.service.request("luna://com.webos.settingsservice", {
					method: "getSystemSettings",
					parameters: {"category":"VoiceReadOut"},
					onSuccess: function(inResponse) {
						if (inResponse && inResponse.settings.talkbackEnable) {
							callback();
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
			var getLocaleInfo = function(callback) {
				webOS.service.request("luna://com.webos.settingsservice", {
					method: "getSystemSettings",
					parameters: {"keys": ["localeInfo"]},
					onSuccess: function(inResponse) {
						locale = inResponse.settings.localeInfo.locales.TTS;
						callback();
					},
					onFailure: function(inError) {
						console.error("Failed to get system localeInfo settings: " + JSON.stringify(inError));
					}
				});
			};

			/**
			* Get current speech rate.
			*
			* @private
			*/
			var getSpeechRate = function(callback) {
				webOS.service.request("luna://com.webos.settingsservice", {
					method: "getSystemSettings",
					parameters: {"category":"option", "key":"ttsSpeechRate"},
					onSuccess: function(inResponse) {
						speechRate = Number(inResponse.settings.ttsSpeechRate);
						callback();
					},
					onFailure: function(inError) {
						console.error("Failed to get system speechRate settings: " + JSON.stringify(inError));
					}
				});
			};

			/**
			* Read alert message using TTS api.
			*
			* @private
			*/
			var readAlertMessage = function() {
				webOS.service.request("luna://com.lge.service.tts", {
					method: "speak",
					parameters: {"locale":locale, "text":s, "speechRate":speechRate}
				});
			};

			checkVoiceReadOut(function() {
				getLocaleInfo(function() {
					getSpeechRate(readAlertMessage);
				});
			});
		} else if (webOS && webOS.platform && webOS.platform.tv) {

			/**
			* Check AudioGuidance is enabled or not.
			*
			* @private
			*/
			var checkAudioGuidance = function(callback) {
				webOS.service.request("luna://com.webos.settingsservice", {
					method: "getSystemSettings",
					parameters: {"keys" : ["audioGuidance"],"category": "option"},
					onSuccess: function(inResponse) {
						if (inResponse && inResponse.settings.audioGuidance === "on") {
							callback();
						}
					},
					onFailure: function(inError) {
						console.error("Failed to get system AudioGuidance settings: " + JSON.stringify(inError));
					}
				});
			};

			/**
			* Read alert message using TTS api.
			*
			* @private
			*/
			var readAlertMessage = function() {
				webOS.service.request("luna://com.webos.service.tts", {
					method: "speak",
					parameters: {"text":s, "clear": clear},
					onFailure: function(inError) {
						console.error("Failed to readAlertMessage: " + JSON.stringify(inError));
					}
				});
			};

			checkAudioGuidance(readAlertMessage);
		} else {
			console.warn("Platform doesn't support TTS api.");
		}
	}
};
