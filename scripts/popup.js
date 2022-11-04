var counter = 0;
var isChecked = "yes";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
{
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) 
    {
        if ((response.farewell > 0) && (response.farewell != 'undefined') && !chrome.runtime.lastError)
        {
            savedCounter = response.farewell;
            console.log(response.farewell);
            filter();
            changed(savedCounter);
        }
    })
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

const checkbox = document.getElementById('btn')

checkbox.addEventListener('click', function() {
    if (isChecked == 'yes') {
    isChecked = "no";
    chrome.runtime.sendMessage({PopupChecked:'no'});
    console.log('no');
    
  } else 
  {
    isChecked = 'yes';
    chrome.runtime.sendMessage({PopupChecked:'yes'});
    console.log('yes');
  }
 
})

function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
}
function changed(counter)
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