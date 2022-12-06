/* eslint-disable no-use-before-define */
/* global chrome */
class Settings {
  constructor(counter, currentUrl, ischeck) {
    this.author = [];
    if (typeof counter === 'undefined') this.counter = 0;
    else this.counter = counter;
    if (typeof ischeck === 'undefined') this.ischeck = 'yes';
    else this.ischeck = ischeck;

    if (typeof currentUrl === 'undefined') this.currentUrl = '';
    else this.currentUrl = currentUrl;
  }

  addAuthor(first, last) {
    this.author.push({ first_name: first, last_name: last });
  }

  addAll(counter, currentUrl, ischeck, author) {
    this.counter = counter;
    this.currentUrl = currentUrl;
    this.ischeck = ischeck;
    this.author = author;
  }

  addAuthors = (authors) => {
    this.author = authors;
  };

  addIschecked(ischeck) {
    this.ischeck = ischeck;
  }

  addCounter(counter) {
    this.counter = counter;
  }

  AddUrl(currentUrl) {
    this.currentUrl = currentUrl;
  }

  getAuthors() {
    return this.author;
  }

  getIschecked() {
    return this.ischeck;
  }

  getCounter() {
    return this.counter;
  }

  getUrl() {
    return this.currentUrl;
  }
}

const settings = new Settings();

const readLocalStorage = async (key) => new Promise((resolve, reject) => {
  chrome.storage.sync.get([key], (result) => {
    if (result[key] === undefined) {
      reject();
    }
    resolve(result[key]);
  });
});

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.question === 'settings') {
    sendResponse({ SendingSettings: settings });
  }
});

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

getAuthors();
getIsChecked();
