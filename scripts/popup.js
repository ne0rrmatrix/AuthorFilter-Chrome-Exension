/* global chrome */

const getImports = () => import(
  (chrome.runtime.getURL || chrome.extension.getURL)('/scripts/settings.js')
);

const getSettings = async (msg) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(msg, (response) => {
    if (typeof response.SendingSettings === 'undefined') reject(console.log('Failed to send authors!'));
    resolve(response.SendingSettings);
  });
});

const importSettings = async () => {
  const result = await (await getImports()).loadSettings();
  return result;
};

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
  const settings = await importSettings();
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
