var savedCounter = 0;
var isChecked = true;
var SendingFromPopup = chrome.runtime.connect({name: "PopupSendingIsChecked"});

SendingFromPopup.postMessage({DataRequest: "DataRequest"})
chrome.runtime.onConnect.addListener(function(port) 
{
    port.onMessage.addListener(function(msg) 
    {
        if (typeof msg.answer == 'boolean')
        {
            console.log('Popup received isChecked from Backgrond! Value is: ' + isChecked)
            isChecked = msg.answer;
            
        }
    });
  });

SendingFromPopup.onMessage.addListener(function(msg) 
{
    if (msg.question === "Send me IsChecked")
        {
            SendingFromPopup.postMessage({answer: isChecked});
        }
});

document.body.onload = function() 
{
    let h2 = document.createElement('h2');
    let tbody = document.createElement('tbody');
    let text = document.createTextNode('Authors Blocked');
    let numbers_text = document.createTextNode(savedCounter);

    h2.appendChild(text);
    tbody.appendChild(h2);
    h2 = document.createElement('h2');
    h2.appendChild(numbers_text);
    tbody.appendChild(h2);
    document.getElementById("AuthorsBlocked").appendChild(tbody);
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
{
    if (tabs[0].url.includes('amazon.ca') || tabs[0].url.includes('amazon.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) 
    {
            if ((response.farewell > 0) && (response.farewell != 'undefined') && !chrome.runtime.lastError)
            {
                savedCounter = response.farewell;
                console.log(response.farewell);
                filter();
                changed(savedCounter);
            }
    });
    }
    
});
function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
}


function changed(counter)
{
   
    let h2 = document.createElement('h2');
    let tbody = document.createElement('tbody');
    let div = document.createElement('div');
    div.className = 'container-fluid';
    div.id = 'AuthorsBlocked';
    let text = document.createTextNode('Authors Blocked');
    let numbers_text = document.createTextNode(savedCounter);

    h2.appendChild(text);
    tbody.appendChild(h2);
    h2 = document.createElement('h2');
    h2.appendChild(numbers_text);
    div.appendChild(h2);
    tbody.appendChild(div);
    document.getElementById("AuthorsBlocked").appendChild(tbody);
}   
// setTimeout(() => {filter();changed(counter)}, 2000);

const checkbox = document.getElementById('btn')

checkbox.addEventListener('click', function() {
  if (isChecked == true) {
    isChecked = false
  } else {
    isChecked = true
  }
  console.log(isChecked);
  chrome.runtime.sendMessage(isChecked);
  console.log('popup sending data');
});
