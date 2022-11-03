var savedCounter = 0;
var isChecked = true;
var SendingFromPopup = chrome.runtime.connect({name: "PopupSendingIsChecked"});

SendingFromPopup.onMessage.addListener(function(msg) 
{
    if (msg.question === "Send me IsChecked")
        {
            SendingFromPopup.postMessage({answer: isChecked});
            console.log("Popup Sent IsChecked!");
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
    
    var checked = document.getElementById('switch');
    checked.addEventListener('click', function() 
    {
        isChecked=document.getElementById("switch").checked;
        SendingFromPopup.postMessage({isCheckedData: "Sending is Checked Data"});
        console.log('popup sending data');
    })
}
  

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