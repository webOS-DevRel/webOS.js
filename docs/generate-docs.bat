@echo off

SET DOCS=%~DP0
for %%d in ("%DOCS%\..") do SET WEBOSJS=%%~fd\

REM Mainline

if not exist "%WEBOSJS%node_modules\jsdoc\jsdoc.js" (
	echo Installing prerequisite JSDoc...
	if not exist "%WEBOSJS%node_modules" mkdir "%WEBOSJS%node_modules"
	call npm install jsdoc --prefix "%WEBOSJS%node_modules"
	(echo.)
)

echo Generating webOS.js Documentation...

REM node "%WEBOSJS%node_modules\uglify-js\bin\uglifyjs"
REM if %errorlevel% EQU 0 echo Successfully built to %OUTPUT%
