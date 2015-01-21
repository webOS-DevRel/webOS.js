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
 * @namespace webOS.feedback
 */

webOS.feedback = {
	/**
	 * Play feedback sound
	 * @param {string} param - feedback sound name
	 */
	play: function(param) {
		if(webOS && webOS.platform && webOS.platform.wearable) {
			var params = {
				name: param || "touch",
				sink: "pfeedback"
			};

			if(!window.PalmServiceBridge) {
				return;
			}

			webOS.service.request("luna://com.palm.audio/systemsounds", {
				method: "playFeedback",
				parameters: params,
				subscribe: false,
				resubscribe: false
			});
		}
	}
};
