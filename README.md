# Custom-Krunker-Client
An Open-Source, Customized Krunker Desktop Client.

Constantly updated.
We have a [Discord Server](https://discord.gg/XmcW7ny)!

## How it Works?
- Adds many features. You can suggest features you want in the Discord.
- This client doesn't show fake FPS unlike _MTZ ( shows fake FPS that multiplied by 1.2 )_ and _Official Krunker.io Client Lite 1.0.2 ( multiplies by 1.5 )_.
- Options that added by the custom client is highlighted in orange.
- Some of options has to restart the client or reload the page to apply.

### Current Features / What You Can Do
- Every single features from official client is available
- Slight performance improvements
- Add ability to change auto updater behavior from configs or `--update=<download|check|skip>` argument ( argument method overrides config )
- Auto updater support with GitHub - When there is a new custom client release, auto updater automatically installs it
- Adds compatibility with custom fonts to few social and market pages ( optional )
- Adds keyboard shortcut for toggle DevTools ( Alt + Command + I for Mac, Ctrl + Shift + I for other platforms)
- Adds a button that opens `appData` directory
- Adds a button that relaunch the client
- Adds transparency/opacity settings to some elements ( Crosshair, Nametag, Scope, etc. / optional )
- Ability to disable Resource Swapper ( optional )
- Ability to disable Discord RPC ( optional )
- Ability to dump network resources ( useful for making mods and customizations / may recude performance / optional / disable Resource Swapper if you want to dump all files since it prevents dumper from duming some files )
- Always enable debug mode ( optional )
- Better "Clear Cache" button ( fixed a bug & works faster )
- Customizable Game Overlay offsets
- Fixes splash screen font size
- Patches resource swapper to work with beta server
- Hide ads ( not actually blocking traffic for Free KR compatibility / optional )
- Makes splash screen background and font customizable
- Few minor tweaks for debugging

#### How to Install or Build
If you're a Windows user, download a installer from [latest release](https://github.com/Mixaz017/Custom-Krunker-Client/releases/latest). You have to just download an `exe` file. You don't have to download `.blockmap` or `latest.yml`, because those files are released only for auto update purpose.

Unfortunately I can't build Mac and Linux versions because I'm using Windows. However you can still use this client by following this guide:
- Requirements for both methods
	1. Install [Node.js](https://nodejs.org/en/download/).
	2. [Download ZIP](https://github.com/Mixaz017/Custom-Krunker-Client/archive/master.zip) and extract, or clone this repository. We call the extracted directory or the cloned repository "local repository".
	3. Open CLI ( Terminal ) from local repository and run `npm i`. This command should install all dependenciy modules.
- Build method ( recommended )  
	_This method will build a installer and lets you install the client._
	1. Open CLI and run `npm i electron-builder -g`. This command should install `electron-builder` module globaly.
	2. Run `electron-builder -c.win="" -c.mac="" -c.linux=""`. The installer will be created in `dist` directory.
	3. Install the client.
- No build method  
	_This method simply launches the client directly, without building. You have to do this method every time you want to launch the client._
	1. Open CLI and run `npx electron .`. This command should launch the client.
##### Gone Features
- Connects to the beta servers ( since `beta.krunker.io` is not hosted anymore )