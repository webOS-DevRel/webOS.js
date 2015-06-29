var
	kind = require('enyo/kind'),
	Scroller = require('enyo/Scroller'),
	GroupBox = require('onyx/GroupBox'),
	GroupboxHeader = require('onyx/GroupboxHeader'),
	Button = require('onyx/Button'),
	json = require('enyo/json');
var Ajax = require('enyo/Ajax');


module.exports = kind({
	name: "Sampler",
	classes: "onyx enyo-fit enyo-unselectable",
	kind: Scroller,
	components: [
		{classes: "webos-sample-title", content:"webOS.js Sampler"},
		{classes: "webos-sample", components: [
			{classes: "webos-sample-divider", content: "Application API"},
			{kind: GroupBox, classes: "webos-sample-result-box", components: [
				{kind: GroupboxHeader, content: "webOS.fetchAppId"},
				{name: "appID", classes: "webos-sample-result", allowHtml: true, content: "&nbsp;"}
			]},
			{tag: "br"},
			{kind: GroupBox, classes:"webos-sample-result-box", components: [
				{kind: GroupboxHeader, content: "webOS.fetchAppInfo"},
				{name: "appInfo", classes: "webos-sample-result", allowHtml: true, content: "&nbsp;"}
			]},
			{tag: "br"},
			{kind: GroupBox, classes: "webos-sample-result-box", components: [
				{kind: GroupboxHeader, content: "webOS.fetchAppRootPath"},
				{name: "appPath", classes: "webos-sample-result", allowHtml: true, content: "&nbsp;"}
			]},
			{tag: "br"},
			{classes: "webos-sample-divider", content: "Device API"},
			{kind: GroupBox, classes: "webos-sample-result-box", components: [
				{kind: GroupboxHeader, content: "webOS.deviceInfo"},
				{name: "deviceInfo", classes: "webos-sample-result", allowHtml: true, content:"&nbsp;"}
			]},
			{tag: "br"},
			{classes: "webos-sample-divider", content: "Platform API"},
			{kind: GroupBox, classes: "webos-sample-result-box", components: [
				{kind: GroupboxHeader, content: "webOS.platform"},
				{name: "platformInfo", classes: "webos-sample-result", allowHtml: true, content: "&nbsp;"}
			]},
			{tag: "br"},
			{classes: "webos-sample-divider", content: "Feedback API"},
			{classes: "webos-sample-tools", components: [
				{name:"feedbackBtn", kind: Button, content: "play", ontap: "feedbackPlay"}
			]},
			{name: "feedbackError", content: "Only available for watch platform", classes: "webos-sample-error", showing: false},
			{tag: "br"},
			{classes: "webos-sample-divider", content: "Notification API"},
			{classes: "webos-sample-tools", components: [
				{name:"notificationBtn1", kind: Button, content: "showToast", ontap: "showToast"},
				{name:"notificationBtn2", kind: Button, content: "removeToast", ontap: "removeToast"}
			]},
			{name: "notificationError", content: "Not available for unknown platforms", classes: "webos-sample-error", showing: false},
			{tag: "br"},
			{classes: "webos-sample-divider", content: "Voice Readout API"},
			{classes: "webos-sample-tools", components: [
				{name:"readoutBtn", kind: Button, content: "readAlert", ontap: "readAlert"}
			]},
			{name: "readoutError", content: "Only available for TV and watch platforms", classes: "webos-sample-error", showing: false},
			{tag: "br"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		if(window.webOS) {
			//Application API
			this.$.appID.setContent(webOS.fetchAppId());
			webOS.fetchAppInfo(this.bindSafely(function(appInfo) {
				if(appInfo) {
					this.$.appInfo.setContent(json.stringify(appInfo, null, "\t"));
				} else {
					this.$.appInfo.setContent("&lt;appinfo.json not found&gt;");
				}
			}));
			this.$.appPath.setContent(webOS.fetchAppRootPath());

			//Device API
			this.$.deviceInfo.setContent("Unable to read device info");
			webOS.deviceInfo(this.bindSafely(function(info) {
				this.$.deviceInfo.setContent(json.stringify(info, null, "\t"));
			}));
			
			//Platform API
			this.$.platformInfo.setContent(json.stringify(webOS.platform, null, "\t"));

			//Feedback API
			if(!webOS.platform.watch) {
				this.$.feedbackBtn.setDisabled(true);
				this.$.feedbackError.show();
			}

			//Notification API
			if(webOS.platform.unknown) {
				this.$.notificationBtn1.setDisabled(true);
				this.$.notificationBtn2.setDisabled(true);
				this.$.notificationError.show();
			} else {
				this.toastIDs = [];
			}

			//Voice Readout API
			if(!webOS.platform.tv && !webOS.platform.watch) {
				this.$.readoutBtn.setDisabled(true);
				this.$.readoutError.show();
			}
		} else {
			console.error("Error: webOS.js not loaded.");
		}
	},
	feedbackPlay: function(inSender, inEvent) {
		webOS.feedback.play();
		return true;
	},
	showToast: function(inSender, inEvent) {
		webOS.notification.showToast({message:"This is a toaster example!"}, this.bindSafely("toastShown"));
		return true;
	},
	toastShown: function(id) {
		if(id != null) {
			this.toastIDs.push(id);
		}
	},
	removeToast: function(inSender, inEvent) {
		if(this.toastIDs.length>0) {
			var id = this.toastIDs.pop();
			webOS.notification.removeToast(id);
		}
		return true;
	},
	readAlert: function(inSender, inEvent) {
		webOS.voicereadout.readAlert("This is text being read aloud by the system.");
		return true;
	}
});