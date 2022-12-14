/* eslint-disable no-use-before-define */

const getImports = () => import(
  (chrome.runtime.getURL || chrome.extension.getURL)('/scripts/settings.js')
);

const importSettings = async () => {
  const result = await (await getImports()).loadSettings();
  return result;
};

const getSettings = async (msg) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(msg, (response) => {
    if (typeof response.SendingSettings === 'undefined') reject(console.log('Did not received authors!'));
    resolve(response.SendingSettings);
  });
});
const filter = () => {
  const arr = document.querySelector('div');
  arr.innerHTML = '';
};

const SendAuthors = async (msg) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(msg, (response) => {
    if (typeof response.answer === 'undefined') {
      reject(console.log('failed to send authors!'));
    }
    resolve(response);
  });
});
const btnEventListener = (authors) => {
  document.getElementById('Add').addEventListener('click', async () => {
    const first = document.getElementById('first_name').value;
    const last = document.getElementById('last_name').value;
    try {
      const name = {};
      name.first_name = first;
      name.last_name = last;

      authors.push(name);
      console.log(authors);
      await SendAuthors({ SendingAuthors: authors });
      load();
    } catch { /* empty */ }
  });
};
const createTableElements = async (authors) => {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  let tr = document.createElement('tr');

  let arr = ['First Name', 'Last Name', 'Del'];
  arr.forEach((element) => {
    const th = document.createElement('th');
    const text = document.createTextNode(element);
    th.appendChild(text);
    tr.appendChild(th);
    tbody.appendChild(tr);
  });
  const fn = document.createElement('input');
  fn.id = 'first_name';
  const ln = document.createElement('input');
  ln.id = 'last_name';

  const btnAdd = document.createElement('button');
  btnAdd.innerText = 'Add';
  btnAdd.id = 'Add';
  btnAdd.className = 'button';

  arr = [fn, ln, btnAdd];
  tr = document.createElement('tr');
  arr.forEach((element) => {
    const td = document.createElement('td');
    td.appendChild(element);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  document.getElementById('blocklist').appendChild(table);
  btnEventListener(authors);
};

const load = async () => {
  filter();
  const response = await getSettings({ question: 'settings' });
  const settings = await importSettings();
  settings.addAll(
    response.counter,
    response.currentUrl,
    response.ischeck,
    response.author,
  );
  console.log(settings.getAuthors());
  await createTableElements(settings.getAuthors());
  await show(settings.getAuthors());
};
const show = async (authors) => {
  const tbody = document
    .getElementById('blocklist')
    .getElementsByTagName('table')[0]
    .getElementsByTagName('tbody')[0];

  for (let i = 0; i < authors.length; i += 1) {
    const tr = document.createElement('tr');
    const fn = document.createTextNode(authors[i].first_name);
    const ln = document.createTextNode(authors[i].last_name);
    const btnDel = document.createElement('button');
    btnDel.innerText = 'Del';
    btnDel.id = i;
    btnDel.className = 'button3';
    const arr = [fn, ln, btnDel];
    arr.forEach((element) => {
      const td = document.createElement('td');
      td.appendChild(element);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
  }
  document.getElementById('blocklist').appendChild(tbody);
  const button = document.querySelectorAll('.button3');
  button.forEach((element) => {
    element.addEventListener('click', (e) => {
      console.log(
        `${authors[e.target.id].first_name} ${authors[e.target.id].last_name}`,
      );
      authors.splice(e.target.id, 1);

      const msg = { SendingAuthors: authors };
      SendAuthors(msg);
      load();
    });
  });
};

document.getElementById('reset').onclick = () => {
  const authors = [];
  authors.length = 0;
  SendAuthors({ SendingAuthors: authors });
  load();
};

document.body.onload = async () => {
  filter();
  load();
};
