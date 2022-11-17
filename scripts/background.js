// TODO Make functions async and add await.
// TODO Fix spacing and formatting.
/* global chrome */
'use strict'
// eslint-disable-next-line import/no-absolute-path
import * as module from '/scripts/settings.js'

const settings = new module.Settings()

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (result[key] === undefined) {
        reject(console.log('data in storage is empty!'))
      }
      resolve(result[key])
    })
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.SendingIsChecked) {
    SaveIsChecked(request.SendingIsChecked)
    settings.addIschecked(request.SendingIsChecked)
    SetBadge()
    if (settings.getIschecked() === 'no') {
      settings.addCounter(0)
    }
  }
  if (request.SendingAuthors) {
    sendResponse({ answer: 'confirmed!' })
    SaveAuthorData(request.SendingAuthors)
  }
  if (request.Counter) {
    settings.addCounter(request.Counter)
    SetBadge()
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.question === 'settings') {
    sendResponse({ SendingSettings: settings })
  }
})
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    settings.AddUrl(tab.url)
    SetBadge()
  })
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url === 'undefined') {
    settings.AddUrl(changeInfo.url)
    SetBadge()
  }
})

const getAuthors = async () => {
  try {
    const key1 = await readLocalStorage('authors')
    const temp = []
    settings.addAuthors(temp)
    settings.addAuthors(key1)
  } catch {}
}
/**
const getCounters = async () => {
  try {
    const key2 = await readLocalStorage('counter')
    settings.addCounter(key2)
  } catch {}
}
*/
const getIsChecked = async () => {
  try {
    const key3 = await readLocalStorage('ischecked')
    settings.addIschecked(key3)
  } catch {}
}

const SetBadge = () => {
  if (
    !settings.getUrl().includes('amazon') ||
    settings.getIschecked() === 'no'
  ) {
    chrome.action.setBadgeText({ text: '0' })
    chrome.action.setBadgeBackgroundColor({ color: '#9688F1' })
  } else {
    chrome.action.setBadgeText({ text: String(settings.getCounter()) })
    chrome.action.setBadgeBackgroundColor({ color: '#9688F1' })
  }
}

const SaveIsChecked = (response) => {
  chrome.storage.sync.set({ ischecked: response }, function () {})
}

const SaveAuthorData = (response) => {
  const temp = []
  settings.addAuthors(temp)
  settings.addAuthors(response)
  // console.log(settings.getAuthors())
  const authors = settings.getAuthors()
  chrome.storage.sync.set({ authors }, function () {})
  getAuthors()
}
/**
const SaveCounter = (response) => {
  chrome.storage.sync.set({ counter: response }, function () {})
}
*/
getAuthors()
getIsChecked()
