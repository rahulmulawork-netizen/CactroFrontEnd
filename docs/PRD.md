# Product Requirements Document (PRD): Highlight Saver Chrome Extension

## 1. Product Overview
**Name:** Highlight Saver
**Platform:** Google Chrome Extension
**Background:** A lightweight browser extension designed to help users capture, organize, and summarize important text snippets while browsing the web. 
**Objective:** The core goal is to enable seamless text highlighting on any webpage, save these highlights locally, and provide easy access to manage or summarize the saved clips.

## 2. Target Audience
- Students and researchers gathering information from various articles.
- Professionals reading long-form content who want to extract key points.
- General users who want to save interesting quotes or text blocks for future reference.

## 3. High-Level User Stories
- **As a user**, I want to select text on any webpage and see a small popup near my cursor so that I can easily decide to save the highlight.
- **As a user**, I want to click the extension icon in the Chrome toolbar to view a list of all my saved highlights in one place.
- **As a user**, I want to be able to delete any previously saved highlight so that I can keep my list relevant and uncluttered.
- **As a user**, I want an option to generate an AI summary of my saved highlights using OpenAI so that I can quickly review the essential points without re-reading everything.

## 4. Functional Requirements

### 4.1 On-Page Text Selection
- **Feature:** Text selection listener.
- **Action:** Upon highlighting/selecting text on a given webpage, a floating UI button or popup containing the text "Save Highlight?" should appear immediately above or near the selected text.
- **Outcome:** Clicking the popup saves the text content, the source URL, and ideally a timestamp to Chrome's local storage (`chrome.storage.local`).

### 4.2 Extension Action Popup (Dashboard)
- **Feature:** Toolbar popup interface.
- **Action:** Clicking the Chrome extension icon opens an HTML popup.
- **Outcome:** The popup must display a scrollable list of all saved highlights. Each item should display the highlighted text and ideally a link to the original source.

### 4.3 Highlight Management (Deletion)
- **Feature:** Delete button per highlight.
- **Action:** Inside the extension popup, each listed highlight must have an associated "Delete" or "Trash" button.
- **Outcome:** Clicking it removes the highlight from the local storage and visually removes it from the scrollable list in real-time.

### 4.4 AI Summarization (Optional / Premium Feature)
- **Feature:** OpenAI-powered summarization.
- **Action:** A "Summarize" button should be available inside the extension popup (either for individual highlights or all aggregated highlights).
- **Outcome:** Clicking the button triggers an API call to the OpenAI API, passing the highlighted text, and displays a concise summary in the UI.

## 5. Non-Functional Requirements
- **Performance:** On-page scripts (content scripts) must be extremely lightweight so as not to affect the loading or scrolling performance of the host webpages.
- **Storage:** Text highlights must be persistently saved using `chrome.storage.local` to respect user privacy and avoid server dependency (except for the OpenAI call).
- **UI/UX:** The interface must be clean, minimal, and intuitive. The popup should fit within standard Chrome extension constraints (max 800x600 px, typical usage around 300x400 px).
- **Permissions:** The extension should only request necessary permissions (e.g., `activeTab`, `storage`, `scripting`, and host permissions like `<all_urls>` to run on any page).

## 6. Technical Stack & Implementation Details
- **Frontend Code:** HTML, CSS, JavaScript (Vanilla JS is sufficient, though lightweight frameworks like Preact/Svelte could be used for the popup UI).
- **Browser API:** Chrome Extension Manifest V3.
  - `content_scripts`: To detect text selection and inject the "Save Highlight?" floating button.
  - `background_service_worker`: (Optional) To handle cross-origin API calls (like OpenAI) to avoid CORS issues.
  - `action`: The popup UI containing the saved highlights list.
  - `storage`: `chrome.storage.local` to persist the data locally.
- **External API:** OpenAI API (`gpt-3.5-turbo` or `gpt-4o-mini`) for the summarization feature. Requires users to either drop in their API key via an options page or utilize a hardcoded/proxy backend depending on deployment strategy.

## 7. Delivery & Demo Constraints
- **Submissions:** The final extension does NOT need to be submitted to the Chrome Web Store.
- **Demo Requirements:** A 2-to-5 minute video (ideally 3-4 minutes) using a tool like Loom.
- **Video Content:** Show the extension loaded locally (developer mode) and working across different pages. The developer's face must be visible and they must speak in English to explain the application.
- **Final Submission Link:** https://forms.gle/ER387znmXfN4MvzdA
