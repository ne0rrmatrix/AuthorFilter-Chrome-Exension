var counter = 0;
var isChecked = 'yes';

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		ischecked = request.ischeckedSending;
		if (request.sendingCounters) counter = request.sendingCounters;
	});


getIsChecked();
getCounters();
document.body.onload = function() 
{
  LoadData();
}

const checkbox = document.getElementById('btn')

checkbox.addEventListener('click', function() {
    if (isChecked == 'yes') {
    isChecked = 'no';
    SendStatus('no')
  } else 
  {
    isChecked = 'yes';
    SendStatus('yes');
  }
})

function getCounters()
{
  chrome.runtime.sendMessage({question: 'Counter'}, function(response) 
  {
    counter = response.SendingCounter;
    console.log(response.SendingCounter);
    filter();
    LoadData(response.SendingCounter);
  });
}
function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
}


function LoadData(counter)
{
  var span = document.getElementById('btn');
  if (isChecked == 'yes')span.checked = true;
  if (isChecked == 'no')span.checked = false;
  
 
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
	});
};



 function SendStatus(status)
 {
   chrome.runtime.sendMessage({SendingIsChecked: status});
 }     
