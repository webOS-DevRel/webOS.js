@echo off

SET WEBOSJS=%~DP0
SET SRC=%WEBOSJS%src
SET OUTPUT=%WEBOSJS%webOS.js

SETLOCAL EnableDelayedExpansion
SET STATUS=0

REM Mainline

echo Building webOS.js...
(echo window.webOS = window.webOS ^|^| {};) > "%OUTPUT%"
(echo.) >> "%OUTPUT%"

REM device.js and platform.js have priority, so process them before the other files

if exist "%SRC%\device.js" (
	call:writeFile "%SRC%\device.js" device.js
)
if exist "%SRC%\platform.js" (
	call:writeFile "%SRC%\platform.js" platform.js
)

REM Process all the rest of the javascript files in the src directory

for %%F in ("%SRC%\*.js") do (
	if not "%%~dpnxF" == "%SRC%\device.js" (
		if not "%%~dpnxF" == "%SRC%\platform.js" (
			call:writeFile "%%~dpnxF" "%%~nxF"
		)
	)
)
if %STATUS% EQU 0 echo Successfully built to %OUTPUT%
goto:eof

REM Functions

:writeFile
	@echo off
	REM Parameters: srcFilepath, srcFilename
	if %STATUS% EQU 0 (
		(echo. // %~2) >> "%OUTPUT%"	
		node "%WEBOSJS%node_modules\uglify-js\bin\uglifyjs" "%~1" -e -v >> "%OUTPUT%" 2>&1
		if !errorlevel! NEQ 0 (
			(echo.)
			echo ** Error processing %~2 **
			SET STATUS=!errorlevel!
		)
	)
goto:eof
