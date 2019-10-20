require('v8-compile-cache');
const { BrowserWindow, app, shell, Menu, ipcMain } = require('electron');
const shortcut = require('electron-localshortcut');
const consts = require('./constants.js');
const url = require('url');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const config = new Store();
const log = require('electron-log');
const fs = require('fs');
const DiscordRPC = require('discord-rpc');

let rpc = null;
let gameWindow = null,
	editorWindow = null,
	socialWindow = null,
	viewerWindow = null,
	splashWindow = null,
	promptWindow = null,
	current = 0;

const initLogging = () => {
	log.debug("-------------------- Client Start --------------------");

	console.log = log.info;
	console.info = log.info;
	console.warn = log.warn;
	console.error = log.error;
	console.debug = log.debug;

	process.on('uncaughtException', (error) => {
		if (error) console.error(error);
	});
};
initLogging();

const initSwitches = () => {
	if (config.get('utilities_unlimitedFrames', true)) {
		if (consts.isAMDCPU) {
			app.commandLine.appendSwitch('disable-zero-copy');
			app.commandLine.appendSwitch('ui-disable-partial-swap');
		}
		app.commandLine.appendSwitch('disable-frame-rate-limit');
	}
	app.commandLine.appendSwitch('disk-cache-size',1);
	app.commandLine.appendSwitch('media-cache-size',1);
	app.commandLine.appendSwitch("disable-http-cache");
	app.commandLine.appendSwitch('ignore-gpu-blacklist', true);
	if (config.get('utilities_d3d9Mode', false)) {
		app.commandLine.appendSwitch('use-angle', 'd3d9');
		app.commandLine.appendSwitch('enable-webgl2-compute-context');
		// app.commandLine.appendSwitch('use-cmd-decoder=passthrough');
		app.commandLine.appendSwitch('renderer-process-limit', 100);
		app.commandLine.appendSwitch('max-active-webgl-contexts', 100);
	}

};
initSwitches();

const initAppMenu = () => {
	if (process.platform == 'darwin') {
		const template = [{
			label: "Application",
			submenu: [
				{ label: "About Application", selector: "orderFrontStandardAboutPanel:" },
				{ type: "separator" },
				{ label: "Quit", accelerator: "Command+Q", click: _ => app.quit() }
			]
		}, {
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
				{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
			]
		}];
		Menu.setApplicationMenu(Menu.buildFromTemplate(template));
	}
};
initAppMenu();

const initDiscordRPC = () => {
	DiscordRPC.register(consts.DISCORD_ID);
	rpc = new DiscordRPC.Client({ transport: 'ipc' });
	rpc.isConnected = false;

	rpc.on('error', console.error);

	rpc.login({ 'clientId': consts.DISCORD_ID })
		.then(() => {
			rpc.isConnected = true;
			rpc.setActivity2 = function(win, obj) {
				if (current == win) rpc.setActivity(obj);
			};
			rpc.on('RPC_MESSAGE_RECEIVED', (event) => {
				console.log('RPC_MESSAGE_RECEIVED', event); //Disabled by default
				if (!gameWindow) return;
				gameWindow.webContents.send('log', ['RPC_MESSAGE_RECEIVED', event]);
			});
			rpc.subscribe('ACTIVITY_JOIN', ({ secret }) => {
				if (!gameWindow) return;
				let parse = secret.split('|');
				if (parse[2].isCode()) {
					gameWindow.loadURL('https://' + parse[0] + '/?game=' + parse[2], consts.NO_CACHE);
				}
			});
			rpc.subscribe('ACTIVITY_INVITE', (event) => {
				if (!gameWindow) return;
				gameWindow.webContents.send('ACTIVITY_INVITE', event);
			});

			rpc.subscribe('ACTIVITY_JOIN_REQUEST', (user) => {
				if (!gameWindow) return;
				gameWindow.webContents.send('ACTIVITY_JOIN_REQUEST', user);
			});
		})
		.catch(console.error);
};
initDiscordRPC();

