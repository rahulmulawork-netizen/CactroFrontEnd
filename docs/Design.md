# Highlight Saver - Design Document

## 1. Design Philosophy
**Simple & Modern**
- **Clutter-Free:** The UI should only present necessary actions. No overwhelming menus.
- **Glassmorphism & Soft Shadows:** Subtle modern styling (translucent backgrounds, soft rounded corners) to make the extension feel native and premium.
- **Responsive Animations:** Micro-interactions (hover states, click feedback, smooth list scrolling) to make it feel alive.

## 2. Visual Identity
- **Typography:** Use a clean sans-serif font like **Inter** or **Roboto** (Google Fonts).
  - Headings: `600` weight.
  - Body Text: `400` weight, `14px` for readability.
- **Color Palette:**
  - **Primary Accent:** Electric Blue (`#2563EB`) or Vivid Purple (`#7C3AED`) for buttons and active states.
  - **Background (Light Mode):** Clean White (`#FFFFFF`) with off-white panels (`#F3F4F6`).
  - **Background (Dark Mode):** Deep Gray (`#1F2937`) with elevated panels (`#374151`).
  - **Text:** Dark Gray (`#111827`) for light mode; Off-White (`#F9FAFB`) for dark mode.
  - **Destructive/Delete:** Soft Red (`#EF4444`).

## 3. UI Components

### 3.1 On-Page "Save Highlight" Tooltip
- **Trigger:** Appears immediately after a user finishes highlighting text on any webpage.
- **Positioning:** Floating `absolute`ly positioned just above or below the selected text.
- **Appearance:** A pill-shaped button.
  - **Icon:** A small "Bookmark" or "Highlighter" icon.
  - **Text:** "Save Highlight"
  - **Style:** Dark translucent background (`rgba(0,0,0,0.8)`), white text, rounded corners (`border-radius: 20px`), subtle drop shadow.

### 3.2 Extension Toolbar Popup
- **Dimensions:** Width `350px`, Max Height `500px`.
- **Header:**
  - Title: "Saved Highlights"
  - Action: "Summarize All" (Optional AI Button) with a sparkle ✨ icon.
- **Highlights List (Scrollable Area):**
  - **Cards:** Each highlight is enclosed in a clean, rounded card (`border-radius: 8px`).
  - **Content:** The excerpt text truncated to 3-4 lines with a "Read more" expander if necessary.
  - **Metadata:** Source Domain (e.g., `wikipedia.org`) and Date Saved.
  - **Actions:** A subtle trash/delete icon (🗑️) that appears on hover in the top-right corner of the card.
- **Empty State:** If no highlights exist, display a friendly illustration or icon with "Highlight some text on the web to save it here!"

## 4. Technical Architecture

### 4.1 Core Modules
1. **`content_script.js`:** 
   - Listens for `mouseup` events to detect text selection (`window.getSelection()`).
   - Injects the inline "Save Highlight" floating button into the DOM.
   - Sends the captured text and URL to the background script or saves directly to storage.
2. **`background.js` (Service Worker):**
   - Handles the AI Summarization request (OpenAI fetch call) to avoid Cross-Origin Resource Sharing (CORS) issues on the injected webpage.
   - Manages context menus (if we wanted to add right-click-to-save later).
3. **`popup.html` & `popup.js`:**
   - The UI that opens when clicking the Chrome extension icon.
   - Reads from `chrome.storage.local` and renders the list of cards dynamically.
4. **Storage Model:**
   - Data stored in `chrome.storage.local` as an array of JSON objects:
     ```json
     [
       {
         "id": "167982138912",
         "text": "The quick brown fox jumps over the lazy dog.",
         "url": "https://example.com/article",
         "timestamp": 167982138912
       }
     ]
     ```

## 5. Development Steps (Roadmap)
1. **Setup Manifest V3:** Create `manifest.json` with permissions (`activeTab`, `storage`, `scripting`).
2. **Build Content Script:** Implement the text selection logic and the floating tooltip UI.
3. **Implement Storage:** Wire up the "Save" button to push to `chrome.storage.local`.
4. **Develop Popup UI:** Create the HTML/CSS for the dashboard and wire it up to display storage items.
5. **Add Deletion Logic:** Attach event listeners to the delete buttons in the popup.
6. **(Optional) AI Summarize Workflow:** Add an API key config page and `fetch()` logic to the OpenAI endpoint.
