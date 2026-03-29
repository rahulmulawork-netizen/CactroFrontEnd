document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('highlights-container');
  const summarizeBtn = document.getElementById('summarize-btn');

  // Persist summary in memory so it doesn't disappear when deleting highlights
  let currentSummary = "";

  function loadHighlights() {
    chrome.storage.local.get({ highlights: [] }, (result) => {
      const highlights = result.highlights;
      container.innerHTML = '';

      // Re-render the summary if it exists
      if (currentSummary) {
        renderSummaryDiv(currentSummary);
      }

      if (highlights.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.innerHTML = 'No highlights saved yet.<br><br>Select text on a page to start!';
        container.appendChild(emptyMsg);
        return;
      }

      highlights.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'card';
        let shortUrl = "Unknown";
        try { shortUrl = new URL(item.url).hostname; } catch (e) { }

        card.innerHTML = `
          <p class="card-text">"${item.text}"</p>
          <div class="card-footer">
            <a href="${item.url}" target="_blank" class="card-link">${shortUrl}</a>
            <span>${item.date}</span>
            <button class="delete-btn" data-id="${item.id}">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteHighlight(e.target.getAttribute('data-id')));
      });
    });
  }

  function renderSummaryDiv(text) {
    let summaryDiv = document.querySelector('.summarize-result');
    if (!summaryDiv) {
      summaryDiv = document.createElement('div');
      summaryDiv.className = 'summarize-result';
      // Inline styles to ensure it looks good regardless of CSS
      summaryDiv.setAttribute('style', 'background:#f8f9fa; border-left:4px solid #4285f4; padding:12px; border-radius:4px; margin-bottom:15px; font-size:13px; color:#333; box-shadow: 0 1px 3px rgba(0,0,0,0.1);');
      container.prepend(summaryDiv);
    }

    // Convert Markdown (**, *) to HTML (<b>, •)
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold: **text** -> <b>text</b>
      .replace(/^\* (.*$)/gim, '• $1')         // Bullets: * text -> • text
      .replace(/\n/g, '<br>');               // New lines

    summaryDiv.innerHTML = `<div style="margin-bottom:5px; font-weight:bold; color:#4285f4;">✨ AI Summary</div>${formatted}`;
  }

  function deleteHighlight(id) {
    chrome.storage.local.get({ highlights: [] }, (result) => {
      const newHighlights = result.highlights.filter(h => h.id !== id);
      chrome.storage.local.set({ highlights: newHighlights }, () => loadHighlights());
    });
  }

  summarizeBtn.addEventListener('click', async () => {
    chrome.storage.local.get({ highlights: [] }, async (result) => {
      if (result.highlights.length === 0) {
        alert("No highlights to summarize!");
        return;
      }

      // --- CONFIGURATION FROM YOUR WORKING LIST ---
      const API_KEY = "AIzaSyA8THMUJIdPvzbYFzgD--OBA0biuaWpu_Y";
      // gemini-2.5-flash is your stable, fast model
      const MODEL = "gemini-2.5-flash";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

      summarizeBtn.innerText = "⏳ Summarizing...";
      summarizeBtn.disabled = true;

      // Combine your highlights
      const combinedText = result.highlights.map(h => h.text).join("\n\n");

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Summarize these text highlights into a concise summary with bullet points:\n\n${combinedText}`
              }]
            }],
            // Optional: You can add generationConfig to control length
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.7
            }
          })
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(`[${data.error.code}] ${data.error.message}`);
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
          currentSummary = data.candidates[0].content.parts[0].text;
          renderSummaryDiv(currentSummary);
        } else {
          throw new Error("No summary generated. Try selecting more text.");
        }

      } catch (err) {
        console.error("Gemini Error:", err);
        alert("Summarization Error: " + err.message);
      } finally {
        summarizeBtn.innerText = "✨ Summarize";
        summarizeBtn.disabled = false;
      }
    });
  });

  loadHighlights();
});