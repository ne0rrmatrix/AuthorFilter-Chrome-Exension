let getImports = () => {
  return import(
    (chrome.runtime.getURL || chrome.extension.getURL)("/scripts/settings.js")
  );
};

let importSettings = async () => {
  let result = await (await getImports()).loadSettings();
  return result;
};
document.getElementById("options").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

document.getElementById("btn").addEventListener("click", () => {
  const span = document.getElementById("btn");
  if (span.checked) {
    SendStatus("yes");
    load();
  } else {
    SendStatus("no");
    load();
  }
});

document.body.onload = async () => {
  load();
};

const load = async () => {
  let response = await getSettings({ question: "settings" });
  let settings = await importSettings();
  settings.addAll(
    response.counter,
    response.current_url,
    response.ischeck,
    response.author
  );
  createTable(
    settings.getIschecked(),
    settings.getCounter(),
    settings.getUrl()
  );
};
const filter = async () => {
  const arr = document.querySelector("div");
  arr.innerHTML = "";
};

const getSettings = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.SendingSettings == "undefined") reject();
      resolve(response.SendingSettings);
    });
  });
};

const createTable = async (isChecked, counter, currrent_url) => {
  filter();
  let temp = 0;

  const span = document.getElementById("btn");
  if (isChecked == "yes") {
    span.checked = true;
  } else span.checked = false;
  if (
    isChecked == "yes" &&
    currrent_url.includes("amazon") &&
    typeof counter != "undefined"
  )
    temp = counter;

  let h2 = document.createElement("h2");
  let tbody = document.createElement("tbody");
  let text = document.createTextNode("Authors Blocked");
  let numbers_text = document.createTextNode(temp);

  h2.appendChild(text);
  tbody.appendChild(h2);
  h2 = document.createElement("h2");
  h2.appendChild(numbers_text);
  tbody.appendChild(h2);

  document.getElementById("AuthorsBlocked").appendChild(tbody);
};

const SendStatus = (status) => {
  chrome.runtime.sendMessage({ SendingIsChecked: status });
};
