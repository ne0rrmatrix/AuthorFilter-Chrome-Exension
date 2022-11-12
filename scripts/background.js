//TODO Make functions async and add await.
//TODO Fix spacing and formatting.

let authors = [];
let sponsored = false;
let counter = 0;
let currrent_url = '';
let ischecked = '';

const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) {
            reject();
        } else {
            resolve(result[key]);
        }
        });
    });
    };

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) 
    {
        if (request.question === 'Authors') sendResponse({Sending: authors});
        if (request.question === 'ischeck') {sendResponse({Sendingischeck: ischecked })}
        if (request.question === 'url') sendResponse({SendingUrl: currrent_url});    
        if (request.question === 'Counter') sendResponse({SendingCounter: counter});
        if (request.SendingIsChecked) {ischecked = request.SendingIsChecked;SaveIsChecked(request.SendingIsChecked);SetBadge();if (ischecked == 'no'){counter = 0}}
        if (request.SendingAuthors) {sendResponse({answer: "confirmed!"});SaveAuthorData(request.SendingAuthors)}
        if (request.Counter) {counter = request.Counter;SetBadge();}
    })


chrome.tabs.onActivated.addListener(function(activeInfo) 
{
    chrome.tabs.get(activeInfo.tabId, function(tab)
    {
        currrent_url = tab.url;
        SetBadge();
    });
}); 
    

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
        if (!changeInfo.url == 'undefined') 
        {
        currrent_url = changeInfo.url;
        SetBadge();
    }
});


const getAuthors = async () => {
    try {
        let key1 = await readLocalStorage('authors');
        authors.length = 0;
                for (const author of key1) 
                {
                    insertAuthor(author.first_name,author.last_name);
                }
        }
    catch {
    }
}


const getCounters = async () => {
    try {
        let key2 = await readLocalStorage('counter');
        counter = key2;
    }
    catch {
    }
}


const getIsChecked = async () => 
{
   try {
    let key3 = await readLocalStorage('ischecked');
    ischecked = key3;
   }
   catch {
   }
}


const SetBadge = () =>
{
    if (!currrent_url.includes('amazon') || ischecked == 'no')
    {
        chrome.action.setBadgeText({text: "0"});
        chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
    }
    else
    {
            chrome.action.setBadgeText({text: counter.toString()});
            chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
    }
}


const insertAuthor = (first,last) => 
{
    let name = {}
    name.first_name = first;
    name.last_name = last;
    authors.push(name);
}


const SaveIsChecked = (response) =>
{
    ischecked = response;
    
    chrome.storage.sync.set({'ischecked': response}, function(){
    });
}


const SendingCounters = () =>
{
    if (currrent_url.includes('amazon'))
    {
        chrome.runtime.sendMessage({sendingCounters: counter})
    }
}


const SaveAuthorData = (response) =>
{
    authors.length = 0;
    for (const author of response){
        insertAuthor(author.first_name,author.last_name);
    }
    chrome.storage.sync.set({'authors': authors}, function() 
    {
    });
}


const SaveCounter = (response) =>
{
    chrome.storage.sync.set({'counter': response}, function()
    {
       
    })
}

getAuthors();
getIsChecked();

