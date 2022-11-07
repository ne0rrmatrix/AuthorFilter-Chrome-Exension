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
getCounters();
getIsChecked();


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) 
    {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        updatedStatus(request).then
        if (request.question === 'ischeck') sendResponse({Sendingischeck: ischecked });
        if (request.question === 'Authors') sendResponse({Sending: authors});
        if (request.question === 'Counter') sendResponse({SendingCounter: counter})
    });


chrome.tabs.onActivated.addListener(function(activeInfo) 
{
    chrome.tabs.get(activeInfo.tabId, function(tab)
    {
        console.log(tab.url);
        currrent_url = tab.url;
        SetBadge(counter);
    });
}); 
    

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
        if (!changeInfo.url == 'undefined') 
        {
        console.log(changeInfo.url);
        currrent_url = changeInfo.url;
        SetBadge(counter);
    };
    }); 


async function updatedStatus(request)
{
    if (request.SendingCounter) {SaveCounter(request.SendingCounter);SetBadge(request.SendingCounter)};
    if (request.SendingAuthors) SaveAuthorData(request.SendingAuthors);
    if (request.SendingIsChecked) SaveIsChecked(request.SendingIsChecked);
    return request;
};


async function getAuthors() {
    try {
            let key1 = await readLocalStorage('authors');
            authors.length = 0;
            for (const author of key1) 
            {
                insertAuthor(author.first_name,author.last_name);
            }
            console.log("Author list retrieved!");
        }
    catch 
    {
        console.log("error getting data!")
    }
};


async function getCounters() {
    try 
    {
        let key2 = await readLocalStorage('counter');
        counter = key2;
    }
    catch 
    {
        console.log("error getting data!")
    }
} 


async function getIsChecked() {
   try 
   {
        let key3 = await readLocalStorage('ischecked');
        ischecked = key3;
        SendingIsChecked(key3);
   }
   catch 
   {
        console.log("error getting data!")
   }
   
}


function SetBadge(response)
{
    if (!currrent_url.includes('amazon'))
    {
        chrome.action.setBadgeText({text: "0"});
        chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
    }
    else
    {
        chrome.action.setBadgeText({text: response.toString()});
        chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
    }    
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
    SendingIsChecked();
    chrome.storage.sync.set({'ischecked': response}, function(){
        if (chrome.runtime.error) 
        {
            console.log("runtime error.");
        }
        if (!chrome.runtime.error)
        {
            console.log('Saved ischecked to storage! ' + response);
            
        }
    })
};


function SendingIsChecked()
{
        if (currrent_url.includes('amazon'))
        {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {ischeckedSending: ischecked})
                });
        }        
}


function SendingCounters()
{
        chrome.runtime.sendMessage({SendingCounter: counter})
}


function SendReload()
{
    if (currrent_url.includes('amazon'))
    {
         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id)})
    };
   
}


function SaveAuthorData(response)
{
    authors.length = 0;
    for (const author of response){
        console.log(author);
        insertAuthor(author.first_name,author.last_name);
    }
    chrome.storage.sync.set({'authors': authors}, function() 
    {
        if (chrome.runtime.error) {
            console.log("runtime error.");
        }
        if (!chrome.runtime.error)
        {
            console.log('Saved Authors to storage!');
        }
    });
};


function SaveCounter(response)
{
    console.log('Counter current value is: ' + response);
    chrome.storage.sync.set({'counter': response}, function()
    {
        if (chrome.runtime.error)
        {
            console.log('runtime error.');
        }
        if (!chrome.runtime.error)
        {
            console.log('Saved counter to storage!');
        }
    })
};


//setTimeout(() => {SetBadge();console.log('Setting Badge!')}, 5000);
  