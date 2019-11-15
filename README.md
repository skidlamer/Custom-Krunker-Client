# Custom-Krunker-Client
An Open-Source, Customized Krunker Desktop Client.  
Constantly updated.  
We have a [Discord Server](https://discord.gg/XmcW7ny) and providing some supports!

## How it Works?
- Adds many features. You can suggest features you want in the Discord.
- This client doesn't show fake FPS unlike _MTZ ( shows fake FPS that multiplied by 1.2 )_ and _Official Krunker.io Client Lite 1.0.2 ( multiplies by 1.5 )_.
- Options that added by the custom client is highlighted in orange.
- Some of options has to restart the client or reload the page to apply.

### Current Features / What You Can Do
- Every single features from official client is available ( Resource Swapper, Unlimited FPS, etc. )
- May improves load time, and better memory managing 
---
- Patches
	- Adds compatibility with custom fonts to few social and market pages ( optional )
	- Fixes "Clear Cache" button ( also works faster )
	- Fixes a bug with Discord RPC
	- Fixes splash screen font size
- General Tweaks
	- Prevents AFK kick ( optional )
	- Remembers server search ( optional )
- Interface Tweaks
	- Adds a button that reflesh the server browser
	- Ability to hide various elements ( ads ( you can still claim Free KR ), merch, etc. )
	- Customizable health display type
	- Customizable offsets for various elements ( scope, game overlay, etc. )
	- Customizable opacity for various elements ( scope, crosshair, etc. )
- Splash Screen
	- Customizable background and fonts for splash screen
- Client Tweaks
	- Ability to change auto updater behavior from settings or `--update=<download|check|skip>` argument ( argument method temporary overrides config )
	- Ability to disable Discord RPC ( optional )
	- Ability to disable Resource Swapper ( optional )
	- Adds a button that opens `appData` directory
	- Adds a button that relaunch the client
	- Auto updater support with GitHub - When there is a new custom client release, auto updater automatically installs it
- Network
	- Ability to dump network resources ( useful for making mods and customizations / may reduce performance / optional / disable Resource Swapper if you want to dump all files since it prevents dumper from duming some files )
- Debugging
	- Adds keyboard shortcut for toggle DevTools ( Alt + Command + I for Mac, Ctrl + Shift + I for other platforms)
	- Ability to always enable debug mode ( optional )
	- Few minor tweaks for debugging

### Known Issues
- Updating the client will remove the pinned icon from taskbar. This also happens with the official client. This is a [known issue](https://github.com/electron-userland/electron-builder/issues/2514) of `electron-builder` and I don't have a fix for it.

#### How to Install or Build
If you're a Windows user, download a installer from [latest release](https://github.com/Mixaz017/Custom-Krunker-Client/releases/latest).
- `Custom-Krunker-Client-<version>-i386.AppImage` - Linux 32-bit installer
- `Custom-Krunker-Client-<version>.AppImage` - Linux 64-bit installer
- `Custom-Krunker-Client-<version>.exe` - Windows 32 & 64-bit portable executable
- `Custom-Krunker-Client-Setup-<version>.exe` - Windows 32 & 64-bit installer ( recommended )

You don't have to download `.blockmap` or `.yml` files, because those files are released only for auto update purpose.

If your system doesn't support those files, you can still get the client by following the guide below: 
- Requirements for both methods
	1. Install [Node.js](https://nodejs.org/en/download/). Versions above 9.0.0 should works fine. If you using `apt` to install Node.js, please note that apt may not work because apt provides very old version of Node.js. You can use [nvm](https://github.com/nvm-sh/nvm) to easily manage Node.js versions so it is highly recommended.
	2. [Download ZIP](https://github.com/Mixaz017/Custom-Krunker-Client/archive/master.zip) and extract, or clone this repository. We call the extracted directory or the cloned repository "local repository".
	3. Open CLI ( Terminal ) from local repository and run `npm i`. This command should install all dependenciy modules.
- Build method ( recommended )  
	This method will build a installer and lets you install the client.
	1. Open CLI and run `npm i electron-builder -g`. This command should install `electron-builder` module globally.
	2. Run `electron-builder -c.win="" -c.mac="" -c.linux=""`. The installer will be created in `dist` directory.
	3. Install the client.
- No build method  
	This method simply launches the client directly, without building. You have to do this method every time you want to launch the client.
	1. Open CLI and run `npm start`. This command should launch the client.

##### Gone Features
- Network
	- Connects to the beta servers ( since `beta.krunker.io` is not hosted anymore )
- Client Tweaks
	- Patches resource swapper to work with beta server