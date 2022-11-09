// TODO Make function async and add await.
// TODO Fix any spacing and formatting.

var counter = 0;
var isChecked = '';
var span = document.getElementById('btn');
var currrent_url = '';


document.getElementById('options').addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  };
});

span.addEventListener('click', function() 
{
  if (span.checked == false) 
  {
    isChecked = 'no';
  counter = 0;
  SendStatus('no');
  LoadData();
  } else 
  {
    isChecked = 'yes';
    SendStatus('yes');
    getCurrentUrl();
    LoadData();
  };
});



document.body.onload = function() 
{
  getCurrentUrl();
  getIsChecked();
  getCounters();
  LoadData();
};


function getCounters()
{
  chrome.runtime.sendMessage({question: 'Counter'}, function(response) 
  {
     counter = response.SendingCounter;
    LoadData();
  });
};


function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
};


function LoadData()
{
  filter();
  let temp = 0;
  if (currrent_url.includes('amazon')) {temp = counter;};
  if (isChecked == 'yes' && currrent_url.includes('amazon')) {temp = counter};
  if (isChecked == 'no') temp = 0;
  let h2 = document.createElement('h2');
  let tbody = document.createElement('tbody');
  let text = document.createTextNode('Authors Blocked');
  let numbers_text = document.createTextNode(temp);

  h2.appendChild(text);
  tbody.appendChild(h2);
  h2 = document.createElement('h2');
  h2.appendChild(numbers_text);
  tbody.appendChild(h2);
  
  document.getElementById("AuthorsBlocked").appendChild(tbody);
}; 

function getIsChecked()
{
		chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		
    if (response.Sendingischeck== 'yes' || response.Sendingischecked == ''){span.checked = true;}
    else if (response.Sendingischeck == 'no'){ span.checked = false; isChecked = 'no'};
	});
};


function getCurrentUrl()
{
  chrome.runtime.sendMessage({question: "url"},function(response)
  {
    if (response.SendingUrl)
    currrent_url = response.SendingUrl;
  })
};


function SendStatus(status)
{
  chrome.runtime.sendMessage({SendingIsChecked: status});
};