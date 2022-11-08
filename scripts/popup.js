var counter = 0;
var isChecked = '';
var span = document.getElementById('btn');

/*
chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		ischecked = request.ischeckedSending;
		console.log("received ischeck. Value is: " + ischecked);
		if (request.sendingCounters) counter = request.sendingCounters;
	});
*/

document.getElementById('options').addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

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


getIsChecked();
getCounters();

document.body.onload = function() 
{
  LoadData();
}


function getCounters()
{
  chrome.runtime.sendMessage({question: 'Counter'}, function(response) 
  {
    counter = response.SendingCounter;
    console.log(response.SendingCounter);
    LoadData(response.SendingCounter);
  });
}
function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
}


function LoadData()
{
  filter();

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

function getIsChecked()
{
		chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		console.log('Received ischeck! ' + response.Sendingischeck);	
		ischecked = response.Sendingischeck; 
    if (response.Sendingischeck== 'yes')span.checked = true;
    else span.checked = false;
	});
};



 function SendStatus(status)
 {
   chrome.runtime.sendMessage({SendingIsChecked: status});
 }     



/*
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
  */