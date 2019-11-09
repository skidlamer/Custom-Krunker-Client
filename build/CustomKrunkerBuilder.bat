@ECHO OFF
cd %userprofile%\Developments\Krunker\Custom-Krunker-Client
echo Custom Krunker Builder
set GH_TOKEN=399a8d6d54c8546edb8dcd75fef7e84b2840cdb6
echo Versions:
for /d %%a in (v*.*.*) do echo %%a
set /p ans="Version to build: "
set /p args="Arguments: "
choice /m "Publish?"
cd v%ans% & if %errorlevel% == 1 (npx electron-builder -c.directories.buildResources=../build -c.extraResources=../extraResources -c.productName="Custom Krunker.io Client" -p always --ia32 --x64 %args%) else (npx electron-builder -c.directories.buildResources=../build -c.extraResources=../extraResources -c.productName="Custom Krunker.io Client" %args%)
pause