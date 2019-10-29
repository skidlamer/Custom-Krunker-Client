# Custom-Krunker-Client
Customized Krunker Desktop Client.

## Current Features
- Add ability to change auto updater behavior from configs or `--update=<download|check|skip>` argument ( argument method overrides config )
- Auto updater support with GitHub - When there is a new custom client release, auto updater automatically installs it
- Add compatibility with custom fonts to few social and market pages ( optional )
- Add keyboard shortcut for toggle DevTools
- Add an button that opens `appData` directory
- Add an button that relaunch the client
- Add an option that always enables debug mode
- Fix "Reset Addons" button behavior
- Fix splash screen font size
- Hide ads ( not actually blocking traffic for Free KR compatibility / optional )
- Make splash screen background and font customizable
- Preload audio files to fix audio lag issue ( optional )
- Few minor tweaks for debugging

### How?
If you're Windows user, download a installer from [latest release](https://github.com/Mixaz017/Custom-Krunker-Client/releases/latest). You don't have to download `.blockmap` or `latest.yml`, those files are released for auto update purpose.  
If you're Mac or Linux user, get [electron-builder](https://www.electron.build/) (or other builder/packager), clone or ZIP download this repository, and build/package it for yourself. I can't build Mac and Linux versions from a Windows PC.

#### Tips
- Options that added by the custom client is highlighted in yellow
- Some of options requires restart the client or reload the page to apply