const initGameWindow = () => {
	gameWindow = new BrowserWindow({
		width: 1600,
		height: 900,
		show: false,
		darkTheme: true,
		center: true,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: false,
			preload: consts.joinPath(__dirname, 'preload.js')
		}
	});
	gameWindow.setMenu(null);
	gameWindow.rpc = rpc;

	let swapFolder = consts.joinPath(app.getPath('documents'), '/KrunkerResourceSwapper');
	try {fs.mkdir(swapFolder, { recursive: true }, e => {});}catch(e){};
	let swap = { filter: { urls: [] }, files: {} };
	const allFilesSync = (dir, fileList = []) => {
		fs.readdirSync(dir).forEach(file => {
			const filePath = consts.joinPath(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				if (!(/\\(docs)$/.test(filePath)))
					allFilesSync(filePath);
			} else {
				if (!(/\.(html|js)/g.test(file))) {
					let krunk = '*://krunker.io' + filePath.replace(swapFolder, '').replace(/\\/g, '/') + '*';
					swap.filter.urls.push(krunk);
					swap.files[krunk.replace(/\*/g, '')] = url.format({
						pathname: filePath,
						protocol: 'file:',
						slashes: true
					});
				}
			}
		});
	};
	allFilesSync(swapFolder);
	if (swap.filter.urls.length) {
		gameWindow.webContents.session.webRequest.onBeforeRequest(swap.filter, (details, callback) => {
			callback({ cancel: false, redirectURL: swap.files[details.url.replace(/https|http|(\?.*)|(#.*)/gi, '')] || details.url });
		});
	}

	gameWindow.loadURL('https://krunker.io', consts.NO_CACHE);

	let nav = (e, url) => {
		e.preventDefault();
		if (url.isKrunker()) {
			if (url.isEditor()) {
				if (!editorWindow) initEditorWindow();
				else editorWindow.loadURL(url, consts.NO_CACHE);
			} else if (url.isSocial()) {
				if (!socialWindow) initSocialWindow(url);
				else socialWindow.loadURL(url, consts.NO_CACHE);
			} else if (url.isViewer()) {
				if (!viewerWindow) initViewerWindow(url);
				else viewerWindow.loadURL(url, consts.NO_CACHE);
			} else gameWindow.loadURL(url, consts.NO_CACHE);
		} else shell.openExternal(url);
	};

	gameWindow.webContents.on('new-window', nav);
	gameWindow.webContents.on('will-navigate', nav);

	gameWindow.once('ready-to-show', () => {
		if (consts.DEBUG) gameWindow.webContents.openDevTools({ mode: 'undocked' });
		if (config.get('fullscreen', false)) gameWindow.setFullScreen(true);
		splashWindow.destroy();
		gameWindow.show();
	});

	gameWindow.on('focus', () => {
		current = 0;
	});

	gameWindow.once('closed', () => {
		gameWindow = null;
	});

	initShortcuts();
};

const initEditorWindow = () => {
	let size = gameWindow.getSize()
	editorWindow = new BrowserWindow({
		width: size[0] * consts.windowResize.editor,
		height: size[1] * consts.windowResize.editor,
		show: false,
		darkTheme: true,
		center: true,
		parent: gameWindow,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: false,
			preload: consts.joinPath(__dirname, 'preload.js')
		}
	});

	editorWindow.setMenu(null);
	editorWindow.rpc = rpc;

	editorWindow.loadURL('https://krunker.io/editor.html', consts.NO_CACHE);

	let nav = (e, url) => {
		e.preventDefault();
		if (url.isKrunker() && !url.isEditor()) {
			gameWindow.loadURL(url, consts.NO_CACHE);
		}
	}

	editorWindow.webContents.on('new-window', nav);
	editorWindow.webContents.on('will-navigate', nav);

	editorWindow.once('ready-to-show', () => {
		if (consts.DEBUG) editorWindow.webContents.openDevTools({ mode: 'undocked' });
		editorWindow.show();
	});

	editorWindow.on('focus', () => {
		current = 1;
	});

	editorWindow.once('closed', () => {
		editorWindow = null;
	});
};

const initSocialWindow = (url) => {
	let size = gameWindow.getSize()
	socialWindow = new BrowserWindow({
		width: size[0] * consts.windowResize.social,
		height: size[1] * consts.windowResize.social,
		show: false,
		darkTheme: true,
		center: true,
		parent: gameWindow,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: false,
			preload: consts.joinPath(__dirname, 'preload.js')
		}
	});

	socialWindow.setMenu(null);
	socialWindow.rpc = rpc;

	socialWindow.loadURL(url, consts.NO_CACHE);

	let nav = (e, url) => {
		e.preventDefault();
		if (url.isKrunker()) {
			if (url.isEditor()) {
				if (!editorWindow) initEditorWindow();
				else editorWindow.loadURL(url, consts.NO_CACHE);
			} else if (url.isSocial()) {
				socialWindow.loadURL(url, consts.NO_CACHE);
			} else if (url.isViewer()) {
				if (!viewerWindow) initViewerWindow(url);
				else viewerWindow.loadURL(url, consts.NO_CACHE);
			} else gameWindow.loadURL(url, consts.NO_CACHE);
		}
	}

	socialWindow.webContents.on('new-window', nav);
	socialWindow.webContents.on('will-navigate', nav);

	socialWindow.once('ready-to-show', () => {
		if (consts.DEBUG) socialWindow.webContents.openDevTools({ mode: 'undocked' });
		socialWindow.show();
	});

	socialWindow.on('focus', () => {
		current = 2;
	});

	socialWindow.once('closed', () => {
		socialWindow = null;
	});
};

const initViewerWindow = (url) => {
	let size = gameWindow.getSize()
	viewerWindow = new BrowserWindow({
		width: size[0] * consts.windowResize.viewer,
		height: size[1] * consts.windowResize.viewer,
		show: false,
		darkTheme: true,
		center: true,
		parent: gameWindow,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: false,
			preload: consts.joinPath(__dirname, 'preload.js')
		}
	});

	viewerWindow.setMenu(null);
	viewerWindow.rpc = rpc;

	viewerWindow.loadURL(url, consts.NO_CACHE);

	let nav = (e, url) => {
		e.preventDefault();
		if (url.isKrunker()) {
			if (url.isEditor()) {
				if (!editorWindow) initEditorWindow();
				else editorWindow.loadURL(url, consts.NO_CACHE);
			} else if (url.isSocial()) {
				if (!socialWindow) initSocialWindow(url);
				else socialWindow.loadURL(url, consts.NO_CACHE);
			} else if (url.isViewer()) {
				viewerWindow.loadURL(url, consts.NO_CACHE);
			} else gameWindow.loadURL(url, consts.NO_CACHE);
		}
	}

	viewerWindow.webContents.on('new-window', nav);
	viewerWindow.webContents.on('will-navigate', nav);

	viewerWindow.once('ready-to-show', () => {
		if (consts.DEBUG) viewerWindow.webContents.openDevTools({ mode: 'undocked' });
		viewerWindow.show();
	});

	viewerWindow.on('focus', () => {
		current = 3;
	});

	viewerWindow.once('closed', () => {
		viewerWindow = null;
	});
};

const initSplashWindow = () => {
	splashWindow = new BrowserWindow({
		width: 650,
		height: 370,
		transparent: true,
		frame: false,
		// skipTaskbar: true, // Enabled by default
		center: true,
		webPreferences: {
			nodeIntegration: true
		}
	});
	splashWindow.setMenu(null);
	splashWindow.setResizable(false);
	//splashWindow.setAlwaysOnTop(true, "floating", 1);
	splashWindow.loadURL(url.format({
		pathname: consts.joinPath(__dirname, 'splash.html'),
		protocol: 'file:',
		slashes: true
	}));
	splashWindow.webContents.once('did-finish-load', () => initUpdater());
	if (consts.DEBUG) splashWindow.webContents.openDevTools({ mode: 'undocked' }); // Disabled by default
};

const initPromptWindow = () => {
	let response;

	ipcMain.on('prompt', (event, opt) => {
		response = null;

		promptWindow = new BrowserWindow({
			width: 300,
			height: 157,
			show: false,
			frame: false,
			skipTaskbar: true,
			alwaysOnTop: true,
			resizable: false,
			movable: false,
			darkTheme: true,
			center: true,
			webPreferences: {
				nodeIntegration: true
			}
		});

		promptWindow.loadURL(url.format({
			pathname: consts.joinPath(__dirname, 'prompt.html'),
			protocol: 'file:',
			slashes: true
		}));
		if (consts.DEBUG) promptWindow.webContents.openDevTools({ mode: 'undocked' });

		promptWindow.webContents.on('did-finish-load', () => {
			promptWindow.show();
			promptWindow.webContents.send('text', JSON.stringify(opt));
		});

		promptWindow.on('closed', () => {
			event.returnValue = response;
			promptWindow = null;
		})

	});
	ipcMain.on('prompt-response', (event, args) => {
		response = args === '' ? null : args;
	});
};
initPromptWindow();

const initUpdater = () => {
	if (consts.DEBUG || process.platform == 'darwin' || process.argv.includes("--skip-update") || config.get("utilities_autoUpdateType") == "skip") return initGameWindow();
	autoUpdater.on('checking-for-update', (info) => splashWindow.webContents.send('checking-for-update'));

	autoUpdater.on('error', (err) => {
		splashWindow.webContents.send('update-error', err);
		setTimeout(() => initGameWindow(), 1000);
		//app.quit();
	});

	autoUpdater.on('download-progress', (info) => splashWindow.webContents.send('download-progress', info));

	autoUpdater.on('update-available', (info) => {
		splashWindow.webContents.send('update-available', info);
		setTimeout(() => initGameWindow(), 1000);
	})

	autoUpdater.on('update-not-available', (info) => {
		splashWindow.webContents.send('update-not-available', info);
		setTimeout(() => initGameWindow(), 1000);
	});

	autoUpdater.on('update-downloaded', (info) => {
		splashWindow.webContents.send('update-downloaded', info);
		setTimeout(() => autoUpdater.quitAndInstall(), 2500);
	});
	autoUpdater.channel = "latest";
	autoUpdater.autoDownload = config.get("utilities_autoUpdateType") == "download"
	autoUpdater.checkForUpdates();
}

const initShortcuts = () => {
	const KEY_BINDS = {
		escape: {
			key: 'Esc',
			press: _ => gameWindow.webContents.send('esc')
		},
		quit: {
			key: 'Alt+F4',
			press: _ => app.quit()
		},
		refresh: {
			key: 'F5',
			press: _ => gameWindow.webContents.reloadIgnoringCache()
		},
		fullscreen: {
			key: 'F11',
			press: _ => {
				let full = !gameWindow.isFullScreen();
				gameWindow.setFullScreen(full);
				config.set("fullscreen", full);
			}
		},
		clearConfig: {
			key: 'Ctrl+F1',
			press: _ => {
				config.store = {};
				app.relaunch();
				app.quit();
			}
		},
		openConfig: {
			key: 'Shift+F1',
			press: _ => config.openInEditor(),
		},
		toggleDevTools: {
			key: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			press: () => gameWindow.toggleDevTools()
		}
	}
	Object.keys(KEY_BINDS).forEach(k => {
		shortcut.register(gameWindow, KEY_BINDS[k].key, () => KEY_BINDS[k].press());
	});
}

app.once('ready', () => initSplashWindow());
app.on('activate', () => {
	if (gameWindow === null && (splashWindow === null || splashWindow.isDestroyed())) initSplashWindow();
});
app.once('before-quit', () => {
	rpc.destroy().catch(console.error);
	shortcut.unregisterAll();
	gameWindow.close();
});
app.once('window-all-closed', () => app.quit());
