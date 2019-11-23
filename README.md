# Custom-Krunker-Client
An Open-Source, Customized Krunker Desktop Client.  
We have a [Discord Server](https://discord.gg/XmcW7ny) and providing some supports!

## Status
I purely enjoy working on this project, but this project is not my job and developments can be unstable.
As of now, this client is based on the official client, and main focus is to bring bugfixes, tweaks, and more customizability to the client.

I'm accepting bug reports, suggestions and feedbacks in our Discord.

## How it Works and Why this Client?
- This client is meant to be a superior of the official client.
- Many extra features available. You can suggest features you want in the Discord to improve the client as well.
- This client doesn't show fake FPS unlike _MTZ ( shows fake FPS that multiplied by 1.2 )_ and _Official Krunker.io Client Lite 1.0.2 ( multiplies by 1.5 )_.

## Current Features
- Every single features from official client is available ( Resource Swapper, Unlimited FPS, etc. )
- May improves load time, and better memory managing 
---
- Patches
	- Adds compatibility with custom fonts to few social and market pages ( optional )
	- Fixes "Clear Cache" button ( also works faster )
	- Fixes a bug with the Discord RPC
	- Fixes splash screen font size
- General Tweaks
	- Prevents AFK kick ( optional )
	- Remembers server search ( optional )
	- Seek for new server by pressing F6 key
- Interface Tweaks
	- Adds a button that refresh the server browser
	- Ability to hide various elements ( ads ( you can still claim Free KR ), merch, etc. )
	- Ability to use custom CSS file
	- Customizable health display type
	- Customizable offsets for various elements ( scope, game overlay, etc. )
	- Customizable opacity for various elements ( scope, crosshair, etc. )
	- Remove text shadows ( optional, useful for custom fonts )
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
---
- Options that added by the custom client is highlighted in orange.
- Some of options has to restart the client or reload the page to apply.

### Known Issues
- Updating the client will remove the pinned icon from taskbar. This also happens with the official client. This is a [known issue](https://github.com/electron-userland/electron-builder/issues/2514) of `electron-builder` and I don't have a fix for it, sorry.

## Running the Client

### Releases
There are binary releases available. You can download the [latest release](https://github.com/Mixaz017/Custom-Krunker-Client/releases/latest) and start playing quickly.
- `Custom-Krunker-Client-Setup-<version>.exe` - Windows 32 & 64-bit installer
- `Custom-Krunker-Client-<version>.AppImage` - Linux 64-bit portable executable
- `Custom-Krunker-Client-<version>-i386.AppImage` - Linux 32-bit portable executable
- `Custom-Krunker-Client-<version>.exe` - Windows 32 & 64-bit portable executable

You don't have to download `.blockmap` or `.yml` files, because those files are released only for auto update purpose.

### Building
If your system doesn't support those released files, you can still run the client by following the guide below: 
- Requirements for both methods
	1. Install [Node.js](https://nodejs.org/en/download/). Versions above 9.0.0 should works fine. If you using `apt` to install Node.js, please note that apt may not work because apt provides very old version of Node.js. You can use [nvm](https://github.com/nvm-sh/nvm) to easily manage Node.js versions so it is highly recommended.
	2. [Download ZIP](https://github.com/Mixaz017/Custom-Krunker-Client/archive/master.zip) and extract, or clone this repository. We call the extracted directory or the cloned repository "local repository".
	3. Open CLI ( Command Prompt, Terminal, etc. ) from local repository and run `npm i`. This command should install all dependency modules.
- Build method ( recommended )  
	This method will build a executable file.
	1. Open CLI and run `npm i electron-builder -g`. This command should install `electron-builder` module globally.
	2. Run `electron-builder -c.win="" -c.mac="" -c.linux=""`. The executable file will be created in `dist` directory.
	3. Run the executable file in `dist` directory.
- No build method  
	This method simply launches the client directly, without building. You have to do this method every time you want to launch the client.
	1. Open CLI and run `npm start`. This command should launch the client.

#### Gone Features
- Network
	- Connects to the beta servers ( since `beta.krunker.io` is not hosted anymore )
- Client Tweaks
	- Patches resource swapper to work with beta server