let counter = 0;

const composeObserver = new MutationObserver(() => {
  composeObserver.disconnect();
  loadAuthors();
});

document.body.onload = async () => {
  await loadAuthors();
};

window.addEventListener("click", async () => {
  counter = 0;
  composeObserver.disconnect();
  await loadAuthors();
});

const loadAuthors = async () => {
  try {
    await getAuthors({ question: "Authors" }).then((response) => {
      let answer = insertAuthor(response);
      answer.then((authors) => {
        loadIschecked(authors);
      });
    });
  } catch {
    console.log("error!");
  }
};

const loadIschecked = async (authors) => {
  try {
    await getIsChecked({ question: "ischeck" }).then((response) => {
      startFilter(authors, response.Sendingischeck);
    });
  } catch {
    console.log("error!");
  }
};

const startFilter = async (authors, response) => {
  try {
    await filter(authors, response).then(() => {
      SendData({ Counter: counter });
      addObserverIfDesiredNodeAvailable();
    });
  } catch {
    console.log("Author Filter Turned off. No Filtering taking place!");
  }
};

const addObserverIfDesiredNodeAvailable = () => {
  let composeBox = document.querySelector("#search");

  if (!composeBox) {
    window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
    return;
  }
  let config = { subtree: true, childList: true, characterData: true };
  composeObserver.observe(composeBox, config);
};

const filter = async (authors, response) =>
  new Promise((resolve, reject) => {
    if (response == "no") {
      reject();
    } else {
      composeObserver.disconnect();
      const arr = Array.from(document.querySelectorAll("[data-index]"));
      applyFilter(arr, authors).then(() => {
        resolve();
      });
    }
  });

const applyFilter = async (arr, authors) => {
  for (const element of arr) {
    for (const author of authors) {
      if (
        element.textContent.includes(author.first_name) &&
        element.textContent.includes(author.last_name)
      ) {
        element.innerHTML = "";
        counter = counter + 1;
      }
    }
  }
};

const insertAuthor = async (response) =>
  new Promise((resolve, reject) => {
    if (typeof response.Sending == "undefined") {
      reject();
    }
    let authors = [];
    for (const author of response.Sending) {
      let name = {};
      name.first_name = author.first_name;
      name.last_name = author.last_name;
      authors.push(name);
    }
    resolve(authors);
  });

const SendData = async (msg) => chrome.runtime.sendMessage(msg);

const getIsChecked = async (msg) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.Sendingischeck == "undefined") {
        reject();
      }
      resolve(response);
    });
  });

const getAuthors = async (msg) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.Sending == "undefined") {
        reject();
      } else {
        resolve(response);
      }
    });
  });
