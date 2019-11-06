# Custom-Krunker-Client
Customized Krunker Desktop Client.

## Current Features / What you can do
- Add ability to change auto updater behavior from configs or `--update=<download|check|skip>` argument ( argument method overrides config )
- Auto updater support with GitHub - When there is a new custom client release, auto updater automatically installs it
- Adds compatibility with custom fonts to few social and market pages ( optional )
- Adds keyboard shortcut for toggle DevTools
- Adds a button that opens `appData` directory
- Adds a button that relaunch the client
- Adds transparency/opacity settings to some elements ( Crosshair, Nametag, etc. / optional )
- Ability to disable Resource Swapper ( optional )
- Ability to disable Discord RPC ( optional )
- Ability to dump network resources ( useful for making mods and customizations / may recude performance / optional / disable Resource Swapper if you want to dump all files since it prevents dumper from duming some files )
- Always enable debug mode ( optional )
- Connects to the beta servers ( optional )
- Customizable Game Overlay offsets
- Fixes splash screen font size
- Patches resource swapper to work with beta server
- Hide ads ( not actually blocking traffic for Free KR compatibility / optional )
- Makes splash screen background and font customizable
- Few minor tweaks for debugging

### How?
If you're Windows user, download a installer from [latest release](https://github.com/Mixaz017/Custom-Krunker-Client/releases/latest). You don't have to download `.blockmap` or `latest.yml`, those files are released for auto update purpose.  
If you're Mac or Linux user, get [electron-builder](https://www.electron.build/) (or other builder/packager), clone or ZIP download this repository, and build/package it for yourself. I can't build Mac and Linux versions from a Windows PC.

#### Notes
- Options that added by the custom client is highlighted in yellow
- Some of options has to restart the client or reload the page to apply
- **Use this client at your own risk!** ( At least this client is safer than other dirty clients like [MTZ](https://discord.gg/tVF55ws) )
