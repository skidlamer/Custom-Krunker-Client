const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');
const config = new Store();
const consts = require('./constants.js');
const url = require('url');
const rimraf = require('rimraf');

const CACHE_PATH = consts.joinPath(consts.joinPath(remote.app.getPath('appData'), remote.app.name), "Cache");

class Utilities {
	constructor() {
		this.settings = null;
		this.onLoad();
	}

	createSettings() {
		this.settings = {
			unlimitedFrames: {
				name: "Unlimited FPS",
				pre: "<div class='setHed'>Performance</div>",
				val: true,
				html: _ => {
					return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("unlimitedFrames", this.checked);
						alert("This setting requires a client restart to take effect.");'
                        ${this.settings.unlimitedFrames.val ? 'checked' : ''}><span class='slider'></span></label>`;
				},
				set: (_, init) => {
					if (!init) {
						alert("App will now restart");
						remote.app.relaunch();
						remote.app.quit();
					}
				}
			},
			d3d9Mode: {
				name: "Window Capture",
				pre: "<div class='setHed'>Streaming</div>",
				val: false,
				html: _ => {
					return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("d3d9Mode", this.checked)' ${this.settings.d3d9Mode.val ? "checked" : ""}><span class='slider'></span></label>`;
				},
				set: (_, init) => {
					if (!init) {
						alert("App will now restart for setting to take effect.");
						remote.app.relaunch();
						remote.app.quit();
					}
				}
			},
			customFontsCSSFix: {
				name: "Custom Fonts CSS Fix",
				pre: "<div class='setHed customUtility'>Patches</div>",	
				val: true,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("customFontsCSSFix", this.checked)' ${this.settings.customFontsCSSFix.val ? "checked" : ""}><span class='slider'></span></label>`
			},
			hideAds: {
				name: "Hide Ads",
				val: true,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("hideAds", this.checked)' ${this.settings.hideAds.val ? "checked" : ""}><span class='slider'></span></label>`
			},
			preloadAudio: {
				name: "Preload Audio Files",
				val: true,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("preloadAudio", this.checked)' ${this.settings.preloadAudio.val ? "checked" : ""}><span class='slider'></span></label>`
			},
			customSplashBackground: {
				name: "Custom Splash Background",
				pre: "<div class='setHed customUtility'>Even More Customization</div>",
				val: "",
				html: () => `<input type="url" name="url" class="inputGrey2" placeholder="Splash Screen Background Image Path/URL" value="${this.settings.customSplashBackground.val}" oninput="window.utilities.setSetting('customSplashBackground', this.value);">`
			},
			customSplashFont: {
				name: "Custom Splash Font",
				val: "",
				html: () => `<input type="url" name="url" class="inputGrey2" placeholder="Splash Screen Font Path/URL" value="${this.settings.customSplashFont.val}" oninput="window.utilities.setSetting('customSplashFont', this.value);">`
			},
			autoUpdateType: {
				name: "Auto Update Type",
				val: "download",
				html: () => generateSelectHTML("autoUpdateType", consts.autoUpdateTypes)
			},
			betaServer: {
				name: "Beta Server",
				val: false,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("betaServer", this.checked)' ${this.settings.betaServer.val ? "checked" : ""}><span class='slider'></span></label>`
			},
			disableResourceSwapper: {
				name: "Disable Resource Swapper",
				val: false,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("disableResourceSwapper", this.checked)' ${this.settings.disableResourceSwapper.val ? "checked" : ""}><span class='slider'></span></label>`
			},
			disableDiscordRPC: {
				name: "Disable Discord RPC",
				val: false,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("disableDiscordRPC", this.checked)' ${this.settings.disableDiscordRPC.val ? "checked" : ""}><span class='slider'></span></label>`
			},
			debugMode: {
				name: "Debug Mode",
				pre: "<div class='setHed customUtility'>Debugging</div>",
				val: false,
				html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("debugMode", this.checked)' ${this.settings.debugMode.val ? "checked" : ""}><span class='slider'></span></label>`
				}
			};
		const inject = _ => {
			window.windows[0].getCSettings = function() { // WILL ONLY WORK FOR 1.8.3+
				var tmpHTML = "";
				for (var key in window.utilities.settings) {
					if (window.utilities.settings[key].noShow) continue;
					if (window.utilities.settings[key].pre) tmpHTML += window.utilities.settings[key].pre;
					tmpHTML += "<div class='settName' id='" + key + "_div' style='display:" + (window.utilities.settings[key].hide ? 'none' : 'block') + "'>" + window.utilities.settings[key].name +
						" " + window.utilities.settings[key].html() + "</div>";
				}
				tmpHTML += `
	              <br>
	              <a onclick='window.utilities.clearCache()' class='menuLink'>Clear Cache</a>
	              |
				  <a onclick='window.utilities.resetSettings()' class='menuLink'>Reset Addons</a>
				  |
				  <a onclick='window.utilities.relaunchClient()' class='menuLink'>Relaunch Client</a>
				  |
				  <a onclick='remote.shell.openItem(path.join(remote.app.getPath("appData"), remote.app.getName()))' class='menuLink'>Open appData</a>
	           `;
				return tmpHTML;
			};
		}
		let generateSelectHTML = (key, options) => {
			var selectHTML = '<select\x20onchange=\x27window.utilities.setSetting(\x22' + key + '\x22,\x20this.value)\x27\x20class=\x27inputGrey2\x27>';
            for (let option in options)
        		selectHTML += '<option\x20value=\x27' + option + '\x27\x20' + (option == this.settings[key]['val'] ? 'selected' : '') + '>' + options[option] + '</option>';
        	return selectHTML += '</select>';
		}
		let waitForWindows = setInterval(_ => {
			if (window.windows) {
				inject();
				clearInterval(waitForWindows);
			}
		}, 100);
		this.setupSettings();
	}

