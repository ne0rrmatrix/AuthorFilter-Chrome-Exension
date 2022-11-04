var authors = [];
var sponsored = false;
var isChecked = true;
var counter = 0;


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
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "options");
    port.onMessage.addListener(function(msg) {
        console.log(msg.sending);
        SaveAuthorData(msg.sending);
    });
  });
/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.question == "authors")
    {
        sendResponse({SendingAuthors: authors});
        console.log('Background sending author data!');
    }
    if (request.question == "isChecked")
    {
        sendResponse({SendingChecked: isChecked});
    }
    if (request.question == "counter")
    {
        sendResponse({SendingCounter: counter});
    }
    else if (typeof request.CounterData != 'undefined')
    {
        counter = request.CounterData;
    }
    else if (typeof request.CheckedData != 'undefined')
    {
        isChecked = request.CheckedData;
        SaveIsChecked(request.CheckedData);
        console.log('Background recieved isChecked. Value is: ' + request.CheckedData);
    }
    else if (typeof request.AuthorsData != 'undefined')
    {
        SaveAuthorData(request.AuthorsData);
        console.log('Background recieved Authors.');
    }
});
*/
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