let getImports = () => {
  return import(
    (chrome.runtime.getURL || chrome.extension.getURL)("/scripts/settings.js")
  );
};

let importSettings = async () => {
  let result = await (await getImports()).loadSettings();
  return result;
};

document.getElementById("reset").onclick = () => {
  let authors = [];
  authors.length = 0;
  SendAuthors({ SendingAuthors: authors });
  load();
};

document.body.onload = async () => {
  filter();
  load();
};

const load = async () => {
  filter();
  let response = await getSettings({ question: "settings" });
  let settings = await importSettings();
  settings.addAll(
    response.counter,
    response.current_url,
    response.ischeck,
    response.author
  );
  console.log(settings.getAuthors());
  await createTableElements(settings.getAuthors());
  await show(settings.getAuthors());
};

const filter = () => {
  const arr = document.querySelector("div");
  arr.innerHTML = "";
};

const SendAuthors = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.answer == "undefined") {
        reject();
      }
      resolve(response);
    });
  });
};

const createTableElements = async (authors) => {
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  let tr = document.createElement("tr");

  let arr = ["First Name", "Last Name", "Del"];

  for (const element of arr) {
    let th = document.createElement("th");
    let text = document.createTextNode(element);
    th.appendChild(text);
    tr.appendChild(th);
    tbody.appendChild(tr);
  }

  let fn = document.createElement("input");
  fn.id = "first_name";
  let ln = document.createElement("input");
  ln.id = "last_name";

  let btnAdd = document.createElement("button");
  btnAdd.innerText = "Add";
  btnAdd.id = "Add";
  btnAdd.className = "button";

  arr = [fn, ln, btnAdd];
  tr = document.createElement("tr");
  for (const element of arr) {
    let td = document.createElement("td");
    td.appendChild(element);
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  document.getElementById("blocklist").appendChild(table);
  btnEventListener(authors);
};

const btnEventListener = (authors) => {
  document.getElementById("Add").addEventListener("click", async () => {
    let first = document.getElementById("first_name").value;
    let last = document.getElementById("last_name").value;
    try {
      let name = {};
      name.first_name = first;
      name.last_name = last;

      authors.push(name);
      console.log(authors);
      await SendAuthors({ SendingAuthors: authors });
      load();
    } catch {
      console.log("Error");
    }
  });
};

const show = async (authors) => {
  let tbody = document
    .getElementById("blocklist")
    .getElementsByTagName("table")[0]
    .getElementsByTagName("tbody")[0];

  for (let i = 0; i < authors.length; i++) {
    let tr = document.createElement("tr");
    tr.id = i;
    let fn = document.createTextNode(authors[i].first_name);
    let ln = document.createTextNode(authors[i].last_name);
    let btnDel = document.createElement("button");
    btnDel.innerText = "Del";
    btnDel.id = "del";
    btnDel.className = "button button3";
    let arr = [fn, ln, btnDel];

    for (const element of arr) {
      let td = document.createElement("td");
      td.appendChild(element);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    console.log(
      "Delete Authors list: " +
        authors[i].first_name +
        " " +
        authors[i].last_name
    );
    btnDel.addEventListener("click", async () => {
      authors.splice(authors[i], 1);
      let msg = { SendingAuthors: authors };
      await SendAuthors(msg);
      load();
    });
  }
  document.getElementById("blocklist").appendChild(tbody);
};

const getSettings = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.SendingSettings == "undefined") reject();
      resolve(response.SendingSettings);
    });
  });
};
