var currrent_url = '';
var span = document.getElementById('btn');

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		setStatus(request); 
    if (request.isCheck) sendResponse({Sendingischeck: span.checked})
	});

document.body.onload = function() 
{
 getData();
}


span.addEventListener('click', function() 
  {
    if (span.checked == false) 
    {
    SendStatus('no')
    } else 
    {
      SendStatus('yes');
    }
  })


async function setStatus(request)
{
  var counter = 0;
  if (request.Sendingischeck) {
    if (request.Sendingischeck == 'no')span.checked = false;
    else if (request.Sendingischeck == 'yes' || typeof request.SendingIsChecked == 'undefined') span.checked = true;
    console.log(request.Sendingischeck);
  }
  else if (request.SendingCounter) {counter = request.SendingCounter; console.log(request.SendingCounter)};
  if (typeof request.SendingCounter != 'undefined') LoadData(counter);
  return true;
}


async function getData()
{
  var counter = 0;
  chrome.runtime.sendMessage({question: 'Counter'}, function(response) 
  {
    setStatus(response);
    console.log(response.SendingCounter);
  });

  chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		console.log('Received ischeck! ' + response.Sendingischeck);	
		setStatus(response);
    console.log(response.SendingIsChecked);
	});
  return true
}


async function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
    return true;
}


async function LoadData(response)
{
  
  filter();
 
  let h2 = document.createElement('h2');
  let tbody = document.createElement('tbody');
  let text = document.createTextNode('Authors Blocked');
  let numbers_text = document.createTextNode(response);

  h2.appendChild(text);
  tbody.appendChild(h2);
  h2 = document.createElement('h2');
  h2.appendChild(numbers_text);
  tbody.appendChild(h2);
  
  document.getElementById("AuthorsBlocked").appendChild(tbody);
  return true;
} 


 function SendStatus(status)
 {
   chrome.runtime.sendMessage({SendingIsChecked: status});
 }     
 

chrome.tabs.onActivated.addListener(function(activeInfo) 
{
    chrome.tabs.get(activeInfo.tabId, function(tab)
    {
        console.log(tab.url);
        currrent_url = tab.url;
        if (!currrent_url.includes('amazon')) 
        {
          LoadData(0);
        }
        else getData();
    });
}); 
  

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
  if (typeof changeInfo.url != 'undefined') 
  {
    console.log(changeInfo.url);
    currrent_url = changeInfo.url;
    if (!currrent_url.includes('amazon')) 
    {
      LoadData(0);
    }
    else getData();    
  };
}); 


document.getElementById('options').addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
