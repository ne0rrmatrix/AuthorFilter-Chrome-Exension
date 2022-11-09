//TODO Make functions async and add await.
//TODO Fix spacing and formatting.

var authors = [];
var sponsored = false;
var counter = 0;
var currrent_url = '';
var ischecked = '';

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


getAuthors();
getIsChecked();


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) 
    {
        if (request.Counter) {counter = request.Counter;SetBadge();}
        if (request.question === 'Authors') sendResponse({Sending: authors});
        if (request.SendingAuthors) {SaveAuthorData(request.SendingAuthors)};
        if (request.question === 'Counter') sendResponse({SendingCounter: counter});
        if (request.SendingIsChecked) {ischecked = request.SendingIsChecked;SaveIsChecked(request.SendingIsChecked);SetBadge()};
        if (request.question === 'ischeck') {sendResponse({Sendingischeck: ischecked })};
        if (request.question === 'url') sendResponse({SendingUrl: currrent_url});    
    });

async function getAuthors() {
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


async function getCounters() {
    try {
        let key2 = await readLocalStorage('counter');
        counter = key2;
    }
    catch {
    }
} 


async function getIsChecked() 
{
   try {
    let key3 = await readLocalStorage('ischecked');
    ischecked = key3;
   }
   catch {
   }
};


chrome.tabs.onActivated.addListener(function(activeInfo) 
{
    chrome.tabs.get(activeInfo.tabId, function(tab)
    {
        currrent_url = tab.url;
        SetBadge(counter);
    });
}); 
  

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
     if (!changeInfo.url == 'undefined') 
     {
        currrent_url = changeInfo.url;
        SetBadge(counter);
    };
 }); 


function SetBadge()
{
    if (!currrent_url.includes('amazon') || ischecked == 'no')
    {
        chrome.action.setBadgeText({text: "0"});
        chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
    }
    else
    {
        if (ischecked == 'yes' || ischecked == '')
        {
            chrome.action.setBadgeText({text: counter.toString()});
            chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
        } 
    };
}; 


function insertAuthor(first,last) 
{
    let name = {}
    name.first_name = first;
    name.last_name = last;
    authors.push(name);
};


function SaveIsChecked(response)
{
    ischecked = response;
    
    chrome.storage.sync.set({'ischecked': response}, function(){
        if (chrome.runtime.error) 
        {
        };
        if (!chrome.runtime.error)
        {      
        };
    });
};


function SendingCounters()
{
    if (currrent_url.includes('amazon'))
    {
        chrome.runtime.sendMessage({sendingCounters: counter})
    };
};


function SaveAuthorData(response)
{
    authors.length = 0;
    for (const author of response){
        insertAuthor(author.first_name,author.last_name);
    };
    chrome.storage.sync.set({'authors': authors}, function() 
    {
        if (chrome.runtime.error) 
        {
        };
        if (!chrome.runtime.error)
        {
        };
    });
};


function SaveCounter(response)
{
    chrome.storage.sync.set({'counter': response}, function()
    {
        if (chrome.runtime.error)
        {
        };
        if (!chrome.runtime.error)
        {
        };
    })
};



