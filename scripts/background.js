var authors = [];
var sponsored = false;


chrome.storage.sync.get('authors', function(items) 
{
    let empty = items.authors;
    if (typeof empty ==="undefined")
    {
    }
    else if (!chrome.runtime.error) 
    {
        authors.length = 0;
        for (const author of items.authors) 
        {
            insertAuthor(author.first_name,author.last_name);
        }
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) 
{
    chrome.tabs.get(activeInfo.tabId, function(tab)
    {
        console.log(tab.url);
        currrent_url = tab.url;
        
    });
  }); 
  
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
     if (!changeInfo.url == 'undefined') 
     {
        console.log(changeInfo.url);
        currrent_url = changeInfo.url;
    
    };
 }); 

chrome.runtime.onConnect.addListener(function(port)
{
    port.postMessage(authors);
});

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse)
{
    if (typeof response == 'number')
    {
        let counter = response;
        chrome.action.setBadgeText({text: counter.toString()});
        chrome.action.setBadgeBackgroundColor({color: '#9688F1'}); 
    }
    else if (typeof response === "undefined") 
    {
        
    }
    else 
    {
        authors.length = 0;
        for (const author of response){
            insertAuthor(author.first_name,author.last_name);
        }
        chrome.storage.sync.set({'authors': authors}, function() 
        {
            if (chrome.runtime.error) {
                console.log("runtime error.");
            }
        });
    }    
});


function insertAuthor(first,last) 
{
    let name = {}
    name.first_name = first;
    name.last_name = last;
    authors.push(name);
}
/*
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
{
    if (tabs[0].url.includes('amazon.ca') || tabs[0].url.includes('amazon.com')) 
    {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) 
        {
                if ((response.farewell > 0) && (response.farewell != 'undefined') && !chrome.runtime.lastError)
                {
                    savedCounter = response.farewell;
                    console.log(response.farewell);
                    let counter = response;
                    chrome.action.setBadgeText({text: counter.toString()});
                    chrome.action.setBadgeBackgroundColor({color: '#9688F1'}); 
                }
        });
    }
});
*/




