var authors = [];
var sponsored = false;
var counter = 0;
var currrent_url = '';
var ischecked;

getIsChecked();
GetItemsFromStorage();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) 
    {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
                var temp =  getIsChecked()
    if (request.Counter) {SaveCounter(request.Counter);SetBadge(request.Counter);sendResponse({answer: "Counters sent!"})}
    if (request.question === 'Authors') sendResponse({Sending: authors});
    if (request.SendingAuthors) {SaveAuthorData(request.SendingAuthors); sendResponse({answer: "Background received Author update!"})};
    if (request.question === 'Counter') sendResponse({SendingCounter: counter});
    if (request.SendingIsChecked) {SaveIsChecked(request.SendingIsChecked), sendResponse({answer: "Received"})};
    if (request.question === 'ischeck') {sendResponse({Sendingischeck: ischecked })};
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

function GetItemsFromStorage()
{
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
            console.log("Author list retrieved!");
        }
        });

        chrome.storage.sync.get('counter',function(items)
        {
            let empty = items.counter;
            if (typeof empty === 'undefined' && empty != '')
            {
            }
            else if (!chrome.runtime.error)
            {
                counter = empty;
                console.log("Background retrieved coutner and its value is: " + counter);
            }
        });  
};

function getIsChecked()
{
    chrome.storage.sync.get('ischecked',function(items)
    {
        let empty = items.ischecked;
        if (typeof empty === 'undefined' && empty != '')
        {
            console.log("isChecked in storage is missing!");
        }
        else if (!chrome.runtime.error)
        {    
            console.log("Background retrieved isCheck and its value is: " + empty);
            ischecked = empty;
            
        }
    });
    if (typeof ischecked != 'undefined') SendingIsChecked();
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
    chrome.storage.sync.set({'ischecked': response}, function(){
        if (chrome.runtime.error) {
            console.log("runtime error.");
        }
        if (!chrome.runtime.error)
        {
            console.log('Saved ischecked to storage! ' + response);
        }
    })
    SendingIsChecked();
};

function SendingIsChecked()
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {ischeckedSending: ischecked}, function(response) {
        });
      });
;}

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
  
