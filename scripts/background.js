var authors = [];
var sponsored = false;
var isChecked = "yes";
var counter = 0;
var currrent_url = '';

chrome.storage.sync.get('authors', function(items) 
{
    let empty = items.authors;
    if (typeof empty ==="undefined")
    {
        console.log("Author list in storage is empty!");
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

chrome.storage.sync.get('isChecked',function(items)
{
    let empty = items.isChecked;
    if (typeof empty === 'undefined' && empty != '')
    {
        console.log("isChecked in storage is missing!");
    }
    else if (!chrome.runtime.error)
    {
            isChecked = empty;
            console.log("Background retrieved isCheck and its value is: " +isChecked);
    }
    else console.log("could not get isChecked data! Ischecked in storage is not boolean.");    
});

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "options");
    port.onMessage.addListener(function(msg) {
       SaveAuthorData(msg.OptionSending)
    });
  });
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.question === 'authorsOptions')
        {
            sendResponse({Sending: authors})
        }
    }
)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.question === 'OptionSending')
        {
            SaveAuthorData(Sending.OptionSending);
        }
    }
)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.question === 'authorsContents')
        {
            sendResponse({Sending: authors})
        }
    }
)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.question === 'authorsPopup')
        {
            sendResponse({Sending: authors})
        }
    }
)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.question === 'ischeckedOptions')
        {
            sendResponse({Sending: isChecked})
        }
    }
)

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.question === 'PopupCounter')
        {
            sendResponse({Sending: counter})
        }
    }
)
if (currrent_url.includes('amazon'))
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
    {
        chrome.tabs.sendMessage(tabs[0].id, {background: "counterRequest"}, function(response) 
        {
            console.log(response.SendingCounter);
            counter = response.SendingCounter;
            if (counter > 0)
            {
                chrome.action.setBadgeText({text: counter.toString()});
            }
            chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
        });
        });
}



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
 
function insertAuthor(first,last) 
{
    let name = {}
    name.first_name = first;
    name.last_name = last;
    authors.push(name);
};

function SaveIsChecked(response)
{
        chrome.storage.sync.set({'isChecked': response}, function(){
            if (chrome.runtime.error) {
                console.log("runtime error.");
            }
        })
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
    });
}