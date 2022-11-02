var savedCounter = 0;
var onOff = true;
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
    
    var checked = document.getElementById('switch');
    checked.addEventListener('click', function() {
    var isChecked=document.getElementById("switch").checked;
    console.log(isChecked);
    })
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
    let text = document.createTextNode('Authors Blocked');
    let numbers_text = document.createTextNode(counter);
    h2.appendChild(text);
    tbody.appendChild(h2);
    h2 = document.createElement('h2');
    h2.appendChild(numbers_text);
    tbody.appendChild(h2);
    document.getElementById("AuthorsBlocked").appendChild(tbody);
}   