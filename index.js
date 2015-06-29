var ready = require('enyo/ready');
var Sampler = require('./src/Sampler');

require('enyo-webos');
ready(function () {
	new Sampler().renderInto(document.body);
});
