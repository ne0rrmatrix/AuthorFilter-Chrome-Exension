/* global chrome */
let counters = 0;
const SendData = async (msg) => chrome.runtime.sendMessage(msg);

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

  setCounter(count) {
    this.counter = count;
  }
}

const settings = new Settings();

const getSettings = async (msg) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(msg, (response) => {
    if (typeof response.SendingSettings === 'undefined') reject(console.log('error'));
    resolve(response.SendingSettings);
  });
});

const applyFilter = async () => {
  const arr = document.querySelectorAll('[data-index]');
  settings.getAuthors().forEach((author) => {
    Array.from(arr).forEach((el) => {
      if (el.textContent.includes(author.first_name) && el.textContent.includes(author.last_name)) {
        const theEl = el;
        theEl.innerHTML = '';
        counters += 1;
      }
    });
  });
};

const composeObserver = new MutationObserver(() => {
  composeObserver.disconnect();
  // eslint-disable-next-line no-use-before-define
  load();
});
const filter = async () => new Promise((resolve, reject) => {
  if (settings.getIschecked() === 'no') {
    reject(console.log('error'));
  } else {
    composeObserver.disconnect();
    applyFilter();
    resolve();
  }
});

const addObserverIfDesiredNodeAvailable = () => {
  const composeBox = document.querySelector('#search');

  if (!composeBox) {
    window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
    return;
  }
  const config = { subtree: true, childList: true, characterData: true };
  composeObserver.observe(composeBox, config);
};
const startFilter = async () => {
  try {
    await filter().then(() => {
      SendData({ Counter: counters });
      addObserverIfDesiredNodeAvailable();
    });
  } catch {
    console.log('Author Filter Turned off. No Filtering taking place!');
  }
};
const load = async () => {
  try {
    console.log(settings.getCounter());
    const response = await getSettings({ question: 'settings' });
    settings.addAll(response.counter, response.currentUrl, response.ischeck, response.author);
  } catch {
    console.log('No data available!');
  }

  startFilter();
};

document.body.onload = async () => {
  await load();
};

window.addEventListener('click', async () => {
  composeObserver.disconnect();
  counters = 0;
  await load();
});
