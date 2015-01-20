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
 * @namespace webOS.VoiceReadout
 */

webOS.VoiceReadout = {

	/**
	 * Read alert text when accessibility VoiceReadout enabled.
	 * @param {string} s - String to voice readout.
	 */
	readAlert: function(s) {
		if (webOS.device.modelName === "LGE Open webOS Device") {

			/**
			* Check VoiceReadOut talkback is enabled or not.
			*
			* @private
			*/
			var checkVoiceReadOut = function() {
				var req = enyo.ServiceRequest ? new enyo.ServiceRequest() : undefined;

				if (req) {
					req.service = "luna://com.webos.settingsservice/getSystemSettings";
					req.go({"category":"VoiceReadOut"});
					req.response(this, voiceReadOutResponse);
				}
			};

			/**
			* @private
			*/
			var voiceReadOutResponse = function(inRequest, inResponse) {
				if (inResponse && inResponse.settings.talkbackEnable) {
					getLocaleInfo()
				}
			};

			/**
			* Get current locale info.
			*
			* @private
			*/
			var getLocaleInfo = function() {
				var req = enyo.ServiceRequest ? new enyo.ServiceRequest() : undefined;

				if (req) {
					req.service = "luna://com.webos.settingsservice/getSystemSettings";
					req.go({"keys": ["localeInfo"]});
					req.response(this, localeInfoResponse);
				}
			};

			/**
			* @private
			*/
			var localeInfoResponse = function(inRequest, inResponse) {
				var req, locale;

				req = enyo.ServiceRequest ? new enyo.ServiceRequest() : undefined;

				if (req && inResponse && inResponse.settings.localeInfo) {
					locale = inResponse.settings.localeInfo.locales.TTS;
					req.service = "luna://com.lge.service.tts/speak";
					req.go({"locale":locale, "text":s});
				}
			}

			checkVoiceReadOut();

		}
	}
};
