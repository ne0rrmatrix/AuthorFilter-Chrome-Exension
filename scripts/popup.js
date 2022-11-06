var counter = 0;
var isChecked = 'yes';

chrome.runtime.sendMessage({question: 'Counter'}, function(response) 
{
  counter = response.SendingCounter;
  console.log(response.SendingCounter);
  filter();
  changed(response.SendingCounter);
});

function getIsChecked()
{
		chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		console.log('Received ischeck! ' + response.Sendingischeck);	
		ischecked = response.Sendingischeck; 
	});
  console.log(isChecked)
};
getIsChecked();

 function SendStatus(status)
 {
   chrome.runtime.sendMessage({SendingIsChecked: status});
 }     
document.body.onload = function() 
{
  
  radiobtn = document.getElementById("spanner");
  if (isChecked == "yes") radiobtn.checked = true;
  else radiobtn.checked = false;
  //document.getElementById(btn).append.radiobtn.checked
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
    isChecked = 'no';
    SendStatus('no')
  } else 
  {
    isChecked = 'yes';
    SendStatus('yes');
  }
  /*
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
  */
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