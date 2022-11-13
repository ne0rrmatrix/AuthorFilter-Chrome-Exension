export class Settings {
  constructor(counter, current_url, ischeck) {
    this.author = [];
    if (typeof counter == "undefined") this.counter = 0;
    else this.counter = counter;
    if (typeof ischeck == "undefined") this.ischeck = "";
    else this.ischeck = ischeck;

    if (typeof current_url == "undefined") this.current_url = "";
    else this.current_url = current_url;
  }
  addAuthor(first, last) {
    this.author.push({ first_name: first, last_name: last });
  }
  addAll(counter, current_url, ischeck, author) {
    this.counter = counter;
    this.current_url = current_url;
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
  AddUrl(current_url) {
    this.current_url = current_url;
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
    return this.current_url;
  }
  addAll(counter, current_url, ischeck, author) {
    this.counter = counter;
    this.current_url = current_url;
    this.author = author;
    this.ischeck = ischeck;
  }
}

export let saveSettings = async (data) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sync.set(data, () => {
      if (chrom.runtime.error) reject();
      else resolve();
    });
  });
};

export let loadSettings = () => {
  let settings = new Settings();
  return settings;
};
