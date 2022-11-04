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

chrome.runtime.onMessage.addListener(function(msg){
    if (msg.question == "data")
    {
        chrome.runtime.sendMessage({SendingAuthors: authors});
        chrome.runtime.sendMessage({SendingChecked: isChecked});
        chrome.runtime.sendMessage({SendingCounter: counter});
    }
    else if (msg.CounterData)
    {
        counter = msg.CounterData;
    }
    else if (msg.CheckedData)
    {
        isChecked = msg.CheckedData;
        SaveIsChecked(msg.CheckedData);
        console.log('Background recieved isChecked. Value is: ' + msg.CheckedData);
    }
    else if (msg.AuthorsData)
    {
        SaveAuthorData(msg.AuthorsData);
    }
    else if (msg.PopupChecked)
    {
        isChecked = msg.PopupChecked;
        SaveIsChecked(msg.PopupChecked);
        console.log('Background recieved isChecked From Popup menu. Value is: ' + msg.PopupChecked);
    }
    else if (msg.OptionData)
    {
        chrome.runtime.sendMessage({OptionsSendingAuthors: authors});
    }
    else if (msg.OptionsAuthors)
    {
        SaveAuthorData(msg.OptionsAuthors);
    }
})

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
        insertAuthor(author.first_name,author.last_name);
    }
    chrome.storage.sync.set({'authors': authors}, function() 
    {
        if (chrome.runtime.error) {
            console.log("runtime error.");
        }
    });
}