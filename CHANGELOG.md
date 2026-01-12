# Changelog

All notable changes to LifeMatrix will be documented in this file.

## [v3.12] - 2026-01-12

### ✨ New Features

#### 🏷️ System Tag Management (PR #4)
- Added "Tags Management" tab in Settings modal
- Users can create, edit, and delete system-wide tags
- Tags can be linked to specific dimensions or apply to all
- Default tags: `【人生中的第一次】` and `【里程碑】`
- Changed tag display format from `#tag` to `【tag】`
- Tags are filtered by dimension when creating records
- Tags sync to localStorage and Firestore

#### ✏️ Edit Published Records (PR #1)
- Added edit button to history record cards (hover on desktop)
- RecordModal now supports edit mode with initial values
- Users can modify both text and tags of existing records

### 🐛 Bug Fixes

#### 📱 Mobile Edit Button Visibility (PR #2)
- Fixed edit button being hidden on mobile due to hover-only visibility
- Button now always visible on mobile (< md breakpoint)

#### 🔧 Preserve Tags When Editing (PR #3)
- Fixed tags not loading correctly when editing records
- Added `useEffect` to sync `initialText` and `initialTags` props

### 📊 Stats
- **Code changes**: +210 lines
- **Files modified**: `index.html`, `sw.js`
- **SW Version**: v3.9 → v3.12

---

## [v3.8] - 2026-01-11

### ✨ New Features
- Added tagging feature to progress records with inline tag suggestions
- Added PWA auto-update: automatically refresh when new version is available

### 🎨 Improvements
- Improved radar chart label positioning for uniform visual spacing
- Improved radar chart label spacing regardless of text length

---

## [v3.5] - Previous

### Core Features
- Six-dimension life tracking with customizable dimensions
- Interactive radar chart visualization
- Firebase Authentication (Google + Email/Password)
- Cloud sync with Firestore
- Offline support with localStorage fallback
- Monthly calendar heatmap view
- Data export (JSON/CSV) and import
- PWA support with Service Worker
