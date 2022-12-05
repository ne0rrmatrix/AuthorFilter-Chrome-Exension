/* global chrome */
export class Settings {
  constructor(counter, currentUrl, ischeck) {
    this.author = [];
    if (typeof counter === 'undefined') this.counter = 0;
    else this.counter = counter;
    if (typeof ischeck === 'undefined') this.ischeck = '';
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

export const saveSettings = async (data) => new Promise((resolve, reject) => {
  chrome.runtime.sync.set(data, () => {
    if (chrome.runtime.error) reject(console.log('Failed to save settings!'));
    else resolve();
  });
});

export const loadSettings = () => {
  const settings = new Settings();
  return settings;
};
