let saveBtn = null;

document.addEventListener('mouseup', (event) => {
  // Ignore mouseup if clicking the save button itself
  if (event.target && event.target.id === 'hs-save-btn') {
    return;
  }

  const selectedText = window.getSelection().toString().trim();

  // Remove existing button if it exists
  if (saveBtn) {
    saveBtn.remove();
    saveBtn = null;
  }

  // If there's text selected, show the button
  if (selectedText.length > 0) {
    saveBtn = document.createElement('button');
    saveBtn.id = 'hs-save-btn';
    saveBtn.innerText = '💾 Save Highlight ?';

    // Position it near the mouse pointer
    saveBtn.style.left = `${event.pageX + 10}px`;
    saveBtn.style.top = `${event.pageY + 10}px`;

    document.body.appendChild(saveBtn);

    // Click event to save
    saveBtn.addEventListener('click', () => {
      saveHighlight(selectedText);
      saveBtn.remove();
      saveBtn = null;
      // Deselect text so the user knows it's saved
      window.getSelection().removeAllRanges();
    });
  }
});

document.addEventListener('mousedown', (event) => {
  // If clicking outside the save button, remove it
  if (saveBtn && event.target !== saveBtn) {
    saveBtn.remove();
    saveBtn = null;
  }
});

// Function to save the chunk of text to local storage
function saveHighlight(text) {
  const url = window.location.href;
  const timestamp = Date.now();

  const highlight = {
    id: timestamp.toString(),
    text: text,
    url: url,
    date: new Date(timestamp).toLocaleDateString()
  };

  // Get existing, append, and set back
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const highlights = result.highlights;
    // Add new highlight to the beginning
    highlights.unshift(highlight);
    chrome.storage.local.set({ highlights: highlights }, () => {
      // console.log('Highlight saved successfully!');
      showConfirmationToast();
    });
  });
}

function showConfirmationToast() {
  const toast = document.createElement('div');
  toast.innerText = '✅ Highlight saved!';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#10B981'; // Green color
  toast.style.color = 'white';
  toast.style.padding = '10px 16px';
  toast.style.borderRadius = '8px';
  toast.style.fontFamily = 'sans-serif';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '2147483647';
  toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);

  // Fade out and remove the toast after 2 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
}
