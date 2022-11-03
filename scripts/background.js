var authors = [];
var sponsored = false;
var isChecked = true;;



function SaveIsChecked()
{
    chrome.storage.sync.set({'isChecked': isChecked}, function() 
        {
            if (chrome.runtime.error) {
                console.log("runtime error.");
            }
        });
};

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

chrome.storage.sync.get('isChecked',function(items){
    let empty = items.isChecked;
    if (typeof empty === 'undefined')
    {
        console.log("isChecked in storage is missing!");
    }
    else if (!chrome.runtime.error)
    {
        if (typeof empty === 'boolean') 
        {
            isChecked = empty
            SaveIsChecked();
         
        }
        else console.log("could not get isChecked data! Ischecked in storage is not boolean.");
    }
})

chrome.runtime.onConnect.addListener(function(port) 
{
    port.onMessage.addListener(function(msg) 
    {
      if (msg.isCheckedData =="Sending is Checked Data")
      {
        port.postMessage({question: "Send me IsChecked"});
      }
        
      else if (typeof msg.answer == 'boolean')
        {
            isChecked = msg.answer;
            SaveIsChecked()
            
        }
        else if (msg.DataRequest === "DataRequest")
        {
            port.postMessage({answer: isChecked});
        }
    });
  });


chrome.runtime.onConnect.addListener(function(port)
{
    port.postMessage(authors);
    port.postMessage(isChecked);
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
    else if (typeof response == 'boolean' )
    {
        isChecked = response;
        SaveIsChecked();
       
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
};

