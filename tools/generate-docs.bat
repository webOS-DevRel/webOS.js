@echo off

SET TOOLS=%~DP0
for %%d in ("%TOOLS%\..") do SET WEBOSJS=%%~fd\

REM Mainline

if not exist "%WEBOSJS%node_modules\jsdoc\jsdoc.js" (
	echo Installing prerequisite JSDoc...
	if not exist "%WEBOSJS%node_modules" mkdir "%WEBOSJS%node_modules"
	call npm install jsdoc --prefix "%WEBOSJS%node_modules"
	(echo.)
)

rmdir /S /Q "%WEBOSJS%docs"
mkdir "%WEBOSJS%docs"

echo Generating webOS.js Documentation...

node "%WEBOSJS%node_modules\jsdoc\jsdoc.js" "%WEBOSJS%src" -d "%WEBOSJS%docs"
if %errorlevel% EQU 0 echo Successfully built to %WEBOSJS%docs
