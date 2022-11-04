var counter = 0;
var isChecked = "yes";



chrome.runtime.sendMessage({question:"authors"});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
  {
     
    if (request.SendingCounter)
    {
          counter = 0;
          counter = request.SendingCounter;
          console.log('Popup received counter value from Background. Value is: ' + request.SendingCounter);
    }
})
chrome.runtime.sendMessage({question:"isChecked"});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
  {    
    if (request.SendingCounter)
    {
          counter = 0;
          counter = request.SendingCounter;
          console.log('Popup received counter value from Background. Value is: ' + request.SendingCounter);
    }
})

document.body.onload = function() 
{
    let h2 = document.createElement('h2');
    let tbody = document.createElement('tbody');
    let text = document.createTextNode('Authors Blocked');
    let numbers_text = document.createTextNode(counter);

    h2.appendChild(text);
    tbody.appendChild(h2);
    h2 = document.createElement('h2');
    h2.appendChild(numbers_text);
    tbody.appendChild(h2);
    document.getElementById("AuthorsBlocked").appendChild(tbody);
}

// setTimeout(() => {filter();changed(counter)}, 2000);

const checkbox = document.getElementById('btn')

checkbox.addEventListener('click', function() {
    if (isChecked == 'yes') {
    isChecked = "no";
    chrome.runtime.sendMessage({PopupChecked:'no'});
    console.log('no');
    
  } else {
    isChecked = 'yes';
    chrome.runtime.sendMessage({PopupChecked:'yes'});
    console.log('yes');
  }
 
});
