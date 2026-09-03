# Arc-Style Helium Browser for macOS (Apple Silicon arm64)

Welcome to the project! This repository builds a customized, privacy-first **Helium Browser** for macOS Apple Silicon (`arm64`), featuring:

1. **Arc-Style $2 \times 3$ Pinned Favorites Grid**
2. **Chromium Material Dark Sidebar** (with pure-white Google Material Symbol icon)
3. **Built-in Unbiased Ad-Blocking Engine**
4. **All 7 macOS Apple Silicon SDK Compatibility Patches**
5. **High-Speed 12-Core Bitrise Build Pipeline**

---

## 📂 Project Structure

```
helium-macos/
├── .github/workflows/
│   └── build-helium-macos-arm64.yml   # 12-Core Bitrise M2 Pro GitHub Actions workflow
├── patches/
│   ├── custom/                         # All macOS SDK and Arc customization patches
│   │   ├── arc-2x3-pinned-grid.patch   # 2x3 pinned favorites grid patch
│   │   ├── fix-ax-*.patch              # Complete Apple WebKit & Cocoa accessibility fixes
│   │   ├── fix-browser-accessibility-cocoa-constants.patch
│   │   ├── fix-appkit-utils-pasteboard.patch
│   │   ├── fix-mojo-fileport.patch
│   │   ├── fix-posix-spawn-addchdir.patch
│   │   ├── fix-screen-utils-displayid.patch
│   │   └── fix-skia-cgimage-byteorder.patch
│   └── series                          # Ordered patch application index
├── resources/
│   └── extensions/
│       └── arc-grid-sidebar/           # Pre-packaged Arc Sidebar extension
│           ├── manifest.json
│           ├── sidebar.html
│           ├── sidebar.css
│           ├── sidebar.js
│           ├── background.js
│           └── icons/
├── helium-chromium/                    # Submodule containing Helium core patch stack
├── flags.macos.gn                      # Custom GN flags for macOS Sonoma 14 SDK
├── env.sh                              # Environment variables and path resolution
└── retrieve_and_unpack_resource.sh     # High-speed CDN resource downloader
```

---

## 🚀 How to Build

### Option 1: Cloud Build via Bitrise M2 Pro (Recommended)
Run from the command line:
```bash
gh workflow run "Build Helium macOS arm64 (Bitrise M2 Pro)" \
  --ref main \
  --repo romeet-builds/helium-macos
```
Or trigger it directly from **GitHub Actions &rarr; "Build Helium macOS arm64" &rarr; Run workflow**.

### Option 2: Local Build on Apple Silicon Mac
```bash
./retrieve_and_unpack_resource.sh -d -g arm64
./build.sh arm64
```

---

## 📦 Build Outputs
The build produces:
* `Helium-macOS-arm64.zip` — Portable macOS `.app` bundle
* `Helium.dmg` — Drag-and-drop macOS installer
