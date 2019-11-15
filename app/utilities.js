const { remote } = require('electron');
const Store = require('electron-store');
const config = new Store();
const consts = require('./constants.js');
// const url = require('url');
// const rimraf = require('rimraf');
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
				name: "Fix CSS for Custom Fonts",
				pre: "<div class='setHed customUtility'>Patch</div>",	
				val: true,
				html: () => generateHTML("checkbox", "customFontsCSSFix", this)
			},
			preventAFK: {
				name: "Prevent AFK Kick",
				pre: "<div class='setHed customUtility'>General Tweak</div>",
				val: false,
				html: () => generateHTML("checkbox", "preventAFK", this),
				resources: {
					cancelIdle: () => idleTimer = -Infinity,
					intervalId: null
				},
				set: (value, init)=> {
					if (value) this.settings.preventAFK.resources.intervalId = setInterval(this.settings.preventAFK.resources.cancelIdle, 60000)
					else if (!init) clearInterval(this.settings.preventAFK.resources.intervalId)
				}
			},
			rememberSearch: {
				name: "Remember Server Search",
				val: false,
				html: () => generateHTML("checkbox", "rememberSearch", this),
				resources: {
					menuObserver: new MutationObserver(() => {
						if (document.getElementById("serverSearch")) {
							serverSearch.addEventListener("input", () => localStorage.setItem("moc_serverSearch", serverSearch.value))
							serverSearch.value = localStorage.getItem("moc_serverSearch")
							serverSearch.oninput()
							menuObserver.disconnect()
						}
					})
				},
				set: value => {
					if (value) {
						this.settings.rememberSearch.resources.menuObserver.observe(menuWindow, {
							childList: true
						})
					} else {
						this.settings.rememberSearch.resources.menuObserver.disconnect()
					}
				}
			},
			scopeOffsetX: {
				name: "Scope X Offset",
				pre: "<div class='setHed customUtility'>Interface Tweak</div>",
				val: "0%",
				html: () => generateHTML("text", "scopeOffsetX", this, "Scope X Offset CSS Value"),
				set: value => aimRecticle.style.transform = `translate(${value}, ${this.settings.scopeOffsetY.val})`
			},
			scopeOffsetY: {
				name: "Scope Y Offset",
				val: "0%",
				html: () => generateHTML("text", "scopeOffsetY", this, "Scope Y Offset CSS Value"),
				set: value => aimRecticle.style.transform = `translate(${this.settings.scopeOffsetX.val}, ${value})`
			},
			scopeOpacity: {
				name: "Scope Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "scopeOpacity", this),
				set: value => recticleImg.style.opacity = value
			},
			gameOverlayOffsetX: {
				name: "Game Overlay X Offset",
				val: "0%",
				html: () => generateHTML("text", "gameOverlayOffsetX", this, "Game Overlay X Offset CSS Value"),
				set: value => overlay.style.transform = `translate(${value}, ${this.settings.gameOverlayOffsetY.val})`
			},
			gameOverlayOffsetY: {
				name: "Game Overlay Y Offset",
				val: "0%",
				html: () => generateHTML("text", "gameOverlayOffsetY", this, "Game Overlay Y Offset CSS Value"),
				set: value => overlay.style.transform = `translate(${this.settings.gameOverlayOffsetX.val}, ${value})`
			},
			gameOverlayOpacity: {
				name: "Game Overlay Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "gameOverlayOpacity", this),
				set: value => overlay.style.opacity = value
			},
			damageOverlayOffsetX: {
				name: "Damage Overlay X Offset",
				val: "0%",
				html: () => generateHTML("text", "damageOverlayOffsetX", this, "Damage Overlay X Offset CSS Value"),
				set: value => bloodDisplay.style.transform = `translate(${value}, ${this.settings.damageOverlayOffsetY.val})`
			},
			damageOverlayOffsetY: {
				name: "Damage Overlay Y Offset",
				val: "0%",
				html: () => generateHTML("text", "damageOverlayOffsetY", this, "Damage Overlay Y Offset CSS Value"),
				set: value => bloodDisplay.style.transform = `translate(${this.settings.damageOverlayOffsetY.val}, ${value})`
			},
			scorePopupOpacity: {
				name: "Score Popup Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "scorePopupOpacity", this),
				set: value => chalDisplay.style.opacity = value
			},
			overlayOpacity: {
				name: "Crosshair, Nametag, etc. Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "overlayOpacity", this),
				set: value => window["game-overlay"].style.opacity = value
			},
			reloadMessageOpacity: {
				name: "Reload Message Opacity",
				val: 1,
				min: 0,
				max: 1,
				step: 0.01,
				html: () => generateHTML("slider", "reloadMessageOpacity", this),
				set: value => reloadMsg.style.opacity = value
			},
			healthDisplayType: {
				name: "Health Display Type",
				val: "both",
				html: () => generateHTML("select", "healthDisplayType", this, {
					both: "Both",
					bar: "Bar",
					value: "Value",
					none: "None"
				}),
				set: value => {
					healthValueHolder.style.display = ["both", "value"].includes(value) ? "inherit" : "none"
					healthBar.style.display = ["both", "bar"].includes(value) ? "inherit" : "none"
				}
			},
			hideAds: {
				name: "Hide Ads",
				val: true,
				html: () => generateHTML("checkbox", "hideAds", this),
				set: (value, init) => {
					if (value) document.head.appendChild(this.consts.css.hideAds)
					else if (!init) this.consts.css.hideAds.remove()
				}
			},
			hideClaim: {
				name: "Hide Free KR",
				val: false,
				html: () => generateHTML("checkbox", "hideClaim", this),
				set: value => claimHolder.style.display = value ? "none" : "inherit"
			},
			hideMerch: {
				name: "Hide Merch",
				val: false,
				html: () => generateHTML("checkbox", "hideMerch", this),
				set: value => merchHolder.style.display = value ? "none" : "inherit"
			},
			hideSocials: {
				name: "Hide Social Buttons",
				val: false,
				html: () => generateHTML("checkbox", "hideSocials", this),
				set: (value, init) => {
					if (value) document.head.appendChild(this.consts.css.hideSocials)
					else if (!init) this.consts.css.hideSocials.remove()
				}
			},
			hideStreams: {
				name: "Hide Streams",
				val: false,
				html: () => generateHTML("checkbox", "hideStreams", this),
				set: value => streamContainer.style.display = value ? "none" : "inherit"
			},
			customSplashBackground: {
				name: "Custom Splash Background",
				pre: "<div class='setHed customUtility'>Splash Screen</div>",
				val: "",
				html: () => generateHTML("url", "customSplashBackground", this, "Splash Screen Background Path/URL")
			},
			customSplashFont: {
				name: "Custom Splash Font",
				val: "",
				html: () => generateHTML("url", "customSplashFont", this, "Splash Screen Font Path/URL")
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
				html: () => generateHTML("checkbox", "disableResourceSwapper", this)
			},
			disableDiscordRPC: {
				name: "Disable Discord RPC",
				val: false,
				html: () => generateHTML("checkbox", "disableDiscordRPC", this)
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
				pre: "<div class='setHed customUtility'>Network</div>",
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
				html: () => generateHTML("checkbox", "debugMode", this)
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

		window.remote = remote
		window.path = require("path")
		window.timeouts = {}
		window.delayExecuteClient = function (name, object, delay = 600) {
            return clearTimeout(timeouts[name]), timeouts[name] = setTimeout(function () {
                window.utilities.setSetting(name, object['value']);
            }, delay), true;
        };
	}
}

module.exports = Utilities;
