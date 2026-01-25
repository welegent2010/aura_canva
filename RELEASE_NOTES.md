# Aura Canvas Release Notes

## v0.2.0 (2026年1月25日)

### New Features
- **Dual Grid Controls**: Separate "Apply Grid Config" and "Apply Modify" buttons for precise layout management
- **Improved Style System**: Auto-preview first data card when style is selected
- **Manifest-based Style Loading**: All custom JSON styles in `style/` folder now load automatically

### Key Improvements
- Fixed duplicate event listeners (Import HTML, Tally buttons)
- Fixed duplicate style dropdown entries
- Fixed custom JSON files not loading
- Better thumbnail handling with fallback displays
- Improved sidebar resizer (6px width)

### Bug Fixes
- ✅ Removed duplicate style files
- ✅ Fixed Grid Config auto-creating unnecessary sections
- ✅ Fixed double-click requirement for buttons
- ✅ Fixed missing style preview without right-panel selection
- ✅ Cleaned up JSON formatting issues

See [RELEASE_v0.2_README.md](RELEASE_v0.2_README.md) for detailed changes.

---
## v0.1 Release - Initial Development Version

This is the first development release of Aura Canvas, a lightweight HTML splicing and dynamic card generation tool.

### Features
- HTML page editing and section management
- Google Sheets data integration with automatic caching
- Grid card generation with configurable layout
- Style set system with template support
- Tally form embedding

### Fixes
- Fixed left sidebar image preview not displaying
- Fixed Google Sheets data loading cache format issue
- Added cache clearing functionality
- Enhanced image URL conversion for Google Drive links

### Installation
1. Download the release
2. Open `editor.html` in your browser
3. Or use local server for full functionality (see README)

### Documentation
See [RELEASE_v0.1_README.md](RELEASE_v0.1_README.md) for detailed usage instructions.
