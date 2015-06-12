cd webOS.js
npm install .
gulp docs
move docs\* ..
del /q docs\*
for /d %x in (docs\*) do @rd /s /q %x
del /q node_modules\*
for /d %x in (node_modules\*) do @rd /s /q %x
cd ..
cp webOS.html index.html