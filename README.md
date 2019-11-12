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

#### Notes

##### How to Install or Build
If you're a Windows user, download a installer from [latest release](https://github.com/Mixaz017/Custom-Krunker-Client/releases/latest). You don't have to download `.blockmap` or `latest.yml`, because those files are released only for auto update purpose.  
If you're Mac or Linux user, get [electron-builder](https://www.electron.build/) (or other builder/packager), clone or ZIP download this repository, and build/package it for yourself. I can't build Mac and Linux versions from a Windows PC.

###### Gone Features
- Connects to the beta servers ( since `beta.krunker.io` is not hosted anymore )