rm -rf dist
tsc -p . --outDir dist
dts-generator --name discord-message-handler --project . --out dist/index.d.ts