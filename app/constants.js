const os = require('os');
const fs = require('fs');
const path = require('path');
const url = require('url');
const yargs = require("yargs")

module.exports.DEBUG = process.argv.includes('--dev') || false;
module.exports.AUTO_UPDATE_TYPE = yargs.argv.update || null

module.exports.isAMDCPU = (os.cpus()[0].model.indexOf("AMD") > -1);

module.exports.windowResize = {
	social: 0.8,
	viewer: 0.6,
	editor: 0.8
};

module.exports.GAME_REGEX = /^(https?:\/\/)?(www\.)?(.+)(krunker\.io|127\.0\.0\.1:8080)(|\/|\/\?game=.+)$/;
module.exports.GAME_CODE_REGEX = /^([A-Z]+):(\w+)$/;
module.exports.EDITOR_REGEX = /^(https?:\/\/)?(www\.)?(.+)(krunker\.io|127\.0\.0\.1:8080)\/editor\.html$/;
module.exports.VIEWER_REGEX = /^(https?:\/\/)?(www\.)?(.+)(krunker\.io|127\.0\.0\.1:8080)\/viewer\.html(.*)$/;
module.exports.SOCIAL_REGEX = /^(https?:\/\/)?(www\.)?(.+)(krunker\.io|127\.0\.0\.1:8080)\/social\.html(.*)$/;
module.exports.SITE_REGEX = /^(https?:\/\/)?(www\.)?(.+\.|)(krunker\.io|127\.0\.0\.1:8080)(|\/|.+)$/;
module.exports.PING_REGION_CACHE_KEY = "pingRegion4";

module.exports.DISCORD_ID = '560173821533880322';

module.exports.NO_CACHE = {
	"extraHeaders": "pragma: no-cache\n"
};

String.prototype.isCode = function() {
	return module.exports.GAME_CODE_REGEX.test(this + '');
};

String.prototype.isGame = function() {
	return module.exports.GAME_REGEX.test(this + '');
};

String.prototype.isEditor = function() {
	return module.exports.EDITOR_REGEX.test(this + '');
};

String.prototype.isViewer = function() {
	return module.exports.VIEWER_REGEX.test(this + '');
};

String.prototype.isSocial = function() {
	return module.exports.SOCIAL_REGEX.test(this + '');
};

String.prototype.isKrunker = function() {
	return module.exports.SITE_REGEX.test(this + '');
};

module.exports.joinPath = function(foo, bar) {
	return path.join(foo, bar);
}

module.exports.hexToRGB = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
		(m, r, g, b) => '#' + r + r + g + g + b + b)
	.substring(1).match(/.{2}/g)
	.map(x => parseInt(x, 16));

module.exports.autoUpdateTypes = {
	download: "Download",
	check: "Check",
	skip: "Skip"
}
	
module.exports.audioFileNames = ["aim_0.mp3", "aim_1.mp3", "ambient_1.mp3", "ambient_2.mp3", "ambient_3.mp3", "ambient_4.mp3", "buy_1.mp3", "case_0.mp3", "case_1.mp3", "cheer_0.mp3", "explosion.mp3", "fart_0.mp3", "gclick_0.mp3", "headshot_0.mp3", "hit_0.mp3", "impact_0.mp3", "jump_0.mp3", "jump_1.mp3", "nuke_0.mp3", "pick_0.mp3", "reload_1.mp3", "reload_2.mp3", "reward.mp3", "rico_1.mp3", "rico_2.mp3", "siren_0.mp3", "slide_0.mp3", "spray.mp3", "step_0.mp3", "step_1.mp3", "step_2.mp3", "store.mp3", "swish_0.mp3", "swish_1.mp3", "taunt_0.mp3", "taunt_1.mp3", "taunt_2.mp3", "taunt_3.mp3", "tick_0.mp3", "weapon_1.mp3", "weapon_10.mp3", "weapon_11.mp3", "weapon_13.mp3", "weapon_15.mp3", "weapon_17.mp3", "weapon_1_0.mp3", "weapon_2.mp3", "weapon_3.mp3", "weapon_4.mp3", "weapon_5.mp3", "weapon_6.mp3", "weapon_7.mp3", "weapon_8.mp3", "weapon_9.mp3", "whizz_0.mp3", "whizz_1.mp3"]