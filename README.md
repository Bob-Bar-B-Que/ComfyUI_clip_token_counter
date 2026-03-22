# ComfyUI CLIP Token Counter ✨

> A visual enhancement extension for ComfyUI that shows real-time token count and adds a copy button to the CLIP Text Encode node.

[![ComfyUI](https://img.shields.io/badge/ComfyUI-Extension-green?style=for-the-badge)](https://github.com/comfyanonymous/ComfyUI)
[![Version](https://img.shields.io/github/v/release/Bob-Bar-B-Que/ComfyUI_clip_token_counter?style=for-the-badge)](https://github.com/Bob-Bar-B-Que/ComfyUI_clip_token_counter/releases)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-1.41%2B-purple?style=for-the-badge)](https://github.com/comfyanonymous/ComfyUI)
[![Ukraine](https://img.shields.io/badge/Made%20in-Ukraine%20🇺🇦-FFD700?style=for-the-badge&labelColor=005BBB)]()

---

## 🎬 Demo

<video src="https://github.com/user-attachments/assets/f963ab81-c8bb-4226-a9cd-94aca669001b" controls loop muted width="700"></video>

---

## 🌻 Features

### Token Counter
Simply open any **CLIPTextEncode** node — the token count appears automatically in the bottom-left corner as you type.

### Copy · Paste · Clear
- Click **Copy** to copy the full prompt, or select text first to copy only that portion
- Click **Paste** to insert clipboard content at the end of existing text
- Click **Clear** to erase all text from the field

### Note node
Hold **Alt** and copy any Note node to enable all features on it.

### ⚡ Performance
- Only activates on `CLIPTextEncode` nodes — **zero overhead** on other nodes
- Uses ComfyUI's native rendering pipeline
- Compatible with ComfyUI Frontend **v1.41+**

---

## 📦 Installation

### Option 1: ComfyUI Manager (Recommended)
1. Open **ComfyUI Manager**
2. Click **Install Custom Nodes**
3. Search for `ComfyUI_clip_token_counter`
4. Click **Install**
5. Restart or run ComfyUI.

### Option 2: Git Clone
```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/Bob-Bar-B-Que/ComfyUI_clip_token_counter.git
```
Restart or run ComfyUI.

### Option 3: Manual Install
1. Download this repository as **ZIP** (Code → Download ZIP)
2. Extract into `ComfyUI/custom_nodes/ComfyUI_clip_token_counter/`
3. Make sure the folder contains `__init__.py` and `web/clip_token_counter.js`
4. Run ComfyUI

### Option 4: Portable / Windows
1. Download ZIP and extract to:
   ```
   ComfyUI_windows_portable\ComfyUI\custom_nodes\ComfyUI_clip_token_counter\
   ```
2. Restart or run ComfyUI.

---

## 📋 Changelog

### v1.1.0 — Current
- 📋 Paste button — pastes clipboard content into the text field without replacing existing text
- 🗑️ Clear button — clears all text from the field instantly
- 📝 All features now work on Note nodes too — just hold Alt and copy the node to enable

### v1.0.0
- 🔢 Real-time token counter for CLIPTextEncode nodes
- 📋 Copy button for full or selected text
- ⚡ Zero overhead on non-CLIP nodes
- 🇺🇦 Full compatibility with ComfyUI Frontend 1.41+

---

## 🌻 Support the Project

If this extension helps your workflow, consider supporting a Ukrainian developer 🇺🇦

### 🌻 Donatello (Ukrainian platform)
[![Donatello](https://img.shields.io/badge/🌻%20Donatello-Support-FFD700?style=for-the-badge&labelColor=005BBB)](https://donatello.to/Bob-Bar-B-Que)

### 🌾 Monobank
Scan the QR code or click on it to open the bank:

[![Monobank QR](assets/mono.png)](https://send.monobank.ua/jar/2UtLeKrSa8)

### 🪙 Crypto — USDT TRC20

Scan the QR code or click on it to copy the address:

[![USDT TRC20 QR](assets/USDT_trc20.png)](https://t.me/share/url?url=TKdsmXceZ2cUFDtF1hbPybZTvfarsuvP3k&text=USDT%20TRC20%20address)

## 📄 License

MIT License — free to use, modify and distribute.

---

## 🌾 Credits

- Built for [ComfyUI](https://github.com/comfyanonymous/ComfyUI) by [@comfyanonymous](https://github.com/comfyanonymous)
- Made with 🌻 in Ukraine 🇺🇦