	setupSettings() {
		for (const key in this.settings) {
			if (!this.settings[key].disabled) {
				var tmpVal = config.get(`utilities_${key}`, null);
				this.settings[key].val = tmpVal !== null ? tmpVal : this.settings[key].val;
				if (this.settings[key].val == "false") this.settings[key].val = false;
				if (this.settings[key].set) this.settings[key].set(this.settings[key].val, true);
			}
		}
	}

	createWatermark() {
		const el = document.createElement("div");
		el.id = "watermark";
		el.style.position = "absolute";
		el.style.color = "rgba(0,0,0, 0.3)";
		el.style.bottom = "0";
		el.style.left = "20px";
		el.style.fontSize = "6pt";
		el.innerHTML = "Custom Krunker.io Client v" + remote.app.getVersion();
		gameUI.appendChild(el);
	}

	resetSettings() {
		if (confirm("Are you sure you want to reset all your client addons? This will also refresh the page")) {
			Object.keys(config.store).filter(x => x.includes("utilities_")).forEach(x => config.delete(x));
			location.reload();
		}
	}

	clearCache() {
		if (confirm("Are you sure you want to clear your cache? This will also refresh the page")) {
			rimraf(CACHE_PATH, () => {
				alert("Cache cleared");
				remote.app.relaunch();
				remote.app.exit();
			})
		}
	}

	setSetting(t, e) {
		this.settings[t].val = e;
		config.set(`utilities_${t}`, e);
		if (document.getElementById(`slid_utilities_${t}`)) document.getElementById(`slid_utilities_${t}`).innerHTML = e;
		if (this.settings[t].set) this.settings[t].set(e);
	}

	keyDown(event) {
		if (document.activeElement.tagName == "INPUT") return;
		switch (event.key) {
		case '`':
			if (event.ctrlKey || event.shiftKey) return;
			document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
			document.exitPointerLock();
			window.showWindow(window.windows.length);
			break;
		}
	}

	fixMenuSettings() {
		[...document.querySelectorAll(".menuItemIcon")].forEach(el => el.style.height = "60px");
	}

	relaunchClient(options = {}) {
		remote.app.relaunch(options)
		remote.app.exit(0)
	}
	
	onLoad() {
		this.fixMenuSettings();
		this.createWatermark();
		this.createSettings();
		window.addEventListener("keydown", event => this.keyDown(event));
	}
}

module.exports = Utilities;
