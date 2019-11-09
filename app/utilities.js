const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');
const config = new Store();
const consts = require('./constants.js');
const url = require('url');
const rimraf = require('rimraf');
const fs = require("fs")

// const CACHE_PATH = consts.joinPath(remote.app.getPath('appData'), remote.app.name, "Cache");

class Utilities {
	constructor() {
		this.consts = {};
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
				pre: "<div class='setHed customUtility'>Patch</div>",	
				val: true,
				html: () => generateHTML("checkbox", "customFontsCSSFix", this)
			},
			hideAds: {
				name: "Hide Ads",
				pre: "<div class='setHed customUtility'>Interface Tweak</div>",
				val: true,
				html: () => generateHTML("checkbox", "hideAds", this),
				set: () => {
					if (this.settings.hideAds.val) document.head.appendChild(this.consts.css.hideAds)
					else {
						if (this.consts.css.hideAds.parentElement) this.consts.css.hideAds.remove()
					}
				}
			},
			scopeOffsetX: {
				name: "Scope X Offset",
				val: "0%",
				html: () => generateHTML("text", "scopeOffsetX", this, "Scope X Offset CSS Value"),
				set: () => document.getElementById("aimRecticle").style.transform = `translate(${this.settings.scopeOffsetX.val}, ${this.settings.scopeOffsetY.val})`
			},
			scopeOffsetY: {
				name: "Scope Y Offset",
				val: "0%",
				html: () => generateHTML("text", "scopeOffsetY", this, "Scope Y Offset CSS Value"),
				set: () => document.getElementById("aimRecticle").style.transform = `translate(${this.settings.scopeOffsetX.val}, ${this.settings.scopeOffsetY.val})`
			},
			scopeOpacity: {
				name: "Scope Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "scopeOpacity", this),
				set: () => document.getElementById("recticleImg").style.opacity = this.settings.scopeOpacity.val
			},
			gameOverlayOffsetX: {
				name: "Game Overlay X Offset",
				val: "0%",
				html: () => generateHTML("text", "gameOverlayOffsetX", this, "Game Overlay X Offset CSS Value"),
				set: () => document.getElementById("overlay").style.transform = `translate(${this.settings.gameOverlayOffsetX.val}, ${this.settings.gameOverlayOffsetY.val})`
			},
			gameOverlayOffsetY: {
				name: "Game Overlay Y Offset",
				val: "0%",
				html: () => generateHTML("text", "gameOverlayOffsetY", this, "Game Overlay Y Offset CSS Value"),
				set: () => document.getElementById("overlay").style.transform = `translate(${this.settings.gameOverlayOffsetX.val}, ${this.settings.gameOverlayOffsetY.val})`
			},
			gameOverlayOpacity: {
				name: "Game Overlay Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "gameOverlayOpacity", this),
				set: () => document.getElementById("overlay").style.opacity = this.settings.gameOverlayOpacity.val
			},
			overlayOpacity: {
				name: "Crosshair, Nametag, etc. Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "overlayOpacity", this),
				set: () => document.getElementById("game-overlay").style.opacity = this.settings.overlayOpacity.val
			},
			customSplashBackground: {
				name: "Custom Splash Background",
				pre: "<div class='setHed customUtility'>Splash Screen</div>",
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
				pre: "<div class='setHed customUtility'>Client Tweak</div>",
				val: "download",
				html: () => generateHTML("select", "autoUpdateType", this, consts.autoUpdateTypes)
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
			// Disabled This feature since beta server is down
			// betaServer: {
			// 	name: "Beta Server",
			// 	pre: "<div class='setHed customUtility'>Network</div>",
			// 	val: false,
			// 	html: () => `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("betaServer", this.checked)' ${this.settings.betaServer.val ? "checked" : ""}><span class='slider'></span></label>`
			// },
			dumpResources: {
				name: "Dump Resources",
				val: false,
				html: () => generateHTML("checkbox", "dumpResources", this)
			},
			dumpPath: {
				name: "Dump Path",
				val: consts.joinPath(remote.app.getPath("documents"), "KrunkerResourceDump"),
				html: () => "<a onclick='window.utilities.openDumpPath()' class='inputGrey2 menuLink'>Open</a>" + generateHTML("url", "dumpPath", this, "Resource Dump Output Path")
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
		function generateHTML(type, name, object, extra) {
            if ('checkbox' == type) return '<label class="switch"><input type="checkbox" onclick="window.utilities.setSetting(\x27' + name + '\x27, this.checked)"\n' + (object.settings[name]['val'] ? 'checked' : '') + '><span class="slider"></span></label>';
            if ('slider' == type) return '<input type="number" class="sliderVal" id="slid_input_utilities_' + name + '"\nmin="' + object.settings[name]['min'] + '" max="' + object.settings[name]['max'] + '" value="' + object.settings[name]['val'] + '" onkeypress="window.delayExecuteClient(\x27' + name + '\x27, this)" style="border-width:0px"/>\n<div class="slidecontainer">\n<input type="range" id="slid_utilities_' + name + '" min="' + object.settings[name]['min'] + '" max="' + object.settings[name]['max'] + '" step="' + object.settings[name]['step'] + '"\nvalue="' + object.settings[name]['val'] + '" class="sliderM" oninput="window.utilities.setSetting(\x27' + name + '\x27, this.value)"></div>';
            if ('select' == type) {
                let temp = '<select onchange="window.utilities.setSetting(\x27' + name + '\x27, this.value)" class="inputGrey2">';
                for (let option in extra) temp += '<option value="' + option + '" ' + (option == object.settings[name]['val'] ? 'selected' : '') + '>' + extra[option] + '</option>';
                return temp += '</select>';
            }
            return '<input type="' + type + '" name="' + type + '" id="slid_utilities_' + name + '"\n' + ('color' == type ? 'style="float:right;margin-top:5px"' : 'class="inputGrey2" placeholder="' + extra + '"') + '\nvalue="' + object.settings[name]['val'] + '" oninput="window.utilities.setSetting(\x27' + name + '\x27, this.value)"/>';
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
			// rimraf(CACHE_PATH, () => {
			// 	alert("Cache cleared");
			// 	remote.app.relaunch();
			// 	remote.app.exit();
			// })

			// Clear cache fix
			remote.getCurrentWindow().webContents.session.clearCache().then(() => {
				alert("Cache cleared");
				remote.app.relaunch();
				remote.app.exit();
			})
		}
	}

	// Newer function
	setSetting(t, e) {
		this.settings[t].val = e;
		config.set(`utilities_${t}`, e);
		if (document.getElementById(`slid_utilities_${t}`)) document.getElementById(`slid_utilities_${t}`).value = e;
		if (document.getElementById(`slid_input_utilities_${t}`)) document.getElementById(`slid_input_utilities_${t}`).value = e;

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

	openDumpPath() {
		if (!fs.existsSync(this.settings.dumpPath.val)) fs.mkdirSync(this.settings.dumpPath.val, { recursive: true })
		remote.shell.openItem(this.settings.dumpPath.val)
	}

	initConsts() {
		// CSS stuff used by utilities
		function generateStyle (text) {
			let newElement = document.createElement("style")
			newElement.innerHTML = text
			return newElement
		}

		Object.entries(consts.css).forEach(entry => consts.css[entry[0]] = generateStyle(entry[1]))
		this.consts.css = consts.css
	}

	onLoad() {
		this.initConsts()
		this.fixMenuSettings();
		this.createWatermark();
		this.createSettings();
		window.addEventListener("keydown", event => this.keyDown(event));

		window.timeouts = {}
		window.delayExecuteClient = function (name, object, delay = 600) {
            return clearTimeout(timeouts[name]), timeouts[name] = setTimeout(function () {
                window.utilities.setSetting(name, object['value']);
            }, delay), true;
        };
	}
}

module.exports = Utilities;
