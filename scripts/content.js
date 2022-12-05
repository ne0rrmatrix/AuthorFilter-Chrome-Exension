/* global chrome */
let counter = 0;

const SendData = async (msg) => chrome.runtime.sendMessage(msg);

const getImports = () => import((chrome.runtime.getURL || chrome.extension.getURL)('/scripts/settings.js'));
const getSettings = async (msg) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(msg, (response) => {
    if (typeof response.SendingSettings === 'undefined') reject(console.log('error'));
    resolve(response.SendingSettings);
  });
});

const importSettings = async () => {
  const result = await (await getImports()).loadSettings();
  return result;
};
const applyFilter = async (settings) => {
  const arr = document.querySelectorAll('[data-index]');
  settings.getAuthors().forEach((author) => {
    Array.from(arr).forEach((el) => {
      if (el.textContent.includes(author.first_name) && el.textContent.includes(author.last_name)) {
        const theEl = el;
        theEl.innerHTML = '';
        counter += 1;
      }
    });
  });
};

const composeObserver = new MutationObserver(() => {
  composeObserver.disconnect();
  load();
});
const filter = async (settings) => new Promise((resolve, reject) => {
  if (settings.getIschecked() === 'no') {
    reject(console.log('error'));
  } else {
    composeObserver.disconnect();
    applyFilter(settings);
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
const startFilter = async (settings) => {
  try {
    await filter(settings).then(() => {
      SendData({ Counter: counter });
      addObserverIfDesiredNodeAvailable();
    });
  } catch {
    console.log('Author Filter Turned off. No Filtering taking place!');
  }
};
const load = async () => {
  const settings = await importSettings();
  try {
    const response = await getSettings({ question: 'settings' });
    settings.addAll(response.counter, response.currentUrl, response.ischeck, response.author);
  } catch {
    console.log('No data available!');
  }

  startFilter(settings);
};

document.body.onload = async () => {
  await load();
};

window.addEventListener('click', async () => {
  counter = 0;
  composeObserver.disconnect();
  await load();
});
