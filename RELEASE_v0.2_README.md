# Aura Canvas v0.2.0 Release

**Release Date**: 2026年1月25日

## Overview
Aura Canvas v0.2.0 introduces significant improvements to the Grid Config system, Style management, and fixes for critical UX issues. This version focuses on providing a more intuitive workflow for managing card layouts and styling.

## New Features

### 1. **Dual Grid Configuration Controls**
- **Apply Grid Config**: For global settings (columns, gap, min/max width)
- **Apply Modify**: For spacing adjustments (padding, gap) to selected sections
- Separate buttons prevent unintended section creation and allow precise modifications

### 2. **Improved Style Selection & Preview**
- Auto-display first data card preview when style is selected
- No need to manually select cards in preview panel
- Real-time style rendering with proper fallback for missing thumbnails
- Support for all JSON style files in style folder via manifest system

### 3. **Enhanced Style File Management**
- New `style/manifest.json` for centralized style file configuration
- Support for user custom JSON card styles
- Automatic loading of all defined style files
- Proper handling of styles with/without `cardStyle` definitions

## Fixes & Improvements

### Bug Fixes
- ✅ Fixed Import HTML and Tally form buttons requiring double-clicks
- ✅ Fixed duplicate event listener bindings using cloneNode technique
- ✅ Fixed duplicate style entries in dropdown (removed duplicate files)
- ✅ Fixed Grid Config auto-creating unnecessary sections
- ✅ Fixed Minimal Testimonial Card thumbnail display
- ✅ Fixed style preview not displaying without right-panel card selection
- ✅ Fixed custom JSON files not loading (manifest system added)
- ✅ Cleaned up trailing spaces in JSON URLs

### UX Improvements
- Improved sidebar resizer responsiveness (6px width, better visual feedback)
- Better error handling and fallback displays for missing images
- More intuitive workflow for Grid configuration vs. modification
- Cleaner style dropdown (only real/available styles)
- Added logging for style loading (console debugging)

### Code Quality
- Improved event binding with cloneNode to prevent duplicate listeners
- Better error messages and validation
- Proper ID deduplication for style sets
- More robust JSON file parsing with default values

## Known Issues
- None reported for this release

## File Structure Updates

```
style/
├── manifest.json                    # NEW: Style configuration file
├── card.json                        # Updated with name/description
├── minimal-card.json                # Working
├── testimonal.json                  # Fixed thumbnail URL
└── STYLE_FORMAT_GUIDE.md           # Reference
```

## Migration Guide

### For v0.1 Users
1. Simply open the new `editor.html` - it's backward compatible
2. Your saved data in localStorage will be preserved
3. All previously working styles will auto-load

### For Custom Style Files
To add custom style JSON files:
1. Place your JSON file in the `style/` folder
2. Update `style/manifest.json` to include it:
```json
{
  "name": "Your Style Name",
  "file": "style/your-file.json"
}
```
3. Ensure your JSON has `id` and `name` fields
4. Refresh the page to load

## API Changes

### Grid Configuration
- `applyGridConfig()` - Now creates section only if none exists
- `applyModify()` - NEW: Updates spacing without affecting grid structure

### Style Loading
- `loadLocalStyles()` - Now uses manifest.json system
- Better duplicate prevention via Set-based tracking
- Improved fallback for missing `cardStyle` fields

## Performance
- Reduced file size by removing duplicate JSON files
- Optimized event listener binding
- Faster style dropdown rendering (fewer duplicate items)

## Browser Compatibility
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## System Requirements
- Modern web browser with ES6 support
- Local server recommended (Live Server or similar)
- Access to Google Sheets API (for sheet data integration)

## Installation & Usage

### Quick Start
```bash
# Clone or download the repository
cd aura-canvas

# Start with Live Server
npx live-server --port=3000

# Or use serve
npx serve . -p 3000
```

### Basic Workflow
1. Import HTML or add sections
2. Configure grid layout (columns, spacing, size)
3. Connect Google Sheets data source
4. Select card style and apply
5. Export final HTML

## Bug Reports & Feedback
Please report issues by checking the console (F12) and noting:
- Steps to reproduce
- Expected vs actual behavior
- Browser and version
- Error messages in console

## What's Next (v0.3 Roadmap)
- [ ] Drag-and-drop card reordering in preview
- [ ] Advanced color picker for custom styles
- [ ] Template library with pre-built layouts
- [ ] Export to various formats (PDF, Figma)
- [ ] Undo/Redo functionality
- [ ] Responsive design preview at multiple breakpoints

## Credits
Built with ❤️ for flexible card-based design workflows.

---

**Version**: 0.2.0  
**Last Updated**: 2026年1月25日  
**License**: MIT
