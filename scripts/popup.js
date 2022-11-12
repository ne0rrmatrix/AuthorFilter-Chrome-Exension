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
  try {
    await getIsChecked({ question: "ischeck" }).then((response) => {
      getCurrentUrl({ question: "url" }).then((currrent_url) => {
        getCounters({ question: "Counter" }).then((counter) => {
          if (response.Sendingischeck == "yes") span.checked = true;
          else span.checked = false;
          LoadData(
            response.Sendingischeck,
            counter.SendingCounter,
            currrent_url.SendingUrl
          );
        });
      });
    });
  } catch {
    console.log("error!");
  }
};

const filter = async () => {
  const arr = document.querySelector("div");
  arr.innerHTML = "";
};

const LoadData = async (isChecked, counter, currrent_url) => {
  filter();
  let temp = 0;

  const span = document.getElementById("btn");
  if (isChecked == "yes") span.checked = true;
  else span.checked = false;

  if (currrent_url.includes("amazon")) {
    temp = counter;
  }
  if (isChecked == "yes" && currrent_url.includes("amazon")) temp = counter;

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

const getCounters = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.SendingCounter == "undefined") reject();
      else resolve(response);
    });
  });
};

const getIsChecked = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.Sendingischeck == "undefined") reject();
      else resolve(response);
    });
  });
};

const getCurrentUrl = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.SendingUrl == "undefined") reject();
      else resolve(response);
    });
  });
};

const SendStatus = (status) => {
  chrome.runtime.sendMessage({ SendingIsChecked: status });
};
