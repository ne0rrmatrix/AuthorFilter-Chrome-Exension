// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-import-module-exports, import/no-unresolved, import/extensions, import/no-absolute-path
import * as module from '/scripts/settings.js';

const settings = new module.Settings();

const readLocalStorage = async (key) => new Promise((resolve, reject) => {
  chrome.storage.sync.get([key], (result) => {
    if (result[key] === undefined) {
      reject();
    }
    resolve(result[key]);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.question === 'settings') {
    sendResponse({ SendingSettings: settings });
  }
});

const SetBadge = () => {
  if (
    !settings.getUrl().includes('amazon')
    || settings.getIschecked() === 'no'
  ) {
    chrome.action.setBadgeText({ text: '0' });
    chrome.action.setBadgeBackgroundColor({ color: '#9688F1' });
  } else {
    chrome.action.setBadgeText({ text: String(settings.getCounter()) });
    chrome.action.setBadgeBackgroundColor({ color: '#9688F1' });
  }
};

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    settings.AddUrl(tab.url);
    SetBadge();
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (typeof changeInfo.url !== 'undefined') {
    settings.AddUrl(changeInfo.url);
    SetBadge();
  }
});

const getAuthors = async () => {
  try {
    const key1 = await readLocalStorage('authors');
    const temp = [];
    settings.addAuthors(temp);
    settings.addAuthors(key1);
  } catch { /* empty */ }
};

const getIsChecked = async () => {
  try {
    const key3 = await readLocalStorage('ischecked');
    settings.addIschecked(key3);
  } catch { /* empty */ }
};

const SaveIsChecked = (response) => {
  chrome.storage.sync.set({ ischecked: response }, () => { });
};

const SaveAuthorData = (response) => {
  const temp = [];
  settings.addAuthors(temp);
  settings.addAuthors(response);
  const authors = settings.getAuthors();
  chrome.storage.sync.set({ authors }, () => { });
  getAuthors();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.SendingIsChecked) {
    SaveIsChecked(request.SendingIsChecked);
    settings.addIschecked(request.SendingIsChecked);
    SetBadge();
    if (settings.getIschecked() === 'no') {
      settings.addCounter(0);
    }
  }
  if (request.SendingAuthors) {
    sendResponse({ answer: 'confirmed!' });
    SaveAuthorData(request.SendingAuthors);
  }
  if (request.Counter) {
    settings.addCounter(request.Counter);
    SetBadge();
  }
});

getAuthors();
getIsChecked();
