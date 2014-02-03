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

if not exist "%WEBOSJS%tools\util\docs-template\publish.js" (
	xcopy "%WEBOSJS%node_modules\jsdoc\templates\default\*" "%WEBOSJS%tools\util\docs-template\" /q /s /e /y > nul
	copy "%WEBOSJS%tools\util\docs-template\custom-publish.js" "%WEBOSJS%tools\util\docs-template\publish.js" /Y > nul
	copy "%WEBOSJS%node_modules\jsdoc\LICENSE.md" "%WEBOSJS%tools\util\docs-template\LICENSE.md" /Y > nul
)

if exist "%WEBOSJS%docs" rmdir "%WEBOSJS%docs" /S /Q 
mkdir "%WEBOSJS%docs"

echo Generating webOS.js Documentation...

node "%WEBOSJS%tools\util\jsdoc-build.js" "%WEBOSJS%src" "%WEBOSJS%docs\webOS.js"
node "%WEBOSJS%node_modules\jsdoc\jsdoc.js" "%WEBOSJS%docs\webOS.js" -d "%WEBOSJS%docs" -t "%WEBOSJS%tools\util\docs-template"
if %errorlevel% EQU 0 (
	echo Successfully built to %WEBOSJS%docs
	copy "%WEBOSJS%tools\util\docs-template\index.html" "%WEBOSJS%docs\index.html" /Y > nul
)
del "%WEBOSJS%docs\webOS.js" /Q > nul
