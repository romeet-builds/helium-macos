const pinnedGrid = document.getElementById('pinned-grid');
const tabList = document.getElementById('tab-list');
const newTabBtn = document.getElementById('new-tab-btn');

const TOTAL_GRID_SLOTS = 6; // 2 rows x 3 columns

function getFaviconUrl(u) {
  try {
    const url = new URL(u);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch (e) {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239c94a3"><circle cx="12" cy="12" r="10"/></svg>';
  }
}

async function renderTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const pinnedTabs = tabs.filter(t => t.pinned);
  const unpinnedTabs = tabs.filter(t => !t.pinned);

  // 1. Render 2x3 Pinned Grid
  pinnedGrid.innerHTML = '';
  
  for (let i = 0; i < TOTAL_GRID_SLOTS; i++) {
    const tab = pinnedTabs[i];
    const tile = document.createElement('div');
    tile.className = 'pinned-tile';

    if (tab) {
      if (tab.active) tile.classList.add('active');
      tile.title = tab.title || tab.url;

      const img = document.createElement('img');
      img.src = tab.favIconUrl || getFaviconUrl(tab.url);
      img.onerror = () => { img.src = getFaviconUrl(tab.url); };
      tile.appendChild(img);

      const unpin = document.createElement('div');
      unpin.className = 'unpin-btn';
      unpin.innerHTML = '&#215;';
      unpin.title = 'Unpin';
      unpin.onclick = (e) => {
        e.stopPropagation();
        chrome.tabs.update(tab.id, { pinned: false });
      };
      tile.appendChild(unpin);

      tile.onclick = () => {
        chrome.tabs.update(tab.id, { active: true });
      };
    } else {
      // Empty slot
      tile.style.opacity = '0.35';
      tile.style.borderStyle = 'dashed';
      tile.title = 'Empty Favorite Slot (Pin a tab or click to open new tab)';
      tile.innerHTML = '<span style="font-size: 16px; color: var(--text-secondary)">+</span>';
      tile.onclick = () => {
        chrome.tabs.create({ active: true });
      };
    }

    pinnedGrid.appendChild(tile);
  }

  // 2. Render Unpinned Tabs
  tabList.innerHTML = '';
  unpinnedTabs.forEach(tab => {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item' + (tab.active ? ' active' : '');
    tabItem.title = tab.title || tab.url;

    const icon = document.createElement('img');
    icon.src = tab.favIconUrl || getFaviconUrl(tab.url);
    icon.onerror = () => { icon.src = getFaviconUrl(tab.url); };

    const title = document.createElement('div');
    title.className = 'tab-title';
    title.textContent = tab.title || 'Untitled';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'tab-close-btn';
    closeBtn.innerHTML = '&#215;';
    closeBtn.title = 'Close tab';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      chrome.tabs.remove(tab.id);
    };

    tabItem.appendChild(icon);
    tabItem.appendChild(title);
    tabItem.appendChild(closeBtn);

    // Click to switch tab
    tabItem.onclick = () => {
      chrome.tabs.update(tab.id, { active: true });
    };

    // Right-click to pin
    tabItem.oncontextmenu = (e) => {
      e.preventDefault();
      chrome.tabs.update(tab.id, { pinned: true });
    };

    tabList.appendChild(tabItem);
  });
}

// Event Listeners for Tab Changes
chrome.tabs.onCreated.addListener(renderTabs);
chrome.tabs.onUpdated.addListener(renderTabs);
chrome.tabs.onRemoved.addListener(renderTabs);
chrome.tabs.onActivated.addListener(renderTabs);
chrome.tabs.onMoved.addListener(renderTabs);

newTabBtn.onclick = () => {
  chrome.tabs.create({ active: true });
};

// Settings Modal & Toggles
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const settingsModal = document.getElementById('settings-modal');
const autohideToggle = document.getElementById('autohide-toggle');
const gridToggle = document.getElementById('grid-toggle');

// Toggle Auto-hide mode
autohideToggle.onchange = () => {
  document.body.classList.toggle('autohide-mode', autohideToggle.checked);
  chrome.storage.local.set({ autohideMode: autohideToggle.checked });
};

// Toggle Pinned Grid visibility
gridToggle.onchange = () => {
  pinnedGrid.style.display = gridToggle.checked ? 'grid' : 'none';
  chrome.storage.local.set({ showPinnedGrid: gridToggle.checked });
};

// Load saved settings
chrome.storage.local.get(['showPinnedGrid', 'autohideMode'], (res) => {
  if (res.showPinnedGrid !== undefined) {
    gridToggle.checked = res.showPinnedGrid;
    pinnedGrid.style.display = res.showPinnedGrid ? 'grid' : 'none';
  }
  if (res.autohideMode !== undefined) {
    autohideToggle.checked = res.autohideMode;
    document.body.classList.toggle('autohide-mode', res.autohideMode);
  }
});

settingsBtn.onclick = (e) => {
  e.stopPropagation();
  settingsModal.classList.toggle('hidden');
};

closeSettingsBtn.onclick = (e) => {
  e.stopPropagation();
  settingsModal.classList.add('hidden');
};

document.addEventListener('click', (e) => {
  if (settingsModal && !settingsModal.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsModal.classList.add('hidden');
  }
});

// Initial Render
renderTabs();
