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
 * @namespace webOS.window
 */

webOS.window = {
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
		if(child.PalmSystem && child.PalmSystem.stageReady) {
			child.PalmSystem.stageReady();
		}
		return child;
	}
};
