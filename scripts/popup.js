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

const getSettings = async (msg) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(msg, (response) => {
    if (typeof response.SendingSettings === 'undefined') reject(console.log('Failed to send authors!'));
    resolve(response.SendingSettings);
  });
});

const filter = async () => {
  const arr = document.querySelector('div');
  arr.innerHTML = '';
};

const createTable = async (isChecked, counter, currrentUrl) => {
  filter();
  let temp = 0;

  const span = document.getElementById('btn');
  if (isChecked === 'yes') {
    span.checked = true;
  } else span.checked = false;
  if (
    isChecked === 'yes'
    && currrentUrl.includes('amazon')
    && typeof counter !== 'undefined'
  ) { temp = counter; }

  let h2 = document.createElement('h2');
  const tbody = document.createElement('tbody');
  const text = document.createTextNode('Authors Blocked');
  const numbersText = document.createTextNode(temp);

  h2.appendChild(text);
  tbody.appendChild(h2);
  h2 = document.createElement('h2');
  h2.appendChild(numbersText);
  tbody.appendChild(h2);

  document.getElementById('AuthorsBlocked').appendChild(tbody);
};

const load = async () => {
  const response = await getSettings({ question: 'settings' });
  settings.addAll(
    response.counter,
    response.currentUrl,
    response.ischeck,
    response.author,
  );
  createTable(
    settings.getIschecked(),
    settings.getCounter(),
    settings.getUrl(),
  );
};

const SendStatus = (status) => {
  chrome.runtime.sendMessage({ SendingIsChecked: status });
};

document.getElementById('options').addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

document.getElementById('btn').addEventListener('click', () => {
  const span = document.getElementById('btn');
  if (span.checked) {
    SendStatus('yes');
    load();
  } else {
    SendStatus('no');
    load();
  }
});

document.body.onload = async () => {
  load();
};
