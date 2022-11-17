let counter = 0
/* global chrome */
const getImports = () => {
  return import((chrome.runtime.getURL || chrome.extension.getURL)('/scripts/settings.js'))
}

const importSettings = async () => {
  const result = await (await getImports()).loadSettings()
  return result
}

const composeObserver = new MutationObserver(() => {
  composeObserver.disconnect()
  load()
})

document.body.onload = async () => {
  await load()
}

const load = async () => {
  const response = await getSettings({ question: 'settings' })
  const settings = await importSettings()

  settings.addAll(response.counter, response.currentUrl, response.ischeck, response.author)
  startFilter(settings)
}

window.addEventListener('click', async () => {
  counter = 0
  composeObserver.disconnect()
  await load()
})

const getSettings = async (msg) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      if (typeof response.SendingSettings === 'undefined') reject(console.log('error'))
      resolve(response.SendingSettings)
    })
  })
}

const startFilter = async (settings) => {
  try {
    await filter(settings).then(() => {
      SendData({ Counter: counter })
      addObserverIfDesiredNodeAvailable()
    })
  } catch {
    console.log('Author Filter Turned off. No Filtering taking place!')
  }
}

const addObserverIfDesiredNodeAvailable = () => {
  const composeBox = document.querySelector('#search')

  if (!composeBox) {
    window.setTimeout(addObserverIfDesiredNodeAvailable, 500)
    return
  }
  const config = { subtree: true, childList: true, characterData: true }
  composeObserver.observe(composeBox, config)
}

const filter = async (settings) =>
  new Promise((resolve, reject) => {
    if (settings.getIschecked() === 'no') {
      reject(console.log('error'))
    } else {
      composeObserver.disconnect()
      const arr = Array.from(document.querySelectorAll('[data-index]'))
      applyFilter(arr, settings)
      resolve()
    }
  })

const applyFilter = async (arr, settings) => {
  for (const element of arr) {
    for (const author of settings.getAuthors()) {
      if (element.textContent.includes(author.first_name) && element.textContent.includes(author.last_name)) {
        element.innerHTML = ''
        counter = counter + 1
      }
    }
  }
}

const SendData = async (msg) => chrome.runtime.sendMessage(msg)
